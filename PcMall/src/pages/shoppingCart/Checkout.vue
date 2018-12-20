<template>
<div>
<header1></header1>
<header2></header2>
  <div id="checkout">
      <div class="login-title">
          <div class="login-t">付款结果</div>
      </div>
    <!--<x-header title="付款结果" :left-options="{showBack: false, preventGoBack: true}" @on-click-back="backMine">-->
      <!--<a slot="right" style="color: #fff;" href="javascript:" @click="gotoMyOrders">完成</a>-->
    <!--</x-header>-->
    <!-- 付款等待 -->
  <div class="login-content">
  <div class="login-cont">
    <div v-show="waited">
        <div class="login-success">
            <p style="margin-top: 20px;text-align: center;">请稍后 ...</p>
        </div>
        <div class="login-footer">
            <Button class="goto-home" @click.native="gotoMyOrders" >查看订单</Button>
            <Button class="look-more" @click.native="gotoHome" >返回首页</Button>
        </div>
    </div>
    <!-- 付款成功 -->
    <div v-show="success && !waited">
        <div class="login-success">
            <p class="success-tb"></p>
            <p class="success-txt">付款成功</p>
            <p style="margin-top: 20px;text-align: center;">您的包裹正整装待发</p>
            <div class="madeOrder" v-show="madeOrderStatus">
                <img src="../../assets/icons/icon_info.png" alt="">
                <span>您挑选的 99 件订制货品尚未付款发货。</span>
                <a href="javascript:void(0);" class="lookMore">查看</a>
            </div>
        </div>
        <div class="login-footer">
            <Button class="goto-home" @click.native="gotoMyOrders" >查看订单</Button>
            <Button class="look-more" @click.native="gotoHome" >返回首页</Button>
        </div>
    </div>
    <!-- 付款失败 -->
    <div  v-if="!success && !waited">
      <!-- 付款失败显示内容 -->
        <div class="login-success">
            <img src="../../assets/icons/icon_fail.png" style="width: 70px;height: 70px;">
            <p class="fail-txt" style="margin-top: 20px;">付款失败！</p>
            <p style="margin-top: 20px;text-align: center;">如已扣款，我们将在24小时内退回</p>
        </div>
        <div class="login-footer">
            <Button class="goto-home" onclick="qimoChatClick()">联系客服</Button>
            <Button class="look-more" @click.native="gotoHome" >完成</Button>
        </div>
    </div>
  </div>
  </div>
  </div>
<v-footer></v-footer>
</div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, Group, Cell, XButton, CellBox, XImg, Icon} from 'vux'
  import * as myAPI from '@/services/API/myService.es6'
  import header1 from "../homePages/header1"
  import header2 from "../homePages/header2"
  import vFooter from "@/pages/homePages/footer.vue"

  export default{
    name: 'checkout',
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      CellBox,
      XImg,
      Icon,
     header1,
     header2,
     vFooter,
    },
    data () {
      return {
        madeOrderStatus: true,
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
<style lang="scss" rel="stylesheet/scss" scoped>
  #checkout {
    padding: 50px 0;
    background: #fafafa;
      .login-title{
          height: 80px;
          text-align: center;
          .login-t{
              position: relative;
              display: inline-block;
              text-align: center;
              font-size: 20px;
              color: #0F0F0F;
          }
          .login-t:after{
              content: '';
              position: absolute;
              bottom: -20px;
              left: 50%;
              margin-left: -20px;
              display: inline-block;
              width: 40px;
              height: 2px;
              background-color: #504379;
          }
      }
      .login-content {
          position: relative;
          margin: 0 10%;
          padding: 80px 0;
          width: 80%;
          background: #fff;
          .login-cont{
              width: 650px;
              margin: 0 auto;
              text-align: center;
              .madeOrder{
                  position: relative;
                  top: 35px;
                  margin: 20px auto;
                  padding: 8px 10px 8px 15px;
                  width: 435px;
                  background-color: #FFF4E8;
                  img{
                      position: relative;
                      top: 2px;
                      margin-right: 5px;
                      width: 15px;
                      height: 15px;
                  }
                  .lookMore{
                      margin-left: 20px;
                      color: #4A90E2;
                      cursor: pointer;
                  }
              }
              .success-tb{
                  position: relative;
                  margin: 0 auto;
                  width: 70px;
                  height: 70px;
                  border-radius: 50%;
                  background: #352665;
              }
              .success-tb::before{
                  position: absolute;
                  top: 50%;
                  margin-top: 4px;
                  left: 50%;
                  margin-left: -17px;
                  content: '';
                  display: inline-block;
                  width: 17px;
                  height: 3px;
                  background-color: #fff;
                  transform: rotate(38deg);

              }
              .success-tb::after{
                  position: absolute;
                  top: 50%;
                  margin-top: -2px;
                  left: 50%;
                  margin-left: -7px;
                  content: '';
                  display: inline-block;
                  width: 30px;
                  height: 3px;
                  background-color: #fff;
                  transform: rotate(-45deg);

              }
              .success-txt{
                  margin-top: 40px;
                  font-size: 16px;
                  color: #111111;
              }
              .login-footer{
                  margin-top: 80px;
                  .goto-home{
                      margin-right: 30px;
                      width: 200px;
                      height: 50px;
                      font-size: 16px;
                      color:#352665;
                      background-color: #EBEAF0;
                  }
                  .look-more{
                      padding-bottom: 8px;
                      width: 200px;
                      height: 50px;
                      font-size: 16px;
                      color: #fff;
                      background-color: #352665;
                  }
              }
          }
      }
  }
</style>
