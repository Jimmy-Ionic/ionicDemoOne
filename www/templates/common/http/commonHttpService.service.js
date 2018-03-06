(function () {
  'use strict';

  angular
    .module('app.commonHttpService')
    .service('MyHttpService', MyHttpService);

  MyHttpService.$inject = ['$http', '$ionicLoading', '$ionicPopup', 'SYS_INFO'];

  /** @ngInject */
  function MyHttpService($http, $ionicLoading, $ionicPopup, SYS_INFO) {
    var service = {
      getCommonData: getCommonData,
      uploadCommonData: uploadCommonData
    };

    return service;


    function getCommonData(urlPath, fun) {

      console.log(SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath);

      var data = [];

      $ionicLoading.show(
        {
          templateUrl: 'templates/common/common.loadingData.html',
          duration: 20 * 1000
        });
      $http({
        method: 'GET',
        url: SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      }).then(function (response) {
        if (response.data.success == 1) {
          $ionicLoading.hide();
          data = response.data.data;
          console.log('数据获取成功');
          console.log(data);
          fun(data);
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '提示',
            template: '获取数据失败'
          }).then(function (res) {
            console.log('数据获取失败');
            console.log(data);
            fun(data);
          });
        }
      }, function (response) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '提示',
          template: '获取数据失败'
        }).then(function (res) {
          console.log('通信异常');
          console.log(data);
          fun(data);
        });
      });
    }


    //上传数据通用方法
    function uploadCommonData(urlPath, jsonStr, fun) {

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        }
      );

      var url = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath;
      console.log(url);
      console.log(jsonStr);
      // $http({
      //   method: 'post',
      //   url: SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath,
      //   data: {data: jsonStr}
      // }).then(function (res) {
      $http({
        method: 'post',
        url: url,
        data: {data: jsonStr},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          console.log(str.join("&"));
          return str.join("&");

        }
      }).then(function (res) {
        if (res.data.success = 1) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '提示',
            template: res.data.msg
          }).then(function (res) {
            fun('success');
          })
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '数据上传失败'
          }).then(function (res) {
            fun('failed');
          })
        }
      }, function (error) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '数据上传失败'
        }).then(function (res) {
          fun('failed');
        })
      });
    }


  }
})();
