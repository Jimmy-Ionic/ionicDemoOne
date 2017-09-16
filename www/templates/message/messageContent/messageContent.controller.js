(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .controller('MessageContentController', MessageContentController);

  MessageContentController.$inject = ['$scope', 'MessageContentService', '$stateParams'];

  /** @ngInject */
  function MessageContentController($scope, MessageContentService, $stateParams) {

    var vm = this;
    vm.title = '消息详情';
    vm.msgView = {};
    vm.msg = {};
    vm.msgId = '';

    activate();


    function activate() {
      if ($stateParams.msgId) {
        vm.msgId = $stateParams.msgId;
      }
      getMessagesContent();
    }

    function getMessagesContent() {
      MessageContentService.getMessagesByMsgId(vm.msgId, function (resData) {
        if (resData[0]) {
          vm.msgView = resData[0].msgView[0];
          vm.msg = resData[0].msg[0];
        }
      });
    }
  }
})();
