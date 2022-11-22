app.service("mainConfig", [

    function(){
      this.dataUrl = "https://fakestoreapi.com/products",
      this.editDeleteDataUrl = function (id) {
            return "https://fakestoreapi.com/products/" + id;
        },
       // this.odataV4Url = "https://services.odata.org/TripPinRESTierService/(S(uysxiwe1blb3dqplrneqg5bm))/people",
        this.odataV3Url = "https://services.odata.org/V3/(S(uysxiwe1blb3dqplrneqg5bm))/OData/OData.svc",
        this.jsonFormat = "$format=json"
    }
]);