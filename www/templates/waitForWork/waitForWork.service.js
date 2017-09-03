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
