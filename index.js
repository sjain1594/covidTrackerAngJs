var app = angular.module("app", []);
app.controller('cases', ['$scope','coronaService' ,function($scope, coronaService){
    $scope.showOverallDetails = false;
    $scope.showCountryCases = false;
    $scope.searchCountry = "";
    $scope.errorMsg = "";
    $scope.showErrMsg = false;

    coronaService.findCoronaDetails().then(function(res){
        $scope.showOverallDetails = true;
        $scope.confirmedCases = res.confirmed.value;
        $scope.RecoveredCases = res.recovered.value;
        $scope.Deaths = res.deaths.value;
        $scope.LastUpdatedTime = res.lastUpdate;
    });
       
    $scope.doSearch = function(){
    $scope.errorMsg = "";
    $scope.showErrMsg = false;
    $scope.showCountryCases = false;
    coronaService.findCasesByCountry($scope.searchCountry).then(function(res){
        $scope.confirmedCases = res.confirmed.value;
        $scope.RecoveredCases = res.recovered.value;
        $scope.Deaths = res.deaths.value;
        $scope.LastUpdatedTime = res.lastUpdate;
        $scope.showCountryCases = true;

        }).catch(function(err){
            $scope.showErrMsg = true;
            $scope.errorMsg = err.error.message;
            
        })
    }
}]);

