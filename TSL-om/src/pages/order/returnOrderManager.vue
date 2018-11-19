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
  .width-45 {
    width: 45%;
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
  .batch-mark {
    max-height: 380px;
    overflow-y: scroll;
  }
  .line {
    border: 1px solid #e9eaec;
    margin: 10px 0px;
  }
  .ivu-modal-wrap * div.my-footer{
    display: none!important;
  }
  .ivu-modal-wrap * textarea{
    width: 100%;
  }
  .ivu-modal-wrap * div.submit-footer{
    text-align: right;
  }
  .return-detail{
    margin:10px 0;
    font-size:15px;
  }
  .max-refund{
    color:#ccc;
  }
  .actually-refund{
    width: 16.6%;
    display: inline-block;
  }
  .text-right{
    text-align:right;
  }
</style>
<template>
  <div id="orderManager">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>退货订单查询与跟踪</BreadcrumbItem>
    </Breadcrumb>
    <Form inline class="margin-10">
      <FormItem label="退货订单编号：" class="width-55" :label-width="110">
        <Input class="order-input" v-model="local.afterSaleNo"/>
      </FormItem>
      <FormItem label="退货时间：" class="width-40">
        <DatePicker v-model="local.afterSaleDateFrom" @on-clear="clearDate()" type="date" format="yyyy-MM-dd" placeholder="选择日期和时间" style="width: 170px"></DatePicker>
        <DatePicker v-model="local.afterSaleDateTo" @on-clear="clearDate()" type="date" format="yyyy-MM-dd" placeholder="选择日期和时间" style="width: 170px"></DatePicker>
      </FormItem>
      <FormItem label="订单编号：" class="width-55" :label-width="110">
        <Input class="order-input" v-model="local.orderNo"/>
      </FormItem>
      <FormItem label="退单金额：" class="width-40">
        <Input class="my-date" v-model="local.refundAmountFrom" placeholder="最小金额" style="width: 170px;"/>
        <Input class="my-date" v-model="local.refundAmountTo" placeholder="最大金额" style="width: 170px;"/>
      </FormItem>
      <FormItem label="商户订单号：" class="width-55" :label-width="110">
        <Input class="order-input" v-model="local.payNo"/>
      </FormItem>
      <FormItem label="收货人手机：" class="width-55" :label-width="110">
        <Input class="order-input" v-model="local.receiverPhone" :maxlength="11"/>
      </FormItem>
      <FormItem class="width-55">
        <Button @click="getAfterSaleList" type="primary" class="btn-w">查询</Button>
        <Button @click="resetButton" type="primary" class="btn-w">重置</Button>
      </FormItem>
    </Form>

    <Tabs type="card" v-model="local.status" @on-click="queryStatus">
      <TabPane label="全部退货订单" name="0"></TabPane>
      <TabPane label="待退货" name="4"></TabPane>
      <TabPane label="已退货" name="6"></TabPane>
      <TabPane label="已退款" name="8"></TabPane>
      <TabPane label="退货失败" name="5"></TabPane>
    </Tabs>

    <div class="tableBox">
      <Table :columns="column1" :data="data1" height="500"></Table>
    </div>

    <Page :total="page.total" :current="page.pageNum" :page-size="page.pageSize" show-total class="marginPage" @on-change="pageChange"></Page>
    <Modal v-model="modal1" title="退货订单操作日志" width="700">
      <div class="tableBox">
        <Table :columns="column2" :data="data2"></Table>
      </div>
      <div slot="footer" class="my-footer"></div>
    </Modal>

    <Modal v-model="modal2" title="确认退货">
      <p>确定要确认退货吗？</p>
      <div slot="footer">
        <Button @click="saleReturn" type="primary">确定</Button>
        <Button @click="cancelSaleReturn">取消</Button>
      </div>
    </Modal>

    <Modal v-model="modal3" title="退货失败">
      <p>退货失败!</p>
      <div slot="footer">
        <Button @click="cancelReturnFailure">取消</Button>
        <Button @click="returnFailure" type="primary">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modal6" title="退款失败">
      <p>您确定要设置当前订单为“退款失败”？</p>
      <div slot="footer">
        <Button @click="cancelRefundFailure">取消</Button>
        <Button @click="refundFailure" type="primary">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modal4" title="添加备注" width="778">
      <div class="batch-mark">
        <!--<Table :columns="column4" :data="data4"></Table>-->
        <label for="">备注：</label>
        <Input style="width: calc(100% - 36px); margin-top: 10px" v-model="afterSaleRemark.remark"/>
      </div>
      <div slot="footer">
        <Button @click="cancelRemark">取消</Button>
        <Button @click="remarkBtn" type="primary">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modal5" title="确认退款" width="694">
      <Row class="return-detail">
        <Col span="4" class="text-right">订单编号：</Col>
        <Col span="8">{{refund.orderNo}}</Col>
        <Col span="4" class="text-right">订单金额：</Col>
        <Col span="8">{{refund.floatAmount}} 元(含优惠金额：0.00元)</Col>
      </Row>
      <Row class="return-detail">
        <Col span="4" class="text-right">退货订单编号：</Col>
        <Col span="8">{{refund.refundOrderNo}}</Col>
        <Col span="4" class="text-right">退货订单金额：</Col>
        <Col span="8">{{refund.refundAmount}} 元</Col>
      </Row>
      <Row class="return-detail">
        <Col span="4" class="text-right">退款方式：</Col>
        <Col span="12">
          <Select class="order-input" v-model="refundDetails.refundType">
            <Option v-for="item in payList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </Col>
      </Row>
      <div class="return-detail">
          <span class="actually-refund text-right">实退款金额：</span>
          <Input v-model="refundDetails.actuallyRefundAmount" :placeholder="refund.actuallyRefundAmount" style="width:23%;"/>
          <span class="max-refund">您最多可退款{{refund.refundAmount}}元</span>
      </div>
      <div class="tableBox">
        <Table :columns="column3" :data="data3"></Table>
      </div>
      <div slot="footer">
        <Button @click="cancelRefund">取消</Button>
        <Button @click="makeSureRefund" type="primary">提交</Button>
      </div>
    </Modal>
    <Loading :isload="loading"></Loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as omAPI from '../../services/afterSale.es6'
  import Loading from '../../components/loading.vue'
  import cryptoJs from 'crypto-js'
  import * as extendTool from '../../services/tool.es6'
  export default {
    name: 'orderManager',
    components: {
      Loading
    },
    data () {
      return {
        page: {
          total: 0,
          pageNum: 1,
          pageSize: 20
        },
        loading: true,
        modal1: false,
        modal2: false,
        modal3: false,
        modal4: false,
        modal5: false,
        modal6: false,
        value1: '',
        //
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
            title: '退货订单编号',
            key: 'afterSaleNo',
            width: 180,
            align: 'center'
          },
          {
            title: '商户订单号',
            key: 'payNo',
            width: 180,
            align: 'center'
          },
          {
            title: '商品信息',
            width: 300,
            align: 'center',
            render: (h, params) => {
              let pl = []
              let p = h('div', {
                style: {overflow: 'hidden', margin: '5px'}
              }, [
                h('img', {
                  domProps: {src: params.row.defaultPicture},
                  style: {display: 'block', float: 'left', width: '50px', height: '50px', 'margin-right': '5px'}
                }),
                h('p', {
                  style: {width: '190px', display: 'inline-block', textAlign: 'left'}
                }, extendTool.handleName(params.row.productName))
              ])
              pl.push(p)
              return h('div', {}, pl)
            }
          },
          {
            title: '设计编号',
            key: 'barcode',
            width: 180,
            align: 'center'
          },
          {
            title: '订单编号',
            key: 'orderNo',
            width: 180,
            align: 'center'
          },
          {
            title: '买家手机',
            key: 'memberName',
            width: 120,
            align: 'center'
          },
          {
            title: '单价/数量',
            key: 'priceQuantity',
            width: 200,
            align: 'center',
            render: (h, params) => {
              let pn = []
              let b = h('p', {style: {margin: '5px', height: '50px', padding: '10px 0'}}, [
                h('span', {}, params.row.productPrice),
                h('span', {
                  style: {marginLeft: '2px'}
                }, `(${params.row.quantity}件)`)
              ])
              pn.push(b)
              return h('div', {}, pn)
            }
          },
          {
            title: '收货人',
            key: 'receiverName',
            width: 100,
            align: 'center'
          },
          {
            title: '退货时间',
            key: 'refundDate',
            width: 180,
            align: 'center'
          },
          {
            title: '退单状态',
            key: 'statuscn',
            width: 140,
            align: 'center'
          },
          {
            title: '退款方式',
            key: 'refundType',
            width: 140,
            align: 'center'
          },
          {
            title: '退单金额',
            width: 180,
            align: 'center',
            key: 'floatSum'
          },
          {
            title: '实退单金额',
            width: 180,
            align: 'center',
            key: 'actRefundAmount'
          },
          {'title': '备注信息', key: 'merchantRemark', width: 180},
          {
            title: '操作',
            width: 305,
            renderHeader: (h, params) => {
              return h('div', {
                style: {
                  'text-align': 'center'
                }
              }, params.column.title)
            },
            render: (h, params) => {
              let a
              if (params.row.status === 4) {
                a = [
                  h('a', {
                    style: {'text-align': 'center', 'margin': '0 6px'},
                    domProps: {
                      href: 'javascript:'
                    },
                    on: {
                      click: () => {
                        this.returnOrder = params.row.afterSaleNo
                        this.modal2 = true
                      }
                    }
                  }, '确认退货'),
                  h('a', {
                    style: {'text-align': 'center', 'margin': '0 6px'},
                    domProps: {
                      href: 'javascript:'
                    },
                    on: {
                      click: () => {
                        this.returnOrder = params.row.afterSaleNo
                        this.modal3 = true
                      }
                    }
                  }, '退货失败'),
                  h('a', {
                    style: {'text-align': 'center', 'margin': '0 6px'},
                    domProps: {
                      href: 'javascript:'
                    },
                    on: {
                      click: () => {
                        this.afterSaleRemark.orderNo = params.row.afterSaleNo
                        this.modal4 = true
                      }
                    }
                  }, '添加备注')
                ]
              }
              if (params.row.status === 6) {
                a = [
                  h('a', {
                    style: {'text-align': 'center', 'margin': '0 6px'},
                    domProps: {href: 'javascript:'},
                    on: {
                      click: () => {
                        this.data3 = []
                        this.getAfterSaleDetail(params.row.afterSaleNo)
                        this.refundDetails.refundAmount = params.row.refundAmount
                        this.returnOrder = params.row.afterSaleNo
                        this.modal5 = true
                      }
                    }
                  }, '确认退款'),
                  h('a', {
                    style: {'text-align': 'center', 'margin': '0 6px'},
                    domProps: {
                      href: 'javascript:'
                    },
                    on: {
                      click: () => {
                        this.returnOrder = params.row.afterSaleNo
                        this.modal6 = true
                      }
                    }
                  }, '退款失败'),
                  h('a', {
                    style: {'text-align': 'center', 'margin': '0 6px'},
                    domProps: {
                      href: 'javascript:'
                    },
                    on: {
                      click: () => {
                        this.afterSaleRemark.orderNo = params.row.afterSaleNo
                        this.modal4 = true
                      }
                    }
                  }, '添加备注')
                ]
              }
              if (params.row.status === 8) {
                a = [
                  h('a', {
                    style: {'text-align': 'center', 'margin': '0 6px'},
                    domProps: {
                      href: 'javascript:'
                    },
                    on: {
                      click: () => {
                        this.afterSaleRemark.orderNo = params.row.afterSaleNo
                        this.modal4 = true
                      }
                    }
                  }, '添加备注')
                ]
              }
              let om = [
                a,
                h('a', {
                  style: {'text-align': 'center', 'margin': '0 6px'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      this.returnOrder = params.row.afterSaleNo
                      this.getOperationLog()
                    }
                  }
                }, '操作日志')
              ]
              return h('div', {style: {'padding': '6px 0'}}, om)
            },
            align: 'center'
          }
        ],
        data1: [],
        column2: [
          {
            title: '操作类型',
            key: 'operationType',
            width: 160,
            align: 'center'
          },
          {
            title: '操作人',
            key: 'operatorName',
            width: 125,
            align: 'center'
          },
          {
            title: '操作时间',
            key: 'operationDate',
            width: 220,
            align: 'center'
          },
          {
            title: '退单状态',
            key: 'statuscn',
            width: 140,
            align: 'center'
          }
        ],
        data2: [],
        column3: [
          {
            title: '商品信息',
            width: 300,
            align: 'center',
            render: (h, params) => {
              let pl = []
              let p = h('div', {
                style: {overflow: 'hidden', margin: '5px'}
              }, [
                h('img', {
                  domProps: {src: params.row.defaultPicture},
                  style: {display: 'block', float: 'left', width: '50px', height: '50px', 'margin-right': '5px'}
                }),
                h('p', {
                  style: {width: '190px', display: 'inline-block', textAlign: 'left'}
                }, extendTool.handleName(params.row.productName))
              ])
              pl.push(p)
              return h('div', {}, pl)
            }
          },
          {
            title: '销售单价',
            key: 'productPrice',
            width: 170,
            align: 'center'
          },
          {
            title: '件数',
            key: 'quantity',
            width: 170,
            align: 'center'
          }
        ],
        data3: [],
        column4: [
          {title: '商品编码', key: 'productId', width: 160},
          {
            title: '商品名称',
            key: 'productName',
            width: 300,
            render: (h, params) => {
              return h('div', {}, extendTool.handleName(params.row.productName))
            }
          },
          {title: '数量', key: 'quantity', width: 90},
          {title: '价格', key: 'productPrice', width: 90},
          {title: '小计', key: 'floatSum', width: 90}
        ],
        data4: [
          {productId: '123123', name: 'productId', quantity: 3, sum: '4588.00'},
          {productId: '789900', name: 'orderId12', quantity: 5, sum: '4988.00'}
        ],
        payList: [
          {
            value: 1,
            label: '银联'
          },
          {
            value: 2,
            label: '支付宝'
          },
          {
            value: 3,
            label: '微信'
          },
          {
            value: 4,
            label: '其他'
          }
        ],
        // 查询条件
        local: {
          status: 0,
          afterSaleNo: null,
          orderNo: null,
          payNo: null,
          receiverPhone: null,
          refundAmountFrom: null,
          refundAmountTo: null,
          afterSaleDateFrom: null,
          afterSaleDateTo: null
        },
        orderStartTime: '',
        orderEndTime: '',
        payStartTime: '',
        payEndTime: '',
        tabStatus: '0',
        batch_orderNumber: null,
        batchRemark: null,
        operator: '',
        returnOrder: null,
        refund: {
          orderNo: null,
          refundOrderNo: null,
          amount: null,
          refundAmount: null,
          actuallyRefundAmount: ''
        },
        afterSaleRemark: {
          orderNo: null,
          remark: null
        },
        refundDetails: {
          actuallyRefundAmount: null,
          refundAmount: null,
          refundType: null
        }
      }
    },
    mounted () {
      this.getOperator()
      this.getAfterSaleList()
    },
    methods: {
      // 获取退货订单列表
      getAfterSaleList () {
        let that = this
        that.page.total = 0
        if (!this.validFormat()) {
          return
        }
        let params = {}
        for (let key in this.local) {
          if (this.local[key] !== null && this.local[key] !== '') {
            params[key] = this.local[key]
          }
        }
        if (params.afterSaleDateFrom) {
          params.afterSaleDateFrom = this.formatDateYMD(params.afterSaleDateFrom)
        }
        if (params.afterSaleDateTo) {
          params.afterSaleDateTo = this.formatDateYMD(params.afterSaleDateTo)
        }
        if (params.refundAmountFrom) {
          params.refundAmountFrom = parseFloat(params.refundAmountFrom) * 100
        }
        if (params.refundAmountTo) {
          params.refundAmountTo = parseFloat(params.refundAmountTo) * 100
        }
        this.$http.post(...omAPI.getAfterSaleList(this.page.pageNum, this.page.pageSize, params))
          .then((response) => {
            if (response.data.code === 200) {
              that.loading = false
              let jsonData = response.data.afterSaleOrderItems
              that.fen2yuan(jsonData)
              that.StatusChange(jsonData.list)
              that.formatDate(jsonData.list)
              that.refundTypeChange(jsonData.list)
              that.page.total = jsonData.total
              that.data1 = jsonData.list
            } else {
              this.loading = false
              that.data1 = []
            }
          })
      },
      getAfterSaleDetail (afterSaleNo) {
        let params = {
          afterSaleNo: afterSaleNo
        }
        this.$http.post(...omAPI.getAfterSaleList(1, 5, params))
          .then((response) => {
            if (response.data.code === 200) {
              this.loading = false
              let jsonData = response.data.afterSaleOrderItems
              this.fen2yuan(jsonData)
              this.refund = {
                orderNo: jsonData.list[0].orderNo,
                refundOrderNo: jsonData.list[0].afterSaleNo,
                actuallyRefundAmount: jsonData.list[0].actRefundAmount,
                refundAmount: jsonData.list[0].floatSum,
                floatAmount: jsonData.list[0].floatAmount
              }
              this.data3.push(jsonData.list[0])
            }
          })
      },
      formatDateYMDHS (date) {
        let str = ''
        date = parseInt(date)
        if (date !== '' && date !== null) {
          if (new Date(date) !== 'Invalid Date') {
            let d = new Date(date)
            str = `${d.getFullYear()}-${('0' + (1 + d.getMonth())).slice(-2)}-${('0' + d.getDate()).slice(-2)} ${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
          }
        } else {
          str = ''
        }
        return str
      },
// -----------------数据处理-----------
      orderStatus (name) {
        this.params.status = name
      },
      // 重置
      resetButton () {
        this.local.status = null
        this.local.afterSaleNo = null
        this.local.orderNo = null
        this.local.payNo = null
        this.local.receiverPhone = null
        this.local.refundAmountFrom = null
        this.local.refundAmountTo = null
        this.local.afterSaleDateFrom = null
        this.local.afterSaleDateTo = null
      },
      // 元转为分
      convertFen (data) {
        if (data !== '' && data !== null) {
          return data * 100
        }
      },
      // 分转元 amount 实际付款总价（优惠后总价
      fen2yuan (data) {
        for (let a of data.list) {
          a.floatAmount = a.amount / 100
          a.floatAmount = a.floatAmount % 1 ? parseFloat(a.floatAmount) : parseFloat(a.floatAmount) + '.00'
          a.floatSum = a.sum / 100
          a.floatSum = a.floatSum % 1 ? parseFloat(a.floatSum) : parseFloat(a.floatSum) + '.00'
          a.productPrice = a.price / 100
          a.productPrice = a.productPrice % 1 ? parseFloat(a.productPrice) : parseFloat(a.productPrice) + '.00'
          if (a.refundOrderItem) {
            a.actRefundAmount = a.refundOrderItem.actuallyRefundAmount / 100
            a.actRefundAmount = a.actRefundAmount % 1 ? parseFloat(a.actRefundAmount) : parseFloat(a.actRefundAmount) + '.00'
            a.refundAmount = a.refundOrderItem.refundAmount / 100
            a.refundAmount = a.refundAmount % 1 ? parseFloat(a.refundAmount) : parseFloat(a.refundAmount) + '.00'
          } else {
            a.actRefundAmount = ''
            a.refundAmount = ''
          }
        }
      },
      validFormat () {
        let reg = /^\d+(?:\.\d{1,4})?$/
        if (this.local.refundAmountFrom !== null && this.local.refundAmountFrom !== '') {
          if (!reg.test(this.local.refundAmountFrom)) {
            this.$Message.warning('金额只能为非负数')
            return false
          }
        }
        if (this.local.refundAmountTo !== null && this.local.refundAmountTo !== '') {
          if (!reg.test(this.local.refundAmountTo)) {
            this.$Message.warning('金额只能为非负数')
            return false
          }
        }
        if (this.local.refundAmountFrom !== null && this.local.refundAmountTo !== null) {
          if (parseFloat(this.local.refundAmountFrom) > parseFloat(this.local.refundAmountTo)) {
            this.$Message.warning('最小金额不能大于最大金额！')
            return false
          }
        }
        if (new Date(this.local.afterSaleDateFrom) > new Date(this.local.afterSaleDateTo)) {
          this.$Message.warning('开始时间不能大于结束时间！')
          return false
        }
        if (this.local.receiverPhone !== '' && this.local.receiverPhone !== null) {
          if (!(/\d{11}$/.test(this.local.receiverPhone))) {
            this.$Message.warning('手机号码格式错误！')
            return false
          }
        }
        return true
      },
      /* 后台数据订单状态:  1 待审核；2 审核通过；3 审核不通过；4 待商家收货；5 退货失败；
                           6 确认收货/待退款；7 退款失败；8 已退款
      */
      StatusChange (data) {
        for (let a of data) {
          switch (a.status) {
            case 1: {
              a.statuscn = '待审核'
              break
            }
            case 2: {
              a.statuscn = '审核通过'
              break
            }
            case 3: {
              a.statuscn = '审核不通过'
              break
            }
            case 4: {
              a.statuscn = '待退货'
              break
            }
            case 5: {
              a.statuscn = '退货失败'
              break
            }
            case 6: {
              a.statuscn = '已退货'
              break
            }
            case 7: {
              a.statuscn = '退款失败'
              break
            }
            case 8: {
              a.statuscn = '已退款'
              break
            }
            default: {
              break
            }
          }
        }
      },
      // 切换tab标签
      queryStatus (name) {
        this.resetButton()
        this.local.status = name
        this.getAfterSaleList()
      },
      cancelRefund () {
        this.refundDetails.refundType = ''
        this.refundDetails.actuallyRefundAmount = ''
        this.modal5 = false
      },
      cancelRemark () {
        this.afterSaleRemark.remark = ''
        this.modal4 = false
      },
      // 获取操作人员姓名
      getOperator () {
        let sessionInfo = sessionStorage.getItem('userInfo')
        let us = cryptoJs.AES.decrypt(sessionInfo, 'key', 'conf')
        let qxContent = JSON.parse(us.toString(cryptoJs.enc.Utf8))
        this.operator = qxContent.operatorVoList[0].userName
      },
      cancelSaleReturn () {
        this.modal2 = false
      },
      cancelReturnFailure () {
        this.modal3 = false
      },
      cancelRefundFailure () {
        this.modal6 = false
      },
      // 确认退货
      saleReturn () {
        console.log(this.returnOrder)
        this.$http.put(...omAPI.receivingNote(this.returnOrder, this.operator))
          .then((response) => {
            if (response.data.code === 200) {
              this.$Message.success('退货成功!')
              this.getAfterSaleList()
              this.modal2 = false
            } else {
              this.modal2 = false
            }
          })
      },
      // 设置退货失败
      returnFailure () {
        this.$http.put(...omAPI.returnFailure(this.returnOrder, this.operator))
          .then((response) => {
            if (response.data.code === 200) {
              this.modal3 = false
              this.$Message.success('操作成功!')
              this.getAfterSaleList()
            } else {
              this.$Message.error('操作失败!')
            }
          })
      },
      // 添加退款信息、确认退款
      makeSureRefund () {
        const reg = /^\d+(?:\.\d{1,4})?$/
        this.refundDetails.refundAmount = parseFloat(this.refund.refundAmount) * 100
        let params = {
          actuallyRefundAmount: parseFloat(this.refundDetails.actuallyRefundAmount) * 100,
          refundAmount: this.refundDetails.refundAmount,
          refundType: this.refundDetails.refundType
        }
        if (parseFloat(params.actuallyRefundAmount) > parseFloat(params.refundAmount)) {
          this.$Message.warning('实退款金额不能多于退货订单金额')
        } else if (params.actuallyRefundAmount === null || params.actuallyRefundAmount === '' || isNaN(params.actuallyRefundAmount)) {
          this.$Message.warning('请输入实退款金额')
        } else if (!reg.test(params.actuallyRefundAmount)) {
          this.$Message.warning('金额只能为非负数')
        } else {
          this.$http.post(...omAPI.refundDetail(this.returnOrder, params))
            .then((response) => {
              if (response.data.code === 200) {
                this.$Message.success('添加退款信息成功！')
              } else {
                this.$Message.error('操作失败!')
              }
            })
          this.refundSuccess()
        }
      },
      // 设置退款失败
      refundFailure () {
        this.$http.put(...omAPI.refundFailure(this.returnOrder, this.operator))
          .then((response) => {
            if (response.data.code === 200) {
              this.modal6 = false
              this.getAfterSaleList()
              this.$Message.success('操作成功!')
            } else {
              this.$Message.success('操作失败!')
            }
          })
      },
      // 添加备注
      remarkBtn () {
        if (this.afterSaleRemark.remark === null || this.afterSaleRemark.remark === '') {
          this.$Message.warning('备注信息为空！')
        } else {
          this.$http.put(...omAPI.afterSaleRemark(this.afterSaleRemark.orderNo, this.afterSaleRemark.remark))
            .then((response) => {
              if (response.data.code === 200) {
                this.modal4 = false
                this.getAfterSaleList()
                this.$Message.success('备注信息添加成功')
                this.afterSaleRemark.remark = ''
              }
            })
        }
      },
      // 获取操作日志
      getOperationLog () {
        this.$http.get(...omAPI.getAfterSaleLog(this.returnOrder))
          .then((response) => {
            if (response.data.code === 200) {
              this.loading = false
              this.StatusChange(response.data.afterSaleOrderLogItems)
              this.operateStatus(response.data.afterSaleOrderLogItems)
              this.formatDateYMDHS1(response.data.afterSaleOrderLogItems)
              this.data2 = response.data.afterSaleOrderLogItems
              this.data2.sort(this.compare('operationDate'))
              this.modal1 = true
            }
          })
      },
      // 分页
      pageChange (val) {
        let that = this
        that.page.pageNum = val
        that.loading = true
        let searchItem = {}
        for (let key in this.local) {
          if (this.local[key] !== null && this.local[key] !== '') {
            searchItem[key] = this.local[key]
          }
        }
        that.getAfterSaleList()
      },
      // 转换日期
      formatDate (data) {
        for (let a of data) {
          if (a.refundDate !== null) {
            let date = new Date(parseInt(a.refundDate))
            a.refundDate = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
          } else {
            a.refundDate = ''
          }
        }
      },
      // 转换日期
      formatDateYMDHS1 (data) {
        for (let a of data) {
          if (a.operationDate !== null) {
            let date = new Date(parseInt(a.operationDate))
            a.operationDate = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
          } else {
            a.operationDate = ''
          }
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
      operateStatus (data) {
        for (let a of data) {
          switch (a.operationType) {
            case 1: {
              a.operationType = '新增状态'
              break
            }
            case 2: {
              a.operationType = '修改状态'
              break
            }
            default: {
              break
            }
          }
        }
      },
      refundSuccess () {
        this.$http.put(...omAPI.refundSuccess(this.returnOrder, this.operator))
          .then((response) => {
            if (response.data.code === 200) {
              this.modal5 = false
              this.$Message.success('退款成功!')
              this.getAfterSaleList()
            } else {
              this.modal5 = false
            }
          })
      },
      // 根据对象属性排序
      compare (property) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          if (new Date(value1) > new Date(value2)) {
            return -1
          } else {
            return 1
          }
        }
      },
      // 退款方式  1.银联 2.支付宝 3.微信 4.其他
      refundTypeChange (data) {
        for (let a of data) {
          if (a.refundOrderItem) {
            switch (a.refundOrderItem.refundType) {
              case 1: {
                a.refundType = '银联'
                break
              }
              case 2: {
                a.refundType = '支付宝'
                break
              }
              case 3: {
                a.refundType = '微信'
                break
              }
              case 4: {
                a.refundType = '其他'
                break
              }
              default: {
                break
              }
            }
          } else {
            a.refundType = ''
          }
        }
      }
    }
  }
</script>

