(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetailsMap')
    .config(ProblemFeedbackDetailsMapConfig);

  ProblemFeedbackDetailsMapConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ProblemFeedbackDetailsMapConfig($stateProvider) {
    $stateProvider
      .state('problemFeedbackDetailsMap', {
        url: '/problemFeedbackDetailsMap',
        cache:true,
        templateUrl: 'templates/problemFeedback/problemFeedbackDetailsMap/problemFeedbackDetailsMap.html'
      });
  }
}());
