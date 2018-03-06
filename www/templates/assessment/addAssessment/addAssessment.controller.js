(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .controller('AddAssessmentController', AddAssessmentController);

  AddAssessmentController.$inject = ['$rootScope', '$state', '$stateParams', 'AddAssessmentService',
    'AssessmentStatusDetailsService', '$ionicPopup', '$ionicHistory', '$cordovaCamera'];

  /** @ngInject */
  function AddAssessmentController($rootScope, $state, $stateParams, AddAssessmentService,
                                   AssessmentStatusDetailsService, $ionicPopup, $ionicHistory, $cordovaCamera) {

    var vm = this;
    vm.data = {};
    vm.title = '录入计划';
    vm.spinnerShow = false;
    // vm.picBase64DataArray = [];
    vm.infraId = '';
    //需要上传的数据
    vm.uploadData = {
      level: '',
      road: '',
      length: '',
      points: '',
      width: '',
      reason: '',
      remarks: '',
      img: []
    };

    vm.uploadPicDataObj = {
      img1: '',
      img2: '',
      img3: ''
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

      if (vm.uploadPicDataObj.img1 != '' && vm.uploadPicDataObj.img2 != '' && vm.uploadPicDataObj.img3 != '') {
        $ionicPopup.alert({
          title: '最多支持上传三张图片'
        }).then(function () {

        });
      } else {
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

          if (vm.uploadPicDataObj.img1 == '') {
            var image = document.getElementById('addAssessmentImg1');
            image.src = "data:image/jpeg;base64," + imageData;
            vm.uploadPicDataObj.img1 = imageData;
          } else if (vm.uploadPicDataObj.img2 == '') {
            var image = document.getElementById('addAssessmentImg2');
            image.src = "data:image/jpeg;base64," + imageData;
            vm.uploadPicDataObj.img2 = imageData;
          } else if (vm.uploadPicDataObj.img3 == '') {
            var image = document.getElementById('addAssessmentImg3');
            image.src = "data:image/jpeg;base64," + imageData;
            vm.uploadPicDataObj.img3 = imageData;
          } else {

          }
          // vm.picBase64DataArray.splice(0, vm.picBase64DataArray.length);//清空图片数组
          // vm.uploadData.img.splice(0, vm.uploadData.img.length)
          // vm.picBase64DataArray.push("data:image/jpeg;base64," + imageData);
          // vm.uploadData.img.push(imageData);
        }, function (err) {
          $ionicPopup.alert({
            title: '拍照失败，请重试！'
          });
        });
      }
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

      switch (index) {
        case '1':
          if(vm.uploadPicDataObj.img1 == ''){
            return;
          }
          break;
        case '2':
          if(vm.uploadPicDataObj.img2 == ''){
            return;
          }
          break;
        case '3':
          if(vm.uploadPicDataObj.img3 == ''){
            return;
          }
          break;
        default:
          break;
      }

      $ionicPopup.confirm({
        title: '提示',
        template: '确认删除此照片么？',
        cancelText: '取消', // String (默认: 'Cancel'). 取消按钮的标题文本
        cancelType: 'button-royal', // String (默认: 'button-default'). 取消按钮的类型
        okText: '确认', // String (默认: 'OK'). OK按钮的标题文本
        okType: 'button-positive'
      }).then(function (res) {
        if (res) {
          switch (index) {
            case '1':
              var image1 = document.getElementById('addAssessmentImg1');
              image1.src = 'assets/global/img/gridCheck/icon_streetscape.jpg';
              vm.uploadPicDataObj.img1 = '';
              break;
            case '2':
              var image2 = document.getElementById('addAssessmentImg2');
              image2.src = 'assets/global/img/gridCheck/icon_streetscape.jpg';
              vm.uploadPicDataObj.img2 = '';
              break;
            case '3':
              var image3 = document.getElementById('addAssessmentImg3');
              image3.src = 'assets/global/img/gridCheck/icon_streetscape.jpg';
              vm.uploadPicDataObj.img3 = '' ;
              break;
            default:
              break;
          }
        } else {
          return;
        }
      })
    }

    //提交数据
    function uploadDataFun() {
      if (!vm.addAssessmentData || !vm.addAssessmentData.id) {
        $ionicPopup.alert({
          title: '提示',
          template: '计划id未获取到，请退出此页面重新进入！'
        });
      } else if (!vm.infraId) {
        $ionicPopup.alert({
          title: '提示',
          template: '您没有选择相关的设施，请先选择！'
        });
      } else if (vm.uploadData.points == '') {
        $ionicPopup.alert({
          title: '扣分情况不能为空'
        });
      } else if (vm.uploadData.reason == '') {
        $ionicPopup.alert({
          title: '扣分原因不能为空'
        });
      } else if (vm.uploadData.remarks == '') {
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
              "remarks": "",
              "imgJson": []
            }
            jsonObj.infoId = resData[0];
            jsonObj.planId = vm.addAssessmentData.id;
            jsonObj.infraId = vm.infraId;
            jsonObj.dItemName = vm.uploadData.reason;
            jsonObj.score = vm.uploadData.points;
            jsonObj.userName = $rootScope.userName;
            jsonObj.remarks = vm.uploadData.remarks;
            for (var i = 0; i < 3; i++) {
              switch (i) {
                case 0:
                  jsonObj.imgJson.push(vm.uploadPicDataObj.img1);
                  break;
                case 1:
                  jsonObj.imgJson.push(vm.uploadPicDataObj.img2);
                  break;
                case 2:
                  jsonObj.imgJson.push(vm.uploadPicDataObj.img3);
                  break;
                default:
                  break;

              }
            }
            var jsonStr = JSON.stringify(jsonObj);
            AddAssessmentService.uploadPointAndPicData(jsonStr, function (resData) {

            });
          }
        });
      }
    }

  }
})();
