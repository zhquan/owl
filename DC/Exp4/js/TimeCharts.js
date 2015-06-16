function Time(){

	allCommits = dc.lineChart('#commitsChart');
	allSliderCommits = dc.barChart('#commitsSliderChart');

	var monthDim = ndx.dimension(function(d){
            return d.month;
    });

    var commitGrp = monthDim.group();
        

	allCommits
	    .renderArea(true)
	    .width(700)
	    .height(200)
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
		.width(700).height(40)
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

}