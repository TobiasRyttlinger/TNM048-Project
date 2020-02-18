
function worldMap(data) {


     var map = L.map('mapid').setView([40.73, -73.79], 10);


     L.tileLayer(map_link()).addTo(map);


    // map._initPathRoot()

     var svg = d3.select("#map").select("svg"),
	   g = svg.append("g");


     console.log(data.Longitude);
    function map_link() {
        return 'https://api.mapbox.com/styles/v1/josecoto/civ8gwgk3000a2ipdgnsscnai/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWNvdG8iLCJhIjoiY2l2OGZxZWNuMDAxODJ6cGdhcGFuN2IyaCJ9.7szLs0lc_2EjX6g21HI_Kg';
    }

}
