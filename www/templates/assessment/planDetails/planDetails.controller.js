(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .controller('PlanDetailsController', PlanDetailsController);

  PlanDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'PlanDetailsService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function PlanDetailsController($rootScope, $scope, $state, $stateParams, PlanDetailsService, $ionicLoading, $ionicPopup) {
    var vm = this;
    vm.data = $stateParams.assessmentData;
    vm.title = vm.data.workName;
    // vm.fromWhere = $stateParams.fromWhere;
    vm.fromWhere = 'assessment'
    vm.fun = {
      toAddAssessment:toAddAssessment
    }
    vm.toAssessmentStatus = toAssessmentStatus;

    vm.planDetailsList = [
      {
        id: '1',
        name: '山东路',
        type: '道路',
        status: '0'
      },
      {
        id: '2',
        name: '香港路',
        type: '道路',
        status: '1'
      },
      {
        id: '3',
        name: '江西路',
        type: '道路',
        status: '1'
      },
      {
        id: '4',
        name: '宁夏路公厕',
        type: '道路',
        status: '1'
      },
      {
        id: '5',
        name: '银川路公厕',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },{
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },{
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      }
    ];


    activate();


    function activate() {
      // PlanDetailsService.getPlanDetailsList(vm.data.id, vm.fromWhere);
    }


    function getDataFromFrontPage() {

    }


    function toAddAssessment() {
      $state.go('addAssessment');
    }

    function toAssessmentStatus(item) {
      $state.go('assessmentStatus', {planDetailsData: item})
    }
  }
})();
