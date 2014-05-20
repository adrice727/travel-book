angular.module('travel_book', ['ui.router'])


.controller('mainController', function($rootScope, $scope) {

  $scope.selectCountry = function(){
    alert('country clicked');  
  }
  // var test = angular.element('.country')
  // console.log(test);

})

.directive("countryClick", function(scope, element, attrs){
  element.bind('click', function(){
    scope.$apply("selectCountry()");
  })
})