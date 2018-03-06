(function () {
  'use strict';

  angular
    .module('app.gridCheckMap')
    .config(GridCheckConfig);

  GridCheckConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function GridCheckConfig($stateProvider) {
    $stateProvider
      .state('gridCheckMap', {
        url: '/gridCheckMap',
        params: {mapData: null},
        cache:true,
        templateUrl: 'templates/gridCheck/gridCheckMap/gridCheckMap.html'
      });
  }
}());

