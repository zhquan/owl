function Pies(){

	compPie = dc.pieChart('#compPieChart');
    commitsNamePie = dc.pieChart('#authPieChart');
    repoPie = dc.pieChart('#repoPieChart');
    projPie= dc.pieChart('#projPieChart')

    var dim = ndx.dimension(function(d){
        return d.company;
    })

    var grp = dim.group()

    compPie
    .width(350)
    .height(250)
    .dimension(dim)
    .group(grp)
    .cx(225)
    .cap(10)
    .legend(dc.legend().x(0).y(3).itemHeight(13).gap(5))
    .ordering(function (d) { return -d.value; });

	compPie.on('renderlet', function(chart) {
	  chart.selectAll('.pie-slice').on("click", function(d) {
    	document.dispatchEvent(pieClickEvent);
	  });
	});
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
        window.history.replaceState("object or string", "Title", writeURL());

    });


    var dim2 = ndx.dimension(function(d){
        return d.name;
    })

    dim2.group().all().forEach(function(element){
        users.push(element.key)
    })

    var grp2 = dim2.group()

    commitsNamePie
    .width(350)
    .height(250)
    .dimension(dim2)
    .group(grp2)
    .cx(225)
    .cap(10)
    .legend(dc.legend().x(0).y(3).itemHeight(13).gap(5))
    .ordering(function (d) { return -d.value; });

	commitsNamePie.on('renderlet', function(chart) {
	  chart.selectAll('.pie-slice').on("click", function(d) {
		document.dispatchEvent(pieClickEvent);
	  });
	});
    commitsNamePie.on("filtered", function(chart,filter) {
        if(filter==null){
            repoFilters=[]
            $("#filterDeve").empty()
        }else if(filter!="Others"){
            if(filter.constructor==Array){
                filter[0].forEach(function(element){
                    if(repoFilters.indexOf(element)==-1){
                        $("#filterDeve").append('<span id="filter-'+element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+element+' </span>')
                        repoFilters.push(element)
                    }else{
                        $('#filter-'+(element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                        repoFilters.splice(repoFilters.indexOf(element),1)
                    }
                })
            }else{
                if(repoFilters.indexOf(filter)==-1){
                    $("#filterDeve").append('<span id="filter-'+filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+filter+' </span>')
                    repoFilters.push(filter)
                }else{
                    $('#filter-'+(filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                    repoFilters.splice(repoFilters.indexOf(filter),1)
                }
            }
        }
        window.history.replaceState("object or string", "Title", writeURL());

    });

    var dim3 = ndx.dimension(function(d){
        return d.repo;
    })

    var grp3 = dim3.group()

    repoPie
    .width(350)
    .height(250)
    .dimension(dim3)
    .group(grp3)
    .cx(225)
    .cap(10)
    .legend(dc.legend().x(0).y(3).itemHeight(13).gap(5))
    .ordering(function (d) { return -d.value; });

	repoPie.on('renderlet', function(chart) {
	  chart.selectAll('.pie-slice').on("click", function(d) {
		document.dispatchEvent(pieClickEvent);
	  });
	});
    repoPie.on("filtered", function(chart,filter) {
        if(filter==null){
            repoFilters=[]
            $("#filterRepo").empty()
        }else if(filter!="Others"){
            if(filter.constructor==Array){
                filter[0].forEach(function(element){
                    if(repoFilters.indexOf(element)==-1){
                        $("#filterRepo").append('<span id="filter-'+element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+element+' </span>')
                        repoFilters.push(element)
                    }else{
                        $('#filter-'+(element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                        repoFilters.splice(repoFilters.indexOf(element),1)
                    }
                })
            }else{
                if(repoFilters.indexOf(filter)==-1){
                    $("#filterRepo").append('<span id="filter-'+filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+filter+' </span>')
                    repoFilters.push(filter)
                }else{
                    $('#filter-'+(filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                    repoFilters.splice(repoFilters.indexOf(filter),1)
                }
            }
        }
        window.history.replaceState("object or string", "Title", writeURL());

    });

    var dim4 = ndx.dimension(function(d){
        return d.proj;
    })

    var grp4 = dim4.group()

    projPie
    .width(350)
    .height(250)
    .dimension(dim4)
    .group(grp4)
    .cx(225)
    .cap(10)
    .legend(dc.legend().x(0).y(3).itemHeight(13).gap(5))
    .ordering(function (d) { return -d.value; });

	projPie.on('renderlet', function(chart) {
	  chart.selectAll('.pie-slice').on("click", function(d) {
		document.dispatchEvent(pieClickEvent);
	  });
	});
    projPie.on("filtered", function(chart,filter) {
        if(filter==null){
            projFilters=[]
            $("#filterProj").empty()
        }else if(filter!="Others"){
            if(filter.constructor==Array){
                filter[0].forEach(function(element){
                    if(projFilters.indexOf(element)==-1){
                    $("#filterProj").append('<span id="filter-'+element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+element+' </span>')
                    projFilters.push(element)
                    }else{
                        $('#filter-'+(element.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                        projFilters.splice(projFilters.indexOf(element),1)
                    }
                })
            }else{
                if(projFilters.indexOf(filter)==-1){
                    $("#filterProj").append('<span id="filter-'+filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+filter+' </span>')
                    projFilters.push(filter)
                }else{
                    $('#filter-'+(filter.replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0"))).remove()
                    projFilters.splice(projFilters.indexOf(filter),1)
                }
            }
        }
        window.history.replaceState("object or string", "Title", writeURL());

    });

}
