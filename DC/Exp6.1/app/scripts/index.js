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
