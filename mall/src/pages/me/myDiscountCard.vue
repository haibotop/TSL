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
    }
  }
</style>
<template>
  <div id="myDiscountCard">
    <div class="login-header">
      <x-header title="我的折扣码" :left-options="{backText: '', preventGoBack:false}">
      </x-header>
    </div>
    <tab v-model="index" class="login-tab">
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
    <div class="group" v-show="index === 0">
      <div class="cardList" v-for="item in couponIds">
        <div class="cardList_left">
          <p class="disPrice">￥100{{item.}}</p>
          <p class="manjian">满1000减100</p>
          <p class="reUse"><img src="../../assets/icons/icon_overlay.png" alt=""><span>可叠加适用</span></p>
        </div>
        <div class="cardList_right">
          <p class="zkmCode">折扣码：TSLCOUPON1000</p>
          <p class="expiryDate">有效期：2018/10/01-2018/12/01</p>
          <p class="useNow">立即使用</p>
          <p class="lookDetail">查看明细<img src="../../assets/icons/icon_drop_down.png" alt=""></p>
        </div>
        <div class="cardList_bottom">
          <p class="lookGoods">查看适用商品</p>
          <p class="explain">说明：“金秋十月”线下活动获得</p>
        </div>
      </div>
    </div>
    <div class="group" v-show="index === 1">

    </div>
    <div class="group" v-show="index === 2">

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
      index: 0,
      coupon: {
        status: 1,
        userId: 117690266271387648
      },
      responce: {
        code: 200,
        message: '操作成功',
        couponIds: [
          {
            id: '143223434690707456',
            type: 1,
            name: 'test_lsm',
            rule: 1,
            minExpense: 10,
            discountAmount: 5,
            memo: 'test for lsm',
            startDate: '2018-10-13T08:00:00.000Z',
            endDate: '2018-11-30T08:00:00.000Z',
            status: 1,
            discountcode: '3243208340832408328',
            discountcodePiecediscountList: null,
            discountcodeRecordId: 143235746677932032
          },
          {
            id: '143223434690707456',
            type: 1,
            name: 'test_lsm',
            rule: 1,
            minExpense: 10,
            discountAmount: 5,
            memo: 'test for lsm',
            startDate: '2018-10-13T08:00:00.000Z',
            endDate: '2018-11-30T08:00:00.000Z',
            status: 1,
            discountcode: '3243208340832408328',
            discountcodePiecediscountList: null,
            discountcodeRecordId: 143235746677932032
          }
        ]
      }
    }
  },
  mounted: function () {
    this.receiveCoupon()
  },
  methods: {
    receiveCoupon () {
        // this.$http.post(...disAPI.getDiscountList(this.coupon))
        //   .then(res => {
        //     console.log(res)
        //   })
    }
  }
}
</script>
