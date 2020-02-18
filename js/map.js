
function worldMap(data) {


     var map = L.map('mapid').setView([40.73, -73.79], 10);


     L.tileLayer(map_link()).addTo(map);


     var svg_map = d3.select(map.getPanes().overlayPane).append("svg")
	 var g = svg_map.append("g");

     function projectPointsOnMap(x, y){
        if(!isNaN(d.Longitude) || !isNaN(d.Latitude)){
            var x = d.Latitude;
            var y = d.Longitude;
            return map.latLngToLayerPoint(new L.LatLng(y, x));
        }
    } 
    //Transforming to the specific projection
    var transform = d3.geoTransform({point: projectPointsOnMap});
    var d3path = d3.geoPath().projection(transform);
    
    function applyLatLngToLayer(d) {
        if(!isNaN(d.Longitude) || !isNaN(d.Latitude)){
            var x = d.Latitude;
            var y = d.Longitude;
            return map.latLngToLayerPoint(new L.LatLng(y, x));
        }
    }

     console.log(data.features);
     var features = g.selectAll("circle")
        .data(data.features)
        .enter()
        .append("circle")
        .attr("cx", function(d){ 
            if(!isNaN(d.Longitude) || !isNaN(d.Latitude)){
                var points = map.latLngToLayerPoint(
                    new L.LatLng(d.Longitude,d.Latitude));
                
                return points.y
            }
            
        
        })
        .attr("cy", function(d){ 
            if(!isNaN(d.Longitude) || !isNaN(d.Latitude)){
                var points = map.latLngToLayerPoint(
                    new L.LatLng(d.Longitude,d.Latitude));
               return points.x
            }})
        .attr("r", 10)
    
        map.on("moveend", reset);
        reset();
        function reset() {
            var bounds = d3path.bounds(data)
            console.log(bounds)
            topLeft = [bounds[0][0] + 10, bounds[0][1] - 10]
            bottomRight = [bounds[1][0] + 10, bounds[1][1] + 10];
    
            // Setting the size and location of the overall SVG container
            svg_map
                .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");
    
            g.attr("transform", "translate(" + (-topLeft[0]) + "," + (-topLeft[1]) + ")");
    
            features.attr("transform",
                function (d) {
                    if(!isNaN(d.Longitude) || !isNaN(d.Latitude)){
                    return "translate(" +
                        applyLatLngToLayer(d).x + "," +
                        applyLatLngToLayer(d).y + ")";
                }});
        }
    function map_link() {
        return 'https://api.mapbox.com/styles/v1/josecoto/civ8gwgk3000a2ipdgnsscnai/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWNvdG8iLCJhIjoiY2l2OGZxZWNuMDAxODJ6cGdhcGFuN2IyaCJ9.7szLs0lc_2EjX6g21HI_Kg';
    }

}
