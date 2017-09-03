(function () {
  'use strict';

  angular
    .module('app.waitForWork')
    .config(WaitForWorkConfig);

  WaitForWorkConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function WaitForWorkConfig($stateProvider) {
    $stateProvider
      .state('waitForWork', {
        url: '/waitForWork',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/waitForWork/waitForWork.html'
      });
  }
}());
