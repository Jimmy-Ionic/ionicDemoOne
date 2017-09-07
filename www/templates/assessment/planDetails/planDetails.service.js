(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .service('PlanDetailsService', PlanDetailsService);

  PlanDetailsService.$inject = ['$http', 'SYS_INFO','MyHttpService'];

  /** @ngInject */
  function PlanDetailsService($http, SYS_INFO,MyHttpService) {

    var service = {
      getPlanDetailsList: getPlanDetailsList
    }

    return service;


    function getPlanDetailsList(id, fromWhere,fun) {

      var path = '';

      switch (fromWhere) {
        case 'waitForWork':
          path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
          MyHttpService.getCommonData(path,fun);
          break;
        case 'assessment':
          path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
          MyHttpService.getCommonData(path,fun);
          break;
        default:
          break;
      }


    }
  }
})();
