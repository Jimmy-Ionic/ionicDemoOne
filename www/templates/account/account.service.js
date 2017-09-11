(function () {
  'use strict';

  angular
    .module('app.account')
    .service('AccountService', AccountService);

  AccountService.$inject = ['$http', 'MyHttpService'];

  /** @ngInject */
  function AccountService($http, MyHttpService) {

    var service = {
      getAccountList: getAccountList,
      getAccountListByQueryCriteria:getAccountListByQueryCriteria
    };

    return service;

    function getAccountList(fun) {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }

    function getAccountListByQueryCriteria() {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }
  }
})();
