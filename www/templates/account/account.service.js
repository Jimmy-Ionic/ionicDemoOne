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
      getAccountListByQueryCriteria: getAccountListByQueryCriteria,
      getQueryCriteriaList: getQueryCriteriaList
    };

    return service;

    function getAccountList(fun) {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }

    function getAccountListByQueryCriteria(queryCriteria,fun) {
      var url = '/hwweb/Ledger/findFacilitiesByCondition.action?areaId=' +
        queryCriteria.cityPlace + '&code=' + queryCriteria.accountType +
        '&subclassId=' + queryCriteria.level + '&name=' + queryCriteria.keyword;
      MyHttpService.getCommonData(url, fun);
    }

    function getQueryCriteriaList(fun) {
      var url = '/hwweb/Ledger/findAllAreaAndItem.action';
      MyHttpService.getCommonData(url, fun);
    }
  }
})();
