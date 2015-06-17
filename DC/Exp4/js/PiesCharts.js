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
        if(filter==null){
            compFilters=[]
            $("#filterComp").empty()
        }else if(filter!="Others"){
            if(filter.constructor==Array){
                filter[0].forEach(function(element){
                    if(compFilters.indexOf(element)==-1){
                        $("#filterComp").append('<span id="filter-'+element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+element+' </span>')
                        compFilters.push(element)
                    }else{
                        $('#filter-'+(element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                        compFilters.splice(compFilters.indexOf(element),1)
                    }
                })
            }else{
                if(compFilters.indexOf(filter)==-1){
                    $("#filterComp").append('<span id="filter-'+filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+filter+' </span>')
                    compFilters.push(filter)
                }else{
                    $('#filter-'+(filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
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
        if(filter==null){
            deveFilters=[]
            $("#filterDeve").empty()
        }else if(filter!="Others"){
            if(filter.constructor==Array){
                filter[0].forEach(function(element){
                    if(deveFilters.indexOf(element)==-1){
                        $("#filterDeve").append('<span id="filter-'+element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+element+' </span>')
                        deveFilters.push(element)
                    }else{
                        $('#filter-'+(element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                        deveFilters.splice(deveFilters.indexOf(element),1)
                    }
                })
            }else{
                if(deveFilters.indexOf(filter)==-1){
                    $("#filterDeve").append('<span id="filter-'+filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+filter+' </span>')
                    deveFilters.push(filter)
                }else{
                    $('#filter-'+(filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                    deveFilters.splice(deveFilters.indexOf(filter),1)
                }
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
        if(filter==null){
            compFilters=[]
            $("#filterRepo").empty()
        }else if(filter!="Others"){
            if(filter.constructor==Array){
                filter[0].forEach(function(element){
                    if(compFilters.indexOf(element)==-1){
                        $("#filterRepo").append('<span id="filter-'+element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+element+' </span>')
                        compFilters.push(element)
                    }else{
                        $('#filter-'+(element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                        compFilters.splice(compFilters.indexOf(element),1)
                    }
                })
            }else{
                if(compFilters.indexOf(filter)==-1){
                    $("#filterRepo").append('<span id="filter-'+filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+filter+' </span>')
                    compFilters.push(filter)
                }else{
                    $('#filter-'+(filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                    compFilters.splice(compFilters.indexOf(filter),1)
                }
            }              
        }
    });

}