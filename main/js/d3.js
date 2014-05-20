angular.module('d3map', ['d3'])

.controller('mapController', function($scope) {

  $scope.countries = [];

  $scope.zoom = d3.behavior.zoom()
      .scaleExtent([1, 9]);
      // .on("zoom", move); // Disables user move and zoom without breaking everything


  $scope.width = document.getElementById('container').offsetWidth;
  $scope.height = width / 2.5; //Originally 2

  $scope.topo
  $scope.projection
  $scope.path
  $scope.svg
  $scope.g;

  $scope.graticule = d3.geo.graticule();

  $scope.tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

  $scope.setup(width,height);
  // debugger;

  $scope.setup($scope.width, $scope.height) {


    // debugger;
    $scope.projection = d3.geo.mercator()
      .translate([(width/2), (height/2)])
      .scale( width / 2 / Math.PI);

    $scope.path = d3.geo.path().projection(projection);

    $scope.svg = d3.select("#container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .on("click", click)
        .append("g");


    $scope.g = svg.append("g");

    // debugger;
  }

  d3.json("../data/world-topo-min.json", function(error, world) {

    var countries = topojson.feature(world, world.objects.countries).features;

    $scope.topo = countries;
    draw($scope.topo);

  });

  $scope.draw($scope.topo) {

    // Draws latitude and longitude lines
    // svg.append("path")
    //    .datum(graticule)
    //    .attr("class", "graticule")
    //    .attr("d", path);


    // Draws equator
    g.append("path")
     .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
     .attr("class", "equator")
     .attr("d", path);


    var country = g.selectAll(".country").data($scope.topo);

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.properties.name; })
        .style("fill", "#F8F8F8")
        .style("stroke", "gray")
        // Adds color to countries per JSON country data
        // .style("fill", function(d, i) { return d.properties.color; });

    //offsets for tooltips
    var offsetL = document.getElementById('container').offsetLeft+20;
    var offsetT = document.getElementById('container').offsetTop+10;

    //tooltips
    country
      .on("mousemove", function(d,i) {
        console.log('mousemove',d);

        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        tooltip.classed("hidden", false)
               .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
               .html(d.properties.name);

        })
        .on("mouseout",  function(d,i) {
          tooltip.classed("hidden", true);
        })

      .on("click", function (d,i) {
        console.log(d,i);

        // console.log(window);
        // console.log(d.properties.name);
        // countryClick("hi");

      });  


    //EXAMPLE: adding some capitals from external CSV file
    // d3.csv("data/country-capitals.csv", function(err, capitals) {

    //   capitals.forEach(function(i){
    //     addpoint(i.CapitalLongitude, i.CapitalLatitude, i.CapitalName );
    //   });

    // });

  }


  $scope.redraw() {
    width = document.getElementById('container').offsetWidth;
    height = width / 2;
    d3.select('svg').remove();
    setup(width,height);
    $scope.draw(topo);
  }


  $scope.move() {

    var t = d3.event.translate;
    var s = d3.event.scale; 
    zscale = s;
    var h = height/4;

    console.log('moving with t: ' + t + ' ,s: ,' + s + ' and h: ' + h);

    t[0] = Math.min(
      (width/height)  * (s - 1), 
      Math.max( width * (1 - s), t[0] )
    );

    t[1] = Math.min(
      h * (s - 1) + h * s, 
      Math.max(height  * (1 - s) - h * s, t[1])
    );

    $scope.zoom.translate(t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");


    //Removed this because it screws things up when there is an initial stroke set on countries:
    //adjust the country hover stroke width based on zoom level
    // d3.selectAll(".country").style("stroke-width", 1.5 / s);

  }



  var throttleTimer;
  function throttle() {
    window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
        redraw();
      }, 200);
  }


  //geo translation on mouse click in map
  function click() {
    var latlon = projection.invert(d3.mouse(this));
    console.log(latlon);
  }


  //function to add points and text to the map (used in plotting capitals)
  $scope.addpoint(lat,lon,text) {

    var gpoint = g.append("g").attr("class", "gpoint");
    var x = projection([lat,lon])[0];
    var y = projection([lat,lon])[1];

    gpoint.append("svg:circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("class","point")
          .attr("r", 1.5);

    //conditional in case a point has no associated text
    if(text.length>0){

      gpoint.append("text")
            .attr("x", x+2)
            .attr("y", y+2)
            .attr("class","text")
            .text(text);
    }
  }
})




//   $scope.circleRenderer = function(el, data) {
//     // Set the data for some circles
//     var d = el.selectAll('circle').data($scope.circles);
//     d.enter()
//     .append('circle')
//     .attr('cx', 1024 / 2)
//     .attr('cy', 768 / 2)
//     .style('fill', function() {
//       return 'rgb(' + parseInt(Math.random() * 255) + ','
//         + parseInt(Math.random() * 255) + ','
//         + parseInt(Math.random() * 255) + ')';
//     })
//     .transition().duration(1000)
//     .attr('cx', function(d) {
//       return d.cx;
//     }).attr('cy', function(d) {
//       return d.cy;
//     }).attr('r', function(d) {
//       return d.r;
//     });
//     d.exit()
//     .transition().duration(1000)
//     .attr('cx', 1024 / 2)
//     .attr('cy', 768 / 2)
//     .attr('r', 0)
//     .remove();
//   };
//   $scope.addCircles = function() {
//     for (var i = 0; i < 10; i++) {
//       $scope.circles.push({
//         cx: Math.random() * 1024,
//         cy: Math.random() * 768,
//         r: Math.random() * 50
//       });
//     }
//   };
//   $scope.clearCircles = function() {
//     $scope.circles = [];
//   };
//   $scope.toggleCircleVisibility = function() {
//     $scope.showCircles = !$scope.showCircles;
//   };
//   $scope.squareRenderer = function(el, data) {
//     // Set the data for some circles
//     var d = el.selectAll('rect').data($scope.squares);
//     d.enter()
//     .append('rect')
//     .attr('x', 1024 / 2)
//     .attr('y', 768 / 2)
//     .attr('width', 0)
//     .attr('height', 0)
//     .style('fill', function() {
//       return 'rgb(' + parseInt(Math.random() * 255) + ','
//         + parseInt(Math.random() * 255) + ','
//         + parseInt(Math.random() * 255) + ')';
//     })
//     .transition().duration(1000)
//     .attr('x', function(d) {
//       return d.x - d.size / 2;
//     }).attr('y', function(d) {
//       return d.y - d.size / 2;
//     }).attr('width', function(d) {
//       return d.size;
//     }).attr('height', function(d) {
//       return d.size;
//     });
//     d.exit()
//     .transition().duration(1000)
//     .attr('x', 1024 / 2)
//     .attr('y', 768 / 2)
//     .attr('width', 0)
//     .attr('height', 0)
//     .remove();
//   };
//   $scope.addSquares = function() {
//     for (var i = 0; i < 10; i++) {
//       $scope.squares.push({
//         x: Math.random() * 1024,
//         y: Math.random() * 768,
//         size: Math.random() * 50
//       });
//     }
//   };
//   $scope.clearSquares = function() {
//     $scope.squares = [];
//   };
//   $scope.toggleSquareVisibility = function() {
//     $scope.showSquares = !$scope.showSquares;
//   };
// }
//   </script>