(function () {
  'use strict';

  angular
    .module('app.savedData')
    .controller('SavedDataController', SavedDataController);

  SavedDataController.$inject = ['SavedDataService'];

  function SavedDataController(SavedDataService) {
    var vm = this;
    vm.title = '本地内容';
    vm.savedData = {
      data: [
        {time: '2017/8/10/pm8:00', address: '山东路', points: '-1', reason: '道路不净', remark: '这是备注', img: []},
        {time: '2017/8/10/pm6:00', address: '银川路', points: '-2', reason: '垃圾桶占路', remark: '这是备注', img: []},
        {time: '2017/8/10/pm9:00', address: '镇江路', points: '-1', reason: '道路不净', remark: '这是备注', img: []},
        {time: '2017/8/10/pm10:00', address: '江西路', points: '-2', reason: '垃圾桶占路', remark: '这是备注', img: []}
      ]
    };

    vm.fun = {
      uploadData: uploadData,
      deleteSavedData: deleteSavedData
    };

    activate();

    function activate() {
      vm.savedData = SavedDataService.getSavedUploadedData();
    }

    function uploadData(item) {

    }

    function deleteSavedData(item) {

    }

  }
})();
