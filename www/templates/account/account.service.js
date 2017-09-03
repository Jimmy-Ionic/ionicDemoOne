(function () {
  'use strict';

  angular
    .module('app.account')
    .service('AccountService', AccountService);

  AccountService.$inject = ['$http'];
  /** @ngInject */
  function AccountService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();
