
var data;
var ndx;
var all;
var dim;
var grp;
var dimNew;
var grpNew;

var data2;
var ndx2;
var all2;

$(document).ready(function(){
    StaticChart = dc.barChart('#chart',"chartGroupA");
    yearChart = dc.pieChart('#year',"chartGroupB");
    var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');

    $("#button").click(function(){
        if($("li").length!=0){
            var lista=[]

            $("li").each(function(){
                lista.push(this.id)
            })
            dimNew = ndx.dimension(function(d){
                if(lista.indexOf(d.key)!=-1){
                    return d.key
                }
            })

            grpNew = dimNew.group().reduceSum(function(d){
                if(lista.indexOf(d.key)!=-1){
                    return d.value
                }
            });

            StaticChart
            .width(900)
            .height(500)
            .dimension(dimNew)
            .elasticY(true)
            .elasticX(true)
            .group(grpNew)
            .x(d3.scale.ordinal().domain([""]))
            .xUnits(dc.units.ordinal)
            .margins({top: 0, right: 50, bottom: 200, left: 40});
            StaticChart.on("renderlet", function(chart){
                chart.selectAll("g.x text").attr("transform","translate(-10, 80) rotate(270)"); 
            })
            
            dc.redrawAll(["chartGroupA"]);
        }
    })

    $("#reset").click(function(){
        

        StaticChart
        .width(900)
        .height(500)
        .dimension(dim)
        .elasticY(true)
        .elasticX(true)
        .group(grp)
        .x(d3.scale.ordinal().domain([""]))
        .xUnits(dc.units.ordinal)
        .margins({top: 0, right: 50, bottom: 200, left: 40});
        StaticChart.on("renderlet", function(chart){
            chart.selectAll("g.x text").attr("transform","translate(-10, 80) rotate(270)"); 
        })
        
        dc.redrawAll(["chartGroupA"]);
    })

    $.when(
		
        $.getJSON('scm-static.json', function (d) {
            data = dcFormat(d);
            ndx= crossfilter(data)
            all = ndx.groupAll();
        })
		
    ).done(function(){
    	dim = ndx.dimension(function(d){
    		return d.key;
    	})
		grp = dim.group().reduceSum(function(d){
			return d.value
		});

    	StaticChart
    	.width(900)
    	.height(500)
    	.dimension(dim)
        .elasticY(true)
        .elasticX(true)
        .ordering(function(d){console.log(d)})
    	.group(grp)
        .x(d3.scale.ordinal().domain([""]))
        .xUnits(dc.units.ordinal)
        .margins({top: 0, right: 50, bottom: 200, left: 40});
        StaticChart.on("renderlet", function(chart){
            chart.selectAll("g.x text").attr("transform","translate(-10, 80) rotate(270)"); 
        })
        
        $("#chart").click(function(d){
            if(d.target.__data__!=undefined){
                if(d.target.className.baseVal=="bar selected"){
                    console.log(d.target.__data__)
                    $("#list").append('<li id="'+d.target.__data__.x+'">'+d.target.__data__.x+'</li>')
                }else{
                    $("#"+d.target.__data__.x).remove()
                }
            }
        })
        dc.renderAll(["chartGroupA"]);

    })
    /*
    $.when(
        // Load agin json file
        
        $.getJSON('scm-commits-100000.json', function (d2) {
            data2 = dcFormat10k(d2);
            ndx2= crossfilter(data2)
            all2 = ndx2.groupAll();
            data2.forEach(function (d2) {
                d2.date = dateFormat.parse(d2.date);
            });

        })
    ).done(function(){

        yearDim = ndx2.dimension(function(d2) {
            return d2.date.getFullYear();
        });
        var yearGrp = yearDim.group();

        yearChart.width(180)
            .height(180)
            .radius(80)
            .innerRadius(30)
            .dimension(yearDim)
            .group(yearGrp);

        dc.renderAll(["chartGroupB"]);
        $("#year").click(function(d){
            console.log(d.target.__data__.data.key)
        })
    })*/

});
/*********************************************************************************************************************************
***************************************************** Valid format for dc.js *****************************************************
*********************************************************************************************************************************/
function dcFormat(d){
	var keys= Object.keys(d)
    var array = [];
    keys.forEach(function(element){
    	array.push({"key":element,"value":d[element]})
    })
    return array;
}

function dcFormat10k(d){
    var array = [];
    $.each(d, function(key, val){
        array.push({'id': val[0], 'date': val[1], 'hexaId': val[2], 'name': val[3], 'companyId': val[4], 'company': val[5]});
    });
    return array;
}
