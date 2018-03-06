(function () {
  'use strict';

  angular
    .module('app.Model')
    .controller('ModelController', ModelController);

  ModelController.$inject = ['$scope', 'ModelService'];
  /** @ngInject */
  function ModelController($scope, ModelService) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
    }
  }
})();
