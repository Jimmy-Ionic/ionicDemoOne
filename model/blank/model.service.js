(function () {
  'use strict';

  angular
    .module('app.Model')
    .service('ModelService', ModelService);

  ModelService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function ModelService($http, SYS_INFO) {
    var service = {};

    return service;

    ////////////////
  }
})();
