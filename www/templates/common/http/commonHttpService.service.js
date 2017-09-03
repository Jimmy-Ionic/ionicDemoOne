(function () {
  'use strict';

  angular
    .module('app.commonHttpService')
    .service('MyHttpService', MyHttpService);

  MyHttpService.$inject = ['$http', '$ionicLoading', '$ionicPopup', 'SYS_INFO'];

  /** @ngInject */
  function MyHttpService($http, $ionicLoading, $ionicPopup, SYS_INFO) {
    var service = {
      getCommonData: getCommonData
    };

    return service;



    function getCommonData(urlPath) {

      var data = [];

      $ionicLoading.show(
        {
          templateUrl: 'templates/common/common.loadingData.html',
          duration: 20 * 1000
        });
      $http({
        method: 'GET',
        url: SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath
      }).then(function (response) {
        if (response.data.success == 1) {
          $ionicLoading.hide();
          data = response.data.data;
          console.log(data);
          return data;
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: response.data.msg
          }).then(function (res) {
            return data;
          });
        }
      }, function (response) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '获取数据失败',
          template: response.data
        }).then(function (res) {
          return data;
        });
      });
    }


    //上传数据通用方法

    function uploadData() {

    }


  }
})();
