
var dbscanner

d3.csv("data/NYPD_Complaint_Data_Historic.csv", function(data){
    world_map = new worldMap(data);

    dbscanner = DBSCAN(data,30,1);
    var point_assignment_result = dbscanner();
    console.log('Resulting DBSCAN output', point_assignment_result);

});
