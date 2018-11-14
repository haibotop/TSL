<template>
  <div id="checkout">
    <x-header title="付款结果" :left-options="{showBack: false, preventGoBack: true}" @on-click-back="backMine">
      <a slot="right" style="color: #fff;" href="javascript:" @click="gotoMyOrders">完成</a>
    </x-header>
    <!-- 付款等待 -->
    <div v-show="waited">
      <div class="payState">
        <Group>
          <div class="paymsg">
            <p class="payconfirm">
              请稍后 ...
            </p>
          </div>
        </Group>
      </div>
      <div class="failContent">
        <div class="telbtn">
          <x-button class="checkOrder" @click.native="gotoMyOrders">查看订单</x-button>
          <x-button class="toHome" @click.native="gotoHome">返回首页</x-button>
        </div>
      </div>
    </div>
    <!-- 付款成功 -->
    <div v-show="success && !waited">
      <div class="payState">
        <Group>
          <div class="paymsg">
            <p class="payconfirm">
              <x-icon type="ios-checkmark-outline" size="30" class="payIcon"></x-icon>
              付款成功
            </p>
            <p class="payconfirmmsg">您的包裹正整装待发</p>
          </div>
        </Group>
      </div>
      <div class="failContent">
        <div class="telbtn">
          <x-button class="checkOrder" @click.native="gotoMyOrders">查看订单</x-button>
          <x-button class="toHome" @click.native="gotoHome">返回首页</x-button>
        </div>
      </div>
    </div>
    <!-- 付款失败 -->
    <div v-if="!success && !waited">
      <!-- 付款失败显示内容 -->
      <div class="failContent" v-if="!success && !waited">
        <div class="payState">
          <group>
            <div class="paymsg">
              <p class="payconfirm">
                付款失败！
              </p>
              <p class="payconfirmmsg">服务时间：{{ workHours }}</p>
            </div>
          </group>
        </div>
        <div class="telbtn">
          <x-button class="onlineTel">在线客服</x-button>
          <x-button class="clientTel">电话客服</x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, Group, Cell, XButton, CellBox, XImg, Icon} from 'vux'
  import * as myAPI from '@/services/API/myService.es6'

  export default{
    name: 'checkout',
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      CellBox,
      XImg,
      Icon
    },
    data () {
      return {
        success: true,
        waited: false,
        productMsg: [],
        outTradeNo: '',
        workHours: '9:00 - 22:00'
      }
    },
    mounted () {
      // this.getOutTradeNo()
      // 银联支付-------------重定向的返回处理
      if (this.getUrlParam().orderNo) {
        let obj = {
          OrderNo: this.getUrlParam().orderNo,
          ShoppingDate: this.getUrlParam().shoppingDate
        }
        // 传订单号给后台，改变状态
        this.paymentAdvice(obj)
      } else if (this.getUrlParam().merOrderId) {
        // 其他浏览器微信支付和支付宝支付
        // alert(sessionStorage.getItem('userInfo'))
        let merOrderId = this.getUrlParam().merOrderId.substr(4)
        this.commerceH5Msg(merOrderId)
      }
    },
    methods: {
      // 获取Url的参数
      getUrlParam () {
        let url = window.location.href
        let obj = {}
        let arr = []
        if (url.indexOf('?') !== -1) {
          let str = url.substr(url.indexOf('?') + 1)
          arr = str.split('&')
          for (let i in arr) {
            obj[arr[i].split('=')[0]] = unescape(arr[i].split('=')[1])
          }
        }
        return obj
      },
      // getOutTradeNo () {
      //   if (!this.$route.query.out_trade_no) {
      //     console.log('warn')
      //   } else if (this.$route.query.out_trade_no) {
      //     this.outTradeNo = this.$route.query.out_trade_no
      //     this.$vux.alert.show({
      //       content: '请确认支付是否已完成',
      //       confirmText: '完成',
      //       onHide: () => {
      //         this.getPayment()
      //       }
      //     })
      //   }
      // },
      backMine () {
        this.$router.push({path: '/myOrders'})
      },
      gotoMyOrders () {
        this.$router.replace({path: '/myOrders'})
      },
      gotoHome () {
        this.$router.push({path: '/'})
      },
      // ========================  api
      paymentAdvice (params) {
        this.$http.post(...myAPI.paymentAdvice(params))
        .then((res) => {
          console.log(res.data.code)
          this.waited = false
          if (res.data.code === 200) {
            this.success = true
          } else {
            // this.$vux.alert.show({
            //   content: res.data.message
            // })
          }
        })
      },
      commerceH5Msg (orderId) {
        this.$http.post(myAPI.commerceH5Msg(orderId))
        .then((res) => {
          console.log(res.data.code)
          this.waited = false
          if (res.data.code === 200) {
            this.success = true
          } else {
            // this.$vux.alert.show({
            //   content: res.data.message
            // })
          }
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #checkout {
    font-family: initial, serif;
    .fontColor {
      color: #000;
    }
    .sumFontColor {
      color: red;
    }
    .payState{
      .weui-cells{
        background: #eee;
        margin: 0 !important;
      }
    }
    .paymsg {
      margin-top: 60px;
      color: #352665;
      .payconfirm {
        height: 30px;
        margin-left: 70px;
        line-height: 30px;
        padding-top: 30px;
        font-size: 20px;
        .payIcon{
          position: absolute;
          left: 36px;
          fill: #ffffff;
        }
      }
      .payconfirmmsg{
        margin-left: 70px;
        font-size: 14px;
        padding-bottom: 24px;
      }
    }
    .workingHours {
      margin: 20px;
    }
    .finishBtn {
      position: absolute;
      width: 100%;
    }
    .checkOrder,.toHome {
      width: 140px;
      height: 44px;
      color: #ffffff;
      display: inline-block;
    }
    .checkOrder{
      background-color: #352665;
    }
    .toHome{
      background-color: #352665;
    }
    .onlineTel,.clientTel {
      width: 140px;
      height: 44px;
      color: #ffffff;
      display: inline-block;
    }
    .onlineTel{
      background-color: #352665;
    }
    .clientTel{
      background-color: #352665;
    }
    .addressGroup{
      .weui-cells{
        margin: 0 !important;
      }
    }
    .address {
      .addrssIcon{
        img{
          width: 15px;
        }
      }
      .addressee {
        width: 94%;
        margin-left: 5px;
        display: block;
        font-size: 14px;
        .tel {
          float: right;
        }
        .icon-default {
          width: 50px;
        }
      }
      .addressInfo {
        width: 96%;
        display: inline-block;
        vertical-align: top;
        margin-left: 5px;
        .addressDetail{
          font-size: 12px;
          color:#7F7F7F;
        }
      }
    }
    .failContent{
      .telbtn{
        margin-top:30px;
        text-align: center;
        letter-spacing: 20px;
      }
      .weui-cells{
        margin: 0 !important;
      }
      .weui-cells::before{
        border-bottom: 1px solid transparent;
      }
      .weui-cells::after{
        border-bottom: 1px solid transparent;
      }
    }
    .settlement-cell {
      padding: 0;
    }
    .settlement {
      color: #fff;
      width: 100px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      display: inline-block;
      background-color: #666666;
    }
  }
</style>
