(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .config(GridCheckConfig);

  GridCheckConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function GridCheckConfig($stateProvider) {
    $stateProvider
      .state('gridCheck', {
        url: '/gridCheck',
        params: {position: []},
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/gridCheck/gridCheck.html'
      });
  }
}());
