angular.module('travel_book', ['ui.router'])




.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('index', {

            url: '/',
             views: {
              "map@": { templateUrl: "../views/map.html" },
              "content@": { templateUrl: "" }
            }
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        // .state('about', {
        //     // we'll get to this in a bit       
        // });        
})


.controller('mainController', function($scope) {

  $scope.things = 'hello plus 2';
  console.log('getting here');


})