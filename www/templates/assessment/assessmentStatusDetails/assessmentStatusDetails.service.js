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
      getPhonePicturePath: getPhonePicturePath
    }


    return service;


    function getAssessmentStatusDetailsList(questionId) {
      var path = '' + questionId;
      return MyHttpService.getCommonData(path);
    }

    function getPhonePictureData() {

      document.addEventListener("deviceready", function () {

        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
          var image = document.getElementById('myImage');
          image.src = "data:image/jpeg;base64," + imageData;
        }, function (err) {
          // error
        });

      }, false);
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
  }
})();
