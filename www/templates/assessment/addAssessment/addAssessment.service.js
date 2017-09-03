(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .service('AddAssessmentService', AddAssessmentService);

  AddAssessmentService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera'];

  /** @ngInject */
  function AddAssessmentService($http, SYS_INFO, $cordovaCamera) {
    var service = {
      addNewAssessment: addNewAssessment,
      getPhonePictureData: getPhonePictureData,
      getPhonePicturePath: getPhonePicturePath
    }


    return service;


    function addNewAssessment(userId, planDetailId, success, error) {

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
