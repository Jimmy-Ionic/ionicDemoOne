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

