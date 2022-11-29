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
}]);

app.controller('crudeOperation', ['$scope','mainService' ,function($scope, mainService){
    $scope.tableData = {};
    $scope.addTableData = {};
    $scope.editTableData = {};
    $scope.deleteTableData = {};
    //$scope.countryName = "";
    //$scope.showCountryData = false;
    $scope.showData = false;
    $scope.rowData = {};
    //function to get data of table...
    setTimeout(()=>{
        mainService.getAllData().then(function(response){
            $scope.showData = true;
            $scope.tableData = response;
            $scope.dataTable(response);
        }).catch(function(err){
            console.log(err);
        })
    },500)

    //function to create datatable...
    $scope.dataTable = function(response){
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
                // { "title": "Rating", "data": "rating",'orderable': false,
                //     "render": function(data){
                //         return '<span>'+data.rate+'<i class="fa fa-star color-yellow" aria-hidden="true"></i></span>'
                //     }
                // },
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
             "fnInitComplete": function(oSettings, alertList) {
                $scope.editClick();
                $scope.deleteClick();
             }
        });
        $scope.editClick();
        $scope.deleteClick();

    }

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
    $scope.editClick = function(){
        $('#productTable').off('click').on('click', '.editCls', function(e){
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
            /* setting the data from grid to the form elements in the modal */
            // $scope.options = {
            //     'backdrop': 'static',
            //     'show': true,
            //     'keyboard': true,
            // }
            
            //$('#addNewProductModel').modal($scope.options);
            //$("#editProductModal").modal("show");
        });
    },

    // function to get DELETE PRODUCT...
    $scope.deleteClick = function(){
        $('body').off('click').on('click', '.deleteCls', function(e){ 
            e.preventDefault();
            var rowData =  dTable.row( $(this).parents('tr') ).data();
            $scope.productId = rowData.id;
            $scope.rowData = $(this);
        });
    }
      
    // function to add product...
    $scope.addProduct = function(){
        mainService.addNewData($scope.product).then(function(response){
            $scope.addTableData = response;
            dTable = $('#productTable').DataTable();
            dTable.row.add(response).draw();
        }).catch(function(err){
            console.log(err);
        })
    };

    //function to edit product...
    $scope.UpdateData = function(){
        mainService.updateData($scope.product,$scope.productId).then(function(response){
            $scope.editTableData = response;
            dTable = $('#productTable').DataTable();
            dTable.row(response.id - 1).data( $scope.editTableData ).draw();
        }).catch(function(err){
            console.log(err);
        })
    };

    //function to delete product...
    $scope.deleteProduct = function(){
        mainService.deleteData($scope.productId).then(function(response){
            $scope.deleteTableData = response;  
            dTable = $('#productTable').DataTable();
            dTable.row(($scope.rowData).parents('tr')).remove().draw();
            //$scope.rowData.remove().draw();  
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