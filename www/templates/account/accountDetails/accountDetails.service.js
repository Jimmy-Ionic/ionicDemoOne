(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .service('AccountDetailsService', AccountDetailsService);

  AccountDetailsService.$inject = ['$http'];
  /** @ngInject */
  function AccountDetailsService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();
