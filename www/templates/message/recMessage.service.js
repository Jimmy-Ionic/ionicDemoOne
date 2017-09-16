(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .service('MessageService', MessageService);

  MessageService.$inject = ['MyHttpService', 'SYS_INFO', '$http'];

  /** @ngInject */
  function MessageService(MyHttpService, SYS_INFO, $http) {
    var service = {
      getMessagesByUserId: getMessagesByUserId,
      doRefresh: doRefresh
    };

    return service;


    function getMessagesByUserId(userId, fun) {
      var url = '/hwweb/AppMessage/findMsgByUserId.action?userId=' + 123;
      MyHttpService.getCommonData(url, fun);
    }


    //刷新
    function doRefresh(userId, fun,hideRefreshFun) {
      var url = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/AppMessage/findMsgByUserId.action?userId=' + 123;
      $http.get(url)
        .success(function (response) {
          fun(response);
        })
        .finally(function () {
          hideRefreshFun();
        });
    }

  }
})();
