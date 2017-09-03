(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .controller('MessageContentController', MessageContentController);

  MessageContentController.$inject = ['$scope'];

  /** @ngInject */
  function MessageContentController($scope) {
    var vm = this;

    vm.title = '消息详情';

    activate();



    function activate() {
    }
  }
})();
