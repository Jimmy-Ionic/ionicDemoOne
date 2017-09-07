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
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '6月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '7月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '8月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '10月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '11月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
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
      for(var i = 0;i<10;i++){

      }
      // AssessmentService.getPlanList($rootScope.userId, function (data) {
      //   vm.planList = data;
      // });
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {planDetailsData: item, fromWhere: 'assessment'});
    }
  }
})();
