(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .config(AddAssessmentMapConfig);

  AddAssessmentMapConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AddAssessmentMapConfig($stateProvider) {
    $stateProvider
      .state('addAssessmentMap', {
        url: '/addAssessmentMap',
        params: {mapPositionObj: null},
        templateUrl: 'templates/assessment/addAssessment/addAssessmentMap/addAssessmentMap.html'
      });
  }
}());

