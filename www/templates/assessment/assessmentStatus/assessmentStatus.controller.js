(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .controller('AssessmentStatusController', AssessmentStatusController);

  AssessmentStatusController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AssessmentStatusService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function AssessmentStatusController($rootScope, $scope, $state, $stateParams, AssessmentStatusService, $ionicLoading, $ionicPopup) {
    var vm = this;
    vm.title = '考核情况';
    vm.data = {};//来自上一个页面的数据
    vm.fun = {
      toAssessmentStatusDetails: toAssessmentStatusDetails,
      upload: upload,
      checkStatusDetails: checkStatusDetails
    };


    vm.assessmentStatusList = [];


    activate();

    function activate() {
      if ($stateParams.planDetailsData) {
        vm.data = $stateParams.planDetailsData;
        console.log(vm.data);
        // AssessmentStatusService.getAssessmentStatusList(vm.data, function (resData) {
        //   vm.assessmentStatusList = resData;
        // });
      }
      $scope.$on('$ionicView.beforeEnter', function (event) {
        AssessmentStatusService.getAssessmentStatusList(vm.data, function (resData) {
          vm.assessmentStatusList = resData;
        });
      });
    }

    //考核完成
    function upload() {
      if (vm.data != null) {
        if (vm.data.status == null || vm.data.status == false) {
          AssessmentStatusService.checkOverAndUpload(vm.data);
        } else {
          $ionicPopup.alert({
            title: '该考核任务已经完成！'
          }).then(function (res) {

          });
        }
      }
    }

    //录入考核情况
    function toAssessmentStatusDetails() {
      if (vm.data != null) {
        if (vm.data.status == null || vm.data.status == false) {
          $state.go('assessmentStatusDetails', {assessmentStatusData: vm.data, isEdit: true})
        } else {
          $ionicPopup.alert({
            title: '该考核任务已经完成！'
          }).then(function (res) {

          });
        }
      }

    }

    //查看考核情况详情
    function checkStatusDetails(item) {
      item.typeId = vm.data.typeId;
      item.infraId = vm.data.infraId;
      $state.go('assessmentStatusDetails', {assessmentStatusData: item, isEdit: false})
    }

  }
})();
