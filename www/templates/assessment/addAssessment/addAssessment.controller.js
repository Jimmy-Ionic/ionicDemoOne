(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .controller('AddAssessmentController', AddAssessmentController);

  AddAssessmentController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AddAssessmentService'];

  /** @ngInject */
  function AddAssessmentController($rootScope, $scope, $state, $stateParams, AddAssessmentService) {

    var vm = this;
    vm.data = {};
    vm.title = '录入计划';
    vm.spinnerShow = false;
    vm.picBase64DataArray = [];
    vm.uploadData = {
      type: '',
      address: '',
      level: '',
      road: '',
      length: '',
      points: '',
      width: '',
      reason: '',
      remark: '',
      img: []
    };
    vm.line = '120.352728,36.086514,120.352788,36.086477,' +
      '120.352849,36.08644,120.35291,36.086403,120.35297,36.086365,' +
      '120.353031,36.086328,120.353092,36.086291,120.353152,36.086254,120.353213,' +
      '36.086217,120.353283,36.086178,120.353354,36.086138,120.353425,36.086099,120.353425,' +
      '36.086099';

    vm.assessmentStatusDetailsList =
      {
        questionId: '1',
        address: '银川路',
        problem: '垃圾桶占路',
        cleaningLevel: '特级',
        roadLevel: '主干道',
        roadLength: '1600米',
        roadWidth: '30米',
        points: '-1.5',
        remarks: '备注',
        targetPosition: '129.134',
        picPath: [
          'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg',
          'http://www.chinagvs.com/ShopHome/Tpl/Public/images/left-logo.jpg',
          'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg'
        ]
      };

    //台帐数据
    vm.accountList =
      {
        type: ['道路', '公厕'],
        reason: ['道路不净', '垃圾桶占路']
      };

    //获取到的所有的匹配的台帐信息
    vm.accountAddressData = [{
      name: '百度1',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      name: '百度2',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      name: '百度3',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      address: '百度4',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }];

    //跳转到地图页面需要传递的道路坐标数组
    vm.mapPositionObj = {
      address: '市南软件园2号楼',
      position: [120.41317, 36.07705],
      roadPositionArray: []
    };

    vm.fun = {
      toAddAssessmentMap: toAddAssessmentMap,
      takePicture: takePicture,
      spinnerHide: spinnerHide,
      queryAccount: queryAccount,
      deletePic: deletePic
    };


    activate();


    function activate() {
      // queryAccountList();
      vm.mapPositionObj.roadPositionArray = AddAssessmentService.getPositionArray(vm.line);
      console.log(vm.mapPositionObj.roadPositionArray);
    }

    function toAddAssessmentMap() {
      $state.go('addAssessmentMap',{mapPositionObj:vm.mapPositionObj});
    }

    //启动摄像头拍照
    function takePicture() {
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
        // var image = document.getElementById('pic' + vm.picIsShow);
        // image.src = "data:image/jpeg;base64," + imageData;
        vm.picBase64DataArray.push("data:image/jpeg;base64," + imageData);
      }, function (err) {
        // error
      });
    }

    //根据模糊查询，查询到相关的设施匹配地址
    function queryAccount() {
      var queryObj = {
        type: vm.uploadData.type,
        address: vm.uploadData.address
      }
      AddAssessmentService.queryAccount(queryObj, function (resData) {
        vm.accountAddressData = resData.accountAddressData;
        vm.mapPositionArray = resData.mapPositionArray;
        vm.spinnerShow = true;
      })
    }

    //获取设施类型，扣分情况，扣分原因等使用<select>Dom的详细数据
    function queryAccountList() {
      AddAssessmentService.queryAccountList(function (resData) {
        vm.accountList = resData[0];
      })
    }

    function spinnerHide(item) {
      vm.spinnerShow = false;
      vm.uploadData.level = item.info.level;
      vm.uploadData.road = item.info.road;
      vm.uploadData.length = item.info.length;
      vm.uploadData.width = item.info.width;
    }

    function deletePic(index) {
      vm.picBase64DataArray.splice(index, 1);
    }

  }
})();
