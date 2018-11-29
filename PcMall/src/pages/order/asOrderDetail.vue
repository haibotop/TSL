<template>
  <div id="asOrderDetail">
    <header1></header1>
    <header2></header2>
    <div class="asorder-content detail">
      <v-title :titleTpye="titleTpye"></v-title>
      <div class="asorder-box">
        <div class="backup"><router-link to="/asOrders"><Icon type="ios-arrow-back" />返回售后订单列表</router-link></div>
         <!-- statusText: ['', '待审核', '审核通过', '审核不通过', '待退货', '退货失败', '待退款', '退款失败', '已退款'], -->
        <!-- 退货进度条 -->
        <div v-if="orderItem.status == 1" class="asorder-steps">
          <Steps :current="1" size="small">
              <Step title="售后提交成功"></Step>
              <Step title="审核中"></Step>
          </Steps>
        </div>
        <div v-if="orderItem.status == 2 || orderItem.status == 3" class="asorder-steps">
          <Steps :current="1" size="small">
            <Step title="售后提交成功"></Step>
            <Step title="审核通过" v-if="orderItem.status ==2"></Step>
            <Step title="审核不通过" v-if="orderItem.status == 3"></Step>
          </Steps>
        </div>
        <div v-if="orderItem.status == 4" class="asorder-steps">
          <Steps :current="2" size="small">
            <Step title="售后提交成功"></Step>
            <Step title="审核通过"></Step>
            <Step title="待退货"></Step>
          </Steps>
        </div>
        <div v-if="orderItem.status == 5 || orderItem.status == 6" class="asorder-steps">
          <Steps :current="3" size="small">
            <Step title="售后提交成功"></Step>
            <Step title="审核通过"></Step>
            <Step title="退货失败" v-if="orderItem.status == 5"></Step>
            <Step title="退货成功"  v-if="orderItem.status == 6"></Step>
            <Step title="退款中" v-if="orderItem.status == 6"></Step>
          </Steps>
        </div>
        <div v-if="orderItem.status == 7 || orderItem.status == 8" class="asorder-steps">
          <Steps :current="3" size="small">
            <Step title="售后提交成功"></Step>
            <Step title="审核通过"></Step>
            <Step title="退货成功"></Step>
            <Step title="退款失败" v-if="orderItem.status == 7"></Step>
            <Step title="退款成功"  v-if="orderItem.status == 8"></Step>
          </Steps>
        </div>
        <div class="asorder-item clearfix">
          <div class="asorder-left">
            <div class="default-picture"><img :src="orderItem.defaultPicture" alt=""></div>
            <div class="text-info">
              <p>{{handleName(orderItem.productName)}}</p>
            </div>
          </div>
          <div class="order-control">
            <p class="price">￥{{handlePrice(orderItem.price)}}</p>
            <p>×{{orderItem.quantity}}</p>
            <!-- <div class="status">{{statusText[orderItem.status]}}</div> -->
          </div>
        </div>
        <div class="text-right">
            <p>商品总价：￥{{handlePrice(orderItem.sum)}}</p>
            <!-- <p>运费： {{orderItem.freightPrice ? orderItem.freightPrice : '免运费'}}</p> -->
            <p>优惠扣减： -￥{{cuponPrice}}</p>
            <p class="amount">退款金额：<span>￥{{handlePrice(orderItem.sum)}}</span></p>
            <p class="price-text" v-if="orderItem.refundOrderItem">实退金额：<span>￥{{orderItem.refundOrderItem ? handlePrice(orderItem.refundOrderItem.actuallyRefundAmount) : '--'}}</span></p>
        </div>
        <div class="text-center"><div class="btn-purple" onclick="qimoChatClick()">联系客服</div></div>
        
      </div>

    </div>
    <div class="asorder-detail-content">
      <div class="asorder-box">
        <div class="ab-item">
          <Row>
            <Col span="3">收货地址:</Col>
            <Col span="21" v-if="orderItem.orderAddressItem">
              <div>
                <span class="receiverName">{{orderItem.orderAddressItem.receiverName}}</span>
                <span class="receiverMobile">{{`${orderItem.orderAddressItem.receiverMobile.substring(0, 3)}****${orderItem.orderAddressItem.receiverMobile.substring(7, 11)}`}}</span>
              </div>
              <div>{{orderItem.orderAddressItem.receiverAddress}}</div>
            </Col>
          </Row>
        </div>
        <div class="ab-item">
          <Row>
            <Col span="3">订单信息:</Col>
            <Col span="21">
              <div>
                订单编号：{{orderItem.orderNo}}
                <input id="orderNumInput2" type="text" :value="orderItem.orderNo" readonly style="position:absolute;top:-30px;">
                <button class="copy-btn" data-clipboard-target="#orderNumInput2">复制单号</button>
              </div>
              <div>
                退货订单编号:{{orderItem.afterSaleNo}} 
                <input id="orderNumInput" type="text" :value="orderItem.afterSaleNo" readonly style="position:absolute;top:-30px;">
                <button class="copy-btn" data-clipboard-target="#orderNumInput">复制单号</button>
              </div>
              
            </Col>
          </Row>
        </div>
        <div class="ab-item">
          <Row>
            <Col span="3">备注:</Col>
            <Col span="21">{{orderItem.merchantRemark}}</Col>
          </Row>
        </div>
        <div class="ab-item">
          <Row>
            <Col span="3">员工编号:</Col>
            <Col span="21">{{orderItem.merchantRemark}}</Col>
          </Row>
        </div>
      </div>
    </div> 
    <v-footer></v-footer>
    <div>
      <confirm v-model="clipConfirm" title="已复制订单号"  cancel-text=" "></confirm>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Clipboard from 'clipboard'
import header1 from "../homePages/header1"
import header2 from "../homePages/header2"
import vFooter from "@/pages/homePages/footer.vue"
import vTitle from "@/pages/homePages/title.vue"
import * as tool from '@/services/myTool.es6'
import * as orderAPI from '@/services/API/orderServices.es6'
import cashier from '@/components/cashier.vue'
import { Confirm } from 'vux'
import * as cartAPI from '@/services/API/shoppingCartServices.es6'
export default {
  name: 'asOrderDetail',
  components: { 
    Confirm,
    header1,
    header2, 
    vFooter,
    vTitle 
  },
  data () {
    return {
      titleTpye: ["我的", "售后订单", "订单详情"],
      statusText: ['', '待审核', '审核通过', '审核不通过', '待退货', '退货失败', '待退款', '退款失败', '已退款'],
      orderNum: '',
      orderItem: '',
      cashierFlag: false,
      cashierPrice: 0,
      copyBtnObj: '',
      cuponPrice: 0,
      clipConfirm: false
    }
  },
  mounted: function () {
    this.copyBtnObj = new Clipboard('.copy-btn')
    this.copyBtnObj.on('success', (e) => {
      console.log(e)
      this.clipConfirm = true
    })
    let date = new Date()
    this.time = date.getTime() + 1000 * 60 * 60
    if (this.$route) {
      this.orderNum = this.$route.params.orderNum
      this.getAsOrder()
    }
  },
  methods: {
    getAsOrder () {
      this.$http.get(orderAPI.asOrderDetail(this.orderNum)).then(res => {
        if (res.data.code === 200) {
          console.log(res, 'res---')
          this.orderItem = res.data.afterSaleOrderItem
          if (res.data.afterSaleOrderItem.refundOrderItem) {
            this.cuponPrice = tool.handlePrice(res.data.afterSaleOrderItem.sum - res.data.afterSaleOrderItem.refundOrderItem.actuallyRefundAmount)
          } else {
            this.cuponPrice = 0
          }
          
        }
      })
    },
    handlePrice (price) {
      return tool.handlePrice(price)
    },
    handleName (name) {
      return tool.handleName(name)
    },
    // handleDate (time) {
    //   return tool.handleDate(time)
    // },
    calcSum () {
      // let sum = 0
      // for (let i of this.orderItem.orderProductItems) {
      //   sum += i.sum
      // }
      // return tool.handlePrice(sum)
      return '-'
    },
    // ----------取消订单
    cancelOrder (item) {
      let action = () => {
        this.$http.delete(...orderAPI.deleteOrder(item.number)).then(res => {
          if (res.data.code === 200) {
            this.$vux.toast.show({type: 'text', text: `取消成功`, width: '200px'})
            this.orderItem.status = 5
          } else {
            this.$vux.toast.show({type: 'text', text: `取消失败`, width: '200px'})
          }
        })
      }
      this.$vux.confirm.show({
        content: '是否取消订单',
        confirmText: '是',
        cancelText: '否',
        onConfirm: () => {
          action()
        }
      })
    },
    // ----------去付款
    goPay (order) {
      this.orderNum = order.number
      this.cashierPrice = this.calcSum()
      this.cashierFlag = true
    },
    // ----------再次购买
    goPayAgain (item) {
      let pl = []
      for (let i of item.orderProductItems) {
        pl.push({
          'merchantId': '123',
          'productId': i.productId,
          'productItemId': null,
          'quantity': i.quantity
        })
      }
      this.$http.post(...cartAPI.visitorCartItem(pl)).then(res => {
        if (res.data.code === 200) {
          this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
        } else if (res.data.code === 1007) {
          this.$vux.toast.show({text: '购买数量超过库存', type: 'text', width: '200px'})
        } else if (res.data.code === 1008) {
          this.$vux.toast.show({text: '商品不可用', type: 'text', width: '200px'})
        } else {
          this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
        }
      })
    },
    // ----------确认收货
    confirmGet (item) {
      let action = () => {
        this.$http.post(...orderAPI.receivingNote(item.number)).then(res => {
          if (res.data.code === 200) {
            this.orderItem.status = 4
            this.$router.push({path: `/orderOk/${item.number}`})
            // this.$vux.toast.show({type: 'text', text: `确认成功`, width: '200px'})
          } else {
            this.$vux.toast.show({type: 'text', text: `确认失败`, width: '200px'})
          }
        })
      }
      this.$vux.confirm.show({
        content: '是否确认收货',
        confirmText: '确认',
        onConfirm: () => {
          action()
        }
      })
    }
  },
  computed: {
    sendGoodTime () {
      let time = ''
      if (this.orderItem.orderTrackItems) {
        for (let i of this.orderItem.orderTrackItems) {
          if (i.status === 3) {
            time = i.createDate
          }
        }
      }
      return time
    },
    getGoodTime () {
      let time = ''
      if (this.orderItem.orderTrackItems) {
        for (let i of this.orderItem.orderTrackItems) {
          if (i.status === 4) {
            time = i.createDate
          }
        }
      }
      return time
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .asorder-content.detail {
    padding: 48px 48px 10px;

    .backup {
      color: #352665;
      margin: -26px 0 40px -30px;
      
      a {
        color: #352665;
      }
      
      i {
        vertical-align: middle;
        display: inline-block;
        margin-right: 10px;
      }
    }

    .asorder-item {
      padding-bottom: 20px;
      margin-bottom: 20px;

      .order-control {
        text-align: right;
      }

      .asorder-left .text-info {
        padding-left: 40px;
      }
    }
  }
  .asorder-detail-content {
    padding: 10px 48px 100px;
    background-color: #fafafa;
      .asorder-box {
        padding: 48px;
        background-color: #fff;
      }

      .ab-item {
        border-bottom: 1px solid #eee;
        padding-bottom: 35px;
        margin-bottom: 35px;
        position: relative;
        overflow: hidden;

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        input[readonly="readonly"] {
          // opacity: 0;
        }
      }
  }
  .default-picture {
    width: 88px;
    height: 88px;
    display: inline-block;
    vertical-align: middle;
    background: #eee;
    float: left;
    img {
      display: block;
      font-size: 14px;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }

  .price-text {
    color: red;
  }

  .copy-btn {
    display: inline-block;
    margin-left:30px;
    border: 1px solid #7f7f7f;
    background-color: #fff;
    text-align: center;
    border-radius: 2px;
    font-size: 12px;
    padding: 2px 20px;
    cursor: pointer;
  }

  // 进度条样式
  .asorder-steps {
    text-align: center;
    margin-bottom: 60px;
    
    .ivu-steps {
      display: inline;
    }
    
    .ivu-steps-item {
      overflow: hidden;

      &:last-child {
        width: auto !important;
      }

      .ivu-steps-tail {
        width: 88%;
        left: auto;
        right: 0;
      }
      
      &.ivu-steps-status-finish {
        .ivu-steps-tail > i, .ivu-steps-tail > i:after {
          background: #352665;
        }
      }
      &.ivu-steps-status-finish .ivu-steps-head .ivu-steps-head-inner{
        background-color: #fff;
      }

      .ivu-steps-head {
        width: 80px;
        text-align: center;
        display: block;

        .ivu-steps-head-inner {
          margin: 0 auto;
          background-color: #352665; 
          border-color: #352665;
          overflow: hidden;


          .ivu-icon {
            display: inline-block;
            top: -3px !important;
            left: -2px;
            color: #352665;
             font-size: 22px !important;
            
          }
        }
      }
      .ivu-steps-main {
        width: 80px;
        text-align: center;
        display:block !important;

        .ivu-steps-title {
          padding-right: 0;
          margin-top: 10px;
        }
      }
    }
    
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .text-left {
    text-align: left;
  }

  .btn-purple {
    background-color: #352665;
    color: #fff;
    padding: 8px 40px;
    display: inline-block;
    cursor: pointer;
    margin: 20px 10px 0;
  }
  .btn-white {
    background-color: #fff;
    color: #352665;
    padding: 7px 40px;
    display: inline-block;
    cursor: pointer;
    margin: 20px 10px 0;
    border: 1px solid #352665;
  }
  
</style>
