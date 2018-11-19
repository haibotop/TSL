<template>
  <div :id="chartId"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'

export default {
  name: 'testBing',
  data () {
    return {
      chartId: 'bing'
    }
  },
  mounted () {
    console.log('----------echarts')
    console.log(echarts)
    let myChart = echarts.init(document.getElementById(this.chartId))
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    })
  }
}
</script>

<style lang="scss" scoped>
#bing {
  width: 600px;
  height: 600px;
}
</style>
