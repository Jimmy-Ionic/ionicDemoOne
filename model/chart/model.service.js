(function () {
  'use strict';

  angular
    .module('app.Model')
    .service('ModelService', ModelService);

  ModelService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function ModelService($http, SYS_INFO) {
    // 此处定义数据获取方法
    var service = {
      getLineChartData: lineChartData,
      getColumnChartData: columnChartData,
      getPieChartData: pieChartData
    };

    return service;

    ////////////////

    function lineChartData() {
      return $http.get(SYS_INFO.SERVER_PATH + '/demodata/demo/getlinedata')
        .then(getDataComplete)
        .catch(getDataFailed);
    }

    function columnChartData() {
      return $http.get(SYS_INFO.SERVER_PATH + '/demodata/demo/getcolumndata')
        .then(getDataComplete)
        .catch(getDataFailed);
    }

    function pieChartData() {
      return $http.get(SYS_INFO.SERVER_PATH + '/demodata/demo/getpiedata')
        .then(getDataComplete)
        .catch(getDataFailed);
    }

    function getDataComplete(response) {
      return response.data;
    }

    function getDataFailed() {
      var result = {
        failed: true
      };

      return result;
    }
  }
})();
