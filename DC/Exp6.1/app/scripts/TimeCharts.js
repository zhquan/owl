function Time(){

//	allCommits = dc.lineChart('#commitsChart');
	allSliderCommits = dc.barChart('#commitsSliderChart');

	var monthDim = ndx.dimension(function(d){
            return d.month;
    });

    var commitGrp = monthDim.group();

	var finishDate = monthDim.top(Infinity)[0];
	var initDate = monthDim.top(Infinity)[monthDim.top(Infinity).length-1];
/*
	allCommits
	    .renderArea(true)
	    .width(1500)
	    .height(200)
	    .transitionDuration(1000)
	    .margins({top: 30, right: 50, bottom: 25, left: 50})
	    .dimension(monthDim)
	    .rangeChart(allSliderCommits)
	    .x(d3.time.scale().domain([initDate.date, new Date(finishDate.date.getFullYear(), finishDate.date.getMonth()+1, finishDate.date.getUTCDate()+1)]))
    	.round(d3.time.month.round)
    	.xUnits(d3.time.months)
		.elasticY(true)
	    .renderHorizontalGridLines(true)
	    .brushOn(false)
	    .group(commitGrp, 'Commit');
*/
	allSliderCommits
		.width(1500).height(150)
		.margins({top: 0, right: 50, bottom: 20, left: 50})
        .dimension(monthDim)
        .group(commitGrp)
		.centerBar(true)
		.gap(1)
		.x(d3.time.scale().domain([initDate.date, new Date(finishDate.date.getFullYear(), finishDate.date.getMonth()+1, finishDate.date.getUTCDate()+1)]))
    	.round(d3.time.month.round)
    	.xUnits(d3.time.months)
		.brushOn(true)
		.alwaysUseRounding(true);
	allSliderCommits.yAxis().tickFormat(function(d) {return ''});

	allSliderCommits.on("filtered", function(chart,filter) {
		if(filter != null){
			$("#filterFrom").text("  "+filter[0].getFullYear()+"-"+parseInt(filter[0].getMonth()+1)+"-"+filter[0].getUTCDate()+" //")
			$("#filterTo").text(" "+filter[1].getFullYear()+"-"+parseInt(filter[1].getMonth()+1)+"-"+filter[1].getUTCDate()+" ")
			document.dispatchEvent(timeRangeEvent);
		}else{
			$("#filterFrom").text(initDate.date.getFullYear()+'-'+parseInt(initDate.date.getMonth()+1)+'-'+initDate.date.getUTCDate()+" //");
			$("#filterTo").text(" "+finishDate.date.getFullYear()+'-'+parseInt(finishDate.date.getMonth()+1)+'-'+finishDate.date.getUTCDate());
		}
	})

}
