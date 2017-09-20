(function () {
  'use strict';

  angular
    .module('app.map')
    .controller('MapController', MapController);

  MapController.$inject = ['CommonMapService', 'MapService', '$ionicPopup', 'AddAssessmentMapService'];

  /** @ngInject */
  function MapController(CommonMapService, MapService, $ionicPopup, AddAssessmentMapService) {

    var vm = this;
    vm.title = '地图查询';

    //查询条件
    vm.queryCriteria = {
      type: '',
      keyword: ''
    };

    vm.allCheck = {account: '全部', selected: true, code: ''};

    vm.accountList = [
      {id: '0', account: '公厕', selected: true, code: 'gongche'},
      {id: '1', account: '道路', selected: true, code: 'jiedao'},
      {id: '2', account: '车辆', selected: true, code: 'cheliang'},
      {id: '3', account: '垃圾桶', selected: true, code: 'lajitong'},
      {id: '4', account: '收集站', selected: true, code: 'shoujizhan'},
      {id: '5', account: '过街天桥', selected: true, code: 'guojietianqiao'}
    ];


    vm.map;
    vm.marker;
    vm.cluster;
    vm.markerPerson;
    vm.circle;
    vm.polyline;
    vm.markers = [];

    vm.centerPositionNum = 0;

    vm.mapPositionObj = {};

    vm.fun = {
      getAccountsPositionData: getAccountsPositionData
    }


    activate();


    function activate() {

      initMap();

      MapService.getAccountList(vm.queryCriteria, function (resData) {
        vm.mapPositionObj = resData[0];
        // if (vm.mapPositionObj) {
        //   if (vm.mapPositionObj.cheliang) {
        //     for (var x in vm.mapPositionObj.cheliang) {
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.cheliang[x].point);
        //       var infoObj = {
        //         name: vm.mapPositionObj.cheliang[x].plateNo
        //       }
        //       if (position.length > 0) {
        //         position = position[0]
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //   if (vm.mapPositionObj.congxizuoye) {
        //     for (var x in vm.mapPositionObj.congxizuoye) {
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.congxizuoye[x].point);
        //       var infoObj = {
        //         name: vm.mapPositionObj.congxizuoye[x].plateId
        //       }
        //       if (position.length > 0) {
        //         position = position[0]
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //   if (vm.mapPositionObj.daolu) {
        //     for (var x in vm.mapPositionObj.daolu) {
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.daolu[x].point);
        //       vm.polyline = new AMap.Polyline({
        //         path: position,
        //         strokeColor: "#1C8B08",
        //         strokeWeight: 5
        //       });
        //       // 添加到地图中
        //       vm.polyline.setMap(vm.map);
        //     }
        //   }
        //   if (vm.mapPositionObj.gongche) {
        //     for (var x in vm.mapPositionObj.gongche) {
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.gongche[x].point);
        //       var infoObj = {
        //         name: vm.mapPositionObj.gongche[x].toiletName
        //       }
        //       if (position.length > 0) {
        //         position = position[0]
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //   if (vm.mapPositionObj.guojietianqiao) {
        //     for (var x in vm.mapPositionObj.guojietianqiao) {
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.guojietianqiao[x].point);
        //       var infoObj = {
        //         name: vm.mapPositionObj.guojietianqiao[x].bridgeName
        //       }
        //       if (position.length > 0) {
        //         position = position[0];
        //         console.log('收集站');
        //         console.log(position);
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //   if (vm.mapPositionObj.jishaozuoye) {
        //     for (var x in vm.mapPositionObj.jishaozuoye) {
        //       var infoObj = {
        //         name: vm.mapPositionObj.jishaozuoye[x].plateId
        //       }
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.jishaozuoye[x].point);
        //       if (position.length > 0) {
        //         position = position[0];
        //         console.log('过街天桥');
        //         console.log(position);
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //   if (vm.mapPositionObj.jixiezuoye) {
        //     for (var x in vm.mapPositionObj.jixiezuoye) {
        //       var infoObj = {
        //         name: vm.mapPositionObj.jixiezuoye[x].operateVehicle
        //       }
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.jixiezuoye[x].point);
        //       if (position.length > 0) {
        //         position = position[0];
        //         console.log('过街天桥');
        //         console.log(position);
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //
        //   if (vm.mapPositionObj.lajitong) {
        //     for (var x in vm.mapPositionObj.lajitong) {
        //       var infoObj = {
        //         name: vm.mapPositionObj.lajitong[x].trashArea
        //       }
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.lajitong[x].point);
        //       if (position.length > 0) {
        //         position = position[0];
        //         console.log('过街天桥');
        //         console.log(position);
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //
        //   if (vm.mapPositionObj.shashuizuoye) {
        //     for (var x in vm.mapPositionObj.shashuizuoye) {
        //       var infoObj = {
        //         name: vm.mapPositionObj.shashuizuoye[x].plateId
        //       }
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.shashuizuoye[x].point);
        //       if (position.length > 0) {
        //         position = position[0];
        //         console.log('过街天桥');
        //         console.log(position);
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //
        //   if (vm.mapPositionObj.shoujizhan) {
        //     for (var x in vm.mapPositionObj.shoujizhan) {
        //       var infoObj = {
        //         name: vm.mapPositionObj.shashuizuoye[x].site
        //       }
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.shoujizhan[x].point);
        //       if (position.length > 0) {
        //         position = position[0];
        //         console.log('过街天桥');
        //         console.log(position);
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        //
        //   if (vm.mapPositionObj.shouyunzuoye) {
        //     for (var x in vm.mapPositionObj.shouyunzuoye) {
        //       var infoObj = {
        //         name: vm.mapPositionObj.shouyunzuoye[x].operatePlate
        //       }
        //       var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.shouyunzuoye[x].point);
        //       if (position.length > 0) {
        //         position = position[0];
        //         console.log('过街天桥');
        //         console.log(position);
        //       }
        //       vm.markers.push(new AMap.Marker({
        //         position: position,
        //         extData: infoObj,
        //         content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        //         offset: new AMap.Pixel(-15, -15)
        //       }).on('click', openInfo));
        //     }
        //   }
        // }
        // //初始化点聚合
        // addCluster(0);
        if (vm.mapPositionObj) {
          if (vm.mapPositionObj.daolu) {
            for (var x in vm.mapPositionObj.daolu) {
              var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.daolu[x].point);
              vm.polyline = new AMap.Polyline({
                path: position,
                strokeColor: "#1C8B08",
                strokeWeight: 5
              });
              // 添加到地图中
              vm.polyline.setMap(vm.map);
            }
          }

          if (vm.mapPositionObj.guojietianqiao) {
            for (var x in vm.mapPositionObj.guojietianqiao) {
              var infoObj = {
                name: vm.mapPositionObj.guojietianqiao[x].bridgeName
              }
              var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.guojietianqiao[x].point);
              if (position.length > 0) {
                position = position[0];
                console.log('过街天桥');
                console.log(position);
              }
              new AMap.Marker({
                position: position,
                extData: infoObj,
                content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                offset: new AMap.Pixel(-15, -15),
                map: vm.map
              }).on('click', openInfo);
            }
          }

          if (vm.mapPositionObj.shoujizhan) {
            for (var x in vm.mapPositionObj.shoujizhan) {
              var position = AddAssessmentMapService.getPositionArray(vm.mapPositionObj.shoujizhan[x].point);
              var infoObj = {
                name: vm.mapPositionObj.shoujizhan[x].RCPsname
              }
              if (position.length > 0) {
                position = position[0];
                console.log('收集站');
                console.log(position);
              }
              new AMap.Marker({
                position: position,
                extData: infoObj,
                content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                offset: new AMap.Pixel(-15, -15),
                map: vm.map
              }).on('click', openInfo);
            }
          }
        }
      })
    }

    function openInfo(e) {
      //构建信息窗体中显示的内容
      var info = [];
      info.push("<div>" + e.target.getExtData().name + "</div>");
      var infoWindow = new AMap.InfoWindow({
        content: info.join("<br/>") //使用默认信息窗体框样式，显示信息内容
      });
      infoWindow.open(vm.map, e.target.getPosition());
    }

    function initMap() {
      vm.map = CommonMapService.initMap();
      vm.map.setZoom(17);
      vm.markerPerson = new AMap.Marker();
      CommonMapService.getCoordinateInfo(function (data) {
        vm.map.setCenter(data);
        vm.markerPerson.setPosition(data);
        vm.map.setZoom(17);
        vm.markerPerson.setMap(vm.map);
        vm.circle = new AMap.Circle({
          // center: new AMap.LngLat("116.403322", "39.920255"),// 圆心位置
          center: data,// 圆心位置
          radius: 50, //半径
          strokeColor: "#F85C5C", //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 0, //线粗细度
          fillColor: "#F85C5C", //填充颜色
          fillOpacity: 0.35//填充透明度
        });
        vm.circle.setMap(vm.map);
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

    function refreshMyPosition() {
      CommonMapService.getCoordinateInfo(function (data) {
        vm.markerPerson.setPosition(data);
        vm.map.setZoom(13);
        vm.markerPerson.setMap(vm.map);
        vm.map.setCenter(data);
      });
    }

    function refreshRoadOrInstallationPosition() {
      // if (vm.mapPositionObj.roadPositionArray.length <= 0) {
      //   vm.map.setCenter(vm.mapPositionObj.position);
      // } else {
      //   vm.map.setCenter(vm.mapPositionObj.roadPositionArray[centerPositionNum]);
      // }
    }


    //点击除All按钮的时候,all按钮为false
    function unSelectedAllCheck() {
      vm.accountList[0].selected = false;
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
    // function getAccountsPositionData() {
    //
    //   console.log(vm.accountList);
    //
    //   var selected = false;
    //   var x;
    //   for (x in vm.accountList) {
    //     selected = selected || vm.accountList[x].selected;
    //   }
    //   if (!selected) {
    //     $ionicPopup.alert({
    //       title: '提示',
    //       template: '请至少选择一项'
    //     }).then(function (res) {
    //       return;
    //     });
    //   } else {
    //     var querySelected = true;
    //     var x;
    //     for (x in vm.accountList) {
    //       querySelected = querySelected && vm.accountList[x].selected;
    //     }
    //
    //     if (querySelected) {
    //       vm.queryCriteria.type = '';
    //     } else {
    //       var x;
    //       for (x in vm.accountList) {
    //         vm.queryCriteria.type += vm.accountList[x].code + ',';
    //       }
    //       vm.queryCriteria.type = vm.queryCriteria.type.substring(0, vm.queryCriteria.type - 1);
    //     }
    //
    //     MapService.getAccountList(vm.queryCriteria, function (resData) {
    //       vm.mapPositionObj = resData;
    //     })
    //   }
    //


    //根据台帐获取对应的台帐定位信息
    function getAccountsPositionData() {
      console.log(vm.accountList);
      vm.queryCriteria.type = '';
      for (var x in vm.accountList) {
        if (vm.accountList[x].selected) {
          vm.queryCriteria.type += vm.accountList[x].code + ',';
          console.log(vm.queryCriteria);
        }
      }
      if (vm.queryCriteria.type.split(',').length == 6) {
        vm.queryCriteria.type = '';
      } else {
        vm.queryCriteria.type = vm.queryCriteria.type.substring(0, vm.queryCriteria.type.length - 1);
        console.log(vm.queryCriteria.type);
      }
      console.log(vm.queryCriteria.type);
      var query = vm.queryCriteria;
      MapService.getAccountList(query, function (resData) {
        vm.mapPositionObj = resData;
      })
    }

  }
})();
