<style rel="stylesheet/scss" lang="scss" scoped>
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
  .order-input {
    width: calc(100% - 85px);
  }
  .my-date {
    width: 145px;
  }
  .my-table-box {
    overflow-x: scroll;
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
      <BreadcrumbItem>订单管理</BreadcrumbItem>
    </Breadcrumb>
    <Form inline class="margin-10">
      <FormItem label="订单编号：" class="width-40">
        <Input class="order-input"></Input>
      </FormItem>
      <FormItem label="下单时间：" class="width-55">
        <TimePicker format="yyyy年MM月dd日" placeholder="开始时间" class="my-date"></TimePicker>
        <TimePicker format="yyyy年MM月dd日" placeholder="结束时间" class="my-date"></TimePicker>
      </FormItem>
      <FormItem label="订单状态：" class="width-40">
        <Select class="order-input"></Select>
      </FormItem>
      <FormItem label="订单金额：" class="width-55">
        <Input class="my-date" placeholder="最小金额"></Input>
        <Input class="my-date" placeholder="最大金额"></Input>
      </FormItem>
      <FormItem label="订单类型：" class="width-40">
        <Select class="order-input"></Select>
      </FormItem>
      <FormItem><Button>查询</Button></FormItem>
    </Form>

    <Tabs type="card" :animated="false">
      <TabPane label="全部订单"></TabPane>
      <TabPane label="待付款"></TabPane>
      <TabPane label="待发货"></TabPane>
      <TabPane label="待收货"></TabPane>
      <TabPane label="已完成"></TabPane>
      <TabPane label="已取消"></TabPane>
    </Tabs>

    <Button class="margin-0-10" @click="modal1 = true">批量出库</Button>
    <Button class="margin-0-10" @click="modal2 = true">批量备注</Button>
    <div class="my-table-box">
      <Table :columns="column1" :data="data1" width="1500" height="400"></Table>
    </div>

    <Page :total="100" show-total show-elevator class="margin-10"></Page>

    <Modal title="批量出库" v-model="modal1" width="800">
      <Table :columns="column2" :data="data2"></Table>
      <div slot="footer">
        <Button>出库</Button>
        <Button>取消</Button>
      </div>
    </Modal>

    <Modal :title="markTitle" v-model="modal2" width="800">
      <div class="batch-mark">
        <template v-for="(item, index) in selectedOrders">
          <div>订单编号：1234567890</div>
          <Table :columns="column3" :data="item.pInfo"></Table>
          <label for="">备注：</label><Input style="width: calc(100% - 36px); margin-top: 10px"></Input>
          <div class="line" v-if="selectedOrders.length > 1 && index !== selectedOrders.length - 1"></div>
        </template>
      </div>
      <div slot="footer">
        <Button>确定</Button>
        <Button>取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'orderManager',
  data () {
    return {
      column1: [
        {
          type: 'selection',
          width: '60px'
        },
        {
          title: '订单编号',
          key: 'id'
        },
        {
          title: '商店名称',
          key: 'merchant'
        },
        {
          title: '商品信息',
          width: '200px',
          render: (h, params) => {
            let pl = []
            for (let i of params.row.pInfo) {
              let p = h('div', {
                style: {overflow: 'hidden', margin: '5px'}
              }, [
                h('img', {
                  domProps: {src: i.img},
                  style: {display: 'block', float: 'left', width: '50px', height: '50px', 'margin-right': '5px'}
                }),
                h('p', {}, i.name)
              ])
              pl.push(p)
            }
            return h('div', {}, pl)
          }
        },
        {
          title: '单价/数量',
          key: 'priceQuantity'
        },
        {
          title: '售后',
          width: '92px'
        },
        {
          title: '金额',
          render: (h, params) => {
            return h('div', {}, [
              h('p', {}, `订单金额：${params.row.amounts.orderAmount}`),
              h('p', {}, `优惠金额：${params.row.amounts.cutAmount}`),
              h('p', {}, `实付金额：${params.row.amounts.endAmount}`)
            ])
          }
        },
        {
          title: '订单状态',
          key: 'status',
          width: '92px'
        },
        {
          title: '下单时间',
          key: 'orderDate',
          width: '110px'
        },
        {
          title: '付款时间',
          key: 'payDate',
          width: '110px'
        },
        {
          title: '买家',
          key: 'buyer'
        },
        {
          title: '操作',
          width: '135px',
          render: (h, params) => {
            return h('div', {}, [
              h('a', {
                style: {'display': 'block', 'text-align': 'center'},
                domProps: {
                  href: 'javascript:'
                },
                on: {
                  click: () => {
                    this.$parent.page = this.$parent.pages[1]
                  }
                }
              }, '出库'),
              h('a', {
                style: {'display': 'block', 'text-align': 'center'},
                domProps: {
                  href: 'javascript:'
                },
                on: {
                  click: () => {
                    this.$parent.page = this.$parent.pages[2]
                  }
                }
              }, '查看订单详情'),
              h('a', {
                style: {'display': 'block', 'text-align': 'center'},
                domProps: {
                  href: 'javascript:'
                }
              }, '添加备注')
            ])
          }
        }
      ],
      data1: [
        {
          id: '1234567890',
          merchant: '健康商店',
          pInfo: [
            {img: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar', name: '倍轻松(breo)眼部按摩器isee361'},
            {img: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar', name: '倍轻松(breo)眼部按摩器isee361'}
          ],
          priceQuantity: '429.00(1件)',
          saleAfter: '',
          amounts: { orderAmount: '429', cutAmount: '0', endAmount: '429' },
          status: '待发货',
          orderDate: '2016-10-21 11:14:05',
          payDate: '2016-10-21 18:03:29',
          buyer: 'summerday'
        },
        {
          id: '1234567890',
          merchant: '健康商店',
          pInfo: [
            {img: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar', name: '倍轻松(breo)眼部按摩器isee361'}
          ],
          priceQuantity: '429.00(1件)',
          saleAfter: '',
          amounts: { orderAmount: '429', cutAmount: '0', endAmount: '429' },
          status: '待发货',
          orderDate: '2016-10-21 11:14:05',
          payDate: '2016-10-21 18:03:29',
          buyer: 'summerday'
        }
      ],
      // 批量出库
      modal1: false,
      column2: [
        {
          title: '订单编号',
          key: 'id'
        },
        {
          title: '物流公司',
          render: (h, params) => {
            let options = []
            params.row.logistics.forEach(e => {
              let a = h('Option', {
                props: { value: JSON.stringify(e) }
              }, e.name)
              options.push(a)
            })
            return h('Select', {
              props: { value: JSON.stringify(params.row.logistics[0]) },
              on: {'on-change': (val) => {
                console.log(val)
              }}
            }, options)
          }
        },
        {
          title: '运单号',
          render: (h, params) => {
            return h('Input', {})
          }
        },
        {
          title: '收货地址',
          key: 'address'
        },
        {
          title: '联系人',
          key: 'contacts'
        },
        {
          title: '联系电话',
          key: 'mobile'
        }
      ],
      data2: [
        {id: '1234567890', logistics: [{name: '顺丰快递'}, {name: '中通快递'}, {name: '圆通快递'}], address: '浙江宁波市慈溪市XXXX', contacts: '陈升', mobile: '13792930828'}
      ],
      // 批量备注
      modal2: false,
      column3: [
        {title: '商品编码', key: 'id'},
        {title: '商品名称', key: 'name'},
        {title: '数量', key: 'quantity'},
        {title: '价格', key: 'price'},
        {title: '小计', render: (h, params) => { return parseInt(params.row.quantity) * parseInt(params.row.price) }}
      ],
      selectedOrders: [
        {
          pInfo: [
            {id: '123456', img: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar', name: '倍轻松(breo)眼部按摩器isee361', quantity: '1', price: '492.00'},
            {id: '123456', img: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar', name: '倍轻松(breo)眼部按摩器isee361', quantity: '1', price: '492.00'}
          ]
        }
      ]
    }
  },
  methods: {
  },
  computed: {
    markTitle () {
      if (this.selectedOrders.length > 1) {
        return '批量备注'
      } else {
        return '添加备注'
      }
    }
  }
}
</script>
