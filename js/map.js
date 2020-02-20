function worldMap(data,numClusters) {


    var leaflet_map = L.map('mapid').setView([40.730610, -73.935242], 10);
    L.tileLayer(map_link()).addTo(leaflet_map);

    var svg_map = d3.select(leaflet_map.getPanes()
               .overlayPane).append("svg");
    var g = svg_map.append("g")
                .attr("class", "leaflet-zoom-hide" );

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



     var cValue = function(d) { return d;};
     var scaleQuantColor = d3.scaleQuantile()

    .range(["#111111","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"])
    .domain([0,12]);



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
                      .select('#report')
                      .text(function () {
                        var day = d.properties.Reported.date -d.properties.Date_occurance.date;
                        var m = d.properties.Reported.month- d.properties.Date_occurance.month;
                        var y = d.properties.Reported.year - d.properties.Date_occurance.year;
                        var total = y*365 + m*30 +day;
                        
                        return 'Reported after : ' + total + " days";})                          
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




    // Recalculating bounds for redrawing points each time map changes
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

        //Call plot funtion.
        points.plot(map_points_change)

        d3.selectAll(".mapcircle")
            .filter(function (d) { return curr_view_erth.indexOf(d.id) == -1; })
            .transition()
            .duration(800)
            .attr('r', 0)
    }


    this.hovered = function (input_point) {
        console.log("If time allows you, implement something here!");
    }

    function map_link() {
        return "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png";
    }

}
