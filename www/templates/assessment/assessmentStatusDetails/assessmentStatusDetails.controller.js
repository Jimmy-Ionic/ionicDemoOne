(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .controller('AssessmentStatusDetailsController', AssessmentStatusDetailsController);

  AssessmentStatusDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AssessmentStatusDetailsService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function AssessmentStatusDetailsController($rootScope, $scope, $state, $stateParams, AssessmentStatusDetailsService, $ionicLoading, $ionicPopup) {

    var vm = this;
    // vm.data = $stateParams.assessmentStatusData;
    vm.data = {};
    vm.title = '';
    vm.titleController = {
      backToBeforePage: backToBeforePage,
      enterMsg: enterMsg
    }
    vm.initAmap = initAmap;

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

      // vm.assessmentStatusDetailsList=AssessmentStatusDetailsService.getAssessmentStatusDetailsList(vm.data.id);

      initAmap();
    }


    function initAmap() {

      var position = new AMap.LngLat(116.397428, 39.90923);

      $scope.mapObj = new AMap.Map('map', {

        view: new AMap.View2D({

          center: position,

          zoom: 10,

          rotation: 0

        }),

        lang: 'zh_cn'

      });
      console.log('走到这儿啦');
    }

    function backToBeforePage() {

    }

    function enterMsg() {

    }

  }
})();
