function Tables(){

	table= dc.dataTable('#tableRepo');
    table2= dc.dataTable('#tableOrg');
    table3= dc.dataTable('#tableAuth');

    var nameDim = ndx.dimension(function (d) {
            return d.name;
    });

	var repo = [];
	var repoDim = ndx.dimension(function (d) {
		if (repo.indexOf(d.repo) == -1) {
			repo.push(d.repo);
		}
		var i = repo.indexOf(d.repo);
        return repo[i];
    });
	var repoGrp = repoDim.group();
	var order = -1;
	var order2 = -1;
console.log(repo)
console.log(repoGrp.top(Infinity))
    table
        .dimension(repoDim)
        .group(function (d) {return "";})
        .size(7)
        .columns([
            {
            	label: 'Repositories',
                format: function(d){
					order++;
					return repoGrp.top(Infinity)[order].key;
                }
            },
            {
            	label: 'Commits',
                format: function(d){
					order2++;
					return repoGrp.top(Infinity)[order2].value;
                }
            }
        ])
        .order(d3.ascending);

    table.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
        table.selectAll(".dc-table-column._2").on("click", function(d){
            commitsNamePie.filter(d.name)
            dc.redrawAll();
        });

		$(window).bind('scroll', function(){
			if($(this).scrollTop() == ($('body').outerHeight() - $(window).innerHeight())) {
			    var size = table2.size();
				var numero = $('.dc-data-count.dc-chart').html().split('<strong>')[1].split('</strong>')[0];
				var total = parseInt(numero);
				if (numero.split(',')[1] != undefined){
					total = parseInt(numero.split(',')[0]+numero.split(',')[1]);
				}
				if (size < total){
					var sizeRepo = size+5;
					if (sizeRepo < repoGrp.top(Infinity).length-1){
console.log(sizeRepo)
console.log(repoGrp.top(Infinity).length-1)
						order = -1;
						order2 = -1;
						table
							.size(sizeRepo)
							.columns([
								{
									label: 'Repositories',
									format: function(d){
										order++;
										if (repoGrp.top(Infinity).length-1 < order) {
											order = repoGrp.top(Infinity).length-1
										}
										return repoGrp.top(Infinity)[order].key;
									}
								},
								{
									label: 'Commits',
									format: function(d){
										order2++;
										if (repoGrp.top(Infinity).length-1 < order2) {
											order2 = repoGrp.top(Infinity).length-1
										}
										return repoGrp.top(Infinity)[order2].value;
									}
								}
							]);
					}
                    table2.size(size+5);
                    table3.size(size+5);
					dc.redrawAll();
				}
			}
		});

    });

    table2
        .dimension(nameDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            'id',
            {
            label: 'Date',
                format: function(d){
                    return String(d.date).substr(0, 15);
                }
            },
            'name'
        ])
        .sortBy(function (d) {
            return d.start;
        })
        .order(d3.ascending);
    table2.on('renderlet', function(table) {
        table2.selectAll('.dc-table-group').classed('info', true);
        table2.selectAll(".dc-table-column._2").on("click", function(d){
            commitsNamePie.filter(d.name)
            dc.redrawAll();
        });
    });

    table3
        .dimension(nameDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            'id',
            {
            label: 'Date',
                format: function(d){
                    return String(d.date).substr(0, 15);
                }
            },
            {
                label: 'Company',
                format: function (d) {
                    return d.company;   
                } 
            },
        ])
        .sortBy(function (d) {
            return d.start;
        })
        .order(d3.ascending);
        
    table3.on('renderlet', function(table) {
        table3.selectAll('.dc-table-group').classed('info', true);
        table3.selectAll(".dc-table-column._2").on("click", function(d){
            commitsNamePie.filter(d.name)
            dc.redrawAll();
        });

    });
}
