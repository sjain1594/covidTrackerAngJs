app.controller('odata', ['$scope','odataService', 'mainConfig' ,function($scope, odataService, mainConfig){
    $scope.showData = false;
    $scope.showParam = true;
    $scope.deleteSelected = false;
    $scope.Quering = false;
    $scope.Updating = false;
    $scope.topSel = false;
    $scope.otherSel = false;
    $scope.filterSel = false;
    $scope.paginationSel = false;
    $scope.apiRootUrl = mainConfig.odataV3Url;

    //api to get entity data for dropdown...
    setTimeout(()=>{
        odataService.getEntityData().then(function(response){
            $scope.showData = true;
            $scope.entities = response.value;
        }).catch(function(err){
            console.log(err);
        })
    },500)

    //function to show data in param example div...
    $scope.paramExample = JSON.stringify({
        "odata.type":"ODataDemo.<entityName>"
    },undefined, 2);

    //function to set/reset/show/hide the fields...
    $scope.operationValue = function(){
        if($scope.selOperation == "QueringData"){
            $scope.Quering = true;
            $scope.Updating = false;
            $scope.paramBody = "";
            $scope.entityName = "";
            $scope.subEntityId = "";
            $scope.filterName = "";
            $scope.subEntityName = "";
            $scope.number = "";
            $scope.value = "";
            $scope.pageSize = "";
            $scope.pageNo = "";
        }else if($scope.selOperation == "UpdatingData"){
            $scope.Quering = false;
            $scope.Updating = true;

            $scope.paramBody = "";
            $scope.entityName = "";
            $scope.subEntityId = "";
            $scope.filterName = "";
            $scope.subEntityName = "";
            $scope.number = "";
            $scope.value = "";
            $scope.pageSize = "";
            $scope.pageNo = "";
        }else{
            $scope.Quering = false;
            $scope.Updating = false;

            $scope.paramBody = "";
            $scope.entityName = "";
            $scope.subEntityId = "";
            $scope.filterName = "";
            $scope.subEntityName = "";
            $scope.number = "";
            $scope.value = "";
            $scope.pageSize = "";
            $scope.pageNo = "";
        }
    }

    // function to show - hide feild acc to filter selection...
    $scope.filterChange = function(){
        if($scope.filterName == "select" || $scope.filterName == "orderby"){
            $scope.topSel = false;
            $scope.otherSel = true;
            $scope.filterSel = false;
            $scope.paginationSel = false;
            $scope.number = "";
            //$scope.subEntityName = "";
            $scope.value = "";
            $scope.pageSize = "";
            $scope.pageNo = "";
        }else if($scope.filterName == "top"){
            $scope.topSel = true;
            $scope.otherSel = false;
            $scope.filterSel = false;
            $scope.paginationSel = false;
            //$scope.number = "";
            $scope.subEntityName = "";
            $scope.value = "";
            $scope.pageSize = "";
            $scope.pageNo = "";
        }else if($scope.filterName == "count"){
            $scope.topSel = false;
            $scope.otherSel = false;
            $scope.filterSel = false;
            $scope.paginationSel = false;
            $scope.number = "";
            $scope.subEntityName = "";
            $scope.value = "";
            $scope.pageSize = "";
            $scope.pageNo = "";
        }else if($scope.filterName == "filter"){
            $scope.topSel = false;
            $scope.otherSel = true;
            $scope.filterSel = true;
            $scope.paginationSel = false;
            $scope.number = "";
            //$scope.subEntityName = "";
            //$scope.value = "";
            $scope.pageSize = "";
            $scope.pageNo = "";
        }else if($scope.filterName == "expand"){
            $scope.topSel = false;
            $scope.otherSel = false;
            $scope.filterSel = true;
            $scope.paginationSel = false;
            $scope.number = "";
            $scope.subEntityName = "";
            //$scope.value = "";
            $scope.pageSize = "";
            $scope.pageNo = "";
        }else if($scope.filterName == "pagination"){
            $scope.topSel = false;
            $scope.otherSel = false;
            $scope.filterSel = false;
            $scope.paginationSel = true;
            $scope.number = "";
            $scope.subEntityName = "";
            $scope.value = "";
            //$scope.pageSize = "";
            //$scope.pageNo = "";
        }
    }

    // function to show/hide param body & set-reset responsearea...
    $scope.methodValue = function(){
        if($scope.method == "GET" || $scope.method == "DELETE"){
            $scope.showParam = false;
            $scope.responseBody = "";
        }else{
            $scope.showParam = true;
            $scope.responseBody = "";
        }
        // if($scope.method == "DELETE"){
        //     $scope.deleteSelected = true;
        // }else{
        //     $scope.deleteSelected = false;
        // }
    }

    //function to get sub-entity data... 
    $scope.entityChange = function(){
        odataService.getSubEntityData($scope.entityName).then(function(response){
            $scope.subEntities = response.value;
            $scope.deleteSelected = true;
        }).catch(function(err){
            console.log(err);
            $scope.deleteSelected = false;
        })
        $scope.filterName = "";
        $scope.subEntityName = "";
        $scope.number = "";
        $scope.value = "";
        $scope.pageSize = "";
        $scope.pageNo = "";
        $scope.responseBody = "";
    }

    // $scope.pageSizeChange = function(){
    //     console.log($scope.pageSize);
    // }

    // $scope.pageNoChange = function(){
    //     console.log($scope.pageNo);
    // }

    //function to run on try it out button...
    $scope.tryItOut = function(){
        console.log($scope.paramBody);
        console.log($scope.entityName);
        console.log($scope.subEntityId);
        console.log($scope.filterName);
        console.log($scope.subEntityName);
        console.log($scope.number);
        console.log($scope.value);
        console.log($scope.pageSize);
        console.log($scope.pageNo);
        odataService.tryItOut($scope.paramBody,$scope.method,$scope.entityName,$scope.subEntityId,$scope.filterName,$scope.subEntityName,$scope.number,$scope.value,$scope.pageSize,$scope.pageNo).then(function(response){
            if(response){
             $scope.responseBody = JSON.stringify(response, undefined, 2);
            }else{
                $scope.responseBody = "Operation performed Successfully..."
            }
        }).catch(function(err){
            console.log(err);
            $scope.responseBody = err;
        })
    }
    
}]);