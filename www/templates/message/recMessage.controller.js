(function () {
  'use strict';

  angular
    .module('app.appReceivedMessage')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$scope', 'MessageService', '$rootScope'];

  /** @ngInject */
  function MessageController($scope, MessageService, $rootScope) {

    var vm = this;
    vm.title = '已收到消息';
    vm.refreshMessageList = refreshMessageList;
    vm.openMsgContent = openMsgContent;
    vm.fun = {
      refreshMessageList: refreshMessageList
    }

    //http://bpic.588ku.com/element_origin_min_pic/01/42/49/94573d7d67103c2.jpg
    vm.messages = [];

    activate();

    function activate() {
      MessageService.getMessagesByUserId($rootScope.userId, function (resData) {
        vm.messages = resData;
      });
    }


    function openMsgContent(msg) {

    }

    //刷新数据
    function refreshMessageList() {
      vm.messages = [];
      var userId = '';
      if ($rootScope.userId) {
        userId = $rootScope.userId;
      }
      MessageService.doRefresh(userId, function (resData) {
        vm.messages = resData;
        $scope.$apply();
      }, function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  }
})();
