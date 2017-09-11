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
