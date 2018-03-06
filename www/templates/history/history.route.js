(function () {
  'use strict';

  angular
    .module('app.history')
    .config(HistoryConfig);

  HistoryConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function HistoryConfig($stateProvider) {
    $stateProvider
      .state('history', {
        url: '/history',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/history/history.html'
      });
  }
}());
