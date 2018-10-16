<template>
  <div id="cashier">
    <div v-transfer-dom>
      <popup v-model="flag" id="cashier-popup">
        <div class="title">收银台</div>
        <x-icon @click="flag = false" type="ios-close-empty" size="40" class="close-icon"></x-icon>
        <div class="price">￥{{handlePrice(price)}}</div>
        <group title="付款方式" class="pay-group">
          <radio v-model="payway" :options="options" class="pay-item"></radio>
          <cell-box><div style="height:15px;"></div></cell-box>
          <x-button class="pay-btn" @click.native="pay">立即支付</x-button>
        </group>
      </popup>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as orderAPI from '@/services/API/orderServices.es6'
  import * as tool from '@/services/myTool.es6'
  import { TransferDom, Popup, Group, CellBox, Radio, XButton } from 'vux'
  export default {
    name: 'cashier',
    directives: { TransferDom },
    components: { Popup, Group, CellBox, Radio, XButton },
    props: { value: Boolean, price: Number, orderNum: String },
    data () {
      return {
        payway: ''
        // options: [{
        //   icon: require('../assets/icons/payway/aliLogo.svg'),
        //   key: 'alipay',
        //   value: '支付宝支付'
        // }, {
        //   icon: require('../assets/icons/payway/wxLogo.svg'),
        //   key: 'wxpay',
        //   value: '微信支付'
        // }, {
        //   icon: require('../assets/icons/payway/unionLogo.svg'),
        //   key: 'unionpay',
        //   value: '银联支付'
        // }]
      }
    },
    methods: {
      pay () {
        if (this.orderNum) {
          if (this.payway === 'alipay') {
            this.isWeiXin() ? this.$vux.toast.show({ type: 'text', text: '微信内无法支付宝支付', width: '200px' }) : this.h5Alipay()
          } else if (this.payway === 'wxpay') {
            this.isWeiXin() ? this.wxsmPay() : this.h5Wxpay()
          } else if (this.payway === 'unionpay') {
            this.unionPay()
          } else {
            this.$vux.toast.show({ type: 'text', text: '请选择付款方式', width: '200px' })
          }
        }
      },
      h5Alipay () {
        let params = [{'orderNo': this.orderNum, 'terminalIp': '192.168.0.1', 'productDescription': '甄品商城', 'currency': 'CNY'}]
        this.$http.post(...orderAPI.h5Alipay(params), {async: false}).then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            // document.write(response.data.resultHtml)
            window.location.href = response.data.resultHtml
          } else if (response.data.code === 5001) {
            this.$vux.toast.show({ type: 'text', text: response.data.message, width: '200px' })
          } else if (response.data.code === 9990) {
            this.$vux.toast.show({ type: 'text', text: '20s内重复提交', width: '200px' })
          }
          // 所有支付 无此订单 5001 重复提交 9990
        })
      },
      h5Wxpay () {
        let params = [{'orderNo': this.orderNum, 'terminalIp': '192.168.0.1', 'productDescription': '甄品商城', 'currency': 'CNY'}]
        this.$http.post(...orderAPI.h5Wxpay(params), {async: false}).then((response) => {
          if (response.data.code === 200) {
            window.location.href = response.data.resultHtml
          } else if (response.data.code === 5001) {
            this.$vux.toast.show({ type: 'text', text: response.data.message, width: '200px' })
          } else if (response.data.code === 9990) {
            this.$vux.toast.show({ type: 'text', text: '重复提交，请20s后重试', width: '200px' })
          }
        })
      },
      wxsmPay () {
        let params = [{'orderNo': this.orderNum, 'terminalIp': '192.168.0.1', 'productDescription': '甄品商城', 'currency': 'CNY'}]
        this.$http.post(...orderAPI.wxsmpay(params), {async: false}).then((response) => {
          if (response.data.code === 200) {
            document.write(response.data.resultHtml)
          } else if (response.data.code === 5001) {
            this.$vux.toast.show({ type: 'text', text: response.data.message, width: '200px' })
          } else if (response.data.code === 9990) {
            this.$vux.toast.show({ type: 'text', text: '重复提交，请20s后重试', width: '200px' })
          }
        })
      },
      unionPay () {
        let params = [{'orderNo': this.orderNum, 'terminalIp': '192.168.0.1', 'productDescription': '甄品商城', 'currency': 'CNY'}]
        this.$http.post(...orderAPI.unionpay(params), {async: false}).then((response) => {
          if (response.data.code === 200) {
            document.write(response.data.resultHtml)
          } else if (response.data.code === 5001) {
            this.$vux.toast.show({ type: 'text', text: response.data.message, width: '200px' })
          } else if (response.data.code === 9990) {
            this.$vux.toast.show({ type: 'text', text: '重复提交，请20s后重试', width: '200px' })
          }
        })
      },
      isWeiXin () {
        let ua = window.navigator.userAgent.toLowerCase()
        // alert(ua)
        if (/MicroMessenger/i.test(ua)) {
          return true
        } else {
          return false
        }
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      }
    },
    computed: {
      flag: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      },
      options () {
        if (this.isWeiXin()) {
          return [
            {
              //icon: require('../assets/icons/payway/wxLogo.svg'),
              key: 'wxpay',
              value: '微信支付'
            },
            {
              //icon: require('../assets/icons/payway/unionLogo.svg'),
              key: 'unionpay',
              value: '银联支付'
            }
          ]
        } else {
          return [
            // {
            //   icon: require('../assets/icons/payway/aliLogo.svg'),
            //   key: 'alipay',
            //   value: '支付宝支付'
            // },
            // {
            //   icon: require('../assets/icons/payway/wxLogo.svg'),
            //   key: 'wxpay',
            //   value: '微信支付'
            // },
            {
              //icon: require('../assets/icons/payway/unionLogo.svg'),
              key: 'unionpay',
              value: '银联支付'
            }
          ]
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#cashier-popup {
  overflow: hidden;
  background-color: #FFF;
  .title {
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .close-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    fill: #b1b1b1;
  }
  .price {
    line-height: 20px;
    text-align: center;
    //color: $tsl-color;
    font-size: 18px;
    font-weight: 400;
  }
  .pay-item {
    background-color: #FFF;
  }
  .pay-btn {
    width: 100%;
    height: 45px;
    line-height: 45px;
    border-radius: 0px;
    color: rgb(255, 255, 255);
    //background-color: $tsl-color;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.pay-group {
  .weui-cells__title {
    position: relative;
    margin: 0px;
    line-height: 24px;
    font-size: 12px;
    color: #000;
  }
  // .weui-cells__title:before {
  //   content: " ";
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   right: 0;
  //   height: 1px;
  //   border-top: 1px solid #D9D9D9;
  //   color: #D9D9D9;
  //   -webkit-transform-origin: 0 0;
  //   transform-origin: 0 0;
  //   -webkit-transform: scaleY(0.5);
  //   transform: scaleY(0.5);
  // }
  // .weui-cell:before {
  //   left: 0px;
  // }
}
</style>

