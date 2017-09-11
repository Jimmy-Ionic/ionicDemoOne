(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .service('AccountDetailsService', AccountDetailsService);

  AccountDetailsService.$inject = ['$http','MyHttpService'];
  /** @ngInject */
  function AccountDetailsService($http,MyHttpService) {
    var service = {
      getAccountDetailsData:getAccountDetailsData
    };

    return service;

    function getAccountDetailsData(fun) {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }
  }
})();
