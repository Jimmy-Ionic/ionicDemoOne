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
    vm.data = $stateParams.planDetailsData;
    vm.fun = {
      toAssessmentStatusDetails:toAssessmentStatusDetails,
      upload:upload,
      checkStatusDetails:checkStatusDetails
    };


    vm.assessmentStatusList = [];


    activate();

    function activate() {
      console.log(vm.data);
      if(vm.data){
        AssessmentStatusService.getAssessmentStatusList(vm.data,function (resData) {
          vm.assessmentStatusList = resData;
        });
      }
    }

    //上传数据
    function upload() {
      if(vm.planDetailsData!=null&&vm.planDetailsData.status == null){

      }else{
        $ionicPopup.alert({
          title: '该项目已考核',
          template: response.data
        }).then(function (res) {

        });
      }
    }

    function toAssessmentStatusDetails() {
      if(vm.data!=null&&vm.data.status == null){
        $state.go('assessmentStatusDetails', {assessmentStatusData: vm.data,isEdit:true})
      }else{
        $ionicPopup.alert({
          title: '该项目已考核',
          template: response.data
        }).then(function (res) {

        });
      }
    }

    function checkStatusDetails(item) {
      if (vm.data != null && vm.data.status == null) {
        item.typeId = vm.data.typeId;
        item.infraId = vm.data.infraId;
        $state.go('assessmentStatusDetails', {assessmentStatusData: item, isEdit: false})
      }
    }


  }
})();
