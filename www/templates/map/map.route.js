(function () {
  'use strict';

  angular
    .module('app.map')
    .config(MapConfig);

  MapConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function MapConfig($stateProvider) {
    $stateProvider
      .state('map', {
        url: '/map',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/map/map.html'
      });
  }
}());
