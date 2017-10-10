(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .service('AssessmentStatusService', AssessmentStatusService);

  AssessmentStatusService.$inject = ['$http', 'SYS_INFO', 'MyHttpService', '$ionicLoading', '$ionicPopup', '$ionicHistory'];

  /** @ngInject */
  function AssessmentStatusService($http, SYS_INFO, MyHttpService, $ionicLoading, $ionicPopup, $ionicHistory) {
    var service = {
      getAssessmentStatusList: getAssessmentStatusList,
      checkOverAndUpload: checkOverAndUpload
    }

    return service;

    function getAssessmentStatusList(planDetails, fun) {
      var path = '/hwweb/AssignmentAssessment/findProView.action?' + 'planId=' + planDetails.planId +
        '&infrastructureId=' + planDetails.infraId + '&infoId=' + planDetails.id;
      MyHttpService.getCommonData(path, fun);
    }

    function checkOverAndUpload(planDetails) {
      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        }
      );
      var path = '/hwweb/AssignmentAssessment/complete.action?' + 'planId=' + planDetails.planId + '&infraId=' + planDetails.infraId;
      $http({
        method: 'GET',
        url: SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + path
      }).then(function (response) {
        if (response.data.success == 1) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '提示',
            template: '考核完成...'
          }).then(function (res) {
            $ionicHistory.goBack();
          })
        }
      }, function (err) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '失败提示',
          template: '上传失败，请重试！'
        }).then(function (res) {

        })
      });
    }
  }
})();
