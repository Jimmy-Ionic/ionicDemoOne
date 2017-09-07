(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .controller('PlanDetailsController', PlanDetailsController);

  PlanDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'PlanDetailsService'];

  /** @ngInject */
  function PlanDetailsController($rootScope, $scope, $state, $stateParams, PlanDetailsService) {
    var vm = this;
    vm.data = $stateParams.planDetailsData;
    vm.title = '';
    vm.fromWhere = $stateParams.fromWhere;
    vm.fun = {
      toAddAssessment: toAddAssessment
    }
    vm.toAssessmentStatus = toAssessmentStatus;

    vm.planDetailsList = [];


    activate();


    function activate() {
      if (vm.fromWhere == null) {
        vm.fromWhere = 'waitForWork'
      }
      if (vm.data) {
        vm.title = vm.data.planName;
      }
      PlanDetailsService.getPlanDetailsList(vm.data.id, vm.fromWhere, function (responseData) {
        vm.planDetailsList = responseData;
      });
    }


    function toAddAssessment() {
      $state.go('addAssessment');
    }

    function toAssessmentStatus(item) {
      item.planId = vm.data.id;
      $state.go('assessmentStatus', {planDetailsData: item})
    }
  }
})();
