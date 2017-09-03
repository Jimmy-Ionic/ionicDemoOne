(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .config(AccountDetailsConfig);

  AccountDetailsConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AccountDetailsConfig($stateProvider) {
    $stateProvider
      .state('accountDetails', {
        url: '/accountDetails',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/account/account.html'
      });
  }
}());
