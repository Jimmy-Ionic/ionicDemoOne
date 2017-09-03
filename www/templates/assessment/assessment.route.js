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
