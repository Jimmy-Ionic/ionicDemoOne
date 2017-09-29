(function () {
  'use strict';

  angular
    .module('app.account')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$scope', 'AccountService', '$state'];

  /** @ngInject */
  function AccountController($scope, AccountService, $state) {

    var vm = this;
    vm.title = '环卫台帐';
    vm.optionAll = '{"code":"", "id": "", "name": "全部类型", "subclass": []}';
    vm.queryCriteriaObj = {};
    vm.accountType;
    vm.levelList = [];
    vm.queryCriteria = {
      cityPlace: '',
      accountType: '',
      level: '',
      keyword: ''
    };
    vm.accountList = [];
    vm.fun = {
      updateLevelArrayByType: updateLevelArrayByType,
      getAccountListByQueryCriteria: getAccountListByQueryCriteria,
      toAccountDetails: toAccountDetails
    };


    activate();

    function activate() {
      getQueryCriteriaObj();
    }


    //获取全部区，全部类型，全部子类
    function getQueryCriteriaObj() {
      AccountService.getQueryCriteriaList(function (resData) {
        vm.queryCriteriaObj = resData[0];
      })
    }

    //根据查询条件来查询台帐
    function getAccountListByQueryCriteria() {
      if (vm.accountType && vm.accountType != '') {
        if (vm.accountType == "") {
          vm.queryCriteria.accountType = "";
        } else {
          vm.queryCriteria.accountType = JSON.parse(vm.accountType).code;
        }
      }

      if(vm.queryCriteria.level == ''&&vm.queryCriteria.cityPlace == ''
        &&vm.queryCriteria.accountType == ''&&vm.queryCriteria.keyword==''){
        $ionicPopup.confirm({
          title: '提示',
          template: '查询全部台帐可能会导致等待时间很长，要继续么？',
          buttons: [{
            text: '取消',
            type: 'button-positive'
          }, {
            text: '确认',
            type: 'button-calm'
          }]
        }).then(function (res) {
          if (res) {
            AccountService.getAccountListByQueryCriteria(vm.queryCriteria, function (resData) {
              vm.accountList = resData[0];
            });
          } else {
            return;
          }
        });
      }else{
        AccountService.getAccountListByQueryCriteria(vm.queryCriteria, function (resData) {
          vm.accountList = resData[0];
        });
      }
    }


    function updateLevelArrayByType(item) {
      if (item) {
        vm.levelList = JSON.parse(item).subclass;
      }
    }

    function toAccountDetails(item, code) {
      $state.go('accountDetails', {accountData: item, code: code});
    }
  }
})();
