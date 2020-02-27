var width = 975;
var height = 720;
var keys = ["Completed", "Level","Boro", "Age_vic", "Sex_vic"];

function ParallelSets(data,numClusters){



  var cValue = function(d) { return d;};
  var scaleQuantColor = d3.scaleQuantile()
  .range(["#111111","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"])
  .domain([0,12]);

  var sankey = d3.sankey()
  .nodeSort(null)
  .linkSort(null)
  .nodeWidth(4)
  .nodePadding(20)
  .extent([[0, 5], [width, height - 5]]);

  var graph = {
    index: -1,
    nodes: [],
    links: [],
    nodeByKey: new Map,
    indexByKey: new Map
  };

  for (const k of keys) {
    for(const d of data){

      var key = JSON.stringify([k, d.properties[k]]);
      if (graph.nodeByKey.has(key)){
        continue;
      }
      const node = {name: d.properties[k], cluster: d.cluster};
      graph.nodes.push(node);
      graph.nodeByKey.set(key, node);
      graph.indexByKey.set(key, ++graph.index);
    }
  }

  for (let i = 1; i < keys.length; ++i) {
    const a = keys[i - 1];
    const b = keys[i];

    const prefix = keys.slice(0, i + 1);
    const linkByKey = new Map;
    for (const d of data) {
      const names = prefix.map(k => d.properties[k]);
      const cluster= d.properties.cluster;

      const key = JSON.stringify(names);
      let link = linkByKey.get(key);
      const value = 1;

      if (link) {
        link.value += value;
        continue;
      }

      link = {
        source: graph.indexByKey.get(JSON.stringify([a, d.properties[a]])),
        target: graph.indexByKey.get(JSON.stringify([b, d.properties[b]])),
        cluster,
        names,
        value
      };
      graph.links.push(link);
      linkByKey.set(key, link);

    }
  }

  console.log(graph);


  const {nodes, links} = sankey({
    nodes: graph.nodes.map(d => Object.assign({}, d)),
    links: graph.links.map(d => Object.assign({}, d))
  });


  const svg = d3.select('#vis')
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);
  var g = svg.append("g")

  svg.append("g")
  .selectAll("rect")
  .data(nodes)
  .enter()
  .append("rect")
  .attr("x", d => d.x0)
  .attr("y", d => d.y0)
  .attr("height", d => d.y1 - d.y0 + 7 )
  .attr("width", d => d.x1 - d.x0 )
  .append("title")
  .text(d => `${d.name}`);

  svg.append("g")
  .attr("fill", "none")
  .selectAll("g")
  .data(links)
  .enter()
  .append("path")
  .attr("d", d3.sankeyLinkHorizontal())
  .attr("stroke-width", d => d.width+2)
  .attr("stroke",  function(d){
    if(d.cluster === 0){
      return "#ccc";
    }
  return scaleQuantColor(cValue(d.cluster));
  })
  .style("mix-blend-mode", "multiply")
  .on('mouseover', handleMouseOver)
  .on('mouseout', handleMouseOut)
  .append("title")
  .text(d => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`);



  svg.append("g")
  .style("font", "10px sans-serif")
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
  .attr("y", d => (d.y1 + d.y0) / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
  .text(d => d.name)
  .append("tspan")
  .attr("fill-opacity", 0.7)
  .text(d => ` ${d.value.toLocaleString()}`);

  function handleMouseOver(d, i) {  // Add interactivity

        }

        function handleMouseOut(d, i) {  // Add interactivity


              }

  return svg.node();
}
