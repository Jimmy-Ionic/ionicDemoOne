(function () {
  'use strict';

  angular
    .module('app.history')
    .service('HistoryService', HistoryService);

  HistoryService.$inject = ['$http','MyHttpService'];
  /** @ngInject */
  function HistoryService($http,MyHttpService) {
    var service = {
      getHistoryData:getHistoryData,
      getHistoryDataByCondition:getHistoryDataByCondition
    };

    return service;

    function getHistoryData(userId) {
      var url = '';
      return MyHttpService.getCommonData(url);
    }

    function getHistoryDataByCondition(year,month,other) {
      var url = '';
      return MyHttpService.getCommonData(url);
    }
  }
})();
