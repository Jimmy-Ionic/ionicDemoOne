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
