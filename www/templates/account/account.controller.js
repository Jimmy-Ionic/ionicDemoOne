(function () {
  'use strict';

  angular
    .module('app.account')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$scope', 'AccountService','$state'];

  /** @ngInject */
  function AccountController($scope, AccountService,$state) {

    var vm = this;
    vm.title = '环卫台帐';
    vm.cityPlace = ['全部区', '市南', '市北', '李沧', '崂山', '黄岛', '城阳'];
    vm.accountType = ['全部类型', '道路', '车辆', '公厕', '转运站', '过街天桥', '垃圾桶', '作业台帐', '收运台帐'];
    vm.level = ['全部子类'];
    vm.queryCriteria = {
      cityPlace: '',
      accountType: '',
      level: '',
      keyWord: ''
    };
    vm.accountList = [];
    vm.fun = {
      updateLevelArrayByType: updateLevelArrayByType,
      getAccountListByQueryCriteria:getAccountListByQueryCriteria,
      toAccountDetails:toAccountDetails
    };


    activate();

    function activate() {
      getAccountList();
      for(var i = 0;i<20;i++){
        var data = {};
        data.cityPlace = '市南区',
        data.accountType = '山东路公厕';
        data.level = '特级';
        vm.accountList.push(data);
      }
    }


    //城市区域，类型，还有等级需要从服务器获取，因为城市的区域会动态的添加。
    function getAccountList() {
      AccountService.getAccountList(function (resData) {

      })
    }

    //根据查询条件来查询台帐
    function getAccountListByQueryCriteria() {
      AccountService.getAccountListByQueryCriteria(function (resData) {
          // vm.accountList = resData;
      });
    }


    function updateLevelArrayByType(item) {
      switch (item) {
        case '全部类型':
          vm.level = ['全部类型'];
          break;
        case '道路':
          vm.level = [];
          break;
        case '车辆':
          vm.level = [];
          break;
        case '公厕':
          vm.level = [];
          break;
        case '转运站':
          vm.level = [];
          break;
        case '过街天桥':
          vm.level = [];
          break;
        case '垃圾桶':
          vm.level = [];
          break;
        case '作业台帐':
          vm.level = [];
          break;
        case '收运台帐':
          vm.level = [];
          break;
        default:
          break;
      }
    }

    function toAccountDetails(item) {
      $state.go('accountDetails',{accountData:item});
    }
  }
})();
