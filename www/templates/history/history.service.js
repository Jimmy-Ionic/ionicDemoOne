(function () {
  'use strict';

  angular
    .module('app.history')
    .service('HistoryService', HistoryService);

  HistoryService.$inject = ['MyHttpService'];

  /** @ngInject */
  function HistoryService(MyHttpService) {
    var service = {
      getHistoryDataByCondition: getHistoryDataByCondition
    };

    return service;

    function getHistoryDataByCondition(queryCriteria, fun) {
      var url = '/hwweb/Comprehensive/viewHistory.action?name=' + queryCriteria.keyword +
        '&year=' + queryCriteria.selectedYeah + '&month=' + queryCriteria.selectedMonth;
      MyHttpService.getCommonData(url, fun);
    }
  }
})();
