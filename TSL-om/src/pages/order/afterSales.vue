<style rel="stylesheet/scss" lang="scss" scoped>
  #orderManager {
    min-width:880px;
  }
  .margin-10 {
    margin: 10px;
  }
  .width-40 {
    width: 40%;
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
    width: calc(100% - 85px);
  }
  .my-date {
    width: 145px;
  }
  .tableBox {
    width: 98;
    margin: 10px;
  }
  .batch-mark {
    max-height: 380px;
    overflow-y: scroll;
  }
  .line {
    border: 1px solid #e9eaec;
    margin: 10px 0px;
  }
</style>
<template>
  <div id="orderManager">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>申请售后</BreadcrumbItem>
    </Breadcrumb>

    <Tabs type="card" :animated="false" @on-click="orderStatus" v-model="tabStatus">
      <TabPane label="待退货" name="0"></TabPane>
      <TabPane label="已退货" name="1"></TabPane>
      <TabPane label="确认收货" name="2"></TabPane>
      <TabPane label="发起退款" name="3"></TabPane>
      <TabPane label="已退款" name="4"></TabPane>
      <TabPane label="退货退款成功" name="5"></TabPane>
    </Tabs>

    <Button class="margin-0-10" :disabled="disModal1" @click="modal1 = true">操作日志</Button>

    <div class="tableBox">
      <Table :columns="column1" :data="data1" @on-selection-change="selectItem"></Table>
    </div>

    <Modal v-model="modal1" width="800">
      <p slot="header">
        <span>操作日志</span>
      </p>
      <div style="text-align:center">
        <Table :columns="column2" :data="data2"></Table>
      </div>
      <div slot="footer"></div>
    </Modal>

    <Loading :isload="loading"></Loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as omAPI from '../../services/orderList.es6'
  import Loading from '../../components/loading.vue'
  export default {
    name: 'afterSales',
    components: {
      Loading
    },
    data () {
      return {
        loading: false,
        // disabled
        disModal1: true,
        params: {
          status: '0'
        },
        column1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '订单编号',
            key: 'number',
            width: 180,
            align: 'center'
          },
          {
            title: '商品信息',
            width: 300,
            align: 'center',
            render: (h, params) => {
              let pl = []
              for (let i of params.row.orderProductItems) {
                let p = h('div', {
                  style: {overflow: 'hidden', margin: '5px'}
                }, [
                  h('img', {
                    domProps: {src: i.defaultPicture},
                    style: {display: 'block', float: 'left', width: '50px', height: '50px', 'margin-right': '5px'}
                  }),
                  h('p', {
                    style: {width: '190px', display: 'inline-block', textAlign: 'left'}
                  }, i.name)
                ])
                pl.push(p)
              }
              return h('div', {}, pl)
            }
          },
          {
            title: '买家',
            key: 'buyers',
            width: 180,
            align: 'center'
          },
          {
            title: '单价/数量',
            key: 'priceQuantity',
            width: 200,
            align: 'center',
            render: (h, params) => {
              let pn = []
              for (let i of params.row.orderProductItems) {
                let b = h('p', {}, [
                  h('span', {}, i.floatPrice),
                  h('span', {
                    style: {marginLeft: '2px'}
                  }, `(${i.quantity}件)`)
                ])
                pn.push(b)
              }
              return h('div', {}, pn)
            }
          },
          {
            title: '收货人',
            key: 'receiverName',
            width: 180,
            align: 'center'
          },
          {
            title: '退单时间',
            width: 180,
            align: 'center',
            key: 'chargeBack'
          },
          {
            title: '退单状态',
            width: 180,
            align: 'center',
            key: 'chargeBack'
          },
          {
            title: '退单金额',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', {style: {textAlign: 'left'}}, [
                h('p', {}, `订单金额：${params.row.orderProductItems[0].currentPrice}`)
              ])
            }
          },
          {
            title: '操作',
            width: 135,
            renderHeader: (h, params) => {
              return h('div', {
                style: {
                  'text-align': 'center'
                }
              }, params.column.title)
            },
            render: (h, params) => {
              let a
              if (params.row.status === 0) {
                a = h('a', {
                  style: {'display': 'block', 'text-align': 'center'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      console.log(this.$router)
                      this.$router.push({path: 'orderStore', query: {Order_Number: params.row.number}})
                    }
                  }
                }, '已退货')
              } else if (params.row.status === 1) {
                a = [
                  h('a', {
                    style: {'display': 'block', 'text-align': 'center'},
                    domProps: {
                      href: 'javascript:'
                    },
                    on: {
                      click: () => {
                        console.log(params.row.number)
                      }
                    }
                  }, '确认退货'),
                  h('a', {
                    style: {'display': 'block', 'text-align': 'center'},
                    domProps: {
                      href: 'javascript:'
                    }
                  }, '退货失败')
                ]
              } else if (params.row.status === 2) {
                a = h('a', {
                  style: {'display': 'block', 'text-align': 'center'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      console.log(this.$router)
                      this.$router.push({path: 'orderStore', query: {Order_Number: params.row.number}})
                    }
                  }
                }, '发起退款')
              } else if (params.row.status === 3) {
                a = h('a', {
                  style: {'display': 'block', 'text-align': 'center'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      console.log(this.$router)
                      this.$router.push({path: 'orderStore', query: {Order_Number: params.row.number}})
                    }
                  }
                }, '已退款')
              } else if (params.row.status === 4) {
                a = h('a', {
                  style: {'display': 'block', 'text-align': 'center'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      console.log(this.$router)
                      this.$router.push({path: 'orderStore', query: {Order_Number: params.row.number}})
                    }
                  }
                }, '退款退货成功')
              } else {
                a = h('a', {
                  style: {'display': 'block', 'text-align': 'center'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      console.log(this.$router)
                      this.$router.push({path: 'orderStore', query: {Order_Number: params.row.number}})
                    }
                  }
                }, '')
              }
              return h('div', {}, a)
            },
            align: 'center'
          }
        ],
        data1: [],
        // 操作日志
        modal1: false,
        modal2: true,
        column2: [
          {
            title: '操作类型',
            key: 'type'
          },
          {
            title: '操作人',
            key: 'name'
          },
          {
            title: '操作时间',
            key: 'date'
          },
          {
            title: '退单状态',
            key: 'status'
          }
        ],
        data2: [
          {id: '1234567890', logistics: [{name: '顺丰快递'}, {name: '中通快递'}, {name: '圆通快递'}], address: '浙江宁波市慈溪市XXXX', contacts: '陈升', mobile: '13792930828'}
        ],
        selectedOrders: [],
        // orderStatusList 查询状态
        orderStatusList: [
          {
            value: 0,
            label: '待退货'
          },
          {
            value: 1,
            label: '已退货'
          },
          {
            value: 2,
            label: '确认退货'
          },
          {
            value: 3,
            label: '发起退款'
          },
          {
            value: 4,
            label: '已退款'
          },
          {
            value: 5,
            label: '退货退款成功'
          }
        ],
        // 查询条件
        local: {
          status: null,
          orderNo: null,
          amountFrom: null,
          amountTo: null,
          createDateFrom: null,
          createDateTo: null,
          payDateFrom: null,
          payDateTo: null,
          memberMobile: null
        },
        orderStartTime: '',
        orderEndTime: '',
        payStartTime: '',
        payEndTime: '',
        tabStatus: '0'
      }
    },
    mounted () {
//      this.orderList((data) => {
//        this.fen2yuan(data)
//        this.StatusChange(data)
//        this.formatDate(data)
//        this.total = data.total
//        this.data1 = data.list
//        this.loading = false
//      })
    },
    methods: {
// -----------------接口调用-----------
      orderList (callback) {
        this.$http.post(...omAPI.postOrderList(this.pageNum, this.pageSize, this.params))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response.data.orderItems)
              }
            } else {
              this.loading = false
            }
          })
          .catch((res) => {
            this.loading = false
          })
      },
// -----------------数据处理-----------
      // get list data
      orderStatus (name) {
        switch (name) {
          case '1' : {
            this.params.status = name
            break
          }
          case '2': {
            this.params.status = name
            break
          }
          case '3': {
            this.params.status = name
            break
          }
          case '4': {
            this.params.status = name
            break
          }
          case '5': {
            this.params.status = name
            break
          }
          default: {
            this.params.status = name
            break
          }
        }
      },
      // 分页
      pageChange (val) {
        let that = this
        that.pageNum = val
        that.loading = true
        let searchItem = {}
        for (let key in this.local) {
          if (this.local[key] !== null && this.local[key] !== '') {
            searchItem[key] = this.local[key]
          }
        }
        console.log('searchItem: ' + searchItem)
        if (JSON.stringify(searchItem) === '{}') {
          that.orderList((data) => {
            this.fen2yuan(data)
            this.StatusChange(data)
            this.formatDate(data)
            this.total = data.total
            this.data1 = data.list
            this.loading = false
          })
        } else {
          that.orderSearch(0)
        }
      },
      /*
       分转元
       amount 实际付款总价（优惠后总价）
       orderProductItems => price 单个商品价格 sum price*quantity
       */
      fen2yuan (data) {
        for (let a of data.list) {
          a.floatAmount = a.amount / 100
          a.floatAmount = a.floatAmount % 1 ? parseFloat(a.floatAmount) : parseFloat(a.floatAmount) + '.00'
          for (let b of a.orderProductItems) {
            b.floatPrice = b.price / 100
            b.floatPrice = b.floatPrice % 1 ? parseFloat(b.floatPrice) : parseFloat(b.floatPrice) + '.00'
            b.floatSum = b.sum / 100
            b.floatSum = b.floatSum % 1 ? parseFloat(b.floatSum) : parseFloat(b.floatSum) + '.00'
            b.currentPrice = (b.originalPrice * b.quantity) / 100
            b.currentPrice = b.currentPrice % 1 ? parseFloat(b.currentPrice) : parseFloat(b.currentPrice) + '.00'
            b.discounts = b.currentPrice - b.floatSum
            b.discounts = b.discounts + '.00'
          }
        }
      },
      /*
       后台数据订单状态：
       1 待支付；2 已支付；3 已发货；4 已收货；5 已撤单；
       6 待退款；7 退款失败；8  已退款；9 已完结
       */
      StatusChange (data) {
        for (let a of data.list) {
          switch (a.status) {
            case 1: {
              a.statuscn = '待付款'
              break
            }
            case 2: {
              a.statuscn = '待出库'
              break
            }
            case 3: {
              a.statuscn = '待收货'
              break
            }
            case 4: {
              a.statuscn = '已完成'
              break
            }
            case 5: {
              a.statuscn = '已取消'
              break
            }
            default: {
              break
            }
          }
        }
      },
      /*
       搜索查询
       */
      orderSearch (first) {
        let that = this
        let params = {}
        if (first === 1) {
          that.pageNum = 1
        }
        if (!this.validFormat()) {
          return
        }
        // 转换时间赋值
        this.local.createDateFrom = this.formatDateYMD(this.local.createDateFrom)
        this.local.createDateTo = this.formatDateYMD(this.local.createDateTo)
        this.local.payDateFrom = this.formatDateYMD(this.local.payDateFrom)
        this.local.payDateTo = this.formatDateYMD(this.local.payDateTo)
        this.local.amountFrom = this.convertFen(this.local.amountFrom)
        this.local.amountTo = this.convertFen(this.local.amountTo)
        if (this.local.status != null) {
          this.tabStatus = this.local.status.toString()
        }
        for (let key in this.local) {
          if (this.local[key] !== null && this.local[key] !== '') {
            params[key] = this.local[key]
          }
        }
        this.$http.post(...omAPI.postOrderList(this.pageNum, this.pageSize, params))
          .then((response) => {
            if (response.data.code === 200) {
              let jsonData = response.data.orderItems
              that.fen2yuan(jsonData)
              that.StatusChange(jsonData)
              that.formatDate(jsonData)
              that.total = jsonData.total
              that.data1 = jsonData.list
              that.loading = false
            } else {
              this.loading = false
            }
          })
          .catch((res) => {
            this.loading = false
          })
      },
      revertSearch () {
        if (this.local.status.length > 0) {
          this.local.status = null
        } else if (this.local.orderNo.length > 0) {
          this.local.orderNo = null
        } else if (this.local.amountFrom.length > 0) {
          this.local.amountFrom = null
        } else if (this.local.amountTo.length > 0) {
          this.local.amountTo = null
        } else if (this.local.createDateFrom.length > 0) {
          this.local.createDateFrom = null
        } else if (this.local.createDateTo.length > 0) {
          this.local.createDateTo = null
        } else if (this.local.payDateFrom.length > 0) {
          this.local.payDateFrom = null
        } else if (this.local.payDateTo.length > 0) {
          this.local.payDateTo = null
        } else if (this.local.memberMobile.length > 0) {
          this.local.memberMobile = null
        }
      },
      selectValue (val) {
        console.log(val)
        this.local.status = val
      },
      beforePay () {
        console.log('paybefore')
      },
      beforeSend () {
        console.log('sendbefore')
      },
      beforeGet () {
        console.log('getbefore')
      },
      beforeFinsh () {
        console.log('finishbefore')
      },
      beforeCancel () {
        console.log('cancelbefore')
      },
      cancelSend () {
        this.modal1 = false
      },
      cancelRemark () {
        this.modal2 = false
      },
      remark () {
        this.modal2 = true
      },
      selectItem (val) {
//      console.log(val)
        this.remarkAmount = val.length
        if (val.length !== 0 && val.length < 6) {
          this.disModal1 = false
          this.disModal2 = false
          this.data2 = []
          this.selectedOrders = []
          val.forEach(e => {
            let itemDetail = {
              number: e.number,
              receiverAddress: e.orderAddressItem.receiverAddress,
              receiverName: e.orderAddressItem.receiverName,
              receiverMobile: e.orderAddressItem.receiverMobile
            }
            let pInfoList = []
            for (let i of e.orderProductItems) {
              let amount = i.price * i.quantity
              let data3Detail = {
                number: e.number,
                name: i.name,
                price: this.convertYuan(i.price),
                quantity: i.quantity,
                sum: this.convertYuan(amount)
              }
              pInfoList.push(data3Detail)
            }
            let details = {
              number: e.number,
              pInfo: pInfoList
            }
            this.selectedOrders.push(details)
            this.data2.push(itemDetail)
          })
        } else {
          if (val.length > 5) {
            this.$Message.warning('一次最多可同时备注5个订单!')
          }
          this.disModal1 = true
          this.disModal2 = true
        }
      },
      clearDate () {
        if (this.local.orderStartTime.length > 0) {
          this.local.startTime = null
        } else if (this.local.orderEndTime.length > 0) {
          this.local.orderEndTime = null
        } else if (this.local.payStartTime.length > 0) {
          this.local.payStartTime = null
        } else if (this.local.payEndTime.length > 0) {
          this.local.payEndTime = null
        }
      },
      // 转换日期
      formatDate (data) {
        for (let a of data.list) {
          let date = new Date(parseInt(a.createDate))
          a.createDate = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)

          let payDate = new Date(parseInt(a.payDate))
          a.payDate = payDate.getFullYear() + '-' + ('0' + (1 + payDate.getMonth())).slice(-2) + '-' + ('0' + payDate.getDate()).slice(-2) + ' ' + ('0' + payDate.getHours()).slice(-2) + ':' + ('0' + payDate.getMinutes()).slice(-2)
        }
      },
      // 转换年月日
      formatDateYMD (date) {
        if (date !== '') {
          if (new Date(date) !== 'Invalid Date') {
            let d = new Date(date)
            return d.getFullYear() + '-' + ('0' + (1 + d.getMonth())).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
          }
        } else {
          return date
        }
      },
      validFormat () {
        if (this.local.amountFrom > this.local.amountTo) {
          this.$Message.warning('最小金额不能大于最大金额！')
          return false
        }
        if (new Date(this.local.createDateFrom) > new Date(this.local.createDateTo)) {
          this.$Message.warning('开始时间不能大于结束时间！')
          return false
        }
        if (new Date(this.local.payDateFrom) > new Date(this.local.payDateTo)) {
          this.$Message.warning('开始时间不能大于结束时间！')
          return false
        }
        if (this.local.memberMobile !== '' && this.local.memberMobile !== null) {
          if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(this.local.memberMobile))) {
            this.$Message.warning('手机号码格式错误！')
            return false
          }
        }

        return true
      },
      convertYuan (data) {
        let yuan = data / 100
        yuan = yuan % 1 ? parseFloat(yuan) : parseFloat(yuan) + '.00'
        return yuan
      },
      convertFen (data) {
        if (data !== '') {
          return data * 100
        }
      }
    },
    computed: {
      markTitle () {
        if (this.selectedOrders.length > 1) {
          return '批量备注'
        } else {
          return '添加备注'
        }
      },
      listStatus: function () {
        return this.params.status
      }
    },
    watch: {
      listStatus: function () {
        this.data1 = []
        this.pageNum = 1
        this.pageSize = 5
        this.orderList((data) => {
          this.fen2yuan(data)
          this.StatusChange(data)
          console.log(data.list)
          this.total = data.total
          this.data1 = data.list
          this.loading = false
        })
      },
      orderStartTime: function () {
        if (this.orderStartTime !== '') {
          let date = this.orderStartTime
          let Y = `${1900 + date.getYear()}`
          let M = `${date.getMonth() + 1}`
          let D = `${('0' + date.getDate()).slice(-2)}`
          let h = `${('0' + date.getHours()).slice(-2)}`
          let m = `${('0' + date.getMinutes()).slice(-2)}`
          let s = `${('0' + date.getSeconds()).slice(-2)}`
          this.local.orderStartTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        }
      },
      orderEndTime: function () {
        if (this.orderEndTime !== '') {
          let date = this.orderEndTime
          let Y = `${1900 + date.getYear()}`
          let M = `${date.getMonth() + 1}`
          let D = `${('0' + date.getDate()).slice(-2)}`
          let h = `${('0' + date.getHours()).slice(-2)}`
          let m = `${('0' + date.getMinutes()).slice(-2)}`
          let s = `${('0' + date.getSeconds()).slice(-2)}`
          this.local.orderEndTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        }
      },
      payStartTime: function () {
        if (this.payStartTime !== '') {
          let date = this.payStartTime
          let Y = `${1900 + date.getYear()}`
          let M = `${date.getMonth() + 1}`
          let D = `${date.getDate()}`
          if (D < 10) {
            D = '0' + D
          }
          let h = `${date.getHours()}`
          if (h < 10) {
            h = '0' + h
          }
          let m = `${date.getMinutes()}`
          if (m < 10) {
            m = '0' + m
          }
          let s = `${date.getSeconds()}`
          if (s < 10) {
            s = '0' + s
          }
          this.local.payStartTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        }
      },
      payEndTime: function () {
        if (this.payEndTime !== '') {
          let date = this.payEndTime
          let Y = `${1900 + date.getYear()}`
          let M = `${date.getMonth() + 1}`
          let D = `${date.getDate()}`
          if (D < 10) {
            D = '0' + D
          }
          let h = `${date.getHours()}`
          if (h < 10) {
            h = '0' + h
          }
          let m = `${date.getMinutes()}`
          if (m < 10) {
            m = '0' + m
          }
          let s = `${date.getSeconds()}`
          if (s < 10) {
            s = '0' + s
          }
          this.local.payEndTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        }
      }
    }
  }
</script>

