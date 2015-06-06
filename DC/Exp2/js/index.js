var commitsPie;
var commitsData;
$(document).ready(function(){
    commitsPie = dc.pieChart('#chart');
    $.when(
        // Load agin json file
        
        $.getJSON('json/scm-commits-100000.json', function (data) {
            Initialdata=data;
        })

        
    ).done(function(){
        commitsData = dcFormat(Initialdata);
        ndx = crossfilter(commitsData);
        all = ndx.groupAll();

        var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');

        commitsData.forEach(function (element) {
            element.date = dateFormat.parse(element.date);

        });

        dim = ndx.dimension(function(d){
            return d.company;
        })

        grp = dim.group()

        commitsPie
        .width(600)
        .height(200)
        .dimension(dim)
        .group(grp)
        .cap(10)
        .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));;

        dc.renderAll();

    })

});


function dcFormat(d){
    var array = [];
    $.each(d, function(key, val){
        array.push({'id': val[0], 'date': val[1], 'hexaId': val[2], 'name': val[3], 'companyId': val[4], 'company': val[5]});
    });
    return array;
}
