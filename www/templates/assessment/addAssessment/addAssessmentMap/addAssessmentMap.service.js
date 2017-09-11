(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .service('AddAssessmentMapService', AddAssessmentMapService);

  AddAssessmentMapService.$inject = ['$http', 'SYS_INFO', '$cordovaCamera', 'CommonMapService'];

  /** @ngInject */
  function AddAssessmentMapService($http, SYS_INFO, $cordovaCamera, CommonMapService) {
    var service = {
      initAddAssessmentMap: initAddAssessmentMap,
      getPositionArray:getPositionArray
    }

    return service;

    function initAddAssessmentMap() {}


    function getPositionArray(string) {
      var roadPositionArray = [];
      console.log(string);
      var temArray = string.split(',');
      for (var i = 0; i < temArray.length - 1; i = i + 2) {
        var array = new Array();
        array[0] = temArray[i];
        array[1] = temArray[i + 1];
        roadPositionArray.push(array);
      }
      return roadPositionArray;
    }


  }
})();
