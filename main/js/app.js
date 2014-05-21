angular.module('travel_book', [])


.controller('mainController', function($scope) {
  
  // D3 CODE STARTS HERE
  var zoom = d3.behavior.zoom()
      .scaleExtent([1, 9]);
      // .on("zoom", move); // Disables user move and zoom without breaking everything


  var width = document.getElementById('container').offsetWidth;
  var height = width / 2.4; //Originally 2

  var topo,projection,path,svg,g;

  var graticule = d3.geo.graticule();

  var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

  setup(width,height);
  // debugger;

  function setup(width,height){
    // debugger;
    projection = d3.geo.mercator()
      .translate([(width/2), (height/2)])
      .scale( width / 2 / Math.PI);

    path = d3.geo.path().projection(projection);

    svg = d3.select("#container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .on("click", click)
        .append("g");


    g = svg.append("g");

    // debugger;
  }

  d3.json("data/world-topo-min.json", function(error, world) {

    var countries = topojson.feature(world, world.objects.countries).features;

    topo = countries;
    draw(topo);

  });

  function draw(topo) {

    // Draws latitude and longitude lines
    // svg.append("path")
    //    .datum(graticule)
    //    .attr("class", "graticule")
    //    .attr("d", path);
    console.log('svg making it?');


    // Draws equator
    g.append("path")
     .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
     .attr("class", "equator")
     .attr("d", path);


    var country = g.selectAll(".country").data(topo);

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.properties.name; })
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

        d3.selectAll(".country").classed("active", false);
        d3.select(this).classed("active", true);

        var currentCountry = d.properties.name;
        console.log(currentCountry)

        countrySelected(currentCountry);

      });  


    //EXAMPLE: adding some capitals from external CSV file
    // d3.csv("data/country-capitals.csv", function(err, capitals) {

    //   capitals.forEach(function(i){
    //     addpoint(i.CapitalLongitude, i.CapitalLatitude, i.CapitalName );
    //   });

    // });

  }


  function redraw() {
    width = document.getElementById('container').offsetWidth;
    height = width / 2;
    d3.select('svg').remove();
    setup(width,height);
    draw(topo);
  }


  function move() {

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

    zoom.translate(t);
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
  function addpoint(lat,lon,text) {

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

  // D3 CODE ENDS HERE

  $scope.country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"]; 

  
  $scope.countries = {};

  var countrySelected = function(country) {
    if ( !$scope.countries[country]) {
      $scope.countries[country] = {name: country, notes: '' };
    }

    var name = $scope.countries[country].name;
    var notes = $scope.countries[country].notes;


    $scope.$apply(function(){
      $scope.currentCountry = country;
      $scope.notes = notes;
      $scope.name = name;
    })
  }

  var url = $scope.linkUrl;
  var alias = $scope.linkAlias;

  $scope.userLinks = [];

  $scope.linkSubmit = function() {
    var url = $scope.link.url;
    var alias = $scope.link.alias;

    console.log($scope.link.url);
    console.log($scope.link.alias);

    $scope.userLinks.push({url: url, alias: alias})
    $scope.link = null;
  }

})

.directive("countryClick", function(scope, element, attrs){
  element.bind('click', function(){
    scope.$apply("selectCountry()");
  })
})