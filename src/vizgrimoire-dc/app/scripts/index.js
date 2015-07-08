var allCommits;
var allSliderCommits;

var commitsPie;
var commitsData;

var scmCompany;
var scmRepo;
var scmCommit;
var scmProj;

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
var sizeTableInit;
var developDim;
var companies=[];
var companiesLook={}
companiesLook["array"]=[]
var repos=[]
var users=[]
var proj=[]

var repoFilters=[]
var deveFilters=[]
var compFilters=[]
var projFilters=[]

var dimProj;

var pieClickEvent = new Event('table');
var timeRangeEvent = new Event('time');
$(document).ready(function(){



    /*************** Download of JSON ***************/

    $.when(

        $.getJSON('../json/scm-companies.json', function (d) {
            scmCompany = d;
            d.values.forEach(function(element){
                companiesLook["array"].push(element[1])
                companiesLook[element[0]]=element[1]
            })
        }),

        $.getJSON('../json/scm-repos.json', function (d) {
            scmRepo = d;
            d.values.forEach(function(element){
                repos.push(element[1])
            })
        }),

        $.getJSON('../json/scm-commits-distinct.json', function (d) {
            scmCommit = d;
        }),

        $.getJSON('../json/scm-projects.json', function (d) {
            scmProj = d;
            Object.keys(d).forEach(function(element){
                proj.push(element)
            })
        })


    ).done(function(){
        /*************** General Data ***************/
        commitsData = dcFormat(scmCommit);
        ndx = crossfilter(commitsData);
        all = ndx.groupAll();

	/*************** General dimension for projects *********/

	     dimProj = ndx.dimension(function(d){
		return d.proj;
	    })
        /*************** Time format ***************/

        var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');

        commitsData.forEach(function (element) {
            element.date = dateFormat.parse(element.date);
            element.month = d3.time.month(element.date);
			element.day = d3.time.day(element.date);
        });

        /*************** Pie charts ***************/


        Pies()

        /*************** Time Chart ***************/

        Time()


        /*************** Table Chart ***************/
        sizeTableInit = 7;
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
                some:'<span style="font-size:150%"><strong>%filter-count</strong> commits out of <strong>%total-count</strong>'+
                ' <button type="button" class="btn btn-primary btn-sm" onclick="Reset()">Reset all filters</button></span>',
                all:'<span style="font-size:150%"><strong>%filter-count</strong> commits out of <strong>%total-count</strong>'+
                ' <button type="button" class="btn btn-primary btn-sm" onclick="Reset()">Reset all filters</button></span>'
            });


        dc.renderAll();


        /**************** Redraw URL ************/

        readURL()

        /****************Inputs****************/
        $(':input:not(textarea)').keypress(function(event) {
            return event.keyCode != 13;
        });

        $("#companiesInput").autocomplete({
            source:companiesLook["array"],
            minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $("#developersInput").autocomplete({
            source:users,
            minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $("#reposInput").autocomplete({
            source:repos,
            minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $("#projInput").autocomplete({
            source:proj,
            minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $('#companiesInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var company=this.value;
                if(company!=""){
                    this.value=""
                    compPie.filter(company)
                    document.dispatchEvent(pieClickEvent);
                }
            }

        });
        $('#developersInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var deve=this.value;
                if(deve!=""){
                    this.value=""
                    developDim.filter(deve)
                    document.dispatchEvent(pieClickEvent);
                }
            }

        });

        $('#reposInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var repo=this.value;
                if(repo!=""){
                    this.value=""
                    repoPie.filter(repo)
                    document.dispatchEvent(pieClickEvent);
                }
            }

        });

        $('#projInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var proj=this.value;
                if(proj!=""){
                    this.value=""
                    projPie.filter(proj)
                    document.dispatchEvent(pieClickEvent);
                }
            }

        });

	$("#projectForm").change(function(e){
		if($(this).val()=="All"){
			dimProj.filterAll()
		}else{
			dimProj.filter($(this).val())
		}
		dc.redrawAll()
	})

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
        if(scmProj[Object.keys(scmProj)[0]].indexOf(dic['repo'])!=-1){
            dic['proj']=Object.keys(scmProj)[0]
        }else{
            dic['proj']=Object.keys(scmProj)[1] 
        }
        array.push(dic);
    });
    return array;
}
/***************************  click Pie event and update tables **********************/
document.addEventListener('table', function (e) {
	tableUpdate('click');
	dc.redrawAll();
}, false);
document.addEventListener('time', function (e) {
	tableUpdate('time');
	dc.redrawAll();
}, false);
function tableUpdate(type) {
	var zero = false;
	if (type == 'reset'){
		table.size(sizeTableInit);
		tableRepo.size(sizeTableInit);
		tableOrg.size(sizeTableInit);
		tableAuth.size(sizeTableInit);
	} else if ((type == 'click') || (type == 'time')) {
        var number = $('.dc-data-count.dc-chart').html().split('<strong>')[1].split('</strong>')[0];
		var total = parseInt(number);
		if (number.split(',')[1] != undefined){
			total = parseInt(number.split(',')[0]+number.split(',')[1]);
		}
        if (number == 0) {
            zero = true;
        } else {
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
        }
    }
    if (!zero) {
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
}
/************** Reset **************/

function Reset(){
	
    $.when(
        dc.filterAll(),
	dimProj.filterAll(""),
        developDim.filterAll()
    ).done(function(){
        tableUpdate('reset')
	$("#filterComp").empty()
	$("#filterDeve").empty()
	$("#filterRepo").empty()
        dc.redrawAll();
    })
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
    projFilters.forEach(function(element){
        if(projFilters.indexOf(element)==projFilters.length-1){
            projStrUrl+=element
        }else{
            projStrUrl+=element+'+'
        }
    })

    return '?'+projStrUrl+'&'+repoStrUrl+'&'+deveStrUrl+'&'+compStrUrl
}

/********************** Read generated URL ****************************/
function readURL(){
    var arrayStrURL=document.URL.split("?")
    if(arrayStrURL.length!=1){
        var repoStrUrl=arrayStrURL[1].split("repo=")[1].split("&")[0].split("+")
        var compStrUrl=arrayStrURL[1].split("comp=")[1].split("&")[0].split("+")
        var deveStrUrl=arrayStrURL[1].split("deve=")[1].split("&")[0].split("+")
        var projStrUrl=arrayStrURL[1].split("proj=")[1].split("&")[0].split("+")

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

        if(projStrUrl[0]!=""){
            projStrUrl.forEach(function(element){
                projPie.filter(unescape(element))
            })
        }
        document.dispatchEvent(pieClickEvent);
    }
}
