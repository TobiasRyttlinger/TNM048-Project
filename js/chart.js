
function parallelCoordinates(data){
  // set the dimensions and margins of the graph
var margin = {top: 30, right: 10, bottom: 10, left: 0},
width = 500 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#parallel")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  var dimensions = [
    {
      Name: "KeyCode", 
      scale: d3.scaleOrdinal().range([0, height]),
      type: "number"
      
    }, 
    {
      Name: "Boro", 
      scale: d3.scaleOrdinal().range([0, height]),
      type: "string"
      
    },    
    {
      Name: "Boro", 
      scale: d3.scaleOrdinal().range([0, height]),
      type: "string"
      
    },
    {
      Name: "Boro", 
      scale: d3.scaleOrdinal().range([0, height]),
      type: "string"
      
    } 
  ] 

  /*// Extract the list of dimensions we want to keep in the plot. 
  dimensions = d3.keys(data.features[0].properties).filter(function(d) { 
    if(d == "Boro" ) return d;
    if(d == "Reported" ) return d;
    if(d == "KeyCode" ) return d;
    if(d == "Place" ) return d;
    return d == "Level"  })

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleOrdinal()
      .domain( d3.extent(data.features, function(d) {
        return +d.properties[name]; }) )

        //.domain( d3.extent(data.features, function(d) {
        //return +d.properties[name]; }) )
      .range([height, 0])
  }*/
  console.log(dimensions)
  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { 
        return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter().append("path")
    .attr("d",  path)
    .style("fill", "none")
    .style("stroke", "#69b3a2")
    .style("opacity", 0.5)

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(d.scale)); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d.Name; })
      .style("fill", "black")

}
