(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .service('AccountDetailsService', AccountDetailsService);

  AccountDetailsService.$inject = ['$http','MyHttpService'];
  /** @ngInject */
  function AccountDetailsService($http,MyHttpService) {
    var service = {
    };
    return service;
  }
})();
