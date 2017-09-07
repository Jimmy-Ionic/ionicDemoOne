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
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '6月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '7月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '8月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '9月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '10月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/5'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
        workName: '11月份考核计划',
        startTime: '2017/6/1',
        endTime: '2017/6/1'
      },
      {
        id: 'cc07edd7-892a-4bf0-96dc-52301699663c',
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
      for(var i = 0;i<10;i++){

      }
      // AssessmentService.getPlanList($rootScope.userId, function (data) {
      //   vm.planList = data;
      // });
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


    function getPlanList(userId,fun) {
      var path = '' + userId;
      MyHttpService.getCommonData(path,fun);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.gridCheck')
    .controller('GridCheckController', GridCheckController);

  GridCheckController.$inject = ['$scope', '$state', '$stateParams', 'GridCheckService', 'CommonMapService', '$ionicPopup', '$ionicLoading', '$cordovaFileTransfer'];

  /** @ngInject */
  function GridCheckController($scope, $state, $stateParams, GridCheckService, CommonMapService, $ionicPopup, $ionicLoading, $cordovaFileTransfer) {

    var vm = this;
    vm.title = '网格化巡检';
    vm.picPath = 'http://www.runoob.com/wp-content/uploads/2014/06/angular.jpg';
    vm.picData = '';
    vm.picName = '';
    vm.pickPositon = $stateParams.position;

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
        vm.picName = moment().format('YYYY-MM-DD-HH:mm:ss') + '.jpg';
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

  HistoryController.$inject = ['$scope','$state', 'HistoryService'];

  /** @ngInject */
  function HistoryController($scope,$state ,HistoryService) {
    var vm = this;
    vm.title = '历史考核记录';
    vm.fun = {
      toPlanDetails: toPlanDetails,
      getHistoryDataByCondition:getHistoryDataByCondition
    }

    vm.toPlanDetails = toPlanDetails;

    vm.historyList = [];
    vm.yeahArray = [];
    vm.monthArray = [];
    vm.thisYeah = moment().format('YYYY');
    vm.thisMonth = moment().format('M');
    vm.keyword = '';
    vm.selectedYeah = '';
    vm.selectedMonth = '';

    activate();


    function activate() {
      console.log(vm.thisYeah+'***'+vm.thisMonth);

      for (var i = 0; i < 15; i++) {
        vm.historyList[i] = {
          id: '1',
          workName: '6月份考核计划',
          year: '2017年',
          month: '六月'
        }
      }

      for (var i = 0; i < 12; i++) {
        vm.monthArray[i] = i+1;
      }

      console.log(vm.monthArray);

      for (var i = 0; i < 5; i++) {
        vm.yeahArray[i] = vm.thisYeah - i;
      }
      // vm.historyList = HistoryService.getHistoryData($rootScope.userId);
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {assessmentData: item, fromWhere: 'history'});
    }

    function getHistoryDataByCondition() {
      console.log(vm.selectedMonth+'**'+vm.selectedYeah+'**'+vm.keyword);
      HistoryService.getHistoryDataByCondition(vm.selectedYeah, vm.selectedMonth, vm.keyword);
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
      getHistoryData:getHistoryData,
      getHistoryDataByCondition:getHistoryDataByCondition
    };

    return service;

    function getHistoryData(userId) {
      var url = '';
      return MyHttpService.getCommonData(url);
    }

    function getHistoryDataByCondition(year,month,keyword) {
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
    };

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
    'LoginService'
  ];

  function LoginController($scope,
                           $state,
                           LoginService) {

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
      LoginService.login($scope.info.userName, $scope.info.password, $scope.imei, $scope.isCommonAccount, $scope.info.isRemAccountAndPwd,$scope.info);
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
      for (var i = 0; i < 15; i++) {
        vm.problemList[i] = {
          id: '6',
          institutionsName: '山东路',
          type: '道路',
          status: '1',
          address: "燕儿岛路",
          question: "公厕不净",
          position:[120.41317,36.07705]
        }
      }
      // vm.problemList = ProblemFeedbackService.getProblemList($rootScope.userId);
    }


    function checkProblemDetails(item) {
      toProblemFeedbackDetails(item);
    }

    function feedbackProblem(item) {
      if (item.status == 0) {
        toProblemFeedbackDetails(item);
      } else {
        $ionicPopup.alert({
          title: '提示',
          template: '您已经反馈过问题啦'
        }).then(function (res) {

        });
      }

    }

    function toProblemFeedbackDetails(item) {
      $state.go('problemFeedbackDetails', {problemItem: item,fromWhere:'problemFeedbackDetails'});
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
      getProblemList:getProblemList
    };

    return service;

    function getProblemList(userId) {
      var path = '' + userId;
      return MyHttpService.getCommonData(path);
    }

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

  AddAssessmentController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'AddAssessmentService'];

  /** @ngInject */
  function AddAssessmentController($rootScope, $scope, $state, $stateParams, AddAssessmentService) {

    var vm = this;
    vm.data = {};
    vm.title = '录入计划';
    vm.spinnerShow = false;
    vm.picBase64DataArray = [];
    vm.uploadData = {
      type: '',
      address: '',
      level: '',
      road: '',
      length: '',
      points: '',
      width: '',
      reason: '',
      remark: '',
      img: []
    };
    vm.line = '120.352728,36.086514,120.352788,36.086477,' +
      '120.352849,36.08644,120.35291,36.086403,120.35297,36.086365,' +
      '120.353031,36.086328,120.353092,36.086291,120.353152,36.086254,120.353213,' +
      '36.086217,120.353283,36.086178,120.353354,36.086138,120.353425,36.086099,120.353425,' +
      '36.086099';

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

    //台帐数据
    vm.accountList =
      {
        type: ['道路', '公厕'],
        reason: ['道路不净', '垃圾桶占路']
      };

    //获取到的所有的匹配的台帐信息
    vm.accountAddressData = [{
      name: '百度1',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      name: '百度2',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      name: '百度3',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      address: '百度4',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }];

    //跳转到地图页面需要传递的道路坐标数组
    vm.mapPositionObj = {
      address: '市南软件园2号楼',
      position: [120.41317, 36.07705],
      roadPositionArray: []
    };

    vm.fun = {
      toAddAssessmentMap: toAddAssessmentMap,
      takePicture: takePicture,
      spinnerHide: spinnerHide,
      queryAccount: queryAccount,
      deletePic: deletePic
    };


    activate();


    function activate() {
      // queryAccountList();
      vm.mapPositionObj.roadPositionArray = AddAssessmentService.getPositionArray(vm.line);
      console.log(vm.mapPositionObj.roadPositionArray);
    }

    function toAddAssessmentMap() {
      $state.go('addAssessmentMap',{mapPositionObj:vm.mapPositionObj});
    }

    //启动摄像头拍照
    function takePicture() {
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
        // var image = document.getElementById('pic' + vm.picIsShow);
        // image.src = "data:image/jpeg;base64," + imageData;
        vm.picBase64DataArray.push("data:image/jpeg;base64," + imageData);
      }, function (err) {
        // error
      });
    }

    //根据模糊查询，查询到相关的设施匹配地址
    function queryAccount() {
      var queryObj = {
        type: vm.uploadData.type,
        address: vm.uploadData.address
      }
      AddAssessmentService.queryAccount(queryObj, function (resData) {
        vm.accountAddressData = resData.accountAddressData;
        vm.mapPositionArray = resData.mapPositionArray;
        vm.spinnerShow = true;
      })
    }

    //获取设施类型，扣分情况，扣分原因等使用<select>Dom的详细数据
    function queryAccountList() {
      AddAssessmentService.queryAccountList(function (resData) {
        vm.accountList = resData[0];
      })
    }

    function spinnerHide(item) {
      vm.spinnerShow = false;
      vm.uploadData.level = item.info.level;
      vm.uploadData.road = item.info.road;
      vm.uploadData.length = item.info.length;
      vm.uploadData.width = item.info.width;
    }

    function deletePic(index) {
      vm.picBase64DataArray.splice(index, 1);
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

  AddAssessmentService.$inject = ['$cordovaCamera', 'MyHttpService'];

  /** @ngInject */
  function AddAssessmentService($cordovaCamera, MyHttpService) {

    var service = {
      addNewAssessment: addNewAssessment,
      getPhonePictureData: getPhonePictureData,
      getPhonePicturePath: getPhonePicturePath,
      queryAccount: queryAccount,
      queryAccountList: queryAccountList,
      getPositionArray: getPositionArray
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

    function queryAccount(queryArray, fun) {
      var path = '';
      MyHttpService.getCommonData(path, fun);
    }

    function queryAccountList(fun) {
      var path = '';
      MyHttpService.getCommonData(path, fun);
    }

    function getPositionArray(string) {
      var roadPositionArray = [];
      console.log(string);
      var temArray = string.split(',');
      for (var i = 0; i < temArray.length - 1; i = i + 2) {
        var array = new Array();
        array[0] = temArray[i];
        array[1] = temArray[i + 1];
        roadPositionArray.push(array);
      }
      return roadPositionArray;
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
    vm.fun = {
      toAssessmentStatusDetails:toAssessmentStatusDetails,
      upload:upload,
      checkStatusDetails:checkStatusDetails
    };


    vm.assessmentStatusList = [];


    activate();

    function activate() {
      console.log(vm.data);
      if(vm.data){
        AssessmentStatusService.getAssessmentStatusList(vm.data,function (resData) {
          vm.assessmentStatusList = resData;
        });
      }
    }

    //上传数据
    function upload() {
      if(vm.planDetailsData!=null&&vm.planDetailsData.status == null){

      }else{
        $ionicPopup.alert({
          title: '该项目已考核',
          template: response.data
        }).then(function (res) {

        });
      }
    }

    function toAssessmentStatusDetails() {
      if(vm.data!=null&&vm.data.status == null){
        $state.go('assessmentStatusDetails', {assessmentStatusData: vm.data,isChecked:false})
      }else{
        $ionicPopup.alert({
          title: '该项目已考核',
          template: response.data
        }).then(function (res) {

        });
      }
    }

    function checkStatusDetails(item) {
      if (vm.data != null && vm.data.status == null) {
        item.typeId = vm.data.typeId;
        item.infraId = vm.data.infraId;
        $state.go('assessmentStatusDetails', {assessmentStatusData: item, isChecked: true})
      }
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

  AssessmentStatusService.$inject = ['$http', 'SYS_INFO', 'MyHttpService'];

  /** @ngInject */
  function AssessmentStatusService($http, SYS_INFO, MyHttpService) {
    var service = {
      getAssessmentStatusList: getAssessmentStatusList
    }

    return service;

    function getAssessmentStatusList(planDetails, fun) {
      var path = '/hwweb/AssignmentAssessment/findProView.action?' + 'planId=' + planDetails.planId +
        '&infrastructureId=' + planDetails.infraId + '&infoId=' + planDetails.id;
      MyHttpService.getCommonData(path, fun);
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
    vm.data = $stateParams.assessmentStatusData;
    vm.title = '';
    vm.type = '05';//判断是道路还是公厕还是其他的设施 05：道路 01：公厕 06：车辆
    vm.isEdit = false;//判断界面是编辑还是查看
    vm.isChecked = $stateParams.isChecked;
    vm.titleController = {
      backToBeforePage: backToBeforePage,
      enterMsg: enterMsg
    }
    vm.initAmap = initAmap;

    vm.assessmentStatusDetailsList = {};


    activate();


    function activate() {

      if (vm.data != null) {
        console.log(vm.data);
        AssessmentStatusDetailsService.getAssessmentStatusDetailsList(vm.data, function (resData) {
          vm.assessmentStatusDetailsList = resData[0];
          if (vm.assessmentStatusDetailsList) {
            vm.type = vm.assessmentStatusDetailsList.type;
          }
        });
      }

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
          assessmentStatusData:null,isChecked:false
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


    function getAssessmentStatusDetailsList(data, fun) {
      var path = '/hwweb/AssignmentAssessment/findFacilities.action?' + 'typeId=' + data.typeId + '&infraId=' + data.infraId;
      MyHttpService.getCommonData(path,fun);
    }

    function getPhonePictureData() {
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
    .module('app.planDetails')
    .controller('PlanDetailsController', PlanDetailsController);

  PlanDetailsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'PlanDetailsService'];

  /** @ngInject */
  function PlanDetailsController($rootScope, $scope, $state, $stateParams, PlanDetailsService) {
    var vm = this;
    vm.data = $stateParams.planDetailsData;
    vm.title = '';
    vm.fromWhere = $stateParams.fromWhere;
    vm.fun = {
      toAddAssessment: toAddAssessment
    }
    vm.toAssessmentStatus = toAssessmentStatus;

    vm.planDetailsList = [];


    activate();


    function activate() {
      if (vm.fromWhere == null) {
        vm.fromWhere = 'waitForWork'
      }
      if (vm.data) {
        vm.title = vm.data.planName;
      }
      PlanDetailsService.getPlanDetailsList(vm.data.id, vm.fromWhere, function (responseData) {
        vm.planDetailsList = responseData;
      });
    }


    function toAddAssessment() {
      $state.go('addAssessment');
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
          planDetailsData: null,
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

  PlanDetailsService.$inject = ['$http', 'SYS_INFO','MyHttpService'];

  /** @ngInject */
  function PlanDetailsService($http, SYS_INFO,MyHttpService) {

    var service = {
      getPlanDetailsList: getPlanDetailsList
    }

    return service;


    function getPlanDetailsList(id, fromWhere,fun) {

      var path = '';

      switch (fromWhere) {
        case 'waitForWork':
          path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
          MyHttpService.getCommonData(path,fun);
          break;
        case 'assessment':
          path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
          MyHttpService.getCommonData(path,fun);
          break;
        default:
          break;
      }


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


    function getCommonData(urlPath,fun) {

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
            title: response.data.msg
          }).then(function (res) {
            console.log('数据获取失败');
            console.log(data);
            fun(data);
          });
        }
      }, function (response) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '获取数据失败',
          template: response.data
        }).then(function (res) {
          console.log('通信异常');
          console.log(data);
          fun(data);
        });
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
    .module('app.savedData')
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

  angular.module('app.savedData')
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
    .module('app.savedData')
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

  ProblemFeedbackDetailsController.$inject = ['$scope', '$stateParams', 'ProblemFeedbackDetailsService'];

  /** @ngInject */
  function ProblemFeedbackDetailsController($scope, $stateParams, ProblemFeedbackDetailsService) {
    var vm = this;
    vm.title = '问题详情'
    vm.fromWhere = $stateParams.fromWhere;
    vm.problemDetails = $stateParams.problemItem;
    vm.feedBack = '';
    vm.footerContent = '确定'
    vm.fun = {
      initCamera: initCamera,
      uploadProblemFeedbackData:uploadProblemFeedbackData
    }
    vm.problemFeedbackData = {};

    activate();

    function activate() {

      if (vm.problemDetails == null) {
        vm.problemDetails = {};
        vm.problemDetails.postion = [120.41317,36.07705];
        vm.problemDetails.address = '燕儿岛路';
      }

      ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
    }


    function initCamera() {

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
        image.problemFeedbackDetailsImg = "data:image/jpeg;base64," + imageData;
      }, function (err) {

      });
    }

    function uploadProblemFeedbackData() {
      ProblemFeedbackDetailsService.uploadProblemFeedbackData(vm.problemFeedbackData,vm.fromWhere);
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

  ProblemFeedbackDetailsService.$inject = ['$http', '$ionicLoading', '$ionicPopup'];

  /** @ngInject */
  function ProblemFeedbackDetailsService($http, $ionicLoading, $ionicPopup) {

    var service = {
      getProblemFeedbackDetailsMap: getProblemFeedbackDetailsMap,
      uploadProblemFeedbackData: uploadProblemFeedbackData
    };

    return service;


    function getProblemFeedbackDetailsMap(positionObj) {

      var map = new AMap.Map('problemFeedbackDetailsMap', {
        resizeEnable: true,
        zoom: 18,
        center: positionObj.position
      });

      var marker = new AMap.Marker({
        position: positionObj.position,
        title: positionObj.address,
        map: map
      });

      map.plugin(['AMap.ToolBar'], function () {
        var toolBar = new AMap.ToolBar();
        map.addControl(toolBar);
      });
    }

    function uploadProblemFeedbackData(problemFeedbackData, fromWhere) {

      $ionicLoading.show(
        {
          template: '<div class="common-loading-dialog-center">' +
          '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
          '  <span>数据上传中...</span>' +
          '</div>',
          duration: 10 * 1000
        });

      switch (fromWhere) {
        case 'problemFeedbackDetails':
          break;
        case 'waitForWork':
          break;
        default:
          break;
      }

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
    //台帐数据
    vm.accountList =
      {
        type: ['全部','公厕','街道','车辆','收集站','垃圾桶'],
        reason: ['道路不净', '垃圾桶占路']
      };

    //获取到的所有的匹配的台帐信息
    vm.accountAddressData = [{
      name: '百度1',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      name: '百度2',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      name: '百度3',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }, {
      address: '百度4',
      position: [],
      roadPositionArray: [],
      info: {level: '', road: '', length: '', width: ''}
    }];

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


    activate();


    function activate() {

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
        params: {mapPositionObj: null},
        templateUrl: 'templates/assessment/addAssessment/addAssessmentMap/addAssessmentMap.html'
      });
  }
}());


(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .service('AddAssessmentMapService', AddAssessmentMapService);

  AddAssessmentMapService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera', 'CommonMapService'];

  /** @ngInject */
  function AddAssessmentMapService($http, SYS_INFO, $cordovaCamera, CommonMapService) {
    var service = {
      initAddAssessmentMap: initAddAssessmentMap
    }

    return service;

    function initAddAssessmentMap() {}


  }
})();
