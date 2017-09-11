(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .controller('PlanDetailsController', PlanDetailsController);

  PlanDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'PlanDetailsService'];

  /** @ngInject */
  function PlanDetailsController($rootScope, $scope, $state, $stateParams, PlanDetailsService) {
    var vm = this;
    vm.data = {}
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

      if ($stateParams.planDetailsData) {
        vm.data = $stateParams.planDetailsData;
        vm.title = vm.data.planName;
      }

      //判断上一页面是代办工作，综合考核，还是历史记录
      switch (vm.fromWhere) {
        case 'waitForWork':
          break;
        case 'assessment':
          break;
        case 'history':
          break;
        default:
          break;
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
