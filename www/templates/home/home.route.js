(function () {
  'use strict';

  angular.module('app.home')
    .config(homeRouteConfig);

  homeRouteConfig.$inject = ['$stateProvider'];

  function homeRouteConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        cache:true,
        templateUrl: 'templates/home/home.html'
      });
  }
})();
