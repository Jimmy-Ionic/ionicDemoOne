(function () {
  'use strict';

  angular
    .module('app.history')
    .service('HistoryService', HistoryService);

  HistoryService.$inject = ['MyHttpService'];

  /** @ngInject */
  function HistoryService(MyHttpService) {
    var service = {
      getHistoryData: getHistoryData,
      getHistoryDataByCondition: getHistoryDataByCondition
    };

    return service;

    function getHistoryData(userId, fun) {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }

    function getHistoryDataByCondition(queryCriteria,fun) {
      var url = '';
      MyHttpService.getCommonData(url,fun);
    }

  }
})();
