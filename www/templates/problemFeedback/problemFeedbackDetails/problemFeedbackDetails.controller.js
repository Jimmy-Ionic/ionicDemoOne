(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .controller('ProblemFeedbackDetailsController', ProblemFeedbackDetailsController);

  ProblemFeedbackDetailsController.$inject = ['$scope','$stateParams'];
  /** @ngInject */
  function ProblemFeedbackDetailsController($scope,$stateParams) {
    var vm = this;
    vm.title = '问题详情'
    vm.problemDetails = $stateParams.problemItem;

    activate();

    function activate() {
    }
  }
})();
