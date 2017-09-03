(function() {
  'use strict';

  angular
    .module('app.Model')
    .controller('ModelController', ModelController);

  ModelController.$inject = ['$scope', 'ModelService'];
  /** @ngInject */
  function ModelController($scope, ModelService) {
    var vm = this;
    // 图标全局配置，主要配置显示的主题
    vm.chartGlobalConfig = {
      theme: 'shine',
      dataLoaded: true
    };

    // 图标的属性配置
    vm.lineOption = {};
    vm.columnOption = {};
    vm.pieOption = {};

    activate();

    ////////////////

    function activate() {
      lineChart();
      columnChart();
      pieChart();
    }

    function lineChart() {
      ModelService.getLineChartData().then(function(result) {
        vm.lineOption = {
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          title: {
            text: '用电分析',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['用电量', '同比'],
            y: 'bottom'
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {
                show: true,
                type: ['line', 'bar']
              }
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }],
          yAxis: [{
            type: 'value',
            name: 'kWh',
            scale: true
          }],
          series: [{
              name: '用电量',
              type: 'line',
              data: result.data1
            },
            {
              name: '同比',
              type: 'line',
              data: result.data2
            }
          ]
        };
      });
    }

    function columnChart() {
      ModelService.getColumnChartData().then(function(result) {
        vm.columnOption = {
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          title: {
            text: '用电趋势预测',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['用电量', '预测'],
            y: 'bottom'
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }],
          yAxis: [{
            type: 'value',
            name: 'kWh',
            scale: true
          }],
          series: [{
              name: '用电量',
              type: 'bar',
              data: result.data1
            },
            {
              name: '预测',
              type: 'line',
              data: result.data2
            }
          ]
        };
      });
    }

    function pieChart() {
      ModelService.getPieChartData().then(function(result) {
        vm.pieOption = {
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          title: {
            text: '每月用电占比',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '用电月份',
            type: 'pie',
            radius: '80%',
            center: ['50%', '60%'],
            label: {
              normal: {
                position: 'inside'
              }
            },
            data: result
          }]
        };
      });
    }
  }
})();
