(function () {
  angular.module('app.login')
    .config(loginRouteConfig);

  loginRouteConfig.$inject = ['$stateProvider'];

  function loginRouteConfig($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html'
      });
  }
})();
