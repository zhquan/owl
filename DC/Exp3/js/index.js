var allCommits;
var allSliderCommits;

var commitsPie;
var commitsData;

var scmCompany;
var scmRepo;
var scmCommit;

var companies=[];
var repos=[]
var users=[]
$(document).ready(function(){

    /*************** Divs for DC ***************/

    commitsPie = dc.pieChart('#chart1');
    commitsNamePie = dc.pieChart('#chart2');
    repoPie = dc.pieChart('#chart3');
	allCommits = dc.lineChart('#commitsChart');
	allSliderCommits = dc.barChart('#commitsSliderChart');
    table= dc.dataTable('#chart4');

    /*************** Download of JSON ***************/


    $.when(

        $.getJSON('json/scm-companies.json', function (d) {
            scmCompany = d;
            d.values.forEach(function(element){
                companies.push(element[1])
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

        /*************** Pie charts ***************/

        commitsData.forEach(function (element) {
            element.date = dateFormat.parse(element.date);
			element.month = d3.time.month(element.date);
        });

        var dim = ndx.dimension(function(d){
            return d.company;
        })

        var grp = dim.group()

        commitsPie
        .width(472)
        .height(200)
        .dimension(dim)
        .group(grp)
        .cap(10)
        .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));;


        var dim2 = ndx.dimension(function(d){
            return d.name;
        })

        dim2.group().all().forEach(function(element){
            users.push(element.key)
        })

        var grp2 = dim2.group()

        commitsNamePie
        .width(472)
        .height(200)
        .dimension(dim2)
        .group(grp2)
        .cap(10)
        .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));

        var dim3 = ndx.dimension(function(d){
            return d.repo;
        })

        var grp3 = dim3.group()

        repoPie
        .width(472)
        .height(200)
        .dimension(dim3)
        .group(grp3)
        .cap(10)
        .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));

        /*************** Table Chart ***************/

        var nameDim = ndx.dimension(function (d) {
            return d.name;
        });
        table
            .dimension(nameDim)
            .group(function (d) {return d.date.getFullYear();})
            .size(7)
            .columns([
                'id',
                {
                label: 'Date',
                    format: function(d){
                        return String(d.date).substr(0, 15);
                    }
                },
                'name',
                {
                    label: 'Company',
                    format: function (d) {
                        return d.company;   
                    } 
                },
                {
                    label: 'Repository',
                    format: function (d) {
                        return d.repo;  
                    } 
                }
            ])
            .sortBy(function (d) {
                return d.start;
            })
            .order(d3.ascending);
        table.on('renderlet', function(table) {
            table.selectAll('.dc-table-group').classed('info', true);


        });

		var monthDim = ndx.dimension(function(d){
			return d.month;
		});

		var commitGrp = monthDim.group();
		

		allCommits
		    .renderArea(true)
		    .width(990)
		    .height(300)
		    .transitionDuration(1000)
		    .margins({top: 30, right: 50, bottom: 25, left: 50})
		    .dimension(monthDim)
		    .rangeChart(allSliderCommits)
		    .x(d3.time.scale().domain([new Date(2010, 0, 1), new Date(2015, 11, 31)]))
        	.round(d3.time.month.round)
        	.xUnits(d3.time.months)
			.elasticY(true)
		    .renderHorizontalGridLines(true)
		    .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
		    .brushOn(true)
		    .group(commitGrp, 'Commit');
		allSliderCommits
			.width(990).height(40)
			.margins({top: 0, right: 50, bottom: 20, left: 50})
            .dimension(monthDim)
            .group(commitGrp)
			.centerBar(true)
			.gap(1)
			.x(d3.time.scale().domain([new Date(2010, 0, 1), new Date(2015, 11, 31)]))
        	.round(d3.time.month.round)
        	.xUnits(d3.time.months)
			.brushOn(true)
			.alwaysUseRounding(true);
		allSliderCommits.yAxis().tickFormat(function(d) {return ''});

        dc.renderAll();

        $(".companiesInput").autocomplete({
            source:companies
        });

        $(".developersInput").autocomplete({
            source:users
        });

        $(".reposInput").autocomplete({
            source:repos
        });

        $('.companiesInput').keyup(function(e){
            if(e.keyCode == 13)
            {
                var company=this.value;
                this.value=""
                commitsPie.filter(company)
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

        if (val[4] == 261){
            dic['company'] = 'No Company';
        } else if (val[4] > 261){
            dic['company'] = scmCompany['values'][val[4]-2][1];
        } else {
            dic['company'] = scmCompany['values'][val[4]-1][1];
        }
        dic['repo'] = scmRepo['values'][val[5]-1][1];
        array.push(dic);
    });
    return array;
}

function filterByText(){
    alert("hola")
}
