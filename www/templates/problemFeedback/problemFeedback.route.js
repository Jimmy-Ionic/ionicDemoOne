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
