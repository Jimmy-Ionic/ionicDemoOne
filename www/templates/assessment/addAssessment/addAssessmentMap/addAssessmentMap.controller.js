(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .controller('AddAssessmentMapController', AddAssessmentMapController);

  AddAssessmentMapController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'CommonMapService', 'AddAssessmentMapService'];

  /** @ngInject */
  function AddAssessmentMapController($rootScope, $scope, $state, $stateParams, CommonMapService, AddAssessmentMapService) {

    var vm = this;
    vm.data = {};
    vm.title = '地图详情';
    vm.from = '';

    vm.map;
    vm.marker;
    vm.markerPerson;
    vm.polyline;
    vm.centerPositionNum = 0;
    vm.fun = {
      refreshMyPosition: refreshMyPosition,
      refreshRoadOrInstallationPosition: refreshRoadOrInstallationPosition
    };
    vm.mapPositionObj = {
      address: '市南软件园2号楼',
      position: [120.41317, 36.07705],
      roadPositionArray: [
        ["120.352728", "36.086514"], ["120.352788", "36.086477"],
        ["120.352849", "36.08644"], ["120.35291", "36.086403"],
        ["120.35297", "36.086365"], ["120.353031", "36.086328"],
        ["120.353092", "36.086291"], ["120.353152", "36.086254"],
        ["120.353213", "36.086217"], ["120.353283", "36.086178"],
        ["120.353354", "36.086138"], ["120.353425", "36.086099"],
        ["120.353425", "36.086099"]
      ]
    }


    activate();


    function activate() {

      if(vm.from){
        vm.from = $stateParams.from;
      }else{
        vm.from = 'addAssessment';
      }

      if ($stateParams.mapPositionObj != null) {
        vm.mapPositionObj = $stateParams.mapPositionObj;
        console.log(vm.mapPositionObj);
      }

      initMap();


    }

    function initMap() {

      vm.map = CommonMapService.initMap(vm.mapPositionObj.position);
      vm.markerPerson = new AMap.Marker();

      if (vm.mapPositionObj.roadPositionArray.length <= 0) {
        //当roadPositionArray.length数量小于等于0的时候，说明道路的坐标没有，
        // 代表着这是一个具体的设施（比如山东路某个公厕，具体到了地址），不是道路
        vm.marker = new AMap.Marker({
          position: vm.mapPositionObj.position,
          icon: new AMap.Icon({
            size: new AMap.Size(32, 32),  //图标大小
            // content: '<img src="/www/assets/global/img/location.png" />',
            image: "/www/assets/global/img/position.png",
            imageOffset: new AMap.Pixel(0, 0)
          })
        });

        vm.marker.setMap(vm.map);
        vm.map.setCenter(vm.mapPositionObj.position);
      } else {
        vm.polyline = new AMap.Polyline({
          path: vm.mapPositionObj.roadPositionArray,
          strokeColor: "#1C8B08",
          strokeWeight: 5
        });
        // 添加到地图中
        vm.polyline.setMap(vm.map);
        vm.map.setZoom(17);
        vm.centerPositionNum = parseInt(vm.mapPositionObj.roadPositionArray.length / 2);
        vm.map.setCenter(vm.mapPositionObj.roadPositionArray[centerPositionNum]);
      }

      // CommonMapService.getCoordinateInfo(function (data) {
      //   vm.markerPerson.setPosition(data);
      //   vm.markerPerson.setMap(vm.map);
      // });
    }

    function refreshMyPosition() {
      CommonMapService.getCoordinateInfo(function (data) {
        vm.markerPerson.setPosition(data);
        vm.map.setZoom(13);
        vm.markerPerson.setMap(vm.map);
        vm.map.setCenter(data);
      });
    }

    function refreshRoadOrInstallationPosition() {
      if (vm.mapPositionObj.roadPositionArray.length <= 0) {
        vm.map.setCenter(vm.mapPositionObj.position);
      }else{
        vm.map.setCenter(vm.mapPositionObj.roadPositionArray[centerPositionNum]);
      }

    }
  }
})();
