<style rel="stylesheet/scss" lang="scss" scoped>
  #productSale {
    min-width:880px;
  }
  .margin-10 {
    margin: 10px;
  }
  .width-40 {
    width: 40%;
  }
  .width-50 {
    width: 50%;
  }
  .width-55 {
    width: 55%;
  }
  .margin-0-10 {
    margin: 0px 10px;
  }
  .marginPage {
    margin:10px;
    text-align: center;
  }
  .order-input {
    width: calc(100% - 200px);
  }
  .my-date {
    width: 145px;
  }
  .tableBox {
    width: 98;
    margin: 10px;
  }
  .productSell{
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
<template>
    <div id="productSale">
      <Breadcrumb class="margin-10">
        <BreadcrumbItem>数据中心</BreadcrumbItem>
        <BreadcrumbItem>商品销售排行</BreadcrumbItem>
      </Breadcrumb>

      <div class="my-border margin-10">
        <div class="my-text productSell">商品销售概况</div>

        <Form inline class="margin-10">
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

        <Table class="margin-10" :columns="column1" :data="data1"></Table>
        <Page show-sizer :page-size-opts="[5,10,20,30,50,100]" :total="total" :current="pageNum" :page-size="pageSize" @on-change="pageChange" show-total class="marginPage" v-if="data1.length>0" @on-page-size-change="pageSizeChange"></Page>
      </div>
      <Loading :isload="loading"></Loading>
    </div>
</template>
<script type="text/ecmascript-6">
  import Loading from '../../components/loading.vue'
  import * as omAPI from '../../services/dataCenter.es6'
  import Util from '../../libs/util'
  export default {
    name: 'productSale',
    components: {Loading},
    data () {
      return {
        pageNum: 1,
        pageSize: 5,
        total: 0,
        loading: false,
        column1: [
          {
            title: '序号',
            render: (h, params) => {
              let num = (params.index + 1) + (this.pageNum - 1) * this.pageSize
              return h('span', {}, num)
            },
            width: 100
          },
          {
            title: '商品名称',
            key: 'name'
          },
          {
            title: '商品编号',
            key: 'productId'
          },
          {
            title: '设计编码',
            key: 'designBarCode'
          },
          {
            title: '销售量',
            key: 'saleCount'
          }
        ],
        data1: [],
        queryString: {
          sd: '',
          st: '',
          ed: '',
          et: '',
          selectType: ''
        },
        dateOption: {
          disabledDate (date) {
            return date && date.valueOf() < new Date('2018/03/01').getTime()
          }
        }
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
      // testData () {
      //   console.log(this.queryString.startDate)
      //   this.option.xAxis.data = []
      //   this.option.series[0].data = []
      //   for (let i = 0; i < 90; i++) {
      //     let date = new Date(this.queryString.startDate.getTime() + i * 86400000)
      //     let xDate = `${date.getFullYear()}-${('0' + (1 + date.getMonth())).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
      //     this.option.xAxis.data.push(xDate)
      //     this.option.series[0].data.push((Math.random() * 100).toFixed(0))
      //   }
      // },
      clickHandler () {
        if (this.queryString.sd === '' || this.queryString.st === '' || this.queryString.ed === '' || this.queryString.et === '') {
          this.$Message.warning('请选择日期范围')
        } else {
          this.queryString.selectType = ''
          this.requestData()
        }
      },
      requestData () {
        if (this.queryValid() === false) {
          return
        }
        const self = this
        self.loading = true
        let url
        if (this.queryString.selectType !== '') {
          url = '?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize + '&selectType=' + this.queryString.selectType
        } else {
          url = '?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize + '&startDate=' + this.startDate + '&endDate=' + this.endDate
        }
        this.$http.get(omAPI.saleInfo(url))
          .then((response) => {
            self.loading = false
            if (response.data.code === 200) {
              self.data1 = response.data.saleInfos === null ? [] : response.data.saleInfos
              self.total = response.data.totalPage
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
        // if ((this.queryString.endDate - this.queryString.startDate) / (24 * 60 * 60 * 1000) > 90) {
        //   this.$Modal.warning({
        //     title: '提示',
        //     content: '请您将查询区间设置在90天之内！'
        //   })
        //   return false
        // }
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
        this.queryString.selectType = 1
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
        this.queryString.selectType = 2
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
          this.data1 = []
          this.total = 0
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
          this.queryString.selectType = 4
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
        this.queryString.selectType = 3
        this.requestData()
      },
      setTheDate (val, tp) {
        this.queryString[tp] = val
      },
      clearTime (tp) {
        this.queryString[tp] = ''
      },
      pageChange (page) {
        this.pageNum = page
        this.requestData()
      },
      pageSizeChange (size) {
        this.pageSize = size
        this.requestData()
      }
    },
    mounted: function () {
      const d = new Date()
      const currentS = d.getTime()
      const beforeS = currentS - (1000 * 60 * 60 * 24 * 30)
      if (d.getFullYear() === 2018 && d.getMonth() === 2) {
        this.queryString.sd = '2018-03-01'
        this.queryString.st = Util.timeFormat(currentS, 'HH:mm')
      } else {
        this.queryString.sd = Util.timeFormat(beforeS, 'yyyy-MM-dd')
        this.queryString.st = Util.timeFormat(beforeS, 'HH:mm')
      }
      this.queryString.ed = Util.timeFormat(currentS, 'yyyy-MM-dd')
      this.queryString.et = Util.timeFormat(currentS, 'HH:mm')
      this.requestData()
    }
  }
</script>
