<template>
<div>
<header1></header1>
<header2></header2>
<div id="orderOk">
    <div class="login-content">
        <div class="login-cont">
            <div class="login-success">
                <p class="success-tb"></p>
                <p class="success-txt">交易成功</p>
            </div>
            <div class="login-footer">
                <Button class="goto-home" @click.native="goOrderDetail" >订单详情</Button>
                <Button class="look-more" @click.native="buyAgain" >再来一单</Button>
            </div>
        </div>
    </div>
</div>
<v-footer></v-footer>
</div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, XButton} from 'vux'
  import header1 from "../homePages/header1"
  import header2 from "../homePages/header2"
  import vFooter from "@/pages/homePages/footer.vue"
  import * as orderAPI from '@/services/API/orderServices.es6'
  import * as cartAPI from '@/services/API/shoppingCartServices.es6'
  export default{
    name: 'checkout',
    components: {
      XHeader,
      XButton,
      header1,
      header2,
      vFooter,
    },
    methods: {
      goOrderDetail () {
        if (sessionStorage.getItem('fromPath').indexOf('myOrderDetail') !== -1) {
          this.$router.go(-1)
        } else {
          this.$router.replace({path: `/myOrderDetail/${this.$route.params.orderNum}`})
        }
      },
      buyAgain () {
        if (!this.$route.params.orderNum) {
          this.$vux.toast.show({text: '找不到订单号', type: 'text', width: '200px'})
          return
        }
        this.$http.get(...orderAPI.getOrder(this.$route.params.orderNum)).then(res => {
          if (res.data.code === 200) {
            let orderItem = res.data.orderItem
            let pl = []
            for (let i of orderItem.orderProductItems) {
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
              } else {
                this.$vux.toast.show({text: '加入购物袋失败', type: 'text', width: '200px'})
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #orderOk {
      padding: 50px 0;
      background: #fafafa;
      .login-content{
          margin: 0 10%;
          padding: 40px 0;
          width: 80%;
          background: #fff;
          .login-cont{
              width: 650px;
              margin: 0 auto;
              text-align: center;
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
                      color:#fff;
                      background-color: #352665;
                  }
                  .look-more{
                      padding-bottom: 8px;
                      width: 200px;
                      height: 50px;
                      font-size: 16px;
                  }
              }
          }
      }
  }
</style>
