(function () {
  'use strict';

  angular
    .module('app.map')
    .controller('MapController', MapController);

  MapController.$inject = ['$scope','GetWeatherService','MyMapService'];
  /** @ngInject */
  function MapController($scope,GetWeatherService,MyMapService) {
    var vm = this;
    vm.title = '地图查询';
    vm.position = '市南区';

    vm.weather = {};

    activate();

    function activate() {
      var weatherInfo = GetWeatherService.getWeather();
      if (weatherInfo) {
        vm.weather = weatherInfo;
      }

      MyMapService.initMap();

    }
  }
})();
