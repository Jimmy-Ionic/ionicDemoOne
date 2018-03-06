(function () {
  'use strict';

  angular
    .module('app.login')
    .service('LoginService', LoginService);

  LoginService.$inject = ['$localStorage', '$http', 'SYS_INFO', '$timeout', '$ionicLoading', '$ionicPopup', '$rootScope', '$cordovaDevice','$state'];


  function LoginService($localStorage, $http, SYS_INFO, $timeout, $ionicLoading, $ionicPopup, $rootScope, $cordovaDevice,$state) {

    var service = {
      login: login,
      getUserInfo: getUserInfo,
      setServerInfo: setServerInfo,
      getImei: getImei
    };

    return service;


    function login(userName, pwd, imei, isCommonAccount, isRemAccountAndPwd,info) {
      $ionicLoading.show({
        template: '正在登录...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 30000);
      pwd = hex_md5(pwd);
      var path = '/hwweb/AppUser/userLogin.action?';
      switch (isCommonAccount) {
        case false:
          $http.get(SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + path + 'account=' + userName + '&' + 'password=' + pwd + '&' + 'imei=' + imei)
            .then(function (response) {
              $rootScope.isCommonAccount = false;
              success(response, isRemAccountAndPwd,info);
            }, function (response) {
              error(response)
            });
          break;
        case  true:
          $http.get(SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + path + 'account=' + userName + '&' + 'password=' + pwd)
            .then(function (response) {
              $rootScope.isCommonAccount = true;
              success(response, isRemAccountAndPwd,info);
            }, function (response) {
              error(response)
            });
          break;
        default:
          break;
      }
    }

    function success(res, isRemAccountAndPwd,info) {
      console.log(res);
      if (res.data.success == '1') {
        $timeout(function () {
          if (isRemAccountAndPwd) {
            createSession(info);
          } else {
            destroySession();
          }
          saveUserInfo(res.data.data[0]);
        }, 100).then(function () {
          $ionicLoading.hide();
          $state.go('home');
        });
      } else {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: res.data.msg
        }).then(function (res) {
        });
      }
    }

    function error(res) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: '登陆失败',
        template: res.data
      }).then(function (res) {
      });
    }

    function saveUserInfo(userInfo) {
      if (userInfo) {
        $rootScope.userId = userInfo.id;
        $rootScope.userName = userInfo.name;
        $rootScope.userOrg = userInfo.org;
      } else {
        $rootScope.userId = '';
        $rootScope.userName = '';
        $rootScope.userOrg= '';
      }
    }

    function createSession(info) {
      var userInfo = {
        userName: '',
        password: '',
        isRemAccountAndPwd: false
      };

      if (info) {
        userInfo.userName = info.userName;
        userInfo.password = info.password;
        userInfo.isRemAccountAndPwd = info.isRemAccountAndPwd;
      }

      $localStorage.userInfo = userInfo;
    }

    function getImei() {
      document.addEventListener("deviceready", onDeviceReady, false);

      function onDeviceReady() {
        return $cordovaDevice.getUUID();
      }
    }

    function getUserInfo() {
      var userInfo = {
        userName: '',
        password: '',
        isRemAccountAndPwd: false
      };

      if ($localStorage.userInfo) {
        userInfo.userName = $localStorage.userInfo.userName;
        userInfo.password = $localStorage.userInfo.password;
        userInfo.isRemAccountAndPwd = $localStorage.userInfo.isRemAccountAndPwd;
      }
      return userInfo;
    }

    function destroySession() {
      delete $localStorage.userInfo;
    }

    function setServerInfo() {

      var serverInfo = {
        SERVER_PATH: '',
        SERVER_PORT: ''
      }

      if ($localStorage.serverInfo) {
        SYS_INFO.SERVER_PATH = $localStorage.serverInfo.SERVER_PATH;
        SYS_INFO.SERVER_PORT = $localStorage.serverInfo.SERVER_PORT;
      } else {
        serverInfo.SERVER_PATH = SYS_INFO.SERVER_PATH;
        serverInfo.SERVER_PORT = SYS_INFO.SERVER_PORT;
        $localStorage.serverInfo = serverInfo;
      }
    }

  }
})();
