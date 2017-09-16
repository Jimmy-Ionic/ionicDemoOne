(function () {
  'use strict';

  angular
    .module('app.addAssessmentMap')
    .service('AddAssessmentMapService', AddAssessmentMapService);

  AddAssessmentMapService.$inject = [];

  /** @ngInject */
  function AddAssessmentMapService() {
    var service = {
      initAddAssessmentMap: initAddAssessmentMap,
      getPositionArray: getPositionArray
    }

    return service;

    function initAddAssessmentMap() {
    }


    function getPositionArray(string) {
      var roadPositionArray = [];
      if (string && string.indexOf(',') >= 0) {
        var temArray = string.split(',');
        for (var i = 0; i < temArray.length - 1; i = i + 2) {
          var array = new Array();
          array[0] = temArray[i];
          array[1] = temArray[i + 1];
          roadPositionArray.push(array);
        }
        return roadPositionArray;
      }
      return roadPositionArray;
    }


  }
})();
