var allCommits;
var allSliderCommits;

var commitsPie;
var commitsData;

var scmCompany;
var scmRepo;
var scmCommit;

var table;
var tableRepo;
var tableOrg;
var tableAuth;
var repoDim;
var repoGrp;
var orgDim;
var orgGrp;
var authDim;
var authGrp;
var repo = [];
var org = [];
var auth = [];

var companies=[];
var companiesLook={}
companiesLook["array"]=[]
var repos=[]
var users=[]

var repoFilters=[]
var deveFilters=[]
var compFilters=[]
$(document).ready(function(){

    /*************** Download of JSON ***************/

    $.when(

        $.getJSON('json/scm-companies.json', function (d) {
            scmCompany = d;
            d.values.forEach(function(element){
                companiesLook["array"].push(element[1])
                companiesLook[element[0]]=element[1]
            })
        }),

        $.getJSON('json/scm-repos.json', function (d) {
            scmRepo = d;
            d.values.forEach(function(element){
                repos.push(element[1])
            })
        }),

        $.getJSON('json/scm-commits-distinct.json', function (d) {
            scmCommit = d;
        })

        
    ).done(function(){

        /*************** General Data ***************/
        commitsData = dcFormat(scmCommit);
        ndx = crossfilter(commitsData);
        all = ndx.groupAll();
        /*************** Time format ***************/

        var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');

        commitsData.forEach(function (element) {
            element.date = dateFormat.parse(element.date);
            element.month = d3.time.month(element.date);
        });

        /*************** Pie charts ***************/

        
        Pies()

        /*************** Time Chart ***************/

        Time()
    

        /*************** Table Chart ***************/
		repo = [];
		repoDim = ndx.dimension(function (d) {
			if (repo.indexOf(d.repo) == -1) {
				repo.push(d.repo);
			}
			var i = repo.indexOf(d.repo);
		    return repo[i];
		});
		repoGrp = repoDim.group();

		org = [];
		orgDim = ndx.dimension(function (d) {
			if (org.indexOf(d.company) == -1) {
				org.push(d.company);
			}
			var i = org.indexOf(d.company);
		    return org[i];
		});
		orgGrp = orgDim.group();

		auth = [];
		authDim = ndx.dimension(function (d) {
			if (auth.indexOf(d.name) == -1) {
				auth.push(d.name);
			}
			var i = auth.indexOf(d.name);
		    return auth[i];
		});
		authGrp = authDim.group();

        Tables()


        /***************Count****************/

        dc.dataCount('.dc-data-count')
            .dimension(ndx)
            .group(all)
            .html({
                some:'<strong>%filter-count</strong> commits out of <strong>%total-count</strong>'+
                ' | <button onclick="Reset()">Reset All Filters</button>',
                all:'<strong>%filter-count</strong> commits out of <strong>%total-count</strong>'+
                ' | <button onclick="Reset()">Reset All Filters</button>'
            });

        
        dc.renderAll();


        /**************** Redraw URL ************/

        readURL()

        /****************Inputs****************/
        $(':input:not(textarea)').keypress(function(event) { 
            return event.keyCode != 13;
        });

        $(".companiesInput").autocomplete({
            source:companiesLook["array"], 
            minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $(".developersInput").autocomplete({
            source:users, 
            minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $(".reposInput").autocomplete({
            source:repos, 
            minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $('.companiesInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var company=this.value;
                if(company!=""){
                    this.value=""
                    compPie.filter(company)
                    dc.redrawAll();
                }
            }

        });

        $('.developersInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var deve=this.value;
                if(deve!=""){
                    this.value=""
                    commitsNamePie.filter(deve)
                    dc.redrawAll();
                }
            }

        });

        $('.reposInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var repo=this.value;
                if(repo!=""){
                    this.value=""
                    repoPie.filter(repo)
                    dc.redrawAll();
                }
            }

        });

    })

});

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

/************* Format **************/

function dcFormat(d){
    var array = [];
    var names = d['names'];
    var values = d['values'];
    $.each(values, function(index, val){
        var dic = {};
        dic[names[0]] = val[0];
        dic[names[1]] = val[1];
        dic[names[2]] = val[2];
        dic[names[3]] = val[3];
        dic[names[4]] = val[4];
        dic[names[5]] = val[5];
        dic[names[6]] = val[6];
        dic[names[7]] = val[7];
        dic['company'] = companiesLook[val[4]];
        dic['repo'] = scmRepo['values'][val[5]-1][1];
        array.push(dic);
    });
    return array;
}

/************** Reset **************/

function Reset(){
	dc.filterAll();
	var order = -1;
	var order2 = -1;
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
	var orgOrderKey = -1;
	var orgOrderValue = -1;
	tableOrg
		.dimension(orgDim)
		.group(function (d) {return '';})
		.size(7)
		.columns([
			{
				label: 'Organizations',
				format: function(d){
					orgOrderKey++;
					return orgGrp.top(Infinity)[orgOrderKey].key;
				}
			},
			{
				label: 'Commits',
				format: function (d) {
					orgOrderValue++;
					return orgGrp.top(Infinity)[orgOrderValue].value;
				}
			}
		]);
	var authOrderKey = -1;
	var authOrderValue = -1;
	tableAuth
		.dimension(orgDim)
		.group(function (d) {return '';})
		.size(7)
		.columns([
			{
				label: 'Authors',
				format: function(d){
					authOrderKey++;
					return authGrp.top(Infinity)[authOrderKey].key;
				}
			},
			{
				label: 'Commits',
				format: function (d) {
					authOrderValue++;
					return authGrp.top(Infinity)[authOrderValue].value;
				}
			}
		]);
	table.size(7);
    dc.redrawAll();
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
    return '?'+repoStrUrl+'&'+compStrUrl+'&'+deveStrUrl
}

/********************** Read generated URL ****************************/
function readURL(){
    var arrayStrURL=document.URL.split("?")
    if(arrayStrURL.length!=1){
        var repoStrUrl=arrayStrURL[1].split("repo=")[1].split("&")[0].split("+")
        var compStrUrl=arrayStrURL[1].split("comp=")[1].split("&")[0].split("+")
        var deveStrUrl=arrayStrURL[1].split("deve=")[1].split("&")[0].split("+")
        
        if(repoStrUrl[0]!=""){
            repoStrUrl.forEach(function(element){
              repoPie.filter(unescape(element))
            })
        }

        if(compStrUrl[0]!=""){
            compStrUrl.forEach(function(element){
              compPie.filter(unescape(element))
            })
        }

        if(deveStrUrl[0]!=""){
           deveStrUrl.forEach(function(element){
            commitsNamePie.filter(unescape(element))
            }) 
        }
        
        dc.redrawAll()
    }
}