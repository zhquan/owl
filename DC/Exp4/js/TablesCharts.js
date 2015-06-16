function Tables(){

	table= dc.dataTable('#chart4');
    table2= dc.dataTable('#chart6');
    table3= dc.dataTable('#chart7');

    var nameDim = ndx.dimension(function (d) {
            return d.name;
    });

    table
        .dimension(nameDim)
        .group(function (d) {return d.date.getFullYear();})
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
                label: 'Repository',
                format: function (d) {
                    return d.repo;  
                } 
            }
        ])
        .sortBy(function (d) {
            return d.start;
        })
        .order(d3.ascending);

    table.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
        table.selectAll(".dc-table-column._2").on("click", function(d){
            commitsNamePie.filter(d.name)
            dc.redrawAll();
        });

		$(window).bind('scroll', function(){
			if($(this).scrollTop() == ($('body').outerHeight() - $(window).innerHeight())) {
			    var size = table.size();
				var numero = $('.dc-data-count.dc-chart').html().split('<strong>')[1].split('</strong>')[0];
				var total = parseInt(numero);
				if (numero.split(',')[1] != undefined){
					total = parseInt(numero.split(',')[0]+numero.split(',')[1]);
				}
				if (size < total){
					table.size(size+5);
                    table2.size(size+5);
                    table3.size(size+5);
					dc.redrawAll();
				}
			}
		});

    });

    table2
        .dimension(nameDim)
        .group(function (d) {return d.date.getFullYear();})
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
        .group(function (d) {return d.date.getFullYear();})
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