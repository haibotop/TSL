<template>
  <div id="coupon" :style="check ? 'margin-left:40px' : ''">
    <div class="coupon" :style="couponPadding">
      <div class="left-part">
        <p class="amount" :style="amountSize"><i>{{coupon.subtract / 100}}</i>元</p>
        <span class="condition" v-show="coupon.rules === 2">直减</span>
        <span class="condition" v-show="coupon.rules === 1">满<i>{{coupon.fullSubtract / 100}}</i>元使用</span>
      </div>
      <div class="seat" v-show="status === 2"></div>
      <div class="right-part" :style="check ? 'width:calc(100% - 151px)' : ''">
        <p class="name">{{coupon.name}}</p>
        <p class="date date-title">有效期：</p>
        <p class="date">{{(coupon.startDate || '').split(' ')[0]}}至{{(coupon.endDate || '').split(' ')[0]}}</p>
        <button v-show="status === 0 && !check" @click="receiveCoupon(coupon)">立即领取</button>
        <!-- <a href="javascript:void(0)">查看说明<x-icon type="ios-arrow-down" fill="#ccc" style="font-size:14px;margin-bottom:-6px;"></x-icon></a> -->
        <button v-show="status === 1 && !check" @click="receiveCoupon(coupon)">去使用</button>
        <div v-show="status === 2" class="label">已使用</div>
        <div v-show="status === 3 || status === 4" class="mask"></div>
        <div v-show="status === 3" class="label">已失效</div>
        <div v-show="status === 4" class="label">不可用</div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-es6">
  export default {
    props: {
      coupon: {
        default: function () {
          return {}
        },
        type: Object
      },
      status: {
        type: Number
      },
      check: {
        default: function () {
          return false
        },
        type: Boolean
      },
    },
    data () {
      return {
        // status: 0, // 0未领取 1未使用 2已使用 3已失效
      }
    },
    methods: {
      // 获取优惠券列表,点击领取
      receiveCoupon (coupon) {
        console.log('coupon', coupon)
        this.$emit('eventCoupon', coupon)
      }
    },
    computed: {
      amountSize () {
        if (this.amount > 9999) {
          return 'font-size: 23px;'
        } else if (this.amount > 999) {
          return 'font-size: 27px;'
        } else {
          return ''
        }
      },
      couponPadding () {
        if (this.status === 2) {
          return 'padding: 0px'
        } else {
          return this.check ? 'width:100%' : 'padding: 0px 5px;'
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.coupon {
  width: 100%;
  overflow: hidden;
  position: relative;
  // background-color: #fff;
}
.check-part {
  float: left;
  width: 30px;
  height: 110px;
}
.left-part {
  float: left;
  width: 100px;
  height: 90px;
  position: relative;
  top: 1px;
  padding: 9px 5px;
  text-align: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #fff;
  color: $tsl-color;
  font-family: "Times New Roman", SimSun;
  box-shadow: 0px 0px 5px #aaa;
  .amount {
    font-size: 28px;
    font-weight: 400;
  }
  .condition {
    font-weight: 400;
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  .mask {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: rgba($color: #ccc, $alpha: 0.5);
  }
}
.seat {
  width: 10px;
  height: 90px;
  float: left;
}
.right-part:before {
  content: '';
  display: block;
  position: absolute;
  top: 10px;
  left: 0px;
  height: calc(100% - 20px);
  border-left: 2px dashed #fff;
  // background: #fff;
}
.right-part {
  float: left;
  padding: 10px 20px;
  width: calc(100% - 161px);
  height: 90px;
  position: relative;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background: linear-gradient(left, #4F3D86, #65428E, #7D4896);
  color: #fff;
  overflow: hidden;
  .name {
    font-size: 16px;
    letter-spacing: 1px;
    line-height: 18px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .date.date-title {
    // position: absolute;
    // top: 40%;
  }
  .date {
    line-height: 12px;
    // position: absolute;
    // left: 20px;
    // top: 56%;
    // transform: translateY(-55%);
    letter-spacing: 1px;
    font-size: 12px;
  }
  button {
    position: absolute;
    bottom: 10px;
    left: 20px;
    width: 70px;
    height: 26px;
    line-height: 22px;
    background-color: transparent;
    border: 1px solid #fff;
    color: #fff;
    border-radius: 4px;
    font-size: 14px;
    letter-spacing: 1px;
  }
  .mask {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: rgba($color: #ccc, $alpha: 0.5);
    z-index: 9;
  }
  a {
    color: #ccc;
    font-size: 14px;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  .label {
    position: absolute;
    right: -20px;
    bottom: 10px;
    transform: rotateZ(-45deg);
    background-color: #fff;
    color: $tsl-color;
    font-size: 14px;
    width: 80px;
    text-align: center;
    line-height: 20px;
    z-index: 10;
  }
}
</style>

