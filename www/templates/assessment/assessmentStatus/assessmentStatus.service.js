(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .service('AssessmentStatusService', AssessmentStatusService);

  AssessmentStatusService.$inject = ['$http','SYS_INFO','MyHttpService'];
  /** @ngInject */
  function AssessmentStatusService($http,SYS_INFO,MyHttpService) {
    var service = {
      getAssessmentStatusList: getAssessmentStatusList
    }

    return service;

    function getAssessmentStatusList(planDetailId) {
      var path = '' + planDetailId;
      return MyHttpService.getCommonData(path);
    }
  }
})();
