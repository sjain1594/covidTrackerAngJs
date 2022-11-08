app.service("mainConfig", [

    function(){
      this.dataUrl = "https://fakestoreapi.com/products",
      this.editDeleteDataUrl = function (id) {
            return "https://fakestoreapi.com/products/" + id;
        }
    }
]);