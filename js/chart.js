
function parallelSets(data){


var vis = d3.select("#vis").append("svg")
    .attr("width", chart.width())
    .attr("height", chart.height())
    .text('hej');

var partition = d3.layout.partition()
    .sort(null)
    .size([chart.width(), chart.height() * 5 / 4])
    .children(function(d) { return d.children ? d3.values(d.children) : null; })
    .value(function(d) { return d.count; });


}
