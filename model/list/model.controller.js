(function () {
  'use strict';

  angular
    .module('app.Model')
    .controller('ModelController', ModelController);

  ModelController.$inject = ['$scope', '$ionicPopup', 'ModelService'];
  /** @ngInject */
  function ModelController($scope, $ionicPopup, ModelService) {
    var vm = this;
    vm.showDetail = showDetail;
    vm.dataItems = [];

    activate();

    ////////////////

    function activate() {
      getDataItems();
    }

    function showDetail() {
      // TODO: 显示详细内容时间
    }

    function getDataItems() {
      ModelService.getDataItems().then(function (result) {
        if (result.failed) {
          $ionicPopup.alert({
            title: '错误',
            template: '获取数据失败！'
          }).then(function (res) {
          });
        } else {
          vm.dataItems = result;
        }
      });
    }
  }
})();
