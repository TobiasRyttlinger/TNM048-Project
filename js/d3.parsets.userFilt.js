
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////      Initial Variables: Globals That Get Changed Based on User Interaction:  //////////////\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////
var userFilt = {};
// //////// array of possible dimensions the user could chose to visualize  /////////////////////////
userFilt["dimension_options"] = ["Completed","Age_vic","Sex_vic","Race_vic","Place","Boro","Level","Type"];
// //////// array of dimensions, the user has chosen to visualize or are given as starting example //////////////////////

userFilt["selected_options"] = ["Boro","Age_vic", "Level"];

// ///// object consisting of dimension name: value name key:value pairs - these limit the input CSV values to only rows that have these dimension:value pairs.
// ////////////items are added this like, key:[values] or dimension_name:[dimension_item_1, dimension_item_2] ////////////////////////////////////////////////////////////////////////////
userFilt["limitations"] ={};
// ///// array of all unique values for each dimension, used to populate secondary drop-down menu
userFilt["uniqueValuesForEachDimensionArrayOfObj"]  = [];
// /////// stops functions from rebuilding drop-down menus after initial load because I messed up and set it up dumb
userFilt["state"] = {"cycle":0}

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////   Helper Functions  /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////   replaces all examples of a certain character in a string
function findAndReplace(string, target, replacement) {
 var i = 0, length = string.length;
 for (i; i < length; i++) {
   string = string.replace(target, replacement);
 }
 return string;
}

///////////////// returns array of only unique items in the given array
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

//////// removes an item from array if present
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

///// removes an item from array if present
function popItemArray(array, item){
  for (each in array){
    if(array[each]===item){
      array.splice(each,1)
    }
  }
  return array
}


function curves() {
    // var t = vis.transition().duration(500);
    if (ice) {
      t.delay(1000);
      icicle();
    }
    t.call(chart.tension(this.checked ? .5 : .5));
    // t.call(chart.tension(0.5));
  }

////  checks if selected dimension is in selected dimensions array. If it isn't, adds it.
function checkIfDimensionSelectedChange(dimension){
    var foundMatch = "no"
    for (each in userFilt["selected_options"]){
      if(userFilt["selected_options"][each]===dimension){
        foundMatch = "yes"
      }
    }
    if (foundMatch==="no"){
      userFilt["selected_options"].push(dimension)
    }
    // console.log("WWW userFilt["selected_options"] in checkIfDimensionSelectedChange,",userFilt["selected_options"])
}

////////////////// function that changes limits to all in or all out if a dimension drop-down is clicked:
function checkIfDimSelectChangeLimit(dimension){
  /// handles dimension already checked that is now clicked:
  // console.log("zz zz dimension, ",dimension);
  // console.log("zz zz userFilt["selected_options"] =",selected_options)
  var helper = "not_present";
  for (each in userFilt["selected_options"]){
    if(userFilt["selected_options"][each]===dimension){
      if (each < -1) {
        userFilt["limitations"][dimension] = [];
        // userFilt["selected_options"].splice(each, 1);
        // userFilt["limitations"][dimension] = [];
        // console.log("zz zz -takeout- handling checkIfDimSelectChangeLimit(dimension), dimension=",dimension," and userFilt["limitations"][dimension] is now, ",userFilt["limitations"][dimension]);
        helper="present";
      }
    }
  }
  if (helper==="not_present"){
        // console.log("zz zz rr -putin- dimension not in userFilt["selected_options"] before in func checkIfDimSelectChangeLimit(dimension) =",dimension)
        popLimitObjForDim(dimension);
  }
}

///////////// function that adds all unique items for a given dimension to its limitation object key:value pair
function popLimitObjForDim(dimension){
  // var dimension_id = String(dimension);
  //   console.log("zz z type = ", typeof(dimension_id))
  // console.log("zz z dimension_id=",dimension)
  //   dimension_id = findAndReplace(dimension_id," ","_")
  var arrayNumber = findArrayObjNumber(dimension, userFilt["uniqueValuesForEachDimensionArrayOfObj"]);
    // console.log("arrayNumber is, ",arrayNumber)
    var this_key =Object.keys(userFilt["uniqueValuesForEachDimensionArrayOfObj"][arrayNumber])
    // console.log("this_key =", this_key);
    var current_dim_array = userFilt["uniqueValuesForEachDimensionArrayOfObj"][arrayNumber][this_key]
    // console.log("! current_dim_array= ",current_dim_array)
    // var DimFormat = findAndReplace(String(dimension)," ","_")
    userFilt["limitations"][dimension] = [];
    for (eachUniqueDimValue in current_dim_array){
      var UniqueDimValue = current_dim_array[eachUniqueDimValue];
      //var DimUvalFormat = findAndReplace(String(UniqueDimValue)," ","_")
      // console.log("userFilt["limitations"],",userFilt["limitations"]);
      // console.log("DimUvalFormat,",UniqueDimValue);
      userFilt["limitations"][dimension].push(UniqueDimValue)
      }

    // console.log("zz print userFilt["limitations"],",userFilt["limitations"])
}

 //// function that takes the dimension unformatted and finds the array object number of the array of objects
    //// of all unique values for each dimension that matches it
    ///// returns the array object number to match....
    function findArrayObjNumber(dimension, array_unique_values_for_each_dimension){
      for (each in array_unique_values_for_each_dimension){

        if (Object.keys(array_unique_values_for_each_dimension[each])[0] === dimension || Object.keys(array_unique_values_for_each_dimension[each])[1] === dimension || Object.keys(array_unique_values_for_each_dimension[each]) === dimension){
          /// this is the array number of the input array that matches:
          // console.log("findArrayObjNumber() each =",each)
          // console.log("findArrayObjNumber() dimension =",dimension)
          return each
        }
      }
      console.log("did not find a match in findArrayObjNumber(): Dimension is ",dimension," array_unique_values_for_each_dimension is ",array_unique_values_for_each_dimension)
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////  Builds Drop-Down Menus & populates Them   /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


/////// builds drop-down options as li
function build_dd_list(dimension_options,selected_options){
  if(userFilt["state"].cycle >0){
    return
  }
  else{userFilt["state"].cycle += 1}
  $("ul#dimensions_list").empty()
  //// get data from d3(csv) function but use here not in main chart build, as my brain is jello at current time
  //// this is probably a really bad way to do things: cheatThrowAway();
  // var uniqueValueForDimensions = cheatThrowAway();
  // console.log("uniqueValueForDimensions in build_dd_list()",uniqueValueForDimensions)
  for (dimension in dimension_options){
    var checked_class = "not_checked";
    // console.log("build_dd_list check array thing missing words, ", dimension_options[dimension])
    if (selected_options.indexOf(dimension_options[dimension]) !== -1){
      checked_class = "checked"
    }
    var dimension_id = String(dimension_options[dimension]);
    // console.log("type = ", typeof(dimension_id))
    // console.log("dimension_id=",dimension_id)
    dimension_id = findAndReplace(dimension_id," ","_")
    // console.log("dimension_id=",dimension_id)
    $("ul#dimensions_list").append("<li id="+dimension_id+" class='dimensions'><a id="+dimension_id+" class=' "+checked_class+" dimensions '"+">"+dimension_id+"</a></li>")
    //// added this newer still!, might break everything?
    $("li#"+dimension_id).append("<ul class="+dimension_id+" hidden dim_values></ul>");
    //// cycles over each unique value in the dimension the above for loop is currently on?
    // console.log("userFilt["uniqueValuesForEachDimensionArrayOfObj"][dimension][dimension_options[dimension] =",userFilt["uniqueValuesForEachDimensionArrayOfObj"][dimension][dimension_options[dimension]]);
    //// function that takes the dimension unformatted and finds the array object number of the array of objects
    //// of all unique values for each dimension that matches it
    var arrayNumber = findArrayObjNumber(dimension_options[dimension], userFilt["uniqueValuesForEachDimensionArrayOfObj"]);
    // console.log("arrayNumber is, ",arrayNumber)

    var this_key =Object.keys(userFilt["uniqueValuesForEachDimensionArrayOfObj"][arrayNumber])
    // console.log("this_key =", this_key);
    var current_dim_array = userFilt["uniqueValuesForEachDimensionArrayOfObj"][arrayNumber][this_key]
    // console.log("! current_dim_array= ",current_dim_array)
    for (eachUniqueDimValue in current_dim_array){
      var UniqueDimValue = current_dim_array[eachUniqueDimValue];
      var DimUvalFormat = findAndReplace(String(UniqueDimValue)," ","_")
      ////////////////  commented this out as it was problematically given words with spaces as id!
      ///  var DimUvalFormat = UniqueDimValue
      // console.log("yyy yy checker, DimUvalFormat=",DimUvalFormat)
      // console.log("yyy yy checker, dimension_id=",dimension_id)
      $("ul."+dimension_id).append("<li id="+DimUvalFormat+" dimensions="+dimension_id+" class=' buck_right "+dimension_id+" hidden'><a id="+dimension_id+" class='checkers "+checked_class+" dimensions_ITEMS '"+">"+"  "+DimUvalFormat+"</a></li>")
    }
     // console.log("zz userFilt["limitations"],",userFilt["limitations"],"type of userFilt["limitations"],",typeof(userFilt["limitations"]))
     // console.log("zz userFilt["uniqueValuesForEachDimensionArrayOfObj"],",userFilt["uniqueValuesForEachDimensionArrayOfObj"],"type of userFilt["uniqueValuesForEachDimensionArrayOfObj"],",typeof(userFilt["uniqueValuesForEachDimensionArrayOfObj"]))
    // popLimitObjForDim(dimension_options[dimension])
  }


  for (dimension in selected_options){
    popLimitObjForDim(dimension_options[dimension])
  }

};



/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////    Functions That Take Initial Data Load and Do Initial Data Processing    ///////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////




//// this function returns an array based on the d3 imported CSV where
//// the returned array is limited to a subset of rows where specific dimensions (aka columns) match a given value
function limitToSomeNew(arrayCSV, limitations){
  temp_array = [];
  // console.log("!! arrayCSV in limitToSomeNew() is",arrayCSV)
  var limitationsKeysArray = Object.keys(limitations)
  for (each in arrayCSV){
    row = arrayCSV[each]
    //// limitations is a variable that is an object of objects consisting of
    //// key:value pairs of diemension name:dimension value
    var foundMatchHelper = "no"
    var foundMatch = [];
    for (each2 in limitationsKeysArray){
      for (eachValue in limitations[limitationsKeysArray[each2]]){
          if (row[limitationsKeysArray[each2]] === limitations[limitationsKeysArray[each2]][eachValue]){
          foundMatch.push("yes")
        }
      }
    }
    // console.log("foundMatch array = ",foundMatch, "and length = ",foundMatch.length);
    for (tester in foundMatch){
      if (foundMatch[tester] === "yes"){
        foundMatchHelper = "yes";
      }
    }
    if (foundMatch.length === limitationsKeysArray.length){
        temp_array.push(row)
        // console.log("temp_array",temp_array)
    }
  }
   //console.log("!! * * temp_array",temp_array)
  arrayCSV = [];
  arrayCSV = temp_array;
  // console.log("!! * * result returned is ",arrayCSV);
  // console.log("!! * * * result returned is ",arrayCSV);
  return arrayCSV
}



///// builds array where a given dimension is the key and value is an array of unique values for that dimension:
///// assumes each row in input CSV has the same number and type of dimensions, which should be valid assumption.
///// also assuming the structure of the input stays the same, which I think will be true?
/////// this should be called once, then used to build drop-down to right of main one?
function build_uniqueValueForDimension(arrayCSV){
  var initialDimensionsObject = arrayCSV[0][0]["__data__"][0];
  // var dimensions_names_array = Object.keys(initialDimensionsObject)
  var dimensions_names_array = userFilt["dimension_options"]
  ///// creates an object of dimensions as keys, with an empty array as values
  var DimensionsArray = []
  for (eachDim in dimensions_names_array){
    var dim_obj_temp = {};
    dim_obj_temp[dimensions_names_array[eachDim]] = []
    DimensionsArray.push(dim_obj_temp);
  }
  // console.log("DimensionsArray =", DimensionsArray);
  ///// goes through each row of data & adds the value to the array value for each dimension key
  for (eachRow in arrayCSV[0][0]["__data__"]){
    for(eachDimension in dimensions_names_array){
      // console.log("DimensionsArray = ",DimensionsArray);
      // console.log("$ DimensionsArray[eachDimension][dimensions_names_array[eachDimension]] = ",DimensionsArray[eachDimension][dimensions_names_array[eachDimension]]);
      DimensionsArray[eachDimension][dimensions_names_array[eachDimension]].push(arrayCSV[0][0]["__data__"][eachRow][dimensions_names_array[eachDimension]])
    }
  }
  for (eachDimensionObject in dimensions_names_array){
    var array_of_a_dimension = DimensionsArray[dimensions_names_array[eachDimensionObject]]
    // console.log("% DimensionsArray =",DimensionsArray)
    // console.log("% dimensions_names_array[eachDimensionObject] =",dimensions_names_array[eachDimensionObject])
    // console.log("% DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]] =",DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]])
    DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]] = uniq(DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]])
    // DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]] = uniq(array_of_a_dimension)
  }
  userFilt["uniqueValuesForEachDimensionArrayOfObj"] = DimensionsArray
  // console.log("X userFilt["uniqueValuesForEachDimensionArrayOfObj"] = ",userFilt["uniqueValuesForEachDimensionArrayOfObj"])
  return build_dd_list(userFilt["dimension_options"],userFilt["selected_options"])
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////  Builds SVGs for Visualization using d3.parasets.js and d3.js   /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////  builds the parallel sets visualization SVGs  //////////////////
function build_parallel_sets(data){
  console.log(data);
  var chart = d3.parsets()
      .dimensions(userFilt["selected_options"]);
          // .dimensions(["Bureau", "Bureau From", "Org", "Org From",  "Date Effective",  "Noa 1", "Noa Table Id 1",  "Grade", "Grade Or Level From", "Occ Series",  "Psn Occ", "Retire Plan Desc",  "Step",  "Supv Status Desc",  "Vet Pref",  "Center",  "CenterFrom",  "Age Group", "S&E", "Combined"]);
  var vis = d3.select("#vis").append("svg")
      .attr("width", chart.width())
      .attr("height", chart.height());

  var partition = d3.layout.partition()
      .sort(null)
      .size([chart.width(), chart.height() * 5 / 4])
      .children(function(d) { return d.children ? d3.values(d.children) : null; })
      .value(function(d) { return d.count; });

  var ice = false;

  function curves() {
    var t = vis.transition().duration(500);
    if (ice) {
      t.delay(1000);
      icicle();
    }
    t.call(chart.tension(curves_checkbox ? .5 : 1));
    if (curves_checkbox === true){var curves_checkbox2 =.5;}
    if (curves_checkbox === false){var curves_checkbox2 =.75}
    t.call(chart.tension(curves_checkbox2));
  }


  d3.csv("data/GOT_battles.csv", function(error, csv) {
    // resultArray = limitToOne(vis.datum(csv), userFilt["limitations"]);
    var resultArray2 = [];
    for(var i = 0; i <data.length;i++){
      resultArray2[i] = data[i].properties;

    }

    // console.log("* * vis.datum(resultArray2)= ",vis.datum(resultArray2));
    build_uniqueValueForDimension(vis.datum(data));
    // build_dd_list(dimension_options,userFilt["selected_options"])
    vis.datum(resultArray2).call(chart);
    // vis.datum(csv).call(chart);
    window.icicle = function() {
      var newIce = this.checked,
          tension = chart.tension();
      if (newIce === ice) return;
      if (ice = newIce) {
        var dimensions = [];
        vis.selectAll("g.dimension")
           .each(function(d) {
            console.log("* d in dimension =",d)
            dimensions.push(d); });
        dimensions.sort(function(a, b) { return a.y - b.y; });
        var root = d3.parsets.tree({children: {}}, resultArray2, dimensions.map(function(d) {
          //console.log("* - d.name", d.name)
          return d.name; }), function() { return 1; }),

            nodes = partition(root),
            nodesByPath = {};

        nodes.forEach(function(d) {
          var path = d.data.name,
              p = d;
          while ((p = p.parent) && p.data.name) {
            path = p.data.name + "\0" + path;
          }
          if (path) nodesByPath[path] = d;
        });
        var data = [];
        vis.on("mousedown.icicle", stopClick, true)
          .select(".ribbon").selectAll("path")
            .each(function(d) {
              var node = nodesByPath[d.path],
                  s = d.source,
                  t = d.target;
              s.node.x0 = t.node.x0 = 0;
              s.x0 = t.x0 = node.x;
              s.dx0 = s.dx;
              t.dx0 = t.dx;
              s.dx = t.dx = node.dx;
              data.push(d);
            });
        iceTransition(vis.selectAll("path"))
            .attr("d", function(d) {
              var s = d.source,
                  t = d.target;
              return ribbonPath(s, t, tension);
            })
            .style("stroke-opacity", 1);
        iceTransition(vis.selectAll("text.icicle")
            .data(data.properties)
          .enter().append("text")
            .attr("class", "icicle")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .attr("transform", function(d) {
              return "translate(" + [d.source.x0 + d.source.dx / 2, d.source.dimension.y0 + d.target.dimension.y0 >> 1] + ")rotate(90)";
            })
            .text(function(d) { return d.source.dx > 15 ? d.node.name : null; })
            .style("opacity", 1e-6))
            .style("opacity", 1);
        iceTransition(vis.selectAll("g.dimension rect, g.category")
            .style("opacity", 1))
            .style("opacity", 1e-6)
            .each("end", function() { d3.select(this).attr("visibility", "hidden"); });
        iceTransition(vis.selectAll("text.dimension"))
            .attr("transform", "translate(0,-5)");
        vis.selectAll("tspan.sort").style("visibility", "hidden");
      } else {
        vis.on("mousedown.icicle", null)
          .select(".ribbon").selectAll("path")
            .each(function(d) {
              var s = d.source,
                  t = d.target;
              s.node.x0 = s.node.x;
              s.x0 = s.x;
              s.dx = s.dx0;
              t.node.x0 = t.node.x;
              t.x0 = t.x;
              t.dx = t.dx0;
            });
        iceTransition(vis.selectAll("path"))
            .attr("d", function(d) {
              var s = d.source,
                  t = d.target;
              return ribbonPath(s, t, tension);
            })
            .style("stroke-opacity", null);
        iceTransition(vis.selectAll("text.icicle"))
            .style("opacity", 1e-6).remove();
        iceTransition(vis.selectAll("g.dimension rect, g.category")
            .attr("visibility", null)
            .style("opacity", 1e-6))
            .style("opacity", 1);
        iceTransition(vis.selectAll("text.dimension"))
            .attr("transform", "translate(0,-25)");
        vis.selectAll("tspan.sort").style("visibility", null);
      }
    };
    d3.select("#icicle")
        .on("change", icicle)
        .each(icicle);
  });

  function iceTransition(g) {
    return g.transition().duration(1000);
  }

  function ribbonPath(s, t, tension) {
    var sx = s.node.x0 + s.x0,
        tx = t.node.x0 + t.x0,
        sy = s.dimension.y0,
        ty = t.dimension.y0;
    return (tension === 1 ? [
        "M", [sx, sy],
        "L", [tx, ty],
        "h", t.dx,
        "L", [sx + s.dx, sy],
        "Z"]
     : ["M", [sx, sy],
        "C", [sx, m0 = tension * sy + (1 - tension) * ty], " ",
             [tx, m1 = tension * ty + (1 - tension) * sy], " ", [tx, ty],
        "h", t.dx,
        "C", [tx + t.dx, m1], " ", [sx + s.dx, m0], " ", [sx + s.dx, sy],
        "Z"]).join("");
  }

  function stopClick() { d3.event.stopPropagation(); }

  // Given a text function and width function, truncates the text if necessary to
  // fit within the given width.
  function truncateText(text, width) {
    return function(d, i) {
      var t = this.textContent = text(d, i),
          w = width(d, i);
      if (this.getComputedTextLength() < w) return t;
      this.textContent = "…" + t;
      var lo = 0,
          hi = t.length + 1,
          x;
      while (lo < hi) {
        var mid = lo + hi >> 1;
        if ((x = this.getSubStringLength(0, mid)) < w) lo = mid + 1;
        else hi = mid;
      }
      return lo > 1 ? t.substr(0, lo - 2) + "…" : "";
    };
  }
}
