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
        params: {accountData: null},
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/account/accountDetails/accountDetails.html'
      });
  }
}());
