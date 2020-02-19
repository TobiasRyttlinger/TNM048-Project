
var world_map, focus_plus_context, points,dbscanner


d3.csv("data/NYPD_Complaint_Data_Historic.csv", function(data){
    data = parseData(data);

    dbscanner = DBSCAN().data(data.features).eps(0.2).minPts(10);
    var point_assignment_result = dbscanner();
    console.log('Resulting DBSCAN output', point_assignment_result);
    var ClusterData  = [];

    point_assignment_result.forEach(function (d, i) {
    			data.features[i].cluster = d;
    		});

    world_map = new worldMap(data);

});


function parseData(data){
    var d = [];
    var i = 0;
    var timeParse = d3.timeParse("%d/%m/%Y");
    data.forEach(element => {


        d.push({geometry:{
            type:"Point",
            coordinates:[
             parseFloat(element.Latitude),
             parseFloat(element.Longitude)
            ]
        },type:"Feature", id: i++, properties:
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
            }}
            );

    });
    var datany = {type: "FeatureCollection", features: d};
    return datany;

}
