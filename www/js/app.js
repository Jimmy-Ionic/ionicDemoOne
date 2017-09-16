(function () {
  'use strict';
  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  // 'starter.services' is found in services.js
  // 'starter.controllers' is found in controllers.js
  angular.module('app', [
    'ionic',
    'ngStorage',
    'ngFileUpload',
    'ng-echarts',
    'ngCordova',
    'app.login',
    'app.home',
    'app.savedData',
    'app.waitForWork',
    'app.assessment',
    'app.planDetails',
    'app.assessmentStatus',
    'app.assessmentStatusDetails',
    'app.addAssessment',
    'app.addAssessmentMap',
    'app.gridCheck',
    'app.gridCheckMap',
    'app.problemFeedback',
    'app.problemFeedbackDetails',
    'app.account',
    'app.accountDetails',
    'app.history',
    'app.map',
    'app.appReceivedMessage',
    'app.messageContent',
    'app.setting',
    'app.setNet',
    'app.commonHttpService',
    'app.commonMap'
  ])
    .run(run)
    .config(config)
    .constant('SYS_INFO', {
      // TODO: 数据访问服务地址（此处定义了手机应用获取数据的服务地址，需要修改成项目实际的地址）
      // TODO: 注意：手机应用发布之前需要修改为生产环境发布的数据服务地址
      'SERVER_PATH': 'http://172.72.100.61',
      'SERVER_PORT': '8090',
      'VERSION': '1.0.0',
      // TODO: 数据小数位数（统一设置手机应用中数据的小数位数，可以根据实际情况修改）
      'DIGITS': 2
    })
    .controller('AppController', AppController);

  AppController.$inject['$scope', 'SYS_INFO', '$rootScope', '$interval', '$http', ' $ionicHistory', '$state', 'LoginService'];

  function AppController($scope, SYS_INFO, $rootScope, $interval, $http, $ionicHistory, $state, LoginService) {
    $rootScope.unReadMsgCount = 0;
    $rootScope.goBack = goBack;
    $rootScope.toMessagePage = toMessagePage;

    var messageApi = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/AppMessage/findMsgByUserId.action?userId=' + 123;

    LoginService.setServerInfo();

    var timer = $interval(function () {
      $http.get(messageApi).then(function (response) {
        if (response.data.success == 1) {
          $rootScope.unReadMsgCount = response.data.data.count;
        } else {
        }
      }, function (response) {
      })
    }, 1000 * 60 * 5);

    timer.then(success, error, defaults);

    function success() {
      console.log("done");
      console.log($rootScope.unReadMsgCount);
    }

    function error() {
      console.log("循环获取获取消息error");
    }

    function defaults() {

    }

    function goBack() {
      $ionicHistory.goBack();
    }

    function toMessagePage() {
      $state.go('recMessage');
    }
  }

  run.$inject = [
    '$rootScope',
    '$location',
    '$ionicPlatform',
    '$ionicHistory',
    '$ionicPopup'
  ];

  function run($rootScope,
               $location,
               $ionicPlatform,
               $ionicHistory,
               $ionicPopup) {

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if (window.codePush) {
        var updateInfoMsg;
        $rootScope.downloadMsg = '';

        var onError = function (error) {
          updateInfoMsg.close();
          $ionicPopup.alert({
            title: '更新提示',
            template: '更新失败！'
          });
        };

        var onInstallSuccess = function () {
          updateInfoMsg.close();
          $ionicPopup.alert({
            title: '更新提示',
            template: '更新成功！'
          }).then(function () {
            codePush.restartApplication();
          });
        };

        var toFix = function (val) {
          return (val / 1024).toFixed(2);
        };

        var onProgress = function (downloadProgress) {
          $rootScope.downloadMsg = toFix(downloadProgress.receivedBytes) + 'kb 共' + toFix(downloadProgress.totalBytes) + 'kb';
        };

        var onPackageDownloaded = function (localPackage) {
          localPackage.install(onInstallSuccess, onError, {
            installMode: InstallMode.ON_NEXT_RESUME,
            minimumBackgroundDuration: 120,
            mandatoryInstallMode: InstallMode.ON_NEXT_RESTART
          });
        };

        var onUpdateCheck = function (remotePackage) {
          if (remotePackage && !remotePackage.failedInstall) {
            $ionicPopup.confirm({
              title: '更新提示',
              template: '有可用的新版本，是否需要更新？',
              cancelText: '否',
              okText: '是'
            }).then(function (res) {
              if (res) {
                updateInfoMsg = $ionicPopup.show({
                  template: '<span>正在下载 {{downloadMsg}}</span>',
                  scope: $rootScope,
                  title: '更新提示'
                });
                remotePackage.download(onPackageDownloaded, onError, onProgress);
              }
            });
          }
        };

        window.codePush.checkForUpdate(onUpdateCheck, onError);
      }
    });

    // $rootScope.$on('$stateChangeStart', function(event, next) {
    //   if (next.name !== 'login') {
    //     if (!Session.isAuthenticated()) {
    //       $location.path('/login');
    //     }
    //   }
    // });

    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function (e) {
      e.preventDefault();
      // Is there a page to go back to?
      var path = $location.path();
      if (path === '/homePageNew' || path === '/login') {
        ionic.Platform.exitApp();
      } else if ($ionicHistory.backView) {
        // Go back in history
        $ionicHistory.goBack();
      } else {
        ionic.Platform.exitApp();
      }

      return false;
    }, 101);
  }

  // 配置模块，控制不同平台的兼容性
  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $urlRouterProvider.otherwise('/login');
  }

})();
