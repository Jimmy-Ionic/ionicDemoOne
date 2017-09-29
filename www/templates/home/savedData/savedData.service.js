(function () {
  'use strict';

  angular
    .module('app.savedData')
    .service('SavedDataService', SavedDataService)


  SavedDataService.$inject = ['MyHttpService'];

  function SavedDataService(MyHttpService) {

    var service = {
      uploadData: uploadData
    }
    return service;


    function uploadData(item,fun) {
      switch (item.type){
        case 'gridCheck':
          var url = '/hwweb/GridInspection/saveRegionPro.action';
          MyHttpService.uploadCommonData(url,item.data,function (res) {
            fun(res);
          });
          break;
        default:
          break;
      }
    }

  }

})();
