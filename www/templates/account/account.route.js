(function () {
  'use strict';

  angular
    .module('app.account')
    .config(AccountConfig);

  AccountConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AccountConfig($stateProvider) {
    $stateProvider
      .state('account', {
        url: '/account',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/account/account.html'
      });
  }
}());
