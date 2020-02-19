function worldMap(data) {

    /**
     * Task 14 - Create a leaflet map and put center to 10,15 with zoom scale of 1
     */
    var leaflet_map = L.map('mapid').setView([40.758896, -73.985130], 12);

    /**
     * Task 15 - Get the tileLayer from the link at the bottom of this file
     * and add it to the map created above.
    */
    L.tileLayer(map_link()).addTo(leaflet_map);
    /**
     * Task 16 - Create an svg call on top of the leaflet map.
     * Also append a g tag on this svg tag and add class leaflet-zoom-hide.
     * This g tag will be needed later.
     */
    var svg_map = d3.select(leaflet_map.getPanes()
               .overlayPane).append("svg");
    var g = svg_map.append("g")
                .attr("class", "leaflet-zoom-hide" );
    /**
     * Task 17 - Create a function that projects lat/lng points on the map.
     * Use latLngToLayerPoint, remember which goes where.
    */
    function projectPointsOnMap(x, y){
        if( !isNaN(x) && !isNaN(y)){
        var points = leaflet_map.latLngToLayerPoint(new L.LatLng(x,y));
        this.stream.point(points.x, points.y);
        }
    }
    /**
     * Task 18 - Now we need to transform all to the specific projection
     * create a variable called transform and use d3.geoTransform with the function above a parameter
     * {point:function.}
     * Create another variable names d3geoPath to project this transformation to it.
     */
    //Transforming to the specific projection
    var transform = d3.geoTransform({point: projectPointsOnMap});
    var d3path = d3.geoPath().projection(transform);
    // similar to projectPoint this function converts lat/long to
    //svg coordinates except that it accepts a point from our
    //GeoJSON
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
    //<---------------------------------------------------------------------------------------------------->

    /**
     * Task 19 - Plot the dots on the map
     * Create a variable and name it feature.
     * select all circle from g tag and use data.features.
     * Also add a class called mapcircle and set opacity to 0.4
     */
     var cValue = function(d) { return d;};
     var scaleQuantColor = d3.scaleQuantile()
     .range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb",
             "#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
     .domain([0,9]);

    //features for the points
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

    /**
     * Task 20 - Call the plot function with feature variable
     * not integers needed.
     */
    //points.plot(feature);

    //Redraw the dots each time we interact with the map
    //Remove comment tags when done with task 20
    leaflet_map.on("moveend", reset);
    reset();

    //Mouseover
    //Remove comment tags when done with task 20
    mouseOver(feature);
    mouseOut(feature);

    //Mouse over function
    function mouseOver(feature){

        feature
            .on("mouseover", function (d) {
                selection = d3.select(this)
                    .attr('r', 15)
                //Update the tooltip position and value
                points.tooltip(d);

                //Uncomment if implemented
                //focus_plus_context.hovered();

            });
    }

    //Mouse out function
    function mouseOut(feature){

        feature
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", function (d) {
                        if (d.properties.DEATHS == null) {
                            return 3;
                        }
                        else {
                            return scaleQuantRad(d.properties.DEATHS);
                        }
                    });

            });
    }

    // Recalculating bounds for redrawing points each time map changes
    function reset() {
        var bounds = d3path.bounds(data)
        topLeft = [bounds[0][0] + 10, bounds[0][1] - 10]
        bottomRight = [bounds[1][0] + 10, bounds[1][1] + 10];

        // Setting the size and location of the overall SVG container
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

    //<---------------------------------------------------------------------------------------------------->

    /**
     * Update the dots on the map after brushing
     */
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

    //<---------------------------------------------------------------------------------------------------->

    /**
     * Function for hovering the points, implement if time allows.
     */
    this.hovered = function (input_point) {
        console.log("If time allows you, implement something here!");
    }

    //<---------------------------------------------------------------------------------------------------->

    //Link to get the leaflet map
    function map_link() {
        return "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png";
    }

}
