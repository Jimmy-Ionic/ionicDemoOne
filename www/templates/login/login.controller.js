/* global hex_md5 */
(function () {
  'use strict';

  var loginModule = angular.module('app.login');
  loginModule.controller('LoginController', LoginController);

  LoginController.$inject = [
    '$scope',
    '$state',
    'LoginService',
    '$cordovaDevice'
  ];

  function LoginController($scope,
                           $state,
                           LoginService,
                           $cordovaDevice) {

    $scope.doLogin = doLogin;
    $scope.setNetAddress = setNetAddress;

    $scope.isCommonAccount = false;
    $scope.userInfo = LoginService.getUserInfo();
    $scope.imei = '123456';
    $scope.imei2 = '';

    $scope.info = {
      userName: $scope.userInfo.userName,
      password: $scope.userInfo.password,
      isRemAccountAndPwd: $scope.userInfo.isRemAccountAndPwd
    };

    activate();


    function activate() {

      // $scope.imei = device.imei;
      // var uuid = device.uuid;
      // $ionicPopup.alert({
      //   title: 'imei:' + $scope.imei + 'uuid' + uuid
      // })
      // ;
    }


    // LoginService.setServerInfo();


    function setNetAddress() {
      $state.go('setNet', {imei: $scope.imei});
    }


    function doLogin() {
      LoginService.login($scope.info.userName, $scope.info.password, $scope.imei, $scope.isCommonAccount, $scope.info.isRemAccountAndPwd, $scope.info);
    }

  }
})();
