(function () {
  'use strict';

  angular
    .module('app.map')
    .controller('MapController', MapController);

  MapController.$inject = ['CommonMapService', 'MapService', '$ionicPopup', 'AddAssessmentMapService', '$state', '$scope'];

  /** @ngInject */
  function MapController(CommonMapService, MapService, $ionicPopup, AddAssessmentMapService, $state, $scope) {

    var vm = this;
    vm.title = '地图查询';

    //查询条件
    vm.queryCriteria = {
      type: '',
      keyword: ''
    };

    //地图最下方显示的市区
    vm.district = '';

    vm.accountList = [
      {id: '0', account: '公厕', selected: true, code: 'gongche'},
      {id: '1', account: '道路', selected: true, code: 'daolu'},
      {id: '2', account: '车辆', selected: true, code: 'cheliang'},
      {id: '3', account: '收集站', selected: true, code: 'shoujizhan'},
      {id: '4', account: '过街天桥', selected: true, code: 'guojietianqiao'},
      {id: '5', account: '全部', selected: true, code: 'all'}
    ];


    vm.map;
    vm.marker;
    vm.cluster;
    vm.markerPerson;
    vm.circle;
    vm.markers = [];

    vm.centerPositionNum = 0;

    vm.mapPositionObj = {};

    vm.fun = {
      getAccountsPositionData: getAccountsPositionData,
      updateCheckBoxStatus: updateCheckBoxStatus
    }


    activate();


    function activate() {
      initMap();
    }


    //初始化地图
    function initMap() {
      vm.map = CommonMapService.initMap();
      vm.map.setZoom(17);
      vm.markerPerson = new AMap.Marker();
      CommonMapService.getCoordinateInfo(function (data) {
        vm.map.setCenter(data);
        vm.markerPerson.setPosition(data);
        vm.map.setZoom(17);
        vm.markerPerson.setMap(vm.map);
        CommonMapService.getLocationByLatitudeAndLongitude(data, function (res) {
          vm.district = res.district;
          $scope.$apply();
        });
        console.log(vm.district);
        // vm.circle = new AMap.Circle({
        //   // center: new AMap.LngLat("116.403322", "39.920255"),// 圆心位置
        //   center: data,// 圆心位置
        //   radius: 50, //半径
        //   strokeColor: "#F85C5C", //线颜色
        //   strokeOpacity: 1, //线透明度
        //   strokeWeight: 0, //线粗细度
        //   fillColor: "#F85C5C", //填充颜色
        //   fillOpacity: 0.35//填充透明度
        // });
        // vm.circle.setMap(vm.map);
      });
    }


    //
    //   if (vm.mapPositionObj.roadPositionArray.length <= 0) {
    //     //当roadPositionArray.length数量小于等于0的时候，说明道路的坐标没有，
    //     // 代表着这是一个具体的设施（比如山东路某个公厕，具体到了地址），不是道路
    //     // var icon = new AMap.Icon({
    //     //   image: '../assets/global/map/position.png',//24px*24px
    //     //   //icon可缺省，缺省时为默认的蓝色水滴图标，
    //     //   size: new AMap.Size(32, 32)
    //     // });
    //
    //     vm.marker = new AMap.Marker({
    //       position: vm.mapPositionObj.position,
    //       // icon: new AMap.Icon({
    //       //   // size: new AMap.Size(32, 32),  //图标大小
    //       //   // content: '<img src="/www/assets/global/img/location.png" />',
    //       //   icon: "/www/assets/global/map/100.png",
    //       //   imageOffset: new AMap.Pixel(0,0)
    //       // })
    //       // icon: icon,
    //       offset: new AMap.Pixel(0, 0)
    //     });
    //
    //     vm.marker.setMap(vm.map);
    //     vm.map.setCenter(vm.mapPositionObj.position);
    //   } else {
    //     vm.polyline = new AMap.Polyline({
    //       path: vm.mapPositionObj.roadPositionArray,
    //       strokeColor: "#1C8B08",
    //       strokeWeight: 5
    //     });
    //     // 添加到地图中
    //     vm.polyline.setMap(vm.map);
    //     vm.map.setZoom(17);
    //     vm.centerPositionNum = parseInt(vm.mapPositionObj.roadPositionArray.length / 2);
    //     vm.map.setCenter(vm.mapPositionObj.roadPositionArray[centerPositionNum]);
    //   }
    //
    //   // CommonMapService.getCoordinateInfo(function (data) {
    //   //   vm.markerPerson.setPosition(data);
    //   //   vm.markerPerson.setMap(vm.map);
    //   // });
    // }


    //根据查询条件查询数据
    function getMapData(queryCriteria) {
      initMap();
      MapService.getAccountList(queryCriteria, function (resData) {
          vm.mapPositionObj = resData[0];
          if (vm.mapPositionObj) {

            if (vm.mapPositionObj.guojietianqiao) {
              for (var x in vm.mapPositionObj.guojietianqiao) {
                var infoObj = {
                  type: 'guojietianqiao',
                  bridgeName: vm.mapPositionObj.guojietianqiao[x].bridgeName,
                  areaId: vm.mapPositionObj.guojietianqiao[x].areaId,
                  cleanLevel: vm.mapPositionObj.guojietianqiao[x].cleanLevel,
                  startEnd: vm.mapPositionObj.guojietianqiao[x].startEnd,
                  obj: vm.mapPositionObj.guojietianqiao[x]
                }
                var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.guojietianqiao[x].point);
                if (position.length > 0) {
                  position = position[0];
                  console.log('过街天桥');
                  console.log(position);
                }
                var footbridgeMarker = new AMap.Marker({
                  position: position,
                  extData: infoObj,
                  clickable: true,
                  content: '<div style="background-color: rgba(0,0,0,0.5); height: 24px; width: 24px; border: 1px solid rgba(152,152,152, 0.4); border-radius: 12px; box-shadow: rgb(152,152,152) 0px 0px 1px;"></div>',
                  offset: new AMap.Pixel(-15, -15),
                  map: vm.map
                });

                AMap.event.addListener(footbridgeMarker, 'touchend', function (e) {
                  alert('marker的点击事件可以实现！');
                  openInfo(e);
                })

                vm.markers.push(footbridgeMarker);
              }
            }

            if (vm.mapPositionObj.shoujizhan) {
              for (var x in vm.mapPositionObj.shoujizhan) {
                var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.shoujizhan[x].point);
                var infoObj = {
                  type: 'shoujizhan',
                  RCPsname: vm.mapPositionObj.shoujizhan[x].RCPsname,
                  areaid: vm.mapPositionObj.shoujizhan[x].areaid,
                  belongsStreet: vm.mapPositionObj.shoujizhan[x].belongsStreet,
                  site: vm.mapPositionObj.shoujizhan[x].site,
                  obj: vm.mapPositionObj.shoujizhan[x]
                }
                if (position.length > 0) {
                  position = position[0];
                  console.log('收集站');
                  console.log(position);
                }
                vm.markers.push(new AMap.Marker({
                  position: position,
                  extData: infoObj,
                  content: '<div style="background-color: rgba(22,141,202,0.5); height: 24px; width: 24px; border: 1px solid rgba(22,141,202,0.4); border-radius: 12px; box-shadow: rgb(22,141,202) 0px 0px 1px;"></div>',
                  offset: new AMap.Pixel(-15, -15),
                  map: vm.map
                }).on('touchend', openInfo));
              }
            }

            if (vm.mapPositionObj.gongche) {
              for (var x in vm.mapPositionObj.gongche) {
                var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.gongche[x].point);
                var infoObj = {
                  type: 'gongche',
                  toiletName: vm.mapPositionObj.gongche[x].toiletName,
                  areaId: vm.mapPositionObj.gongche[x].areaId,
                  toiletLocation: vm.mapPositionObj.gongche[x].toiletLocation,
                  belongsStreet: vm.mapPositionObj.gongche[x].belongsStreet,
                  obj: vm.mapPositionObj.gongche[x]
                }
                if (position.length > 0) {
                  position = position[0];
                  console.log('公厕');
                  console.log(position);
                }
                vm.markers.push(new AMap.Marker({
                  position: position,
                  extData: infoObj,
                  content: '<div style="background-color: rgba(154,91,179,0.5); height: 24px; width: 24px; border: 1px solid rgba(154,91,179, 0.4); border-radius: 12px; box-shadow: rgb(154,91,179) 0px 0px 1px;"></div>',
                  offset: new AMap.Pixel(-15, -15),
                  map: vm.map
                }).on('touchstart', openInfo));
              }
            }

            if (vm.mapPositionObj.daolu) {
              for (var x in vm.mapPositionObj.daolu) {
                var infoObj = {
                  type: 'daolu',
                  roadName: vm.mapPositionObj.daolu[x].roadName,
                  areaId: vm.mapPositionObj.daolu[x].areaId,
                  cleanLevel: vm.mapPositionObj.daolu[x].cleanLevel,
                  primaryOrSecondary: vm.mapPositionObj.daolu[x].primaryOrSecondary,
                  obj: vm.mapPositionObj.daolu[x]
                }
                var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.daolu[x].point);
                var polyline = new AMap.Polyline({
                  path: position,
                  extData: infoObj,
                  strokeColor: "#1C8B08",
                  strokeWeight: 5,
                  map: vm.map
                }).on('click', openInfo);
                // AMap.event.addListener(polyline, "click", function (e) {
                //   openInfo(e);
                // });
              }
            }

            if (vm.mapPositionObj.cheliang) {
              for (var x in vm.mapPositionObj.cheliang) {
                var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.cheliang[x].point);
                var infoObj = {
                  type: 'cheliang',
                  name: vm.mapPositionObj.cheliang[x].plateNo,
                  vehicleType: vm.mapPositionObj.cheliang[x].vehicleType,
                  VehicleModelType: vm.mapPositionObj.cheliang[x].VehicleModelType,
                  vehicleFirstType: vm.mapPositionObj.cheliang[x].vehicleFirstType,
                  obj: vm.mapPositionObj.cheliang[x]
                }
                if (position.length > 0) {
                  position = position[0]
                }
                vm.markers.push(new AMap.Marker({
                  position: position,
                  extData: infoObj,
                  content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                  offset: new AMap.Pixel(-15, -15),
                  map: vm.map
                }).on('touchend', openInfo));
              }
            }

            //初始化点聚合
            addCluster(0);

          }
        }
      )
    }


    //弹出提示窗口
    function openInfo(e) {
      var info = [];
      var title = '';
      var type = e.target.getExtData().type;
      console.log(e);
      switch (e.target.getExtData().type) {
        case 'guojietianqiao':
          // info.push("<div><div>" + '名称：' + e.target.getExtData().bridgeName + "</div>");
          info.push("<div><div>" + '所属市区：' + e.target.getExtData().areaId + "</div>");
          info.push("<div>" + '起始位置：' + e.target.getExtData().startEnd + "</div>");
          info.push("<div>" + '保洁等级：' + e.target.getExtData().cleanLevel + "</div></div>");
          info.push("<div><a class='checkMapDetails'>点击此处查看详情</a></div></div>");
          title = e.target.getExtData().bridgeName;
          break;
        case 'shoujizhan':
          // info.push("<div><div>" + '名称：' + e.target.getExtData().RCPsname + "</div>");
          info.push("<div><div>" + '所属区域：' + e.target.getExtData().areaid + "</div>");
          info.push("<div>" + '所属街道：' + e.target.getExtData().belongsStreet + "</div>");
          info.push("<div>" + '地点：' + e.target.getExtData().site + "</div></div>");
          info.push("<div><a class='checkMapDetails'>点击此处查看详情</a></div></div>");
          title = e.target.getExtData().RCPsname;
          break;
        case 'gongche':
          // info.push("<div><div>" + '名称：' + e.target.getExtData().toiletName + "</div>");
          info.push("<div><div>" + '所属区域：' + e.target.getExtData().areaId + "</div>");
          info.push("<div>" + '公厕位置：' + e.target.getExtData().toiletLocation + "</div>");
          info.push("<div>" + '所属街道：' + e.target.getExtData().belongsStreet + "</div></div>");
          info.push("<div><a class='checkMapDetails'>点击此处查看详情</a></div></div>");
          title = e.target.getExtData().toiletName;
          break;
        case 'cheliang':
          // info.push("<div><div>" + '车牌号：' + e.target.getExtData().name + "</div>");
          info.push("<div><div>" + '车辆型号：' + e.target.getExtData().VehicleModelType + "</div>");
          info.push("<div>" + '车辆大类：' + e.target.getExtData().vehicleFirstType + "</div>");
          info.push("<div>" + '车辆类型：' + e.target.getExtData().vehicleType + "</div>");
          info.push("<div><a class='checkMapDetails'>点击此处查看详情</a></div></div>");
          title = e.target.getExtData().name;
          break;
        case 'daolu':
          info.push("<div><div>" + '所属区域：' + e.target.getExtData().areaId + "</div>");
          info.push("<div>" + '保洁等级：' + e.target.getExtData().cleanLevel + "</div>");
          info.push("<div>" + '主次干道：' + e.target.getExtData().primaryOrSecondary + "</div>");
          info.push("<div><a class='checkMapDetails'>点击此处查看详情</a></div></div>");
          title = e.target.getExtData().roadName;
          break;
        default:
          break;

      }
      //构建信息窗体中显示的内容
      // var infoWindow = new AMap.InfoWindow({
      //   autoMove: true,
      //   content: info.join("<br/>") //使用默认信息窗体框样式，显示信息内容
      // });
      // infoWindow.open(vm.map, e.target.getPosition());
      // infoWindow.get$InfoBody().on('click', '.checkMapDetails', function (event) {
      //   //阻止冒泡
      //   event.stopPropagation();
      //   openDetailsPage(e.target.getExtData(), e.target.getExtData().type);
      // });
      AMapUI.loadUI(['overlay/SimpleInfoWindow'], function (SimpleInfoWindow) {

        var infoWindow = new SimpleInfoWindow({
          autoMove: true,
          infoTitle: '<strong>' + title + '</strong>',
          infoBody: info.join("<br/>")
        });

        infoWindow.get$InfoBody().on('click', '.checkMapDetails', function (event) {
          //阻止冒泡
          event.stopPropagation();

          openDetailsPage(e.target.getExtData().obj, e.target.getExtData().type);
        });

        switch (type) {
          case 'daolu':
            infoWindow.open(vm.map, e.lnglat);
            break;
          default:
            infoWindow.open(vm.map, e.target.getPosition());
            break;
        }
      });

    }


    function addCluster(tag) {
      if (vm.cluster) {
        vm.cluster.setMap(null);
      }
      if (tag == 1) {//自定义图标
        var sts = [{
          url: "http://a.amap.com/jsapi_demos/static/images/blue.png",
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -16)
        }, {
          url: "http://a.amap.com/jsapi_demos/static/images/green.png",
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -16)
        }, {
          url: "http://a.amap.com/jsapi_demos/static/images/orange.png",
          size: new AMap.Size(36, 36),
          offset: new AMap.Pixel(-18, -18)
        }, {
          url: "http://a.amap.com/jsapi_demos/static/images/red.png",
          size: new AMap.Size(48, 48),
          offset: new AMap.Pixel(-24, -24)
        }, {
          url: "http://a.amap.com/jsapi_demos/static/images/darkRed.png",
          size: new AMap.Size(48, 48),
          offset: new AMap.Pixel(-24, -24)
        }];
        vm.cluster = new AMap.MarkerClusterer(vm.map, vm.markers, {
          styles: sts,
          gridSize: 80
        });
      } else {//默认样式
        vm.cluster = new AMap.MarkerClusterer(vm.map, vm.markers, {gridSize: 80});
        console.log('点聚合已经走完哈哈');
      }
    }

    //根据台帐获取对应的台帐定位信息
    function getAccountsPositionData() {
      console.log(vm.accountList);
      vm.queryCriteria.type = '';
      for (var i = 0; i < 5; i++) {
        if (vm.accountList[i].selected) {
          vm.queryCriteria.type += vm.accountList[i].code + ',';
          console.log(vm.queryCriteria);
        }
      }

      if (vm.queryCriteria.type.length > 0) {
        if (vm.queryCriteria.type.split(',').length == 6) {
          $ionicPopup.confirm({
            title: '提示',
            template: '查询全部可能会导致等待时间很长，要继续么？',
            buttons: [{
              text: '取消',
              type: 'button-positive'
            }, {
              text: '确认',
              type: 'button-calm'
            }]
          }).then(function (res) {
            if (res) {
              vm.queryCriteria.type = '';
              console.log(vm.queryCriteria.type);
              var query = vm.queryCriteria;
              // MapService.getAccountList(query, function (resData) {
              //   vm.mapPositionObj = resData;
              // })
              getMapData(query);
            } else {
              return;
            }
          });
        } else {
          vm.queryCriteria.type = vm.queryCriteria.type.substring(0, vm.queryCriteria.type.length - 1);
          console.log(vm.queryCriteria.type);
          console.log(vm.queryCriteria.type);
          var query = vm.queryCriteria;
          // MapService.getAccountList(query, function (resData) {
          //   vm.mapPositionObj = resData;
          // })
          getMapData(query);
        }
      } else {
        $ionicPopup.alert({
          title: '提示',
          template: '请先选择要查询的类型'
        });
      }
    }


    function updateCheckBoxStatus() {
      if (vm.accountList[5].selected) {
        for (var i = 0; i < 5; i++) {
          vm.accountList[i].selected = true;
        }
      } else {
        for (var i = 0; i < 5; i++) {
          vm.accountList[i].selected = false;
        }
      }
    }


    function openDetailsPage(data, type) {
      console.log(data);
      console.log(type);
      $state.go('accountDetails', {accountData: data, code: type});
    }
  }
})();
