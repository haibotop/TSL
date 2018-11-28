<style lang="scss" scoped>
  #myDiscountCard{
    .group{
      padding: 0 10px;
      .cardList{
        position: relative;
        margin-top: 10px;
        background-color: #fff;
        font-size: 12px;
        line-height: 24px;
        .name{
        color: #352665;
      }
        .zkmCode,.expiryDate,.explain{
          color: #8b8b8b;
        }
        .cardList_left{
          padding: 20px 0;
          width: 30%;
          background-color: #352665;
          color: #fff;
          text-align: center;
          .disPrice{
            font-size: 30px;
            line-height: 36px;
          }
          img{
            width: 10px;
            margin-right: 3px;
          }
        }
        .cardList_right{
          position: absolute;
          top: 0;
          left: 30%;
          padding: 20px;
          width: 60%;
          .useNow{
            display: inline-block;
            margin-top: 16px;
            padding: 0px 10px;
            border: 1px solid #111;
          }
          .lookDetail{
            position: relative;
            margin-top: 16px;
            margin-right: 10px;
            float: right;
            color: #8b8b8b;
            img{
              position: relative;
              top: 5px;
              right: -10px;
              width: 15px;
            }
          }
        }
        .cardList_bottom{
          position: relative;
          padding: 10px 20px;
          .lookGoods{
            color: #4A90E2;
          }
        }
        .cardList_bottom::before{
          content: '';
          display: inline-block;
          position: absolute;
          top: 0px;
          width: 90%;
          height: 1px;
          background-color: #d6d6d6;
        }
      }
      .discountBottom{
        position: fixed;
        bottom: 0;
        width: calc(100% - 30px);
        padding: 15px;
        background-color: #F8F8F8;
        input{
          padding-left: 5px;
          width: 65%;
          height: 36px;
          outline: none;
          border-color: transparent;
          font-size: 16px;
        }
        span{
          display: inline-block;
          width: 30%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: #352665;
          color: #fff;
          float: right;
        }
      }
    }
  }
</style>
<template>
  <div id="myDiscountCard">
    <div class="login-header">
      <x-header title="我的折扣码" :left-options="{backText: '', preventGoBack:false}">
      </x-header>
    </div>
    <tab v-model="tabIndex" class="login-tab">
      <tab-item>
        已兑换
      </tab-item>
      <tab-item>
        已使用
      </tab-item>
      <tab-item>
        已失效
      </tab-item>
    </tab>
    <div class="group" v-show="tabIndex === 0">
      <div style="margin-bottom: 70px">
      <div class="cardList" v-for="(item,index) in readyTradeItem">
        <div class="cardList_left">
          <p class="disPrice" v-if="item.rule  === 1 || item.rule  === 2">￥{{item.discountAmount/100}}</p>
          <p class="disPrice" v-if="item.rule   === 3">{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
          <p class="manjian" v-if="item.rule   === 2">直减</p>
          <div class="manjian" v-if="item.rule   === 3" >
            <p >满{{item.discountcodePiecediscountList[0].min_quantity}}件打{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
          </div>
          <p class="manjian" v-if="item.rule === 1">满{{item.minExpense/100}}减{{item.discountAmount/100}}</p>
          <p class="reUse"><img src="../../assets/icons/icon_overlay.png" alt=""><span>可叠加使用</span></p>
        </div>
        <div class="cardList_right">
          <p class="zkmCode">折扣码：{{item.discountcode}}</p>
          <p class="expiryDate">有效期：{{(item.startDate || '').replace("T", " ").split(' ')[0]}}至{{(item.endDate || '').replace("T", " ").split(' ')[0]}}</p>
          <p class="useNow" @click="disUseNow(item.id)">立即使用</p>
          <p class="lookDetail" @click="lookDetail1(index)">查看明细<img src="../../assets/icons/icon_drop_down.png" alt=""></p>
        </div>
        <div class="cardList_bottom" v-show="lookDetailIndex1 == index">
          <p class="lookGoods" @click="disUseNow(item.id)">查看适用商品</p>
          <p class="explain" >说明：<span v-if="item.memo">{{item.memo || '无'}}</span></p>
        </div>
      </div>
      </div>
      <div class="discountBottom">
        <input type="text" v-model="cashingDiscount" placeholder="请输入折扣码">
        <span class="exchange" @click="changeDiscount">兑换</span>
      </div>
    </div>
    <div class="group" v-show="tabIndex === 1">
      <div class="cardList" v-for="(item,index) in readyUsedItem">
        <div class="cardList_left" style="background-color: #8B8B8B">
          <p class="disPrice" v-if="item.rule  === 1 || item.rule  === 2">￥{{item.discountAmount/100}}</p>
          <p class="disPrice" v-if="item.rule   === 3">{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
          <p class="manjian" v-if="item.rule   === 2">直减</p>
          <div class="manjian" v-if="item.rule   === 3" >
            <p >满{{item.discountcodePiecediscountList[0].min_quantity}}件打{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
          </div>
          <p class="manjian" v-if="item.rule === 1">满{{item.minExpense/100}}减{{item.discountAmount/100}}</p>
          <p class="reUse"><img src="../../assets/icons/icon_overlay.png" alt=""><span>可叠加使用</span></p>
        </div>
        <div class="cardList_right">
          <p class="zkmCode">折扣码：{{item.discountcode}}</p>
          <p class="expiryDate">有效期：{{(item.startDate || '').replace("T", " ").split(' ')[0]}}至{{(item.endDate || '').replace("T", " ").split(' ')[0]}}</p>
          <p class="useNow" style="border:none;color: #8b8b8b;">已使用</p>
          <p class="lookDetail" @click="lookDetail2(index)">查看明细<img src="../../assets/icons/icon_drop_down.png" alt=""></p>
        </div>
        <div class="cardList_bottom" v-show="lookDetailIndex2 == index">
          <p class="explain" v-if="item.memo">说明：{{item.memo || '无'}}</p>
        </div>
      </div>
    </div>
    <div class="group" v-show="tabIndex === 2">
      <div class="cardList"  v-for="(item,index) in loseEfficacyItem">
        <div class="cardList_left" style="background-color: #8B8B8B">
          <p class="disPrice" v-if="item.rule  === 1 || item.rule  === 2">￥{{item.discountAmount/100}}</p>
          <p class="disPrice" v-if="item.rule   === 3">{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
          <p class="manjian" v-if="item.rule   === 2">直减</p>
          <div class="manjian" v-if="item.rule   === 3" >
            <p >满{{item.discountcodePiecediscountList[0].min_quantity}}件打{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
          </div>
          <p class="manjian" v-if="item.rule === 1">满{{item.minExpense/100}}减{{item.discountAmount/100}}</p>
          <p class="reUse"><img src="../../assets/icons/icon_overlay.png" alt=""><span>可叠加使用</span></p>
        </div>
        <div class="cardList_right">
          <p class="zkmCode">折扣码：{{item.discountcode}}</p>
          <p class="expiryDate">有效期：{{(item.startDate || '').replace("T", " ").split(' ')[0]}}至{{(item.endDate || '').replace("T", " ").split(' ')[0]}}</p>
          <p class="useNow" style="border:none;color: #8b8b8b;">已失效</p>
          <p class="lookDetail" @click="lookDetail3(index)">查看明细<img src="../../assets/icons/icon_drop_down.png" alt=""></p>
        </div>
        <div class="cardList_bottom" v-show="lookDetailIndex3 == index">
          <p class="explain" v-if="item.memo">说明：{{item.memo || '无'}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as disAPI from '../../services/API/discountServices.es6'
import { XHeader, Tab, TabItem, Group, XInput, XButton, Toast, debounce } from 'vux'

export default {
  name: 'myDiscountCard',
  components: {
    XHeader,
    Tab,
    TabItem,
    Group,
    XInput,
    XButton,
    Toast,
    debounce
  },
  data () {
    return {
      tabIndex: 0, // 切换tab
      lookDetailIndex1: -1, // 查看明细
      lookDetailIndex2: -1,
      lookDetailIndex3: -1,
      userId: '', // memberId
      readyTradeItem: [],
      readyUsedItem: [],
      loseEfficacyItem: [],
      cashingDiscount: '' // 输入折扣码
    }
  },
  mounted: function () {
    this.userId = JSON.parse(sessionStorage.getItem('userInfo')).memberId
    this.readyTrade() // 已兑换
    this.readyUsed() // 已使用
    this.loseEfficacy() // 已失效
  },
  methods: {
    changeDiscount () { // 兑换折扣码
      let parms = {
        couponIds: [this.cashingDiscount],
        userId: this.userId
      }
      this.$http.post(...disAPI.cashingDiscountcode(parms))
        .then(res => {
          if (res.data.code === 200) {
            this.$vux.alert.show({
              title: '提示',
              content: res.data.message
            })
            this.readyTrade() // 已兑换折扣码
          } else {
            this.$vux.alert.show({
              title: '提示',
              content: res.data.message
            })
          }
        })
    },
    disUseNow (id) {
      this.$router.push({path: '/couponPl', query: {'discountcode': id}})
    },
    readyTrade () { // 已兑换
       let params = {
           status: 1, // 1：已兑换2：已使用3：已失效 ,
           userId: this.userId
         }
        this.$http.post(...disAPI.getDiscountList(params))
          .then(res => {
            this.readyTradeItem = res.data.couponIds || []
            // console.log('this.readyTradeItem', this.readyTradeItem)
          })
    },
    readyUsed () { // 已使用
      let params = {
        status: 2,
        userId: this.userId
      }
      this.$http.post(...disAPI.getDiscountList(params))
        .then(res => {
          this.readyUsedItem = res.data.couponIds || []
        })
    },
    loseEfficacy () { // 已失效
      let params = {
        status: 3,
        userId: this.userId
      }
      this.$http.post(...disAPI.getDiscountList(params))
        .then(res => {
          this.loseEfficacyItem = res.data.couponIds || []
        })
    },
    lookDetail1 (index) { // 查看已兑换明细
      this.lookDetailIndex1 = this.lookDetailIndex1 == index ? -1 : index
    },
    lookDetail2 (index) { // 查看已使用明细
      this.lookDetailIndex2 = this.lookDetailIndex2 == index ? -1 : index
    },
    lookDetail3 (index) { // 查看已失效明细
      this.lookDetailIndex3 = this.lookDetailIndex3 == index ? -1 : index
    }
  }
}
</script>
