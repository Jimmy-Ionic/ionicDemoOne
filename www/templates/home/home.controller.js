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
    '$interval'
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
                          $interval) {
    var vm = this;
    vm.title = '请选择工作';
    vm.hasSavedData = true;
    vm.saveDataNum = '20';
    vm.savedData = {};
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
    };

    activate();


    function activate() {
      if (GetWeatherService.getWeather()) {
        vm.weather = GetWeatherService.getWeather();
      }
      console.log(vm.weather);

      vm.savedData = HomeService.getSavedUploadedData();
      if (vm.savedData) {
        vm.hasSavedData = true;
        vm.saveDataNum = vm.savedData.length;
      } else {
        // vm.savedData = false;
      }

    }


    function toWaitForWork() {
      $state.go('waitForWork');
    }

    function toComprehensiveAssessment() {
      $state.go('assessment');
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
      $state.go('savedData', {savedData: vm.savedData});
    }

  }
})();
