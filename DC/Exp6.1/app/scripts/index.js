var org_names = {};
var dc_commits = [];
var dc_commits_month = [];
var auth_names = {};
var repo_names = {};
var bots = {};
var messages_text = {};
var bot_dim;

var org_chart;
var repo_chart;
var auth_chart;

var repo_array = [];
var auth_array = [];
var org_array = [];

var repoFilters = [];
var deveFilters = [];
var compFilters = [];
var projFilters = [];
var entriesdb=[];

var getting_commits =  $.getJSON('json/scm-commits.json');
var getting_orgs = $.getJSON('json/scm-orgs.json');
var getting_auths = $.getJSON('json/scm-persons.json');
var getting_repos = $.getJSON('json/scm-repos.json');
var getting_messages = $.getJSON('json/scm-messages.json');

var pieClickEvent = new Event('table');
var timeRangeEvent = new Event('time');

function load_commits (commits, orgs, repos, auths) {
    orgs.values.forEach(function (value) {
	    org_names[value[0]] = value[1];
        org_array.push(value[1]);
        entriesdb.push(value[1]);
    });
    repos.values.forEach(function (value) {
        repo_names[value[0]] = value[1];
        repo_array.push(value[1]);
        entriesdb.push(value[1]);
    });
    auths.values.forEach(function (value) {
        auth_names[value[3]] = value[1];
        bots[value[1]] = value[2];
        auth_array.push(value[1]);
        entriesdb.push(value[1]);
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
                record.bot = bots[record.auth_name];
	        } else if (name == 'tz') {
                record[name] = value[index];
            } else {
        		record[name] = value[index];
	        }
	    });
	    dc_commits.push(record);
    });
};

function load_messages (messages) {
    messages.values.forEach(function (value) {
        messages_text[value[0]] = value[1];
    });
    dc_commits.forEach(function (d) {
        d.message = messages_text[d.id];
    });
}

function draw_messages_table (ndx) {
    var dateDim = ndx.dimension(function (d) {
        return d.date;
    });
    table = dc.dataTable('#table', 'commitsTable');
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
                label: 'Message',
                format: function(d) {
                    return d.message;
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

    dc.renderAll('commitsTable');
}

function draw_charts () {
    var ndx = crossfilter(dc_commits);
    var all = ndx.groupAll();

    bot_dim = ndx.dimension(function(d){
        return d.bot;
    });
    var org_dim = ndx.dimension(function(d){
        return d.org_name;
    });
    var org_grp = org_dim.group();
    
    org_chart = dc.pieChart('#compPieChart', 'other');
    org_chart.width(450)
	    .height(300)
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

    org_chart.on("filtered", function(chart,filter) {
        var i=0;
        if(filter==null){
            compFilters=[]
        }else{
            $("#filterComp").empty()
            if(filter.constructor==Array){
                if(compFilters.indexOf("Others ("+filter[0].length+")")==-1){
                    compFilters.push("Others ("+filter[0].length+")")
                }else{
                    compFilters.splice(compFilters.indexOf("Others ("+filter[0].length+")"),1)
                }
            }else{
                if(filter!="Others"){
                    if(compFilters.indexOf(filter)==-1){
                        compFilters.push(filter)
                    }else{
                        compFilters.splice(compFilters.indexOf(filter),1)
                    }
                }
            }
            for(x=0;x<=5;x++){
                if(compFilters[x]!=undefined){
                    $("#filterComp").append('<span class="label label-default" id="filter-'+compFilters[x].replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+compFilters[x]+' </span>')
                }
            }
            if(compFilters.length>5){
                $("#filterComp").append('<span class="label label-default" id="filter-y"> '+(compFilters.length-5)+' More </span>')
            }
        }
        window.history.replaceState("object or string", "Title", writeURL());
    });

    var repo_dim = ndx.dimension(function(d){
        return d.repo_name;
    });
    var repo_grp = repo_dim.group();
    
    repo_chart = dc.pieChart('#repoPieChart', 'other');
    repo_chart
        .width(450)
	    .height(300)
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

    repo_chart.on("filtered", function(chart,filter) {
        var i=0;
        if(filter==null){
            repoFilters=[]
        }else{
            $("#filterRepo").empty()
            if(filter.constructor==Array){
                if(repoFilters.indexOf("Others ("+filter[0].length+")")==-1){
                    repoFilters.push("Others ("+filter[0].length+")")
                }else{
                    repoFilters.splice(repoFilters.indexOf("Others ("+filter[0].length+")"),1)
                }
            }else{
                if(filter!="Others"){
                    if(repoFilters.indexOf(filter)==-1){
                        repoFilters.push(filter)
                    }else{
                        repoFilters.splice(repoFilters.indexOf(filter),1)
                    }
                }
            }
            for(x=0;x<=5;x++){
                if(repoFilters[x]!=undefined){
                    $("#filterRepo").append('<span class="label label-default" id="filter-'+repoFilters[x].replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+repoFilters[x]+' </span>')
                }
            }
            if(repoFilters.length>5){
                $("#filterRepo").append('<span class="label label-default" id="filter-y"> '+(repoFilters.length-5)+' More </span>')
            }
        }
        window.history.replaceState("object or string", "Title", writeURL());
    });

    var auth_dim = ndx.dimension(function(d){
        return d.auth_name;
    });
    var auth_grp = auth_dim.group();
    auth_chart = dc.pieChart('#authPieChart', 'other');
    auth_chart
        .width(450)
	    .height(300)
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

    auth_chart.on("filtered", function(chart,filter) {
        var i=0;
        if(filter==null){
            deveFilters=[]
        }else{
            $("#filterDeve").empty()
            if(filter.constructor==Array){
                if(deveFilters.indexOf("Others ("+filter[0].length+")")==-1){
                    deveFilters.push("Others ("+filter[0].length+")")
                }else{
                    deveFilters.splice(deveFilters.indexOf("Others ("+filter[0].length+")"),1)
                }
            }else{
                if(filter!="Others"){
                    if(deveFilters.indexOf(filter)==-1){
                        deveFilters.push(filter)
                    }else{
                        deveFilters.splice(deveFilters.indexOf(filter),1)
                    }
                }
            }
            for(x=0;x<=5;x++){
                if(deveFilters[x]!=undefined){
                    $("#filterDeve").append('<span class="label label-default" id="filter-'+deveFilters[x].replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+deveFilters[x]+' </span>')
                }
            }
            if(deveFilters.length>5){
                $("#filterDeve").append('<span class="label label-default" id="filter-y"> '+(deveFilters.length-5)+' More </span>')
            }
        }
        window.history.replaceState("object or string", "Title", writeURL());
    });
    var months_dim = ndx.dimension(function(d){
        return d.month;
    });

    var commmits_month = months_dim.group();
    var date_min = months_dim.bottom(1)[0].month;
    var date_max = months_dim.top(1)[0].month;
    var commits_chart = dc.barChart('#commitsChart', 'other');
    commits_chart
    	.width(1100)
	    .height(300)
	    .transitionDuration(1000)
	    .margins({top: 10, right: 50, bottom: 25, left: 50})
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
    var hours_chart = dc.barChart('#commitsHoursChart', 'other');
    hours_chart
    	.width(650)
    	.height(150)
    	.transitionDuration(1000)
    	.margins({top: 10, right: 10, bottom: 25, left: 50})
    	.dimension(hours_dim)
    	.group(commits_hour)
    	.x(d3.scale.linear().domain([hour_min,hour_max]))
	    .elasticY(true)
	    .xAxisLabel("Hour");
    hours_chart.on("filtered", function(chart,filter) {
		document.dispatchEvent(timeRangeEvent);
    });
    var tz_dim = ndx.dimension(function(d){
        return d.tz;
    });
    var commits_tz = tz_dim.group();
    var tz_min = -12;
    var tz_max = 12;
    var tz_chart = dc.barChart('#commitsTZChart', 'other');
    tz_chart
    	.width(650)
    	.height(150)
    	.transitionDuration(1000)
    	.margins({top: 10, right: 10, bottom: 25, left: 50})
    	.dimension(tz_dim)
    	.group(commits_tz)
    	.x(d3.scale.linear().domain([tz_min,tz_max]))
	    .elasticY(true)
	    .xAxisLabel("Time Zone");
    tz_chart.on("filtered", function(chart,filter) {
		document.dispatchEvent(timeRangeEvent);
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
    tableRepo = dc.dataTable('#tableRepo', 'table');
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
        table.selectAll(".dc-table-column._0").on("click", function(d){
            repo_chart.filter($(this).html())
            document.dispatchEvent(pieClickEvent);
        });
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
    tableOrg = dc.dataTable('#tableOrg', 'table');
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
        table.selectAll(".dc-table-column._0").on("click", function(d){
            org_chart.filter($(this).html())
            document.dispatchEvent(pieClickEvent);
        });
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
    tableAuth = dc.dataTable('#tableAuth', 'table');
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
        table.selectAll(".dc-table-column._0").on("click", function(d){
            auth_chart.filter($(this).html())
            document.dispatchEvent(pieClickEvent);
        });
    });

    dc.dataCount('.dc-data-count', 'other')
        .dimension(ndx)
        .group(all)
        .html({
            some:'<strong>%filter-count</strong> commits out of <strong>%total-count</strong>'+
            ' <button type="button" class="btn btn-primary btn-sm" onclick="reset()">Reset all filters</button>',
            all:'<strong>%filter-count</strong> commits out of <strong>%total-count</strong>'+
            ' <button type="button" class="btn btn-primary btn-sm" onclick="reset()">Reset all filters</button>'
        });


    dc.renderAll('other');
    dc.renderAll('table');
    return ndx;
};

document.addEventListener('table', function (e) {
	tableUpdate('click');
	dc.redrawAll('other');
    dc.redrawAll('table');
    dc.redrawAll('commitsTable')
}, false);
document.addEventListener('time', function (e) {
	tableUpdate('time');
	dc.redrawAll('other');
    dc.redrawAll('table');
    dc.redrawAll('commitsTable')
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
    if (type == 'more') {
        tableRepo.size(tableRepo.size()+4);
		tableOrg.size(tableOrg.size()+4);
		tableAuth.size(tableAuth.size()+4);
    }
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

$('#commitsTableMore').on('click', function () {
    table.size(table.size()+4);
    dc.redrawAll('commitsTable');
});
$('#tablesMore').on('click', function() {
    tableUpdate('more');
    dc.redrawAll('table');
});
$(".checkbox").change(function() {
    if(this.checked) {
        bot_dim.filterAll();
    } else {
        bot_dim.filter(0);
    }
    dc.redrawAll('commitsTable');
    dc.redrawAll('other');
    dc.redrawAll('table');
});

String.prototype.replaceAll = function(str1, str2, ignore){
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}
/**************** Generate URL by filters *****************/
function writeURL(){
    var repoStrUrl='repo='
    repoFilters.forEach(function(element){
        if(repoFilters.indexOf(element)==repoFilters.length-1){
            repoStrUrl+=element
        }else{
            repoStrUrl+=element+'+'
        }
    })
    var compStrUrl='comp='
    compFilters.forEach(function(element){
        if(compFilters.indexOf(element)==compFilters.length-1){
            compStrUrl+=element
        }else{
            compStrUrl+=element+'+'
        }
    })
    var deveStrUrl='deve='
    deveFilters.forEach(function(element){
        if(deveFilters.indexOf(element)==deveFilters.length-1){
            deveStrUrl+=element
        }else{
            deveStrUrl+=element+'+'
        }
    })
    var projStrUrl='proj='
/*    projFilters.forEach(function(element){
        if(projFilters.indexOf(element)==projFilters.length-1){
            projStrUrl+=element
        }else{
            projStrUrl+=element+'+'
        }
    })*/
    return '?'+projStrUrl+'&'+repoStrUrl+'&'+deveStrUrl+'&'+compStrUrl
}
/********************** Read generated URL ****************************/
function readURL(){
    var arrayStrURL=document.URL.split("?")
    if(arrayStrURL.length != 1){
        var reset=false;
        var repoStrUrl=arrayStrURL[1].split("repo=")[1].split("&")[0].split("+")
        var compStrUrl=arrayStrURL[1].split("comp=")[1].split("&")[0].split("+")
        var deveStrUrl=arrayStrURL[1].split("deve=")[1].split("&")[0].split("+")
    //    var projStrUrl=arrayStrURL[1].split("proj=")[1].split("&")[0].split("+")
        if(repoStrUrl[0]!=""){
            repoStrUrl.forEach(function(element){
                if(element.split("Others%20").length==2){
                    reset=true;
                }else{
                    repo_chart.filter(unescape(element))
                }
            })
        }
        if(compStrUrl[0]!=""){
            compStrUrl.forEach(function(element){
                if(element.split("Others%20").length==2){
                    reset=true;
                }else{
                    org_chart.filter(unescape(element))
                }   
            })
        }
        if(deveStrUrl[0]!=""){
            deveStrUrl.forEach(function(element){
                if(element.split("Others%20").length==2){
                    reset=true;
                }else{
                    auth_chart.filter(unescape(element))
                }
            })
        }
    /*    if(projStrUrl[0]!=""){
            dimProj.filter(unescape(projStrUrl[0]))
            $("#projectForm").val(unescape(projStrUrl[0]))
        }*/
        tableUpdate();
        if(reset){
            alert("We are sorry. The filter Others does not work now. We are working to solve it.");
            reset();
        }
        dc.redrawAll('commitsTable');
        dc.redrawAll('other');
        dc.redrawAll('table');
    }
}

$("#searchForm").autocomplete({
    source: entriesdb,
    minLength: 0
}).on('focus', function() { $(this).keydown(); });

$('#searchForm').keyup(function(e){
    if(e.keyCode == 13){
        var entrie = this.value;
        if(entrie != ""){
            if(org_array.indexOf(entrie) != -1){
                this.value = ""
                org_chart.filter(entrie)
                document.dispatchEvent(pieClickEvent);
            }else if(auth_array.indexOf(entrie) != -1){
                this.value = ""
                auth_chart.filter(entrie)
                document.dispatchEvent(pieClickEvent);
            }else if(repo_array.indexOf(entrie) != -1){
                this.value = ""
                repo_chart.filter(entrie)
                document.dispatchEvent(pieClickEvent);
            }else{
                alert('No exist. Try again')
            }
        }
    }
});

/*$("#projectForm").change(function(e){
    if($(this).val() == "All"){
        dimProj.filterAll()
        projFilters = []
    }else{
        dimProj.filter($(this).val())
        projFilters[0] = ($(this).val())
    }
    dc.redrawAll('time');
    dc.redrawAll('other');
    tableUpdate('click');
    dc.redrawAll('tables');
    dc.redrawAll('commitsTable');
    window.history.replaceState("object or string", "Title", writeURL());
});
*/
function reset(){
    $.when(
        bot_dim.filterAll(),
        dc.filterAll('other'),
        dc.redrawAll('table'),
        dc.filterAll('commitsTable')
    ).done(function(){
        document.getElementById("checkbox").checked = true;
        tableUpdate('reset');
        dc.redrawAll('commitsTable');
        dc.redrawAll('other');
        dc.redrawAll('table');
        $("#filterComp").empty()
        $("#filterDeve").empty()
        $("#filterRepo").empty()
    });
}
$(document).ready(function(){
    $.when(getting_commits, getting_orgs, getting_repos, getting_auths).done(function (commits, orgs, repos, auths) {
	// Element 0 of the array contains the data
	    load_commits(commits[0], orgs[0], repos[0], auths[0]);
	    var ndx = draw_charts();
        $.when(getting_messages).done(function (messages) {
            load_messages(messages);
            draw_messages_table(ndx);
        });
        readURL();
        $(':input:not(textarea)').keypress(function(event) {
            return event.keyCode != 13;
        });
    })
});
