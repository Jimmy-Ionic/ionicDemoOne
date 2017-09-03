(function () {
  'use strict';

  angular
    .module('app.waitForWork')
    .controller('WaitForWorkController', WaitForWorkController);

  WaitForWorkController.$inject = ['$scope','WaitForWorkService','$rootScope','$state'];

  /** @ngInject */
  function WaitForWorkController($scope,WaitForWorkService,$rootScope,$state) {
    var vm = this;
    vm.title = '代办工作';
    vm.titleController = {
    }
    vm.toJobDetails = toJobDetails;

    vm.workList = [
      {
        id: "cc07edd7-892a-4bf0-96dc-52301699663c",
        planName: '6月份综合考核',
        sDate: '2017/6/1',
        eDate: '2017/6/1'
      },
      {
        id: "cc07edd7-892a-4bf0-96dc-52301699663c",
        planName: '6月份综合考核',
        sDate: '2017/6/1',
        eDate: '2017/6/1'
      },
      {
        id: "cc07edd7-892a-4bf0-96dc-52301699663c",
        planName: '6月份综合考核',
        sDate: '2017/6/1',
        eDate: '2017/6/1'
      },
      {
        id: "cc07edd7-892a-4bf0-96dc-52301699663c",
        planName: '6月份综合考核',
        sDate: '2017/6/1',
        eDate: '2017/6/1'
      }
    ];


    activate();


    function activate() {
      console.log($rootScope.userId);
      vm.workList = WaitForWorkService.getWaitForWorkInfo($rootScope.userId);
      console.log(vm.workList);
    }


    function toJobDetails(item) {
      if (item.sDate == '无') {
        $state.go('assessmentStatus', {planDetailsData: item})
      } else {
        $state.go('planDetails', {assessmentData: item, fromWhere: 'waitForWork'})
      }
    }
  }
})();
