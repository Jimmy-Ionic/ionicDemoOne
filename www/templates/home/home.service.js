(function () {
  'use strict';

  angular
    .module('app.home')
    .service('GetWeatherService', GetWeatherService)
    .factory('HomeService', HomeService);


  HomeService.$inject = ['$localStorage', '$http', 'SYS_INFO', '$interval', '$rootScope'];
  GetWeatherService.$inject = ['$http', 'SYS_INFO', '$interval'];

  function HomeService($localStorage, $http, SYS_INFO, $interval, $rootScope) {

    var service = {
      getSavedUploadedData: getSavedUploadedData
    };

    return service;

    function getSavedUploadedData() {
      if ($localStorage.savedData) {
        return $localStorage.savedData;
      } else {
        return null;
      }
    }
  }

  function GetWeatherService($http, SYS_INFO, $interval) {

    var weatherApi = SYS_INFO.SERVER_PATH + ':' + SYS_INFO.SERVER_PORT + '/hwweb/Weather/WeatherJson.action'

    var weatherInfo = {}

    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }

    var fun = {
      getWeather: getWeather
    };

    return fun;


    function getWeather() {
      $http.get(weatherApi)
        .then(function (response) {
          if (response.data) {
            weatherInfo.weatherDate = new Date().Format('MM月dd日');
            weatherInfo.address = '青岛'
            weatherInfo.temperature = getTemperature(response.data);
            weatherInfo.weather = response.data.data.forecast[0].type;
          } else {
            weatherInfo.weatherDate = new Date().Format('MM月dd日');
            weatherInfo.address = '青岛';
            weatherInfo.temperature = '20度';
            weatherInfo.weather = '晴';
          }
        }, function (response) {
          weatherInfo.weatherDate = new Date().Format('MM月dd日');
          weatherInfo.address = '青岛';
          weatherInfo.temperature = '20度';
          weatherInfo.weather = '晴';
        });
      console.log(weatherInfo);
      return weatherInfo;
    }


    function getTemperature(data) {
      if (data.data) {
        var low = data.data.forecast[0].low.substring(3, 5);
        var high = data.data.forecast[0].high.substring(3, 5);
        var temperature = low + '~' + high + '度';
        return temperature;
      } else {
        return '';
      }
    }

  }

})();
