(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .service('GridCheckService', GridCheckService);

  GridCheckService.$inject = ['MyHttpService'];

  /** @ngInject */
  function GridCheckService(MyHttpService) {

    var service = {
      getGridCheckQuestionCodeArray: getGridCheckQuestionCodeArray,
      uploadGridCheckData: uploadGridCheckData
    }

    return service;


    function getGridCheckQuestionCodeArray(fun) {
      var url = '/hwweb/AssignmentAssessment/findDItem.action?typeId=""';
      MyHttpService.getCommonData(url, fun);
    }


    //上传网格化巡检的数据
    function uploadGridCheckData(jsonStr, fun) {
      var url = '/hwweb/GridInspection/saveRegionPro.action';
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }
  }
})();
