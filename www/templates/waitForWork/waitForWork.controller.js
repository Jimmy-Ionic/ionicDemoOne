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
    vm.titleController = {};
    vm.workList = [];
    vm.toJobDetails = toJobDetails;



    activate();


    function activate() {
      console.log($rootScope.userId);
      WaitForWorkService.getWaitForWorkInfo($rootScope.userId,function (data) {
        vm.workList = data;
        console.log(vm.workList);
      });
    }


    function toJobDetails(item) {
      if (item.sDate == '无') {
        $state.go('problemFeedbackDetails', {problemItem: item,fromWhere: 'waitForWork'});
      } else {
        $state.go('planDetails', {planDetailsData: item, fromWhere: 'waitForWork'});
      }
    }
  }
})();
