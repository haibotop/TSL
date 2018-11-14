<template>
  <div id="mine">
    <div class="myBlock" >
      <div :class="headPortrait ? 'myBlock-bg blur' : 'myBlock-bg'" :style="blurStyle"></div>
      <x-icon type="gear-a" size="25px" @click="goSet" style="fill:#fff;position:absolute;top:20px;left:15px;"></x-icon>
      <div class="head-portrait" @click="goInfo"><img :src="headPortrait" alt=""></div>
      <div class="nickname" @click="clickNickname">{{ nickName || '登录' }}</div>
    </div>
    <group gutter="0px">
      <div class="myOrder">
        <cell title="我的订单" is-link link="/myOrders/0" style="border:1px solid transparent;padding-left:0;"></cell>
        <span class="allOrder" @click="goOrders(0)">全部订单</span>
      </div>
      <div class="order-status-tab">
        <div @click="goOrders(1)"><img src="../../assets/icons/waitPay.svg" style="display:block;margin:5px auto;width:27px;" alt="" ><span>待付款</span></div>
        <div @click="goOrders(2)"><img src="../../assets/icons/waitSend.svg" style="display:block;margin:5px auto;width:27px;" alt="" ><span>待发货</span></div>
        <div @click="goOrders(3)"><img src="../../assets/icons/waitGet.svg" style="display:block;margin:5px auto;width:27px;" alt="" ><span>待收货</span></div>
        <div @click="goOrders(4)"><img src="../../assets/icons/afterSell.svg" style="display:block;margin:5px auto;width:27px;" alt="" ><span>已完成</span></div>
        <div @click="goOrders(-1)"><img src="../../assets/icons/aftersales-temp.svg" style="display:block;margin:5px auto;width:27px;opacity:0.4;" alt="" ><span>售后</span></div>
      </div>
    </group>
    <group gutter="10px" id="discount">
       <cell is-link link="/myCoupons">
        <div slot="icon"><img src="../../assets/icons/myDiscount.svg"  style="fill:#352665;margin:0px 5px -6px 0px;width:27px;"></div>
        <div slot="title">我的优惠券<badge v-show="existCoupons" style="margin:-10px 0 0 1px;"></badge></div>
      </cell>
      <cell title="我的收藏" is-link link="/myCollection">
        <div slot="icon"><img src="../../assets/icons/mycollect.svg"  style="fill:#352665;margin:0px 5px -6px 0px;width:27px;"></div>
      </cell>
      <cell title="我的收货地址" is-link link="/addressList">
        <div slot="icon"><img src="../../assets/icons/getAddress.svg"  style="fill:#352665;margin:0px 5px -6px 0px;width:27px;"></div>
      </cell>
      <cell title="客服" onclick="qimoChatClick();" class="vux-tap-active weui-cell_access">
        <div slot="icon" style="width:27px;"><img src="../../assets/icons/customer.svg"  style="fill:#352665;margin:0px 5px -6px 0px;width:24px;"></div>
      </cell>
    </group>
    <!-- <group gutter="10px">
      <cell title="客服" is-link>
        <div slot="icon"><img src="../../assets/icons/servicers.svg"  style="fill:#352665;margin:0px 5px -6px 0px;"></div>
      </cell>
    </group> -->
    <subTab :index="2"></subTab>
  </div>
</template>
<script type="text/ecmascript-6">
  import subTab from '@/components/subTab.vue'
  import { Group, Cell, Badge } from 'vux'
  import * as mkApi from '@/services/API/marketing.es6'
  export default {
    name: 'mine',
    components: { subTab, Group, Cell, Badge },
    data () {
      return {
        existCoupons: false
      }
    },
    mounted: function () {
      if (sessionStorage.getItem('userInfo')) {
        if (!sessionStorage.getItem('sendCoupons')) {
          this.getMyCoupon(0, 1, 99)
        }
      }
    },
    computed: {
      headPortrait () {
        if (sessionStorage.getItem('userInfo')) {
          return (JSON.parse(sessionStorage.getItem('userInfo')).headPortrait || '').replace('!56', '!352') || ''
        } else {
          return ''
        }
      },
      nickName () {
        if (sessionStorage.getItem('userInfo')) {
          return JSON.parse(sessionStorage.getItem('userInfo')).nickName || '未命名'
        } else {
          return ''
        }
      },
      bgImg () {
        return require('../../assets/images/mine-bk.png')
      },
      blurStyle: {
        get () {
          console.log(this.headPortrait)
          if (this.headPortrait) {
            return `background:url(${this.headPortrait}) no-repeat center;background-size: 200% 200%;`
          } else {
            return `background-image: url(${this.bgImg});background-size: cover;`
          }
        }
      }
    },
    methods: {
      goSet () {
        this.$router.push({path: '/mySet'})
      },
      goInfo () {
        this.$router.push({path: '/myInfo'})
      },
      goOrders (status) {
        if (status === -1) {
          this.$router.push({path: '/asOrders'})
        } else {
          this.$router.push({path: `/myOrders/${status}`})
        }
      },
      goAsOrders () {
        this.$router.push({path: `/asOrders`})
      },
      clickNickname () {
        if (sessionStorage.getItem('userInfo')) {
          this.goInfo()
        } else {
          this.$router.push({path: '/signin'})
        }
      },
      getMyCoupon (status, pageNum, pageSize) {
        this.$http.post(mkApi.getMyCoupon(status, pageNum, pageSize)).then(res => {
          if (res.data.code === 200) {
            if (res.data.pageInfo) {
              if (res.data.pageInfo.list.length > 0) {
                console.log('existCoupons', res.data.pageInfo.list.length)
                this.existCoupons = true
              }
            }
          }
        })
      }
    }
  }
</script>

<style>
  #discount .weui-cells.vux-no-group-title {
    overflow: scroll;
  }  
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  #mine {
    position: relative;
    height: 100%;
    background: #eeeeee;
  }
  .myBlock {
    .myBlock-bg {
      position: absolute;
      width: 100%;
      height: 180px;
      // z-index: -1;
    }
    .blur {
      -webkit-filter: blur(10px);
      -moz-filter: blur(10px);
      -o-filter: blur(10px);
      -ms-filter: blur(10px);
      filter: blur(10px);
    }
    position: relative;
    height: 180px;
    // background-image: linear-gradient(133deg, rgb(150, 150, 150) 0%, rgb(60,60,60) 100%);
    .head-portrait {
      width: 90px;
      height: 90px;
      position: absolute;
      top: 20px;
      left: 50%;
      margin-left: -45px;
      background-color: #fff;
      border-radius: 50%;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 100px;
      }
    }
    .nickname {
      position: absolute;
      width: 100%;
      top: 120px;
      text-align: center;
      color: #fff;
    }
  }
  .order-status-tab {
    div {
      width: 20%;
      height: 65px;
      float: left;
      text-align: center;
      font-size: 12px;
      color: #4d4d4d;
      letter-spacing: .16px;
    }
  }
  .allOrder {
    position: absolute;
    top: 50%;
    right: 30px;
    font-size: 14px;
    transform: translateY(-50%);
    color: #c5c5c5;
  }
  #mini {
    .weui-cell:before{
      margin-left:15px;
    }
  }
  .list-item{
    width:100%;
    background:#fff;
  }
  .myOrder{
    margin-left:5%;
    border-bottom:1px solid #dbdbdb;
    position:relative;
    margin-bottom: 10px;
  }
</style>
