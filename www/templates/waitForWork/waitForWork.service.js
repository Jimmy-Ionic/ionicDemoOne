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
