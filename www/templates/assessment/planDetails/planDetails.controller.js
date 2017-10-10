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
    vm.fun = {
      toAddAssessment: toAddAssessment
    }
    vm.toAssessmentStatus = toAssessmentStatus;

    vm.planDetailsList = [];


    activate();


    function activate() {

      if ($stateParams.planDetailsData) {
        vm.data = $stateParams.planDetailsData;
        vm.title = $stateParams.planDetailsData.planName;
      }
      $scope.$on('$ionicView.beforeEnter', function (event) {
        PlanDetailsService.getPlanDetailsList(vm.data.id, function (responseData) {
          vm.planDetailsList = responseData;
        });
      });

    }


    function toAddAssessment() {

      if (vm.data.id) {
        var planObj = {
          id: vm.data.id
        }
        $state.go('addAssessment', {addAssessmentData: planObj});
      }
    }

    function toAssessmentStatus(item) {
      item.planId = vm.data.id;
      $state.go('assessmentStatus', {planDetailsData: item})
    }
  }
})();
