function Pies(){

	compPie = dc.pieChart('#chart1');
    commitsNamePie = dc.pieChart('#chart2');
    repoPie = dc.pieChart('#chart3');

    var dim = ndx.dimension(function(d){
        return d.company;
    })

    var grp = dim.group()

    compPie
    .width(472)
    .height(270)
    .dimension(dim)
    .group(grp)
    .cx(300)
    .cap(14)
    .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));

    compPie.on("filtered", function(chart,filter) {
        if(filter!="Others"){
            if(filter.constructor==Array){
                filter[0].forEach(function(element){
                    if(compFilters.indexOf(element)!=-1){
                        $("#filterComp").append('<div id="filter-'+element+'">'+element+'</div>')
                        compFilters.push(element)
                    }else{
                        $('#filter-'+element).remove()
                        compFilters.splice(compFilters.indexOf(element),1)
                    }
                })
            }else{
                if(compFilters.indexOf(filter)!=-1){
                    $("#filterComp").append('<div id="filter-'+filter+'">'+filter+'</div>')
                    compFilters.push(filter)
                }else{
                    $('#filter-'+filter).remove()
                    compFilters.splice(compFilters.indexOf(filter),1)
                }
            }              
        }
    });


    var dim2 = ndx.dimension(function(d){
        return d.name;
    })

    dim2.group().all().forEach(function(element){
        users.push(element.key)
    })

    var grp2 = dim2.group()

    commitsNamePie
    .width(472)
    .height(270)
    .dimension(dim2)
    .group(grp2)
    .cx(300)
    .cap(14)
    .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));

    commitsNamePie.on("filtered", function(chart,filter) {
        if(filter!="Others"){
            deveFilters.push(filter)
            if($("#filterDeve").text()==""){
                $("#filterDeve").append(filter)
            }else{
                $("#filterDeve").append(","+filter)
            }
        }
    });

    var dim3 = ndx.dimension(function(d){
        return d.repo;
    })

    var grp3 = dim3.group()

    repoPie
    .width(472)
    .height(270)
    .dimension(dim3)
    .group(grp3)
    .cap(14)
    .cx(300)
    .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));

    repoPie.on("filtered", function(chart,filter) {
        if(filter!="Others"){
            compFilters.push(filter)
            if($("#filterRepo").text()==""){
                $("#filterRepo").append(filter)
            }else{
                $("#filterRepo").append(","+filter)
            }
        }
    });

}