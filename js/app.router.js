// var app = angular.module('app',['ui.router']);
// app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
//    $stateProvider
//    .state('covid',{
//     url: '/covid',
//     views: {
//         main: {
//           templateUrl: "pages/covid.html",
//           controller: "cases"
//         }
//     }
//    })
//    .state('main',{
//     url: '/main',
//     views:{
//         main:{
//             templateUrl:'pages/main.html',
//             controller:'crudeOperation'
//         }
//     }
//    })
//    .state('odata',{
//     url: '/odata',
//     views:{
//         main:{
//             templateUrl:'pages/odata.html',
//             controller:'odata'
//         }
//     }
// })
// }])
// .state("edit", {
//     url: "/edit/:id",
//     views: {
//       main: {
//         templateUrl: "----",
//         controller: "---"
//       }
//     }
//   })

var app = angular.module('app',['ngRoute']);
app.config(['$routeProvider',function($routeProvider){
   $routeProvider
   .when('/covid',{
       templateUrl:'pages/covid.html',
       controller:'cases'
   })
   .when('/main',{
       templateUrl:'pages/main.html',
       controller:'crudeOperation'
   })
   .when('/odata',{
    templateUrl:'pages/odata.html',
    controller:'odata'
    })
    // .when('/product',{
    //     templateUrl:'pages/product.html',
    //     controller:'product'
    // })
}])

app.controller('cases', casesContrl);
app.controller('crudeOperation', crudeContrl);
app.controller('odata', odataContrl);
// app.controller('product', productContrl);

