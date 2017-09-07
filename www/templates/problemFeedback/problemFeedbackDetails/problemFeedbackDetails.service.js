(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .service('ProblemFeedbackDetailsService', ProblemFeedbackDetailsService);

  ProblemFeedbackDetailsService.$inject = ['$http', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function ProblemFeedbackDetailsService($http, $ionicLoading, $ionicPopup) {

    var service = {
      getProblemFeedbackDetailsMap: getProblemFeedbackDetailsMap,
      uploadProblemFeedbackData: uploadProblemFeedbackData
    };

    return service;


    function getProblemFeedbackDetailsMap(positionObj) {

      var map = new AMap.Map('problemFeedbackDetailsMap', {
        resizeEnable: true,
        zoom: 18,
        center: positionObj.position
      });

      var marker = new AMap.Marker({
        position: positionObj.position,
        title: positionObj.address,
        map: map
      });

      map.plugin(['AMap.ToolBar'], function () {
        var toolBar = new AMap.ToolBar();
        map.addControl(toolBar);
      });
    }

    function uploadProblemFeedbackData(problemFeedbackData, fromWhere) {

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        });

      switch (fromWhere) {
        case 'problemFeedbackDetails':
          break;
        case 'waitForWork':
          break;
        default:
          break;
      }

    }


  }
})();
