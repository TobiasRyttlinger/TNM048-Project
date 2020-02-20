
var world_map, focus_plus_context, points,dbscanner


d3.csv("data/NYPD_Complaint_Data_Historic.csv", function(data){
    data = parseData(data);
    console.log(data)

    dbscanner = DBSCAN().eps(0.015).minPts(30).data(data.features);
    var [ClusterAssignment,NumClusters] = dbscanner();

    var i = 0;
    while (i < data.features.length){
      const index = ClusterAssignment.indexOf(0);

      if (index > -1) {
         ClusterAssignment.splice(index, 1);
         data.features.splice(index, 1);
      }
      i++;
    }



    console.log('Resulting DBSCAN output', ClusterAssignment);

    console.log('Number of clusters', NumClusters);
    var ClusterData  = [];
    var numberOfClusters = [];
    ClusterAssignment.forEach(function (d, i) {
    			data.features[i].cluster = d;
    		});
    world_map = new worldMap(data,NumClusters);

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