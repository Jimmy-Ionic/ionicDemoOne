(function () {
  'use strict';

  angular
    .module('app.Model')
    .service('ModelService', ModelService);

  ModelService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function ModelService($http, SYS_INFO) {
    var service = {
      getDataItems: dataitems
    };

    return service;

    ////////////////

    function dataitems() {
      return $http.get(SYS_INFO.SERVER_PATH + '/demodata/demo/getdataitem')
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
