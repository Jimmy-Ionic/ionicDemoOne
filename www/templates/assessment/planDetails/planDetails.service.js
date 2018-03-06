(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .service('PlanDetailsService', PlanDetailsService);

  PlanDetailsService.$inject = ['MyHttpService'];

  /** @ngInject */
  function PlanDetailsService(MyHttpService) {

    var service = {
      getPlanDetailsList: getPlanDetailsList
    }

    return service;


    function getPlanDetailsList(id, fun) {
      var path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
      MyHttpService.getCommonData(path, fun);
    }
  }
})();
