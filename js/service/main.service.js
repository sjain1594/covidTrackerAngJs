app.service("mainService",["$http","$q","mainConfig",function($http,$q,mainConfig) {

    //api to get table data..
    this.getAllData = function () { 
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: mainConfig.dataUrl,
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
  
    //api to add new product in table...
    this.addNewData = function (dataJson) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: mainConfig.dataUrl,
           // cache: true,
            data:dataJson,
        })
            .success(function (data) {
            deferred.resolve(data);
            })
            .error(function (msg) {
            deferred.reject(msg);
            });
        return deferred.promise;
    };

    //api to update product in table....
    this.updateData = function (dataJson,id) {
        var deferred = $q.defer();
        $http({
            method: "PUT",
            url: mainConfig.editDeleteDataUrl(id),
            //cache: true,
            data:dataJson
        })
            .success(function (data) {
            deferred.resolve(data);
            })
            .error(function (msg) {
            deferred.reject(msg);
            });
        return deferred.promise;
    };

    //api to delete product...
    this.deleteData = function (id) {
        var deferred = $q.defer();
        $http({
            method: "DELETE",
            url: mainConfig.editDeleteDataUrl(id),
           // cache: true,
        })
            .success(function (data) {
            deferred.resolve(data);
            })
            .error(function (msg) {
            deferred.reject(msg);
            });
        return deferred.promise;
    };

}]);