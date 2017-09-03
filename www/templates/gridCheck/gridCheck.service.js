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


    function getGridCheckQuestionCodeArray() {
      return MyHttpService.getCommonData();
    }


    function uploadGridCheckData(data) {

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        });

      var options = new FileUploadOptions();

      var params = {
        facilityIdentify: '217ae60e5bc746f',
        cyberkeyCode: 'AQOhlmsQAAKgCoi',
        tenantId: 1
      };
      options.params = params;

      $cordovaFileTransfer.upload(encodeURI(url),data, options).then(function (result) {
        console.log(JSON.stringify(result.response));
        console.log("success");
        $ionicLoading.hide();

      }, function (err) {
        console.log(JSON.stringify(err));
        console.log("fail");
        $ionicLoading.hide();
      }, function (progress) {

      })
    }


  }
})();
