(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .service('AddAssessmentService', AddAssessmentService);

  AddAssessmentService.$inject = ['$cordovaCamera', 'MyHttpService'];

  /** @ngInject */
  function AddAssessmentService($cordovaCamera, MyHttpService) {

    var service = {
      addNewAssessment: addNewAssessment,
      getPhonePictureData: getPhonePictureData,
      getPhonePicturePath: getPhonePicturePath,
      queryAccount: queryAccount,
      queryAccountList: queryAccountList,
      getPositionArray: getPositionArray
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

    function queryAccount(queryArray, fun) {
      var path = '';
      MyHttpService.getCommonData(path, fun);
    }

    function queryAccountList(fun) {
      var path = '';
      MyHttpService.getCommonData(path, fun);
    }

    function getPositionArray(string) {
      var roadPositionArray = [];
      console.log(string);
      var temArray = string.split(',');
      for (var i = 0; i < temArray.length - 1; i = i + 2) {
        var array = new Array();
        array[0] = temArray[i];
        array[1] = temArray[i + 1];
        roadPositionArray.push(array);
      }
      return roadPositionArray;
    }
  }
})();
