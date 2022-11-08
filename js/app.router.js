var app = angular.module('app',['ngRoute']);
app.config(['$routeProvider',function($routeProvider){
   $routeProvider
   .when('/corona',{
       templateUrl:'pages/index.html',
       controller:'cases'
   })
   .when('/products',{
       templateUrl:'pages/main.html',
       controller:'crudeOperation'
   })
}])
