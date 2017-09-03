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
    vm.picPath = 'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg';
    vm.picData = '';
    vm.picName = '';
    vm.pickPositon = $stateParams.position;

    vm.selectedQuesCode = '';
    vm.questionCode = [];
    vm.question = '';
    vm.locationObj = {
      district: '',
      street: ''
    };

    vm.fun = {
      toGridCheckMap: toGridCheckMap,
      takeGridCheckPicture: takeGridCheckPicture,
      getGridCheckLocation: getGridCheckLocation,
      uploadGridCheckData: uploadGridCheckData
    }


    activate();

    function activate() {
      var data = GridCheckService.getGridCheckQuestionCodeArray();
      if (data) {
        vm.questionCode = data;
      } else {
        vm.questionCode = ['道路不干净', '垃圾桶占路'];
      }
    }

    function toGridCheckMap() {
      $state.go('commonMap', {data: {}, from: 'gridCheck'});
    }

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
        $ionicPopup.alert({
          title: 'sdda',
          template: 'deviceready获取图片' + imageData + ' ' + new moment().unix()
        });

        var image = document.getElementById('img');
        image.src = "data:image/jpeg;base64," + imageData;
        vm.picName = moment().format('YYYY-MM-DD-HH:mm:ss') + '.jpg';
        vm.picData = imageData;
        console.log(vm.picName);
      }, function (err) {
        $ionicPopup.alert({
          title: '照片获取失败，请重新拍照',
        });
      })
    }

    function getGridCheckLocation() {
      CommonMapService.getAddressByGPS(function (res) {
        vm.locationObj.district = res.district;
        vm.locationObj.street = res.street;
        $scope.$apply();
      });
    }

    function uploadGridCheckData() {
      GridCheckService.uploadGridCheckData();
    }
  }
})();
