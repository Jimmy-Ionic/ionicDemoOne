(function () {
  'use strict';

  angular
    .module('app.setting')
    .service('userInfoService', userInfoService);

  userInfoService.$inject = ['$http'];
  /** @ngInject */
  function userInfoService($http) {
    var service = {};

    return service;

  }
})();
