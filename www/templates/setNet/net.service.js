(function () {
  'use strict';

  angular
    .module('app.setNet')
    .service('SetNetService', SetNetService)

  SetNetService.$inject = ['$localStorage','SYS_INFO'];

  function SetNetService($localStorage,SYS_INFO) {

    var service = {
      saveNetSettings: saveNetSettings
    }


    function saveNetSettings(address, port ,back) {
      var serverInfo = {
        SERVER_PATH:address,
        SERVER_PORT:port
      }
      $localStorage.serverInfo= serverInfo;
      SYS_INFO.SERVER_PATH = serverInfo.SERVER_PATH;
      SYS_INFO.SERVER_PORT = serverInfo.SERVER_PORT;
      back();
    }
    return service;
  }
})();
