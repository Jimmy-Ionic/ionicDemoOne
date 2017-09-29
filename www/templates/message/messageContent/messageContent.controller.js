(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .controller('MessageContentController', MessageContentController);

  MessageContentController.$inject = ['$scope', 'MessageContentService', '$stateParams', '$cordovaFileTransfer',
    '$ionicPopup', '$timeout', '$ionicLoading', 'SYS_INFO', '$cordovaFileOpener2'];

  /** @ngInject */
  function MessageContentController($scope, MessageContentService, $stateParams,
                                    $cordovaFileTransfer, $ionicPopup, $timeout, $ionicLoading, SYS_INFO, $cordovaFileOpener2) {

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


    /**
     * 使用ng-cordova的$cordovaFileTransfer.download()测试没有任何反应！
     */
    // function downloadFile() {
    //   var url = 'http://img002.21cnimg.com/photos/album/20150702/m600/2D79154370E073A2BA3CD4D07868861D.jpeg';
    //   var filename = url.split(".").pop();
    //   var targetPath = cordova.file.externalRootDirectory +'LaGuanChuAppImg/'+ moment().format('YYYY-MM-DD-HH:mm:ss') + '.' + filename;
    //   $ionicPopup.alert({
    //     title: 'info',
    //     template: targetPath
    //   });
    //   var trustHosts = true;
    //   var options = {};
    //   $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
    //     .then(function (result) {
    //       // Success!
    //       $ionicPopup.alert({
    //         title: 'info',
    //         template: JSON.stringify(result)
    //       });
    //     }, function (error) {
    //       // Error
    //       $ionicPopup.alert({
    //         title: 'info',
    //         template: JSON.stringify(error)
    //       });
    //     }, function (progress) {
    //       $ionicPopup.alert({
    //         title: 'info',
    //         template: (progress.loaded / progress.total) * 100
    //       });
    //     });
    //   console.log(cordova.file.externalApplicationStorageDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/
    //   console.log(cordova.file.dataDirectory); //file:///data/user/0/com.bntake.driver.in/files/
    //   console.log(cordova.file.externalDataDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/files/
    //   console.log(cordova.file.externalRootDirectory);//file:///storage/emulated/0/
    //   console.log(cordova.file.externalCacheDirectory); //file:///storage/emulated/0/Android/data/com.bntake.driver.in/cache/
    //   console.log(cordova.file.applicationStorageDirectory); //file:///data/user/0/com.bntake.driver.in/
    //   console.log(cordova.file.cacheDirectory); //file:///data/user/0/com.bntake.driver.in/cache/
    //   console.log(cordova.file);  //object
    // }

    /**
     * 使用cordova插件的cordova-plugin-file的写入文件操作，操作txt测试好用
     */
    // function downloadFile() {
    //
    //
    //   var url = 'http://img002.21cnimg.com/photos/album/20150702/m600/2D79154370E073A2BA3CD4D07868861D.jpeg';
    //   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    //     $ionicLoading.show(
    //       {
    //         templateUrl: 'templates/common/common.loadingData.html',
    //         duration: 5 * 1000
    //       });
    //     //创建文件
    //     fs.root.getFile('12345678.doc', {create: true, exclusive: false}, function (fileEntry) {
    //
    //       var dataObj = new Blob(['欢迎访问hangge.com'], {type: 'text/plain'});
    //
    //       fileEntry.createWriter(function (fileWriter) {
    //
    //         //文件写入成功
    //         fileWriter.onwriteend = function () {
    //           $ionicPopup.alert({
    //             title: '文件已下载',
    //             template:"Successful file read..."
    //           });
    //         };
    //
    //         //文件写入失败
    //         fileWriter.onerror = function (e) {
    //           $ionicPopup.alert({
    //             title: '文件已下载',
    //             template:"Failed file read: " + e.toString()
    //           });
    //         };
    //
    //         //写入文件
    //         fileWriter.write(dataObj);
    //
    //       });
    //     }, function (res) {
    //       $ionicPopup.alert({
    //         title: '文件已下载',
    //         template: JSON.stringify(res)
    //       });
    //     });
    //   }, function (fileError) {
    //     $ionicPopup.alert({
    //       title: '错误',
    //       template: JSON.stringify(fileError)
    //     });
    //   })
    // }

    /**
     * 使用cordova插件的cordova-plugin-file的写入文件操作，操作网络流文件，经过测试下载图片成功
     */
    // function downloadFile() {
    //
    //   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    //     $ionicLoading.show(
    //       {
    //         templateUrl: 'templates/common/common.loadingData.html',
    //         duration: 20 * 1000
    //       });
    //     //创建文件
    //     getSampleFile(fs.root);
    //   }, onErrorLoadFs);
    // }

    // function getSampleFile(dirEntry) {
    //   var xhr = new XMLHttpRequest();
    //   var url = 'http://img002.21cnimg.com/photos/album/20150702/m600/2D79154370E073A2BA3CD4D07868861D.jpeg';
    //   xhr.open('GET', url, true);
    //   xhr.responseType = 'blob';
    //
    //   xhr.onload = function () {
    //     if (this.status == 200) {
    //       var blob = new Blob([this.response], {type: 'image/png'});
    //       var fileName = moment().format('YYYY-MM-DD-HH-mm-ss') + '.png';
    //       alert(fileName);
    //       saveFile(dirEntry, blob, fileName);
    //     }
    //   };
    //   xhr.send();
    // }
    //
    // //保存图片文件
    // function saveFile(dirEntry, fileData, fileName) {
    //   dirEntry.getFile(fileName, {create: true, exclusive: false}, function (fileEntry) {
    //     writeFile(fileEntry, fileData);
    //   }, onErrorCreateFile);
    // }
    //
    // //将图片数据写入到文件中
    // function writeFile(fileEntry, dataObj, isAppend) {
    //   //创建一个写入对象
    //   fileEntry.createWriter(function (fileWriter) {
    //
    //     //文件写入成功
    //     fileWriter.onwriteend = function () {
    //       alert("Successful file write...");
    //     };
    //
    //     //文件写入失败
    //     fileWriter.onerror = function (e) {
    //       console.log("Failed file write: " + e.toString());
    //     };
    //
    //     //写入文件
    //     fileWriter.write(dataObj);
    //   });
    // }
    //
    // //文件创建失败回调
    // function onErrorCreateFile(error) {
    //   alert("文件创建失败！")
    // }
    //
    // //FileSystem加载失败回调
    // function onErrorLoadFs(error) {
    //   alert("文件系统加载失败！")
    // }

    // function download(fileEntry, url) {
    //   var ft = new FileTransfer();
    //   var fileURL = fileEntry.toURL();
    //   alert('fileEntery.toURL:'+fileURL);
    //   console.log(fileEntry)
    //   //监听下载进度
    //   ft.onprogress = function (e) {
    //     alert(e);
    //     if (e.lengthComputable) {
    //      alert('当前进度：' + e.loaded / e.total);
    //     }
    //   }
    //   ft.download(url, fileURL, function (entry) {
    //       alert('下载成功');
    //       alert(entry);
    //       alert('文件位置：' + entry.toURL());
    //     }, function (err) {
    //       alert("下载失败！");
    //       alert(err);
    //     }, null, // or, pass false
    //     {
    //       //headers: {
    //       //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
    //       //}
    //     });
    // }

    /**
     * 下载附件并调用手机的应用打开文件
     */
    function downloadFile() {
      // var location = 'http://img002.21cnimg.com/photos/album/20150702/m600/2D79154370E073A2BA3CD4D07868861D.jpeg';
      // var location = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/uploadImages/文件2.xls';
      // var location = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/uploadImages/文件1.xlsx';
      // var location = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/uploadImages/环卫二期自动考核及网格化巡检功能确认.docx';
      // var location = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/uploadImages/辞职报告.doc';
      var location = vm.msg.addressee;
      if (location) {
        if (checkURL(location)) {
          $ionicLoading.show({
            template: '正在下载附件...'
          });
          var title = moment().format('YYYY-MM-DD-HH-mm-ss');
          var fileType = location.split(".").pop();
          var Url = encodeURI(location);
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (fileEntry) {
            fileEntry.getDirectory("appHuanWeiDownload", {create: true, exclusive: false}, function (fileEntry) {
              // $ionicPopup.alert({
              //   title: 'FileEntry',
              //   template: JSON.stringify(fileEntry)
              // }).then(function (res) {
              var fileTransfer = new FileTransfer();
              fileTransfer.download(Url, fileEntry.toInternalURL() + title + fileType, function (entry) {
                $ionicLoading.hide();
                $ionicPopup.confirm({
                  title: '文件已下载',
                  template: '文件已下载至' + entry.nativeURL + '请点击确认打开文件！',
                  cancelText: '取消', // String (默认: 'Cancel'). 取消按钮的标题文本
                  cancelType: 'button-royal', // String (默认: 'button-default'). 取消按钮的类型
                  okText: '确认', // String (默认: 'OK'). OK按钮的标题文本
                  okType: 'button-positive'
                }).then(function (res) {
                  if (res) {
                    cordova.plugins.fileOpener2.showOpenWithDialog(entry.toInternalURL(), 'image/png', {
                      error: function (e) {
                        // alert('Error status: ' + e.status + ' - Error message: ' + e.message);
                      },
                      success: function () {
                        // alert('file opened successfully');
                      }
                    });
                  } else {
                    // alert('您选择了取消');
                  }
                });
              }, function (err) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: '提示',
                  template: '文件下载失败'
                });
              }, true);
            });
          }, function () {
            $ionicLoading.hide();
            alert("创建文件夹失败");
          });
          // });
        } else {
          $ionicPopup.alert({
            title: '提示',
            template: '附件下载地址不符合规范'
          });
        }
      } else {
        $ionicPopup.alert({
          title: '提示',
          template: '附件地址为空'
        });
      }
    }


    //判断url是否合法
    function checkURL(url) {
      //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
      //下面的代码中应用了转义字符"\"输出一个字符"/"
      var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      var objExp = new RegExp(Expression);
      if (objExp.test(url) == true) {
        return true;
      } else {
        return false;
      }
    }

    // function downloadFile() {
    //   var url = 'http://img002.21cnimg.com/photos/album/20150702/m600/2D79154370E073A2BA3CD4D07868861D.jpeg';
    //   $ionicPopup.alert({
    //     title: 'info',
    //     template: '开始执行......'
    //   }).then(function (res) {
    //       var type = window.TEMPORARY;
    //       var size = 5*1024*1024;
    //
    //       window.requestFileSystem(type, size, successCallback, errorCallback)
    //
    //       function successCallback(fs) {
    //         fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
    //           alert('File creation successfull!')
    //         }, errorCallback);
    //       }
    //
    //       function errorCallback(error) {
    //         alert("ERROR: " + error.code)
    //       }
    //   });
    // }
    //
    // function download(fileEntry, uri, readBinaryData) {
    //   alert('走到这儿啊.....');
    //
    //   var fileTransfer = new FileTransfer();
    //   var fileURL = fileEntry.toURL();
    //
    //   fileTransfer.download(
    //     uri,
    //     fileURL,
    //     function (entry) {
    //       alert("Successful download...");
    //       console.log("download complete: " + entry.toURL());
    //       if (readBinaryData) {
    //         // Read the file...
    //       }
    //       else {
    //         // Or just display it.
    //       }
    //     },
    //     function (error) {
    //       alert("download error source " + error.source);
    //       console.log("download error target " + error.target);
    //       console.log("upload error code" + error.code);
    //     },
    //     null, // or, pass false
    //     {
    //       //headers: {
    //       //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
    //       //}
    //     }
    //   );
    // }

  }
})();
