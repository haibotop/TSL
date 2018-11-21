<style rel="stylesheet/scss" lang="scss" scoped>
  #vipGrowth {
    padding: 0 10px;
  }
  .my-content {
    margin: 10px 0 0 0;
  }
  #vipAreaChartPanel {
    height: 500px;
    width: 100%;
  }
  .marginPage {
    margin:10px;
    text-align: center;
  }
  .wid-200{
    width: 200px;
  }
</style>
<template>
  <div id="vipGrowth">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>数据中心</BreadcrumbItem>
      <BreadcrumbItem>会员地区统计</BreadcrumbItem>
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
      <RadioGroup v-model="typeTable" @on-change="getTypeList">
        <Radio label="doneUser">
          <span>成交用户数</span>
        </Radio>
        <Radio label="doneOrder">
          <span>成交订单数</span>
        </Radio>
        <Radio label="percent">
          <span>成交占比额</span>
        </Radio>
        <Radio label="doneAmount">
          <span>成交额</span>
        </Radio>
        <Radio label="registrations">
            <span>注册数</span>
        </Radio>
      </RadioGroup>
      <div id="vipAreaChartPanel"></div>
      <div class="data-table">
        <Table :columns="column1" :data="data1"></Table>
      </div>
      <Page :total="pageNumber.total" :current="pageNumber.pageNum" :page-size="pageNumber.pageSize" show-total @on-change="pageChange" class="marginPage"></Page>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as omAPI from '../../services/dataCenter.es6'
  import Util from '../../libs/util'
  import echarts from 'echarts'
  require('echarts/chart/map.js')
  export default {
    name: 'vipGrowth',
    data () {
      return {
        myChart: '',
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
        option: {
          title: {
            text: '会员地区分布',
            x: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['会员地区'],
            show: false
          },
          dataRange: {
            min: 0,
            max: 250,
            x: 'left',
            y: 'bottom',
            text: ['高', '低'],
            calculable: true
          },
          series: [
            {
              name: '会员地区',
              type: 'map',
              mapType: 'china',
              roam: false,
              itemStyle: {
                normal: {label: {show: true}},
                emphasis: {label: {show: true}}
              },
              data: []
            }
          ]
        },
        column1: [
          {
            type: 'index',
            align: 'center',
            title: '排行'
          },
          {
            title: '地区',
            key: 'province'
          },
          {
            title: '成交用户数',
            key: 'MemberNumber'
          }
        ],
        data1: [],
        pageNumber: {
          total: 0,
          pageNum: 1,
          pageSize: 5
        },
        typeTable: 'doneUser'
      }
    },
    computed: {
      starDate () {
        return this.queryString.sd + ' ' + this.queryString.st
      },
      endDate () {
        return this.queryString.ed + ' ' + this.queryString.et
      }
    },
    mounted: function () {
    },
    methods: {
      getMemberList () {
        this.option.series[0].data = []
        const dparams = {
          starDate: this.starDate,
          endDate: this.endDate
        }
        this.$http.get(...omAPI.getVipMember(), {params: dparams})
          .then((response) => {
            if (response.data.code === 200) {
              this.loading = false
              for (let i of response.data.memberInfos) {
                if (i.province) {
                  var item = {name: i.province.replace('省', ''), value: i.MemberNumber}
                  this.option.series[0].data.push(item)
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
        this.myChart = echarts.init(document.getElementById('vipAreaChartPanel'))
        this.myChart.setOption(this.option)
      },
      queryClick () {
        if (this.queryValid()) {
          this.getMemberList()
          this.getPageList()
        }
      },
      queryValid () {
        if (this.queryString.sd === '' || this.queryString.st === '' || this.queryString.ed === '' || this.queryString.et === '') {
          this.$Message.warning('请选择日期范围')
          return false
        }
        if (new Date(this.starDate) > new Date(this.endDate)) {
          this.$Message.warning('结束日期不能早于开始日期')
          return false
        }
        if ((new Date(this.endDate).getTime() - new Date(this.starDate).getTime()) / (24 * 60 * 60 * 1000) > 90) {
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
          this.data1 = []
          this.option.series[0].data = []
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
      getPageList () {
        switch (this.typeTable) {
          case 'doneAmount':
            this.column1[2].title = '成交额'
            break
          case 'doneOrder':
            this.column1[2].title = '成交订单数'
            break
          case 'percent':
            this.column1[2].title = '成交额占比数'
            break
          case 'registrations':
            this.column1[2].title = '注册数'
            break
          default:
            this.column1[2].title = '成交用户数'
            break
        }
        this.data1 = []
        let queryString = {
          pageSize: this.pageNumber.pageSize,
          pageNum: this.pageNumber.pageNum,
          starDate: this.starDate,
          endDate: this.endDate
        }
        this.$http.get(...omAPI.getPageMember(this.typeTable), {params: queryString})
          .then((response) => {
            if (response.data.code === 200) {
              this.loading = false
              this.pageNumber.total = response.data.memberInfos.total
              if (this.typeTable === 'registrations') {
                this.data1 = response.data.memberInfos
              } else {
                this.data1 = response.data.memberInfos.list
              }
            } else {
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      },
      getOrderList () {
        this.column1[2].title = '成交订单数'
        let queryString = {
          pageSize: this.pageNumber.pageSize,
          pageNum: this.pageNumber.pageNum,
          starDate: this.starDate,
          endDate: this.endDate
        }
        this.data1 = []
        this.$http.get(...omAPI.getPageMember(), {params: queryString})
          .then((response) => {
            if (response.data.code === 200) {
              this.loading = false
              this.pageNumber.total = response.data.memberInfos.total
              this.data1 = response.data.memberInfos.list
            } else {
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      },
      pageChange (val) {
        let that = this
        that.pageNumber.pageNum = val
        that.loading = true
        that.getPageMember()
      },
      getTypeList (val) {
        this.typeTable = val
        if (this.queryValid()) {
          this.getPageList()
        }
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
