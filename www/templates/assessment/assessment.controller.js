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
    vm.fun = {
      pullToRefreshAssessmentData:pullToRefreshAssessmentData
    };


    activate();


    function activate() {
      AssessmentService.getPlanList($rootScope.userId, function (data) {
        vm.planList = data;
      });
    }

    function pullToRefreshAssessmentData() {
      AssessmentService.getPlanList($rootScope.userId, function (data) {
        vm.planList = data;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {planDetailsData: item, fromWhere: 'assessment'});
    }
  }
})();
