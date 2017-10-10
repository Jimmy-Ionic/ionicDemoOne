(function () {
  'use strict';

  angular
    .module('app.gridCheckMap')
    .controller('GridCheckMapController', GridCheckMapController);

  GridCheckMapController.$inject = ['$rootScope', '$scope', '$stateParams', 'CommonMapService', '$state', '$cacheFactory', '$ionicHistory'];

  /** @ngInject */
  function GridCheckMapController($rootScope, $scope, $stateParams, CommonMapService, $state, $cacheFactory, $ionicHistory) {

    var vm = this;
    vm.title = '地图详情';
    vm.map = null;
    vm.marker = null;
    vm.position = [];
    vm.address = '';
    vm.fun = {
      refreshMyPosition: refreshMyPosition,
      sendPosition: sendPosition
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
        CommonMapService.getLocationByLatitudeAndLongitude(data, function (res) {
          vm.address = res.address;
          $scope.$apply();
        });
        vm.map.on('click', function (e) {
          vm.marker.setPosition(e.lnglat);
          vm.position = e.lnglat.toString();
          //获取详细的地点
          CommonMapService.getLocationByLatitudeAndLongitude(e.lnglat, function (res) {
            vm.address = res.address;
            $scope.$apply();
          });
          console.log('通过在地图上选点获取到的坐标：');
          console.log(e.lnglat);
          console.log('通过在地图上选点获取的详细地址：');
          console.log(vm.address);
        })
      });

    }


    //刷新当前的位置，让标记回到当前位置
    function refreshMyPosition() {
      CommonMapService.getCoordinateInfo(function (data) {
        vm.position = data;
        vm.marker.setPosition(data);
        vm.map.setZoom(15);
        vm.map.setCenter(data);
        CommonMapService.getLocationByLatitudeAndLongitude(data, function (res) {
          vm.address = res.address;
          $scope.$apply();
        });
      });
    }

    //通过本地缓存来给上一个页面传值
    function sendPosition() {
      if ($cacheFactory.get('cacheGridCheckMapData')) {
        console.log('$cacheFactory:cacheGridCheckMapData');
        console.log($cacheFactory.get('cacheGridCheckMapData'));
        $cacheFactory.get('cacheGridCheckMapData').destroy();
      }
      var cacheMapData = $cacheFactory('cacheGridCheckMapData');
      cacheMapData.put('position', vm.position);
      cacheMapData.put('address', vm.address);
      console.log('存储在本地的定位的相关数据：');
      console.log(cacheMapData);
      $ionicHistory.goBack();
    }


  }
})();
