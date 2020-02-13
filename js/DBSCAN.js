
(function () {
	DBSCAN = function (data,minPoints,eps) {
		//

		var clusters = [];
		var distance = euclidean_distance;

		function euclidean_distance(point1,point2){
				if (point1.length != point2.length){
					throw ("point1 and point2 must be of same dimension");
				}

				var sum =0;
				for(var i = 0; i < point1.length; i++){
					sum += Math.pow(Math.abs(point1[i] - point2[i]),2);
				}

				return Math.sqrt(sum);
		}

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
	}

			function expand_cluster(point_index, neighbours, cluster_index) {
					clusters[cluster_index-1].push(point_index); // Add point to the cluster
					status[cluster_index] = cluster_index;	//Also asign the cluster to the index

					for( var i = 0; i < neighbours.length; i++){
						var currentPointIndex = neighbours[i];  //Get current index from neighbours

							if(status[currentPointIndex]== undefined) { //if we have not visited or assigned the current point

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
			}


			var DBscan  = function(){
				//Creating variables
					status = [];
					clusters = [];

					for(var i = 0; i < data.length; i++){ // Loop through data to get each memeber
							if(status[i] == undefined){ //Status has not been visited yet
								var neighbours = getNeighbours(i); //Get neighbours of current index
								var NumNeighbours = neighbours.length; // Check lenght as before
								if(NumNeighbours < minPoints){
									status[i] = 0; //Irrelant, treated as noise
								}
							}
							else{ //creating empty cluster
								clusters.push([i]);
								var cluster_index = clusters.lenght; //Reach index of new cluster with the knowledge that it is added at the end of the list.
								expand_cluster(i,neighbours,cluster_index	); //Expand around the new cluster!
							}
					}
			}

			DBscan.getClusters = function() {
				var Num_Cluster = clusters.lenght;
				var cluster_centers = [];

				for(var i = 0; i < Num_cluster; i++){

					cluster_centers[i] = [x:0,y:0];

					for(var j = 0; j < clusters[i].lenght; j++){
							cluster_centers[i].x += data[clusters[i][j]].x;
						  cluster_centers[i].y += data[clusters[i][j]].y;

					}
					clusters_centers[i].x /= clusters[i].length;
										clusters_centers[i].y /= clusters[i].length;
										clusters_centers[i].dimension = clusters[i].length;
										clusters_centers[i].parts = clusters[i];
				}
			}
		return DBscan;
})();
