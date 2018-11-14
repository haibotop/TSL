<template>
  <div id="sendCoupons">
    <div v-transfer-dom>
      <popup v-model="show" position="top" class="sendCoupons" :hide-on-blur="false">
        <p>谢瑞麟送您一张优惠券</p>
        <!-- <div class="top-mask"></div> -->
        <Scroller lock-x ref="scroller" height="400px" class="my-list" :bounce="false">
          <div>
            <coupon v-for="(item, index) in list" :key="index" :coupon="item" :status="status[index]" @eventCoupon="eventCoupon" class="coupon-margin"></coupon>
            <div v-show="list.length < 4" class="close" @click="close"><x-icon type="ios-close-outline" fill="#fff" size="30" style="margin-bottom:-10px;"></x-icon><span>关闭</span></div>
            <div style="height:10px;"></div>
          </div>
        </Scroller>
        <div v-show="list.length > 3" class="more-mask"></div>
        <div v-show="list.length > 3" class="close" @click="close"><x-icon type="ios-close-outline" fill="#fff" size="30" style="margin-bottom:-10px;"></x-icon><span>关闭</span></div>
      </popup>
    </div>
  </div>
</template>
<script type="text/ecmascript-es6">
  import { TransferDom, Popup, Scroller } from 'vux'
  import coupon from './coupon.vue'
  import * as mkApi from '@/services/API/marketing.es6'
  export default {
    name: 'sendCoupons',
    directives: { TransferDom },
    components: Object.assign({ TransferDom, Popup, Scroller }, { coupon }),
    data () {
      return {
        show: false,
        status: [],
        list: []
      }
    },
    // props: {
    //   value: {
    //     default: true,
    //     type: Boolean
    //   },
    //   list: {
    //     default: function () {
    //       return [{}, {}, {}]
    //     },
    //     type: Array
    //   }
    // },
    methods: {
      close () {
        this.show = false
      },
      getMyCoupon (status, pageNum, pageSize) {
        this.$http.post(mkApi.getMyCoupon(status, pageNum, pageSize)).then(res => {
          if (res.data.code === 200) {
            if (res.data.pageInfo) {
              if (res.data.pageInfo.list.length > 0) {
                this.status = []
                res.data.pageInfo.list.forEach(element => {
                  this.status.push(0)
                })
                this.list = res.data.pageInfo.list
                this.show = true
                // sessionStorage.setItem('sendCoupons', 1)
              }
            }
          }
        })
      },
      eventCoupon (coupon) {
        for (let i in this.list) {
          if (this.list[i].code === coupon.code) {
            if (this.status[i] === 0) {
              console.log(coupon.id)
              this.getCoupon(coupon.id, coupon.code, i)
              return
            }
             else {
              this.$router.push({path: '/couponPl', query: {'couponId': coupon.id}})
              return
            }
          }
        }
        if (this.list.length === 0) {
          this.show = false
        }
      },
      getCoupon (id, code, index) {
        this.$http.get(mkApi.receiveCoupon(id, code)).then(res => {
          if (res.data.code === 200) {
            this.$set(this.status, index, 1)
            this.$vux.toast.show({text: '领取成功', type: 'text', width: '200px'})
          }
        })
      }
    },
    mounted: function () {
      if (sessionStorage.getItem('userInfo')) {
        if (!sessionStorage.getItem('sendCoupons')) {
          this.getMyCoupon(0, 1, 99)
        }
      }
    }
    // computed: {
    //   show: {
    //     get () {
    //       return this.value
    //     },
    //     set (value) {
    //       this.$emit('input', value)
    //     }
    //   }
    // }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.coupon-margin {
  margin: 10px;
}
.sendCoupons.vux-popup-dialog.vux-popup-top {
  top: 20%;
  background: transparent;
  p {
    text-align: center;
    color: #fff;
  }
}
.my-list {
  position: relative;
}
.top-mask {
  position: absolute;
  top: 23px;
  left: 0px;
  width: 100%;
  height: 10px;
  background: linear-gradient(top, rgba($color: #777777, $alpha: 1), transparent);
  z-index: 10;
}
.more-mask {
  position: absolute;
  top: 405px;
  left: 0px;
  height: 40px;
  width: 100%;
  background: linear-gradient(bottom, rgba($color: #777777, $alpha: 0.8), transparent);
}
.close {
  margin: 10px 0px 0px 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #fff;
  height: 30px;
}
</style>
