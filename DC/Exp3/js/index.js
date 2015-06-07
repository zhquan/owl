var commitsPie;
var commitsData;

var scmCompany;
var scmRepo;
var scmCommit;
$(document).ready(function(){

    /*************** Divs for DC ***************/

    commitsPie = dc.pieChart('#chart1');
    commitsNamePie = dc.pieChart('#chart2');
    repoPie = dc.pieChart('#chart3');
    table= dc.dataTable('#chart4');

    /*************** Download of JSON ***************/


    $.when(

        $.getJSON('json/scm-companies.json', function (d) {
            scmCompany = d;
        }),

        $.getJSON('json/scm-repos.json', function (d) {
            scmRepo = d;
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
                'date',
                'person_id',
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


        dc.renderAll();

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
