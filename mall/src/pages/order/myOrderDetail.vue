<template>
  <div id="myOrderDetail">
    <x-header :left-options="{backText: ''}" title="订单详情"></x-header>
    <scroller  v-if="orderItem" lock-x height="-46" ref="scroller">
      <div>
        <group gutter="0px" v-if="orderItem">
          <cell-box>
            <div v-if="orderItem.status === 1">
              <div>等待买家付款</div>
              <clocker class="clocker" :time="orderItem.timeDifference > 0 ? new Date().getTime() + Math.abs(parseInt(orderItem.timeDifference) * 1000) : 0" format="剩 %M 分 %S 秒自动关闭"></clocker>
            </div>
            <div v-if="orderItem.status === 2">买家已付款</div>
            <div v-if="orderItem.status === 3">
              <div>卖家已发货</div>
              <clocker class="clocker" :time="orderItem.timeDifference > 0 ? new Date().getTime() + Math.abs(parseInt(orderItem.timeDifference) * 1000) : 0" format="剩 %D 天 %H 小时 %M 分 %S 秒自动关闭"></clocker>              
            </div>
            <div v-if="orderItem.status === 4">订单已完成</div>
            <div v-if="orderItem.status === 5">订单已关闭</div>
          </cell-box>
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
          <cell-box v-for="(item, index) in orderItem.orderProductItems" :key="index">
            <div class="default-picture"><img :src="item.defaultPicture" alt=""></div>
            <div class="text-info">
              <p>{{handleName(item.name)}}</p>
              <span class="price">￥{{handlePrice(item.price)}}</span>
              <span class="quantity">×{{item.quantity}}</span>
              <x-button class="btn" mini v-if="orderItem.status === 4" onclick="qimoChatClick();">申请售后</x-button>
            </div>
          </cell-box>
        </group>

        <group>
          <cell title="商品总价"><div class="price-text">￥{{calcSum()}}</div></cell>
          <cell title="运费">免运费</cell>
          <cell title="优惠券"></cell>
        </group>

        <group>
          <cell title="应付总额"><div class="price-text">￥{{handlePrice(orderItem.amount)}}</div></cell>
        </group>

        <group>
          <cell-box>
            <div class="order-number-time">
              <div>
                <span>订单编号：{{orderItem.number}}</span>
                <input id="orderNumInput" type="text" v-model="orderItem.number" readonly style="position:absolute;top:-30px;">
                <button class="copy-btn" data-clipboard-target="#orderNumInput">复制</button>
              </div>
              <div><span>创建时间：{{handleDate(orderItem.createDate)}}</span></div>
              <div v-if="[2, 3, 4].indexOf(orderItem.status) !== -1"><span>付款时间：{{handleDate(orderItem.payDate)}}</span></div>
              <div v-if="[3, 4].indexOf(orderItem.status) !== -1"><span>发货时间：{{handleDate(sendGoodTime)}}</span></div>
              <div v-if="[4].indexOf(orderItem.status) !== -1"><span>收货时间：{{handleDate(getGoodTime)}}</span></div>
            </div>
          </cell-box>
        </group>

        <group>
          <x-textarea :value="orderItem.memberRemark" style="color:#7f7f7f;" :max="50" autosize readonly :show-counter="false">
            <div slot="label" style="color:#000;">备注：</div>
          </x-textarea>
        </group>
        <div style="height:50px;"></div>
      </div>
    </scroller>

    <cashier v-model="cashierFlag" :price="cashierPrice" :orderNum="orderNum"></cashier>

    <div class="sub-control" v-show="[4, 5].indexOf(orderItem.status) === -1">
      <x-button class="btn-col-2-b" v-if="orderItem.status === 1" @click.native="cancelOrder(orderItem)">取消订单</x-button>
      <x-button class="btn-col-2-a" v-if="orderItem.status === 1" @click.native="goPay(orderItem)">去付款</x-button>
      <!-- <x-button class="btn-col-2-a" v-if="orderItem.status === 2">提醒发货</x-button> -->
      <x-button class="btn-col-2-a" v-if="[2, 3].indexOf(orderItem.status) !== -1" @click.native="goPayAgain(orderItem)">再次购买</x-button>
      <x-button class="btn-col-2-a" v-if="orderItem.status === 3" @click.native="confirmGet(orderItem)">确认收货</x-button>
    </div>
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
  name: 'myOrderDetail',
  components: { cashier, XHeader, Scroller, Group, Cell, CellBox, Clocker, XButton, XTextarea, Confirm },
  data () {
    return {
      statusText: ['', '待付款', '待发货', '待收货', '已完成', '已关闭', '待退款', '退款失败', '已退款', '已完结'],
      orderNum: '',
      orderItem: '',
      cashierFlag: false,
      cashierPrice: 0,
      copyBtnObj: '',
      confirm: false
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
      this.getOrder()
    }
  },
  methods: {
    getOrder () {
      this.$http.get(...orderAPI.getOrder(this.orderNum)).then(res => {
        if (res.data.code === 200) {
          this.orderItem = res.data.orderItem
        } else if (res.data.code === 3201) {
          this.$vux.toast.show({type: 'text', text: '无相关订单', width: '200px'})
        }
      })
    },
    handlePrice (price) {
      return tool.handlePrice(price)
    },
    handleName (name) {
      return tool.handleName(name)
    },
    handleDate (time) {
      return tool.handleDate(time)
    },
    calcSum () {
      let sum = 0
      for (let i of this.orderItem.orderProductItems) {
        sum += i.sum
      }
      return tool.handlePrice(sum)
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
    top: 30px;
  }
  .btn {
    position: absolute;
    right: 0px;
    bottom: 0px;
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
  .btn-col-2-a, .btn-col-2-b {
    font-size: 16px;
    width: 30%;
    margin: 0px;
    display: inline-block;
    margin: 0px 10px 0px 0px;
  }
  .btn-col-2-a {
    background-color: $tsl-color;
    color: #fff;
  }
}
</style>
