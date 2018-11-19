<style rel="stylesheet/scss" lang="scss" scoped>
  #vipGrowth {
    padding: 0 10px;
  }
  .my-content {
    margin: 10px 0 0 0;
  }
  #vipGrowthEcharts {
    height: 400px;
  }
</style>
<template>
  <div id="vipGrowth">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>数据中心</BreadcrumbItem>
      <BreadcrumbItem>会员新增统计</BreadcrumbItem>
    </Breadcrumb>
    <div class="my-content">
      <Form inline>
        <FormItem label="开始日期：" :label-width="82">
          <DatePicker type="date" :editable="false" format="yyyy-MM-dd" style="width: 120px" :value="queryString.sd" @on-change="(val)=>{setTheDate(val,'sd')}" :options="dateOption"></DatePicker>
          <TimePicker type="time" :editable="false" format="HH:mm" :steps="[1, 5]" style="width: 79px" :value="queryString.st" @on-change="(val)=>{setTheDate(val,'st')}" @on-clear="()=>{clearTime('st')}"></TimePicker>
        </FormItem>
        <FormItem label="结束日期：" :label-width="82">
          <DatePicker type="date" :editable="false" format="yyyy-MM-dd" style="width: 120px" :value="queryString.ed" @on-change="(val)=>{setTheDate(val,'ed')}" :options="dateOption"></DatePicker>
          <TimePicker type="time" :editable="false" format="HH:mm" :steps="[1, 5]" style="width: 79px" :value="queryString.et" @on-change="(val)=>{setTheDate(val,'et')}" @on-clear="()=>{clearTime('et')}"></TimePicker>
        </FormItem>
        <FormItem>
          <Button @click="qryCurrentWeek">本周</Button>
          <Button @click="qryLastWeek">上周</Button>
          <Button @click="qryCurrentMonth">本月</Button>
          <Button @click="qryLastMonth">上月</Button>
          <Button type="primary" @click="clickHandler">确定</Button>
        </FormItem>
      </Form>
      <div id="vipGrowthEcharts"></div>
    </div>
    <Loading :isload="loading"></Loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import echarts from 'echarts'
  import Util from '../../libs/util'
  import Loading from '../../components/loading.vue'
  import * as omAPI from '../../services/dataCenter.es6'
  require('echarts/chart/line.js')
  export default {
    name: 'vipGrowth',
    components: {Loading},
    data () {
      return {
        loading: false,
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
            axisLabel: {
              // interval: 1,
              rotate: 45
            },
            data: []
          },
          yAxis: {
            type: 'value',
            min: 0
          },
          series: [{
            name: '会员增长',
            type: 'line',
            data: []
          }]
        },
        queryString: {
          sd: '',
          st: '',
          ed: '',
          et: ''
        },
        dateOption: {
          disabledDate (date) {
            return date && date.valueOf() < new Date('2018/03/01').getTime()
          }
        },
        sortData: []
      }
    },
    computed: {
      startDate () {
        return this.queryString.sd + ' ' + this.queryString.st
      },
      endDate () {
        return this.queryString.ed + ' ' + this.queryString.et
      }
    },
    methods: {
      testData () {
        this.option.xAxis.data = []
        this.option.series[0].data = []
        for (let i = 0; i < 90; i++) {
          let date = new Date(new Date(this.queryString.startDate).getTime() + i * 86400000)
          let xDate = `${date.getFullYear()}-${('0' + (1 + date.getMonth())).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
          this.option.xAxis.data.push(xDate)
          let item = (Math.random() * 20).toFixed(0)
          this.option.series[0].data.push(item)
        }
        let max = Math.max.apply(Math, this.option.series[0].data)
//        let min = Math.min.apply(Math, this.option.series[0].data)
        if (max <= 20) {
          this.option.yAxis.splitNumber = max
        } else {
//          this.option.yAxis.splitNumber = ((max - min) / 20).toFixed(0)
          this.option.yAxis.splitNumber = null
        }
      },
      drawTheCanvas () {
        // this.testData()
        const max = Math.max.apply(Math, this.option.series[0].data)
        const inter = 20
        if (max <= inter) {
          this.option.yAxis.splitNumber = max
          this.option.yAxis.max = max
        } else {
          const step = Math.ceil(max / inter)
          this.option.yAxis.splitNumber = step
          this.option.yAxis.max = step * 20
        }
        this.myChart.hideLoading()
        this.myChart.clear()
        this.myChart.setOption(this.option)
      },
      clickHandler () {
        if (this.queryString.sd === '' || this.queryString.st === '' || this.queryString.ed === '' || this.queryString.et === '') {
          this.$Message.warning('请选择日期范围')
        } else {
          this.requestData()
        }
      },
      requestData () {
        if (this.queryValid() === false) {
          return
        }
        const self = this
        self.loading = true
        const url = '?starDates=' + this.startDate + '&endDates=' + this.endDate
        this.$http.get(omAPI.newMemberStatistic(url))
          .then((response) => {
            self.loading = false
            if (response.data.code === 200) {
              if (Array.isArray(response.data.memberInfos)) {
                self.option.xAxis.data = []
                self.option.series[0].data = []
                response.data.memberInfos.forEach(n => {
                  self.option.xAxis.data.push(n.startDate.split(' ')[0])
                  self.option.series[0].data.push(n.TransactionArea)
                })
                self.drawTheCanvas()
              }
            }
          }).catch((res) => {
            self.loading = false
          })
      },
      queryValid () {
        if (new Date(this.startDate) > new Date(this.endDate)) {
          this.$Message.warning('结束日期不能早于开始日期')
          return false
        }
        if ((new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (24 * 60 * 60 * 1000) > 90) {
          this.$Modal.warning({
            title: '提示',
            content: '请您将查询区间设置在90天之内！'
          })
          return false
        }
        return true
      },
      qryCurrentWeek () {
        const date = new Date()
        const firstDay = new Date(date.getTime() - (1000 * 60 * 60 * 24 * date.getDay()))
        const endDay = new Date(date.getTime() + (1000 * 60 * 60 * 24 * (6 - date.getDay())))
        this.queryString.sd = Util.timeFormat(firstDay, 'yyyy-MM-dd')
        this.queryString.st = '00:00'
        this.queryString.ed = Util.timeFormat(endDay, 'yyyy-MM-dd')
        this.queryString.et = '23:59'
        this.requestData()
      },
      qryLastWeek () {
        const date = new Date()
        const firstDay = new Date(date.getTime() - (1000 * 60 * 60 * 24) * (date.getDay() + 7))
        const endDay = new Date(date.getTime() + (1000 * 60 * 60 * 24) * ((6 - date.getDay()) - 7))
        this.queryString.sd = Util.timeFormat(firstDay, 'yyyy-MM-dd')
        this.queryString.st = '00:00'
        this.queryString.ed = Util.timeFormat(endDay, 'yyyy-MM-dd')
        this.queryString.et = '23:59'
        this.requestData()
      },
      qryLastMonth () {
        const date = new Date()
        let month = date.getMonth()
        let year = date.getFullYear()
        if (year === 2018 && month === 2) {
          this.queryString.sd = ''
          this.queryString.st = ''
          this.queryString.ed = ''
          this.queryString.et = ''
          this.option.xAxis.data = []
          this.option.series[0].data = []
          this.drawTheCanvas()
        } else {
          if (month === 0) {
            year = year - 1
            month = 12
          }
          const newDate = new Date(year, month, 1)
          const lastDate = new Date(newDate.getTime() - 1000 * 60 * 60 * 24).getDate()
          this.queryString.sd = Util.timeFormat(new Date(`${year}-${month}-01`), 'yyyy-MM-dd')
          this.queryString.st = '00:00'
          this.queryString.ed = Util.timeFormat(new Date(`${year}-${month}-${lastDate}`), 'yyyy-MM-dd')
          this.queryString.et = '23:59'
          this.requestData()
        }
      },
      qryCurrentMonth () {
        const date = new Date()
        const month = 1 + date.getMonth()
        const newDate = new Date(date.getFullYear(), month, 1)
        const lastDate = new Date(newDate.getTime() - 1000 * 60 * 60 * 24).getDate()
        this.queryString.sd = Util.timeFormat(new Date(`${date.getFullYear()}-${month}-01`), 'yyyy-MM-dd')
        this.queryString.st = '00:00'
        this.queryString.ed = Util.timeFormat(new Date(`${date.getFullYear()}-${month}-${lastDate}`), 'yyyy-MM-dd')
        this.queryString.et = '23:59'
        this.requestData()
      },
      setTheDate (val, tp) {
        this.queryString[tp] = val
      },
      clearTime (tp) {
        this.queryString[tp] = ''
      }
    },
    mounted: function () {
      this.myChart = echarts.init(document.getElementById('vipGrowthEcharts'))
    }
  }
</script>
