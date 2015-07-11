
var org_names = {};
var dc_commits = [];
var dc_commits_month = [];
var auth_names = {};
var repo_names = {};

var getting_commits =  $.getJSON('json/scm-commits.json');
var getting_orgs = $.getJSON('json/scm-orgs.json');
var getting_auths = $.getJSON('json/scm-persons.json');
var getting_repos = $.getJSON('json/scm-repos.json');

var pieClickEvent = new Event('table');
var timeRangeEvent = new Event('time');

function load_commits (commits, orgs, repos, auths) {
    orgs.values.forEach(function (value) {
	    org_names[value[0]] = value[1];
    });
    repos.values.forEach(function (value) {
        repo_names[value[0]] = value[1];
    });
    auths.values.forEach(function (value) {
        auth_names[value[3]] = value[1];
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
	        } else if (name == 'tz') {
                record[name] = value[index];
            } else {
        		record[name] = value[index];
	        }
	    });
	    dc_commits.push(record);
    });
};


function draw_charts () {
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
	    .cap(10)
        .ordering(function (d) { return -d.value; });

    org_chart.on('renderlet', function(chart) {
	  chart.selectAll('.pie-slice').on("click", function(d) {
    	document.dispatchEvent(pieClickEvent);
	  });
	});
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
	    .cap(10)
        .ordering(function (d) { return -d.value; });

    repo_chart.on('renderlet', function(chart) {
	  chart.selectAll('.pie-slice').on("click", function(d) {
    	document.dispatchEvent(pieClickEvent);
	  });
	});
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
	    .cap(10)
        .ordering(function (d) { return -d.value; });

    auth_chart.on('renderlet', function(chart) {
	  chart.selectAll('.pie-slice').on("click", function(d) {
    	document.dispatchEvent(pieClickEvent);
	  });
	});

    var months_dim = ndx.dimension(function(d){
        return d.month;
    });

    var commmits_month = months_dim.group();
    var date_min = months_dim.bottom(1)[0].month;
    var date_max = months_dim.top(1)[0].month;
    var commits_chart = dc.barChart('#commitsChart');
    commits_chart
    	.width(1000)
	    .height(360)
	    .transitionDuration(1000)
	    .margins({top: 30, right: 50, bottom: 25, left: 50})
	    .dimension(months_dim)
	    .group(commmits_month)
	    .x(d3.time.scale().domain([date_min,date_max]))
	    .xUnits(d3.time.months)
	    .elasticY(true)
	    .xAxisLabel("Year");

    commits_chart.on("filtered", function(chart,filter) {
		document.dispatchEvent(timeRangeEvent);
    });

    var hours_dim = ndx.dimension(function(d){
        return d.hour;
    });
    var commits_hour = hours_dim.group();
    var hour_min = 0;
    var hour_max = 23;
    var hours_chart = dc.barChart('#commitsHoursChart');
    hours_chart
    	.width(650)
    	.height(180)
    	.transitionDuration(1000)
    	.margins({top: 30, right: 50, bottom: 25, left: 50})
    	.dimension(hours_dim)
    	.group(commits_hour)
    	.x(d3.scale.linear().domain([hour_min,hour_max]))
	    .elasticY(true)
//	.xUnits(dc.units.integers)
	    .xAxisLabel("Hour");
    //hours_chart.xAxis().tickValues([0, 5, 11, 17, 23]);
    hours_chart.on("filtered", function(chart,filter) {
		document.dispatchEvent(timeRangeEvent);
    });
    var tz_dim = ndx.dimension(function(d){
        return d.tz;
    });
    var commits_tz = tz_dim.group();
    var tz_min = -12;
    var tz_max = 12;
    var tz_chart = dc.barChart('#commitsTZChart');
    tz_chart
    	.width(650)
    	.height(180)
    	.transitionDuration(1000)
    	.margins({top: 30, right: 50, bottom: 25, left: 50})
    	.dimension(tz_dim)
    	.group(commits_tz)
    	.x(d3.scale.linear().domain([tz_min,tz_max]))
	    .elasticY(true)
	    .xAxisLabel("Time Zone");
    tz_chart.on("filtered", function(chart,filter) {
		document.dispatchEvent(timeRangeEvent);
    });
    var dateDim = ndx.dimension(function (d) {
        return d.date;
    });
    table = dc.dataTable('#table');
    table
        .dimension(dateDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            {
	            label: 'Date',
                format: function(d){
                    return d.date; 
                }
            },
            {
                label: 'Developer',
                format: function(d) {
                    return d.auth_name;
                }
            },
			{
				label: 'Organization',
				format: function(d) {
					return d.org_name;
				}
			},
			{
				label: 'Repository',
				format: function(d) {
					return d.repo_name;
				}
			},
            {
                label: 'TZ',
                format: function(d) {
                    return d.tz;
                }
            }
        ])
        .sortBy(function (d) {
            return d.date;
        })
        .order(d3.descending);

    table.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
    });

    repo = [];
	repoDim = ndx.dimension(function (d) {
		if (repo.indexOf(d.repo_name) == -1) {
			repo.push(d.repo_name);
		}
		var i = repo.indexOf(d.repo_name);
	    return repo[i];
	});
	repoGrp = repoDim.group();
    var order = -1;
    var order2 = -1;
    tableRepo = dc.dataTable('#tableRepo');
    tableRepo
        .dimension(repoDim)
        .group(function (d) {return "";})
        .size(7)
        .columns([
            {
            	label: 'Repositories',
                format: function(d){
				    order++;
				    return repoGrp.top(Infinity)[order].key;
                }
            },
            {
            	label: 'Commits',
                format: function(d){
				    order2++;
				    return repoGrp.top(Infinity)[order2].value;
                }
            }
        ]);

    tableRepo.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
    });

    org = [];
	orgDim = ndx.dimension(function (d) {
		if (org.indexOf(d.org_name) == -1) {
			org.push(d.org_name);
		}
		var i = org.indexOf(d.org_name);
	    return org[i];
	});
	orgGrp = orgDim.group();
    tableOrg = dc.dataTable('#tableOrg');
    var orderOrgKey = -1;
    var orderOrgVal = -1;
    tableOrg
        .dimension(orgDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            {
            label: 'Organizations',
                format: function(d){
                    orderOrgKey++;
				    return orgGrp.top(Infinity)[orderOrgKey].key;
                }
            },
            {
                label: 'Commits',
                format: function (d) {
                    orderOrgVal++;
				    return orgGrp.top(Infinity)[orderOrgVal].value;
                }
            }
        ]);
        
    tableOrg.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
    });

    auth = [];
	authDim = ndx.dimension(function (d) {
		if (auth.indexOf(d.auth_name) == -1) {
			auth.push(d.auth_name);
		}
		var i = auth.indexOf(d.auth_name);
	    return auth[i];
	});
	authGrp = authDim.group();
    tableAuth = dc.dataTable('#tableAuth');
    var authOrderKey = -1;
	var authOrderVal = -1;

    tableAuth
        .dimension(authDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            {
            label: 'Developers',
                format: function(d){
                    authOrderKey++;
					return authGrp.top(Infinity)[authOrderKey].key;
                }
            },
            {
                label: 'Commits',
                format: function (d) {
                    authOrderVal++;
					return authGrp.top(Infinity)[authOrderVal].value;
                }
            }
        ]);
        
    tableAuth.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
    });

    dc.renderAll();
};

document.addEventListener('table', function (e) {
	tableUpdate('click');
	dc.redrawAll();
}, false);
document.addEventListener('time', function (e) {
	tableUpdate('time');
	dc.redrawAll();
}, false);
function tableUpdate(type) {
/*	if (type == 'reset'){
		table.size(sizeTableInit);
		tableRepo.size(sizeTableInit);
		tableOrg.size(sizeTableInit);
		tableAuth.size(sizeTableInit);
	} else if ((type == 'click') || (type == 'time')) {
        var numero = $('.dc-data-count.dc-chart').html().split('<strong>')[1].split('</strong>')[0];
		var total = parseInt(numero);
		if (numero.split(',')[1] != undefined){
			total = parseInt(numero.split(',')[0]+numero.split(',')[1]);
		}
        var sizeRepo = tableRepo.size();
        var sizeOrg = tableOrg.size();
        var sizeAuth = tableAuth.size();
        if (sizeRepo > total) {
            tableRepo.size(total);
        }
        if (sizeOrg > total) {
            tableOrg.size(total);
        }
        if (sizeAuth > total) {
            tableAuth.size(total);
            table.size(total);
        }
    }*/
    table.size(7);
	tableRepo.size(7);
	tableOrg.size(7);
	tableAuth.size(7);
	var order = -1;
	var order2 = -1;
	tableRepo
        .columns([
            {
            	label: 'Repositories',
                format: function(d){
					order++;
					if (order > tableRepo.size()-1){
						order = 0;
					}
					return repoGrp.top(Infinity)[order].key;
                }
            },
            {
            	label: 'Commits',
                format: function(d){
					order2++;
					if (order2 > tableRepo.size()-1){
						order2 = 0;
					}
					return repoGrp.top(Infinity)[order2].value;
                }
            }
        ]);
	var orgOrderKey = -1;
	var orgOrderValue = -1;
	tableOrg
		.columns([
			{
				label: 'Organizations',
				format: function(d){
					orgOrderKey++;
					if (orgOrderKey > tableOrg.size()-1){
						orgOrderKey = 0;
					}
					return orgGrp.top(Infinity)[orgOrderKey].key;
				}
			},
			{
				label: 'Commits',
				format: function (d) {
					orgOrderValue++;
					if (orgOrderValue > tableOrg.size()-1){
						orgOrderValue = 0;
					}
					return orgGrp.top(Infinity)[orgOrderValue].value;
				}
			}
		]);
	var authOrderKey = -1;
    var authOrderValue = -1;
    tableAuth
        .columns([
            {
                label: 'Authors',
                format: function(d){
                    authOrderKey++;
					if (authOrderKey > tableAuth.size()-1){
						authOrderKey = 0;
					}
                    return authGrp.top(Infinity)[authOrderKey].key;
                }
            },
            {
                label: 'Commits',
                format: function (d) {
                    authOrderValue++;
					if (authOrderValue > tableAuth.size()-1){
						authOrderValue = 0;
					}
                    return authGrp.top(Infinity)[authOrderValue].value;
                }
            }
        ]);
}
$(document).ready(function(){
    $.when(getting_commits, getting_orgs, getting_repos, getting_auths).done(function (commits, orgs, repos, auths) {
	// Element 0 of the array contains the data
	    load_commits(commits[0], orgs[0], repos[0], auths[0]);
	    draw_charts();
    })
});
