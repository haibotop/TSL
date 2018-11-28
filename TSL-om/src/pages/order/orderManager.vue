<style rel="stylesheet/scss" lang="scss" scoped>
  #orderManager {
    min-width:880px;
  }
  .margin-10 {
    margin: 10px;
  }
  .width-40 {
    width: 33%;
  }
  .width-55 {
    width: 36%;
    margin-left: -5%;
    margin-right: 5%!important
  }
  .width-49{
    width:49%;
  }
  .width-24{
    width: 24%
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
    margin: 10px 0;
  }
  .wid-45 {
    display: inline-block;
    font-size: 14px;
    width: 48%;
  }
  .wid-100 {
    margin:10px 0;
    font-size:14px;
  }
  .width-40 .ivu-form-item-label{
    padding: 10px 0;
  }

  .receiver-width .ivu-form-item-label{
    padding: 10px 0;
  }
  .export-btn{
    color: #495060;
  }
</style>
<template>
  <div id="orderManager">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>订单查询与跟踪</BreadcrumbItem>
    </Breadcrumb>
    <Form inline class="margin-10">
      <FormItem label="订单编号：" class="width-40" :label-width="110">
        <Input class="order-input" v-model="local.orderNo"/>
      </FormItem>
      <FormItem label="订单金额：" class="width-55" :label-width="110">
        <Input class="my-date" v-model="local.amountFrom" placeholder="最小金额" style="width: 140px;"/>
        <Input class="my-date" v-model="local.amountTo" placeholder="最大金额" style="width: 140px;"/>
      </FormItem>
      <FormItem label="折扣码：" class="width-24" :label-wdth="110">
        <Input class="order-input" v-model="local.discountCode"/>
      </FormItem>
      <FormItem label="订单状态：" class="width-40" :label-width="110">
        <Select class="order-input" v-model="local.status" >
          <Option v-for="item in orderStatusList" :value="item.value" :key="item.id">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="下单时间：" class="width-55" :label-width="110">
        <DatePicker v-model="local.createDateFrom" type="date" format="yyyy-MM-dd" placeholder="选择日期和时间" style="width: 140px"></DatePicker>
        <DatePicker v-model="local.createDateTo" type="date" format="yyyy-MM-dd" placeholder="选择日期和时间" style="width: 140px"></DatePicker>
      </FormItem>
      <FormItem label="系统员工编号：" class="width-24 " :label-width="110">
        <Input class="order-input" style="width:151px" v-model="local.systemStaffNum" :maxlength="11"/>
      </FormItem>
      <FormItem label="设计编码：" class="width-40 receiver-width" :label-width="110">
        <Input class="order-input" v-model="local.merchantName"></Input>
      </FormItem>
      <FormItem label="付款时间：" class="width-55" :label-width="110">
        <DatePicker v-model="local.payDateFrom" type="date" format="yyyy-MM-dd" placeholder="选择日期和时间" @clearable = 'true' style="width: 140px"></DatePicker>
        <DatePicker v-model="local.payDateTo" type="date" format="yyyy-MM-dd" @clearable = 'true' placeholder="选择日期和时间" style="width: 140px"></DatePicker>
      </FormItem>
      <FormItem label="员工编号：" class="width-24" :label-wdth="110">
        <Input class="order-input" v-model="local.StaffNum"/>
      </FormItem>
      <FormItem label="用户注册手机：" class="width-40 receiver-width" :label-width="110">
        <Input class="order-input" v-model="local.memberMobile" :maxlength="11"/>
      </FormItem>
      <FormItem label="收货人姓名：" class="width-55 receiver-width" :label-width="110">
        <Input class="order-input" v-model="local.receiverName"></Input>
      </FormItem>
      <FormItem label="收货人电话：" class="width-40 receiver-width" :label-width="110">
        <Input class="order-input" v-model="local.receiverMobile" :maxlength="11"></Input>
      </FormItem>
      <FormItem label="商品名称：" class="width-55 receiver-width" :label-width="110">
        <Input class="order-input" v-model="local.productName"></Input>
      </FormItem>
      <FormItem label="TSL会员号：" class="width-40 receiver-width" :label-width="110">
        <Input class="order-input" v-model="local.tslNo"></Input>
      </FormItem>
      <FormItem>
        <Button @click="orderSearch(1)" type="primary" class="btn-w">查询</Button>
        <Button @click="revertSearch" type="primary" class="btn-w">重置</Button>
      </FormItem>
      <formItem label="历史订单：" style="width:100%;">
        <!--<Button :disabled="canExport" class="btn-w" @click="exportOrder">-->
          <!--导出-->
        <!--</Button>-->
        <Button :disabled="outputBtnStatus" @click="outputHandler">导出</Button>
        <a href="javascript:;" class="export-btn" style="display:none" id="export-table">导出</a>
      </formItem>
    </Form>

    <Tabs type="card" :animated="false" @on-click="orderStatus" v-model="tabStatus">
      <TabPane label="全部订单" name="0"></TabPane>
      <TabPane label="待付款" name="1"></TabPane>
      <TabPane label="待发货" name="2"></TabPane>
      <TabPane label="已发货" name="3"></TabPane>
      <TabPane label="已完成" name="4"></TabPane>
      <TabPane label="已取消" name="5"></TabPane>
    </Tabs>

    <Button class="margin-0-10" :disabled="disModal1" @click="modal1 = true">批量出库</Button>
    <Button class="margin-0-10" :disabled="disModal2" @click="remark">批量备注</Button>
    <div class="tableBox">
      <Table :columns="column1" :data="data1" @on-selection-change="selectItem" height="500"></Table>
    </div>

    <Page :total="total" :current="pageNum" :page-size="pageSize" show-total @on-change="pageChange" class="marginPage"></Page>
    <Modal title="批量出库" v-model="modal1" width="800">
      <Table :columns="column2" :data="data2"></Table>
      <div slot="footer">
        <Button @click="cancelSend">取消</Button>
        <Button @click="batchOutStore" type="primary">出库</Button>
      </div>
    </Modal>
    <Modal :title="markTitle" v-model="modal2" width="800">
      <div class="batch-mark">
        <template v-for="(item, index) in selectedOrders">
          <div class="wid-100">订单编号：<span>{{item.number}}</span></div>
          <Table :columns="column3" :data="item.pInfo"></Table>
          <div class="line" v-if="selectedOrders.length > 1 && index !== selectedOrders.length - 1"></div>
        </template>
        <label for="">备注：</label>
        <Input style="width: calc(100% - 36px); margin-top: 10px" v-model="batchRemark"/>
      </div>
      <div slot="footer">
        <Button @click="cancelRemark">取消</Button>
        <Button @click="batchRemarkBtn" type="primary">确定</Button>
      </div>
    </Modal>
    <Modal title="退货退款" v-model="modal3" width="800">
      <div class="batch-mark">
        <template>
          <div class="wid-100">
            <div class="wid-45">订单编号:{{refund.number}}</div>
            <div class="wid-45">订单金额:{{refund.floatAmount}}(含优惠金额：0.00)</div>
          </div>
          <Table :columns="column4" :data="data4" @on-selection-change="afterSaleItem"></Table>
        </template>
      </div>
      <div slot="footer">
        <Button @click="cancelSalesReturn">取消</Button>
        <Button @click="createAfterSale" type="primary" :disabled="returnDisabled">退货退款</Button>
      </div>
    </Modal>
    <Loading :isload="loading"></Loading>
    <iframe style="display:none;" ref="buyerListIframe" id="buyerListIframe" name="buyerListIframe"></iframe>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as omAPI from '../../services/orderList.es6'
  import * as extendTool from '../../services/tool.es6'
  import * as config from '../../services/config.es6'
  import Loading from '../../components/loading.vue'
  import cryptoJs from 'crypto-js'
  export default {
    name: 'orderManager',
    components: {
      Loading
    },
    data () {
      return {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        loading: true,
        // disabled
        disModal1: true,
        disModal2: true,
        outputBtnStatus: false,
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
            title: '操作',
            width: 250,
            renderHeader: (h, params) => {
              return h('div', {
                style: {
                  'text-align': 'center',
                }
              }, params.column.title)
            },
            render: (h, params) => {
              let a, b
              if (params.row.status === 2) {
                a = h('a', {
                  style: {'text-align': 'center', 'margin': '0 5px'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      sessionStorage.setItem('storeNumber', params.row.number)
                      this.$router.push({path: 'orderStore'})
                    }
                  }
                }, '出库')
              }
              if (params.row.status === 4) {
                a = h('a', {
                  style: {'text-align': 'center', 'margin': '0 5px'},
                  on: {
                    click: () => {
                      this.refund = params.row
                      this.data4 = params.row.orderProductItems
                      this.returnDisabled = true
                      this.modal3 = true
                    }
                  }
                }, '退货退款')
              }
              if (params.row.status === 5) {
                b = h('a', {
                  style: {'text-align': 'center', 'margin': '0 5px'},
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        content: '确定将该已取消订单改为待发货?',
                        onOk: () => {
                          this.updateOrder(params.row.orderId)
                        }
                      })
                    }
                  }
                }, '改为待发货')
              }
              let om = [
                a,
                b,
                h('a', {
                  style: {'text-align': 'center', 'margin': '0 5px'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: 'orderDetail', query: {orderNo: params.row.number}})
                    }
                  }
                }, '订单详情'),
                h('a', {
                  style: {'text-align': 'center', 'margin': '0 5px'},
                  domProps: {href: 'javascript:'},
                  on: {
                    click: () => {
                      let pInfoList = []
                      this.selectedOrders = []
                      for (let i of params.row.orderProductItems) {
                        let amount = i.price * i.quantity
                        let data3Detail = {
                          name: i.name,
                          productId: i.id,
                          price: this.convertYuan(i.price),
                          quantity: i.quantity,
                          sum: this.convertYuan(amount)
                        }
                        pInfoList.push(data3Detail)
                      }
                      let details = {
                        number: params.row.number,
                        remark: params.row.merchantRemark,
                        pInfo: pInfoList
                      }
                      this.selectedOrders.push(details)
                      this.modal2 = true
                    }
                  }
                }, '备注')
              ]
              return h('div', {}, om)
            },
            align: 'center'
          },
          {
            title: '订单编号',
            key: 'number',
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
                  }, extendTool.handleName(i.name))
                ])
                pl.push(p)
              }
              return h('div', {}, pl)
            }
          },
          {
            title: '设计编号',
            width: 200,
            align: 'center',
            render: (h, params) => {
              let pl = []
              for (let i of params.row.orderProductItems) {
                let p = h('div', {
                  style: {overflow: 'hidden', margin: '5px'}
                }, [
                  h('p', {
                    style: {width: '190px', display: 'inline-block', textAlign: 'left'}
                  }, i.barcode)
                ])
                pl.push(p)
              }
              return h('div', {}, pl)
            }
          },
          {
            title: '单价/数量',
            key: 'priceQuantity',
            width: 200,
            align: 'center',
            render: (h, params) => {
              let pn = []
              for (let i of params.row.orderProductItems) {
                let b = h('p', {style: {margin: '5px', height: '50px', padding: '10px 0'}}, [
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
            title: '金额',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, [
                h('p', {}, `订单金额：${params.row.floatAmount}`),
                h('p', {style: {textAlign: 'center'}}, `(已优惠金额：${params.row.freightPrice_})`)
              ])
            }
          },
          {
            title: '订单状态',
            key: 'statuscn',
            width: 100,
            align: 'center'
          },
          {
            title: '下单时间',
            key: 'createDate',
            width: 180,
            align: 'center'
          },
          {
            title: '付款时间',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.paymentDate)
            }
          },
          {
            title: '收货人姓名',
            key: 'receiverName',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.orderAddressItem.receiverName)
            }
          },
          {
            title: '收货人手机',
            key: 'receiverMobile',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.orderAddressItem.receiverMobile)
            }
          },
          {
            title: 'TSL会员号',
            key: 'tslNo',
            width: 180,
            align: 'center'
          },
          {
            title: '用户注册手机',
            key: 'mobile',
            width: 180,
            align: 'center'
          },
          {
            title: '折扣码',
            key: 'discountCode',
            width: 180,
            align: 'center'
          },
          {
            title: '系统员工编码',
            key: 'systemStaffNum',
            width: 180,
            align: 'center'
          },
          {
            title: '员工编码',
            key: 'StaffNum',
            width: 180,
            align: 'center'
          },
        ],
        data1: [],
        // 批量出库
        modal1: false,
        column2: [
          {
            title: '订单编号',
            key: 'number'
          },
          {
            title: '收货地址',
            key: 'receiverAddress'
          },
          {
            title: '联系人',
            key: 'receiverName'
          },
          {
            title: '联系电话',
            key: 'receiverMobile'
          }
        ],
        data2: [],
        // 批量备注
        modal2: false,
        column3: [
          {title: '商品编码', key: 'productId', width: 180},
          {
            title: '商品名称',
            key: 'name',
            width: 300,
            render: (h, params) => {
              return h('div', {}, extendTool.handleName(params.row.name))
            }
          },
          {title: '数量', key: 'quantity', width: 90},
          {title: '价格', key: 'price', width: 90},
          {title: '小计', key: 'sum', width: 90}
        ],
        data3: [],
        selectedOrders: [],
        // 退货退款
        modal3: false,
        column4: [
          {type: 'selection', width: 60, align: 'center'},
          {
            title: '退货商品',
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
                }, extendTool.handleName(params.row.name))
              ])
              pl.push(p)
              return h('div', {}, pl)
            }
          },
          {title: '销售单价', key: 'floatPrice', width: 100},
          {title: '已退件数', key: 'refundQuantity', width: 100},
          {
            title: '剩余件数',
            width: 100,
            render: (h, params) => {
              return h('div', {}, params.row.quantity - params.row.refundQuantity)
            }
          },
          {
            title: '本次退件数',
            key: 'returnQuantity',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                  on: {
                    'on-change': (val) => {
                      this.data4[params.index].returnQuantity = val
                    }
                  },
                  props: {
                    min: 1,
                    editable: Boolean(params.row.quantity - params.row.refundQuantity),
                    max: params.row.quantity - params.row.refundQuantity,
                    value: params.row.quantity - params.row.refundQuantity
                  }
                }, '')])
            }
          }
        ],
        data4: [],
        refund: {},
        // orderStatusList 查询状态
        orderStatusList: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '待付款'
          },
          {
            value: 2,
            label: '待发货'
          },
          {
            value: 3,
            label: '已发货'
          },
          {
            value: 4,
            label: '已完成'
          },
          {
            value: 5,
            label: '已取消'
          }
        ],
        // 查询条件
        local: {
          status: '0',
          orderNo: null,
          amountFrom: null,
          amountTo: null,
          createDateFrom: null,
          createDateTo: null,
          payDateFrom: null,
          payDateTo: null,
          memberMobile: null,
          receiverName: null,
          receiverMobile: null,
          tslNo: null,
          productName: null,
          merchantName: null,
          discountCode: null,
          systemStaffNum: null,
          StaffNum:null
        },
        orderStartTime: '',
        orderEndTime: '',
        payStartTime: '',
        payEndTime: '',
        tabStatus: '0',
        remarkAmount: 0,
        batchRemark: '',
        operator: null,
        afterSaleData: [],
        exportUrl: 'javascript:;',
        orderUrl: '',
        defaultUrl: '',
        returnDisabled: true,
        canExport: true
      }
    },
    mounted () {
      this.getOperator()
      this.orderList((data) => {
        console.log('responresponsese',data)
        this.fen2yuan(data)
        this.StatusChange(data)
        this.formatDate(data)
        this.total = data.total
        this.data1 = data.list
        this.loading = false
        this.canExport = false
      })
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
      },
      // 将已取消订单修改为待发货订单
      updateOrder (orderId, callback) {
        this.$http.put(omAPI.updateOrder(orderId))
          .then((res) => {
            if (res.data.code === 200) {
              this.$Message.success({
                content: '操作成功'
              })
              if (typeof callback === 'function') {
                callback()
              }
            }
          })
      },
// -----------------数据处理-----------
      // get list data
      orderStatus (name) {
        this.disModal1 = true
        this.disModal2 = true
        this.revertSearch()
        if (name === '0') {
          this.data1 = []
          this.pageNum = 1
          this.pageSize = 20
          this.orderList((data) => {
            this.fen2yuan(data)
            this.StatusChange(data)
            this.formatDate(data)
            this.total = data.total
            this.data1 = data.list
            this.loading = false
          })
        }
        switch (name) {
          case '0': {
            this.params.status = name
            break
          }
          case '1': {
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
          a.freightPrice_ = a.freightPrice / 100
          a.freightPrice_ = a.freightPrice_ % 1 ? parseFloat(a.freightPrice_) : parseFloat(a.freightPrice_) + '.00'
          a.total = 0
          for (let b of a.orderProductItems) {
            b.returnQuantity = b.quantity - b.refundQuantity
            b.floatPrice = b.price / 100
            b.floatPrice = b.floatPrice % 1 ? parseFloat(b.floatPrice) : parseFloat(b.floatPrice) + '.00'
            b.floatSum = b.sum / 100
            b.floatSum = b.floatSum % 1 ? parseFloat(b.floatSum) : parseFloat(b.floatSum) + '.00'
            b.currentPrice = (b.originalPrice * b.quantity) / 100
            b.currentPrice = b.currentPrice % 1 ? parseFloat(b.currentPrice) : parseFloat(b.currentPrice) + '.00'
            b.discounts = b.currentPrice - b.floatSum
            if (b.discounts < 0) {
              b.discounts = '0.00'
            } else {
              b.discounts = b.discounts + '.00'
            }
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
              a.statuscn = '已发货'
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
      // 搜索查询
      orderSearch (first) {
        this.loading = true
        let that = this
        let params = {}
        if (first === 1) {
          that.pageNum = 1
        }
        if (!this.validFormat()) {
          this.loading = false
          return
        }
        // 转换时间赋值
        this.local.createDateFrom = this.formatDateYMD(this.local.createDateFrom)
        this.local.createDateTo = this.formatDateYMD(this.local.createDateTo)
        this.local.payDateFrom = this.formatDateYMD(this.local.payDateFrom)
        this.local.payDateTo = this.formatDateYMD(this.local.payDateTo)
        if (this.local.status != null) {
          this.tabStatus = this.local.status.toString()
        }
        for (let key in this.local) {
          if (this.local[key] !== null && this.local[key] !== '') {
            params[key] = this.local[key]
          }
        }
        if (params.amountFrom) {
          params.amountFrom = this.convertFen(params.amountFrom)
        }
        if (params.amountTo) {
          params.amountTo = this.convertFen(params.amountTo)
        }
        console.log('params',params)
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
          .catch((res) => {alert()
            this.loading = false
          })
      },
      revertSearch () {
        this.local.status = ''
        this.local.orderNo = null
        this.local.amountFrom = null
        this.local.amountTo = null
        this.local.createDateFrom = ''
        this.local.createDateTo = ''
        this.local.payDateFrom = ''
        this.local.payDateTo = ''
        this.local.memberMobile = ''
        this.local.receiverName = null
        this.local.receiverMobile = null
        this.local.tslNo = null
        this.local.productName = null
        this.local.merchantName = null
        this.local.discountCode = null,
        this.local.systemStaffNum = null,
        this.local.StaffNum = null
      },
      cancelSend () {
        this.modal1 = false
      },
      cancelRemark () {
        this.modal2 = false
      },
      remark () {
        if (this.remarkAmount > 5) {
          this.$Message.warning('一次最多可同时备注5个订单!')
        } else {
          this.modal2 = true
        }
      },
      afterSaleItem (val) {
        this.afterSaleData = val
        let bool = null
        if (this.afterSaleData.length) {
          for (let i = 0; i < this.afterSaleData.length; i++) {
            let residue = this.afterSaleData[i].quantity - this.afterSaleData[i].refundQuantity
            if (residue > 0) {
              bool = false
              break
            } else {
              bool = true
            }
          }
        } else {
          bool = true
        }
        this.returnDisabled = bool
      },
      selectItem (val) {
        this.remarkAmount = val.length
        if (val.length > 1) {
          this.disModal1 = false
          this.disModal2 = false
          this.data2 = []
          this.selectedOrders = []
          val.forEach(e => {
            let itemDetail = {
              number: e.number,
              status: e.status,
              receiverAddress: e.orderAddressItem.receiverAddress,
              receiverName: e.orderAddressItem.receiverName,
              receiverMobile: e.orderAddressItem.receiverMobile
            }
            let pInfoList = []
            for (let i of e.orderProductItems) {
              let amount = i.price * i.quantity
              let data3Detail = {
                name: i.name,
                productId: i.id,
                price: this.convertYuan(i.price),
                quantity: i.quantity,
                sum: this.convertYuan(amount)
              }
              pInfoList.push(data3Detail)
            }
            let details = {
              number: e.number,
              remark: e.merchantRemark,
              pInfo: pInfoList
            }
            this.selectedOrders.push(details)
            this.data2.push(itemDetail)
          })
        } else {
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
          if (a.createDate !== null) {
            let date = new Date(parseInt(a.createDate))
            a.createDate = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
          } else {
            a.createDate = ''
          }

          if (a.status === 1) {
            a.paymentDate = '/'
          } else {
            if (a.payDate !== null) {
              let payDate = new Date(parseInt(a.payDate))
              a.paymentDate = payDate.getFullYear() + '-' + ('0' + (1 + payDate.getMonth())).slice(-2) + '-' + ('0' + payDate.getDate()).slice(-2) + ' ' + ('0' + payDate.getHours()).slice(-2) + ':' + ('0' + payDate.getMinutes()).slice(-2) + ':' + ('0' + payDate.getSeconds()).slice(-2)
            } else {
              a.paymentDate = ''
            }
          }
        }
      },
      // 转换年月日h
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
        let reg = /^\d+(?:\.\d{1,4})?$/
        if (this.local.amountFrom !== null && this.local.amountFrom !== '') {
          if (!reg.test(this.local.amountFrom)) {
            this.$Message.warning('金额只能为非负数')
            return false
          }
        }
        if (this.local.amountTo !== null && this.local.amountTo !== '') {
          if (!reg.test(this.local.amountTo)) {
            this.$Message.warning('金额只能为非负数')
            return false
          }
        }
        if (this.local.amountFrom !== null && this.local.amountTo !== null) {
          if (parseFloat(this.local.amountFrom) > parseFloat(this.local.amountTo)) {
            this.$Message.warning('最小金额不能大于最大金额！')
            return false
          }
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
        if (data !== '' && data !== null) {
          return data * 100
        }
      },
      batchOutStore () {
        // 获取用户信息
        let sessionInfo = sessionStorage.getItem('userInfo')
        let us = cryptoJs.AES.decrypt(sessionInfo, 'key', 'conf')
        let qxContent = JSON.parse(us.toString(cryptoJs.enc.Utf8))
        let batchParams = []
        if (this.isReadyOutStore()) {
          for (let i of this.data2) {
            batchParams.push(i.number)
          }
          this.$http.post(...omAPI.postshippingOrder(qxContent.operatorVoList[0].userName, batchParams))
            .then((response) => {
              if (response.data.code === 200) {
                this.loading = false
                this.$Modal.success({
                  title: '出库',
                  content: '出库成功',
                  onOk: () => {
                    this.modal1 = false
                    this.disModal1 = true
                    this.disModal2 = true
                  }
                })
                this.orderList((data) => {
                  this.fen2yuan(data)
                  this.StatusChange(data)
                  this.formatDate(data)
                  this.total = data.total
                  this.data1 = data.list
                  this.loading = false
                })
              } else {
                this.loading = false
                this.$Message.error(response.data.message)
              }
            })
        } else {
          this.$Modal.warning({
            title: '出库',
            content: '请确认订单状态是否为“待出库”',
            onOk: () => {
              this.modal1 = false
            }
          })
        }
      },
      batchRemarkBtn () {
        let batchParams = []
        for (let i of this.selectedOrders) {
          batchParams.push(i.number)
        }
        if (this.batchRemark !== '') {
          const reg = /[~#^$@%&!?%*]/gi
          if (reg.test(this.batchRemark) === true) {
            this.$Message.warning('备注不能含有特殊字符！')
          } else {
            this.$http.post(...omAPI.postRemark(this.batchRemark, batchParams))
              .then((response) => {
                if (response.data.code === 200) {
                  this.loading = false
                  this.$Message.info('备注成功')
                  this.orderList((data) => {
                    this.fen2yuan(data)
                    this.StatusChange(data)
                    this.formatDate(data)
                    this.total = data.total
                    this.data1 = data.list
                    this.loading = false
                  })
                  this.batchRemark = ''
                  this.modal2 = false
                  this.disModal1 = true
                  this.disModal2 = true
                } else {
                  this.loading = false
                  this.$Message.error('备注失败')
                }
              })
              .catch(() => {
                this.loading = false
                this.$Message.error('备注失败')
              })
//            if (this.isAlreadyRemark()) {
//              this.$http.post(...omAPI.postRemark(this.batchRemark, batchParams))
//                  .then((response) => {
//                    if (response.data.code === 200) {
//                      this.loading = false
//                      this.$Message.info('备注成功')
//                      this.orderList((data) => {
//                        this.fen2yuan(data)
//                        this.StatusChange(data)
//                        this.formatDate(data)
//                        this.total = data.total
//                        this.data1 = data.list
//                        this.loading = false
//                      })
//                      this.batchRemark = ''
//                      this.modal2 = false
//                      this.disModal1 = true
//                      this.disModal2 = true
//                    } else {
//                      this.loading = false
//                      this.$Message.error('备注失败')
//                    }
//                  })
//                  .catch(() => {
//                    this.loading = false
//                    this.$Message.error('备注失败')
//                  })
//            } else {
//              this.$Modal.confirm({
//                title: '提示',
//                content: '请确认此处新备注是否替换原有备注',
//                onOk: () => {
//                  this.$http.post(...omAPI.postRemark(this.batchRemark, batchParams))
//                      .then((response) => {
//                        if (response.data.code === 200) {
//                          this.loading = false
//                          this.disModal1 = true
//                          this.disModal2 = true
//                          this.$Message.info('备注成功')
//                          this.orderList((data) => {
//                            this.fen2yuan(data)
//                            this.StatusChange(data)
//                            this.formatDate(data)
//                            this.total = data.total
//                            this.data1 = data.list
//                            this.loading = false
//                          })
//                          this.batchRemark = ''
//                          this.modal2 = false
//                        } else {
//                          this.loading = false
//                          this.$Message.error(response.data.message)
//                        }
//                      })
//                      .catch((res) => {
//                        this.loading = false
//                        this.$Message.error(res.data.message)
//                      })
//                }
//              })
//            }
          }
        } else {
          this.$Message.warning('备注为空')
        }
      },
      isReadyOutStore () {
        for (let j of this.data2) {
          if (j.status !== 2) {
            return false
          }
        }
        return true
      },
      isAlreadyRemark () {
        for (let i of this.selectedOrders) {
          if (i.remark !== null) {
            return false
          }
        }
        return true
      },
      // 退货退款操作
      cancelSalesReturn () {
        this.modal3 = false
      },
      SubmitSalesReturn () {},
      // 获取操作人员姓名
      getOperator () {
        let sessionInfo = sessionStorage.getItem('userInfo')
        let us = cryptoJs.AES.decrypt(sessionInfo, 'key', 'conf')
        let qxContent = JSON.parse(us.toString(cryptoJs.enc.Utf8))
        this.operator = qxContent.operatorVoList[0].userName
      },
      createAfterSale () {
        let end
        for (let i = 0; i < this.afterSaleData.length; i++) {
          let params = {
            orderProductId: this.afterSaleData[i].id,
            quantity: this.afterSaleData[i].returnQuantity
          }
          if (this.afterSaleData[i].returnQuantity > 0) {
            this.$http.post(...omAPI.createAfterSale(this.operator, params))
              .then((response) => {
                if (response.data.code === 200) {
                  this.modal3 = false
                  this.$Message.success(`${extendTool.handleSkuGroupName(this.afterSaleData[i].name)}退货退款申请成功`)
                } else {
                  this.$Message.error(`${extendTool.handleSkuGroupName(this.afterSaleData[i].name)}退货退款申请失败`)
                }
              })
          }
          end = i
        }
        if (end === this.afterSaleData.length - 1) {
          this.orderList((data) => {
            this.fen2yuan(data)
            this.StatusChange(data)
            this.formatDate(data)
            this.total = data.total
            this.data1 = data.list
            this.loading = false
          })
        }
      },
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
      param (data) {
        let url = ''
        for (let key in data) {
          let value = data[key] !== undefined ? data[key] : ''
          url += `&${key}=${encodeURIComponent(value)}`
        }
        return url ? url.substring(1) : ''
      },
      exportOrder () {
        let params = {}
        // 转换时间赋值
        this.local.createDateFrom = this.formatDateYMD(this.local.createDateFrom)
        this.local.createDateTo = this.formatDateYMD(this.local.createDateTo)
        this.local.payDateFrom = this.formatDateYMD(this.local.payDateFrom)
        this.local.payDateTo = this.formatDateYMD(this.local.payDateTo)
        if (this.local.status != null) {
          this.tabStatus = this.local.status.toString()
        }

        for (let key in this.local) {
          if (this.local[key] !== null && this.local[key] !== '') {
            params[key] = this.local[key]
          }
        }

        if (params.amountFrom) {
          params.amountFrom = this.convertFen(params.amountFrom)
        }
        if (params.amountTo) {
          params.amountTo = this.convertFen(params.amountTo)
        }
        this.exportExcel(this.param(params))
      },
      exportExcel (obj) {
        let _agr = 'status=' + this.local.status
        let _link = document.querySelector('#export-table')
        if (obj) {
          _agr = obj
        }
        document.querySelector('#orderManager').style.height = '100%'
        document.querySelector('#orderManager').style.overflow = 'hidden'
        this.loading = true
        this.$http.get(omAPI.exportExcel(_agr))
          .then((response) => {
            this.exportUrl = response.request.responseURL
            this.canExport = false
            _link.setAttribute('href', response.request.responseURL)
            _link.click()
            document.querySelector('#orderManager').style.height = ''
            document.querySelector('#orderManager').style.overflow = ''
            this.loading = false
            this.$router.push({path: 'orderManager'})
            return false
          })
      },
      outputHandler: function () {
//        let params = this.param(params)
        let params = {}
        if (!this.validFormat()) {
          this.loading = false
          return
        }
        // 转换时间赋值
        this.local.createDateFrom = this.formatDateYMD(this.local.createDateFrom)
        this.local.createDateTo = this.formatDateYMD(this.local.createDateTo)
        this.local.payDateFrom = this.formatDateYMD(this.local.payDateFrom)
        this.local.payDateTo = this.formatDateYMD(this.local.payDateTo)
        if (this.local.status != null) {
          this.tabStatus = this.local.status.toString()
        }
        for (let key in this.local) {
          if (this.local[key] !== null && this.local[key] !== '') {
            params[key] = this.local[key]
          }
        }
        if (params.amountFrom) {
          params.amountFrom = this.convertFen(params.amountFrom)
        }
        if (params.amountTo) {
          params.amountTo = this.convertFen(params.amountTo)
        }
        console.log(params)
        let formhtml = `<form id="buyerListForm2" target="buyerListIframe" method="get" action="/${config.SERVER_PATH}${omAPI.exportExcel()}">`
        for (let key in params) {
          formhtml += `<input type="hidden" name="${key}" value="${params[key]}" />`
        }
        formhtml += '</form>'
        this.$refs.buyerListIframe.contentWindow.document.getElementsByTagName('body')[0].innerHTML = formhtml
        const formelm = this.$refs.buyerListIframe.contentWindow.document.getElementById('buyerListForm2')
        formelm.submit()
        formelm.parentNode.removeChild(formelm)
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
        this.pageSize = 20
        this.orderList((data) => {
          this.fen2yuan(data)
          this.StatusChange(data)
          this.formatDate(data)
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

