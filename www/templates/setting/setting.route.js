(function () {
  'use strict';

  angular
    .module('app.setting')
    .config(SettingConfig);

  SettingConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function SettingConfig($stateProvider) {
    $stateProvider
      .state('setting', {
        url: '/setting',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/setting/setting.html'
        //   }
        cache:true,
        templateUrl: 'templates/setting/setting.html'
      });
  }
}());
