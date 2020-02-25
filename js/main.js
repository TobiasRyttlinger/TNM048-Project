
var world_map,dbscanner, chart


d3.csv("data/NYPD_Complaint_Data_Historic.csv", function(data){
    data = parseData(data);
    console.log(data)

    var Age_array = [];
    for (var i = 0; i < data.features.length; i++){
          Age_array[i] =  getRandomInt(18, 82);
    }

    var Length_array = [];
    for (var i = 0; i < data.features.length; i++){
          Length_array[i] =  getRandomInt(140, 210);
    }
    Age_array.forEach(function (d, i) {
          data.features[i].Age = d;

    });
    Length_array.forEach(function (d, i) {
          data.features[i].Length = d;

    });


    dbscan_result = DBSCAN().eps(6.2).minPts(45).data(data.features);
    var [ClusterAssignment,NumClusters] = dbscan_result();


    var numberOfClusters = [];
    ClusterAssignment.forEach(function (d, i) {
    			data.features[i].cluster = d;

  	});


    console.log(NumClusters);
    world_map = new worldMap(data,NumClusters);
    chart = new parallelCoordinates(data);

});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


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
                Date_occurance: dateParse(element.CMPLNT_FR_DT ),
                Time_occurance: timeP(element.CMPLNT_FR_TM),
                Reported: dateParse(element.RPT_DT),
                Completed: element.CRM_ATPT_CPTD_CD,
                Level: element.LAW_CAT_CD,
                Type: element.OFNS_DESC,
                KeyCord: parseInt(element.KY_CD),
                Boro: element.BORO_NM,
                Place: element.PREM_TYP_DESC
            }}
            );

    });
    var datany = {type: "FeatureCollection", features: d};
    return datany;

}
function dateParse(d){
    var v = d.split('/');
    return {string: d, date: parseInt(v[0]), month: parseInt(v[1]), year: parseInt(v[2])}
}
function timeP(d){
    var v = d.split(':');
    return {string: d, hour: parseInt(v[0]), min: parseInt(v[1]), sec: parseInt(v[2])}
}
