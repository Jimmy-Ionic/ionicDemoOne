(function () {
  'use strict';

  angular
    .module('app.history')
    .controller('HistoryController', HistoryController);

  HistoryController.$inject = ['$scope', 'HistoryService'];

  /** @ngInject */
  function HistoryController($scope, HistoryService) {
    var vm = this;
    vm.title = '历史考核记录';
    vm.fun = {
      toPlanDetails:toPlanDetails
    }

    vm.toPlanDetails = toPlanDetails;

    vm.historyList = [
      {
        id: '1',
        workName: '6月份考核计划',
        year: '2017年',
        month: '六月'
      },
      {
        id: '2',
        workName: '7月份考核计划',
        year: '2017年',
        month: '七月'
      },
      {
        id: '3',
        workName: '8月份考核计划',
        year: '2017年',
        month: '八月'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        year: '2017年',
        month: '九月'
      }
    ];


    activate();


    function activate() {
      // vm.historyList = HistoryService.getHistoryData($rootScope.userId);
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {assessmentData: item, fromWhere: 'history'});
    }


  }
})();
