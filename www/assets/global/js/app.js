(function () {
  'use strict';
  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  // 'starter.services' is found in services.js
  // 'starter.controllers' is found in controllers.js
  angular.module('app', [
    'ionic',
    'ngStorage',
    'ngFileUpload',
    'ng-echarts',
    'ngCordova',
    'app.login',
    'app.home',
    'app.savedData',
    'app.waitForWork',
    'app.assessment',
    'app.planDetails',
    'app.assessmentStatus',
    'app.assessmentStatusDetails',
    'app.addAssessment',
    'app.addAssessmentMap',
    'app.gridCheck',
    'app.gridCheckMap',
    'app.problemFeedback',
    'app.problemFeedbackDetails',
    'app.account',
    'app.accountDetails',
    'app.history',
    'app.map',
    'app.appReceivedMessage',
    'app.messageContent',
    'app.setting',
    'app.setNet',
    'app.commonHttpService',
    'app.commonMap'
  ])
    .run(run)
    .config(config)
    .constant('SYS_INFO', {
      // TODO: 数据访问服务地址（此处定义了手机应用获取数据的服务地址，需要修改成项目实际的地址）
      // TODO: 注意：手机应用发布之前需要修改为生产环境发布的数据服务地址
      'SERVER_PATH': 'http://172.72.100.61',
      'SERVER_PORT': '8090',
      'VERSION': '1.0.0',
      // TODO: 数据小数位数（统一设置手机应用中数据的小数位数，可以根据实际情况修改）
      'DIGITS': 2
    })
    .controller('AppController', AppController);

  AppController.$inject['$scope', 'SYS_INFO', '$rootScope', '$interval', '$http', ' $ionicHistory', '$state', 'LoginService'];

  function AppController($scope, SYS_INFO, $rootScope, $interval, $http, $ionicHistory, $state, LoginService) {
    $rootScope.unReadMsgCount = 0;
    $rootScope.goBack = goBack;
    $rootScope.toMessagePage = toMessagePage;

    var messageApi = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/AppMessage/findMsgByUserId.action?userId=' + 123;

    LoginService.setServerInfo();

    var timer = $interval(function () {
      $http.get(messageApi).then(function (response) {
        if (response.data.success == 1) {
          $rootScope.unReadMsgCount = response.data.data.count;
        } else {
        }
      }, function (response) {
      })
    }, 1000 * 60 * 5);

    timer.then(success, error, defaults);

    function success() {
      console.log("done");
      console.log($rootScope.unReadMsgCount);
    }

    function error() {
      console.log("循环获取获取消息error");
    }

    function defaults() {

    }

    function goBack() {
      $ionicHistory.goBack();
    }

    function toMessagePage() {
      $state.go('recMessage');
    }
  }

  run.$inject = [
    '$rootScope',
    '$location',
    '$ionicPlatform',
    '$ionicHistory',
    '$ionicPopup'
  ];

  function run($rootScope,
               $location,
               $ionicPlatform,
               $ionicHistory,
               $ionicPopup) {

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if (window.codePush) {
        var updateInfoMsg;
        $rootScope.downloadMsg = '';

        var onError = function (error) {
          updateInfoMsg.close();
          $ionicPopup.alert({
            title: '更新提示',
            template: '更新失败！'
          });
        };

        var onInstallSuccess = function () {
          updateInfoMsg.close();
          $ionicPopup.alert({
            title: '更新提示',
            template: '更新成功！'
          }).then(function () {
            codePush.restartApplication();
          });
        };

        var toFix = function (val) {
          return (val / 1024).toFixed(2);
        };

        var onProgress = function (downloadProgress) {
          $rootScope.downloadMsg = toFix(downloadProgress.receivedBytes) + 'kb 共' + toFix(downloadProgress.totalBytes) + 'kb';
        };

        var onPackageDownloaded = function (localPackage) {
          localPackage.install(onInstallSuccess, onError, {
            installMode: InstallMode.ON_NEXT_RESUME,
            minimumBackgroundDuration: 120,
            mandatoryInstallMode: InstallMode.ON_NEXT_RESTART
          });
        };

        var onUpdateCheck = function (remotePackage) {
          if (remotePackage && !remotePackage.failedInstall) {
            $ionicPopup.confirm({
              title: '更新提示',
              template: '有可用的新版本，是否需要更新？',
              cancelText: '否',
              okText: '是'
            }).then(function (res) {
              if (res) {
                updateInfoMsg = $ionicPopup.show({
                  template: '<span>正在下载 {{downloadMsg}}</span>',
                  scope: $rootScope,
                  title: '更新提示'
                });
                remotePackage.download(onPackageDownloaded, onError, onProgress);
              }
            });
          }
        };

        window.codePush.checkForUpdate(onUpdateCheck, onError);
      }
    });

    // $rootScope.$on('$stateChangeStart', function(event, next) {
    //   if (next.name !== 'login') {
    //     if (!Session.isAuthenticated()) {
    //       $location.path('/login');
    //     }
    //   }
    // });

    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function (e) {
      e.preventDefault();
      // Is there a page to go back to?
      var path = $location.path();
      if (path === '/homePageNew' || path === '/login') {
        ionic.Platform.exitApp();
      } else if ($ionicHistory.backView) {
        // Go back in history
        $ionicHistory.goBack();
      } else {
        ionic.Platform.exitApp();
      }

      return false;
    }, 101);
  }

  // 配置模块，控制不同平台的兼容性
  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $urlRouterProvider.otherwise('/login');
  }

})();

(function () {
  'use strict';

  angular.module('app.account', []);
})();

(function () {
  'use strict';

  angular.module('app.assessment', []);
})();

(function () {
  'use strict';

  angular.module('app.gridCheck', []);
})();

(function () {
  'use strict';

  angular.module('app.history', []);
})();

(function () {
  'use strict';

  angular.module('app.home',[]);
})();

(function () {
  'use strict';

  angular.module('app.login', []);
})();

(function () {
  'use strict';

  angular.module('app.map', []);
})();

(function () {
  'use strict';

  angular.module('app.appReceivedMessage', []);
})();

(function () {
  'use strict';

  angular.module('app.problemFeedback', []);
})();

(function () {
  'use strict';

  angular.module('app.setting', []);
})();

(function () {
  'use strict';

  angular.module('app.waitForWork', []);
})();

(function () {
  'use strict';

  angular.module('app.setNet', []);
})();

(function () {
  'use strict';

  angular.module('app.accountDetails', []);
})();

(function () {
  'use strict';

  angular.module('app.addAssessment', []);
})();

(function () {
  'use strict';

  angular.module('app.assessmentStatus', []);
})();

(function () {
  'use strict';

  angular.module('app.assessmentStatusDetails', []);
})();

(function () {
  'use strict';

  angular.module('app.planDetails', []);
})();

(function () {
  'use strict';

  angular.module('app.commonHttpService', []);
})();

(function () {
  'use strict';

  angular.module('app.commonMap', []);
})();

(function () {
  'use strict';

  angular.module('app.gridCheckMap', []);
})();

(function () {
  'use strict';

  angular.module('app.savedData',[]);
})();

(function () {
  'use strict';

  angular.module('app.messageContent', []);
})();

(function () {
  'use strict';

  angular.module('app.problemFeedbackDetails', []);
})();

(function () {
  'use strict';

  angular.module('app.addAssessmentMap', []);
})();

(function () {
  'use strict';

  angular
    .module('app.account')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$scope', 'AccountService', '$state'];

  /** @ngInject */
  function AccountController($scope, AccountService, $state) {

    var vm = this;
    vm.title = '环卫台帐';
    vm.optionAll = '{"code":"", "id": "", "name": "全部类型", "subclass": []}';
    vm.queryCriteriaObj = {};
    vm.accountType;
    vm.levelList = [];
    vm.queryCriteria = {
      cityPlace: '',
      accountType: '',
      level: '',
      keyword: ''
    };
    vm.accountList = [];
    vm.fun = {
      updateLevelArrayByType: updateLevelArrayByType,
      getAccountListByQueryCriteria: getAccountListByQueryCriteria,
      toAccountDetails: toAccountDetails
    };


    activate();

    function activate() {
      getQueryCriteriaObj();
    }


    //获取全部区，全部类型，全部子类
    function getQueryCriteriaObj() {
      AccountService.getQueryCriteriaList(function (resData) {
        vm.queryCriteriaObj = resData[0];
      })
    }

    //根据查询条件来查询台帐
    function getAccountListByQueryCriteria() {
      if (vm.accountType && vm.accountType != '') {
        if (vm.accountType == "") {
          vm.queryCriteria.accountType = "";
        } else {
          vm.queryCriteria.accountType = JSON.parse(vm.accountType).code;
        }
      }
      AccountService.getAccountListByQueryCriteria(vm.queryCriteria, function (resData) {
        vm.accountList = resData[0];
      });
    }


    function updateLevelArrayByType(item) {
      if (item) {
        vm.levelList = JSON.parse(item).subclass;
      }
    }

    function toAccountDetails(item, code) {
      $state.go('accountDetails', {accountData: item, code: code});
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.account')
    .config(AccountConfig);

  AccountConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AccountConfig($stateProvider) {
    $stateProvider
      .state('account', {
        url: '/account',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        cache:true,
        templateUrl: 'templates/account/account.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.account')
    .service('AccountService', AccountService);

  AccountService.$inject = ['$http', 'MyHttpService'];

  /** @ngInject */
  function AccountService($http, MyHttpService) {

    var service = {
      getAccountList: getAccountList,
      getAccountListByQueryCriteria: getAccountListByQueryCriteria,
      getQueryCriteriaList: getQueryCriteriaList
    };

    return service;

    function getAccountList(fun) {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }

    function getAccountListByQueryCriteria(queryCriteria,fun) {
      var url = '/hwweb/Ledger/findFacilitiesByCondition.action?areaId=' +
        queryCriteria.cityPlace + '&code=' + queryCriteria.accountType +
        '&subclassId=' + queryCriteria.level + '&name=' + queryCriteria.keyword;
      MyHttpService.getCommonData(url, fun);
    }

    function getQueryCriteriaList(fun) {
      var url = '/hwweb/Ledger/findAllAreaAndItem.action';
      MyHttpService.getCommonData(url, fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.assessment')
    .controller('AssessmentController', AssessmentController);

  AssessmentController.$inject = ['$rootScope', '$scope', '$state', 'AssessmentService'];

  /** @ngInject */
  function AssessmentController($rootScope, $scope, $state, AssessmentService) {

    var vm = this;
    vm.title = '综合考核';
    vm.titleController = {}

    vm.toPlanDetails = toPlanDetails;

    vm.planList = [];


    activate();


    function activate() {
      AssessmentService.getPlanList($rootScope.userId, function (data) {
        vm.planList = data;
      });
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {planDetailsData: item, fromWhere: 'assessment'});
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.assessment')
    .config(AssessmentConfig);

  AssessmentConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AssessmentConfig($stateProvider) {
    $stateProvider
      .state('assessment', {
        url: '/assessment',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/assessment/assessment.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.assessment')
    .service('AssessmentService', AssessmentService);

  AssessmentService.$inject = ['$http', 'SYS_INFO', 'MyHttpService'];

  /** @ngInject */
  function AssessmentService($http, SYS_INFO, MyHttpService) {
    var service = {
      getPlanList: getPlanList
    }


    return service;


    function getPlanList(userId, fun) {
      var path = '/hwweb/Comprehensive/findDataByUserId.action?userId=' + userId;
      MyHttpService.getCommonData(path, fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .controller('GridCheckController', GridCheckController);

  GridCheckController.$inject = ['$rootScope', '$cacheFactory', '$scope', '$state', 'GridCheckService',
    'CommonMapService', '$ionicPopup','$cordovaCamera'];

  /** @ngInject */
  function GridCheckController($rootScope, $cacheFactory, $scope, $state, GridCheckService, CommonMapService,
                               $ionicPopup,$cordovaCamera) {

    var vm = this;
    vm.title = '网格化巡检';
    vm.questionCode = [];
    vm.questionCodeObj = {};
    vm.imgName = '';//图片的名字
    //需要上传的数据
    vm.uploadData = {
      examiner: '',//上传的用户：用户名
      areaName: '',//区市
      streetName: '',//道路名称
      problemCode: '',//扣分项的Id
      problemName: '',//扣分项名称
      description: '',//整改情况
      location: '',//详细地址
      point: [],//坐标
      img: '',//图片的Base64编码字符串数据
    }

    vm.fun = {
      toGridCheckMap: toGridCheckMap,
      takeGridCheckPicture: takeGridCheckPicture,
      getGridCheckLocation: getGridCheckLocation,
      uploadGridCheckData: uploadGridCheckData
    }


    activate();

    function activate() {

      GridCheckService.getGridCheckQuestionCodeArray(function (resData) {
        vm.questionCode = resData;
        vm.questionCodeObj = vm.questionCode[0];
        console.log(vm.questionCode);
      });


    }

    function toGridCheckMap() {
      $state.go('gridCheckMap');
    }

    //拍照
    function takeGridCheckPicture() {

      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 200,
        targetHeight: 200,
        popoverOptions: Camera.PopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {

        var image = document.getElementById('gridCheckImg');
        image.src = "data:image/jpeg;base64," + imageData;
        vm.imgName = moment().format('YYYY-MM-DD HH:mm:ss') + '.jpeg';
        vm.uploadData.img = imageData;
      }, function (err) {
        $ionicPopup.alert({
          title: '照片获取失败，请重新拍照!'
        });
      })
    }


    //获取街道和区域
    function getGridCheckLocation() {
      CommonMapService.getAddressByGPS(function (res) {
        vm.uploadData.areaName = res.district;
        vm.uploadData.streetName = res.street;
        $scope.$apply();
      });
    }


    //上传数据
    function uploadGridCheckData() {
      vm.uploadData.examiner = $rootScope.userName;
      if ($cacheFactory.get("cacheGridCheckMapData")) {
        vm.uploadData.point = $cacheFactory.get("cacheGridCheckMapData").get('position');
        vm.uploadData.address = $cacheFactory.get("cacheGridCheckMapData").get('address');
      }
      vm.uploadData.problemCode = vm.questionCodeObj.id;
      vm.uploadData.problemName = vm.questionCodeObj.name;
      console.log('网格化巡检需要上传的数据：');
      console.log(vm.uploadData);
      if (vm.uploadData.areaName == '') {
        $ionicPopup.alert({
          title: '市区不能为空！'
        }).then();
      } else if (vm.uploadData.streetName == '') {
        $ionicPopup.alert({
          title: '街道不能为空！'
        }).then();
      } else if (vm.uploadData.problemCode == '' || vm.uploadData.problemCode == null) {
        $ionicPopup.alert({
          title: '问题代码不能为空！'
        });
      } else if (vm.uploadData.problemName == '' || vm.uploadData.problemName == null) {
        $ionicPopup.alert({
          title: '问题代码不能为空！'
        });
      } else if (vm.uploadData.point == '' || vm.uploadData.address == '') {
        $ionicPopup.alert({
          title: '详细检查地点不能为空'
        }).then();
      } else {
        var jsonStr = JSON.stringify(vm.uploadData);
        GridCheckService.uploadGridCheckData(jsonStr, function (resData) {

        });
      }

    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .config(GridCheckConfig);

  GridCheckConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function GridCheckConfig($stateProvider) {
    $stateProvider
      .state('gridCheck', {
        url: '/gridCheck',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        cache: false,
        templateUrl: 'templates/gridCheck/gridCheck.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .service('GridCheckService', GridCheckService);

  GridCheckService.$inject = ['MyHttpService'];

  /** @ngInject */
  function GridCheckService(MyHttpService) {

    var service = {
      getGridCheckQuestionCodeArray: getGridCheckQuestionCodeArray,
      uploadGridCheckData: uploadGridCheckData
    }

    return service;


    function getGridCheckQuestionCodeArray(fun) {
      var url = '/hwweb/AssignmentAssessment/findDItem.action?typeId=""';
      MyHttpService.getCommonData(url, fun);
    }


    //上传网格化巡检的数据
    function uploadGridCheckData(jsonStr, fun) {
      var url = '/hwweb/GridInspection/saveRegionPro.action';
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.history')
    .controller('HistoryController', HistoryController);

  HistoryController.$inject = ['$rootScope', '$scope', '$state', 'HistoryService'];

  /** @ngInject */
  function HistoryController($rootScope, $scope, $state, HistoryService) {
    var vm = this;
    vm.title = '历史考核记录';
    vm.fun = {
      toPlanDetails: toPlanDetails,
      getHistoryDataByCondition: getHistoryDataByCondition
    }

    vm.toPlanDetails = toPlanDetails;

    vm.historyList = [];
    vm.yeahArray = [];
    vm.monthArray = [];
    vm.thisYeah = moment().format('YYYY');
    vm.thisMonth = moment().format('M');
    vm.queryCriteria = {
      keyword: '',
      selectedYeah: '',
      selectedMonth: ''
    }

    activate();


    function activate() {

      for (var i = 0; i < 12; i++) {
        vm.monthArray[i] = i + 1;
      }

      console.log(vm.monthArray);

      for (var i = 0; i < 5; i++) {
        vm.yeahArray[i] = vm.thisYeah - i;
      }

      var queryCriteria = {
        keyword: '',
        selectedYeah: vm.thisYeah,
        selectedMonth: vm.thisMonth
      }

      HistoryService.getHistoryDataByCondition(queryCriteria, function (resData) {
        vm.historyList = resData;
      });
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {assessmentData: item, fromWhere: 'history'});
    }

    //根据查询条件来查询历史考核记录
    function getHistoryDataByCondition() {
      HistoryService.getHistoryDataByCondition(vm.queryCriteria, function (resData) {
        vm.historyList = resData;
      });
    }


  }
})();

(function () {
  'use strict';

  angular
    .module('app.history')
    .config(HistoryConfig);

  HistoryConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function HistoryConfig($stateProvider) {
    $stateProvider
      .state('history', {
        url: '/history',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/history/history.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.history')
    .service('HistoryService', HistoryService);

  HistoryService.$inject = ['MyHttpService'];

  /** @ngInject */
  function HistoryService(MyHttpService) {
    var service = {
      getHistoryDataByCondition: getHistoryDataByCondition
    };

    return service;

    function getHistoryDataByCondition(queryCriteria, fun) {
      var url = '/hwweb/Comprehensive/viewHistory.action?name=' + queryCriteria.keyword +
        '&year=' + queryCriteria.selectedYeah + '&month=' + queryCriteria.selectedMonth;
      MyHttpService.getCommonData(url, fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = [
    '$rootScope',
    '$localStorage',
    '$scope',
    '$state',
    '$filter',
    'HomeService',
    'SYS_INFO',
    'GetWeatherService',
    '$stateParams',
    '$interval',
    '$cordovaCamera',
    '$ionicPopup'
  ];

  function HomeController($rootScope,
                          $localStorage,
                          $scope,
                          $state,
                          $filter,
                          HomeService,
                          SYS_INFO,
                          GetWeatherService,
                          $stateParams,
                          $interval,
                          $cordovaCamera,
                          $ionicPopup) {
    var vm = this;
    vm.title = '请选择工作';
    vm.hasSavedData = true;
    vm.saveDataNum = '20';
    vm.savedData = {};
    vm.isCommonAccount = $rootScope.isCommonAccount;
    vm.weather = {};
    vm.msgCount = $rootScope.unReadMsgCount;
    vm.homeWorkController = {
      toWaitForWork: toWaitForWork,
      toComprehensiveAssessment: toComprehensiveAssessment,
      toGridCheck: toGridCheck,
      toProblemFeedback: toProblemFeedback,
      toAccount: toAccount,
      toHistory: toHistory,
      toMap: toMap,
      toMessage: toMessage,
      toSettings: toSettings,
      toSavedData: toSavedData
    }

    activate();


    function activate() {

      GetWeatherService.getWeather(function (resData) {
        vm.weather = resData;
      });

      vm.savedData = HomeService.getSavedUploadedData();
      if (vm.savedData) {
        vm.hasSavedData = true;
        vm.saveDataNum = vm.savedData.length;
      } else {
        // vm.savedData = false;
      }

    }


    function toWaitForWork() {
      if(vm.isCommonAccount){
        $ionicPopup.alert(
          {
            title:'提示',
            template:'公共账户无法查看代办工作'
          }
        );
      }else{
        $state.go('waitForWork');
      }
    }

    function toComprehensiveAssessment() {
      $state.go('assessment');
    }

    function toGridCheck() {
      $state.go('gridCheck');
    }


    function toProblemFeedback() {
      $state.go('problemFeedback');
    }

    function toAccount() {
      $state.go('account');
    }

    function toHistory() {
      $state.go('history');
    }

    function toMap() {
      $state.go('map');
    }

    function toMessage() {
      $state.go('recMessage');
    }

    function toSettings() {
      $state.go('setting');
    }

    function toSavedData() {
      $state.go('savedData');
    }

  }
})();

(function () {
  'use strict';

  angular.module('app.home')
    .config(homeRouteConfig);

  homeRouteConfig.$inject = ['$stateProvider'];

  function homeRouteConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        cache:true,
        templateUrl: 'templates/home/home.html'
      });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.home')
    .service('GetWeatherService', GetWeatherService)
    .factory('HomeService', HomeService);


  HomeService.$inject = ['$localStorage', '$http', 'SYS_INFO', '$interval', '$rootScope'];
  GetWeatherService.$inject = ['$http', 'SYS_INFO', '$interval'];

  function HomeService($localStorage, $http, SYS_INFO, $interval, $rootScope) {

    var service = {
      getSavedUploadedData: getSavedUploadedData
    };

    return service;

    function getSavedUploadedData() {
      if ($localStorage.savedData) {
        return $localStorage.savedData;
      } else {
        return null;
      }
    }
  }

  function GetWeatherService($http, SYS_INFO) {

    var weatherApi = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/Weather/WeatherJson.action'

    var weatherInfo = {}

    var fun = {
      getWeather: getWeather
    };

    return fun;


    function getWeather(fun) {
      $http.get(weatherApi)
        .then(function (response) {
          if (response.data) {
            weatherInfo.weatherDate = moment().format('MM月DD日');
            weatherInfo.address = '青岛'
            weatherInfo.temperature = getTemperature(response.data);
            weatherInfo.weather = response.data.data.forecast[0].type;
            fun(weatherInfo);
          } else {
            weatherInfo.weatherDate = moment().format('MM月DD日');
            weatherInfo.address = '青岛';
            weatherInfo.temperature = '20度';
            weatherInfo.weather = '晴';
            fun(weatherInfo);
          }
        }, function (response) {
          weatherInfo.weatherDate = moment().format('MM月DD日');
          weatherInfo.address = '青岛';
          weatherInfo.temperature = '20度';
          weatherInfo.weather = '晴';
          fun(weatherInfo);
        });
      console.log(weatherInfo);
    }


    function getTemperature(data) {
      if (data.data) {
        var low = data.data.forecast[0].low.substring(3, 5);
        var high = data.data.forecast[0].high.substring(3, 5);
        var temperature = low + '~' + high + '℃';
        return temperature;
      } else {
        return '';
      }
    }

  }

})();

/* global hex_md5 */
(function () {
  'use strict';

  var loginModule = angular.module('app.login');
  loginModule.controller('LoginController', LoginController);

  LoginController.$inject = [
    '$scope',
    '$state',
    'LoginService',
    '$cordovaDevice',
    '$ionicPopup'
  ];

  function LoginController($scope,
                           $state,
                           LoginService,
                           $cordovaDevice,
                           $ionicPopup) {

    $scope.doLogin = doLogin;
    $scope.setNetAddress = setNetAddress;

    $scope.isCommonAccount = false;
    $scope.userInfo = LoginService.getUserInfo();
    $scope.imei = '';

    $scope.info = {
      userName: $scope.userInfo.userName,
      password: $scope.userInfo.password,
      isRemAccountAndPwd: $scope.userInfo.isRemAccountAndPwd
    };

    activate();


    function activate() {

    }


    LoginService.setServerInfo();


    function setNetAddress() {
      // if (device) {
      //   $scope.imei = device.imei;
      // } else {
      //   $scope.imei = '123456';
      // }
      $state.go('setNet', {imei: $scope.imei});
    }


    function doLogin() {
      LoginService.login($scope.info.userName, $scope.info.password, $scope.imei, $scope.isCommonAccount, $scope.info.isRemAccountAndPwd, $scope.info);
    }


  }
})();

(function () {
  angular.module('app.login')
    .config(loginRouteConfig);

  loginRouteConfig.$inject = ['$stateProvider'];

  function loginRouteConfig($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login/login.html'
      });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.login')
    .service('LoginService', LoginService);

  LoginService.$inject = ['$localStorage', '$http', 'SYS_INFO', '$timeout', '$ionicLoading', '$ionicPopup', '$rootScope', '$cordovaDevice','$state'];


  function LoginService($localStorage, $http, SYS_INFO, $timeout, $ionicLoading, $ionicPopup, $rootScope, $cordovaDevice,$state) {

    var service = {
      login: login,
      getUserInfo: getUserInfo,
      setServerInfo: setServerInfo,
      getImei: getImei
    };

    return service;


    function login(userName, pwd, imei, isCommonAccount, isRemAccountAndPwd,info) {
      $ionicLoading.show({
        template: '正在登录...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 30000);
      pwd = hex_md5(pwd);
      var path = '/hwweb/AppUser/userLogin.action?';
      switch (isCommonAccount) {
        case false:
          $http.get(SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + path + 'account=' + userName + '&' + 'password=' + pwd + '&' + 'imei=' + imei)
            .then(function (response) {
              $rootScope.isCommonAccount = false;
              success(response, isRemAccountAndPwd,info);
            }, function (response) {
              error(response)
            });
          break;
        case  true:
          $http.get(SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + path + 'account=' + userName + '&' + 'password=' + pwd)
            .then(function (response) {
              $rootScope.isCommonAccount = true;
              success(response, isRemAccountAndPwd,info);
            }, function (response) {
              error(response)
            });
          break;
        default:
          break;
      }
    }

    function success(res, isRemAccountAndPwd,info) {
      console.log(res);
      if (res.data.success == '1') {
        $timeout(function () {
          if (isRemAccountAndPwd) {
            createSession(info);
          } else {
            destroySession();
          }
          saveUserInfo(res.data.data[0]);
        }, 100).then(function () {
          $ionicLoading.hide();
          $state.go('home');
        });
      } else {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: res.data.msg
        }).then(function (res) {
        });
      }
    }

    function error(res) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: '登陆失败',
        template: res.data
      }).then(function (res) {
      });
    }

    function saveUserInfo(userInfo) {
      if (userInfo) {
        $rootScope.userId = userInfo.id;
        $rootScope.userName = userInfo.name;
        $rootScope.userOrg = userInfo.org;
      } else {
        $rootScope.userId = '';
        $rootScope.userName = '';
        $rootScope.userOrg= '';
      }
    }

    function createSession(info) {
      var userInfo = {
        userName: '',
        password: '',
        isRemAccountAndPwd: false
      };

      if (info) {
        userInfo.userName = info.userName;
        userInfo.password = info.password;
        userInfo.isRemAccountAndPwd = info.isRemAccountAndPwd;
      }

      $localStorage.userInfo = userInfo;
    }

    function getImei() {
      document.addEventListener("deviceready", onDeviceReady, false);

      function onDeviceReady() {
        return $cordovaDevice.getUUID();
      }
    }

    function getUserInfo() {
      var userInfo = {
        userName: '',
        password: '',
        isRemAccountAndPwd: false
      };

      if ($localStorage.userInfo) {
        userInfo.userName = $localStorage.userInfo.userName;
        userInfo.password = $localStorage.userInfo.password;
        userInfo.isRemAccountAndPwd = $localStorage.userInfo.isRemAccountAndPwd;
      }
      return userInfo;
    }

    function destroySession() {
      delete $localStorage.userInfo;
    }

    function setServerInfo() {

      var serverInfo = {
        SERVER_PATH: '',
        SERVER_PORT: ''
      }

      if ($localStorage.serverInfo) {
        SYS_INFO.SERVER_PATH = $localStorage.serverInfo.SERVER_PATH;
        SYS_INFO.SERVER_PORT = $localStorage.serverInfo.SERVER_PORT;
      } else {
        serverInfo.SERVER_PATH = SYS_INFO.SERVER_PATH;
        serverInfo.SERVER_PORT = SYS_INFO.SERVER_PORT;
        $localStorage.serverInfo = serverInfo;
      }
    }

  }
})();

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

(function () {
  'use strict';

  angular
    .module('app.map')
    .config(MapConfig);

  MapConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function MapConfig($stateProvider) {
    $stateProvider
      .state('map', {
        url: '/map',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/map/map.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.map')
    .service('MapService', MapService);

  MapService.$inject = ['MyHttpService'];

  /** @ngInject */
  function MapService(MyHttpService) {
    var service = {
      getAccountList: getAccountList
    }

    return service;


    //获取街道，车辆等相关的台帐信息
    function getAccountList(queryCriteria, fun) {
      var url = '/hwweb/Ledger/findMap.action?code=' + queryCriteria.type + '&name=' + queryCriteria.keyword;
      MyHttpService.getCommonData(url, fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$scope', 'MessageService', '$rootScope'];

  /** @ngInject */
  function MessageController($scope, MessageService, $rootScope) {

    var vm = this;
    vm.title = '已收到消息';
    vm.refreshMessageList = refreshMessageList;
    vm.openMsgContent = openMsgContent;
    vm.fun = {
      refreshMessageList: refreshMessageList
    }

    //http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg
    vm.messages = [];

    activate();

    function activate() {
      MessageService.getMessagesByUserId($rootScope.userId, function (resData) {
        vm.messages = resData;
      });
    }


    function openMsgContent(msg) {

    }

    //刷新数据
    function refreshMessageList() {
      vm.messages = [];
      var userId = '';
      if ($rootScope.userId) {
        userId = $rootScope.userId;
      }
      MessageService.doRefresh(userId, function (resData) {
        vm.messages = resData;
        $scope.$apply();
      }, function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .config(messageConfig);

  messageConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function messageConfig($stateProvider) {
    $stateProvider
      .state('recMessage', {
        url: '/recMessage',
        templateUrl: 'templates/message/recMessage.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .service('MessageService', MessageService);

  MessageService.$inject = ['MyHttpService', 'SYS_INFO', '$http'];

  /** @ngInject */
  function MessageService(MyHttpService, SYS_INFO, $http) {
    var service = {
      getMessagesByUserId: getMessagesByUserId,
      doRefresh: doRefresh
    };

    return service;


    function getMessagesByUserId(userId, fun) {
      var url = '/hwweb/AppMessage/findMsgByUserId.action?userId=' + 123;
      MyHttpService.getCommonData(url, fun);
    }


    //刷新
    function doRefresh(userId, fun,hideRefreshFun) {
      var url = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/AppMessage/findMsgByUserId.action?userId=' + 123;
      $http.get(url)
        .success(function (response) {
          fun(response);
        })
        .finally(function () {
          hideRefreshFun();
        });
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.problemFeedback')
    .controller('ProblemFeedbackController', ProblemFeedbackController);

  ProblemFeedbackController.$inject = ['$rootScope', '$state', '$ionicPopup', '$scope', 'ProblemFeedbackService'];

  /** @ngInject */
  function ProblemFeedbackController($rootScope, $state, $ionicPopup, $scope, ProblemFeedbackService) {

    var vm = this;
    vm.title = '已收到的检查问题';

    vm.fun = {
      checkProblemDetails: checkProblemDetails,
      feedbackProblem: feedbackProblem
    }

    vm.problemList = [];

    activate();


    function activate() {
      ProblemFeedbackService.getProblemList($rootScope.userId, function (resData) {
        vm.problemList = resData;
      });
    }


    function checkProblemDetails(item) {
      toProblemFeedbackDetails(item);
    }

    function feedbackProblem(item) {
      // if (item.status == 0) {
      //   toProblemFeedbackDetails(item);
      // } else {
      //   $ionicPopup.alert({
      //     title: '提示',
      //     template: '您已经反馈过问题啦'
      //   }).then(function (res) {
      //
      //   });
      // }
      toProblemFeedbackDetails(item);
    }

    function toProblemFeedbackDetails(item) {
      $state.go('problemFeedbackDetails', {problemItem: item, fromWhere: 'problemFeedback'});
    }


  }
})();

(function () {
  'use strict';

  angular
    .module('app.problemFeedback')
    .config(ProblemFeedbackConfig);

  ProblemFeedbackConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ProblemFeedbackConfig($stateProvider) {
    $stateProvider
      .state('problemFeedback', {
        url: '/problemFeedback',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/problemFeedback/problemFeedback.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.problemFeedback')
    .service('ProblemFeedbackService', ProblemFeedbackService);

  ProblemFeedbackService.$inject = ['MyHttpService'];

  /** @ngInject */
  function ProblemFeedbackService(MyHttpService) {
    var service = {
      getProblemList: getProblemList
    };

    return service;

    function getProblemList(userId, fun) {
      var path = '/hwweb/GridInspection/CheckProblem.action?' + 'userId=' + userId;
      MyHttpService.getCommonData(path, fun);
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.setting')
    .controller('SettingController', SettingController);

  SettingController.$inject = ['$rootScope', '$scope', 'GetWeatherService'];

  /** @ngInject */
  function SettingController($rootScope, $scope, GetWeatherService) {
    var vm = this;
    vm.title = '个人信息';
    vm.group = $rootScope.userOrg;
    vm.name = $rootScope.userName;
    vm.weather = {};

    activate();

    function activate() {
      GetWeatherService.getWeather(function (resData) {
        vm.weather = resData;
      });
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.setting')
    .config(SettingConfig);

  SettingConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function SettingConfig($stateProvider) {
    $stateProvider
      .state('setting', {
        url: '/setting',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/setting/setting.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.setting')
    .service('userInfoService', userInfoService);

  userInfoService.$inject = ['$http'];
  /** @ngInject */
  function userInfoService($http) {
    var service = {};

    return service;

  }
})();

(function () {
  'use strict';

  angular
    .module('app.waitForWork')
    .controller('WaitForWorkController', WaitForWorkController);

  WaitForWorkController.$inject = ['$scope','WaitForWorkService','$rootScope','$state'];

  /** @ngInject */
  function WaitForWorkController($scope,WaitForWorkService,$rootScope,$state) {
    var vm = this;
    vm.title = '待办工作';
    vm.titleController = {};
    vm.workList = [];
    vm.toJobDetails = toJobDetails;



    activate();


    function activate() {
      console.log($rootScope.userId);
      WaitForWorkService.getWaitForWorkInfo($rootScope.userId,function (data) {
        vm.workList = data;
        console.log(vm.workList);
      });
    }


    function toJobDetails(item) {
      if (item.sDate == '无') {
        $state.go('problemFeedbackDetails', {problemItem: item,fromWhere: 'waitForWork'});
      } else {
        $state.go('planDetails', {planDetailsData: item, fromWhere: 'waitForWork'});
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.waitForWork')
    .config(WaitForWorkConfig);

  WaitForWorkConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function WaitForWorkConfig($stateProvider) {
    $stateProvider
      .state('waitForWork', {
        url: '/waitForWork',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        cache:true,
        templateUrl: 'templates/waitForWork/waitForWork.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.waitForWork')
    .service('WaitForWorkService', WaitForWorkService);

  WaitForWorkService.$inject = ['MyHttpService', '$localStorage', '$http', 'SYS_INFO', '$timeout', '$ionicLoading', '$ionicPopup', '$rootScope', '$cordovaDevice', '$state']

  /** @ngInject */

  function WaitForWorkService(MyHttpService, $localStorage, $http, SYS_INFO, $timeout, $ionicLoading, $ionicPopup, $rootScope, $cordovaDevice, $state) {



    var service = {
      getWaitForWorkInfo: getWaitForWorkInfo
    };

    return service;

    function getWaitForWorkInfo(userId,fun) {
      var path = '/hwweb/AssignmentAssessment/findDataByUserId?userId=' + userId;
      MyHttpService.getCommonData(path,fun);
    }
  }
})
();

/* global hex_md5 */
(function () {
  'use strict';

  angular.module('app.setNet')
    .controller('SetNetController', SetNetController);

  SetNetController.$inject = ['$scope', 'SetNetService', 'SYS_INFO', '$ionicHistory', '$stateParams'];

  function SetNetController($scope, SetNetService, SYS_INFO, $ionicHistory, $stateParams) {
    $scope.netSetList = [
      {placeholderValue: '服务器地址：', value: SYS_INFO.SERVER_PATH},
      {placeholderValue: '服务器端口：', value: SYS_INFO.SERVER_PORT}
    ];
    if ($stateParams.imei) {
      $scope.IMEI = $stateParams.imei;
    }


    $scope.setNet = function () {
      SetNetService.saveNetSettings($scope.netSetList[0].value, $scope.netSetList[1].value, function () {
        $ionicHistory.goBack();
      });
    }

    $scope.backToLogin = function () {
      $ionicHistory.goBack();
    }

  }
})();

(function () {
  angular.module('app.setNet')
    .config(NetRouteConfig);

  NetRouteConfig.$inject = ['$stateProvider',];

  function NetRouteConfig($stateProvider) {
    $stateProvider
      .state('setNet', {
        url: '/setNet',
        params: {imei: ''},
        cache: false,
        controller: 'SetNetController',
        templateUrl: 'templates/setNet/net.html'
      });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.setNet')
    .service('SetNetService', SetNetService)

  SetNetService.$inject = ['$localStorage','SYS_INFO'];

  function SetNetService($localStorage,SYS_INFO) {

    var service = {
      saveNetSettings: saveNetSettings
    }


    function saveNetSettings(address, port ,back) {
      var serverInfo = {
        SERVER_PATH:address,
        SERVER_PORT:port
      }
      $localStorage.serverInfo= serverInfo;
      SYS_INFO.SERVER_PATH = serverInfo.SERVER_PATH;
      SYS_INFO.SERVER_PORT = serverInfo.SERVER_PORT;
      back();
    }
    return service;
  }
})();

(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .controller('AccountDetailsController', AccountDetailsController);

  AccountDetailsController.$inject = ['$scope', 'AccountDetailsService', '$stateParams'];

  /** @ngInject */
  function AccountDetailsController($scope, AccountDetailsService, $stateParams) {

    var vm = this;
    vm.data = {};
    vm.installationName = '';
    vm.code = ''
    vm.accountDetailsData = {};

    activate();

    function activate() {
      if ($stateParams.accountData != null) {
        vm.accountDetailsData = $stateParams.accountData;
      }
      if ($stateParams.code != null) {
        vm.code = $stateParams.code;
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .config(AccountDetailsConfig);

  AccountDetailsConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AccountDetailsConfig($stateProvider) {
    $stateProvider
      .state('accountDetails', {
        url: '/accountDetails',
        params: {accountData: null, code: null},
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        cache:true,
        templateUrl: 'templates/account/accountDetails/accountDetails.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .service('AccountDetailsService', AccountDetailsService);

  AccountDetailsService.$inject = ['$http','MyHttpService'];
  /** @ngInject */
  function AccountDetailsService($http,MyHttpService) {
    var service = {
    };
    return service;
  }
})();

(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .controller('AddAssessmentController', AddAssessmentController);

  AddAssessmentController.$inject = ['$rootScope', '$state', '$stateParams', 'AddAssessmentService',
    'AssessmentStatusDetailsService', '$ionicPopup', '$ionicHistory', '$cordovaCamera'];

  /** @ngInject */
  function AddAssessmentController($rootScope, $state, $stateParams, AddAssessmentService,
                                   AssessmentStatusDetailsService, $ionicPopup, $ionicHistory, $cordovaCamera) {

    var vm = this;
    vm.data = {};
    vm.title = '录入计划';
    vm.spinnerShow = false;
    vm.picBase64DataArray = [];
    vm.infraId = '';
    //需要上传的数据
    vm.uploadData = {
      level: '',
      road: '',
      length: '',
      points: '',
      width: '',
      reason: '',
      remark: '',
      img: []
    };

    //从上一个页面传递回来的数据
    vm.addAssessmentData = {};

    //查询条件
    vm.queryCriteria = {
      type: '',
      address: ''
    };

    //扣分原因列表，需要从服务器获取
    vm.pointReasonArray = [];

    //台帐数据
    vm.accountList = [];

    //设施类型
    vm.facilityTypeList = [
      {name: '公厕', type: '01'},
      {name: '转运站', type: '02'},
      {name: '道路', type: '05'},
      {name: '车辆', type: '06'}
    ];

    //点击模糊匹配列表获取到的数据
    vm.accountObj = {
      level: '',
      road: '',
      length: '',
      width: '',
      wcCondition: '',
      carCondition: ''
    };

    //跳转到地图页面需要传递的道路坐标数组
    vm.mapPositionObj = {};

    vm.fun = {
      toAddAssessmentMap: toAddAssessmentMap,
      takePicture: takePicture,
      spinnerHide: spinnerHide,
      deletePic: deletePic,
      queryAccountList: queryAccountList,
      uploadDataFun: uploadDataFun
    };


    activate();


    function activate() {

      if ($stateParams.addAssessmentData) {
        vm.addAssessmentData = $stateParams.addAssessmentData;
      }
      getAccounts();
    }

    function toAddAssessmentMap() {
      $state.go('addAssessmentMap', {mapPositionObj: vm.mapPositionObj, from: 'addAssessment'});
    }

    //启动摄像头拍照
    function takePicture() {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        // var image = document.getElementById('pic' + vm.picIsShow);
        // image.src = "data:image/jpeg;base64," + imageData;
        vm.picBase64DataArray.splice(0, vm.picBase64DataArray.length);//清空图片数组
        vm.uploadData.img.splice(0, vm.uploadData.img.length)
        vm.picBase64DataArray.push("data:image/jpeg;base64," + imageData);
        vm.uploadData.img.push(imageData);
      }, function (err) {
        $ionicPopup.alert({
          title: '拍照失败，请重试！'
        });
      });
    }


    //根据设施地址模糊查询台帐
    function queryAccountList() {
      AddAssessmentService.queryAccountList(vm.queryCriteria, function (resData) {
        vm.accountList = resData;
        if (resData.length > 0) {
          vm.spinnerShow = true;
        } else {
          vm.spinnerShow = false;
        }
      })
    }

    //点击下拉列表选择数据
    function spinnerHide(item) {
      switch (item.type) {
        case '01':
          vm.accountObj.wcCondition = item.condition;
          break;
        case '02':
          break;
        case '05':
          vm.accountObj.level = item.cleanLevel;
          vm.accountObj.length = item.length;
          vm.accountObj.road = item.primaryOrSecondary;
          vm.accountObj.width = item.width;
          break;
        case '06':
          vm.accountObj.carCondition = item.condition;
          break;
        default:
          break;
      }
      vm.spinnerShow = false;
      vm.queryCriteria.address = item.name;
      vm.mapPositionObj = item;
      vm.infraId = item.id;
    }


    function getAccounts() {
      AssessmentStatusDetailsService.getAccounts(null, function (resData) {
        vm.pointReasonArray = resData;
        vm.uploadData.reason = vm.pointReasonArray[0].name;
      });
    }

    function deletePic(index) {
      $ionicPopup.confirm({
        title: '提示',
        template: '您确定要删除此照片么？'
      }).then(function (res) {
        if (res) {
          vm.picBase64DataArray.splice(index, 1);
          vm.uploadData.img.splice(index, 1);
        } else {

        }
      });
    }

    //提交数据
    function uploadDataFun() {
      if (!vm.addAssessmentData || !vm.addAssessmentData.id) {
        $ionicPopup.alert({
          title: '提示',
          template: '计划id未获取到，请退出此页面重新进入！'
        });
      } else if (!vm.infraId) {
        $ionicPopup.alert({
          title: '提示',
          template: '您没有选择相关的设施，请先选择！'
        });
      } else if (vm.uploadData.points == '') {
        $ionicPopup.alert({
          title: '扣分情况不能为空'
        });
      } else if (vm.uploadData.reason == '') {
        $ionicPopup.alert({
          title: '扣分原因不能为空'
        });
      } else if (vm.uploadData.remark == '') {
        $ionicPopup.alert({
          title: '备注不能为空'
        });
      } else {
        var uploadDataObj =
          {
            planId: '',
            infraId: ''
          };
        uploadDataObj.planId = vm.addAssessmentData.id;
        uploadDataObj.infraId = vm.infraId;
        var jsonStr = JSON.stringify(uploadDataObj);
        AddAssessmentService.uploadAccountData(jsonStr, function (resData) {
          if (resData) {
            var jsonObj = {
              "infoId": "",
              "planId": "",
              "infraId": "",
              "dItemName": "",
              "score": "",
              "userName": "",
              "remark": "",
              "imgJson": []
            }
            jsonObj.infoId = resData[0];
            jsonObj.planId = vm.addAssessmentData.id;
            jsonObj.infraId = vm.infraId;
            jsonObj.dItemName = vm.uploadData.reason;
            jsonObj.score = vm.uploadData.points;
            jsonObj.userName = $rootScope.userName;
            jsonObj.remark = vm.uploadData.remark;
            jsonObj.imgJson = vm.uploadData.img;
            var jsonStr = JSON.stringify(jsonObj);
            AddAssessmentService.uploadPointAndPicData(jsonStr, function (resData) {
              // if(resData){
              //   $ionicHistory.goBack();
              // }
            });
          }
        });
      }
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .config(AddAssessmentConfig);

  AddAssessmentConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AddAssessmentConfig($stateProvider) {
    $stateProvider
      .state('addAssessment', {
        url: '/addAssessment',
        params: {
          addAssessmentData: null
        },
        templateUrl: 'templates/assessment/addAssessment/addAssessment.html'
      });
  }
}());


(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .service('AddAssessmentService', AddAssessmentService);

  AddAssessmentService.$inject = ['$cordovaCamera', 'MyHttpService', '$ionicLoading', 'SYS_INFO', '$http', '$ionicPopup'];

  /** @ngInject */
  function AddAssessmentService($cordovaCamera, MyHttpService, $ionicLoading, SYS_INFO, $http, $ionicPopup) {

    var service = {
      addNewAssessment: addNewAssessment,
      getPhonePictureData: getPhonePictureData,
      getPhonePicturePath: getPhonePicturePath,
      queryAccountList: queryAccountList,
      uploadAccountData: uploadAccountData,
      uploadPointAndPicData: uploadPointAndPicData
    }


    return service;


    function addNewAssessment(userId, planDetailId, success, error) {

    }

    function getPhonePictureData() {

      document.addEventListener("deviceready", function () {

        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
          var image = document.getElementById('myImage');
          image.src = "data:image/jpeg;base64," + imageData;
        }, function (err) {
          // error
        });

      }, false);
    }

    function getPhonePicturePath() {

      document.addEventListener("deviceready", function () {

        var options = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
          var image = document.getElementById('myImage');
          image.src = imageURI;
        }, function (err) {
          // error
        });

        $cordovaCamera.cleanup().then();
      }, false);
    }


    //模糊查询对应的台帐信息
    function queryAccountList(queryCriteria, fun) {
      var path = '/hwweb/Comprehensive/searchFacilities.action?' + 'name=' + queryCriteria.address + '&typeId=' + queryCriteria.type;
      MyHttpService.getCommonData(path, fun);
    }

    function uploadAccountData(jsonStr, fun) {

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        }
      );

      var url = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/AssignmentAssessment/comprehensive.action';
      console.log(url);
      console.log(jsonStr);
      $http({
        method: 'post',
        url: url,
        data: {data: jsonStr},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
      }).then(function (res) {
        if (res.data.success = 1) {
          var resData = res.data.data;
          $ionicLoading.hide();
          fun(resData);
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '数据上传失败'
          });
        }
      }, function (error) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '数据上传失败'
        });
      });
    }


    function uploadPointAndPicData(jsonStr, fun) {
      var url = '/hwweb/AssignmentAssessment/reportPro.action'
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .controller('AssessmentStatusController', AssessmentStatusController);

  AssessmentStatusController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AssessmentStatusService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function AssessmentStatusController($rootScope, $scope, $state, $stateParams, AssessmentStatusService, $ionicLoading, $ionicPopup) {
    var vm = this;
    vm.title = '考核情况';
    vm.data = {};//来自上一个页面的数据
    vm.fun = {
      toAssessmentStatusDetails: toAssessmentStatusDetails,
      upload: upload,
      checkStatusDetails: checkStatusDetails
    };


    vm.assessmentStatusList = [];


    activate();

    function activate() {
      if ($stateParams.planDetailsData) {
        vm.data = $stateParams.planDetailsData;
        console.log(vm.data);
        AssessmentStatusService.getAssessmentStatusList(vm.data, function (resData) {
          vm.assessmentStatusList = resData;
        });
      }

      $scope.$on('$ionicView.beforeEnter', function (event) {
        AssessmentStatusService.getAssessmentStatusList(vm.data, function (resData) {
          vm.assessmentStatusList = resData;
        });
      });
    }

    //考核完成
    function upload() {
      if (vm.data != null) {
        if (vm.data.status == null || vm.data.status == false) {
          AssessmentStatusService.checkOverAndUpload(vm.data);
        } else {
          $ionicPopup.alert({
            title: '该考核任务已经完成！'
          }).then(function (res) {

          });
        }
      }
    }

    //录入考核情况
    function toAssessmentStatusDetails() {
      if (vm.data != null) {
        if (vm.data.status == null || vm.data.status == false) {
          $state.go('assessmentStatusDetails', {assessmentStatusData: vm.data, isEdit: true})
        } else {
          $ionicPopup.alert({
            title: '该考核任务已经完成！'
          }).then(function (res) {

          });
        }
      }

    }

    //查看考核情况详情
    function checkStatusDetails(item) {
      item.typeId = vm.data.typeId;
      item.infraId = vm.data.infraId;
      $state.go('assessmentStatusDetails', {assessmentStatusData: item, isEdit: false})
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .config(AssessmentStatusConfig);

  AssessmentStatusConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AssessmentStatusConfig($stateProvider) {
    $stateProvider
      .state('assessmentStatus', {
        // url: 'assessment/assessmentStatus',
        url: '/assessmentStatus',
        params: {
          planDetailsData: null
        },
        cache: true,
        templateUrl: 'templates/assessment/assessmentStatus/assessmentStatus.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .service('AssessmentStatusService', AssessmentStatusService);

  AssessmentStatusService.$inject = ['$http', 'SYS_INFO', 'MyHttpService', '$ionicLoading', '$ionicPopup', '$ionicHistory'];

  /** @ngInject */
  function AssessmentStatusService($http, SYS_INFO, MyHttpService, $ionicLoading, $ionicPopup, $ionicHistory) {
    var service = {
      getAssessmentStatusList: getAssessmentStatusList,
      checkOverAndUpload: checkOverAndUpload
    }

    return service;

    function getAssessmentStatusList(planDetails, fun) {
      var path = '/hwweb/AssignmentAssessment/findProView.action?' + 'planId=' + planDetails.planId +
        '&infrastructureId=' + planDetails.infraId + '&infoId=' + planDetails.id;
      MyHttpService.getCommonData(path, fun);
    }

    function checkOverAndUpload(planDetails) {
      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        }
      );
      var path = '/hwweb/AssignmentAssessment/complete.action?' + 'planId=' + planDetails.planId + '%infraId=' + planDetails.infraId;
      $http({
        method: 'GET',
        url: SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + path
      }).then(function (response) {
        if (response.data.success == 1) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '提示',
            template: '考核完成...'
          }).then(function (res) {
            $ionicHistory.goBack();
          })
        }
      }, function (err) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '失败提示',
          template: '上传失败，请重试！'
        }).then(function (res) {

        })
      });
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .controller('AssessmentStatusDetailsController', AssessmentStatusDetailsController);

  AssessmentStatusDetailsController.$inject = ['$rootScope', 'SYS_INFO', '$scope', '$state', '$stateParams', 'AssessmentStatusDetailsService', '$ionicLoading', '$ionicPopup', '$cordovaCamera', '$ionicHistory'];

  /** @ngInject */
  function AssessmentStatusDetailsController($rootScope, SYS_INFO, $scope, $state, $stateParams, AssessmentStatusDetailsService, $ionicLoading, $ionicPopup, $cordovaCamera, $ionicHistory) {

    var vm = this;
    vm.data = {};
    vm.title = '';
    vm.type = '05';//判断是道路还是公厕还是其他的设施 05：道路 01：公厕 06：车辆
    vm.isEdit = false;//判断界面是编辑还是查看
    vm.assessmentStatusDetails = {};
    vm.reasonAccount = [];
    vm.picBase64DataArray = [];
    vm.serverUrl = '';
    vm.uploadPicBase64DataArray = [];
    vm.uploadData = {
      points: '',
      reason: '',
      remarks: ''
    };

    vm.fun = {
      uploadAssessmentStatusDetailsData: uploadAssessmentStatusDetailsData,
      toCommonMap: toCommonMap,
      takePicture: takePicture,
      deletePic: deletePic
    }


    activate();


    function activate() {
      vm.isEdit = $stateParams.isEdit;
      vm.serverUrl = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb';
      if ($stateParams.assessmentStatusData) {
        vm.data = $stateParams.assessmentStatusData;
        vm.title = $stateParams.assessmentStatusData.name;
        console.log(vm.data);

        if (vm.isEdit) {
          getAccounts();
          AssessmentStatusDetailsService.getAssessmentStatusDetailsListIsEdit(vm.data, function (resData) {
            vm.assessmentStatusDetails = resData[0];
            if (vm.assessmentStatusDetails) {
              vm.type = vm.assessmentStatusDetails.type;
            }
          });
        } else {
          AssessmentStatusDetailsService.getAssessmentStatusDetailsListNotEdit(vm.data, function (resData) {
            vm.assessmentStatusDetails = resData[0];
            if (vm.assessmentStatusDetails) {
              vm.type = vm.assessmentStatusDetails.type;
              vm.uploadData.points = vm.assessmentStatusDetails.deducted;
              vm.uploadData.reason = vm.assessmentStatusDetails.dItem;
              vm.uploadData.remarks = vm.assessmentStatusDetails.remarks;
              vm.picBase64DataArray = vm.assessmentStatusDetails.imgs;
            }
          });
        }
      }
    }

    //上传考核数据
    function uploadAssessmentStatusDetailsData() {

      if (vm.uploadData.points == '') {
        $ionicPopup.alert({
          title: '扣分情况不能为空'
        });
      } else if (vm.uploadData.reason == '') {
        $ionicPopup.alert({
          title: '扣分原因不能为空'
        });
      } else if (vm.uploadData.remark == '') {
        $ionicPopup.alert({
          title: '备注不能为空'
        });
      } else {
        var jsonObj = {
          "infoId": "",
          "planId": "",
          "infraId": "",
          "dItemName": "",
          "score": "",
          "userName": "",
          "remark": "",
          "imgJson": []
        }
        jsonObj.infoId = vm.data.id;
        jsonObj.planId = vm.data.planId;
        jsonObj.infraId = vm.data.infraId;
        jsonObj.dItemName = vm.uploadData.reason;
        jsonObj.score = vm.uploadData.points;
        jsonObj.userName = $rootScope.userName;
        jsonObj.remark = vm.uploadData.remark;
        jsonObj.imgJson = vm.uploadPicBase64DataArray;
        AssessmentStatusDetailsService.uploadAssessmentStatusDetailsData(jsonObj, function (res) {
          $ionicHistory.goBack();
        });
      }
    }

    //启动摄像头拍照
    function takePicture() {

      if (vm.picBase64DataArray.length >= 3) {
        $ionicPopup.alert({
          title: '最多支持上传三张图片'
        }).then(function () {

        });
      } else {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 200,
          targetHeight: 200,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true,
          correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
          // var image = document.getElementById('pic' + vm.picIsShow);
          // image.src = "data:image/jpeg;base64," + imageData;
          var picName = moment().format('YYYY-MM-DD HH:mm:ss') + '.jpg';
          vm.picNameArray.push(picName);
          vm.picBase64DataArray.push("data:image/jpeg;base64," + imageData);
          vm.uploadPicBase64DataArray.push(imageData);
        }, function (err) {
          // error
        });
      }
    }


    //通过手机相册来获取图片
    function getPicByAlbum() {
      var options = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
      };

      $cordovaCamera.getPicture(options).then(function (imageURI) {
        $ionicPopup.alert({
            title: '图片信息',
            template: imageURI
          }
        );
      }, function (err) {
        // error
      });
      $cordovaCamera.cleanup().then(function (res) {
      }); // only for FILE_URI
    }


    //启动SqlLite来保存未上传的数据
    function startSqlLite() {

      var db = $cordovaSQLite.openDB({name: "savedData.db"});

      // for opening a background db:
      var db = $cordovaSQLite.openDB({name: "my.db", bgType: 1});

      $scope.execute = function () {
        var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, ["test", 100]).then(function (res) {
          console.log("insertId: " + res.insertId);
        }, function (err) {
          console.error(err);
        });
      };


    }


    function toCommonMap() {
      $state.go('addAssessmentMap', {mapPositionObj: vm.assessmentStatusDetails, from: 'assessmentStatusDetails'});
    }

    function getAccounts() {
      AssessmentStatusDetailsService.getAccounts(vm.data, function (resData) {
        vm.reasonAccount = resData;
        vm.uploadData.reason = vm.reasonAccount[0].name;
        console.log('扣分原因数据：');
        console.log(vm.reasonAccount);
      });
    }

    //长按删除某张图片
    function deletePic(index) {
      vm.picBase64DataArray.splice(index, 1);
      vm.uploadPicBase64DataArray.push(index, 1);
      vm.picNameArray.push(index, 1);
    }


  }
})();

(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .config(AssessmentStatusDetailsConfig);

  AssessmentStatusDetailsConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AssessmentStatusDetailsConfig($stateProvider) {
    $stateProvider
      .state('assessmentStatusDetails', {
        // url: 'assessment/assessmentStatusDetails',
        url: '/assessmentStatusDetails',
        params: {
          assessmentStatusData: null, isEdit: false
        },
        templateUrl: 'templates/assessment/assessmentStatusDetails/assessmentStatusDetails.html'
      });
  }
}());


(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .service('AssessmentStatusDetailsService', AssessmentStatusDetailsService);

  AssessmentStatusDetailsService.$inject = ['MyHttpService'];

  /** @ngInject */
  function AssessmentStatusDetailsService(MyHttpService) {
    var service = {
      getAssessmentStatusDetailsListIsEdit: getAssessmentStatusDetailsListIsEdit,
      getAssessmentStatusDetailsListNotEdit: getAssessmentStatusDetailsListNotEdit,
      getAccounts: getAccounts,
      uploadAssessmentStatusDetailsData: uploadAssessmentStatusDetailsData
    }


    return service;


    //录入的时候请求数据的方法
    function getAssessmentStatusDetailsListIsEdit(data, fun) {
      var path = '/hwweb/AssignmentAssessment/findFacilities.action?' + 'typeId=' + data.typeId + '&infraId=' + data.infraId;
      MyHttpService.getCommonData(path, fun);
    }

    //查看问题的时候请求数据的方法
    function getAssessmentStatusDetailsListNotEdit(data, fun) {
      var path = '/hwweb/AssignmentAssessment/findFacilitiesViews.action?' + 'typeId=' + data.typeId + '&infraId=' + data.infraId+'&resultsId=' +data.id;
      MyHttpService.getCommonData(path, fun);
    }

    //扣分原因查询
    function getAccounts(data, fun) {
      if(data){
        var url = '/hwweb/AssignmentAssessment/findDItem.action?' + 'typeId=' + data.typeId;
      }else{
        var url = '/hwweb/AssignmentAssessment/findDItem.action'
      }
      MyHttpService.getCommonData(url, fun);
    }

    //上传数据
    function uploadAssessmentStatusDetailsData(jsonObj, fun) {
      var url = '/hwweb/AssignmentAssessment/reportPro.action';
      var jsonStr = JSON.stringify(jsonObj);
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .controller('PlanDetailsController', PlanDetailsController);

  PlanDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'PlanDetailsService'];

  /** @ngInject */
  function PlanDetailsController($rootScope, $scope, $state, $stateParams, PlanDetailsService) {
    var vm = this;
    vm.data = {}
    vm.title = '';
    vm.fun = {
      toAddAssessment: toAddAssessment
    }
    vm.toAssessmentStatus = toAssessmentStatus;

    vm.planDetailsList = [];


    activate();


    function activate() {

      if ($stateParams.planDetailsData) {
        vm.data = $stateParams.planDetailsData;
        vm.title = $stateParams.planDetailsData.planName;
      }
      PlanDetailsService.getPlanDetailsList(vm.data.id, function (responseData) {
        vm.planDetailsList = responseData;
      });
    }


    function toAddAssessment() {

      if (vm.data.id) {
        var planObj = {
          id: vm.data.id
        }
        $state.go('addAssessment', {addAssessmentData: planObj});
      }
    }

    function toAssessmentStatus(item) {
      item.planId = vm.data.id;
      $state.go('assessmentStatus', {planDetailsData: item})
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .config(PlanDetailsConfig);

  PlanDetailsConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function PlanDetailsConfig($stateProvider) {
    $stateProvider
      .state('planDetails', {
        url: '/assessment/planDetails',
        params: {
          planDetailsData: null
        },
        cache: false,
        templateUrl: 'templates/assessment/planDetails/planDetails.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .service('PlanDetailsService', PlanDetailsService);

  PlanDetailsService.$inject = ['MyHttpService'];

  /** @ngInject */
  function PlanDetailsService(MyHttpService) {

    var service = {
      getPlanDetailsList: getPlanDetailsList
    }

    return service;


    function getPlanDetailsList(id, fun) {
      var path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
      MyHttpService.getCommonData(path, fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.commonHttpService')
    .service('MyHttpService', MyHttpService);

  MyHttpService.$inject = ['$http', '$ionicLoading', '$ionicPopup', 'SYS_INFO'];

  /** @ngInject */
  function MyHttpService($http, $ionicLoading, $ionicPopup, SYS_INFO) {
    var service = {
      getCommonData: getCommonData,
      uploadCommonData: uploadCommonData
    };

    return service;


    function getCommonData(urlPath, fun) {

      console.log(SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath);

      var data = [];

      $ionicLoading.show(
        {
          templateUrl: 'templates/common/common.loadingData.html',
          duration: 20 * 1000
        });
      $http({
        method: 'GET',
        url: SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      }).then(function (response) {
        if (response.data.success == 1) {
          $ionicLoading.hide();
          data = response.data.data;
          console.log('数据获取成功');
          console.log(data);
          fun(data);
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '提示',
            template: '获取数据失败'
          }).then(function (res) {
            console.log('数据获取失败');
            console.log(data);
            fun(data);
          });
        }
      }, function (response) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '提示',
          template: '获取数据失败'
        }).then(function (res) {
          console.log('通信异常');
          console.log(data);
          fun(data);
        });
      });
    }


    //上传数据通用方法
    function uploadCommonData(urlPath, jsonStr, fun) {

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        }
      );

      var url = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath;
      console.log(url);
      console.log(jsonStr);
      // $http({
      //   method: 'post',
      //   url: SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath,
      //   data: {data: jsonStr}
      // }).then(function (res) {
      $http({
        method: 'post',
        url: url,
        data: {data: jsonStr},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          console.log(str.join("&"));
          return str.join("&");

        }
      }).then(function (res) {
        if (res.data.success = 1) {
          var resData = res.data.data;
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '提示',
            template: res.data.msg
          }).then(function (res) {
            fun(resData);
          })
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '数据上传失败'
          });
        }
      }, function (error) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '数据上传失败'
        });
      });
    }


  }
})();

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

(function () {
  'use strict';

  angular
    .module('app.commonMap')
    .config(CommonMapConfig);

  CommonMapConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function CommonMapConfig($stateProvider) {
    $stateProvider
      .state('commonMap', {
        url: '/commonMap',
        params: {data: null, from: ''},
        templateUrl: 'templates/common/map/commonMap.html'
      });
  }
}());


(function () {
  'use strict';

  angular
    .module('app.commonMap')
    .service('CommonMapService', CommonMapService);

  CommonMapService.$inject = ['$http', '$ionicLoading', '$ionicPopup', 'SYS_INFO', '$cordovaGeolocation'];

  /** @ngInject */
  function CommonMapService($http, $ionicLoading, $ionicPopup, SYS_INFO, $cordovaGeolocation) {

    var service = {
      initMap: initMap,
      initRoadMap: initRoadMap,
      initInstallationMap: initInstallationMap,
      initMyPosition: initMyPosition,
      getCoordinateInfo: getCoordinateInfo,
      getAddressByLatitudeAndLongitude: getAddressByLatitudeAndLongitude,
      getAddressByGPS: getAddressByGPS,
      getLocationByLatitudeAndLongitude: getLocationByLatitudeAndLongitude
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


    function initRoadMap(roadArray) {
      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>地图数据加载中...</span>' +
          '</div>',
          duration: 5 * 1000
        });

      var mapObj = new AMap.Map('map');
      map.setZoom(10);
      map.setCenter([116.39, 39.9]);

      $ionicLoading.hide();
    }

    function initInstallationMap(positionX, position) {
      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>地图数据加载中...</span>' +
          '</div>',
          duration: 20 * 1000
        });

      var position = new AMap.LngLat(116.397428, 39.90923);

      var mapObj = new AMap.Map('map', {

        view: new AMap.View2D({

          center: position,

          zoom: 10,

          rotation: 0

        }),

        lang: 'zh_cn'

      });

      $ionicLoading.hide();
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


    //使用Cordova使用GPS定位获取详细的GPS坐标
    function getCoordinateInfoNoDialog(fun) {
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
        }, function (err) {
          //如果获取GPS失败，那么设置GPS地点为公司的经纬度
          positionArray[0] = 120.41317;
          positionArray[1] = 36.07705;
          fun(positionArray);
          $ionicLoading.hide();
          console.log('获取坐标失败：' + 'code:' + err.code + '***' + 'msg:' + err.msg);
        });
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
    function getAddressByLatitudeAndLongitude(dataArray) {
      var locationObj = {};
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          city: "010"//城市，默认：“全国”
        });
        geocoder.getAddress(dataArray, function (status, result) {
          if (status == 'complete') {
            locationObj.address = result.regeocode.formattedAddress;//定位的详细的地点
            locationObj.city = result.regeocode.addressComponent.city;//城市
            locationObj.district = result.regeocode.addressComponent.city + result.regeocode.addressComponent.district;//城市+市区
            locationObj.street = result.regeocode.addressComponent.street;//路
            locationObj.township = result.regeocode.addressComponent.township;//街道
            locationObj.streetNumber = result.regeocode.addressComponent.streetNumber;//楼号
            console.log('根据经纬度来获取定位地点返回的数据：');
            console.log(result);
            console.log('根据经纬度来获取定位地点的的各种信息:');
            console.log(locationObj);
            return locationObj;
          }else{
            return locationObj;
          }
        })
      });
      return locationObj;
    }


    /**
     * 根据经纬度来获取详细的地理位置
     * @param dataArray
     * @param fun
     */
    function getLocationByLatitudeAndLongitude(dataArray, fun) {
      var location = '';
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          city: "010"//城市，默认：“全国”
        });
        geocoder.getAddress(dataArray, function (status, result) {
          if (status == 'complete') {
            location = result.regeocode.formattedAddress;
            fun(location);
          } else {
            fun(location);
          }
          console.log('根据经纬度来获取详细的地理位置：');
          console.log(result);
        })
      });
    }


    function getLatitudeAndLongitudeBySlide(dataArray, map) {
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          city: "010"//城市，默认：“全国”
        });
        var marker = new AMap.Marker({
          map: map,
          bubble: true
        })

        geocoder.getAddress(dataArray, function (status, result) {

          if (status == 'complete') {
            alert(status + result.regeocode.formattedAddress);
          }
          // map.on('click', function (e) {
          //     marker.setPosition(e.lnglat);
          //     geocoder.getAddress(e.lnglat, function (status, result) {
          //         alert(status+result);
          //         if (status == 'complete') {
          //             alert(status + result.regeocode.formattedAddress);
          //         }
          //     })
        })

      });
    }


    /**
     * 网格化巡检定位城市和街道(通过调用手机的GPS进行获取定位)
     * @param fun
     */
    function getAddressByGPS(fun) {
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
                var locationObj = {};
                locationObj.district = result.regeocode.addressComponent.city + result.regeocode.addressComponent.district;
                locationObj.street = result.regeocode.addressComponent.street;
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
          // //如果获取GPS失败，那么设置GPS地点为公司的经纬度
          // var defaultPosition = [120.41317, 36.07705];
          // $ionicLoading.hide();
          // console.log('获取坐标失败：' + 'code:' + err.code + '***' + 'msg:' + err.msg);
          // AMap.plugin('AMap.Geocoder', function () {
          //   var geocoder = new AMap.Geocoder({
          //     city: "010"//城市，默认：“全国”
          //   });
          //   geocoder.getAddress(defaultPosition, function (status, result) {
          //     if (status == 'complete') {
          //       var locationObj = {};
          //       locationObj.district = result.regeocode.addressComponent.city + result.regeocode.addressComponent.district;
          //       locationObj.street = result.regeocode.addressComponent.street;
          //       fun(locationObj);
          //       console.log(result);
          //     } else {
          //       console.log('获取地理位置信息失败！' + status + result);
          //     }
          //   })
          // });
          //如果获取GPS失败那么返回空的字符串，并提示重新获取
          $ionicLoading.hide();
          var locationObj = {};
          locationObj.district = '';
          locationObj.street = '';
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
        });      //返回定位出错信息
      });
    }

  }
})();

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
          vm.address = res;
        });
        vm.map.on('click', function (e) {
          vm.marker.setPosition(e.lnglat);
          vm.position = e.lnglat;
          //获取详细的地点
          CommonMapService.getLocationByLatitudeAndLongitude(e.lnglat, function (res) {
            vm.address = res;
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
          vm.address = res;
        });
      });
    }

    //通过本地缓存来给上一个页面传值
    function sendPosition() {
      if ($cacheFactory.get('cacheGridCheckMapData')) {
        console.log('$cacheFactory:cacheGridCheckMapData');
        console.log($cacheFactory.get('cacheGridCheckMapData'));
        $cacheFactory.get('cacheGridCheckMapData').destroy();
      } else {
        var cacheMapData = $cacheFactory('cacheGridCheckMapData');
        cacheMapData.put('position', vm.position);
        cacheMapData.put('address', vm.address);
        console.log('存储在本地的定位的相关数据：');
        console.log(cacheMapData);
        $ionicHistory.goBack();
      }
    }


  }
})();

(function () {
  'use strict';

  angular
    .module('app.gridCheckMap')
    .config(GridCheckConfig);

  GridCheckConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function GridCheckConfig($stateProvider) {
    $stateProvider
      .state('gridCheckMap', {
        url: '/gridCheckMap',
        params: {mapData: null},
        cache:true,
        templateUrl: 'templates/gridCheck/gridCheckMap/gridCheckMap.html'
      });
  }
}());


(function () {
  'use strict';

  angular
    .module('app.savedData')
    .controller('SavedDataController', SavedDataController);

  SavedDataController.$inject = ['SavedDataService'];

  function SavedDataController(SavedDataService) {
    var vm = this;
    vm.title = '本地内容';
    vm.savedData = {
      data: [
        {time: '2017/8/10/pm8:00', address: '山东路', points: '-1', reason: '道路不净', remark: '这是备注', img: []},
        {time: '2017/8/10/pm6:00', address: '银川路', points: '-2', reason: '垃圾桶占路', remark: '这是备注', img: []},
        {time: '2017/8/10/pm9:00', address: '镇江路', points: '-1', reason: '道路不净', remark: '这是备注', img: []},
        {time: '2017/8/10/pm10:00', address: '江西路', points: '-2', reason: '垃圾桶占路', remark: '这是备注', img: []}
      ]
    };

    vm.fun = {
      uploadData: uploadData,
      deleteSavedData: deleteSavedData
    };

    activate();

    function activate() {
      vm.savedData = SavedDataService.getSavedUploadedData();
    }

    function uploadData(item) {

    }

    function deleteSavedData(item) {

    }

  }
})();

(function () {
  'use strict';

  angular.module('app.savedData')
    .config(SavedDataRouteConfig);

  SavedDataRouteConfig.$inject = ['$stateProvider'];

  function SavedDataRouteConfig($stateProvider) {
    $stateProvider
      .state('savedData', {
        url: '/savedData',
        cache:true,
        templateUrl: 'templates/home/savedData/savedData.html'
      });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.savedData')
    .service('SavedDataService', SavedDataService)


  SavedDataService.$inject = ['$stateParams'];

  function SavedDataService($stateParams) {

    var service = {
      getSavedUploadedData: getSavedUploadedData,
      uploadData: uploadData,
      deleteSavedData: deleteSavedData
    }


    return service;

    function getSavedUploadedData() {
      if ($stateParams.savedData) {
        return $stateParams.savedData;
      }
    }

    function uploadData(data) {

    }

    function deleteSavedData() {

    }

  }

})();

(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .controller('MessageContentController', MessageContentController);

  MessageContentController.$inject = ['$scope', 'MessageContentService', '$stateParams', '$cordovaFileTransfer'];

  /** @ngInject */
  function MessageContentController($scope, MessageContentService, $stateParams, $cordovaFileTransfer) {

    var vm = this;
    vm.title = '消息详情';
    vm.msgView = {};
    vm.msg = {};
    vm.msgId = '';
    vm.fun = {
      downloadFile: downloadFile
    }

    activate();


    function activate() {
      if ($stateParams.msgId) {
        vm.msgId = $stateParams.msgId;
      }
      getMessagesContent();
    }

    function getMessagesContent() {
      MessageContentService.getMessagesByMsgId(vm.msgId, function (resData) {
        if (resData[0]) {
          vm.msgView = resData[0].msgView[0];
          vm.msg = resData[0].msg[0];
        }
      });
    }

    function downloadFile(fileUrl) {
      var url = 'http://172.72.100.61:8090/hwweb/Trash/export?ids=fbe58ca3-5909-4bf4-988d-b82b5146f7cb,6792d9ac-2078-42d5-b3d0-60ac1099e1e6';
      var filename = url.split("/").pop();
      alert(filename);
      var targetPath = cordova.file.externalRootDirectory + filename;
      alert(cordova.file.externalRootDirectory);
      var trustHosts = true;
      var options = {};
      $cordovaFileTransfer.download(fileUrl, targetPath, options, trustHosts)
        .then(function (result) {
          // Success!
          alert(JSON.stringify(result));
        }, function (error) {
          // Error
          alert(JSON.stringify(error));
        }, function (progress) {
          $timeout(function () {
            $scope.downloadProgress = (progress.loaded / progress.total) * 100;
          })
        });
      console.log(cordova.file.externalApplicationStorageDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/
      console.log(cordova.file.dataDirectory); //file:///data/user/0/com.bntake.driver.in/files/
      console.log(cordova.file.externalDataDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/files/
      console.log(cordova.file.externalRootDirectory);//file:///storage/emulated/0/
      console.log(cordova.file.externalCacheDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/cache/
      console.log(cordova.file.applicationStorageDirectory); //file:///data/user/0/com.bntake.driver.in/
      console.log(cordova.file.cacheDirectory); //file:///data/user/0/com.bntake.driver.in/cache/
      console.log(cordova.file);  //object
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .config(messageContentConfig);

  messageContentConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function messageContentConfig($stateProvider) {
    $stateProvider
      .state('messageContent', {
        url: '/messageContent/:msgId',
        templateUrl: 'templates/message/messageContent/messageContent.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .service('MessageContentService', MessageContentService);

  MessageContentService.$inject = ['MyHttpService'];

  /** @ngInject */
  function MessageContentService(MyHttpService) {
    var service = {
      getMessagesByMsgId: getMessagesByMsgId
    };

    return service;

    function getMessagesByMsgId(msgId, fun) {
      var url = '/hwweb/AppMessage/msgView.action?msgId=' + 12;
      MyHttpService.getCommonData(url, fun);
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .controller('ProblemFeedbackDetailsController', ProblemFeedbackDetailsController);

  ProblemFeedbackDetailsController.$inject = ['$scope', '$rootScope', '$stateParams',
    'ProblemFeedbackDetailsService', '$ionicPopup', '$ionicHistory','$cordovaCamera'];

  /** @ngInject */
  function ProblemFeedbackDetailsController($scope, $rootScope, $stateParams,
                                            ProblemFeedbackDetailsService, $ionicPopup, $ionicHistory,$cordovaCamera) {
    var vm = this;
    vm.title = '问题详情'
    vm.fromWhere = '';
    vm.data = {};//从上一页面传递过来的数据要存储到这个data中
    vm.problemDetails = {
      id: '',
      planId: ''
    };
    vm.footerContent = '确定'
    vm.fun = {
      initCamera: initCamera,
      uploadProblemFeedbackData: uploadProblemFeedbackData,
      deletePic: deletePic
    }
    vm.uploadData = {
      id: '',
      planId: '',
      feedbackDescription: '',
      feedbackUser: '',
      img: ''
    };
    vm.imgPath = '';

    activate();

    function activate() {

      if ($stateParams.problemItem) {
        vm.data = $stateParams.problemItem;
      }
      if ($stateParams.fromWhere) {
        vm.fromWhere = $stateParams.fromWhere;
      }

      switch (vm.fromWhere) {
        case 'waitForWork':
          ProblemFeedbackDetailsService.getProblemDetailsData(vm.data, function (resData) {
            if (resData.length == 0) {//resData的格式是[]如果resData是个空数组，取resData[0]时会得到undefined，所以需要判断
            } else {
              vm.problemDetails = resData[0];
            }
            ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
          });
          break;
        case 'problemFeedback':
          vm.problemDetails = $stateParams.problemItem;
          ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
          break
        default:
          ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
          break;
      }
    }


    function initCamera() {

      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 200,
        targetHeight: 200,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        var image = document.getElementById('problemFeedbackDetailsImg');
        image.src = "data:image/jpeg;base64," + imageData;
        vm.imgPath = moment().format('YYYY-MM-DD HH:mm:ss') + '.jpeg';
        vm.uploadData.img = imageData;
      }, function (err) {
        $ionicPopup.alert({
          title: '照片获取失败，请重新拍照!'
        });
      });
    }


    function uploadProblemFeedbackData() {
      vm.uploadData.id = vm.problemDetails.id;
      vm.uploadData.planId = vm.problemDetails.planId;
      vm.uploadData.feedbackUser = $rootScope.userName;
      if (vm.uploadData.id == '' || vm.uploadData.planId == '' || vm.uploadData.feedbackUser == '') {
        $ionicPopup.alert({
          title: '提示信息',
          template: '数据不全无法上传数据！'
        })
      } else if (vm.uploadData.feedbackDescription == '' || vm.uploadData.img == '') {
        $ionicPopup.confirm({
          title: '提示信息',
          template: '整改情况未填或者没有拍照，确认要上传么？'
        }).then(function (res) {
          if (res) {
            ProblemFeedbackDetailsService.uploadProblemFeedbackData(vm.uploadData, function (res) {
              $ionicHistory.goBack();
            });
          } else {
            return;
          }
        });
      }
    }

    //长按删除某张图片
    function deletePic() {

      $ionicPopup.confirm({
        title: '提示信息',
        template: '确认要删除这张照片么？'
      }).then(function (res) {
        if (res) {
          vm.uploadData.img = '';
          var image = document.getElementById('problemFeedbackDetailsImg');
          image.src = '';
        } else {
          return;
        }
      });


    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .config(ProblemFeedbackDetailsConfig);

  ProblemFeedbackDetailsConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ProblemFeedbackDetailsConfig($stateProvider) {
    $stateProvider
      .state('problemFeedbackDetails', {
        url: '/problemFeedbackDetails',
        params: {problemItem: null, fromWhere: ''},
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/problemFeedback/problemFeedbackDetails/problemFeedbackDetails.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .service('ProblemFeedbackDetailsService', ProblemFeedbackDetailsService);

  ProblemFeedbackDetailsService.$inject = ['MyHttpService', 'AddAssessmentMapService'];

  /** @ngInject */
  function ProblemFeedbackDetailsService(MyHttpService, AddAssessmentMapService) {

    var service = {
      getProblemFeedbackDetailsMap: getProblemFeedbackDetailsMap,
      uploadProblemFeedbackData: uploadProblemFeedbackData,
      getProblemDetailsData: getProblemDetailsData
    };

    return service;


    function getProblemFeedbackDetailsMap(positionObj) {

      console.log('问题饭详情页面的相关数据')
      console.log(positionObj);
      var point = AddAssessmentMapService.getPositionArray(positionObj.point);
      if (point.length <= 0) {
        point = null;
      } else {
        point = point[0];
      }
      console.log('问题饭详情页面设施坐标')
      console.log(point);

      var map = new AMap.Map('problemFeedbackDetailsMap', {
        resizeEnable: true,
        zoom: 15,
        center: point
      });

      var marker = new AMap.Marker({
        position: point,
        map: map
      });

      map.plugin(['AMap.ToolBar'], function () {
        var toolBar = new AMap.ToolBar();
        map.addControl(toolBar);
      });

    }

    //这是代办任务跳转到这个页面获取数据的方法
    function getProblemDetailsData(data, fun) {
      var url = '/hwweb/GridInspection/CheckProblemById.action?planId=' + data.id;
      MyHttpService.getCommonData(url, fun);
    }

    function uploadProblemFeedbackData(jsonObj, fun) {
      var url = '/hwweb/GridInspection/UploadProblem.action';
      var jsonStr = JSON.stringify(jsonObj);
      MyHttpService.uploadCommonData(url, jsonStr, fun);
    }

  }
})();

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
          image: '../assets/global/map/marker.png',//24px*24px
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

(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .config(AddAssessmentMapConfig);

  AddAssessmentMapConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AddAssessmentMapConfig($stateProvider) {
    $stateProvider
      .state('addAssessmentMap', {
        url: '/addAssessmentMap',
        params: {mapPositionObj: null, from: null},
        templateUrl: 'templates/assessment/addAssessment/addAssessmentMap/addAssessmentMap.html'
      });
  }
}());


(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .service('AddAssessmentMapService', AddAssessmentMapService);

  AddAssessmentMapService.$inject = [];

  /** @ngInject */
  function AddAssessmentMapService() {
    var service = {
      initAddAssessmentMap: initAddAssessmentMap,
      getPositionArray: getPositionArray
    }

    return service;

    function initAddAssessmentMap() {
    }


    function getPositionArray(string) {
      var roadPositionArray = [];
      if (string && string.indexOf(',') >= 0) {
        var temArray = string.split(',');
        for (var i = 0; i < temArray.length - 1; i = i + 2) {
          var array = new Array();
          array[0] = temArray[i];
          array[1] = temArray[i + 1];
          roadPositionArray.push(array);
        }
        return roadPositionArray;
      }
      return roadPositionArray;
    }


  }
})();
