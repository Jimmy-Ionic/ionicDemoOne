(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .service('AssessmentStatusDetailsService', AssessmentStatusDetailsService);

  AssessmentStatusDetailsService.$inject = ['MyHttpService'];

  /** @ngInject */
  function AssessmentStatusDetailsService(MyHttpService) {
    var service = {
      getAssessmentStatusDetailsListIsEdit: getAssessmentStatusDetailsListIsEdit,
      getAssessmentStatusDetailsListNotEdit: getAssessmentStatusDetailsListNotEdit,
      getAccounts: getAccounts,
      uploadAssessmentStatusDetailsData: uploadAssessmentStatusDetailsData
    }


    return service;


    //录入的时候请求数据的方法
    function getAssessmentStatusDetailsListIsEdit(data, fun) {
      var path = '/hwweb/AssignmentAssessment/findFacilities.action?' + 'typeId=' + data.typeId + '&infraId=' + data.infraId;
      MyHttpService.getCommonData(path, fun);
    }

    //查看问题的时候请求数据的方法
    function getAssessmentStatusDetailsListNotEdit(data, fun) {
      var path = '/hwweb/AssignmentAssessment/findFacilitiesViews.action?' + 'typeId=' + data.typeId + '&infraId=' + data.infraId+'&resultsId=' +data.id;
      MyHttpService.getCommonData(path, fun);
    }

    //扣分原因查询
    function getAccounts(data, fun) {
      if(data){
        var url = '/hwweb/AssignmentAssessment/findDItem.action?' + 'typeId=' + data.typeId;
      }else{
        var url = '/hwweb/AssignmentAssessment/findDItem.action'
      }
      MyHttpService.getCommonData(url, fun);
    }

    //上传数据
    function uploadAssessmentStatusDetailsData(jsonObj, fun) {
      var url = '/hwweb/AssignmentAssessment/reportPro.action';
      var jsonStr = JSON.stringify(jsonObj);
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }
  }
})();
