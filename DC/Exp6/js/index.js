
var org_names = {};
var dc_commits = [];
var dc_commits_month = [];
var auth_names = {};
var repo_names = {};

var getting_commits =  $.getJSON('json/scm-commits.json');
var getting_orgs = $.getJSON('json/scm-orgs.json');
var getting_auths = $.getJSON('json/scm-persons.json');
var getting_repos = $.getJSON('json/scm-repos.json');

function load_commits (commits, orgs, repos, auths) {
    orgs.values.forEach(function (value) {
	    org_names[value[0]] = value[1];
    });
    repos.values.forEach(function (value) {
        repo_names[value[0]] = value[1];
    });
    auths.values.forEach(function (value) {
        auth_names[value[2]] = value[1];
    });
    commits.values.forEach(function (value) {
	var record = {}
	commits.names.forEach(function (name, index) {
	    if (name == "date") {
		var date = new Date(value[index]*1000);
		    record[name] = date;
		    record.month = new Date(date.getFullYear(), date.getMonth(), 1);
		    record.hour = date.getHours();
	    } else if (name == "org") {
		    record[name] = value[index];
		    record.org_name = org_names[value[index]];
        } else if (name == 'repo') {
            record[name] = value[index];
            record.repo_name = repo_names[value[index]];
        } else if (name == 'author') {
            record[name] = value[index];
            record.auth_name = auth_names[value[index]];
	    } else {
		record[name] = value[index];
	    }
	});
	dc_commits.push(record);
    });
    console.log (dc_commits.length);
};


function draw_charts () {
    console.log ("Drawing commits");
    var ndx = crossfilter(dc_commits);
    var org_dim = ndx.dimension(function(d){
        return d.org_name;
    });
    var org_grp = org_dim.group();
    
    var org_chart = dc.pieChart('#compPieChart');
    org_chart.width(350)
	.height(250)
	.transitionDuration(1000)
	.dimension(org_dim)
	.group(org_grp)
	.cx(225)
	.cap(10);

    var repo_dim = ndx.dimension(function(d){
        return d.repo_name;
    });
    var repo_grp = repo_dim.group();
    
    var repo_chart = dc.pieChart('#repoPieChart');
    repo_chart
        .width(350)
	    .height(250)
	    .transitionDuration(1000)
	    .dimension(repo_dim)
	    .group(repo_grp)
	    .cx(225)
	    .cap(10);

    var auth_dim = ndx.dimension(function(d){
        return d.auth_name;
    });
    var auth_grp = auth_dim.group();
    var auth_chart = dc.pieChart('#authPieChart');
    auth_chart
        .width(350)
	    .height(250)
	    .transitionDuration(1000)
	    .dimension(auth_dim)
	    .group(auth_grp)
	    .cx(225)
	    .cap(10);
    console.log ("Organizations chart done");

    var months_dim = ndx.dimension(function(d){
        return d.month;
    });

    var commmits_month = months_dim.group();
    var date_min = months_dim.bottom(1)[0].month;
    var date_max = months_dim.top(1)[0].month;
    var commits_chart = dc.barChart('#commitsChart');
    commits_chart
    	.width(1000)
	    .height(250)
	    .transitionDuration(1000)
	    .margins({top: 30, right: 50, bottom: 25, left: 50})
	    .dimension(months_dim)
	    .group(commmits_month)
	    .x(d3.time.scale().domain([date_min,date_max]))
	    .xUnits(d3.time.months)
	    .elasticY(true)
	    .xAxisLabel("Year");
    console.log ("Commits per month chart done");

    var hours_dim = ndx.dimension(function(d){
        return d.hour;
    });
    var commits_hour = hours_dim.group();
    var hour_min = 0;
    var hour_max = 23;
    var hours_chart = dc.barChart('#commitsSliderChart');
console.log('slider')
    hours_chart
    	.width(600)
    	.height(250)
    	.transitionDuration(1000)
    	.margins({top: 30, right: 50, bottom: 25, left: 50})
    	.dimension(hours_dim)
    	.group(commits_hour)
    	.x(d3.scale.linear().domain([hour_min,hour_max]))
	    .elasticY(true)
//	.xUnits(dc.units.integers)
	    .xAxisLabel("Hour");
    //hours_chart.xAxis().tickValues([0, 5, 11, 17, 23]);
    console.log ("Commits per hour chart done");
    
    dc.renderAll();
    console.log ("Commits drawn");
};

$(document).ready(function(){
    $.when(getting_commits, getting_orgs, getting_repos, getting_auths).done(function (commits, orgs, repos, auths) {
	// Element 0 of the array contains the data
console.log(repos)
console.log(auths)
	    load_commits(commits[0], orgs[0], repos[0], auths[0]);
	    draw_charts();
console.log('fin')
    })
});
