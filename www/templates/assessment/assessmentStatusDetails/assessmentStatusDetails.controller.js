(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .controller('AssessmentStatusDetailsController', AssessmentStatusDetailsController);

  AssessmentStatusDetailsController.$inject = ['$rootScope', 'SYS_INFO', '$scope', '$state', '$stateParams', 'AssessmentStatusDetailsService', '$ionicLoading', '$ionicPopup', '$cordovaCamera', '$ionicHistory'];

  /** @ngInject */
  function AssessmentStatusDetailsController($rootScope, SYS_INFO, $scope, $state, $stateParams, AssessmentStatusDetailsService, $ionicLoading, $ionicPopup, $cordovaCamera, $ionicHistory) {

    var vm = this;
    vm.data = {};
    vm.title = '';
    vm.type = '05';//判断是道路还是公厕还是其他的设施 05：道路 01：公厕 06：车辆
    vm.isEdit = false;//判断界面是编辑还是查看
    vm.assessmentStatusDetails = {};
    vm.reasonAccount = [];
    vm.picBase64DataArray = [];
    vm.serverUrl = '';
    vm.uploadPicBase64DataArray = ["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"];
    vm.picNameArray = [];
    vm.uploadData = {
      points: '',
      reason: '',
      remarks: ''
    };
    vm.fun = {
      uploadAssessmentStatusDetailsData: uploadAssessmentStatusDetailsData,
      toCommonMap: toCommonMap,
      takePicture: takePicture,
      deletePic: deletePic
    }


    activate();


    function activate() {
      vm.isEdit = $stateParams.isEdit;
      vm.serverUrl = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb';
      if ($stateParams.assessmentStatusData) {
        vm.data = $stateParams.assessmentStatusData;
        vm.title = $stateParams.assessmentStatusData.name;
        console.log(vm.data);

        if (vm.isEdit) {
          getAccounts();
          AssessmentStatusDetailsService.getAssessmentStatusDetailsListIsEdit(vm.data, function (resData) {
            vm.assessmentStatusDetails = resData[0];
            if (vm.assessmentStatusDetails) {
              vm.type = vm.assessmentStatusDetails.type;
            }
          });
        } else {
          AssessmentStatusDetailsService.getAssessmentStatusDetailsListNotEdit(vm.data, function (resData) {
            vm.assessmentStatusDetails = resData[0];
            if (vm.assessmentStatusDetails) {
              vm.type = vm.assessmentStatusDetails.type;
              vm.reasonAccount[0] = vm.assessmentStatusDetails.dItem;
              vm.uploadData.points = vm.assessmentStatusDetails.deducted;
              vm.uploadData.reason = vm.assessmentStatusDetails.dItem;
              vm.uploadData.remarks = vm.assessmentStatusDetails.remarks;
              vm.picBase64DataArray = vm.assessmentStatusDetails.imgs;
            }
          });
        }
      }
    }

    //上传考核数据
    function uploadAssessmentStatusDetailsData() {

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
        jsonObj.infoId = vm.data.id;
        jsonObj.planId = vm.data.planId;
        jsonObj.infraId = vm.data.infraId;
        jsonObj.dItemName = vm.uploadData.reason;
        jsonObj.score = vm.uploadData.points;
        jsonObj.userName = $rootScope.userName;
        jsonObj.remark = vm.uploadData.remark;
        jsonObj.imgJson = vm.uploadPicBase64DataArray;
        AssessmentStatusDetailsService.uploadAssessmentStatusDetailsData(jsonObj, function (res) {
          $ionicHistory.goBack();
        });
      }
    }

    //启动摄像头拍照
    function takePicture() {

      if (vm.picBase64DataArray.length >= 3) {
        $ionicPopup.alert({
          title: '最多支持上传三张图片'
        }).then(function () {

        });
      } else {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 200,
          targetHeight: 200,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true,
          correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
          // var image = document.getElementById('pic' + vm.picIsShow);
          // image.src = "data:image/jpeg;base64," + imageData;
          var picName = moment().format('YYYY-MM-DD HH:mm:ss') + '.jpg';
          vm.picNameArray.push(picName);
          vm.picBase64DataArray.push("data:image/jpeg;base64," + imageData);
          vm.uploadPicBase64DataArray.push(imageData);
        }, function (err) {
          // error
        });
      }
    }


    //通过手机相册来获取图片
    function getPicByAlbum() {
      var options = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
      };

      $cordovaCamera.getPicture(options).then(function (imageURI) {
        $ionicPopup.alert({
            title: '图片信息',
            template: imageURI
          }
        );
      }, function (err) {
        // error
      });
      $cordovaCamera.cleanup().then(function (res) {
      }); // only for FILE_URI
    }


    //启动SqlLite来保存未上传的数据
    function startSqlLite() {

      var db = $cordovaSQLite.openDB({name: "savedData.db"});

      // for opening a background db:
      var db = $cordovaSQLite.openDB({name: "my.db", bgType: 1});

      $scope.execute = function () {
        var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, ["test", 100]).then(function (res) {
          console.log("insertId: " + res.insertId);
        }, function (err) {
          console.error(err);
        });
      };


    }


    function toCommonMap() {
      $state.go('addAssessmentMap', {mapPositionObj: vm.assessmentStatusDetailsList, from: 'assessmentStatusDetails'});
    }

    function getAccounts() {
      AssessmentStatusDetailsService.getAccounts(vm.data, function (resData) {
        vm.reasonAccount = resData;
        console.log('扣分原因数据：');
        console.log(vm.reasonAccount);
      });
    }

    //长按删除某张图片
    function deletePic(index) {
      vm.picBase64DataArray.splice(index, 1);
      vm.uploadPicBase64DataArray.push(index, 1);
      vm.picNameArray.push(index, 1);
    }


  }
})();
