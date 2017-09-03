(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .controller('AddAssessmentMapController', AddAssessmentMapController);

  AddAssessmentMapController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AddAssessmentService'];

  /** @ngInject */
  function AddAssessmentMapController($rootScope, $scope, $state, $stateParams, AddAssessmentService) {

    var vm = this;
    vm.data = {};
    vm.title = '地图详情';
    vm.fun = {};


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


    activate();


    function activate() {
        AddAssessmentService.initAddAssessmentMap();
    }



  }
})();
