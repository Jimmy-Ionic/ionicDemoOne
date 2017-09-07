(function () {
  'use strict';

  angular
    .module('app.map')
    .controller('MapController', MapController);

  MapController.$inject = ['$scope', 'GetWeatherService', 'CommonMapService', 'MyHttpService'];

  /** @ngInject */
  function MapController($scope, GetWeatherService, CommonMapService, MyHttpService) {
    var vm = this;
    vm.data = {};
    vm.title = '地图查询';
    vm.spinnerShow = false;
    vm.queryObj = {
      account: '',
      keyword: ''
    }

    vm.accountList = [{account: '全部', selected: true}, {account: '公厕', selected: true}, {
      account: '街道',
      selected: true
    }, {account: '车辆', selected: false}, {account:'垃圾桶',selected:false}, {account:'收集站',selected:false}];

    //获取到的所有的匹配的台帐信息
    vm.accountAddressData = [{
      name: '百度1',
      position: [],
      roadPositionArray: []
    }, {
      name: '百度2',
      position: [],
      roadPositionArray: []
    }, {
      name: '百度3',
      position: [],
      roadPositionArray: []
    }, {
      address: '百度4',
      position: [],
      roadPositionArray: []
    }];

    vm.map;
    vm.marker;
    vm.markerPerson;
    vm.polyline;
    vm.centerPositionNum = 0;

    vm.mapPositionObj = {
      address: '市南软件园2号楼',
      position: [120.41317, 36.07705],
      roadPositionArray: []
      // roadPositionArray: [
      //   ["120.352728", "36.086514"], ["120.352788", "36.086477"],
      //   ["120.352849", "36.08644"], ["120.35291", "36.086403"],
      //   ["120.35297", "36.086365"], ["120.353031", "36.086328"],
      //   ["120.353092", "36.086291"], ["120.353152", "36.086254"],
      //   ["120.353213", "36.086217"], ["120.353283", "36.086178"],
      //   ["120.353354", "36.086138"], ["120.353425", "36.086099"],
      //   ["120.353425", "36.086099"]
      // ]
    }

    vm.fun ={
      getAccountsPostionData:getAccountsPostionData
    }


    activate();


    function activate() {

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
            content: '<img src="/www/assets/global/img/location.png" />',
            // image: "http://www.iconpng.com/png/iconbeast_lite/map-pin.png"
            // imageOffset: new AMap.Pixel(0, 0)
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
      } else {
        vm.map.setCenter(vm.mapPositionObj.roadPositionArray[centerPositionNum]);
      }
    }

    //获取对应的台帐的信息
    function getAccounts() {
      var url = ''
      MyHttpService.getCommonData(url, function (data) {
        vm.accountList = data[0];
      });
    }

    //根据台帐获取对应的台帐定位信息
    function getAccountsPostionData() {
      var url = '';
      MyHttpService.getCommonData(url, function (data) {
        vm.accountList = data[0];
        vm.spinnerShow = true;
      });
    }

    function spinnerHide(item) {
      vm.spinnerShow = false;
    }
  }
})();
