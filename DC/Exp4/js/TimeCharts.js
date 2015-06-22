function Time(){

	allCommits = dc.lineChart('#commitsChart');
	allSliderCommits = dc.barChart('#commitsSliderChart');

	var monthDim = ndx.dimension(function(d){
            return d.month;
    });

    var commitGrp = monthDim.group();
        

	allCommits
	    .renderArea(true)
	    .width(1300)
	    .height(200)
	    .transitionDuration(1000)
	    .margins({top: 30, right: 50, bottom: 25, left: 50})
	    .dimension(monthDim)
	    .rangeChart(allSliderCommits)
	    .x(d3.time.scale().domain([new Date(2012, 0, 1), new Date(2015, 11, 31)]))
    	.round(d3.time.month.round)
    	.xUnits(d3.time.months)
		.elasticY(true)
	    .renderHorizontalGridLines(true)
	    .brushOn(true)
	    .group(commitGrp, 'Commit');

	allSliderCommits
		.width(1300).height(40)
		.margins({top: 0, right: 50, bottom: 20, left: 50})
        .dimension(monthDim)
        .group(commitGrp)
		.centerBar(true)
		.gap(1)
		.x(d3.time.scale().domain([new Date(2012, 0, 1), new Date(2015, 11, 31)]))
    	.round(d3.time.month.round)
    	.xUnits(d3.time.months)
		.brushOn(true)
		.alwaysUseRounding(true);
	allSliderCommits.yAxis().tickFormat(function(d) {return ''});

	allCommits.on("filtered", function(chart,filter) {
		if(filter!=null){
			$("#filterFrom").text("  "+filter[0].getFullYear()+"-"+filter[0].getMonth()+"-"+filter[0].getDate()+" //")
			$("#filterTo").text(" "+filter[1].getFullYear()+"-"+filter[1].getMonth()+"-"+filter[1].getDate()+" ")
		}else{
			$("#filterFrom").text("  2012-1-1 //")
			$("#filterTo").text(" 2015-12-31 ")
		}
	})

}