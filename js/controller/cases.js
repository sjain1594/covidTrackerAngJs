//var app = angular.module("app", []);
var casesContrl =
function($scope, coronaService){
    $scope.showOverallDetails = false;
    $scope.showCountryCases = false;
    $scope.searchCountry = "";
    $scope.errorMsg = "";
    $scope.showErrMsg = false;

    //this show global corona cases info...
    coronaService.findCoronaDetails().then(function(res){
        $scope.showOverallDetails = true;
        $scope.confirmedCases = res.confirmed.value;
        $scope.RecoveredCases = res.recovered.value;
        $scope.Deaths = res.deaths.value;
        $scope.LastUpdatedTime = res.lastUpdate;
    });
       
    // country wise corona cases 
    $scope.doSearch = function(){
    $scope.errorMsg = "";
    $scope.showErrMsg = false;
    $scope.showCountryCases = false;
    coronaService.findCasesByCountry($scope.searchCountry).then(function(res){
        $scope.confirmedCasesByCountry = res.confirmed.value;
        $scope.RecoveredCasesByCountry = res.recovered.value;
        $scope.DeathsByCountry = res.deaths.value;
        $scope.LastUpdatedTimeByCountry = res.lastUpdate;
        $scope.showCountryCases = true;

        }).catch(function(err){
            $scope.showErrMsg = true;
            $scope.errorMsg = err.error.message;
            
        })
    }
};