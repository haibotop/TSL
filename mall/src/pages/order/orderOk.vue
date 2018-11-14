<template>
  <div id="orderOk">
    <x-header title="交易成功" :left-options="{backText: ''}"></x-header>
      <p class="payconfirm">
        <x-icon type="ios-checkmark-outline" size="30" style="fill:#352665;margin-bottom: -8px;"></x-icon>
        交易成功
      </p>
      <div class="telbtn">
        <x-button class="onlineTel" @click.native="goOrderDetail">订单详情</x-button>
        <x-button class="clientTel" @click.native="buyAgain">再来一单</x-button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, XButton} from 'vux'
  import * as orderAPI from '@/services/API/orderServices.es6'
  import * as cartAPI from '@/services/API/shoppingCartServices.es6'
  export default{
    name: 'checkout',
    components: {
      XHeader,
      XButton
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
    font-family: initial, serif;
    p {
      font-size: 20px;
      position: absolute;
      text-align: center;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
    }
    .telbtn {
      text-align: center;
      margin-top: 40%;
      .onlineTel,.clientTel {
        width: 140px;
        height: 44px;
        color: #ffffff;
        display: inline-block;
        background-color: #352665;
      }
    }
  }
</style>
