(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .service('AssessmentStatusDetailsService', AssessmentStatusDetailsService);

  AssessmentStatusDetailsService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera'];

  /** @ngInject */
  function AssessmentStatusDetailsService($http, SYS_INFO, $cordovaCamera) {
    var service = {
      getAssessmentStatusDetailsList: getAssessmentStatusDetailsList,
      getPhonePictureData: getPhonePictureData,
      getPhonePicturePath: getPhonePicturePath,
      getAccounts:getAccounts
    }


    return service;


    function getAssessmentStatusDetailsList(data, fun) {
      var path = '/hwweb/AssignmentAssessment/findFacilities.action?' + 'typeId=' + data.typeId + '&infraId=' + data.infraId;
      MyHttpService.getCommonData(path,fun);
    }

    function getPhonePictureData() {
    }

    function getPhonePicturePath() {

      document.addEventListener("deviceready", function () {

        var options = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
          var image = document.getElementById('myImage');
          image.src = imageURI;
        }, function (err) {
          // error
        });

        $cordovaCamera.cleanup().then();
      }, false);
    }

    function getAccounts(fun){
      var url = '';
      MyHttpService.getCommonData(url,fun);
    }
  }
})();
