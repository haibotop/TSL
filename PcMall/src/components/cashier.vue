<style lang="scss">
    #cashier{
        .choosePayList{
            padding: 0 94px;
            width: 100%;
            height: 340px;
            text-align: center;
            .payLi{
                position: relative;
                margin-right: 15px;
                float: left;
                width: 250px;
                height: 230px;
                border: 1px solid #DBDBDB;
                cursor: pointer;
                img{
                    margin: 55px auto 20px;
                    display: block;
                    width: 70px;
                    height: 70px;
                }
                span{
                    font-size: 16px;
                    color: #111;
                }
            }
            .payLi:last-child{
                margin-right: 0;
            }
            .payLi.checked{
                border: 1px solid #352665;
            }
            .payLi.checked .activeIcon{
                position: absolute;
                top: 0;
                right: 0;
                display: inline-block;
                border: 20px solid transparent;
                border-top-color: #352665;
                border-right-color: #352665;
            }
            .payLi.checked .activeIcon::before{
                position: absolute;
                top: -10px;
                left: 4px;
                content: '';
                display: inline-block;
                width: 2px;
                height: 7px;
                background-color: #fff;
                transform: rotate(-45deg);
            }
            .payLi.checked .activeIcon::after{
                position: absolute;
                top: -14px;
                left: 10px;
                content: '';
                display: inline-block;
                width: 2px;
                height: 10px;
                background-color: #fff;
                transform: rotate(45deg);
            }
        }
        .cashier-popup{
            .pay-btn{
                margin: 40px auto;
                width: 250px;
                cursor: pointer;
            }
        }
    }
</style>
<template>
  <div id="cashier">
    <div >
      <div v-model="flag" class="cashier-popup">
        <p solt="header" style="margin: 10px 0 0 30px; font-size: 24px;color: #352665;text-align: left;">收银台</p>
        <div class="price">支付金额：￥{{handlePrice(price)}}</div>
        <div class="choosePayList" >
            <div>
                <div v-for="item in options" @click="payway=item.key" :class="payway==item.key?'checked':''" class="payLi">
                    <img :src="item.icon" alt="">
                    <span>{{item.value}}</span>
                    <i class="activeIcon"></i>
                </div>
            </div>
          <!--<radio v-model="payway" :options="options" class="pay-item"></radio>-->
            <div style="clear: both;"></div>
            <loading v-if="loading"></loading>
          <x-button class="pay-btn" @click.native="pay">立即支付</x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as orderAPI from '@/services/API/orderServices.es6'
  import * as tool from '@/services/myTool.es6'
  import loading from '@/pages/homePages/loading.vue'
  import { TransferDom, Popup, Group, CellBox, Radio, XButton } from 'vux'
  export default {
    name: 'cashier',
    directives: { TransferDom },
    components: { Popup, Group, CellBox, Radio, XButton,loading },
    props: { value: Boolean, price: Number, orderNum: String },
    data () {
      return {
        payway: '',
        loading: false
        // choosePayStatus: ''
      }
    },
    methods: {
      pay () {
          this.loading = true
          // let params = [{'orderNo': this.orderNum, 'terminalIp': '192.168.0.1', 'productDescription': '支付测试', 'currency': 'CNY'}]
          // this.$http.post(...orderAPI.codeAlipay(params), {async: false}).then((response) => {
          //     console.log(response)
          //     if (response.data.code === 200) {
          //         // document.write(response.data.resultHtml)
          //         document.write(response.data.resultHtml)
          //     } else if (response.data.code === 5001) {
          //     } else if (response.data.code === 9990) {
          //     }
          //     // 所有支付 无此订单 5001 重复提交 9990
          // })
        if (this.orderNum) {
          if (this.payway === 'alipay') {
            this.codeAlipay()
          } else if (this.payway === 'wxpay') {
              this.codeAlipay()
          } else if (this.payway === 'unionpay') {
            this.unionPay()
          } else {
            this.$Modal.warning({ title: '提示', content: '请选择付款方式'})
          }
        }
      },
      codeAlipay () {
        let params = [{'payType': 14, 'orderNo': this.orderNum, 'terminalIp': '192.168.0.1', 'productDescription': '甄品商城', 'currency': 'CNY'}]
        this.$http.post(...orderAPI.codeAlipay(params), {async: false}).then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            this.loading = false
            document.write(response.data.resultHtml)
          } else if (response.data.code === 5001) {
            this.$vux.toast.show({ type: 'text', text: response.data.message, width: '200px' })
          } else if (response.data.code === 9990) {
            this.$vux.toast.show({ type: 'text', text: '20s内重复提交', width: '200px' })
          }
          // 所有支付 无此订单 5001 重复提交 9990
        })
      },
      unionPay () {
        let params = [{'orderNo': this.orderNum, 'terminalIp': '192.168.0.1', 'productDescription': '甄品商城', 'currency': 'CNY'}]
        this.$http.post(...orderAPI.unionpay(params), {async: false}).then((response) => {
          if (response.data.code === 200) {
            this.loading = false
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
          // return [
          //   {
          //     icon: require('../assets/icons/payway/wxLogo.png'),
          //     key: 'wxpay',
          //     value: '微信支付'
          //   },
          //   {
          //     icon: require('../assets/icons/payway/unionLogo.png'),
          //     key: 'unionpay',
          //     value: '银联支付'
          //   }
          // ]
        } else {
          return [
            {
              icon: require('../assets/icons/payway/aliLogo.png'),
              key: 'alipay',
              value: '支付宝支付'
            },
            {
              icon: require('../assets/icons/payway/wxLogo.png'),
              key: 'wxpay',
              value: '微信支付'
            },
            {
              icon: require('../assets/icons/payway/unionLogo.png'),
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
.cashier-popup {
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
    margin:40px 0 30px 30px;
    font-size: 18px;
    font-weight: 400;
    color: #352665;
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
    background-color: #352665;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
/*.pay-group {*/
  /*.weui-cells__title {*/
    /*position: relative;*/
    /*margin: 0px;*/
    /*line-height: 24px;*/
    /*font-size: 12px;*/
    /*color: #000;*/
  /*}*/
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
/*}*/
</style>

