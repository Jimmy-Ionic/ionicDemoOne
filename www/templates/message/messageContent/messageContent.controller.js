(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .controller('MessageContentController', MessageContentController);

  MessageContentController.$inject = ['$scope', 'MessageContentService', '$stateParams', '$cordovaFileTransfer'];

  /** @ngInject */
  function MessageContentController($scope, MessageContentService, $stateParams, $cordovaFileTransfer) {

    var vm = this;
    vm.title = '消息详情';
    vm.msgView = {};
    vm.msg = {};
    vm.msgId = '';
    vm.fun = {
      downloadFile: downloadFile
    }

    activate();


    function activate() {
      if ($stateParams.msgId) {
        vm.msgId = $stateParams.msgId;
      }
      getMessagesContent();
    }

    function getMessagesContent() {
      MessageContentService.getMessagesByMsgId(vm.msgId, function (resData) {
        if (resData[0]) {
          vm.msgView = resData[0].msgView[0];
          vm.msg = resData[0].msg[0];
        }
      });
    }

    function downloadFile(fileUrl) {
      var url = 'http://172.72.100.61:8090/hwweb/Trash/export?ids=fbe58ca3-5909-4bf4-988d-b82b5146f7cb,6792d9ac-2078-42d5-b3d0-60ac1099e1e6';
      var filename = url.split("/").pop();
      alert(filename);
      var targetPath = cordova.file.externalRootDirectory + filename;
      alert(cordova.file.externalRootDirectory);
      var trustHosts = true;
      var options = {};
      $cordovaFileTransfer.download(fileUrl, targetPath, options, trustHosts)
        .then(function (result) {
          // Success!
          alert(JSON.stringify(result));
        }, function (error) {
          // Error
          alert(JSON.stringify(error));
        }, function (progress) {
          $timeout(function () {
            $scope.downloadProgress = (progress.loaded / progress.total) * 100;
          })
        });
      console.log(cordova.file.externalApplicationStorageDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/
      console.log(cordova.file.dataDirectory); //file:///data/user/0/com.bntake.driver.in/files/
      console.log(cordova.file.externalDataDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/files/
      console.log(cordova.file.externalRootDirectory);//file:///storage/emulated/0/
      console.log(cordova.file.externalCacheDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/cache/
      console.log(cordova.file.applicationStorageDirectory); //file:///data/user/0/com.bntake.driver.in/
      console.log(cordova.file.cacheDirectory); //file:///data/user/0/com.bntake.driver.in/cache/
      console.log(cordova.file);  //object
    }
  }
})();
