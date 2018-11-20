<style rel="stylesheet/scss" lang="scss" scoped>
  #vipGrowth {
    padding: 0 10px;
  }
  .my-content {
    margin: 10px 0 0 0;
  }
  #saleChart {
    height: 600px;
  }

  .sale-list {
    border: 1px solid #ccc;
    padding: 4px 0;
    text-indent: 1em;
  }

  .sale-data{
    margin-bottom:20px;
  }
</style>
<template>
  <div id="vipGrowth">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>数据中心</BreadcrumbItem>
      <BreadcrumbItem>销售额统计</BreadcrumbItem>
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
          <Button type="primary" @click="queryClick">确定</Button>
        </FormItem>
      </Form>
      <div class="sale-data">
        <h3>销售数据概况</h3>
        <Row type="flex" justify="start" class="code-row-bg">
          <Col span="6" class="sale-list">成交额（元）</Col>
          <Col span="6" class="sale-list">{{saleListData.totalDoneAmount}}</Col>
          <Col span="6" class="sale-list">下单金额（元）</Col>
          <Col span="6" class="sale-list">{{saleListData.totalAmount}}</Col>
        </Row>
        <Row type="flex" justify="start" class="code-row-bg">
          <Col span="6" class="sale-list">成交订单数：</Col>
          <Col span="6" class="sale-list">{{saleListData.totalDoneQuantity}}</Col>
          <Col span="6" class="sale-list">下单订单数：</Col>
          <Col span="6" class="sale-list">{{saleListData.totalQuantity}}</Col>
        </Row>
        <Row type="flex" justify="start" class="code-row-bg">
          <Col span="6" class="sale-list">成交用户数：</Col>
          <Col span="6" class="sale-list">{{saleListData.totalDoneUsers}}</Col>
          <Col span="6" class="sale-list">下单用户数：</Col>
          <Col span="6" class="sale-list">{{saleListData.totalUsers}}</Col>
        </Row>
      </div>
      <div id="saleChart"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as omAPI from '../../services/dataCenter.es6'
  import Util from '../../libs/util'
  import echarts from 'echarts'
  require('echarts/chart/line.js')
  export default {
    name: 'saleStatistics',
    data () {
      return {
        myChart: '',
        option: {
          title: {
            text: '销售数据图'
          },
          grid: {
            x: 100,
            x2: 10,
            y2: 100
          },
          tooltip: {
            trigger: 'axis'
          },
          color: ['#f09f50', '#75292d', '#57a7da', '#7b78af', '#c7c7c5', '#06a7b1', '#f5b5c5', '#739c3e', '#36639c', '#fadd1f', '#008a4c', '#9b2d76'],
          legend: {
            data: ['成交额', '成交订单数', '成交用户数', '下单金额', '下单订单数', '下单用户数'],
            selectedMode: 'single'
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              rotate: 45
            },
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '成交额',
              type: 'line',
              data: []
            },
            {
              name: '成交订单数',
              type: 'line',
              data: []
            },
            {
              name: '成交用户数',
              type: 'line',
              data: []
            },
            {
              name: '下单金额',
              type: 'line',
              data: []
            },
            {
              name: '下单订单数',
              type: 'line',
              data: []
            },
            {
              name: '下单用户数',
              type: 'line',
              data: []
            }
          ]
        },
        queryString: {
          sd: '',
          st: '',
          ed: '',
          et: '',
          selectType: null
        },
        dateOption: {
          disabledDate (date) {
            return date && date.valueOf() < new Date('2018/03/01').getTime()
          }
        },
        saleListData: {
          totalAmount: 0,
          totalDoneAmount: 0,
          totalDoneUsers: 0,
          totalUsers: 0,
          totalDoneQuantity: 0,
          totalQuantity: 0
        }
      }
    },
    mounted: function () {
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
      formatDateYMD (date) {
        if (date !== '' && date !== null) {
          if (new Date(date) !== 'Invalid Date') {
            let d = new Date(date)
            return `${d.getFullYear()}-${('0' + (1 + d.getMonth())).slice(-2)}-${('0' + d.getDate()).slice(-2)} ${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}`
          }
        } else {
          return date
        }
      },
      orderList () {
        let queryString = {}
        this.option.xAxis.data = []
        for (let sr = 0; sr < 6; sr++) {
          this.option.series[sr].data = []
        }
        let length = (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 60 * 60 * 24)
        if (length <= 30) {
          this.option.xAxis.axisLabel.reterval = 0
        } else {
          this.option.xAxis.axisLabel.reterval = 1
        }
        for (let g = 0; g < length + 1; g++) {
          let date = new Date((new Date(this.startDate)).getTime() + g * 86400000)
          let xDate = `${date.getFullYear()}-${('0' + (1 + date.getMonth())).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
          this.option.xAxis.data.push(xDate)
          for (let x = 0; x < this.option.series.length; x++) {
            this.option.series[x].data.push(0)
          }
        }
        if (this.queryString.selectType !== null && this.queryString.selectType !== '') {
          queryString.selectType = this.queryString.selectType
        }
        queryString.startDate = this.startDate + ':00'
        queryString.endDate = this.endDate + ':00'
        this.$http.get(...omAPI.getSaleDate(), {params: queryString})
          .then((response) => {
            if (response.data.code === 200) {
              let jsonData = response.data
              this.loading = false
              this.saleListData = jsonData
              this.saleListData.totalDoneAmount = this.fen2yuan(this.saleListData.totalDoneAmount)
              this.saleListData.totalAmount = this.fen2yuan(this.saleListData.totalAmount)
              let xAxis = this.option.xAxis.data
              let yAxis = this.option.series
              for (let a = 0; a < length; a++) {
                for (let t of jsonData.totalDoneAmountCountItems) {
                  if (xAxis[a] === t.date) {
                    t.yval = this.fen2yuan(t.yval)
                    yAxis[0].data[a] += parseFloat(t.yval)
                  }
                }
                for (let x of jsonData.totalDoneQuantityCountItems) {
                  if (xAxis[a] === x.date) {
                    yAxis[1].data[a] += parseInt(x.yval)
                  }
                }
                for (let y of jsonData.totalDoneUsersCountItems) {
                  if (xAxis[a] === y.date) {
                    yAxis[2].data[a] += parseInt(y.yval)
                  }
                }
                for (let z of jsonData.totalAmountCountItems) {
                  if (xAxis[a] === z.date) {
                    z.yval = this.fen2yuan(z.yval)
                    yAxis[3].data[a] += parseFloat(z.yval)
                  }
                }
                for (let r of jsonData.totalQuantityCountItems) {
                  if (xAxis[a] === r.date) {
                    yAxis[4].data[a] += parseInt(r.yval)
                  }
                }
                for (let u of jsonData.totalUsersCountItems) {
                  if (xAxis[a] === u.date) {
                    yAxis[5].data[a] += parseInt(u.yval)
                  }
                }
              }
              this.init()
            } else {
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      },
      init () {
        this.myChart = echarts.init(document.getElementById('saleChart'))
        this.myChart.setOption(this.option)
      },
      queryClick () {
        if (this.queryValid()) {
          this.orderList()
        }
      },
      queryValid () {
        if (this.queryString.sd === '' || this.queryString.st === '' || this.queryString.ed === '' || this.queryString.et === '') {
          this.$Message.warning('请选择日期范围')
          return false
        }
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
        let date = new Date()
        let firstDay = new Date(date.getTime() - (1000 * 60 * 60 * 24 * date.getDay()))
        let endDay = new Date(date.getTime() + (1000 * 60 * 60 * 24 * (6 - date.getDay())))
        this.queryString.sd = Util.timeFormat(firstDay, 'yyyy-MM-dd')
        this.queryString.st = '00:00'
        this.queryString.ed = Util.timeFormat(endDay, 'yyyy-MM-dd')
        this.queryString.et = '23:59'
        this.queryClick()
      },
      qryLastWeek () {
        let date = new Date()
        let firstDay = new Date(date.getTime() - (1000 * 60 * 60 * 24) * (date.getDay() + 7))
        let endDay = new Date(date.getTime() + (1000 * 60 * 60 * 24) * ((6 - date.getDay()) - 7))
        this.queryString.sd = Util.timeFormat(firstDay, 'yyyy-MM-dd')
        this.queryString.st = '00:00'
        this.queryString.ed = Util.timeFormat(endDay, 'yyyy-MM-dd')
        this.queryString.et = '23:59'
        this.queryClick()
      },
      qryLastMonth () {
        let date = new Date()
        let month = date.getMonth()
        let year = date.getFullYear()
        if (year === 2018 && month === 2) {
          this.queryString.sd = ''
          this.queryString.st = ''
          this.queryString.ed = ''
          this.queryString.et = ''
          this.saleListData.totalAmount = 0
          this.saleListData.totalDoneAmount = 0
          this.saleListData.totalDoneUsers = 0
          this.saleListData.totalUsers = 0
          this.saleListData.totalDoneQuantity = 0
          this.saleListData.totalQuantity = 0
          this.option.xAxis.data = []
          for (let sr = 0; sr < 6; sr++) {
            this.option.series[sr].data = []
          }
          this.init()
        } else {
          if (month === 0) {
            year = year - 1
            month = 12
          }
          let newDate = new Date(year, month, 1)
          let lastDate = new Date(newDate.getTime() - 1000 * 60 * 60 * 24).getDate()
          this.queryString.sd = Util.timeFormat(new Date(`${year}-${month}-01`), 'yyyy-MM-dd')
          this.queryString.st = '00:00'
          this.queryString.ed = Util.timeFormat(new Date(`${year}-${month}-${lastDate}`), 'yyyy-MM-dd')
          this.queryString.et = '23:59'
          this.queryClick()
        }
      },
      qryCurrentMonth () {
        let date = new Date()
        let month = 1 + date.getMonth()
        let newDate = new Date(date.getFullYear(), month, 1)
        let lastDate = new Date(newDate.getTime() - 1000 * 60 * 60 * 24).getDate()
        this.queryString.sd = Util.timeFormat(new Date(`${date.getFullYear()}-${month}-01`), 'yyyy-MM-dd')
        this.queryString.st = '00:00'
        this.queryString.ed = Util.timeFormat(new Date(`${date.getFullYear()}-${month}-${lastDate}`), 'yyyy-MM-dd')
        this.queryString.et = '23:59'
        this.queryClick()
      },
      /*
       分转元
       amount 实际付款总价（优惠后总价）
       orderProductItems => price 单个商品价格 sum price*quantity
       */
      fen2yuan (data) {
        let amount = data / 100
        amount = amount % 1 ? parseFloat(amount) : parseFloat(amount) + '.00'
        return amount
      },
      setTheDate (val, tp) {
        this.queryString[tp] = val
      },
      clearTime (tp) {
        this.queryString[tp] = ''
      }
    }
  }
</script>
