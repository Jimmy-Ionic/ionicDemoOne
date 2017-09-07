(function () {
  'use strict';

  angular
    .module('app.history')
    .service('HistoryService', HistoryService);

  HistoryService.$inject = ['MyHttpService'];
  /** @ngInject */
  function HistoryService(MyHttpService) {
    var service = {
      getHistoryData:getHistoryData,
      getHistoryDataByCondition:getHistoryDataByCondition
    };

    return service;

    function getHistoryData(userId) {
      var url = '';
      return MyHttpService.getCommonData(url);
    }

    function getHistoryDataByCondition(year,month,keyword) {
      var url = '';
      return MyHttpService.getCommonData(url);
    }
    
  }
})();
