(function () {
  'use strict';

  angular
    .module('app.savedData')
    .controller('SavedDataController', SavedDataController);

  SavedDataController.$inject = ['HomeService', 'SavedDataService'];

  function SavedDataController(HomeService, SavedDataService) {
    var vm = this;
    vm.db;
    vm.title = '本地内容';
    vm.savedData = [];

    vm.fun = {
      uploadData: uploadData,
      deleteSavedData: deleteSavedData
    };

    activate();

    function activate() {
      if (!vm.db) {
        vm.db = HomeService.openSqlDB();
      }
      HomeService.selectDataFromSqlDB(vm.db, function (resultSet) {
        if (resultSet.rows.length > 0) {
          for (var i = 0; i < resultSet.rows.length; i++) {
            vm.savedData.push(resultSet.rows.item(i));
          }
        }
      });


    }

    function uploadData(item, index) {
      SavedDataService.uploadData(item, function (res) {
        if (res == 'success') {
          HomeService.deleteDataFromSqlDB(vm.db, item.date, false);
          vm.savedData.splice(index, 1);
        }
      })
    }

    function deleteSavedData(item, index) {
      vm.savedData.splice(index, 1);
      HomeService.deleteDataFromSqlDB(vm.db, item.date, true);
    }

  }
})();
