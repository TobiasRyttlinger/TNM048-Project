
var world_map, focus_plus_context, points
console.log(location)
d3.csv("data/Population_by_Borough_NYC.csv", function(data){
    //Plotting
    points = new Points();
    //Working with the map
    world_map = new worldMap(data);
    //Working with the focus+context
    focus_plus_context = new focusPlusContext(data);

});