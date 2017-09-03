(function () {
  'use strict';

  angular
    .module('app.problemFeedback')
    .controller('ProblemFeedbackController', ProblemFeedbackController);

  ProblemFeedbackController.$inject = ['$rootScope', '$ionicPopup', '$scope', 'ProblemFeedbackService'];

  /** @ngInject */
  function ProblemFeedbackController($rootScope, $ionicPopup, $scope, ProblemFeedbackService) {
    var vm = this;
    vm.title = '已收到的检查问题';

    vm.fun = {
      checkProblemDetails: checkProblemDetails,
      feedbackProblem: feedbackProblem
    }

    vm.problemList = [];


    activate();


    function activate() {
      for (var i = 0; i < 10; i++) {
        vm.problemList[i] = {
          id: '6',
          institutionsName: '山东路',
          type: '道路',
          status: '1',
          address: "银川路100号",
          question: "公厕不净"
        }
      }
      // vm.problemList = ProblemFeedbackService.getProblemList($rootScope.userId);
    }


    function checkProblemDetails(item) {
      toProblemFeedbackDetails(item);
    }

    function feedbackProblem(item) {
      if (item.status == 0) {
        toProblemFeedbackDetails(item);
      } else {
        $ionicPopup.alert({
          title:'提示框',
          template:'您已经反馈过问题啦'
        }).then(function (res) {

        });
      }

    }

    function toProblemFeedbackDetails(item) {
      $state.go('problemFeedbackDetails', {problemItem: item});
    }

  }
})();
