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
}])

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

app.controller('crudeOperation', ['$scope','mainService' ,function($scope, mainService){
    $scope.tableData = {};
    $scope.addTableData = {};
    $scope.editTableData = {};
    $scope.deleteTableData = {};
    //$scope.countryName = "";
    //$scope.showCountryData = false;
    $scope.showData = false;

    setTimeout(()=>{
        mainService.getAllData().then(function(response){
            $scope.showData = true;
            $scope.tableData = response;
            dTable = $('#productTable').DataTable({
                "order": [],
                "data":response,
                "sAjaxDataProp": "",
                "aoColumns": [
                    { "title": "id", "data": "id", "visible": false,},
                    { "title": "Image", "data": "image", 'orderable': false ,
                      "render": function ( data) {
                        return '<img src="'+ data +'" width="40px">';
                        }
                    },	              
                    { "title": "Title", "data": "title" },
                    { "title": "Price", "data": "price", 
                        "render":function(data){
                            return'<span>'+"$"+ data+'</span>'
                        } 
                    },
                    { "title": "Description", "data": "description" },
                    { "title": "Category", "data": "category" },
                    { "title": "Rating", "data": "rating",'orderable': false,
                        "render": function(data){
                            return '<span>'+data.rate+'<i class="fa fa-star color-yellow" aria-hidden="true"></i></span>'
                        }
                    },
                    // { "title": "Database User Name", "data": "username" },
                    {
                        'title': "Action",
                        'orderable': false,
                        'render': function (data) {
                            return '<span class="editCls" ng-click="editClick()" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fa fa-edit clickableImage" aria-hidden="true"></i></span>'+
                            '<span class="deleteCls" ng-click="deleteClick()" data-bs-toggle="modal" data-bs-target="#deleteProductModal"><i class="fa fa-trash clickableImage" aria-hidden="true"></i></span>'
                        } 
                    }
                ],
                // "fnInitComplete": function(oSettings, alertList) {
                    
                // }
            });
        }).catch(function(err){
            console.log(err);
        })
    },500)

    // function to OPEN ADD PRODUCT MODEL... 
    $scope.addNewProductModel =  function() {
        $scope.product ={
            "title":"",
            "description":"",
            "price":"",
            "category":"",
            "image":""
          }
    };
    
    // function to OPEN EDIT PRODUCT MODEL... 
    //$scope.editClick = function(){
        $('body').off('click').on('click', '.editCls', function(e){
            e.preventDefault();
            var rowData =  dTable.row( $(this).parents('tr') ).data();
            $scope.productId = rowData.id;
            $scope.product ={
                "title":rowData.title,
                "description":rowData.description,
                "price":rowData.price,
                "category":rowData.category,
                "image":rowData.image
            }
        });
    //},

    // function to DELETE PRODUCT...
    //$scope.deleteClick = function(){
        $('body').off('click').on('click', '.deleteCls', function(e){ 
            e.preventDefault();
            var rowData =  dTable.row( $(this).parents('tr') ).data();
            $scope.productId = rowData.id;
        });
    //}
       
    $scope.addProduct = function(){
        mainService.addNewData($scope.product).then(function(response){
            $scope.addTableData = response;
        }).catch(function(err){
            console.log(err);
        })
    };

    $scope.UpdateData = function(){
        mainService.updateData($scope.product,$scope.productId).then(function(response){
            $scope.editTableData = response;
        }).catch(function(err){
            console.log(err);
        })
    };

    $scope.deleteProduct = function(){
        mainService.deleteData($scope.productId).then(function(response){
            $scope.deleteTableData = response;    
         }).catch(function(err){
            console.log(err);
         })
    
    };

}]);

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

    setTimeout(()=>{
        odataService.getEntityData().then(function(response){
            $scope.showData = true;
            $scope.entities = response.value;
        }).catch(function(err){
            console.log(err);
        })
    },500)

    $scope.paramExample = JSON.stringify({
        "odata.type":"ODataDemo.<entityName>"
    },undefined, 2);

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

    $scope.entityChange = function(){
        odataService.getSubEntityData($scope.entityName).then(function(response){
            $scope.subEntities = response.value;
            $scope.deleteSelected = true;
        }).catch(function(err){
            console.log(err);
            $scope.deleteSelected = false;
        })
    }

    // $scope.pageSizeChange = function(){
    //     console.log($scope.pageSize);
    // }

    // $scope.pageNoChange = function(){
    //     console.log($scope.pageNo);
    // }

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