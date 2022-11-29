// function to find cases by country...
app.service('coronaService', ['$http' , "$q","mainConfig",function($http,$q,mainConfig){
    this.findCasesByCountry = function(COUNTRY_NAME){
        var deferred = $q.defer();
        $http({
            url: mainConfig.coronaUrl + '/countries/' + COUNTRY_NAME,
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

// function to find global cases...
    this.findCoronaDetails = function(){
        var deferred = $q.defer();
        $http({
            url: mainConfig.coronaUrl,
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