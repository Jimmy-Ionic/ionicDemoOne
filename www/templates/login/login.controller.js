/* global hex_md5 */
(function () {
  'use strict';

  var loginModule = angular.module('app.login');
  loginModule.controller('LoginController', LoginController);

  LoginController.$inject = [
    '$scope',
    '$state',
    'LoginService'
  ];

  function LoginController($scope,
                           $state,
                           LoginService) {

    $scope.doLogin = doLogin;
    $scope.setNetAddress = setNetAddress;

    $scope.isCommonAccount = false;
    $scope.userInfo = LoginService.getUserInfo();
    $scope.imei = '123456';

    $scope.info = {
      userName: $scope.userInfo.userName,
      password: $scope.userInfo.password,
      isRemAccountAndPwd: $scope.userInfo.isRemAccountAndPwd
    };


    // LoginService.setServerInfo();


    function setNetAddress() {
      $state.go('setNet', {imei: $scope.imei});
    }


    function doLogin() {
      LoginService.login($scope.info.userName, $scope.info.password, $scope.imei, $scope.isCommonAccount, $scope.info.isRemAccountAndPwd,$scope.info);
    }

  }
})();
