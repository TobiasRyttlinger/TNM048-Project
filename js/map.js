
function worldMap(data,numClusters) {
  //

  var leaflet_map = L.map('mapid', { zoomControl: false }).setView([40.730610, -73.935242], 10);
  L.tileLayer(map_link()).addTo(leaflet_map);

  var svg_map = d3.select(leaflet_map.getPanes()
  .overlayPane).append("svg");
  var g = svg_map.append("g")
  .attr("class", "leaflet-zoom-hide" );




  var cValue = function(d) { return d;};
  var scaleQuantColor = d3.scaleQuantile()
  .range(["#111111","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"])
  .domain([0,12]);




  //-------------choropleth to map -----------
  //Count the amount of crimes in each boro
  //place it in topoData
  var topoData = new getData();
  var m =  b = x = s = q = 0;
  countCrime(data)

  function countCrime(data){
    data.features.forEach(element => {
      if(element.properties.Boro == "MANHATTAN")++m
      if(element.properties.Boro == "BROOKLYN")++b
      if(element.properties.Boro == "BRONX")++x
      if(element.properties.Boro == "STATEN ISLAND")++s
      if(element.properties.Boro == "QUEENS")++q
    });
    topoData.features.forEach(element => {
      if(element.properties.BoroName == "Manhattan") element.properties.amoutOfCrime =  m;
      if(element.properties.BoroName == "Brooklyn")element.properties.amoutOfCrime =  b;
      if(element.properties.BoroName == "Bronx")element.properties.amoutOfCrime =  x;
      if(element.properties.BoroName == "Staten Island")element.properties.amoutOfCrime =  s;
      if(element.properties.BoroName== "Queens")element.properties.amoutOfCrime =  q;
    })
  }

  //color depending on crime
  var boroColor = d3.scaleLinear()
  .domain([0, 409])
  .range(['white', 'red']);
  //style of choropleth

  /*Legend specific*/
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(leaflet_map) {

  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<span> Crime rate</span><br>';
  div.innerHTML += '<i style="background:'+boroColor(m)+'"></i><span>'+m+' Crimes</span><br>';
  div.innerHTML += '<i style="background: '+boroColor(b)+'"></i><span>'+b+' Crimes</span><br>';
  div.innerHTML += '<i style="background: '+boroColor(x)+'"></i><span>'+x+' Crimes</span><br>';
  div.innerHTML += '<i style="background: '+boroColor(s)+'"></i><span>'+s+' Crimes</span><br>';
  div.innerHTML += '<i style="background: '+boroColor(q)+'"></i><span>'+q+' Crimes</span><br>';

  return div;

  };

legend.addTo(leaflet_map);

  function choroplethStyle(d) {
    return {

      fillColor: boroColor(d.properties.amoutOfCrime), //'#636363',
      weight: 1.5,
      opacity: 1,
      color: 'black',
      dashArray: '1',
      fillOpacity: 0.5,
      z:-1
    };
  };

    function highlightFeature(e) {
    var layer = e.target;
      layer.append("g")
          .text('Borough: ');
    console.log(e)
      
    layer.setStyle({
        weight: 5,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    //get textbox and print something?

  }
  function resetHighlight(e) {
    geoJ.resetStyle(e.target);
    //delet text
  }
  function zoomToFeature(e) {
    leaflet_map.fitBounds(e.target.getBounds());

  }
  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

  //Add choropleth to map
  var geoJ = L.geoJson(topoData, {
              style: choroplethStyle,
              onEachFeature: onEachFeature
            }).addTo(leaflet_map)

  //-------------------------------------------

  function projectPointsOnMap(x, y){
    if( !isNaN(x) && !isNaN(y)){
      var points = leaflet_map.latLngToLayerPoint(new L.LatLng(x,y));
      this.stream.point(points.x, points.y);
    }
  }


  var transform = d3.geoTransform({point: projectPointsOnMap});
  var d3path = d3.geoPath().projection(transform);

  function applyLatLngToLayer(d) {
    var x = d.geometry.coordinates[0];
    var y = d.geometry.coordinates[1];
    if( !isNaN(x) && !isNaN(y)){
      return leaflet_map.latLngToLayerPoint(new L.LatLng(x, y));
    }
    else{
      return leaflet_map.latLngToLayerPoint(new L.LatLng(0, 0));

    }
  }
  var feature = g.selectAll("circle")
  .data(data.features)
  .enter()
  .append("circle")
  .attr("class", "mapcircle")
  .style("opacity", 0.8)
  .attr('r', 5)
  .style("fill", function(d) {
    return scaleQuantColor(cValue(d.cluster));
  })
  .on('mouseover', function(d){
    d3.select(this)
    .attr('r', 10)
    var select = d3.select('#infobox')
    select
    .select('#borough')
    .text('Borough: ' + d.properties.Boro.toLowerCase());
    select
    .select('#date')
    .text('Date: ' + d.properties.Date_occurance.string+
    " Time: "+ d.properties.Time_occurance.string);
    select
    .select('#Age')
    .text('Age of criminal: ' + d.properties.Age + ' years');
    select
    .select('#Height')
    .text('Height of criminal: ' + d.properties.Length +' cm');
    select
    .select('#report')
    .text(function () {return 'Reported after : ' +  d.properties.Reported.days  + " days";})
    select
    .select('#completed')
    .text('The crime was: ' + d.properties.Completed.toLowerCase());
    select
    .select('#place')
    .text('Place the crime was  commited: ' + d.properties.Place. toLowerCase());
    select
    .select('#type')
    .text('Type of crime: ' + d.properties.Type.toLowerCase());
  })
  .on('mouseout', function(d){
    d3.select(this)
    .transition()
    .duration(300)
    .attr('r', 5);
  })


  leaflet_map.on("moveend", reset);
  reset();
  function reset() {
    var bounds = d3path.bounds(data)
    topLeft = [bounds[0][0] + 10, bounds[0][1] - 10]
    bottomRight = [bounds[1][0] + 10, bounds[1][1] + 10];
    svg_map
    .attr("width", bottomRight[0] - topLeft[0])
    .attr("height", bottomRight[1] - topLeft[1])
    .style("left", topLeft[0] + "px")
    .style("top", topLeft[1] + "px");

    g.attr("transform", "translate(" + (-topLeft[0]) + "," + (-topLeft[1]) + ")");

    feature.attr("transform",
    function (d) {
      return "translate(" +
      applyLatLngToLayer(d).x + "," +
      applyLatLngToLayer(d).y + ")";
    });

  }


  this.change_map_points = function (curr_view_erth) {

    map_points_change = d3.selectAll(".mapcircle")
    .filter(function (d) { return curr_view_erth.indexOf(d.id) != -1; })
    .attr('r', 7)
    .transition()
    .duration(800);


    d3.selectAll(".mapcircle")
    .filter(function (d) { return curr_view_erth.indexOf(d.id) == -1; })
    .transition()
    .duration(800)
    .attr('r', 0)
  }

  function map_link() {
    return "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png";
  }
}
