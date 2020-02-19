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

    var feature = g.selectAll("circle")
                .data(data.features)
                .enter()
                .append("circle")
                .attr("class", "mapcircle")
                .style("opacity", 0.5)
                .attr('r', 7)
                .attr('fill', "#4d4d4d")
                .on("mouseover", function (d) {
                    selection = d3.select(this)
                        .attr('r', 25)
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", function (d) {
                            return 7;
                        });

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
        return "https://api.mapbox.com/styles/v1/josecoto/civ8gwgk3000a2ipdgnsscnai/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWNvdG8iLCJhIjoiY2l2OGZxZWNuMDAxODJ6cGdhcGFuN2IyaCJ9.7szLs0lc_2EjX6g21HI_Kg";
    }

}
