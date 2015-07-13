function Pies(){

    compPie = dc.pieChart('#compPieChart', 'other');
    commitsNamePie = dc.pieChart('#authPieChart', 'other');
    repoPie = dc.pieChart('#repoPieChart', 'other');
 

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
	var i=0;
        if(filter==null){
            compFilters=[]
        }else{
	    $("#filterComp").empty()
            if(filter.constructor==Array){
               
                    if(compFilters.indexOf("Others ("+filter[0].length+")")==-1){
			compFilters.push("Others ("+filter[0].length+")")
                    }else{
			
                        compFilters.splice(compFilters.indexOf("Others ("+filter[0].length+")"),1)
			
                    }
		
            }else{
		if(filter!="Others"){
		        if(compFilters.indexOf(filter)==-1){
			  compFilters.push(filter)
		        }else{
		            compFilters.splice(compFilters.indexOf(filter),1)
		        }
		}
            }
		
		for(x=0;x<=5;x++){
			if(compFilters[x]!=undefined){
				$("#filterComp").append('<span  class="label label-default" id="filter-'+compFilters[x].replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+compFilters[x]+' </span>')
			}
		}
		if(compFilters.length>5){
			$("#filterComp").append('<span class="label label-default" id="filter-y"> '+(compFilters.length-5)+' More </span>')
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
	var i=0;
        if(filter==null){
            deveFilters=[]
        }else if(filter!="Others"){
		$("#filterDeve").empty()
            if(filter.constructor==Array){
                   if(deveFilters.indexOf("Others ("+filter[0].length+")")==-1){
			deveFilters.push("Others ("+filter[0].length+")")
                    }else{
			
                        deveFilters.splice(deveFilters.indexOf("Others ("+filter[0].length+")"),1)
			
                    }


            }else{
                if(filter!="Others"){
		        if(deveFilters.indexOf(filter)==-1){
			  deveFilters.push(filter)
		        }else{
		            deveFilters.splice(deveFilters.indexOf(filter),1)
		        }
		}
            }

		for(x=0;x<=5;x++){
			if(deveFilters[x]!=undefined){
				$("#filterDeve").append('<span class="label label-default" id="filter-'+deveFilters[x].replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+deveFilters[x]+' </span>')
			}
		}
		if(deveFilters.length>5){
			$("#filterDeve").append('<span class="label label-default" id="filter-y"> '+(deveFilters.length-5)+' More </span>')
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

	var i=0;
        if(filter==null){
            repoFilters=[]
        }else if(filter!="Others"){
		$("#filterRepo").empty()
            if(filter.constructor==Array){
                if(repoFilters.indexOf("Others ("+filter[0].length+")")==-1){
			repoFilters.push("Others ("+filter[0].length+")")
                }else{
			
                        repoFilters.splice(repoFilters.indexOf("Others ("+filter[0].length+")"),1)
			
                 }
            }else{
                if(filter!="Others"){
		        if(repoFilters.indexOf(filter)==-1){
			  repoFilters.push(filter)
		        }else{
		            repoFilters.splice(repoFilters.indexOf(filter),1)
		        }
		}
            }

		for(x=0;x<=5;x++){
			if(repoFilters[x]!=undefined){
				$("#filterRepo").append('<span class="label label-default" id="filter-'+repoFilters[x].replaceAll(" ","0").replaceAll(".","0").replaceAll(",","0").replaceAll("(","0").replaceAll(")","0").replaceAll("?","0").replaceAll("'","0").replaceAll("@","0")+'"> '+repoFilters[x]+' </span>')
			}
		}
		if(repoFilters.length>5){
			$("#filterRepo").append('<span class="label label-default" class="label label-default" id="filter-y"> '+(repoFilters.length-5)+' More </span>')
		}
        }
        window.history.replaceState("object or string", "Title", writeURL());

    });
}
