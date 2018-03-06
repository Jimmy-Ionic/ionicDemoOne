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
      address: '',
      position: []
    }


    activate();


    function activate() {

      if ($stateParams.from) {
        vm.from = $stateParams.from;
      } else {
        vm.from = 'addAssessment';
      }

      switch (vm.from) {
        case 'addAssessment':
          if ($stateParams.mapPositionObj) {
            console.log($stateParams.mapPositionObj);
            if($stateParams.mapPositionObj.name){
              vm.mapPositionObj.address = $stateParams.mapPositionObj.name;
            }
            vm.mapPositionObj.position = AddAssessmentMapService.getPositionArray($stateParams.mapPositionObj.point);
          }
          console.log(vm.mapPositionObj);
          break;
        case 'assessmentStatusDetails':
          if ($stateParams.mapPositionObj) {
            console.log($stateParams.mapPositionObj);
            vm.mapPositionObj.address = $stateParams.mapPositionObj.name;
            vm.mapPositionObj.position = AddAssessmentMapService.getPositionArray($stateParams.mapPositionObj.point);
          }
          console.log(vm.mapPositionObj);
          break;
        default:
          break;
      }

      initMap();

    }

    function initMap() {


      vm.map = CommonMapService.initMap();
      vm.markerPerson = new AMap.Marker();

      CommonMapService.getCoordinateInfo(function (data) {
        vm.markerPerson.setPosition(data);
        vm.markerPerson.setMap(vm.map);
      });

      if (vm.mapPositionObj.position.length == 1) {
        //当position.length数量等于1的时候，说明是点坐标
        // 代表着这是一个具体的设施（比如山东路某个公厕，具体到了地址），不是道路
        var icon = new AMap.Icon({
          //icon可缺省，缺省时为默认的蓝色水滴图标，
          size: new AMap.Size(20, 25),  //图标大小
          image: 'assets/global/map/marker.png',//24px*24px
          // content: '<img src="/www/assets/global/img/location.png" />',
          imageOffset: new AMap.Pixel(0, 0)
        })

        vm.marker = new AMap.Marker({
          position: vm.mapPositionObj.position[0],
          icon: icon
        });

        vm.marker.setMap(vm.map);
        vm.map.setCenter(vm.mapPositionObj.position[0]);
      } else if (vm.mapPositionObj.position.length > 1) {//坐标数组大于1说明是道路
        console.log('走到这里了');
        vm.polyline = new AMap.Polyline({
          path: vm.mapPositionObj.position,
          strokeColor: "#1C8B08",
          strokeWeight: 5
        });
        // 添加到地图中
        vm.polyline.setMap(vm.map);
        vm.map.setZoom(13);
        vm.centerPositionNum = parseInt(vm.mapPositionObj.position.length / 2);//截取数组中间的位置，当做地图的中心点显示
        vm.map.setCenter(vm.mapPositionObj.position[vm.centerPositionNum]);
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
      if (vm.mapPositionObj.position.length == 1) {
        vm.map.setCenter(vm.mapPositionObj.position[0]);
      } else if (vm.mapPositionObj.position.length > 1) {
        vm.map.setCenter(vm.mapPositionObj.position[vm.centerPositionNum]);
      }
    }
  }
})();
