(function () {
  'use strict';

  angular
    .module('app.gridCheckMap')
    .controller('GridCheckMapController', GridCheckMapController);

  GridCheckMapController.$inject = ['$rootScope', '$scope', '$stateParams', 'CommonMapService','$state'];

  /** @ngInject */
  function GridCheckMapController($rootScope, $scope, $stateParams, CommonMapService,$state) {

    var vm = this;
    vm.title = '地图详情';
    vm.map = null;
    vm.marker = null;
    vm.postion = [];
    vm.fun = {
      refreshMyPosition: refreshMyPosition,
      sendPosition: sendPosition
    }


    activate();


    function activate() {

      vm.map = CommonMapService.initMap();

      CommonMapService.getCoordinateInfo(function (data) {
        vm.map.setZoom(15);
        vm.marker = CommonMapService.initMyPosition(vm.map, data);
        vm.map.on('click', function (e) {
          vm.marker.setPosition(e.lnglat);
          vm.postion = e.lnglat;
          console.log(e.lnglat);
        })
      });

    }

    //刷新当前的位置，让标记回到当前位置
    function refreshMyPosition() {
      CommonMapService.getCoordinateInfo(function (data) {
        vm.marker.setPosition(data);
        vm.map.setZoom(15);
        vm.map.setCenter(data);
      });
    }

    function sendPosition() {
      $state.go('gridCheck', {mapData: vm.postion});
    }


  }
})();
