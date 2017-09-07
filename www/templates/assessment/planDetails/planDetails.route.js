(function () {
  'use strict';

  angular
    .module('app.planDetails')
    .config(PlanDetailsConfig);

  PlanDetailsConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function PlanDetailsConfig($stateProvider) {
    $stateProvider
      .state('planDetails', {
        url: '/assessment/planDetails',
        params: {
          planDetailsData: null,
          formWhere:''
        },
        cache: true,
        templateUrl: 'templates/assessment/planDetails/planDetails.html'
      });
  }
}());
