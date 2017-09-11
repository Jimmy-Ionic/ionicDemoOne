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

  angular.module('app.setting', []);
})();

(function () {
  'use strict';

  angular.module('app.setNet', []);
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

  AccountController.$inject = ['$scope', 'AccountService','$state'];

  /** @ngInject */
  function AccountController($scope, AccountService,$state) {

    var vm = this;
    vm.title = '环卫台帐';
    vm.cityPlace = ['全部区', '市南', '市北', '李沧', '崂山', '黄岛', '城阳'];
    vm.accountType = ['全部类型', '道路', '车辆', '公厕', '转运站', '过街天桥', '垃圾桶', '作业台帐', '收运台帐'];
    vm.level = ['全部子类'];
    vm.queryCriteria = {
      cityPlace: '',
      accountType: '',
      level: '',
      keyWord: ''
    };
    vm.accountList = [];
    vm.fun = {
      updateLevelArrayByType: updateLevelArrayByType,
      getAccountListByQueryCriteria:getAccountListByQueryCriteria,
      toAccountDetails:toAccountDetails
    };

    activate();

    function activate() {
      getAccountList();
      for(var i = 0;i<20;i++){
        var data = {};
        data.cityPlace = '市南区',
        data.accountType = '山东路公厕';
        data.level = '特级';
        vm.accountList.push(data);
      }
    }


    //城市区域，类型，还有等级需要从服务器获取，因为城市的区域会动态的添加。
    function getAccountList() {
      AccountService.getAccountList(function (resData) {

      })
    }

    //根据查询条件来查询台帐
    function getAccountListByQueryCriteria() {
      AccountService.getAccountListByQueryCriteria(function (resData) {
          // vm.accountList = resData;
      });
    }


    function updateLevelArrayByType(item) {
      switch (item) {
        case '全部类型':
          vm.level = ['全部类型'];
          break;
        case '道路':
          vm.level = [];
          break;
        case '车辆':
          vm.level = [];
          break;
        case '公厕':
          vm.level = [];
          break;
        case '转运站':
          vm.level = [];
          break;
        case '过街天桥':
          vm.level = [];
          break;
        case '垃圾桶':
          vm.level = [];
          break;
        case '作业台帐':
          vm.level = [];
          break;
        case '收运台帐':
          vm.level = [];
          break;
        default:
          break;
      }
    }

    function toAccountDetails(item) {
      $state.go('accountDetails',{accountData:item});
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

  AccountService.$inject = ['$http', 'MyHttpService'];

  /** @ngInject */
  function AccountService($http, MyHttpService) {

    var service = {
      getAccountList: getAccountList,
      getAccountListByQueryCriteria:getAccountListByQueryCriteria
    };

    return service;

    function getAccountList(fun) {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }

    function getAccountListByQueryCriteria() {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }
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
    vm.questionCode = [];
    vm.uploadData = {
      district: '',
      street: '',
      selectedQuesCode: '',
      question: '',
      picData: '',
      picName: '',
      pickPosition: []
    }

    vm.fun = {
      toGridCheckMap: toGridCheckMap,
      takeGridCheckPicture: takeGridCheckPicture,
      getGridCheckLocation: getGridCheckLocation,
      uploadGridCheckData: uploadGridCheckData
    }


    activate();

    function activate() {

      if ($stateParams.mapData) {
        vm.uploadData.pickPosition = $stateParams.mapData;
      }

      GridCheckService.getGridCheckQuestionCodeArray(function (resData) {
        vm.questionCode = resData;
      });

    }

    function toGridCheckMap() {
      $state.go('gridCheckMap');
    }

    //拍照
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

        var image = document.getElementById('gridCheckImg');
        image.src = "data:image/jpeg;base64," + imageData;
        vm.uploadData.picName = moment().format('YYYY-MM-DD HH:mm:ss') + '.jpeg';
        vm.uploadData.picData = imageData;
      }, function (err) {
        $ionicPopup.alert({
          title: '照片获取失败，请重新拍照'
        });
      })
    }

    function getGridCheckLocation() {
      CommonMapService.getAddressByGPS(function (res) {
        vm.uploadData.district = res.district;
        vm.uploadData.street = res.street;
        $scope.$apply();
      });
    }

    //上传数据
    function uploadGridCheckData() {

      GridCheckService.uploadGridCheckData(function (resData) {

      });
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
        params: {mapData: null},
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

  GridCheckService.$inject = ['MyHttpService', '$ionicPopup', '$ionicLoading'];

  /** @ngInject */
  function GridCheckService(MyHttpService, $ionicPopup, $ionicLoading) {

    var service = {
      getGridCheckQuestionCodeArray: getGridCheckQuestionCodeArray,
      uploadGridCheckData: uploadGridCheckData
    }

    return service;


    function getGridCheckQuestionCodeArray(fun) {
       var url = '';
       MyHttpService.getCommonData(url,fun);
    }


    //上传网格化巡检的数据
    function uploadGridCheckData(jsonStr,fun) {
      var url = '';
      MyHttpService.uploadCommonData(url,jsonStr,fun);
      // var options = new FileUploadOptions();
      // var params = {
      //   facilityIdentify: '217ae60e5bc746f',
      //   cyberkeyCode: 'AQOhlmsQAAKgCoi',
      //   tenantId: 1
      // };
      // options.params = params;
      // $cordovaFileTransfer.upload(encodeURI(url),data, options).then(function (result) {
      //   console.log(JSON.stringify(result.response));
      //   console.log("success");
      //   $ionicLoading.hide();
      //
      // }, function (err) {
      //   console.log(JSON.stringify(err));
      //   console.log("fail");
      //   $ionicLoading.hide();
      // }, function (progress) {
      //
      // })
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.history')
    .controller('HistoryController', HistoryController);

  HistoryController.$inject = ['$scope', '$state', 'HistoryService'];

  /** @ngInject */
  function HistoryController($scope, $state, HistoryService) {
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

      for (var i = 0; i < 15; i++) {
        vm.historyList[i] = {
          id: '1',
          workName: '6月份考核计划',
          year: '2017年',
          month: '六月'
        }
      }

      for (var i = 0; i < 12; i++) {
        vm.monthArray[i] = i + 1;
      }

      console.log(vm.monthArray);

      for (var i = 0; i < 5; i++) {
        vm.yeahArray[i] = vm.thisYeah - i;
      }
      HistoryService.getHistoryData($rootScope.userId, function (resData) {

      });
    }

    function toPlanDetails(item) {
      $state.go('planDetails', {assessmentData: item, fromWhere: 'history'});
    }

    //根据查询条件来查询历史考核记录
    function getHistoryDataByCondition() {
      HistoryService.getHistoryDataByCondition(vm.queryCriteria, function (resData) {

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
      getHistoryData: getHistoryData,
      getHistoryDataByCondition: getHistoryDataByCondition
    };

    return service;

    function getHistoryData(userId, fun) {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }

    function getHistoryDataByCondition(queryCriteria,fun) {
      var url = '';
      MyHttpService.getCommonData(url,fun);
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
    '$cordovaCamera'
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
                          $cordovaCamera) {
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
    'LoginService',
    '$cordovaDevice'
  ];

  function LoginController($scope,
                           $state,
                           LoginService,
                           $cordovaDevice) {

    $scope.doLogin = doLogin;
    $scope.setNetAddress = setNetAddress;

    $scope.isCommonAccount = false;
    $scope.userInfo = LoginService.getUserInfo();
    $scope.imei = '123456';
    $scope.imei2 = '';

    $scope.info = {
      userName: $scope.userInfo.userName,
      password: $scope.userInfo.password,
      isRemAccountAndPwd: $scope.userInfo.isRemAccountAndPwd
    };

    activate();


    function activate() {

      // $scope.imei = device.imei;
      // var uuid = device.uuid;
      // $ionicPopup.alert({
      //   title: 'imei:' + $scope.imei + 'uuid' + uuid
      // })
      // ;
    }


    // LoginService.setServerInfo();


    function setNetAddress() {
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

  MapController.$inject = ['$scope', 'GetWeatherService', 'CommonMapService', 'MyHttpService', 'MapService'];

  /** @ngInject */
  function MapController($scope, GetWeatherService, CommonMapService, MyHttpService, MapService) {

    var vm = this;
    vm.data = {};
    vm.title = '地图查询';
    vm.spinnerShow = false;
    vm.queryObj = {
      account: [],
      keyword: ''
    }

    vm.accountList = [{account: '全部', selected: true}, {account: '公厕', selected: false}, {
      account: '街道',
      selected: false
    },
      {account: '车辆', selected: false}, {account: '垃圾桶', selected: false}, {account: '收集站', selected: false}];

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
    vm.circle;
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

    vm.fun = {
      getAccountsPostionData: getAccountsPostionData
    }


    activate();


    function activate() {

      MapService.getAccountList(function (resData) {
        // for(var i in resData){
        //   vm.accountList.push(i);
        // }
      });

      initMap();

    }

    function initMap() {

      vm.map = CommonMapService.initMap(vm.mapPositionObj.position);
      vm.map.setZoom(17);
      vm.markerPerson = new AMap.Marker();
      vm.circle = new AMap.Circle({
        // center: new AMap.LngLat("116.403322", "39.920255"),// 圆心位置
        center: vm.mapPositionObj.position,// 圆心位置
        radius: 50, //半径
        strokeColor: "#9E9E9E", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 0, //线粗细度
        fillColor: "#9E9E9E", //填充颜色
        fillOpacity: 0.35//填充透明度
      });
      vm.circle.setMap(vm.map);

      if (vm.mapPositionObj.roadPositionArray.length <= 0) {
        //当roadPositionArray.length数量小于等于0的时候，说明道路的坐标没有，
        // 代表着这是一个具体的设施（比如山东路某个公厕，具体到了地址），不是道路
        var icon = new AMap.Icon({
          image : '../assets/global/map/position.png',//24px*24px
          //icon可缺省，缺省时为默认的蓝色水滴图标，
          size : new AMap.Size(32,32)
        });

        vm.marker = new AMap.Marker({
          position: vm.mapPositionObj.position,
          // icon: new AMap.Icon({
          //   // size: new AMap.Size(32, 32),  //图标大小
          //   // content: '<img src="/www/assets/global/img/location.png" />',
          //   icon: "/www/assets/global/map/100.png",
          //   imageOffset: new AMap.Pixel(0,0)
          // })
          icon:icon,
          offset : new AMap.Pixel(0,0)
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

  MapService.$inject = ['$http','MyHttpService'];

  /** @ngInject */
  function MapService($http,MyHttpService) {
    var service = {
      getAccountList:getAccountList
    }

    return service;


    //获取街道，车辆等相关的台帐信息
    function getAccountList(fun) {
      var url = '';
      MyHttpService.getCommonData(url,fun);
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
      ProblemFeedbackService.getProblemList($rootScope.userId,function (resData) {
        vm.problemList = resData;
      });
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

    function getProblemList(userId,fun) {
      var path = '' + userId;
      return MyHttpService.getCommonData(path,fun);
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
    .controller('AccountDetailsController', AccountDetailsController);

  AccountDetailsController.$inject = ['$scope', 'AccountDetailsService', '$stateParams'];

  /** @ngInject */
  function AccountDetailsController($scope, AccountDetailsService, $stateParams) {

    var vm = this;
    vm.data = {};
    vm.installationName = '';
    vm.accountDetailsData = {};

    activate();

    function activate() {
      if ($stateParams.accountData != null) {

      }
    }

    function getAccountDetailsData() {
      AccountDetailsService.getAccountDetailsData(function () {

      });
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
        params: {accountData: null},
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
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
      getAccountDetailsData:getAccountDetailsData
    };

    return service;

    function getAccountDetailsData(fun) {
      var url = '';
      MyHttpService.getCommonData(url, fun);
    }
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

    vm.assessmentStatusDetailsList = {};

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
    }

    //考核完成
    function upload() {
      if (vm.data != null) {
        if (vm.data.status == null || vm.data.status == false) {
          AssessmentStatusService.checkOverAndUpload(vm.data);
        } else {
          $ionicPopup.alert({
            title: '该考核任务已经完成！',
            template: response.data
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
        cache: false,
        templateUrl: 'templates/assessment/assessmentStatus/assessmentStatus.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.assessmentStatus')
    .service('AssessmentStatusService', AssessmentStatusService);

  AssessmentStatusService.$inject = ['$http', 'SYS_INFO', 'MyHttpService','$ionicLoading','$ionicPopup','$ionicHistory'];

  /** @ngInject */
  function AssessmentStatusService($http, SYS_INFO, MyHttpService,$ionicLoading,$ionicPopup,$ionicHistory) {
    var service = {
      getAssessmentStatusList: getAssessmentStatusList,
      checkOverAndUpload:checkOverAndUpload
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
        if(response.data.success == 1){
          $ionicPopup.alert({
            title: '提示',
            template: '考核完成...'
          }).then(function (res) {
            $ionicHistory.goBack();
          })
        }
      },function (err) {
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
    vm.uploadPicBase64DataArray = ["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"];
    vm.picNameArray = [];
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
              vm.reasonAccount[0] = vm.assessmentStatusDetails.dItem;
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
      $state.go('addAssessmentMap', {mapPositionObj: vm.assessmentStatusDetailsList, from: 'assessmentStatusDetails'});
    }

    function getAccounts() {
      AssessmentStatusDetailsService.getAccounts(vm.data, function (resData) {
        vm.reasonAccount = resData;
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

    function getAccounts(data, fun) {
      var url = '/hwweb/AssignmentAssessment/findDItem.action?' + 'typeId=' + data.typeId;
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

      if ($stateParams.planDetailsData) {
        vm.data = $stateParams.planDetailsData;
        vm.title = vm.data.planName;
      }

      //判断上一页面是代办工作，综合考核，还是历史记录
      switch (vm.fromWhere) {
        case 'waitForWork':
          break;
        case 'assessment':
          break;
        case 'history':
          break;
        default:
          break;
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

  PlanDetailsService.$inject = ['$http', 'SYS_INFO', 'MyHttpService'];

  /** @ngInject */
  function PlanDetailsService($http, SYS_INFO, MyHttpService) {

    var service = {
      getPlanDetailsList: getPlanDetailsList
    }

    return service;


    function getPlanDetailsList(id, fromWhere, fun) {

      var path = '';

      switch (fromWhere) {
        case 'waitForWork':
          path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
          MyHttpService.getCommonData(path, fun);
          break;
        case 'assessment':
          path = '/hwweb/AssignmentAssessment/findPlanView.action?planId=' + id;
          MyHttpService.getCommonData(path, fun);
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
          title: '获取数据失败'
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
      //   headers: {
      //     'Content-type': 'application/json'
      //   },
      //   data: {data: jsonStr}
      // }).then(function (res) {
      $http({
        method: 'post',
        url: url,
        data: {data:jsonStr},
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
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: '提示',
            template: res.data.msg
          }).then(function (res) {
            fun(res);
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
    .module('app.gridCheckMap')
    .controller('GridCheckMapController', GridCheckMapController);

  GridCheckMapController.$inject = ['$rootScope', '$scope', '$stateParams', 'CommonMapService','$state'];

  /** @ngInject */
  function GridCheckMapController($rootScope, $scope, $stateParams, CommonMapService,$state) {

    var vm = this;
    vm.title = '地图详情';
    vm.map = null;
    vm.marker = null;
    vm.postion = [];
    vm.fun = {
      refreshMyPosition: refreshMyPosition,
      sendPosition: sendPosition
    }


    activate();


    function activate() {

      vm.map = CommonMapService.initMap();

      CommonMapService.getCoordinateInfo(function (data) {
        vm.map.setZoom(15);
        vm.marker = CommonMapService.initMyPosition(vm.map, data);
        vm.map.on('click', function (e) {
          vm.marker.setPosition(e.lnglat);
          vm.postion = e.lnglat;
          console.log(e.lnglat);
        })
      });

    }

    //刷新当前的位置，让标记回到当前位置
    function refreshMyPosition() {
      CommonMapService.getCoordinateInfo(function (data) {
        vm.marker.setPosition(data);
        vm.map.setZoom(15);
        vm.map.setCenter(data);
      });
    }

    function sendPosition() {
      $state.go('gridCheck', {mapData: vm.postion});
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
        templateUrl: 'templates/gridCheck/gridCheckMap/gridCheckMap.html'
      });
  }
}());


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
      uploadProblemFeedbackData: uploadProblemFeedbackData
    }
    vm.problemFeedbackData = {};
    vm.uploadData = {

    };

    activate();

    function activate() {

      if (vm.problemDetails == null) {
        vm.problemDetails = {};
        vm.problemDetails.postion = [120.41317, 36.07705];
        vm.problemDetails.address = '燕儿岛路';
      }

      ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
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
      }, function (err) {

      });
    }

    function uploadProblemFeedbackData() {
      ProblemFeedbackDetailsService.uploadProblemFeedbackData(vm.problemFeedbackData, vm.fromWhere);
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
