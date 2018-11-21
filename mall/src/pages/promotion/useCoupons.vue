<template>
  <div id="useCoupons">
    <x-header title="领券" :left-options="{backText: '', preventGoBack: true}" @on-click-back="back"></x-header>
    <tab v-model="status">
      <tab-item @on-item-click="init()">可使用优惠券</tab-item>
      <tab-item @on-item-click="init()">不可用优惠券</tab-item>
    </tab>
    <scroller ref="scroller" lock-x height="-90">
      <div>
        <div v-for="(couponInfo, index2) in couponUseProductInfos" :key="index2">
          <div class="coupon-wrapper">
            <check-icon class="coupon-check" :value.sync="checkObj[couponInfo.code]" type="plain"></check-icon>
            <div v-if="couponInfo.zhihui === 4" class="coupon-check check-mask"></div>
            <coupon
              :status="couponInfo.zhihui"
              class="coupon-margin"
              :coupon="couponInfo"
              check></coupon>
          </div>
        </div>
        <div style="height:10px"></div>
      </div>
    </scroller>
  </div>
</template>
<script type="text/ecmascript-es6">
  import { XHeader, Scroller, Tab, TabItem, CheckIcon } from 'vux'
  import * as mAPI from '@/services/API/marketing.es6'
  import coupon from './coupon.vue'
  export default {
    name: 'useCoupons',
    components: Object.assign({ XHeader, Scroller, Tab, TabItem, CheckIcon }, { coupon }),
    props: {
      value: Boolean,
      merchants: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        status: 0,
        couponUseProductInfos: [],
        checkObj: {}, // {id:Boolean}
        couponProductNoUseInfo: [],
        noUseObj: {},
        couponProductUseInfo: [],
        useObj: {},
        selected: [], // 已选优惠券。有点击顺序
        calbest: false
      }
    },
    methods: {
      init () {
        console.log('couponUseProductInfos', this.couponUseProductInfos)
        if (this.status === 0) {
          let useObj = {}
          for (let i in this.useObj) {
            useObj[i] = false
          }
          this.checkObj = useObj
          this.couponUseProductInfos = this.couponProductUseInfo
        } else if (this.status === 1) {
          let noUseObj = {}
          for (let i in this.noUseObj) {
            noUseObj[i] = false
          }
          this.checkObj = noUseObj
          this.couponUseProductInfos = this.couponProductNoUseInfo
        }
        this.$refs.scroller.reset({top: 0})
      },
      getCouponOrderInfo (ids) {
        this.$http.post(...mAPI.getCouponOrderInfo(ids)).then(res => {
          if (res.data.code === 200) {
            console.log('couponUseProductInfos', res.data.couponUseProductInfos)
            this.handleRes(res.data.couponUseProductInfos)
          }
        })
      },
      handleRes (couponUseProductInfos) {
        let noUseObj = {}
        let useObj = {}
        let couponProductNoUseInfo = []
        let couponProductUseInfo = []
        for (let i of couponUseProductInfos) {
          for (let j of i.couponProductNoUseInfo || []) {
            if (noUseObj[j.code]) {
              noUseObj[j.code].productIds.push(i.productId)
            } else {
              noUseObj[j.code] = Object.assign(j, {productIds: [i.productId], zhihui: 4})
              this.noUseObj[j.code] = false
            }
          }
          for (let j of i.couponProductUseInfo || []) {
            if (useObj[j.code]) {
              useObj[j.code].productIds.push(i.productId)
            } else {
              useObj[j.code] = Object.assign(j, {productIds: [i.productId], zhihui: 1})
              this.useObj[j.code] = false
            }
          }
        }
        for (let i in noUseObj) {
          couponProductNoUseInfo.push(noUseObj[i])
        }
        for (let i in useObj) {
          couponProductUseInfo.push(useObj[i])
        }
        this.couponProductUseInfo = couponProductUseInfo
        this.couponProductNoUseInfo = couponProductNoUseInfo
        this.init()
        this.calcCoupon()
      },
      changeSelected (newCheck, oldCheck) {
        // 一开始就调用一次calcCoupon，不满足条件的已置灰无法勾选
        // 当某一张优惠券勾选状态改变时触发
        // 每次勾选优惠券，都会重新计算置灰，所以能够选到的都是可用的
        this.$vux.loading.show()
        console.log('changeSelected run')
        // this.selected = []
        // 判断触发watch的改变，是否是tab切换导致的
        if (newCheck.replace(/['true' | 'false']/g, '') !== oldCheck.replace(/['true' | 'false']/g, '')) {
          if (this.calbest) {
            this.init()
            this.calcCoupon()
            this.selected = []
          }
          this.$vux.loading.hide()
          return
        }
        let news = JSON.parse(newCheck)
        let olds = JSON.parse(oldCheck)
        let selected = JSON.parse(JSON.stringify(this.selected))
        for (let i in olds) {
          for (let j in news) {
            if (i === j && olds[i] !== news[j]) {
              if (news[j]) {
                selected.push(j)
              } else {
                for (let k in selected) {
                  if (selected[k] === j) {
                    selected.splice(k, 1)
                  }
                }
              }
            }
          }
        }
        this.selected = selected
        this.calcCoupon(selected)
      },
      calcCoupon (selectedCodes) { // 计算要置灰优惠券
        console.log('calcCoupon run')
        let selectedCode = selectedCodes || []
        let selected = [] // 已选优惠券对象,已选的都是可用的
        for (let i of selectedCode) {
          for (let j of this.couponProductUseInfo || []) {
            if (i === j.code) {
              selected.push(j)
              // if (j.isOverlay === 1) {
              //   useCoupons++
              // }
            }
          }
        }
        let overlayCode = '' // 已选种类的优惠券
        if (selected.length > 0) {
          overlayCode = selected[0].id
        }
        let merchants = JSON.parse(JSON.stringify(this.merchants))
        // 平摊促销的价格
        for (let i in merchants) {
          for (let j in merchants[i].promotionItems) {
            for (let k in merchants[i].promotionItems[j].productItems) {
              merchants[i].promotionItems[j].productItems[k].sum  = merchants[i].promotionItems[j].productItems[k].sum - merchants[i].promotionItems[j].productItems[k].proDiscount
            }
          }
        }
        // 平摊已选优惠券的价格
        for (let i of selected) {
          for (let j in merchants) {
            for (let k in merchants[j].promotionItems) {
              for (let l in merchants[j].promotionItems[k].productItems) {
                if (i.productIds.indexOf(merchants[j].promotionItems[k].productItems[l].id) !== -1) {
                  merchants[j].promotionItems[k].productItems[l].sum = merchants[j].promotionItems[k].productItems[l].sum - i.subtract / i.productIds.length
                }
              }
            }
          }
        }
        // 置灰
        let zhihui = []
        for (let i of this.couponProductUseInfo) {
          if (i.id !== overlayCode && overlayCode !== '') { // 非同种优惠券
            zhihui.push(i.code)
          } else if (i.isOverlay === 1 && selectedCode.indexOf(i.code) === -1 && selectedCode.length !== 0) { // 同种，未选，不可叠加
            zhihui.push(i.code)
          } else if (i.isOverlay === 2 && selectedCode.indexOf(i.code) === -1) { // 同种，未选，可叠加
            if (i.rules === 1) { // 满减
              let sum = 0
              for (let j of merchants) {
                for (let k of j.promotionItems) {
                  for (let l of k.productItems) {
                    if (i.productIds.indexOf(l.id) !== -1) {
                      sum += parseFloat(l.sum)
                    }
                  }
                }
              }
              if (i.fullSubtract > sum) {
                zhihui.push(i.code)
              }
            } else {

            }
          }
        }
        this.zhihuiFun(zhihui)
        this.$vux.loading.hide()
      },
      zhihuiFun (codes) { // 置灰优惠券
        console.log('zhihuiFun run')
        this.bestCoupons()
        for (let i in this.couponProductUseInfo) {
          if (codes.indexOf(this.couponProductUseInfo[i].code) !== -1) {
            this.couponProductUseInfo[i].zhihui = 4
          } else {
            this.couponProductUseInfo[i].zhihui = 1
          }
        }
      },
      bestCoupons () {
        if (this.calbest) {
          return
        }
        this.calbest = true // 来过一次不再计算最优
        let youhui = 0
        let bestCou = ''
        for (let i of this.couponProductUseInfo) {
          if (i.subtract > youhui) {
            bestCou = i
            youhui = bestCou.subtract
          }
        }
        // 目的是返回最佳数组
        let bestCouArray = []
        if (bestCou) {
          bestCouArray.push(bestCou)
          this.selected.push(bestCou.code)
          this.checkObj[bestCou.code] = true
          this.useObj[bestCou.code] = true
        }
        this.$emit('selected', bestCouArray)
      },
      back () {
        if (this.status === 0) {
          let selected = []
          for (let i in this.checkObj) {
            for (let j = 0; j<this.couponProductUseInfo.length; j++) {
              if (i === this.couponProductUseInfo[j].code && this.checkObj[i]) {
                selected.push(this.couponProductUseInfo[j])
              }
            }
          }
          this.$emit('selected', selected)
        }
        this.$emit('input', false)
      }
    },
    mounted: function () {},
    computed: {
      checkObjStr () {
        return JSON.stringify(this.checkObj)
      }
    },
    watch: {
      checkObjStr (newValue, oldValue) {
        if (oldValue.length<3) {
          this.changeSelected(newValue, newValue)
        } else {
          if (newValue !== oldValue ) {
            this.changeSelected(newValue, oldValue)
          }
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.coupon-margin {
  margin: 10px;
}
.coupon-wrapper {
  position: relative;
}
.coupon-check {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.check-mask {
  width: 33px;
  height: 27px;
  z-index: 3;
}
</style>
