(function () {
  'use strict';

  angular
    .module('app.problemFeedback')
    .controller('ProblemFeedbackController', ProblemFeedbackController);

  ProblemFeedbackController.$inject = ['$rootScope', '$state', '$ionicPopup', '$scope', 'ProblemFeedbackService'];

  /** @ngInject */
  function ProblemFeedbackController($rootScope, $state, $ionicPopup, $scope, ProblemFeedbackService) {

    var vm = this;
    vm.title = '已收到的检查问题';

    vm.fun = {
      checkProblemDetails: checkProblemDetails,
      feedbackProblem: feedbackProblem
    }

    vm.problemList = [];

    activate();


    function activate() {
      ProblemFeedbackService.getProblemList($rootScope.userId, function (resData) {
        vm.problemList = resData;
      });
    }


    function checkProblemDetails(item) {
      toProblemFeedbackDetails(item);
    }

    function feedbackProblem(item) {
      // if (item.status == 0) {
      //   toProblemFeedbackDetails(item);
      // } else {
      //   $ionicPopup.alert({
      //     title: '提示',
      //     template: '您已经反馈过问题啦'
      //   }).then(function (res) {
      //
      //   });
      // }
      toProblemFeedbackDetails(item);
    }

    function toProblemFeedbackDetails(item) {
      $state.go('problemFeedbackDetails', {problemItem: item, fromWhere: 'problemFeedback'});
    }


  }
})();
