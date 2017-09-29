(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .controller('AccountDetailsController', AccountDetailsController);

  AccountDetailsController.$inject = ['$scope', 'AccountDetailsService', '$stateParams'];

  /** @ngInject */
  function AccountDetailsController($scope, AccountDetailsService, $stateParams) {

    var vm = this;
    vm.title = '';
    vm.data = {};
    vm.installationName = '';
    vm.code = ''
    vm.accountDetailsData = {};

    activate();

    function activate() {
      if ($stateParams.accountData != null) {
        vm.accountDetailsData = $stateParams.accountData;
      }
      if ($stateParams.code != null) {
        vm.code = $stateParams.code;
        switch(vm.code){
          case 'cheliang':
            vm.title = vm.accountDetailsData.plateNo;
            break;
          case 'congxizuoye':
            vm.title = vm.accountDetailsData.plateId;
            break;
          case 'daolu':
            vm.title = vm.accountDetailsData.roadName;
            break;
          case 'gongche':
            vm.title = vm.accountDetailsData.toiletName;
            break;
          case 'guojietianqiao':
            vm.title = vm.accountDetailsData.bridgeName;
            break;
          case 'jishaozuoye':
            vm.title = vm.accountDetailsData.plateId;
            break;
          case 'jixiezuoye':
            vm.title = vm.accountDetailsData.operateVehicle;
            break;
          case 'lajitong':
            vm.title = vm.accountDetailsData.trashArea;
            break;
          case 'shashuizuoye':
            vm.title = vm.accountDetailsData.plateId;
            break;
          case 'shoujizhan':
            vm.title = vm.accountDetailsData.RCPsname;
            break;
          case 'shouyunzuoye':
            vm.title = vm.accountDetailsData.operatePlate;
            break;
          default:
            vm.title = '台账详情';
            break;
        }
      }
    }
  }
})();
