(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .controller('AccountDetailsController',AccountDetailsController);

  AccountDetailsController.$inject = ['$scope'];
  /** @ngInject */
  function AccountDetailsController($scope) {
    var vm = this;
    vm.installationName = '';

    activate();

    ////////////////

    function activate() {
    }
  }
})();
