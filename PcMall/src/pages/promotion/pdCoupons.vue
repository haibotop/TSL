<template>
  <div id="pdCoupons">
    <div v-transfer-dom>
      <popup v-model="flag" height="75%" :popup-style="popupStyle">
        <x-icon @click.native="close" type="ios-close-empty" fill="#bbb" style="width:40px;height:40px;position:absolute;top:10px;right:10px;"></x-icon>
        <div class="title">优惠券</div>
        <scroller lock-x height="-65">
          <div class="scroller-wrapper">
            <div>
              <span v-if="list0.length > 0">可领取优惠券</span>
              <coupon class="coupon" v-for="(item, index) in list0" :key="index" :status="0" :coupon="item" v-if="list0.length > 0" @eventCoupon="receiveCoupon"></coupon>
              <div style="text-align:center;margin-top:20px;" v-if="list0.length === 0">
                <img class="null-coupon" src="../../assets/images/nullCoupon.png" alt="">
                <div style="color:#C8C8C8;">暂无可领取的优惠券</div>
              </div>
            </div>
            <div>
              <span v-if="list1.length > 0">已领取优惠券</span>
              <coupon class="coupon" v-for="(item, index) in list1" :key="index" :status="5" :coupon="item" v-if="list1.length > 0"></coupon>
              <div style="text-align:center;margin-top:20px;" v-if="list1.length === 0">
                <img class="null-coupon" src="../../assets/images/nullCoupon.png" alt="">
                <div style="color:#C8C8C8;">您还没有未使用的优惠券</div>
              </div>
            </div>
          </div>
        </scroller>
      </popup>
    </div>
  </div>
</template>
<script type="text/ecmascript-es6">
  import { TransferDom, Popup, Scroller } from 'vux'
  import * as mkApi from '@/services/API/marketing.es6'
  import coupon from './coupon.vue'
  export default {
    name: 'pdCoupons',
    directives: { TransferDom },
    components: { TransferDom, Popup, Scroller, coupon },
    props: {
      value: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      couponList: {
        default: function () {
          return []
        },
        type: Array
      }
    },
    data () {
      return {
        list0: [],
        list1: [],
        popupStyle: {
          'background-color': '#fff'
          // 'position': 'relative'
        }
      }
    },
    methods: {
      close () {
        this.$emit('input', false)
      },
      // 领取优惠券事件
      receiveCoupon (coupon) {
        console.log('coupon', this.list0)
        this.$http.get(mkApi.receiveCoupon(coupon.id, coupon.code))
          .then(res => {
            console.log(res)
          })
      },
    },
    computed: {
      // 弹窗状态改变
      flag: {
        get () {
          return this.value
        },
        set (flag) {
          this.$emit('input', flag)
        }
      }
    },
    watch: {
      couponList () {
        // 优惠券分类
        console.log(this.couponList)
        for (let i of this.couponList) {
          if (i.mstatus === 0) {
            this.list0.push(i)
          } else if (i.mstatus === 1) {
            i.mstatus = 4
            this.list1.push(i)
          }
        }
      }
    }
  }
</script>
<style rel="sctylesheet/scss" lang="scss" scoped>
.title {
  text-align: center;
  color: #a3a3a3;
  margin: 20px;
}
.null-coupon {
  width: 60%;
}
.scroller-wrapper {
  padding: 10px;
}
.coupon {
  margin: 10px 0px 10px 0px;
}
</style>
