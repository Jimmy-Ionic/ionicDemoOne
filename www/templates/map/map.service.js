(function () {
  'use strict';

  angular
    .module('app.map')
    .service('MapService', MapService);

  MapService.$inject = ['$http'];

  /** @ngInject */
  function MapService($http) {
    var service = {
      initMap: initMap
    }

    return service;

    function initMap() {
    }
  }
})();
