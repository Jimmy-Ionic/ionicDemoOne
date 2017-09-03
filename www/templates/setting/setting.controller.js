(function () {
  'use strict';

  angular
    .module('app.setting')
    .controller('SettingController', SettingController);

  SettingController.$inject = ['$rootScope', '$scope', 'GetWeatherService'];

  /** @ngInject */
  function SettingController($rootScope, $scope, GetWeatherService) {
    var vm = this;
    vm.title = '个人信息';
    vm.group = $rootScope.userOrg;
    vm.name = $rootScope.userName;
    vm.weather = {};

    activate();

    function activate() {
      var weatherInfo = GetWeatherService.getWeather();
      if (weatherInfo) {
        vm.weather = weatherInfo;
      }
    }
  }
})();
