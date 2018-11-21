<style rel="stylesheet/scss" lang="scss" scoped>
  #vipGrowthEcharts {
    height: 400px;
  }
</style>
<template>
  <div id="vipGrowthEcharts">

  </div>
</template>
<script type="text/ecmascript-6">
  import echarts from 'echarts'
  // let interval
  export default {
    name: 'vipGrowthEcharts',
    data () {
      return {
        myChart: '',
        option: {
          title: {
            text: '会员增长统计'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          series: [{
            name: '会员增长',
            type: 'line',
            data: []
          }]
        }
      }
    },
    mounted: function () {
      this.init()
    },
    methods: {
      testData () {
        for (let i = 0; i < 90; i++) {
          let date = new Date(1514289053135 + i * 86400000)
          let xDate = `${date.getFullYear()}/${('0' + (1 + date.getMonth())).slice(-2)}/${date.getDate()}`
          this.option.xAxis.data.push(xDate)
          this.option.series[0].data.push((Math.random() * 100).toFixed(2))
        }
        console.log(this.option.xAxis)
        console.log(this.option.series)
      },
      init () {
        this.myChart = echarts.init(document.getElementById('vipGrowthEcharts'))
        this.testData()
        this.myChart.setOption(this.option)
      }
    }
  }
</script>
