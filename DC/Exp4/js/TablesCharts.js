function Tables(){

	
	tableRepo = dc.dataTable('#tableRepo');
    tableOrg = dc.dataTable('#tableOrg');
    table = dc.dataTable('#table');
	tableAuth = dc.dataTable('#tableAuth');

    var nameDim = ndx.dimension(function (d) {
        return d.name;
    });

/********************************************************** Table Repo ********************************************************/
	var order = -1;
	var order2 = -1;
    tableRepo
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
        ]);

    tableRepo.on('renderlet', function(table) {
        tableRepo.selectAll('.dc-table-group').classed('info', true);
        tableRepo.selectAll(".dc-table-column._0").on("click", function(d){
            repoPie.filter(d.repo)
            dc.redrawAll();
        });
    });
/********************************************************** Table ********************************************************/
    table
        .dimension(nameDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            {
				label: 'Commit',
				format: function(d) {
					return d.id;
				}
			},
            {
	            label: 'Date',
                format: function(d){
                    return String(d.date).substr(0, 15);
                }
            },
            'name',
			{
				label: 'Organization',
				format: function(d) {
					return d.company;
				}
			},
			{
				label: 'Repository',
				format: function(d) {
					return d.repo;
				}
			}
        ])
        .sortBy(function (d) {
            return d.id;
        })
        .order(d3.ascending);
    table.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
//        table.selectAll(".dc-table-column._2").on("click", function(d){
//            commitsNamePie.filter(d.name)
//            dc.redrawAll();
//        });

		$(window).bind('scroll', function(){
			if(($(this).scrollTop() == ($('body').outerHeight() - $(window).innerHeight())) || ($(this).scrollTop()-1 == ($('body').outerHeight() - $(window).innerHeight()))) {
			    var size = table.size();
				var numero = $('.dc-data-count.dc-chart').html().split('<strong>')[1].split('</strong>')[0];
				var total = parseInt(numero);
				if (numero.split(',')[1] != undefined){
					total = parseInt(numero.split(',')[0]+numero.split(',')[1]);
				}
				if (size < total){
					table.size(size+5);
					var sizeRepo = size;
					var sizeOrg = size;
					var sizeAuth = size;
					if ((size+5) < repoGrp.top(Infinity).length-1){
						sizeRepo = size+5;
					} else {
						sizeRepo = repoGrp.top(Infinity).length-1;
					}
					var repoOrderKey = -1;
					var repoOrderValue = -1;
					tableRepo
						.size(sizeRepo)
						.columns([
							{
								label: 'Repositories',
								format: function(d){
									repoOrderKey++;
									if (repoGrp.top(Infinity).length-1 < repoOrderKey) {
										repoOrderKey = repoGrp.top(Infinity).length-1
									}
									return repoGrp.top(Infinity)[repoOrderKey].key;
								}
							},
							{
								label: 'Commits',
								format: function(d){
									repoOrderValue++;
									if (repoGrp.top(Infinity).length-1 < repoOrderValue) {
										repoOrderValue = repoGrp.top(Infinity).length-1
									}
									return repoGrp.top(Infinity)[repoOrderValue].value;
								}
							}
						]);
                    if ((size+5) < orgGrp.top(Infinity).length-1) {
						sizeOrg = size+5;
					} else {
						sizeOrg = orgGrp.top(Infinity).length-1;
					}
					var orgOrderKey = -1;
					var orgOrderValue = -1;
					tableOrg
						.dimension(orgDim)
						.group(function (d) {return '';})
						.size(sizeOrg)
						.columns([
							{
								label: 'Organizations',
								format: function(d){
									orgOrderKey++;
									return orgGrp.top(Infinity)[orgOrderKey].key;
								}
							},
							{
								label: 'Commits',
								format: function (d) {
									orgOrderValue++;
									return orgGrp.top(Infinity)[orgOrderValue].value;
								}
							}
						]);

					if ((size+5) < authGrp.top(Infinity).length-1) {
						sizeAuth = size+5;
					} else {
						sizeAuth = authGrp.top(Infinity).length-1;
					}
					var authOrderKey = -1;
					var authOrderValue = -1;
					tableAuth
						.dimension(orgDim)
						.group(function (d) {return '';})
						.size(sizeAuth)
						.columns([
							{
								label: 'Authors',
								format: function(d){
									authOrderKey++;
									return authGrp.top(Infinity)[authOrderKey].key;
								}
							},
							{
								label: 'Commits',
								format: function (d) {
									authOrderValue++;
									return authGrp.top(Infinity)[authOrderValue].value;
								}
							}
						]);
					dc.redrawAll();
				}
			}
		});
    });

/********************************************************** Tabla Org ********************************************************/

	
	var orderOrgKey = -1;
	var orderOrgVal = -1;
    tableOrg
        .dimension(orgDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            {
            label: 'Organizations',
                format: function(d){
                    orderOrgKey++;
					return orgGrp.top(Infinity)[orderOrgKey].key;
                }
            },
            {
                label: 'Commits',
                format: function (d) {
                    orderOrgVal++;
					return orgGrp.top(Infinity)[orderOrgVal].value;
                }
            }
        ]);
        
    tableOrg.on('renderlet', function(table) {
        tableOrg.selectAll('.dc-table-group').classed('info', true);
//        tableOrg.selectAll(".dc-table-column._2").on("click", function(d){
//            companyPie.filter(d.company)
//            dc.redrawAll();
//        });
    });

/********************************************************** Table Auth ********************************************************/

	var authOrderKey = -1;
	var authOrderVal = -1;

    tableAuth
        .dimension(authDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            {
            label: 'Authors',
                format: function(d){
                    authOrderKey++;
					return orgGrp.top(Infinity)[authOrderKey].key;
                }
            },
            {
                label: 'Commits',
                format: function (d) {
                    authOrderVal++;
					return orgGrp.top(Infinity)[authOrderVal].value;
                }
            }
        ]);
        
    tableAuth.on('renderlet', function(table) {
        tableAuth.selectAll('.dc-table-group').classed('info', true);
    });
}
