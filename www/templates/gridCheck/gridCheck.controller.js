(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .controller('GridCheckController', GridCheckController);

  GridCheckController.$inject = ['$rootScope', '$cacheFactory', '$scope', '$state', 'GridCheckService',
    'CommonMapService', '$ionicPopup'];

  /** @ngInject */
  function GridCheckController($rootScope, $cacheFactory, $scope, $state, GridCheckService, CommonMapService,
                               $ionicPopup) {

    var vm = this;
    vm.title = '网格化巡检';
    vm.questionCode = [];
    vm.questionCodeObj = {};
    vm.imgName = '';//图片的名字
    //需要上传的数据
    vm.uploadData = {
      examiner: '',//上传的用户：用户名
      areaName: '',//区市
      streetName: '',//道路名称
      problemCode: '',//扣分项的Id
      problemName: '',//扣分项名称
      description: '',//整改情况
      location: '',//详细地址
      point: [],//坐标
      img: '',//图片的Base64编码字符串数据
    }

    vm.fun = {
      toGridCheckMap: toGridCheckMap,
      takeGridCheckPicture: takeGridCheckPicture,
      getGridCheckLocation: getGridCheckLocation,
      uploadGridCheckData: uploadGridCheckData
    }


    activate();

    function activate() {

      GridCheckService.getGridCheckQuestionCodeArray(function (resData) {
        vm.questionCode = resData;
        vm.questionCodeObj = vm.questionCode[0];
        console.log(vm.questionCode);
      });


    }

    function toGridCheckMap() {
      $state.go('gridCheckMap');
    }

    //拍照
    function takeGridCheckPicture() {

      var options = {
        quality: 100,
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
        vm.imgName = moment().format('YYYY-MM-DD HH:mm:ss') + '.jpeg';
        vm.uploadData.img = imageData;
      }, function (err) {
        $ionicPopup.alert({
          title: '照片获取失败，请重新拍照!'
        });
      })
    }


    //获取街道和区域
    function getGridCheckLocation() {
      CommonMapService.getAddressByGPS(function (res) {
        vm.uploadData.areaName = res.district;
        vm.uploadData.streetName = res.street;
        // $scope.$apply();
      });
    }


    //上传数据
    function uploadGridCheckData() {
      vm.uploadData.examiner = $rootScope.userName;
      if ($cacheFactory.get("cacheGridCheckMapData")) {
        vm.uploadData.point = $cacheFactory.get("cacheGridCheckMapData").get('position');
        vm.uploadData.address = $cacheFactory.get("cacheGridCheckMapData").get('address');
      }
      vm.uploadData.questionCode = vm.questionCodeObj.id;
      vm.uploadData.problemName = vm.questionCodeObj.name;
      console.log('网格化巡检需要上传的数据：');
      console.log(vm.uploadData);
      if (vm.uploadData.areaName == '') {
        $ionicPopup.alert({
          title: '市区不能为空！'
        }).then();
      } else if (vm.uploadData.streetName == '') {
        $ionicPopup.alert({
          title: '街道不能为空！'
        }).then();
      } else if (vm.uploadData.problemCode == '' || vm.uploadData.problemCode == null) {
        $ionicPopup.alert({
          title: '问题代码不能为空！'
        });
      } else if (vm.uploadData.problemName == '' || vm.uploadData.problemName == null) {
        $ionicPopup.alert({
          title: '问题代码不能为空！'
        });
      } else if (vm.uploadData.point == '' || vm.uploadData.address == '') {
        $ionicPopup.alert({
          title: '详细检查地点不能为空'
        }).then();
      } else {
        var jsonStr = JSON.stringify(vm.uploadData);
        GridCheckService.uploadGridCheckData(jsonStr, function (resData) {

        });
      }

    }
  }
})();
