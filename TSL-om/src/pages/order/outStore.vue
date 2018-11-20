<style lang="scss" rel="stylesheet/scss" scoped>
  .title {
    margin: 30px 10px 10px;
    font-weight: 700;
    color: #495060;
    border-bottom: 2px solid #495060;
  }
  .width-100 {
    width: 100%;
  }
  .width-45 {
    width: 45%;
  }
  .width-100, .width-45 {
    margin: 0;
  }
  .color-red {
    color: red;
  }
  .amount {
    color: red;
    float: right;
    margin: 20px 10px;
  }
  .my-btn {
    margin: 10px 0 10px 10px;
  }
  .btn-divider {
    margin: 20px 0;
  }
</style>
<template>
  <div id="outStore">
    <div class="title">订单基本信息</div>
    <Form :label-width="100" inline>
      <FormItem class="width-100" label="订单编号：">{{orderDetails.number}}</FormItem>
      <FormItem class="width-45" label="收货人名字：">{{orderDetails.orderAddressItem.receiverName}}</FormItem>
      <FormItem class="width-45" label="手机号码：">{{orderDetails.orderAddressItem.receiverMobile}}</FormItem>
      <FormItem class="width-45" label="收货地址："><span class="color-red">{{orderDetails.orderAddressItem.receiverAddress}}</span></FormItem>
      <!--<FormItem class="width-45" label="固定电话：">{{orderDetails.orderAddressItem.receiverMobile}}</FormItem>-->
      <FormItem class="width-45" label="支付方式："><span class="color-red">{{orderDetails.payType}}</span></FormItem>
      <!--<FormItem class="width-45" label="邮编：">{{orderDetails.orderAddressItem.receiverPostcode}}</FormItem>-->
      <FormItem class="width-45" label="订单备注："><span>{{orderDetails.merchantRemark}}</span></FormItem>
      <FormItem class="width-45" label="下单时间：">{{orderDetails.createDate}}</FormItem>
    </Form>

    <div class="title">商品信息</div>
    <Table :columns="column1" :data="data1"></Table>

    <div class="amount">商品金额：{{orderDetails.floatAmount}}元</div>

    <div class="btn-divider">
      <Button @click="outStoreBtn" class="my-btn">出库</Button>
      <Button @click="goBack" class="my-btn">返回</Button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as omAPI from '../../services/orderList.es6'
  import Loading from '../../components/loading.vue'
  import cryptoJs from 'crypto-js'
  import * as extendTool from '../../services/tool.es6'
  export default {
    name: 'outStore',
    components: {
      Loading
    },
    data () {
      return {
        column1: [
          {
            title: '商品图片',
            width: 150,
            render: (h, params) => {
              return h('div', {
                style: {overflow: 'hidden', margin: '5px'}
              }, [
                h('img', {
                  domProps: {src: params.row.defaultPicture},
                  style: {display: 'block', float: 'left', width: '50px', height: '50px', 'margin-right': '5px'}
                })
              ])
            }
          },
          {
            title: '商品编码',
            width: 180,
            key: 'id'
          },
          {
            title: '商品名称',
            width: 330,
            key: 'name',
            render: (h, params) => {
              return h('div', {}, extendTool.handleName(params.row.name))
            }
          },
          {
            title: '价格',
            width: 120,
            key: 'productPrice',
            render: (h, params) => {
              return h('div', {style: {textAlign: 'left'}}, [
                h('p', {}, `${params.row.floatPrice}`)
              ])
            }
          },
          {
            title: '数量',
            width: 120,
            key: 'productQuantity',
            render: (h, params) => {
              return h('div', {style: {textAlign: 'left'}}, [
                h('p', {}, `${params.row.quantity}`)
              ])
            }
          },
          {
            title: '优惠金额',
            width: 120,
            key: 'discount'
//            render: (h, params) => {
//              return h('div', {style: {textAlign: 'left'}}, [
//                h('p', {}, `${params.row.discounts}`)
//              ])
//            }
          },
          {
            title: '小计',
            width: 120,
            render: (h, params) => {
              console.log(params.row)
              return h('div', {style: {textAlign: 'left'}}, [
                h('p', {}, `${params.row.floatSum}`)
              ])
            }
          }
        ],
        data1: [],
        orderNumber: null,
        loading: false,
        orderDetails: {
          orderAddressItem: {},
          number: null,
          createDate: null
        },
        operator: ''
      }
    },
    methods: {
      goBack () {
        this.$router.push({path: 'orderManager'})
      },
      orderList (callback) {
        this.$http.get(omAPI.getOrder(this.orderNumber))
          .then((response) => {
            if (response.data.code === 200) {
              this.orderDetails = response.data.orderItem
              let date = new Date(parseInt(response.data.orderItem.createDate))
              let amount = response.data.orderItem.amount / 100
              this.orderDetails.floatAmount = amount % 1 ? parseFloat(amount) : parseFloat(amount) + '.00'
              this.orderDetails.createDate = `${date.getFullYear()}-${('0' + (1 + date.getMonth())).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
              this.orderDetails.payType = this.StatusChange(this.orderDetails.payType)
              if (typeof callback === 'function') {
                callback(response.data.orderItem)
              }
            } else {
              this.loading = false
            }
          })
          .catch((res) => {
            this.loading = false
          })
      },
      /*
       分转元
       amount 实际付款总价（优惠后总价）
       orderProductItems => price 单个商品价格 sum price*quantity
       */
      fen2yuan (data) {
        data.floatAmount = data.amount / 100
        data.floatAmount = data.floatAmount % 1 ? parseFloat(data.floatAmount) : parseFloat(data.floatAmount) + '.00'
        data.floatSum = data.floatAmount
        for (let b of data.orderProductItems) {
          b.floatPrice = b.price / 100
          b.floatPrice = b.floatPrice % 1 ? parseFloat(b.floatPrice) : parseFloat(b.floatPrice) + '.00'
          b.floatSum = b.sum / 100
          b.floatSum = b.floatSum % 1 ? parseFloat(b.floatSum) : parseFloat(b.floatSum) + '.00'
          b.currentPrice = (b.originalPrice * b.quantity) / 100
          b.currentPrice = b.currentPrice % 1 ? parseFloat(b.currentPrice) : parseFloat(b.currentPrice) + '.00'
          b.discounts = b.currentPrice - b.floatSum
          b.discounts = b.discounts + '.00'
        }
      },
      outStoreBtn () {
        let params = [this.orderDetails.number]
        this.$http.post(...omAPI.postshippingOrder(this.operator, params))
          .then((response) => {
            if (response.data.code === 200) {
              this.loading = false
              this.$Modal.success({
                title: '出库',
                content: '出库成功',
                onOk: () => {
                  this.$router.push({path: 'orderManager'})
                }
              })
            } else {
              this.loading = false
              this.$Message.error(response.data.message)
            }
          })
          .catch((res) => {
            this.loading = false
            this.$Message.error(res.data.message)
          })
      },
      getOperator () {
        let sessionInfo = sessionStorage.getItem('userInfo')
        let us = cryptoJs.AES.decrypt(sessionInfo, 'key', 'conf')
        let qxContent = JSON.parse(us.toString(cryptoJs.enc.Utf8))
        this.operator = qxContent.operatorVoList[0].userName
      },
      /*
       后台数据订单状态：
       1 待支付；2 已支付；3 已发货；4 已收货；5 已撤单；
       6 待退款；7 退款失败；8  已退款；9 已完结
       */
      StatusChange (data) {
        switch (data) {
          case 1: {
            data = 'wxH5'
            break
          }
          case 2: {
            data = '微信APP'
            break
          }
          case 3: {
            data = '支付宝H5'
            break
          }
          case 4: {
            data = '银联wap'
            break
          }
          case 5: {
            data = '微信公众号'
            break
          }
          case 10: {
            data = '银联商务(银联在线)'
            break
          }
          case 11: {
            data = '银联商务（微信公众号支付）'
            break
          }
          case 12: {
            data = 'H5微信支付'
            break
          }
          case 13: {
            data = 'H5支付宝支付'
            break
          }
          default: {
            break
          }
        }
        return data
      }
    },
    mounted () {
      this.orderNumber = sessionStorage.getItem('storeNumber')
      this.data1 = []
      this.orderList((data) => {
        this.fen2yuan(data)
        this.data1 = data.orderProductItems
        this.getOperator()
        this.loading = false
      })
    }
  }
</script>
