(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .controller('AccountDetailsController', AccountDetailsController);

  AccountDetailsController.$inject = ['$scope', 'AccountDetailsService', '$stateParams'];

  /** @ngInject */
  function AccountDetailsController($scope, AccountDetailsService, $stateParams) {

    var vm = this;
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
      }
    }
  }
})();
