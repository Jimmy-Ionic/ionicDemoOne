(function () {
  'use strict';

  angular
    .module('app.Model')
    .config(ModelConfig);

  ModelConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ModelConfig($stateProvider) {
    $stateProvider
      .state('app.StateName', {
        url: '/Model',
        views: {
          'ViewName': {
            templateUrl: 'templates/Model/Model.html'
          }
        }
      });
  }
}());
