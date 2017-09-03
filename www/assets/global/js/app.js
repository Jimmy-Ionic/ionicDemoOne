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
    'app.savedDataModule',
    'app.waitForWork',
    'app.assessment',
    'app.planDetails',
    'app.assessmentStatus',
    'app.assessmentStatusDetails',
    'app.addAssessment',
    'app.addAssessmentMap',
    'app.gridCheck',
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
      'SERVER_PATH': 'http://172.72.100.240',
      'SERVER_PORT': '8090',
      'VERSION': '1.0.0',
      // TODO: 数据小数位数（统一设置手机应用中数据的小数位数，可以根据实际情况修改）
      'DIGITS': 2
    })
    .controller('AppController', AppController);

  AppController.$inject['$scope', '$rootScope', '$interval', '$http', ' $ionicHistory', '$state','LoginService'];

  function AppController($scope, $rootScope, $interval, $http, $ionicHistory, $state,LoginService) {
    $rootScope.unReadMsgCount = 0;
    $rootScope.goBack = goBack;
    $rootScope.toMessagePage = toMessagePage;

    var messageApi = '';

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

  angular.module('app.setNet', []);
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

  angular.module('app.accountDetails', []);
})();

(function () {
  'use strict';

  angular.module('app.addAssessment', []);
})();

(function () {
  'use strict';

  angular.module('app.assessmentStatusDetails', []);
})();

(function () {
  'use strict';

  angular.module('app.assessmentStatus', []);
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

  angular.module('app.savedDataModule',[]);
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

  AccountController.$inject = ['$scope'];
  /** @ngInject */
  function AccountController($scope) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
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
        templateUrl: 'templates/account/account.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.account')
    .service('AccountService', AccountService);

  AccountService.$inject = ['$http'];
  /** @ngInject */
  function AccountService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
  'use strict';

  angular
    .module('app.assessment')
    .controller('AssessmentController', AssessmentController);

  AssessmentController.$inject = ['$rootScope', '$scope', '$state', 'AssessmentService', '$ionicLoading', '$ionicPopup', '$timeout', '$ionicHistory'];

  /** @ngInject */
  function AssessmentController($rootScope, $scope, $state, AssessmentService, $ionicLoading, $ionicPopup, $timeout) {

    var vm = this;
    vm.title = '综合考核';
    vm.titleController = {}

    vm.toPlanDetails = toPlanDetails;

    vm.planList = [
      {
        id: '1',
        workName: '6月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: '2',
        workName: '7月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '3',
        workName: '8月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '5',
        workName: '10月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '6',
        workName: '11月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: '7',
        workName: '12月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      }
    ];


    activate();


    function activate() {
      // vm.planList = AssessmentService.getPlanList($rootScope.userId);
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {assessmentData: item, fromWhere: 'assessment'});
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


    function getPlanList(userId) {
      var path = '' + userId;
      return MyHttpService.getCommonData(path);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .controller('GridCheckController', GridCheckController);

  GridCheckController.$inject = ['$scope', '$state', 'GridCheckService', 'CommonMapService', '$ionicPopup', '$ionicLoading', '$cordovaFileTransfer'];

  /** @ngInject */
  function GridCheckController($scope, $state, GridCheckService, CommonMapService, $ionicPopup, $ionicLoading, $cordovaFileTransfer) {

    var vm = this;
    vm.title = '网格化巡检';
    vm.picPath = 'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg';
    vm.picData ='';
    vm.picName = '';

    vm.selectedQuesCode = '';
    vm.questionCode = [];
    vm.question = '';
    vm.locationObj = {
      district: '',
      street: ''
    };

    vm.fun = {
      toGridCheckMap: toGridCheckMap,
      takeGridCheckPicture: takeGridCheckPicture,
      getGridCheckLocation: getGridCheckLocation,
      uploadGridCheckData: uploadGridCheckData
    }


    activate();

    function activate() {
      var data = GridCheckService.getGridCheckQuestionCodeArray();
      if (data) {
        vm.questionCode = data;
      } else {
        vm.questionCode = ['道路不干净', '垃圾桶占路'];
      }
    }

    function toGridCheckMap() {
      $state.go('commonMap', {data: {}, from: 'gridCheck'});
    }

    function takeGridCheckPicture() {

      var options = {
        quality: 50,
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
        $ionicPopup.alert({
          title: 'sdda',
          template: 'deviceready获取图片' + imageData + ' ' + new moment().unix()
        });

        var image = document.getElementById('img');
        image.src = "data:image/jpeg;base64," + imageData;
        vm.picName = moment().format('YYYY-MM-DD-HH:mm:ss')+'.jpg';
        vm.picData = imageData;
        console.log(vm.picName);
      }, function (err) {
        $ionicPopup.alert({
          title: '照片获取失败，请重新拍照',
        });
      })
    }

    function getGridCheckLocation() {
      CommonMapService.getAddressByGPS(function (res) {
        vm.locationObj.district = res.district;
        vm.locationObj.street = res.street;
        $scope.$apply();
      });
    }

    function uploadGridCheckData() {
      GridCheckService.uploadGridCheckData();
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
        params: {position: []},
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/gridCheck/gridCheck.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .service('GridCheckService', GridCheckService);

  GridCheckService.$inject = ['MyHttpService', '$ionicPopup', '$ionicLoading'];

  /** @ngInject */
  function GridCheckService(MyHttpService, $ionicPopup, $ionicLoading) {

    var service = {
      getGridCheckQuestionCodeArray: getGridCheckQuestionCodeArray,
      uploadGridCheckData: uploadGridCheckData
    }

    return service;


    function getGridCheckQuestionCodeArray() {
      return MyHttpService.getCommonData();
    }


    function uploadGridCheckData(data) {

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        });

      var options = new FileUploadOptions();

      var params = {
        facilityIdentify: '217ae60e5bc746f',
        cyberkeyCode: 'AQOhlmsQAAKgCoi',
        tenantId: 1
      };
      options.params = params;

      $cordovaFileTransfer.upload(encodeURI(url),data, options).then(function (result) {
        console.log(JSON.stringify(result.response));
        console.log("success");
        $ionicLoading.hide();

      }, function (err) {
        console.log(JSON.stringify(err));
        console.log("fail");
        $ionicLoading.hide();
      }, function (progress) {

      })
    }


  }
})();

(function () {
  'use strict';

  angular
    .module('app.history')
    .controller('HistoryController', HistoryController);

  HistoryController.$inject = ['$scope', 'HistoryService'];

  /** @ngInject */
  function HistoryController($scope, HistoryService) {
    var vm = this;
    vm.title = '历史考核记录';
    vm.fun = {
      toPlanDetails:toPlanDetails
    }

    vm.toPlanDetails = toPlanDetails;

    vm.historyList = [
      {
        id: '1',
        workName: '6月份考核计划',
        year: '2017年',
        month: '六月'
      },
      {
        id: '2',
        workName: '7月份考核计划',
        year: '2017年',
        month: '七月'
      },
      {
        id: '3',
        workName: '8月份考核计划',
        year: '2017年',
        month: '八月'
      },
      {
        id: '4',
        workName: '9月份考核计划',
        year: '2017年',
        month: '九月'
      }
    ];


    activate();


    function activate() {
      // vm.historyList = HistoryService.getHistoryData($rootScope.userId);
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {assessmentData: item, fromWhere: 'history'});
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

  HistoryService.$inject = ['$http','MyHttpService'];
  /** @ngInject */
  function HistoryService($http,MyHttpService) {
    var service = {
      getHistoryData:getHistoryData,
      getHistoryDataByCondition:getHistoryDataByCondition
    };

    return service;

    function getHistoryData(userId) {
      var url = '';
      return MyHttpService.getCommonData(url);
    }

    function getHistoryDataByCondition(year,month,other) {
      var url = '';
      return MyHttpService.getCommonData(url);
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
    '$interval'
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
                          $interval) {
    var vm = this;
    vm.title = '请选择工作';
    vm.hasSavedData = true;
    vm.saveDataNum = '20';
    vm.savedData = {};
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
    };

    activate();


    function activate() {
      if (GetWeatherService.getWeather()) {
        vm.weather = GetWeatherService.getWeather();
      }
      console.log(vm.weather);

      vm.savedData = HomeService.getSavedUploadedData();
      if (vm.savedData) {
        vm.hasSavedData = true;
        vm.saveDataNum = vm.savedData.length;
      } else {
        // vm.savedData = false;
      }

    }


    function toWaitForWork() {
      $state.go('waitForWork');
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
      $state.go('savedData', {savedData: vm.savedData});
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

  function GetWeatherService($http, SYS_INFO, $interval) {

    var weatherApi = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/Weather/WeatherJson.action'

    var weatherInfo = {}

    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }

    var fun = {
      getWeather: getWeather
    };

    return fun;


    function getWeather() {
      $http.get(weatherApi)
        .then(function (response) {
          if (response.data) {
            weatherInfo.weatherDate = new Date().Format('MM月dd日');
            weatherInfo.address = '青岛'
            weatherInfo.temperature = getTemperature(response.data);
            weatherInfo.weather = response.data.data.forecast[0].type;
          } else {
            weatherInfo.weatherDate = new Date().Format('MM月dd日');
            weatherInfo.address = '青岛';
            weatherInfo.temperature = '20度';
            weatherInfo.weather = '晴';
          }
        }, function (response) {
          weatherInfo.weatherDate = new Date().Format('MM月dd日');
          weatherInfo.address = '青岛';
          weatherInfo.temperature = '20度';
          weatherInfo.weather = '晴';
        });
      console.log(weatherInfo);
      return weatherInfo;
    }


    function getTemperature(data) {
      if (data.data) {
        var low = data.data.forecast[0].low.substring(3, 5);
        var high = data.data.forecast[0].high.substring(3, 5);
        var temperature = low + '~' + high + '度';
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
    '$cordovaCamera'
  ];

  function LoginController($scope,
                           $state,
                           LoginService,
                           $cordovaCamera) {

    $scope.doLogin = doLogin;
    $scope.setNetAddress = setNetAddress;

    $scope.isCommonAccount = false;
    $scope.userInfo = LoginService.getUserInfo();
    $scope.imei = '123456';

    $scope.info = {
      userName: $scope.userInfo.userName,
      password: $scope.userInfo.password,
      isRemAccountAndPwd: $scope.userInfo.isRemAccountAndPwd
    };


    // LoginService.setServerInfo();


    function setNetAddress() {
      $state.go('setNet', {imei: $scope.imei});
    }


    function doLogin() {
      // LoginService.login($scope.info.userName, $scope.info.password, $scope.imei, $scope.isCommonAccount, $scope.info.isRemAccountAndPwd,$scope.info)
      $state.go('home');
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
              success(response, isRemAccountAndPwd,info);
            }, function (response) {
              error(response)
            });
          break;
        case  true:
          $http.get(SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + path + 'account=' + userName + '&' + 'password=' + pwd)
            .then(function (response) {
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

  MapController.$inject = ['$scope','GetWeatherService','MyMapService'];
  /** @ngInject */
  function MapController($scope,GetWeatherService,MyMapService) {
    var vm = this;
    vm.title = '地图查询';
    vm.position = '市南区';

    vm.weather = {};

    activate();

    function activate() {
      var weatherInfo = GetWeatherService.getWeather();
      if (weatherInfo) {
        vm.weather = weatherInfo;
      }

      MyMapService.initMap();

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

  MapService.$inject = ['$http'];

  /** @ngInject */
  function MapService($http) {
    var service = {
      initMap: initMap
    }

    return service;

    function initMap() {
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$scope','MessageService'];
  /** @ngInject */
  function MessageController($scope,MessageService) {

    var vm = this;
    vm.title = '已收到消息';
    vm.refreshMessageList = refreshMessageList;
    vm.openMsgContent = openMsgContent;

    vm.messages = [
      {title:'测试消息1',status:0,date:'2017/8/10',content:'有要事相讨~','attachmentAddress':'http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg'},
      {title:'测试消息1',status:1,date:'2017/8/10',content:'有要事相讨~','attachmentAddress':'http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg'},
      {title:'测试消息1',status:0,date:'2017/8/10',content:'有要事相讨~','attachmentAddress':'http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg'},
      {title:'测试消息1',status:1,date:'2017/8/10',content:'有要事相讨~','attachmentAddress':'http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg'}
    ];

    activate();

    function activate() {
      // vm.messages = MessageService.getMessage();
    }


    function refreshMessageList() {

    }

    function openMsgContent(msg) {

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

  MessageService.$inject = ['$http', 'SYS_INFO'];

  /** @ngInject */
  function MessageService($http, SYS_INFO) {
    var service = {
      getMessage:getMessages
    };

    return service;


    function getMessages() {
      var url = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT;
      $http.get(url, function (response) {
         if(response.data.success == 1){
           var messages = response.date.data;
           return messages;
         }else{
           return;
         }
      }, function (response) {
         return;
      });

    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.problemFeedback')
    .controller('ProblemFeedbackController', ProblemFeedbackController);

  ProblemFeedbackController.$inject = ['$scope'];
  /** @ngInject */
  function ProblemFeedbackController($scope) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
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
    .module('app.setting')
    .service('userInfoService', userInfoService);

  userInfoService.$inject = ['$http'];
  /** @ngInject */
  function userInfoService($http) {
    var service = {};

    return service;

  }
})();

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
    $scope.IMEI = $stateParams.imei;

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
      var weatherInfo = GetWeatherService.getWeather();
      if (weatherInfo) {
        vm.weather = weatherInfo;
      }
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
    vm.title = '代办工作';
    vm.titleController = {
    }
    vm.toJobDetails = toJobDetails;

    vm.workList = [
      {
        id: "cc07edd7-892a-4bf0-96dc-52301699663c",
        planName: '6月份综合考核',
        sDate: '2017/6/1',
        eDate: '2017/6/1'
      },
      {
        id: "cc07edd7-892a-4bf0-96dc-52301699663c",
        planName: '6月份综合考核',
        sDate: '2017/6/1',
        eDate: '2017/6/1'
      },
      {
        id: "cc07edd7-892a-4bf0-96dc-52301699663c",
        planName: '6月份综合考核',
        sDate: '2017/6/1',
        eDate: '2017/6/1'
      },
      {
        id: "cc07edd7-892a-4bf0-96dc-52301699663c",
        planName: '6月份综合考核',
        sDate: '2017/6/1',
        eDate: '2017/6/1'
      }
    ];


    activate();


    function activate() {
      console.log($rootScope.userId);
      vm.workList = WaitForWorkService.getWaitForWorkInfo($rootScope.userId);
      console.log(vm.workList);
    }


    function toJobDetails(item) {
      if (item.sDate == '无') {
        $state.go('assessmentStatus', {planDetailsData: item})
      } else {
        $state.go('planDetails', {assessmentData: item, fromWhere: 'waitForWork'})
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


    var workList = [];

    var service = {
      getWaitForWorkInfo: getWaitForWorkInfo
    };

    return service;

    function getWaitForWorkInfo(userId) {
      var path = '/hwweb/AssignmentAssessment/findDataByUserId?userId=' + userId;
      var data = MyHttpService.getCommonData(path);
      return data;
    }
  }
})
();

(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .controller('AccountDetailsController',AccountDetailsController);

  AccountDetailsController.$inject = ['$scope'];
  /** @ngInject */
  function AccountDetailsController($scope) {
    var vm = this;
    vm.installationName = '';

    activate();

    ////////////////

    function activate() {
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
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        templateUrl: 'templates/account/account.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.accountDetails')
    .service('AccountDetailsService', AccountDetailsService);

  AccountDetailsService.$inject = ['$http'];
  /** @ngInject */
  function AccountDetailsService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .controller('AddAssessmentController', AddAssessmentController);

  AddAssessmentController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AssessmentStatusDetailsService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function AddAssessmentController($rootScope, $scope, $state, $stateParams, AssessmentStatusDetailsService, $ionicLoading, $ionicPopup) {

    var vm = this;
    vm.data = {

    };
    vm.title = '录入计划';
    vm.fun = {
      toAddAssessmentMap:toAddAssessmentMap,
      takePicture:takePicture
    };


    vm.assessmentStatusDetailsList =
      {
        questionId: '1',
        address: '银川路',
        problem: '垃圾桶占路',
        cleaningLevel: '特级',
        roadLevel: '主干道',
        roadLength: '1600米',
        roadWidth: '30米',
        points: '-1.5',
        remarks: '备注',
        targetPosition: '129.134',
        picPath: [
          'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg',
          'http://www.chinagvs.com/ShopHome/Tpl/Public/images/left-logo.jpg',
          'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg'
        ]
      };


    activate();


    function activate() {

    }

    function toAddAssessmentMap() {
      $state.go('addAssessmentMap');
    }

    function takePicture() {

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
        templateUrl: 'templates/assessment/addAssessment/addAssessment.html'
      });
  }
}());


(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .service('AddAssessmentService', AddAssessmentService);

  AddAssessmentService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera'];

  /** @ngInject */
  function AddAssessmentService($http, SYS_INFO, $cordovaCamera) {
    var service = {
      addNewAssessment: addNewAssessment,
      getPhonePictureData: getPhonePictureData,
      getPhonePicturePath: getPhonePicturePath
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
  }
})();

(function () {
  'use strict';

  angular
    .module('app.assessmentStatusDetails')
    .controller('AssessmentStatusDetailsController', AssessmentStatusDetailsController);

  AssessmentStatusDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AssessmentStatusDetailsService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function AssessmentStatusDetailsController($rootScope, $scope, $state, $stateParams, AssessmentStatusDetailsService, $ionicLoading, $ionicPopup) {

    var vm = this;
    // vm.data = $stateParams.assessmentStatusData;
    vm.data = {};
    vm.title = '';
    vm.titleController = {
      backToBeforePage: backToBeforePage,
      enterMsg: enterMsg
    }
    vm.initAmap = initAmap;

    vm.assessmentStatusDetailsList =
      {
        questionId: '1',
        address: '银川路',
        problem: '垃圾桶占路',
        cleaningLevel: '特级',
        roadLevel: '主干道',
        roadLength: '1600米',
        roadWidth: '30米',
        points: '-1.5',
        remarks: '备注',
        targetPosition: '129.134',
        picPath: [
          'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg',
          'http://www.chinagvs.com/ShopHome/Tpl/Public/images/left-logo.jpg',
          'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg'
        ]
      };


    activate();


    function activate() {

      // vm.assessmentStatusDetailsList=AssessmentStatusDetailsService.getAssessmentStatusDetailsList(vm.data.id);

      initAmap();
    }


    function initAmap() {

      var position = new AMap.LngLat(116.397428, 39.90923);

      $scope.mapObj = new AMap.Map('map', {

        view: new AMap.View2D({

          center: position,

          zoom: 10,

          rotation: 0

        }),

        lang: 'zh_cn'

      });
      console.log('走到这儿啦');
    }

    function backToBeforePage() {

    }

    function enterMsg() {

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
          assessmentStatusData:null
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

  AssessmentStatusDetailsService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera'];

  /** @ngInject */
  function AssessmentStatusDetailsService($http, SYS_INFO, $cordovaCamera) {
    var service = {
      getAssessmentStatusDetailsList: getAssessmentStatusDetailsList,
      getPhonePictureData: getPhonePictureData,
      getPhonePicturePath: getPhonePicturePath
    }


    return service;


    function getAssessmentStatusDetailsList(questionId) {
      var path = '' + questionId;
      return MyHttpService.getCommonData(path);
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
    vm.data = $stateParams.planDetailsData;
    vm.titleController = {
      backToBeforePage: backToBeforePage,
      enterMsg: enterMsg
    }
    vm.toAssessmentStatusDetails = toAssessmentStatusDetails;

    vm.assessmentStatusList = [
      {
        id: '1',
        address: '山东路',
        problem: '废弃物超标',
        points: '1'
      },
      {
        id: '2',
        address: '银川路',
        problem: '垃圾桶占路',
        points: '2'
      },
      {
        id: '3',
        address: '山东路',
        problem: '废弃物超标',
        points: '1'
      },
      {
        id: '4',
        address: '银川路',
        problem: '垃圾桶占路',
        points: '2'
      },
      {
        id: '5',
        address: '山东路',
        problem: '废弃物超标',
        points: '1'
      },
      {
        id: '6',
        address: '银川路',
        problem: '垃圾桶占路',
        points: '2'
      },
      {
        id: '7',
        address: '山东路',
        problem: '废弃物超标',
        points: '1'
      },
      {
        id: '8',
        address: '银川路',
        problem: '垃圾桶占路',
        points: '2'
      }
    ];


    activate();

    function activate() {

      // vm.assessmentStatusList = AssessmentStatusService.getAssessmentStatusList(vm.data.id);

    }

    function backToBeforePage() {

    }

    function enterMsg() {

    }

    function toAssessmentStatusDetails(item) {
      $state.go('assessmentStatusDetails', {assessmentStatusData: item})

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

  AssessmentStatusService.$inject = ['$http','SYS_INFO','MyHttpService'];
  /** @ngInject */
  function AssessmentStatusService($http,SYS_INFO,MyHttpService) {
    var service = {
      getAssessmentStatusList: getAssessmentStatusList
    }

    return service;

    function getAssessmentStatusList(planDetailId) {
      var path = '' + planDetailId;
      return MyHttpService.getCommonData(path);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .controller('PlanDetailsController', PlanDetailsController);

  PlanDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'PlanDetailsService', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function PlanDetailsController($rootScope, $scope, $state, $stateParams, PlanDetailsService, $ionicLoading, $ionicPopup) {
    var vm = this;
    vm.data = $stateParams.assessmentData;
    vm.title = vm.data.workName;
    // vm.fromWhere = $stateParams.fromWhere;
    vm.fromWhere = 'assessment'
    vm.fun = {
      toAddAssessment:toAddAssessment
    }
    vm.toAssessmentStatus = toAssessmentStatus;

    vm.planDetailsList = [
      {
        id: '1',
        name: '山东路',
        type: '道路',
        status: '0'
      },
      {
        id: '2',
        name: '香港路',
        type: '道路',
        status: '1'
      },
      {
        id: '3',
        name: '江西路',
        type: '道路',
        status: '1'
      },
      {
        id: '4',
        name: '宁夏路公厕',
        type: '道路',
        status: '1'
      },
      {
        id: '5',
        name: '银川路公厕',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },{
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },{
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      },
      {
        id: '6',
        name: '山东路',
        type: '道路',
        status: '1'
      }
    ];


    activate();


    function activate() {
      // PlanDetailsService.getPlanDetailsList(vm.data.id, vm.fromWhere);
    }


    function getDataFromFrontPage() {

    }


    function toAddAssessment() {
      $state.go('addAssessment');
    }

    function toAssessmentStatus(item) {
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
          assessmentData: null,
          formWhere:''
        },
        cache: true,
        templateUrl: 'templates/assessment/planDetails/planDetails.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .service('PlanDetailsService', PlanDetailsService);

  PlanDetailsService.$inject = ['$http', 'SYS_INFO'];

  /** @ngInject */
  function PlanDetailsService($http, SYS_INFO) {

    var service = {
      getPlanDetailsList: getPlanDetailsList
    }

    return service;


    function getPlanDetailsList(id, fromWhere) {

      var path = '';

      switch (fromWhere) {
        case 'waitForWork':
          path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
          break;
        case 'assessment':
          path = '';
          break;
        default:
          break;
      }

      return MyHttpService.getCommonData(path);

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
      getCommonData: getCommonData
    };

    return service;


    var data = [];


    function getCommonData(urlPath) {
      $ionicLoading.show(
        {
          templateUrl: 'templates/common/common.loadingData.html',
          duration: 20 * 1000
        });
      $http({
        method: 'GET',
        url: SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + urlPath
      }).then(function (response) {
        if (success) {
          success(response);
        }
      }, function (response) {
        if (error) {
          error(response);
        }
      });
      return data;
    }

    function success(response) {
      if (response.data.success == 1) {
        $ionicLoading.hide();
        data =  response.data.data;
      } else {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: response.data.msg
        }).then(function (res) {
        });
      }
    }

    function error(response) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: '获取数据失败',
        template: response.data
      }).then(function (res) {
      });
    }


    //上传数据通用方法

    function uploadData() {

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
        params: {'data': null, 'from': null},
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
      getAddressByGPS: getAddressByGPS
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

    //使用Cordova使用GPS定位获取详细的GPS坐标
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
          console.log('定位成功，坐标数组：' + positionArray);
        }, function (err) {
          //如果获取GPS失败，那么设置GPS地点为公司的经纬度
          positionArray[0] = 120.41317;
          positionArray[1] = 36.07705;
          fun(positionArray);
          $ionicLoading.hide();
          console.log('获取坐标失败：' + 'code:' + err.code + '***' + 'msg:' + err.msg);
        });
    }


    //根据经纬度来获取详细的地理位置
    function getAddressByLatitudeAndLongitude(dataArray) {
      var locationObj = {};
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          city: "010"//城市，默认：“全国”
        });
        geocoder.getAddress(dataArray, function (status, result) {
          if (status == 'complete') {
            locationObj.district = result.regeocode.addressComponent.city + result.regeocode.addressComponent.district;
            locationObj.street = result.regeocode.addressComponent.street;
            console.log(result);
            return locationObj;
          }
        })
      });
      return locationObj;
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


    //定位并且获取相应的地理位置信息
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
          // positionArray =  [120.41317, 36.07705];
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
                console.log(result);
              } else {
                console.log('获取地理位置信息失败！' + status + result);
              }
            })
          });
        }, function (err) {
          //如果获取GPS失败，那么设置GPS地点为公司的经纬度
          var defaultPosition = [120.41317, 36.07705];
          $ionicLoading.hide();
          console.log('获取坐标失败：' + 'code:' + err.code + '***' + 'msg:' + err.msg);
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
                console.log(result);
              } else {
                console.log('获取地理位置信息失败！' + status + result);
              }
            })
          });
        });

    }





  }
})();

(function () {
  'use strict';

  angular
    .module('app.savedDataModule')
    .controller('SavedDataController', SavedDataController);

  SavedDataController.$inject = [
    '$scope',
    '$state',
    '$filter',
    'Session',
    'homeService',
    'SYS_INFO',
    'GetWeather',
    '$stateParams',
    'SavedDataService'
  ];

  function SavedDataController($scope,
                               $state,
                               $filter,
                               Session,
                               homeService,
                               SYS_INFO,
                               GetWeather,
                               $stateParams,
                               SavedDataService) {
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

  angular.module('app.savedDataModule')
    .config(SavedDataRouteConfig);

  SavedDataRouteConfig.$inject = ['$stateProvider'];

  function SavedDataRouteConfig($stateProvider) {
    $stateProvider
      .state('savedData', {
        url: '/savedData',
        cache:true,
        params: {
          savedData: null
        },
        templateUrl: 'templates/home/savedData/savedData.html'
      });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.savedDataModule')
    .service('SavedDataService', SavedDataService)


  SavedDataService.$inject = ['$http', 'SYS_INFO', 'Session', '$interval', '$localStorage','$stateParams'];

  function SavedDataService($http, SYS_INFO, Session, $interval, $localStorage,$stateParams) {

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

  MessageContentController.$inject = ['$scope'];

  /** @ngInject */
  function MessageContentController($scope) {
    var vm = this;

    vm.title = '消息详情';

    activate();



    function activate() {
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
        url: '/messageContent',
        templateUrl: 'templates/message/messageContent/messageContent.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .service('MessageContentService', MessageContentService);

  MessageContentService.$inject = ['$http'];

  /** @ngInject */
  function MessageContentService($http) {
    var service = {

    };

    return service;

    function getMessage(url){

    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .controller('ProblemFeedbackDetailsController', ProblemFeedbackDetailsController);

  ProblemFeedbackDetailsController.$inject = ['$scope'];
  /** @ngInject */
  function ProblemFeedbackDetailsController($scope) {
    var vm = this;

    activate();

    function activate() {
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
    .module('app.problemFeedbackDetails')
    .service('ProblemFeedbackDetailsService', ProblemFeedbackDetailsService);

  ProblemFeedbackDetailsService.$inject = ['$http'];
  /** @ngInject */
  function ProblemFeedbackDetailsService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .controller('AddAssessmentMapController', AddAssessmentMapController);

  AddAssessmentMapController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AddAssessmentService'];

  /** @ngInject */
  function AddAssessmentMapController($rootScope, $scope, $state, $stateParams, AddAssessmentService) {

    var vm = this;
    vm.data = {};
    vm.title = '地图详情';
    vm.fun = {};


    vm.assessmentStatusDetailsList =
      {
        questionId: '1',
        address: '银川路',
        problem: '垃圾桶占路',
        cleaningLevel: '特级',
        roadLevel: '主干道',
        roadLength: '1600米',
        roadWidth: '30米',
        points: '-1.5',
        remarks: '备注',
        targetPosition: '129.134',
        picPath: [
          'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg',
          'http://www.chinagvs.com/ShopHome/Tpl/Public/images/left-logo.jpg',
          'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg'
        ]
      };


    activate();


    function activate() {
        AddAssessmentService.initAddAssessmentMap();
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
        templateUrl: 'templates/assessment/addAssessment/addAssessmentMap/addAssessmentMap.html'
      });
  }
}());


(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .service('AddAssessmentService', AddAssessmentService);

  AddAssessmentService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera', 'CommonMapService'];

  /** @ngInject */
  function AddAssessmentService($http, SYS_INFO, $cordovaCamera, CommonMapService) {
    var service = {
      initAddAssessmentMap: initAddAssessmentMap
    }

    return service;

    var center = [120.445467, 36.179479]

    function initAddAssessmentMap() {
        CommonMapService.initMap(center);
    }


  }
})();
