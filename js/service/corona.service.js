
app.service('coronaService', ['$http' , "$q", function($http, $q){
    this.findCasesByCountry = function(COUNTRY_NAME){
        var deferred = $q.defer();
        $http({
            url:'https://covid19.mathdro.id/api/countries/' + COUNTRY_NAME,
            method: 'GET',
            cache: true,
        })
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (msg) {
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
        .success(function(resp){
            deferred.resolve(resp);
        })
        .error(function (msg) {
            cb(msg);
        });
        return deferred.promise;
    };

}]);