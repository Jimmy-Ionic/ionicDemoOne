/* global hex_md5 */
(function () {
  'use strict';

  angular.module('app.setNet')
    .controller('SetNetController', SetNetController);

  SetNetController.$inject = ['$scope', 'SetNetService', 'SYS_INFO', '$ionicHistory', '$stateParams'];

  function SetNetController($scope, SetNetService, SYS_INFO, $ionicHistory, $stateParams) {
    $scope.netSetList = [
      {placeholderValue: '服务器地址：', value: SYS_INFO.SERVER_PATH},
      {placeholderValue: '服务器端口：', value: SYS_INFO.SERVER_PORT}
    ];
    $scope.IMEI = $stateParams.imei;

    $scope.setNet = function () {
      SetNetService.saveNetSettings($scope.netSetList[0].value, $scope.netSetList[1].value, function () {
        $ionicHistory.goBack();
      });
    }

    $scope.backToLogin = function () {
      $ionicHistory.goBack();
    }

  }
})();
