(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .controller('AddAssessmentController', AddAssessmentController);

  AddAssessmentController.$inject = ['$rootScope', '$state', '$stateParams', 'AddAssessmentService', 'AssessmentStatusDetailsService'];

  /** @ngInject */
  function AddAssessmentController($rootScope, $state, $stateParams, AddAssessmentService, AssessmentStatusDetailsService) {

    var vm = this;
    vm.data = {};
    vm.title = '录入计划';
    vm.spinnerShow = false;
    vm.picBase64DataArray = [];
    vm.infraId = '';
    //需要上传的数据
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

    //从上一个页面传递回来的数据
    vm.addAssessmentData = {};

    //查询条件
    vm.queryCriteria = {
      type: '',
      address: ''
    };

    //扣分原因列表，需要从服务器获取
    vm.pointReasonArray = [];

    //台帐数据
    vm.accountList = [];

    //设施类型
    vm.facilityTypeList = [
      {name: '公厕', type: '01'},
      {name: '转运站', type: '02'},
      {name: '道路', type: '05'},
      {name: '车辆', type: '06'}
    ];

    //点击模糊匹配列表获取到的数据
    vm.accountObj = {
      level: '',
      road: '',
      length: '',
      width: '',
      wcCondition: '',
      carCondition: ''
    };

    //跳转到地图页面需要传递的道路坐标数组
    vm.mapPositionObj = {};

    vm.fun = {
      toAddAssessmentMap: toAddAssessmentMap,
      takePicture: takePicture,
      spinnerHide: spinnerHide,
      deletePic: deletePic,
      queryAccountList: queryAccountList,
      uploadDataFun: uploadDataFun
    };


    activate();


    function activate() {

      if ($stateParams.addAssessmentData) {
        vm.addAssessmentData = $stateParams.addAssessmentData;
      }
      getAccounts();
    }

    function toAddAssessmentMap() {
      $state.go('addAssessmentMap', {mapPositionObj: vm.mapPositionObj, from: 'addAssessment'});
    }

    //启动摄像头拍照
    function takePicture() {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        // var image = document.getElementById('pic' + vm.picIsShow);
        // image.src = "data:image/jpeg;base64," + imageData;
        vm.picBase64DataArray.splice(0, vm.picBase64DataArray.length);//清空图片数组
        vm.uploadData.img.splice(0, vm.uploadData.img.length)
        vm.picBase64DataArray.push("data:image/jpeg;base64," + imageData);
        vm.uploadData.img.push(imageData);
      }, function (err) {
        $ionicPopup.alert({
          title: '拍照失败，请重试！'
        });
      });
    }


    //根据设施地址模糊查询台帐
    function queryAccountList() {
      AddAssessmentService.queryAccountList(vm.queryCriteria, function (resData) {
        vm.accountList = resData;
        if (resData.length > 0) {
          vm.spinnerShow = true;
        } else {
          vm.spinnerShow = false;
        }
      })
    }

    //点击下拉列表选择数据
    function spinnerHide(item) {
      switch (item.type) {
        case '01':
          vm.accountObj.wcCondition = item.condition;
          break;
        case '02':
          break;
        case '05':
          vm.accountObj.level = item.cleanLevel;
          vm.accountObj.length = item.length;
          vm.accountObj.road = item.primaryOrSecondary;
          vm.accountObj.width = item.width;
          break;
        case '06':
          vm.accountObj.carCondition = item.condition;
          break;
        default:
          break;
      }
      vm.spinnerShow = false;
      vm.queryCriteria.address = item.name;
      vm.mapPositionObj = item;
      vm.infraId = item.id;
    }


    function getAccounts() {
      AssessmentStatusDetailsService.getAccounts(null, function (resData) {
        vm.pointReasonArray = resData;
        vm.uploadData.reason = vm.pointReasonArray[0].name;
      });
    }

    function deletePic(index) {
      $ionicPopup.confirm({
        title: '提示',
        template: '您确定要删除此照片么？'
      }).then(function (res) {
        if (res) {
          vm.picBase64DataArray.splice(index, 1);
          vm.uploadData.img.splice(index, 1);
        } else {

        }
      });
    }

    //提交数据
    function uploadDataFun() {
      if (vm.uploadData.points == '') {
        $ionicPopup.alert({
          title: '扣分情况不能为空'
        });
      } else if (vm.uploadData.reason == '') {
        $ionicPopup.alert({
          title: '扣分原因不能为空'
        });
      } else if (vm.uploadData.remark == '') {
        $ionicPopup.alert({
          title: '备注不能为空'
        });
      } else {
        var uploadDataObj =
          {
            planId: '',
            infraId: ''
          };
        uploadDataObj.planId = vm.addAssessmentData.id;
        uploadDataObj.infraId = vm.infraId;
        var jsonStr = JSON.stringify(uploadDataObj);
        AddAssessmentService.uploadAccountData(jsonStr, function (resData) {
          if (resData) {
            var jsonObj = {
              "infoId": "",
              "planId": "",
              "infraId": "",
              "dItemName": "",
              "score": "",
              "userName": "",
              "remark": "",
              "imgJson": []
            }
            jsonObj.infoId = resData[0];
            jsonObj.planId = vm.addAssessmentData.id;
            jsonObj.infraId = vm.infraId;
            jsonObj.dItemName = vm.uploadData.reason;
            jsonObj.score = vm.uploadData.points;
            jsonObj.userName = $rootScope.userName;
            jsonObj.remark = vm.uploadData.remark;
            jsonObj.imgJson = vm.uploadData.img;
            var jsonStr = JSON.stringify(jsonObj);
            AddAssessmentService.uploadPointAndPicData(jsonStr, function (resData) {

            });
          }
        });
      }
    }

  }
})();
