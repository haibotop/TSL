<template>
  <div id="myCoupons">
    <x-header title="领券" :left-options="{backText: ''}"></x-header>
    <tab v-model="status">
      <tab-item @on-item-click="init()" selected>未领取</tab-item>
      <tab-item @on-item-click="init()">未使用</tab-item>
      <tab-item @on-item-click="init()">已使用</tab-item>
      <tab-item @on-item-click="init()">已失效</tab-item>
    </tab>
    <div style="text-align:center;margin-top:20px;" v-if="Couponlist.length < 1">
      <img class="null-coupon" src="../../assets/images/nullCoupon.png" alt="">
      <div style="color:#C8C8C8;">{{statusTitle}}</div>
    </div>
    <scroller lock-x height="-91" :use-pullup="Couponlist.length > 4" :pullup-config="pullupDefaultConfig" @on-pullup-loading="addLoad" ref="scroller" v-if="Couponlist.length > 0">
      <div>
        <coupon v-for="(item, index) in Couponlist" :key="index" :status="status" class="coupon-margin" :coupon="item"  @eventCoupon="receiveCoupon"></coupon>
        <div style="height:10px"></div>
      </div>
    </scroller>
  </div>
</template>
<script type="text/ecmascript-es6">
  import { XHeader, Tab, TabItem, Scroller } from 'vux'
  import * as mkApi from '@/services/API/marketing.es6'
  import coupon from './coupon.vue'
  let interval
  export default {
    name: 'myCoupons',
    components: Object.assign({ XHeader, Tab, TabItem, Scroller }, { coupon }),
    data () {
      return {
        pageNum: 1,
        pageSize: 5,
        loading: false,
        Couponlist: [],
        status: 0, // 0未领取 1未使用 2已使用 3已失效
        pullupDefaultConfig: {
          content: '上拉刷新',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '释放后加载',
          upContent: '已到底端',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        }
      }
    },
    watch: {
      status (param) {
        this.pageNum = 1
        this.getMyCoupon(this.status, this.pageNum, this.pageSize)
      }
    },
    computed: {
      statusTitle () {
        let title = ['暂无未领取的优惠券', '您还没有未使用的优惠券', '您还没有已使用的优惠券', '您还没有已失效的优惠券']
        return title[this.status]
      }
    },
    methods: {
      init () {
        this.Couponlist = []
      },
      getMyCoupon (status, pageNum, pageSize, callback) {
        this.loading = true
        this.$http.post(mkApi.getMyCoupon(status, pageNum, pageSize))
          .then(res => {
            this.$vux.loading.hide()
            this.loading = false
            if (res.data.code === 200) {
              if (res.data.pageInfo) {
                this.Couponlist = this.Couponlist.concat(res.data.pageInfo.list)
                if (typeof (callback) === 'function' && res.data.pageInfo !== null) {
                  callback()
                }
              }
            }
            if (typeof callback === 'function') {
              callback(res)
            }
          })
      },
      receiveCoupon (coupon) {
        if (this.status === 0) { // 未领取状态事件为去领取该优惠券
          this.$http.get(mkApi.receiveCoupon(coupon.id, coupon.code))
            .then(res => {
              this.init()
              this.getMyCoupon(this.status, this.pageNum, this.pageSize)
            })
        } else if (this.status === 1) {  //已领取的优惠券去使用事件
          this.$router.push({path: '/couponPl', query: {'couponId': coupon.id}})
        }
      },
      addLoad () {
        this.pageNum = this.pageNum + 1
        this.getMyCoupon (this.status, this.pageNum, this.pageSize, () => {
          this.$refs.scroller.donePullup()
          this.$nextTick(() => {
            this.$refs.scroller.reset()
          })
        })
      }
    },
    beforeMount () {
      this.loading = true
      this.$vux.loading.show()
    },
    mounted () {
      this.getMyCoupon(this.status, this.pageNum, this.pageSize)
      interval = setInterval(() => {
        if (this.$refs.scroller) {
          this.$refs.scroller.reset()
          clearInterval(interval)
        }
      }, 0)
    } 
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.coupon-margin {
  margin: 10px 20px;
}
.null-coupon {
  width: 50%;
  margin: 40% 0 0;
}
</style>
