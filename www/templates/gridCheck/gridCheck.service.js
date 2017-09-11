(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .service('GridCheckService', GridCheckService);

  GridCheckService.$inject = ['MyHttpService', '$ionicPopup', '$ionicLoading'];

  /** @ngInject */
  function GridCheckService(MyHttpService, $ionicPopup, $ionicLoading) {

    var service = {
      getGridCheckQuestionCodeArray: getGridCheckQuestionCodeArray,
      uploadGridCheckData: uploadGridCheckData
    }

    return service;


    function getGridCheckQuestionCodeArray(fun) {
       var url = '';
       MyHttpService.getCommonData(url,fun);
    }


    //上传网格化巡检的数据
    function uploadGridCheckData(jsonStr,fun) {
      var url = '/hwweb/GridInspection/saveRegionPro.action';
      MyHttpService.uploadCommonData(url,jsonStr,fun);
      // var options = new FileUploadOptions();
      // var params = {
      //   facilityIdentify: '217ae60e5bc746f',
      //   cyberkeyCode: 'AQOhlmsQAAKgCoi',
      //   tenantId: 1
      // };
      // options.params = params;
      // $cordovaFileTransfer.upload(encodeURI(url),data, options).then(function (result) {
      //   console.log(JSON.stringify(result.response));
      //   console.log("success");
      //   $ionicLoading.hide();
      //
      // }, function (err) {
      //   console.log(JSON.stringify(err));
      //   console.log("fail");
      //   $ionicLoading.hide();
      // }, function (progress) {
      //
      // })
    }
  }
})();
