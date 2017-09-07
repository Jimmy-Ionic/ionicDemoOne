(function () {
  'use strict';

  angular.module('app.savedData')
    .config(SavedDataRouteConfig);

  SavedDataRouteConfig.$inject = ['$stateProvider'];

  function SavedDataRouteConfig($stateProvider) {
    $stateProvider
      .state('savedData', {
        url: '/savedData',
        cache:true,
        params: {
          savedData: null
        },
        templateUrl: 'templates/home/savedData/savedData.html'
      });
  }
})();
