(function () {
  'use strict';

  angular
    .module('app.assessment')
    .controller('AssessmentController', AssessmentController);

  AssessmentController.$inject = ['$rootScope', '$scope', '$state', 'AssessmentService'];

  /** @ngInject */
  function AssessmentController($rootScope, $scope, $state, AssessmentService) {

    var vm = this;
    vm.title = '综合考核';
    vm.titleController = {}

    vm.toPlanDetails = toPlanDetails;

    vm.planList = [];


    activate();


    function activate() {
      AssessmentService.getPlanList($rootScope.userId, function (data) {
        vm.planList = data;
      });
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {planDetailsData: item, fromWhere: 'assessment'});
    }
  }
})();
