var allCommits;
var allSliderCommits;

var commitsPie;
var commitsData;

var scmCompany;
var scmRepo;
var scmCommit;

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

        $(".companiesInput").autocomplete({
            source:companiesLook["array"], minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $(".developersInput").autocomplete({
            source:users, minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $(".reposInput").autocomplete({
            source:repos, minLength:0
        }).on('focus', function() { $(this).keydown(); });

        $('.companiesInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var company=this.value;
                this.value=""
                compPie.filter(company)
                dc.redrawAll();
            }

        });

        $('.developersInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var company=this.value;
                this.value=""
                commitsNamePie.filter(company)
                dc.redrawAll();
            }

        });

        $('.reposInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var company=this.value;
                this.value=""
                repoPie.filter(company)
                dc.redrawAll();
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

function Reset(){
    dc.filterAll();
    dc.redrawAll();
    dc.renderAll();
}
