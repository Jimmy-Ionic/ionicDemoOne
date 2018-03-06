(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .service('AddAssessmentService', AddAssessmentService);

  AddAssessmentService.$inject = ['$cordovaCamera', 'MyHttpService', '$ionicLoading', 'SYS_INFO', '$http', '$ionicPopup'];

  /** @ngInject */
  function AddAssessmentService($cordovaCamera, MyHttpService, $ionicLoading, SYS_INFO, $http, $ionicPopup) {

    var service = {
      addNewAssessment: addNewAssessment,
      getPhonePictureData: getPhonePictureData,
      getPhonePicturePath: getPhonePicturePath,
      queryAccountList: queryAccountList,
      uploadAccountData: uploadAccountData,
      uploadPointAndPicData: uploadPointAndPicData
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

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        }
      );

      var url = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/AssignmentAssessment/comprehensive.action';
      console.log(url);
      console.log(jsonStr);
      $http({
        method: 'post',
        url: url,
        data: {data: jsonStr},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
      }).then(function (res) {
        if (res.data.success = 1) {
          var resData = res.data.data;
          $ionicLoading.hide();
          fun(resData);
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '数据上传失败'
          });
        }
      }, function (error) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '数据上传失败'
        });
      });
    }


    function uploadPointAndPicData(jsonStr, fun) {
      var url = '/hwweb/AssignmentAssessment/reportPro.action'
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }
  }
})();
