(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .controller('ProblemFeedbackDetailsController', ProblemFeedbackDetailsController);

  ProblemFeedbackDetailsController.$inject = ['$scope', '$stateParams', 'ProblemFeedbackDetailsService'];

  /** @ngInject */
  function ProblemFeedbackDetailsController($scope, $stateParams, ProblemFeedbackDetailsService) {
    var vm = this;
    vm.title = '问题详情'
    vm.fromWhere = $stateParams.fromWhere;
    vm.problemDetails = $stateParams.problemItem;
    vm.feedBack = '';
    vm.footerContent = '确定'
    vm.fun = {
      initCamera: initCamera,
      uploadProblemFeedbackData:uploadProblemFeedbackData
    }
    vm.problemFeedbackData = {};

    activate();

    function activate() {

      if (vm.problemDetails == null) {
        vm.problemDetails = {};
        vm.problemDetails.postion = [120.41317,36.07705];
        vm.problemDetails.address = '燕儿岛路';
      }

      ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
    }


    function initCamera() {

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
        image.problemFeedbackDetailsImg = "data:image/jpeg;base64," + imageData;
      }, function (err) {

      });
    }

    function uploadProblemFeedbackData() {
      ProblemFeedbackDetailsService.uploadProblemFeedbackData(vm.problemFeedbackData,vm.fromWhere);
    }
  }
})();
