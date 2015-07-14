function tableUpdate(type) {
/*	if (type == 'reset'){
		table.size(sizeTableInit);
		tableRepo.size(sizeTableInit);
		tableOrg.size(sizeTableInit);
		tableAuth.size(sizeTableInit);
	} else if ((type == 'click') || (type == 'time')) {
        var numero = $('.dc-data-count.dc-chart').html().split('<strong>')[1].split('</strong>')[0];
		var total = parseInt(numero);
		if (numero.split(',')[1] != undefined){
			total = parseInt(numero.split(',')[0]+numero.split(',')[1]);
		}
        var sizeRepo = tableRepo.size();
        var sizeOrg = tableOrg.size();
        var sizeAuth = tableAuth.size();
        if (sizeRepo > total) {
            tableRepo.size(total);
        }
        if (sizeOrg > total) {
            tableOrg.size(total);
        }
        if (sizeAuth > total) {
            tableAuth.size(total);
            table.size(total);
        }
    }*/
    if (type == 'more') {
        tableRepo.size(tableRepo.size()+4);
		tableOrg.size(tableOrg.size()+4);
		tableAuth.size(tableAuth.size()+4);
    }
	var order = -1;
	var order2 = -1;
	tableRepo
        .columns([
            {
            	label: 'Repositories',
                format: function(d){
					order++;
					if (order > tableRepo.size()-1){
						order = 0;
					}
					return repoGrp.top(Infinity)[order].key;
                }
            },
            {
            	label: 'Commits',
                format: function(d){
					order2++;
					if (order2 > tableRepo.size()-1){
						order2 = 0;
					}
					return repoGrp.top(Infinity)[order2].value;
                }
            }
        ]);
	var orgOrderKey = -1;
	var orgOrderValue = -1;
	tableOrg
		.columns([
			{
				label: 'Organizations',
				format: function(d){
					orgOrderKey++;
					if (orgOrderKey > tableOrg.size()-1){
						orgOrderKey = 0;
					}
					return orgGrp.top(Infinity)[orgOrderKey].key;
				}
			},
			{
				label: 'Commits',
				format: function (d) {
					orgOrderValue++;
					if (orgOrderValue > tableOrg.size()-1){
						orgOrderValue = 0;
					}
					return orgGrp.top(Infinity)[orgOrderValue].value;
				}
			}
		]);
	var authOrderKey = -1;
    var authOrderValue = -1;
    tableAuth
        .columns([
            {
                label: 'Authors',
                format: function(d){
                    authOrderKey++;
					if (authOrderKey > tableAuth.size()-1){
						authOrderKey = 0;
					}
                    return authGrp.top(Infinity)[authOrderKey].key;
                }
            },
            {
                label: 'Commits',
                format: function (d) {
                    authOrderValue++;
					if (authOrderValue > tableAuth.size()-1){
						authOrderValue = 0;
					}
                    return authGrp.top(Infinity)[authOrderValue].value;
                }
            }
        ]);
}

function draw_messages_table (ndx) {
    var dateDim = ndx.dimension(function (d) {
        return d.date;
    });
    table = dc.dataTable('#table', 'commitsTable');
    table
        .dimension(dateDim)
        .group(function (d) {return '';})
        .size(7)
        .columns([
            {
	            label: 'Date',
                format: function(d){
                    return d.date; 
                }
            },
            {
                label: 'Message',
                format: function(d) {
                    return d.message;
                }
            },
            {
                label: 'Developer',
                format: function(d) {
                    return d.auth_name;
                }
            },
			{
				label: 'Organization',
				format: function(d) {
					return d.org_name;
				}
			},
			{
				label: 'Repository',
				format: function(d) {
					return d.repo_name;
				}
			},
            {
                label: 'TZ',
                format: function(d) {
                    return d.tz;
                }
            }
        ])
        .sortBy(function (d) {
            return d.date;
        })
        .order(d3.descending);

    table.on('renderlet', function(table) {
        table.selectAll('.dc-table-group').classed('info', true);
    });

    dc.renderAll('commitsTable');
}
