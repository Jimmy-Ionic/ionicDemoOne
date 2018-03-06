(function () {
  'use strict';

  angular
    .module('app.waitForWork')
    .controller('WaitForWorkController', WaitForWorkController);

  WaitForWorkController.$inject = ['$scope', 'WaitForWorkService', '$rootScope', '$state'];

  /** @ngInject */
  function WaitForWorkController($scope, WaitForWorkService, $rootScope, $state) {
    var vm = this;
    vm.title = '待办工作';
    vm.titleController = {};
    vm.workList = [];
    vm.isCommonAccount = $rootScope.isCommonAccount;
    vm.toJobDetails = toJobDetails;
    vm.fun = {
      pullToRefreshWaitForWorkDetails: pullToRefreshWaitForWorkDetails
    }


    activate();


    function activate() {
      $scope.$on('$ionicView.beforeEnter', function (event) {
        WaitForWorkService.getWaitForWorkInfo($rootScope.userId, function (data) {
          if(vm.isCommonAccount){
            vm.workList = [];
            for(var x in data){
              if(data[x].eDate == '无'){
                vm.workList.push(data[x]);
              }
            }
          }else {
            vm.workList = data;
          }
        });
      });
    }

    function pullToRefreshWaitForWorkDetails() {
      WaitForWorkService.getWaitForWorkInfo($rootScope.userId, function (data) {
        if(vm.isCommonAccount){
          vm.workList = [];
          for(var x in data){
            if(data[x].eDate == '无'){
              vm.workList.push(data[x]);
            }
          }
        }else {
          vm.workList = data;
        }
        $scope.$broadcast('scroll.refreshComplete');
      });
    }


    function toJobDetails(item) {
      if (item.sDate == '无') {
        $state.go('problemFeedbackDetails', {problemItem: item, fromWhere: 'waitForWork'});
      } else {
        $state.go('planDetails', {planDetailsData: item, fromWhere: 'waitForWork'});
      }
    }
  }
})();
