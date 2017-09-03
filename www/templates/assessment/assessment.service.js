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
