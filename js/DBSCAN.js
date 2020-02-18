
(function () {
	DBSCAN = function () {
		var data =[];
		var minPoints;
		var eps;
		var clusters = [];
		var status = [];
		var distance = euclidean_distance;

		function euclidean_distance(point1,point2){
				return Math.sqrt(Math.pow((point2.Latitude - point1.Latitude), 2) + Math.pow((point2.Longitude - point1.Longitude), 2));
		};

		function getNeighbours(point_index){
				neighbours = [];
				var d = data[point_index];

				for(var i = 0; i<data.length; i++){
					if(point_index == 1){
						continue;
					}
					if(distance(data[i],d) <= eps){
				
						neighbours.push(i);
					}
		}

		return neighbours;
	};

			function expand_cluster(point_index, neighbours, cluster_index) {
					clusters[cluster_index-1].push(point_index); // Add point to the cluster
					status[cluster_index] = cluster_index;	//Also asign the cluster to the index

					for( var i = 0; i < neighbours.length; i++){
						var currentPointIndex = neighbours[i];  //Get current index from neighbours

							if(status[currentPointIndex] === undefined) { //if we have not visited or assigned the current point

								status[currentPointIndex] = 0; //Marks that the point have been visited now
								var currentNeighbour = getNeighbours(currentPointIndex); //Get neighbours to the visited point
								numCurrNeighbours = currentNeighbour.length; // Get amount of neighbours that matches our Epsilon

								if(numCurrNeighbours < minPoints){ //If  the cluster does not match our current set min number of points
									expand_cluster(currentPointIndex,numCurrNeighbours,cluster_index);	//Run expand cluster again to get more points!
								}
							}
							else if(status[currentPointIndex] < 1){ //When current point is not assigned but visited (= 0)
								status[currentPointIndex] = cluster_index;
								clusters[cluster_index - 1].push(currentPointIndex);
							}
					}
			};


			var DBscan  = function(){
				//Creating variables
					status = [];
					clusters = [];

					for(var i = 0; i < data.length; i++){ // Loop through data to get each memeber

							if(status[i] === undefined){ //Status has not been visited yet

								var neighbours = getNeighbours(i); //Get neighbours of current index
								var NumNeighbours = neighbours.length; // Check length as before
								if(NumNeighbours < minPoints){
									status[i] = 0; //Irrelant, treated as noise
								}
								else{ //creating empty cluster
									clusters.push([]);
									var cluster_index = clusters.length; //Reach index of new cluster with the knowledge that it is added at the end of the list.
									expand_cluster(i,neighbours,cluster_index	); //Expand around the new cluster!
								}
							}
					}

					return status;
			};
//Might be unnesesary :D But used to get clusters if we want to
			DBscan.getClusters = function() {
				var Num_Cluster = clusters.length;
				var cluster_centers = [];

				for(var i = 0; i < Num_cluster; i++){

					cluster_centers[i] = [0,0];

					for(var j = 0; j < clusters[i].length; j++){
							cluster_centers[i].x += data[clusters[i][j]].x;
						  cluster_centers[i].y += data[clusters[i][j]].y;

					}
					clusters_centers[i].x /= clusters[i].length;
										cluster_centers[i].y /= clusters[i].length;
										cluster_centers[i].dimension = clusters[i].length;
										cluster_centers[i].parts = clusters[i];
				}
				return cluster_centers;
			};

			DBscan.data = function (d) {
			if (arguments.length === 0) {
				return data;

			}
			if (Array.isArray(d)) {
				data = d;
			}

			return DBscan;
		};

		DBscan.eps = function (e) {
			if (arguments.length === 0) {
				return eps;
			}
			if (typeof e === "number") {
				eps = e;
			}

			return DBscan;
		};

		DBscan.minPts = function (p) {
			if (arguments.length === 0) {
				return minPts;
			}
			if (typeof p === "number") {
				minPts = p;
			}

			return DBscan;
		};

		return DBscan;
}

})();
