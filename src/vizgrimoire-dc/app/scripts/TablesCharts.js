function Tables(){

	
	tableRepo = dc.dataTable('#tableRepo', 'tables');
    tableOrg = dc.dataTable('#tableOrg', 'tables');
    table = dc.dataTable('#table', 'commitsTable');
	tableAuth = dc.dataTable('#tableAuth', 'tables');

    var dateDim = ndx.dimension(function (d) {
        return d.date;
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
        table.selectAll('.dc-table-group').classed('info', true);
        table.selectAll(".dc-table-column._0").on("click", function(d){
            repoPie.filter($(this).html())
            document.dispatchEvent(pieClickEvent);
        });
    });
/********************************************************** Table ********************************************************/
    table
        .dimension(dateDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            {
	            label: 'Date',
                format: function(d){
                    return d.date.toISOString(); 
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
            return d.date;
        })
        .order(d3.descending);
    table.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
        table.selectAll(".dc-table-column._1").on("click", function(d){
            authDim.filter(d.name)
            document.dispatchEvent(pieClickEvent);
        });

        /*
		while(true){
			if($('body').outerHeight() > $(window).innerHeight()){
				break;
			} else {
				var sizeTable = table.size();
				table.size(sizeTable+10);
				updateRepo(sizeTable+10);
				updateOrg(sizeTable+10);
				updateAuth(sizeTable+10);
				dc.redrawAll('time');
                dc.redrawAll('other');
				sizeTableInit = table.size();
			}
		}

		$( window ).scroll(function() {
			if(($(this).scrollTop() == ($('body').outerHeight() - $(window).innerHeight())) || ($(this).scrollTop()-1 == ($('body').outerHeight() - $(window).innerHeight()))) {
			    var size = table.size();
				var numero = $('.dc-data-count.dc-chart').html().split('<strong>')[1].split('</strong>')[0];
				var total = parseInt(numero);
				if (numero.split(',')[1] != undefined){
					total = parseInt(numero.split(',')[0]+numero.split(',')[1]);
				}
				if (size < total){
					table.size(size+4);
					var sizeRepo = size;
					var sizeOrg = size;
					var sizeAuth = size;
					if ((size+4) < repoGrp.top(Infinity).length){
						sizeRepo = size+4;
					} else {
						sizeRepo = repoGrp.top(Infinity).length;
					}
					updateRepo(sizeRepo);
                    if ((size+4) < orgGrp.top(Infinity).length) {
						sizeOrg = size+4;
					} else {
						sizeOrg = orgGrp.top(Infinity).length;
					}
					updateOrg(sizeOrg);

					if ((size+4) < authGrp.top(Infinity).length) {
						sizeAuth = size+4;
					} else {
						sizeAuth = authGrp.top(Infinity).length;
					}
					updateAuth(sizeAuth);
					dc.redrawAll('time');
                    dc.redrawAll('other');
				}
			}
		});*/
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
        table.selectAll('.dc-table-group').classed('info', true);
        table.selectAll(".dc-table-column._0").on("click", function(d){
console.log($(this).html())
            compPie.filter($(this).html())
            document.dispatchEvent(pieClickEvent);
        });
    });

/********************************************************** Table Auth ********************************************************/
    developDim = ndx.dimension(function (d) {
        return d.name;
    });

    developDim.group().all().forEach(function(element){
        users.push(element.key)
    })
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
					return authGrp.top(Infinity)[authOrderKey].key;
                }
            },
            {
                label: 'Commits',
                format: function (d) {
                    authOrderVal++;
					return authGrp.top(Infinity)[authOrderVal].value;
                }
            }
        ]);
        
    tableAuth.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
        table.selectAll(".dc-table-column._0").on("click", function(d){
            developDim.filter($(this).html());
            document.dispatchEvent(pieClickEvent);
        })
    });

/************************************Update Repo Table *******************************/
	function updateRepo(sizeRepo){
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
	}
/************************************ Update Org Table *******************************/
	function updateOrg(sizeOrg){ 
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
	}

/************************************ Update Org Table *******************************/
	function updateAuth(sizeAuth){
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
	}
}
