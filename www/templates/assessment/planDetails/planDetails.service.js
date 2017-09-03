(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .service('PlanDetailsService', PlanDetailsService);

  PlanDetailsService.$inject = ['$http', 'SYS_INFO'];

  /** @ngInject */
  function PlanDetailsService($http, SYS_INFO) {

    var service = {
      getPlanDetailsList: getPlanDetailsList
    }

    return service;


    function getPlanDetailsList(id, fromWhere) {

      var path = '';

      switch (fromWhere) {
        case 'waitForWork':
          path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
          break;
        case 'assessment':
          path = '';
          break;
        default:
          break;
      }

      return MyHttpService.getCommonData(path);

    }
  }
})();
