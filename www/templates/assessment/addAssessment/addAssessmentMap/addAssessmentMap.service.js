(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .service('AddAssessmentService', AddAssessmentService);

  AddAssessmentService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera', 'CommonMapService'];

  /** @ngInject */
  function AddAssessmentService($http, SYS_INFO, $cordovaCamera, CommonMapService) {
    var service = {
      initAddAssessmentMap: initAddAssessmentMap
    }

    return service;

    var center = [120.445467, 36.179479]

    function initAddAssessmentMap() {
        CommonMapService.initMap(center);
    }


  }
})();
