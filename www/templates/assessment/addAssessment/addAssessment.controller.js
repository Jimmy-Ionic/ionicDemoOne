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
      level: '',
      road: '',
      length: '',
      points: '',
      width: '',
      reason: '',
      remark: '',
      img: []
    };

    //查询条件
    vm.queryCriteria = {
      type: '',
      address: ''
    };

    vm.addAssessmentDetails = {};

    //台帐数据
    vm.accountList = [
      {name: '公厕', type: '01'},
      {name: '转运站', type: '02'},
      {name: '道路', type: '05'},
      {name: '车辆', type: '06'}
    ];

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
      deletePic: deletePic,
      queryAccountList:queryAccountList
    };


    activate();


    function activate() {

    }

    function toAddAssessmentMap() {
      $state.go('addAssessmentMap', {mapPositionObj: vm.mapPositionObj});
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
      AddAssessmentService.queryAccount(vm.queryCriteria, function (resData) {
        vm.assessmentStatusDetails = resData[0];
        vm.accountAddressData = resData.accountAddressData;
        vm.mapPositionArray = resData.mapPositionArray;
        vm.spinnerShow = true;
      })
    }

    //根据设施地址模糊查询，获取相关的数据
    function queryAccountList() {
      AddAssessmentService.queryAccountList(vm.queryCriteria, function (resData) {
        vm.addAssessmentDetails = resData[0];
        vm.spinnerShow = true;
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
