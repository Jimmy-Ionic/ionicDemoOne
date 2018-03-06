(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .config(messageConfig);

  messageConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function messageConfig($stateProvider) {
    $stateProvider
      .state('recMessage', {
        url: '/recMessage',
        templateUrl: 'templates/message/recMessage.html'
      });
  }
}());
