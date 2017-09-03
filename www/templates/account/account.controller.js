(function () {
  'use strict';

  angular
    .module('app.account')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$scope'];
  /** @ngInject */
  function AccountController($scope) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
    }
  }
})();
