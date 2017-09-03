(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .service('MessageService', MessageService);

  MessageService.$inject = ['$http', 'SYS_INFO'];

  /** @ngInject */
  function MessageService($http, SYS_INFO) {
    var service = {
      getMessage:getMessages
    };

    return service;


    function getMessages() {
      var url = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT;
      $http.get(url, function (response) {
         if(response.data.success == 1){
           var messages = response.date.data;
           return messages;
         }else{
           return;
         }
      }, function (response) {
         return;
      });

    }

  }
})();
