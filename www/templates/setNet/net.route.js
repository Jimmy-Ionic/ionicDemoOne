(function () {
  angular.module('app.setNet')
    .config(NetRouteConfig);

  NetRouteConfig.$inject = ['$stateProvider',];

  function NetRouteConfig($stateProvider) {
    $stateProvider
      .state('setNet', {
        url: '/setNet',
        params: {imei: ''},
        cache: false,
        controller: 'SetNetController',
        templateUrl: 'templates/setNet/net.html'
      });
  }
})();
