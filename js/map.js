function worldMap(data) {


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
     .range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb",
             "#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
     .domain([0,9]);


    var feature = g.selectAll("circle")
                .data(data.features)
                .enter()
                .append("circle")
                .attr("class", "mapcircle")
                .style("opacity", 1)
                .attr('r', 5)
                 .style("fill", function(d) {
                    return scaleQuantColor(cValue(d.cluster));
                  });

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
