app.service("odataService",["$http","$q","mainConfig",function($http,$q,mainConfig) {

    //api to get entity data..
    this.getEntityData = function(){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: mainConfig.odataV3Url +'?'+ mainConfig.jsonFormat,
            cache: true,
        })
            .success(function (data) {
            deferred.resolve(data);
            })
            .error(function (msg) {
            deferred.reject(msg);
            });

        return deferred.promise;
    }

    //api to get sub-entity data..
    this.getSubEntityData = function(entityName){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: mainConfig.odataV3Url + entityName + '?'+ mainConfig.jsonFormat,
            cache: true,
        })
            .success(function (data) {
            deferred.resolve(data);
            })
            .error(function (msg) {
            deferred.reject(msg);
            });

        return deferred.promise;
    }

    //generation of custom api according to filters selection and method selection..
    this.tryItOut = function (dataJson,method,entityName,subEntityId,filterName,subEntityName,number,value,pageSize,pageNo) {
        if(method){
            if(method == "GET" || method == "DELETE"){
                dataJson = "";
            }else{
                dataJson = dataJson;
            }
        }else{
            dataJson = "";
        }
        if(entityName && subEntityId){
            customUrl = mainConfig.odataV3Url + entityName + subEntityId +'?'+ mainConfig.jsonFormat;
        }else if(entityName){
            customUrl = mainConfig.odataV3Url + entityName +'?'+ mainConfig.jsonFormat;
        }else{
            customUrl = mainConfig.odataV3Url +'?'+ mainConfig.jsonFormat;
        }
        if(subEntityName){
            if(subEntityName == "ID"){
                value = value;
            }else{
                value = "'" + value + "'";
            }
        }
        if(pageNo){
            if(pageNo == '1'){
                pageNo = 0;
            }else if(pageNo == '2'){
                pageNo = pageSize;
            }else if(pageNo == '3'){
                pageNo = (pageSize * 2);
                console.log(pageNo);
            }
        }
        if(filterName && entityName){
            method = "GET";
            if(filterName == "count"){
                customUrl = mainConfig.odataV3Url + entityName + '/'+ '$'+ filterName;
            }else if(filterName == "select"){
                customUrl = mainConfig.odataV3Url + entityName + '?'+ '$' + filterName + '=' + subEntityName + '&' + mainConfig.jsonFormat;
            }else if(filterName == "orderby"){
                customUrl = mainConfig.odataV3Url + entityName + '?'+ '$' + filterName + '=' + subEntityName + '&' + mainConfig.jsonFormat;
            }else if(filterName == "filter"){
                customUrl = mainConfig.odataV3Url + entityName + '?'+ '$' + filterName + '=' + subEntityName + ' eq ' + value + ' &' + mainConfig.jsonFormat;
            }else if(filterName == "expand"){
                customUrl = mainConfig.odataV3Url + entityName + '?'+ '$' + filterName + '=' + value + '&' + mainConfig.jsonFormat;
            }else if(filterName == "top"){
                customUrl = mainConfig.odataV3Url + entityName + '?'+ '$' + filterName + '=' + number + '&' + mainConfig.jsonFormat;
            }else if(filterName == "pagination"){
                customUrl = mainConfig.odataV3Url + entityName + '?$skip='+ pageNo + '&' + '$top=' + pageSize + '&' + mainConfig.jsonFormat;
            }
        }
        var deferred = $q.defer();
        $http({
            method: method,
            url: customUrl,
           // cache: true,
            data:dataJson,
            Headers:{
                'Content-Type': 'application/json',
            }
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