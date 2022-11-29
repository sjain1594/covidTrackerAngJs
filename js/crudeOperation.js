//var app = angular.module('app',[]);

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
