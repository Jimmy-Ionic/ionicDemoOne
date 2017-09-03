(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .service('MessageContentService', MessageContentService);

  MessageContentService.$inject = ['$http'];

  /** @ngInject */
  function MessageContentService($http) {
    var service = {

    };

    return service;

    function getMessage(url){

    }

  }
})();
