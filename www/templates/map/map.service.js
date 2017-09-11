(function () {
  'use strict';

  angular
    .module('app.map')
    .service('MapService', MapService);

  MapService.$inject = ['$http','MyHttpService'];

  /** @ngInject */
  function MapService($http,MyHttpService) {
    var service = {
      getAccountList:getAccountList
    }

    return service;


    //获取街道，车辆等相关的台帐信息
    function getAccountList(fun) {
      var url = '';
      MyHttpService.getCommonData(url,fun);
    }
  }
})();
