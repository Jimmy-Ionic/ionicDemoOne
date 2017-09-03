(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$scope','MessageService'];
  /** @ngInject */
  function MessageController($scope,MessageService) {

    var vm = this;
    vm.title = '已收到消息';
    vm.refreshMessageList = refreshMessageList;
    vm.openMsgContent = openMsgContent;

    vm.messages = [
      {title:'测试消息1',status:0,date:'2017/8/10',content:'有要事相讨~','attachmentAddress':'http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg'},
      {title:'测试消息1',status:1,date:'2017/8/10',content:'有要事相讨~','attachmentAddress':'http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg'},
      {title:'测试消息1',status:0,date:'2017/8/10',content:'有要事相讨~','attachmentAddress':'http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg'},
      {title:'测试消息1',status:1,date:'2017/8/10',content:'有要事相讨~','attachmentAddress':'http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg'}
    ];

    activate();

    function activate() {
      // vm.messages = MessageService.getMessage();
    }


    function refreshMessageList() {

    }

    function openMsgContent(msg) {

    }

  }
})();
