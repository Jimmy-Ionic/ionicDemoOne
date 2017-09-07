(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .service('AddAssessmentMapService', AddAssessmentMapService);

  AddAssessmentMapService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera', 'CommonMapService'];

  /** @ngInject */
  function AddAssessmentMapService($http, SYS_INFO, $cordovaCamera, CommonMapService) {
    var service = {
      initAddAssessmentMap: initAddAssessmentMap
    }

    return service;

    function initAddAssessmentMap() {}


  }
})();
