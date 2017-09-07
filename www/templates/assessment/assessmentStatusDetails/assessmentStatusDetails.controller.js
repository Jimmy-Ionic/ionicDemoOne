(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .controller('AssessmentStatusDetailsController', AssessmentStatusDetailsController);

  AssessmentStatusDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AssessmentStatusDetailsService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function AssessmentStatusDetailsController($rootScope, $scope, $state, $stateParams, AssessmentStatusDetailsService, $ionicLoading, $ionicPopup) {

    var vm = this;
    vm.data = $stateParams.assessmentStatusData;
    vm.title = '';
    vm.type = '05';//判断是道路还是公厕还是其他的设施 05：道路 01：公厕 06：车辆
    vm.isEdit = false;//判断界面是编辑还是查看
    vm.assessmentStatusDetailsList = {};
    vm.reasonAccount = ['道路不净', '垃圾桶占路'];
    vm.fun = {
      uploadData: uploadData
    }


    activate();


    function activate() {
      vm.isEdit = $stateParams.isEdit;
      getAccounts();
      if (vm.data != null) {
        console.log(vm.data);
        AssessmentStatusDetailsService.getAssessmentStatusDetailsList(vm.data, function (resData) {
          vm.assessmentStatusDetailsList = resData[0];
          if (vm.assessmentStatusDetailsList) {
            vm.type = vm.assessmentStatusDetailsList.type;
          }
        });
      }
    }

    function uploadData() {

    }

    function toCommonMap() {
      $state.go('');
    }

    function getAccounts() {
      AssessmentStatusDetailsService.getAccounts(function (resData) {
        vm.reasonAccount = resData;
      });
    }


  }
})();
