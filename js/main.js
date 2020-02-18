
var world_map, focus_plus_context, points,dbscanner

function parseData(data){
    var d = [];
    var timeParse = d3.timeParse("%d/%m/%Y");
    data.forEach(element => {
        d.push(
            {
                Latitude: parseFloat(element.Latitude),
                Longitude: parseFloat(element.Longitude),
                Date_occurance: timeParse(element.CMPLNT_FR_DT),
                Time_occurance: element.CMPLNT_FR_TM,
                Date_solved: timeParse(element.CMPLNT_TO_DT),
                Time_solved: (element.CMPLNT_TO_TM),
                Type: element.OFNS_DESC,
                KeyCord: parseInt(element.KY_CD),
                Boro: element.BORO_NM,
            }
            );
    });
    var datany = {features: d, column: data.column};
    return datany;

}

d3.csv("data/NYPD_Complaint_Data_Historic.csv", function(data){
    data = parseData(data)



    world_map = new worldMap(data);



    dbscanner = DBSCAN().data(data).eps(30).minPts(1);
    var point_assignment_result = dbscanner();
    console.log('Resulting DBSCAN output', point_assignment_result);



});
