(function () {
  'use strict';

  angular
    .module('app.home')
    .service('GetWeatherService', GetWeatherService)
    .factory('HomeService', HomeService);


  HomeService.$inject = ['$localStorage', '$http', 'SYS_INFO', '$interval', '$rootScope', '$cordovaSQLite', '$ionicPopup', '$ionicLoading'];
  GetWeatherService.$inject = ['$http', 'SYS_INFO', '$interval'];

  function HomeService($localStorage, $http, SYS_INFO, $interval, $rootScope, $cordovaSQLite, $ionicPopup, $ionicLoading) {

    var service = {
      getSavedUploadedData: getSavedUploadedData,
      getUnReadMsgCount: getUnReadMsgCount,
      createSqlDB: createSqlDB,
      insertDataToSqlDB: insertDataToSqlDB,
      selectDataFromSqlDB: selectDataFromSqlDB,
      openSqlDB: openSqlDB,
      deleteDataFromSqlDB: deleteDataFromSqlDB,
      getContentDataNum: getContentDataNum
    };

    return service;

    function getSavedUploadedData() {
      if ($localStorage.savedData) {
        return $localStorage.savedData;
      } else {
        return null;
      }
    }

    function getUnReadMsgCount(userId) {

      var messageApi = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/AppMessage/unreadMsg.action?userId=' + userId;

      $http.get(messageApi).then(function (response) {
        if (response.data.success == 1) {
          $rootScope.unReadMsgCount = response.data.data[0];
          console.log('+++++++++++++++++++++++++');
          console.log(response.data.data[0]);
          console.log($rootScope.unReadMsgCount);
          console.log('+++++++++++++++++++++++++');
        } else {
        }
      }, function (response) {
      })
    }

    /**
     * 创建本地的数据库和存储表
     */
    function createSqlDB(fun) {

      try {
        var db = window.sqlitePlugin.openDatabase({name: "HuanWei2.db", location: 'default'}, function (res) {
          db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ContentSave (id INTEGER PRIMARY KEY ' +
              'AUTOINCREMENT,date TEXT NOT NULL,address TEXT NOT NULL, type TEXT NOT NULL,data TEXT NOT NULL)', [], function (tx, res) {
              fun();
            }, function (error) {
              $ionicPopup.alert({
                title: '提示',
                template: '表创建失败'
              })
            });
          }, function (error) {
            $ionicPopup.alert({
              title: '提示',
              template: '事务error: ' + error.message
            })
          }, function () {
            console.log('transaction ok');
          });
        }, function (error) {
          $ionicPopup.alert({
            title: '提示',
            template: '创建数据库失败：' + JSON.stringify(error)
          }).then(function (res) {
            return null;
          });
        });
      } catch (error) {
        $ionicPopup.alert({
          title: '错误提示',
          template: '本地数据库相关操作出现错误'
        }).then(function (res) {
          return null;
        });
      }
    }


    /**
     * 打开数据库
     */
    function openSqlDB() {

      try {
        var db = window.sqlitePlugin.openDatabase({name: "HuanWei2.db", location: 'default'});
        return db;
      } catch (error) {
        $ionicPopup.alert({
          title: '错误提示',
          template: '本地数据库相关操作出现错误'
        }).then(function (res) {
          return null;
        });
      }
    }

    /**
     * 插入数据库数据
     */
    function insertDataToSqlDB(db, jsonObj) {
      if (!jsonObj || !db) {
        return;
      }
      try {
        db.transaction(function (tx) {
          var insertSql = "INSERT INTO ContentSave(date,address,type,data) VALUES (?,?,?,?)";
          tx.executeSql(insertSql, [jsonObj.date, jsonObj.address, jsonObj.type, jsonObj.data], function (tx, res) {
            console.log('插入数据成功：' + JSON.stringify(res));
          }, function (error) {
            $ionicPopup.alert({
              title: '错误提示',
              template: '插入数据错错误: ' + error.message
            })
          });
        }, function (error) {
          console.log('插入数据事务执行Failed!' + JSON.stringify(error));
        }, function () {
          console.log('插入数据事务执行OK');
        });
      } catch (error) {
        console.log('JavaScript错误捕获，插入数据事务出现问题');
      }
    }

    /**
     * 从数据库读取数据
     */
    function selectDataFromSqlDB(db, fun) {
      $ionicLoading.show(
        {
          templateUrl: 'templates/common/common.loadingData.html'
        });
      var querySql = "SELECT * FROM ContentSave";
      try {
        db.transaction(function (tx) {
          tx.executeSql(querySql, [], function (tx, resultSet) {
            $ionicLoading.hide();
            fun(resultSet);
          }, function (error) {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: '错误提示',
              template: '从数据库查询数据出现错误' + error
            });
          });
        }, function (error) {
          $ionicLoading.hide();
          alert('查询事务Failed' + error.message);
        }, function () {
          console.log('查询事务Success');
        });
      } catch (error) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '提示',
          template: 'JavaScript错误捕获，查询数据事务出现问题'
        });
      }
    }


    /**
     * 从数据库删除数据
     */
    function deleteDataFromSqlDB(db, date, isAlert) {
      if (isAlert) {
        $ionicLoading.show(
          {
            template: '<div class="common-loading-dialog-center">' +
            '  <ion-spinner icon="ios"></ion-spinner>&nbsp;&nbsp;' +
            '  <span>删除数据中...</span>' +
            '</div>'
          }
        );
      }
      var deleteSql = "DELETE FROM ContentSave WHERE date = ?";
      try {
        db.transaction(function (tx) {
          tx.executeSql(deleteSql, [date], function (tx, res) {
            if (isAlert) {
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: '提示',
                template: '删除成功'
              })
            }
          }, function (tx, error) {
            if(isAlert){
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: '提示',
                template: '从数据库删除数据出现错误' + JSON.stringify(error)
              });
            }
          });
        }, function (error) {
          if(isAlert){
            $ionicLoading.hide();
            alert('删除数据事务Failed' + error.message);
          }
        }, function () {
          console.log('删除事务Success');
        });
      } catch (error) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: '提示',
          template: 'JavaScript错误捕获，删除数据事务出现问题'
        });
      }
    }


    /**
     * 获取本地内容的数量
     */
    function getContentDataNum(fun) {
      var db = openSqlDB();
      selectDataFromSqlDB(db, function (res) {
        var num = res.rows.length;
        fun(num);
      })
    }


  }

  function GetWeatherService($http, SYS_INFO) {

    var weatherApi = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/Weather/WeatherJson.action'

    var weatherInfo = {}

    var fun = {
      getWeather: getWeather
    };

    return fun;


    function getWeather(fun) {
      $http.get(weatherApi)
        .then(function (response) {
          if (response.data) {
            weatherInfo.weatherDate = moment().format('MM月DD日');
            weatherInfo.address = '青岛'
            weatherInfo.temperature = getTemperature(response.data);
            weatherInfo.weather = response.data.data.forecast[0].type;
            fun(weatherInfo);
          } else {
            weatherInfo.weatherDate = moment().format('MM月DD日');
            weatherInfo.address = '青岛';
            weatherInfo.temperature = '20度';
            weatherInfo.weather = '晴';
            fun(weatherInfo);
          }
        }, function (response) {
          weatherInfo.weatherDate = moment().format('MM月DD日');
          weatherInfo.address = '青岛';
          weatherInfo.temperature = '20度';
          weatherInfo.weather = '晴';
          fun(weatherInfo);
        });
      console.log(weatherInfo);
    }


    function getTemperature(data) {
      if (data.data) {
        var low = data.data.forecast[0].low.substring(3, 5);
        var high = data.data.forecast[0].high.substring(3, 5);
        var temperature = low + '~' + high + '℃';
        return temperature;
      } else {
        return '';
      }
    }

  }
})();
