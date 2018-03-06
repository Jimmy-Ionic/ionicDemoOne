(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .service('ProblemFeedbackDetailsService', ProblemFeedbackDetailsService);

  ProblemFeedbackDetailsService.$inject = ['MyHttpService', 'AddAssessmentMapService'];

  /** @ngInject */
  function ProblemFeedbackDetailsService(MyHttpService, AddAssessmentMapService) {

    var service = {
      getProblemFeedbackDetailsMap: getProblemFeedbackDetailsMap,
      uploadProblemFeedbackData: uploadProblemFeedbackData,
      getProblemDetailsData: getProblemDetailsData
    };

    return service;


    function getProblemFeedbackDetailsMap(positionObj) {

      console.log('问题饭详情页面的相关数据')
      console.log(positionObj);
      var point = AddAssessmentMapService.getPositionArray(positionObj.point);
      if (point.length <= 0) {
        point = null;
      } else {
        point = point[0];
      }
      console.log('问题饭详情页面设施坐标')
      console.log(point);

      var map = new AMap.Map('problemFeedbackDetailsMap', {
        resizeEnable: true,
        zoom: 15,
        center: point
      });

      var marker = new AMap.Marker({
        position: point,
        map: map
      });

      map.plugin(['AMap.ToolBar'], function () {
        var toolBar = new AMap.ToolBar();
        map.addControl(toolBar);
      });

    }

    //这是代办任务跳转到这个页面获取数据的方法
    function getProblemDetailsData(data, fun) {
      var url = '/hwweb/GridInspection/CheckProblemById.action?planId=' + data.id;
      MyHttpService.getCommonData(url, fun);
    }

    function uploadProblemFeedbackData(jsonObj, fun) {
      var url = '/hwweb/GridInspection/UploadProblem.action';
      var jsonStr = JSON.stringify(jsonObj);
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }

  }
})();
