<template>
  <div id="asOrderDetail">
    <x-header :left-options="{backText: ''}" title="订单详情"></x-header>

    <scroller  v-if="orderItem" lock-x height="-46" ref="scroller">
      <div>
        <group gutter="0px" v-if="orderItem">
          <cell :title="statusText[orderItem.status]"></cell>
        </group>

        <group>
          <cell-box>
            <div class="address">
              <div class="address-bar1">
                <span class="receiverName">{{orderItem.orderAddressItem.receiverName}}</span>
                <span class="receiverMobile">{{`${orderItem.orderAddressItem.receiverMobile.substring(0, 3)}****${orderItem.orderAddressItem.receiverMobile.substring(7, 11)}`}}</span>
              </div>
              <div class="address-bar2"><x-icon type="ios-location-outline" size="15" style="position:absolute;left:10px;"></x-icon><p>{{orderItem.orderAddressItem.receiverAddress}}</p></div>
            </div>
          </cell-box>
        </group>

        <group>
          <cell :value="statusText[orderItem.status]"></cell>
          <cell-box>
            <div class="default-picture"><img :src="orderItem.defaultPicture" alt=""></div>
            <div class="text-info">
              <p>{{handleName(orderItem.productName)}}</p>
              <span class="price">￥{{handlePrice(orderItem.price)}}</span>
              <span class="quantity">×{{orderItem.quantity}}</span>
            </div>
          </cell-box>
        </group>

        <group>
          <cell title="商品总价"><div class="price-text">￥{{handlePrice(orderItem.sum)}}</div></cell>
          <cell title="运费">免运费</cell>
          <cell title="优惠券"></cell>
        </group>

        <group>
          <cell title="退款金额"><div class="price-text">￥{{handlePrice(orderItem.sum)}}</div></cell>
          <cell title="实退款金额" v-show="orderItem.refundOrderItem"><div class="price-text">￥{{orderItem.refundOrderItem ? handlePrice(orderItem.refundOrderItem.actuallyRefundAmount) : '--'}}</div></cell>
        </group>

        <group>
          <cell-box>
            <div class="order-number-time">
              <div>
                <span>订单编号：{{orderItem.orderNo}}</span>
                <input id="orderNumInput2" type="text" :value="orderItem.orderNo" readonly style="position:absolute;top:-30px;">
                <button class="copy-btn" data-clipboard-target="#orderNumInput2">复制</button>
              </div>
            </div>
          </cell-box>
          <cell-box>
            <div class="order-number-time">
              <div>
                <span>退货订单编号：{{orderItem.afterSaleNo}}</span>
                <input id="orderNumInput" type="text" :value="orderItem.afterSaleNo" readonly style="position:absolute;bottom:-30px;">
                <button class="copy-btn" data-clipboard-target="#orderNumInput">复制</button>
              </div>
              <!-- <div><span>创建时间：{{handleDate(orderItem.createDate)}}</span></div>
              <div v-if="[2, 3, 4].indexOf(orderItem.status) !== -1"><span>付款时间：{{handleDate(orderItem.payDate)}}</span></div>
              <div v-if="[3, 4].indexOf(orderItem.status) !== -1"><span>发货时间：{{handleDate(sendGoodTime)}}</span></div>
              <div v-if="[4].indexOf(orderItem.status) !== -1"><span>收货时间：{{handleDate(getGoodTime)}}</span></div> -->
            </div>
          </cell-box>
        </group>
      </div>
    </scroller>
    <div>
      <confirm v-model="confirm"
        title="已复制订单号"
        cancel-text=" "
      ></confirm>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Clipboard from 'clipboard'
import * as tool from '@/services/myTool.es6'
import * as orderAPI from '@/services/API/orderServices.es6'
import cashier from '@/components/cashier.vue'
import { XHeader, Scroller, Group, Cell, CellBox, Clocker, XButton, XTextarea, Confirm } from 'vux'
import * as cartAPI from '@/services/API/shoppingCartServices.es6'
export default {
  name: 'asOrderDetail',
  components: { cashier, XHeader, Scroller, Group, Cell, CellBox, Clocker, XButton, XTextarea, Confirm },
  data () {
    return {
      statusText: ['', '待审核', '审核通过', '审核不通过', '待退货', '退货失败', '待退款', '退款失败', '已退款'],
      orderNum: '',
      orderItem: '',
      cashierFlag: false,
      cashierPrice: 0,
      copyBtnObj: ''
    }
  },
  mounted: function () {
    this.copyBtnObj = new Clipboard('.copy-btn')
    this.copyBtnObj.on('success', (e) => {
      console.log(e)
      this.confirm = true
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
          this.orderItem = res.data.afterSaleOrderItem
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
<style rel="stylesheet/scss" lang="scss" scoped>
.clocker {
  font-size: 14px;
  color: #7f7f7f;
}
.address {
  .address-bar1 {
    overflow: hidden;
    font-size: 16px;
    .receiverName {
      float: left;
    }
    .receiverMobile {
      float: right;
    }
  }
  .address-bar2 {
    padding: 5px 0px 0px 15px;
    p {
      font-size: 14px;
      color: #7f7f7f;
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
.text-info {
  float: left;
  padding-left: 10px;
  font-size: 14px;
  position: relative;
  width: calc(100% - 98px);
  height: 88px;
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .price {
    position: absolute;
    bottom: 0px;
    color: red;
  }
  .quantity {
    position: absolute;
    right: 0px;
    top: 50px;
  }
}
.price-text {
  color: red;
}
.order-number-time {
  color: #7f7f7f;
  font-size: 16px;
  .copy-btn {
    width: 40px;
    height: 20px;
    display: block;
    position: absolute;
    right: 20px;
    top: 10px;
    border: 1px solid #7f7f7f;
    background-color: #f8f8f8;
    line-height: 20px;
    text-align: center;
    border-radius: 6px;
    font-size: 12px;
  }
}

.sub-control {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-top: 1px solid #d9d9d9;
  text-align: right;
  line-height: 50px;
  .btn-col-2 {
    font-size: 16px;
    width: 30%;
    margin: 0px;
    display: inline-block;
    margin: 0px 10px 0px 0px;
  }
}
</style>
