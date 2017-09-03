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
