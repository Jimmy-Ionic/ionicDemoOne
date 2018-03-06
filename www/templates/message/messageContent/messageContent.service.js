(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .service('MessageContentService', MessageContentService);

  MessageContentService.$inject = ['MyHttpService'];

  /** @ngInject */
  function MessageContentService(MyHttpService) {
    var service = {
      getMessagesByMsgId: getMessagesByMsgId
    };

    return service;

    function getMessagesByMsgId(msgId, fun) {
      var url = '/hwweb/AppMessage/msgView.action?msgId=' + 12;
      MyHttpService.getCommonData(url, fun);
    }

  }
})();
