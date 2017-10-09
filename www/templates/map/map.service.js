(function () {
  'use strict';

  angular
    .module('app.map')
    .service('MapService', MapService);

  MapService.$inject = ['MyHttpService'];

  /** @ngInject */
  function MapService(MyHttpService) {
    var service = {
      getMapInfoList: getMapInfoList
    }

    return service;


    //获取街道，车辆等相关的台帐信息
    function getMapInfoList(queryCriteria, fun) {
      var url = '/hwweb/Ledger/findMap.action?code=' + queryCriteria.type + '&name=' + queryCriteria.keyword;
      MyHttpService.getCommonData(url, fun);
    }
  }
})();
