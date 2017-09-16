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
      queryAccountList: queryAccountList,
      uploadAccountData:uploadAccountData,
      uploadPointAndPicData:uploadPointAndPicData
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


    //模糊查询对应的台帐信息
    function queryAccountList(queryCriteria, fun) {
      var path = '/hwweb/Comprehensive/searchFacilities.action?' + 'name=' + queryCriteria.address + '&typeId=' + queryCriteria.type;
      MyHttpService.getCommonData(path, fun);
    }

    function uploadAccountData(jsonStr, fun) {
      var url = '/hwweb/AssignmentAssessment/comprehensive.action'
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }

    function uploadPointAndPicData(jsonStr, fun) {
      var url = '/hwweb/AssignmentAssessment/reportPro.action'
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }
  }
})();
