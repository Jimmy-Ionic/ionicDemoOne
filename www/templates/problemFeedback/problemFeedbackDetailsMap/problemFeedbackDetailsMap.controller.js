(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetailsMap')
    .controller('ProblemFeedbackDetailsMapController', ProblemFeedbackDetailsMapController);

  ProblemFeedbackDetailsMapController.$inject = ['CommonMapService'];

  /** @ngInject */
  function ProblemFeedbackDetailsMapController(CommonMapService) {
    var vm = this;
    vm.title = '问题详情地图';
    vm.map;
    vm.marker;
    vm.address = '';
    vm.position;
    vm.fun = {
      refreshMyPosition:refreshMyPosition
    }


    activate();

    function activate() {

      //初始化地图
      vm.map = CommonMapService.initMap();

      //定位获取GPS坐标数组
      CommonMapService.getCoordinateInfo(function (data) {
        vm.position = data;
        vm.map.setZoom(15);
        vm.marker = CommonMapService.initMyPosition(vm.map, data);
        ////如果有需要可以恢复此代码
        // CommonMapService.getLocationByLatitudeAndLongitude(data, function (res) {
        //   vm.address = res;
        // });
      });

    }


    //刷新当前的位置，让标记回到当前位置
    function refreshMyPosition() {
      CommonMapService.getCoordinateInfo(function (data) {
        vm.position = data;
        vm.marker.setPosition(data);
        vm.map.setZoom(15);
        vm.map.setCenter(data);
        //如果有需要可以恢复此代码
        // CommonMapService.getLocationByLatitudeAndLongitude(data, function (res) {
        //   vm.address = res;
        // });
      });
    }
  }
})();
