
app.service('coronaService', ['$http' , "$q", function($http, $q){
    this.findCasesByCountry = function(COUNTRY_NAME){
        var deferred = $q.defer();
        $http({
            url:'https://covid19.mathdro.id/api/countries/' + COUNTRY_NAME,
            method: 'GET',
            cache: true,
        })
        .then(function (reponse) {
            deferred.resolve(reponse.data);
        }
        ,function (msg) {
            deferred.reject(msg);
        });
        return deferred.promise;
    };

    this.findCoronaDetails = function(){
        var deferred = $q.defer();
        $http({
            url:'https://covid19.mathdro.id/api',
            method: 'GET',
            cache: true,
        })
        .then(function(response){
            deferred.resolve(response.data);
        },function (msg) {
            cb(msg);
        });
        return deferred.promise;
    };

}]);