(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .service('AssessmentStatusService', AssessmentStatusService);

  AssessmentStatusService.$inject = ['$http', 'SYS_INFO', 'MyHttpService'];

  /** @ngInject */
  function AssessmentStatusService($http, SYS_INFO, MyHttpService) {
    var service = {
      getAssessmentStatusList: getAssessmentStatusList
    }

    return service;

    function getAssessmentStatusList(planDetails, fun) {
      var path = '/hwweb/AssignmentAssessment/findProView.action?' + 'planId=' + planDetails.planId +
        '&infrastructureId=' + planDetails.infraId + '&infoId=' + planDetails.id;
      MyHttpService.getCommonData(path, fun);
    }
  }
})();
