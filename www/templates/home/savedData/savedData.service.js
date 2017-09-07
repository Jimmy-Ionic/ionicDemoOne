(function () {
  'use strict';

  angular
    .module('app.savedData')
    .service('SavedDataService', SavedDataService)


  SavedDataService.$inject = ['$http', 'SYS_INFO', 'Session', '$interval', '$localStorage','$stateParams'];

  function SavedDataService($http, SYS_INFO, Session, $interval, $localStorage,$stateParams) {

    var service = {
      getSavedUploadedData: getSavedUploadedData,
      uploadData: uploadData,
      deleteSavedData: deleteSavedData
    }


    return service;

    function getSavedUploadedData() {
      if ($stateParams.savedData) {
        return $stateParams.savedData;
      }
    }

    function uploadData(data) {

    }

    function deleteSavedData() {

    }

  }

})();
