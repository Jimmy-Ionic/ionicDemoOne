(function () {
  'use strict';

  angular
    .module('app.commonMap')
    .controller('CommonMapController', CommonMapController);

  CommonMapController.$inject = ['$rootScope', '$scope', '$stateParams', 'CommonMapService'];

  /** @ngInject */
  function CommonMapController($rootScope, $scope, $stateParams, CommonMapService) {

    var vm = this;
    vm.data = {};
    vm.title = '地图详情';
    vm.fun = {};
    vm.data = $stateParams.data;
    vm.fromWhere = $stateParams.from;
    vm.map;
    vm.marker;
    vm.postion = [];
    vm.fun = {
      refreshMyPosition: refreshMyPosition,
      sendPosition:sendPosition
    }


    activate();


    function activate() {

      switch (vm.fromWhere) {
        case 'gridCheck':
          if (vm.data == null || vm.data == undefined) {
            CommonMapService.initMap();
          } else {
            vm.map = CommonMapService.initMap();
            CommonMapService.getCoordinateInfo(function (data) {
              vm.marker = CommonMapService.initMyPosition(vm.map, data);
              vm.map.on('click', function (e) {
                marker.setPosition(e.lnglat);
                vm.postion = e.lnglat;
                console.log(e.lnglat);
              })
            });
          }
          break;
        case 'addAssessment':
          break;
        default:
          break;
      }
    }

    //刷新当前的位置，让标记回到当前位置
    function refreshMyPosition() {
      CommonMapService.getCoordinateInfo(function (data) {
        vm.marker.setPosition(data);
        vm.map.setZoom(12);
        vm.map.setCenter(data);
      });
    }

    function sendPosition() {
      $state.go('gridCheck',{position:vm.postion});
    }


  }
})();
