(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .controller('AssessmentStatusController', AssessmentStatusController);

  AssessmentStatusController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AssessmentStatusService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function AssessmentStatusController($rootScope, $scope, $state, $stateParams, AssessmentStatusService, $ionicLoading, $ionicPopup) {
    var vm = this;
    vm.title = '考核情况';
    vm.data = $stateParams.planDetailsData;
    vm.titleController = {
      backToBeforePage: backToBeforePage,
      enterMsg: enterMsg
    }
    vm.toAssessmentStatusDetails = toAssessmentStatusDetails;

    vm.assessmentStatusList = [
      {
        id: '1',
        address: '山东路',
        problem: '废弃物超标',
        points: '1'
      },
      {
        id: '2',
        address: '银川路',
        problem: '垃圾桶占路',
        points: '2'
      },
      {
        id: '3',
        address: '山东路',
        problem: '废弃物超标',
        points: '1'
      },
      {
        id: '4',
        address: '银川路',
        problem: '垃圾桶占路',
        points: '2'
      },
      {
        id: '5',
        address: '山东路',
        problem: '废弃物超标',
        points: '1'
      },
      {
        id: '6',
        address: '银川路',
        problem: '垃圾桶占路',
        points: '2'
      },
      {
        id: '7',
        address: '山东路',
        problem: '废弃物超标',
        points: '1'
      },
      {
        id: '8',
        address: '银川路',
        problem: '垃圾桶占路',
        points: '2'
      }
    ];


    activate();

    function activate() {

      // vm.assessmentStatusList = AssessmentStatusService.getAssessmentStatusList(vm.data.id);

    }

    function backToBeforePage() {

    }

    function enterMsg() {

    }

    function toAssessmentStatusDetails(item) {
      $state.go('assessmentStatusDetails', {assessmentStatusData: item})

    }
  }
})();
