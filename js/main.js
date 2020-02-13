
var world_map, focus_plus_context, points,dbscanner

d3.csv("data/NYPD_Complaint_Data_Historic.csv", function(data){
    //Plotting
    points = new Points();
    //Working with the map

    dbscanner = DBSCAN(data,30,1);
    var point_assignment_result = dbscanner();
    console.log('Resulting DBSCAN output', point_assignment_result);


});
