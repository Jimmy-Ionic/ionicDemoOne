(function () {
  'use strict';

  angular
    .module('app.history')
    .controller('HistoryController', HistoryController);

  HistoryController.$inject = ['$scope', '$state', 'HistoryService'];

  /** @ngInject */
  function HistoryController($scope, $state, HistoryService) {
    var vm = this;
    vm.title = '历史考核记录';
    vm.fun = {
      toPlanDetails: toPlanDetails,
      getHistoryDataByCondition: getHistoryDataByCondition
    }

    vm.toPlanDetails = toPlanDetails;

    vm.historyList = [];
    vm.yeahArray = [];
    vm.monthArray = [];
    vm.thisYeah = moment().format('YYYY');
    vm.thisMonth = moment().format('M');
    vm.queryCriteria = {
      keyword: '',
      selectedYeah: '',
      selectedMonth: ''
    }

    activate();


    function activate() {

      for (var i = 0; i < 15; i++) {
        vm.historyList[i] = {
          id: '1',
          workName: '6月份考核计划',
          year: '2017年',
          month: '六月'
        }
      }

      for (var i = 0; i < 12; i++) {
        vm.monthArray[i] = i + 1;
      }

      console.log(vm.monthArray);

      for (var i = 0; i < 5; i++) {
        vm.yeahArray[i] = vm.thisYeah - i;
      }
      HistoryService.getHistoryData($rootScope.userId, function (resData) {

      });
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {assessmentData: item, fromWhere: 'history'});
    }

    //根据查询条件来查询历史考核记录
    function getHistoryDataByCondition() {
      HistoryService.getHistoryDataByCondition(vm.queryCriteria, function (resData) {

      });
    }


  }
})();
