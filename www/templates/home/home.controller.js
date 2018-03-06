(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = [
    '$rootScope',
    '$localStorage',
    '$scope',
    '$state',
    '$filter',
    'HomeService',
    'SYS_INFO',
    'GetWeatherService',
    '$stateParams',
    '$interval',
    '$cordovaCamera',
    '$ionicPopup'
  ];

  function HomeController($rootScope,
                          $localStorage,
                          $scope,
                          $state,
                          $filter,
                          HomeService,
                          SYS_INFO,
                          GetWeatherService,
                          $stateParams,
                          $interval,
                          $cordovaCamera,
                          $ionicPopup) {
    var vm = this;
    vm.title = '请选择工作';
    vm.hasSavedData = true;
    vm.saveDataNum = '20';
    vm.savedData = {};
    vm.isCommonAccount = $rootScope.isCommonAccount;
    vm.weather = {};
    vm.msgCount = $rootScope.unReadMsgCount;
    vm.homeWorkController = {
      toWaitForWork: toWaitForWork,
      toComprehensiveAssessment: toComprehensiveAssessment,
      toGridCheck: toGridCheck,
      toProblemFeedback: toProblemFeedback,
      toAccount: toAccount,
      toHistory: toHistory,
      toMap: toMap,
      toMessage: toMessage,
      toSettings: toSettings,
      toSavedData: toSavedData
    }

    activate();


    function activate() {

      HomeService.createSqlDB(function () {
        $scope.$on('$ionicView.enter', function (event) {
          HomeService.getContentDataNum(function (res) {
            vm.saveDataNum = res;
          })
        });
      });

      GetWeatherService.getWeather(function (resData) {
        vm.weather = resData;
      });

      vm.savedData = HomeService.getSavedUploadedData();
      if (vm.savedData) {
        vm.hasSavedData = true;
        vm.saveDataNum = vm.savedData.length;
      } else {
        // vm.savedData = false;
      }

      var timer = $interval(function () {
        HomeService.getUnReadMsgCount($rootScope.userId);
      }, 1000 * 60 * 5);

      timer.then(success, error, defaults);

      function success() {
        console.log("轮询获取消息success");
      }

      function error() {
        console.log("循环获取获取消息error");
      }

      function defaults() {

      }
    }


    function toWaitForWork() {
      $state.go('waitForWork');
    }

    function toComprehensiveAssessment() {
      if (vm.isCommonAccount) {
        $ionicPopup.alert(
          {
            title: '提示',
            template: '公共账户无法查看综合考核'
          }
        );
      } else {
        $state.go('assessment');
      }
    }

    function toGridCheck() {
      $state.go('gridCheck');
    }


    function toProblemFeedback() {
      $state.go('problemFeedback');
    }

    function toAccount() {
      $state.go('account');
    }

    function toHistory() {
      $state.go('history');
    }

    function toMap() {
      $state.go('map');
    }

    function toMessage() {
      $state.go('recMessage');
    }

    function toSettings() {
      $state.go('setting');
    }

    function toSavedData() {
      $state.go('savedData');
    }

  }
})();
