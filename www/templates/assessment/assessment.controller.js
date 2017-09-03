(function () {
  'use strict';

  angular
    .module('app.assessment')
    .controller('AssessmentController', AssessmentController);

  AssessmentController.$inject = ['$rootScope', '$scope', '$state', 'AssessmentService', '$ionicLoading', '$ionicPopup', '$timeout', '$ionicHistory'];

  /** @ngInject */
  function AssessmentController($rootScope, $scope, $state, AssessmentService, $ionicLoading, $ionicPopup, $timeout) {

    var vm = this;
    vm.title = '综合考核';
    vm.titleController = {}

    vm.toPlanDetails = toPlanDetails;

    vm.planList = [
      {
        id: '1',
        workName: '6月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: '2',
        workName: '7月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '3',
        workName: '8月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '5',
        workName: '10月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '6',
        workName: '11月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: '7',
        workName: '12月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      }
    ];


    activate();


    function activate() {
      // vm.planList = AssessmentService.getPlanList($rootScope.userId);
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {assessmentData: item, fromWhere: 'assessment'});
    }
  }
})();
