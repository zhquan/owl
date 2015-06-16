function Pies(){

	commitsPie = dc.pieChart('#chart1');
    commitsNamePie = dc.pieChart('#chart2');
    repoPie = dc.pieChart('#chart3');

    var dim = ndx.dimension(function(d){
        return d.company;
    })

    var grp = dim.group()

    commitsPie
    .width(472)
    .height(270)
    .dimension(dim)
    .group(grp)
    .cx(300)
    .cap(14)
    .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));;


    var dim2 = ndx.dimension(function(d){
        return d.name;
    })

    dim2.group().all().forEach(function(element){
        users.push(element.key)
    })

    var grp2 = dim2.group()

    commitsNamePie
    .width(472)
    .height(270)
    .dimension(dim2)
    .group(grp2)
    .cx(300)
    .cap(14)
    .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));

    var dim3 = ndx.dimension(function(d){
        return d.repo;
    })

    var grp3 = dim3.group()

    repoPie
    .width(472)
    .height(270)
    .dimension(dim3)
    .group(grp3)
    .cap(14)
    .cx(300)
    .legend(dc.legend().x(17).y(3).itemHeight(13).gap(5));

}