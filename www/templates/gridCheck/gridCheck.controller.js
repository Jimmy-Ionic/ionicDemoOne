(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .controller('GridCheckController', GridCheckController);

  GridCheckController.$inject = ['$scope', '$state', '$stateParams', 'GridCheckService', 'CommonMapService', '$ionicPopup', '$ionicLoading', '$cordovaFileTransfer'];

  /** @ngInject */
  function GridCheckController($scope, $state, $stateParams, GridCheckService, CommonMapService, $ionicPopup, $ionicLoading, $cordovaFileTransfer) {

    var vm = this;
    vm.title = '网格化巡检';
    vm.questionCode = [];
    vm.uploadData = {
      district: '',
      street: '',
      selectedQuesCode: '',
      question: '',
      picData: '',
      picName: '',
      pickPosition: []
    }

    vm.fun = {
      toGridCheckMap: toGridCheckMap,
      takeGridCheckPicture: takeGridCheckPicture,
      getGridCheckLocation: getGridCheckLocation,
      uploadGridCheckData: uploadGridCheckData
    }


    activate();

    function activate() {

      if ($stateParams.mapData) {
        vm.uploadData.pickPosition = $stateParams.mapData;
      }

      GridCheckService.getGridCheckQuestionCodeArray(function (resData) {
        vm.questionCode = resData;
      });

    }

    function toGridCheckMap() {
      $state.go('gridCheckMap');
    }

    //拍照
    function takeGridCheckPicture() {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 200,
        targetHeight: 200,
        popoverOptions: Camera.PopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {

        var image = document.getElementById('gridCheckImg');
        image.src = "data:image/jpeg;base64," + imageData;
        vm.uploadData.picName = moment().format('YYYY-MM-DD HH:mm:ss') + '.jpeg';
        vm.uploadData.picData = imageData;
      }, function (err) {
        $ionicPopup.alert({
          title: '照片获取失败，请重新拍照'
        });
      })
    }

    function getGridCheckLocation() {
      CommonMapService.getAddressByGPS(function (res) {
        vm.uploadData.district = res.district;
        vm.uploadData.street = res.street;
        $scope.$apply();
      });
    }

    //上传数据
    function uploadGridCheckData() {

      GridCheckService.uploadGridCheckData(function (resData) {

      });
    }
  }
})();
