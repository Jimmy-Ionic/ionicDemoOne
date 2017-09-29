(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .controller('AssessmentStatusDetailsController', AssessmentStatusDetailsController);

  AssessmentStatusDetailsController.$inject = ['$rootScope', 'SYS_INFO', '$scope', '$state', '$stateParams',
    'AssessmentStatusDetailsService', '$ionicLoading', '$ionicPopup', '$cordovaCamera', '$ionicHistory', 'HomeService'];

  /** @ngInject */
  function AssessmentStatusDetailsController($rootScope, SYS_INFO, $scope, $state, $stateParams,
                                             AssessmentStatusDetailsService, $ionicLoading, $ionicPopup, $cordovaCamera, $ionicHistory, HomeService) {

    var vm = this;
    vm.data = {};
    vm.title = '';
    vm.type = '05';//判断是道路还是公厕还是其他的设施 05：道路 01：公厕 06：车辆
    vm.isEdit = false;//判断界面是编辑还是查看
    vm.assessmentStatusDetails = {};
    vm.reasonAccount = [];
    vm.picNameArray = [];
    vm.picBase64DataArray = [];
    vm.serverUrl = '';
    vm.uploadPicBase64DataArray = [];
    vm.uploadData = {
      points: '',
      reason: '',
      remarks: ''
    };
    vm.uploadPicDataObj = {
      img1: '',
      img2: '',
      img3: ''
    };

    vm.fun = {
      uploadAssessmentStatusDetailsData: uploadAssessmentStatusDetailsData,
      toCommonMap: toCommonMap,
      takePicture: takePicture,
      deletePic: deletePic
    }


    activate();


    function activate() {

      if (!vm.db) {
        vm.db = HomeService.openSqlDB();
      }

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
              vm.uploadData.points = vm.assessmentStatusDetails.deducted;
              vm.uploadData.reason = vm.assessmentStatusDetails.dItem;
              vm.uploadData.remarks = vm.assessmentStatusDetails.remarks;
              vm.picBase64DataArray = vm.assessmentStatusDetails.imgs;
              //在这儿初始化显示图片
              if (vm.picBase64DataArray.length == 0) {

              } else {
                for (var x in vm.picBase64DataArray) {
                  var imageId = 'img' + x + 4;
                  var image = document.getElementById(imageId);
                  image.src = vm.serverUrl + vm.picBase64DataArray[x];
                }
              }
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
      } else if (vm.uploadData.remarks == '') {
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
        jsonObj.remark = vm.uploadData.remarks;
        for (var i = 0; i < 3; i++) {
          jsonObj.imgJson.push(vm.uploadPicDataObj('img' + i + 1));
        }
        console.log(jsonObj);
        AssessmentStatusDetailsService.uploadAssessmentStatusDetailsData(jsonObj, function (res) {
          if (res == 'success') {
            $ionicHistory.goBack();
          } else if (res == 'failed') {
            try {
              var json = {};
              json.date = moment().format('YYYY/MM/DD/HH:mm:ss');
              json.address = vm.title;
              json.type = 'assessmentStatusDetails';
              json.data = JSON.stringify(jsonObj);
              HomeService.insertDataToSqlDB(vm.db, json);
            } catch (error) {

            }
          }
        });
      }
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
          if (vm.uploadPicDataObj.img1 == '') {
            var image = document.getElementById('assessmentImg1');
            image.src = "data:image/jpeg;base64," + imageData;
            vm.uploadPicDataObj.img1 = imageData;
          } else if (vm.uploadPicDataObj.img2 == '') {
            var image = document.getElementById('assessmentImg2');
            image.src = "data:image/jpeg;base64," + imageData;
            vm.uploadPicDataObj.img2 = imageData;
          } else if (vm.uploadPicDataObj.img3 == '') {
            var image = document.getElementById('assessmentImg3');
            image.src = "data:image/jpeg;base64," + imageData;
            vm.uploadPicDataObj.img3 = imageData;
          } else {

          }
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


    function toCommonMap() {
      $state.go('addAssessmentMap', {mapPositionObj: vm.assessmentStatusDetails, from: 'assessmentStatusDetails'});
    }

    function getAccounts() {
      AssessmentStatusDetailsService.getAccounts(vm.data, function (resData) {
        vm.reasonAccount = resData;
        vm.uploadData.reason = vm.reasonAccount[0].name;
        console.log('扣分原因数据：');
        console.log(vm.reasonAccount);
      });
    }

    //长按删除某张图片
    function deletePic(index) {

      switch (index) {
        case '1':
          if (vm.uploadPicDataObj.img1 == '') {
            return;
          }
          break;
        case '2':
          if (vm.uploadPicDataObj.img2 == '') {
            return;
          }
          break;
        case '3':
          if (vm.uploadPicDataObj.img3 == '') {
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
        console.log(res);
        if (res) {
          switch (index) {
            case '1':
              console.log(index);
              var image1 = document.getElementById('assessmentImg1');
              image1.src = 'assets/global/img/gridCheck/icon_streetscape.jpg';
              vm.uploadPicDataObj.img1 = '';
              break;
            case '2':
              console.log(index);
              var image2 = document.getElementById('assessmentImg2');
              image2.src = 'assets/global/img/gridCheck/icon_streetscape.jpg';
              vm.uploadPicDataObj.img2 = '';
              break;
            case '3':
              console.log(index);
              var image3 = document.getElementById('assessmentImg3');
              image3.src = 'assets/global/img/gridCheck/icon_streetscape.jpg';
              vm.uploadPicDataObj.img3 = '';
              break;
            default:
              console.log(index);
              break;
          }
        } else {
          return;
        }
      })

      // vm.picBase64DataArray.splice(index, 1);
      // vm.uploadPicBase64DataArray.push(index, 1);
      // vm.picNameArray.push(index, 1);
    }


  }
})();
