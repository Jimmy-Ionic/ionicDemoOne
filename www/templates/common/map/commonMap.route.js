(function () {
  'use strict';

  angular
    .module('app.commonMap')
    .config(CommonMapConfig);

  CommonMapConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function CommonMapConfig($stateProvider) {
    $stateProvider
      .state('commonMap', {
        url: '/commonMap',
        params: {'data': null, 'from': null},
        templateUrl: 'templates/common/map/commonMap.html'
      });
  }
}());

