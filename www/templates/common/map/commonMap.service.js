(function () {
  'use strict';

  angular
    .module('app.commonMap')
    .service('CommonMapService', CommonMapService);

  CommonMapService.$inject = ['$ionicLoading', '$ionicPopup', '$cordovaGeolocation'];

  /** @ngInject */
  function CommonMapService($ionicLoading, $ionicPopup, $cordovaGeolocation) {

    var service = {
      initMap: initMap,
      initMyPosition: initMyPosition,
      getCoordinateInfo: getCoordinateInfo,
      getLocationInfoByGPS: getLocationInfoByGPS,
      getLocationByLatitudeAndLongitude: getLocationByLatitudeAndLongitude,
      getAddressByBrowserOrIp: getAddressByBrowserOrIp
    };

    return service;

    function initMap() {

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>地图数据加载中...</span>' +
          '</div>',
          duration: 5 * 1000
        });

      var map = new AMap.Map('map', {
        resizeEnable: true,
        zoom: 12,
        lang: 'zh_cn'
      });

      map.plugin(['AMap.ToolBar'], function () {
        var toolBar = new AMap.ToolBar();
        map.addControl(toolBar);
      });

      $ionicLoading.hide();

      return map;
    }

    //进入地图时获取自己当前的位置，并且标注在地图上
    function initMyPosition(map, positionArray) {

      map.setCenter(positionArray);

      var marker = new AMap.Marker({
        position: positionArray
      });
      marker.setMap(map);
      marker.setTitle('我的位置');

      // map.on('click', function (e) {
      //   marker.setPosition(e.lnglat);
      //   console.log(e.lnglat);
      // })

      return marker;
    }

    /**
     * 使用Cordova使用GPS定位获取详细的GPS坐标
     * @param fun
     */
    function getCoordinateInfo(fun) {
      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>定位中...</span>' +
          '</div>',
          duration: 10 * 1000
        });
      var positionArray = new Array();
      $cordovaGeolocation
        .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
        .then(function (position) {
          positionArray[0] = position.coords.longitude;
          positionArray[1] = position.coords.latitude;
          fun(positionArray);
          $ionicLoading.hide();
          console.log('Cordova使用GPS定位成功：');
          console.log(positionArray);
        }, function (err) {
          //如果获取GPS失败，那么设置GPS地点为垃管处的经纬度坐标(120.413762,36.084807)
          // positionArray[0] = 120.41317;
          // positionArray[1] = 36.07705;
          positionArray[0] = 120.413762;
          positionArray[1] = 36.084807;
          fun(positionArray);
          $ionicLoading.hide();
          console.log('Cordova使用GPS定位失败，定位地点已经设为垃管处的地理位置：');
          console.log('失败码：' + err.code);
          console.log('失败信息' + err.msg);
        });
    }


    /**
     * 根据经纬度来获取定位地点的的各种信息
     * @param dataArray
     * @returns {{}}
     */
    function getLocationByLatitudeAndLongitude(dataArray, fun) {
      var locationObj = {
        address: '',
        city: '',
        district: '',
        street: '',
        township: '',
        streetNumber: ''
      };
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          city: "010"//城市，默认：“全国”
        });
        geocoder.getAddress(dataArray, function (status, result) {
          if (status == 'complete') {
            locationObj.address = result.regeocode.formattedAddress;//定位的详细的地点
            locationObj.city = result.regeocode.addressComponent.city;//城市
            locationObj.district = result.regeocode.addressComponent.district;//市区
            locationObj.street = result.regeocode.addressComponent.street;//路
            locationObj.township = result.regeocode.addressComponent.township;//街道
            locationObj.streetNumber = result.regeocode.addressComponent.streetNumber;//楼号
            console.log('根据经纬度来获取定位地点返回的数据：');
            console.log(result);
            console.log('根据经纬度来获取定位地点的的各种信息:');
            console.log(locationObj);
            fun(locationObj)
          } else {
            fun(locationObj);
          }
        })
      });
    }


    /**
     * 网格化巡检定位，获取地理位置的各种详细信息(通过调用手机的GPS进行获取定位)
     * @param fun
     */
    function getLocationInfoByGPS(fun) {
      var locationObj = {
        address: '',
        city: '',
        district: '',
        street: '',
        township: '',
        streetNumber: ''
      };
      //调用GPS定位
      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>定位中...</span>' +
          '</div>',
          duration: 10 * 1000
        });
      var positionArray = [];
      $cordovaGeolocation
        .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
        .then(function (position) {
          positionArray[0] = position.coords.longitude;
          positionArray[1] = position.coords.latitude;
          $ionicLoading.hide();
          console.log('定位成功，坐标数组：' + positionArray);
          AMap.plugin('AMap.Geocoder', function () {
            var geocoder = new AMap.Geocoder({
              city: "010"//城市，默认：“全国”
            });
            geocoder.getAddress(positionArray, function (status, result) {
              if (status == 'complete') {
                locationObj.address = result.regeocode.formattedAddress;//定位的详细的地点
                locationObj.city = result.regeocode.addressComponent.city;//城市
                locationObj.district = result.regeocode.addressComponent.district;//市区
                locationObj.street = result.regeocode.addressComponent.street;//路
                locationObj.township = result.regeocode.addressComponent.township;//街道
                locationObj.streetNumber = result.regeocode.addressComponent.streetNumber;//楼号
                fun(locationObj);
                console.log('根据经纬度来获取定位地点返回的数据：');
                console.log(result);
                console.log('根据经纬度来获取定位地点的的各种信息:');
                console.log(locationObj);
              } else {
                console.log('根据经纬度来获取定位地点失败！');
              }
            })
          });
        }, function (err) {
          $ionicLoading.hide();
          fun(locationObj);
          $ionicPopup.alert({
            title: '定位失败，请重试！'
          });
        });

    }

    //通过浏览器和Ip来实现定位获取详细的街道和市区信息
    function getAddressByBrowserOrIp(fun) {

      var geolocation;

      AMap.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition: 'RB'
        });

        geolocation.getCurrentPosition();

        AMap.event.addListener(geolocation, 'complete', function (data) {
          var position = [];
          position[0] = data.position.getLng();
          position[1] = data.position.getLat();
          AMap.plugin('AMap.Geocoder', function () {
            var geocoder = new AMap.Geocoder({
              city: "010"//城市，默认：“全国”
            });
            geocoder.getAddress(position, function (status, result) {
              if (status == 'complete') {
                var locationObj = {};
                locationObj.district = result.regeocode.addressComponent.city + result.regeocode.addressComponent.district;
                locationObj.street = result.regeocode.addressComponent.street;
                fun(locationObj);
                console.log(result);
              } else {
                console.log('获取地理位置信息失败！' + status + result);
              }
            })
          });
          if (data.accuracy) {
            console.log('精度：' + data.accuracy + ' 米');
          }//如为IP精确定位结果则没有精度信息
          console.log('是否经过偏移：' + (data.isConverted ? '是' : '否'));
        });//返回定位信息

        AMap.event.addListener(geolocation, 'error', function (data) {
          var defaultPosition = [120.41317, 36.07705];
          console.log('定位失败');
          AMap.plugin('AMap.Geocoder', function () {
            var geocoder = new AMap.Geocoder({
              city: "010"//城市，默认：“全国”
            });
            geocoder.getAddress(defaultPosition, function (status, result) {
              if (status == 'complete') {
                var locationObj = {};
                locationObj.district = result.regeocode.addressComponent.city + result.regeocode.addressComponent.district;
                locationObj.street = result.regeocode.addressComponent.street;
                fun(locationObj);
                console.log(result);
              } else {
                console.log('获取地理位置信息失败！' + status + result);
              }
            })
          });
        });
      });
    }

  }
})();
