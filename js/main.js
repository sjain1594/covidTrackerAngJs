var app = angular.module('app',[]);

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
