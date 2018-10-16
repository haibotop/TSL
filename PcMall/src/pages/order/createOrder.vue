<template>
  <div id="createOrder">
    <x-header v-show="!couponFlag" :left-options="{backText: ''}" title="填写订单"></x-header>
    <scroller v-show="!couponFlag" lock-x height="-96" ref="scroller">
      <div :style="`min-height:${scrollerHeight}px;`">
        <group v-if="address">
          <cell-box is-link link="/addressList">
            <div v-if="address.id" class="address">
              <div class="address-bar1"><span class="receiverName">{{address.receiverName}}</span><span class="receiverMobile">{{address.receiverMobile}}</span></div>
              <div class="address-bar2"><x-icon type="ios-location-outline" size="15" style="position:absolute;left:10px;"></x-icon><p>{{address.receiverAddress}}</p></div>
            </div>
            <div v-else class="address">
              <div class="address-bar2"><x-icon type="ios-location-outline" size="15" style="position:absolute;left:10px;"></x-icon><p>请输入收货地址</p></div>
            </div>
          </cell-box>
        </group>

        <!-- <group v-for="(item, index) in tempOrders" :key="index">
          <cell-box v-for="(item2, index2) in item.SettlementProductItem" :key="index2">
            <div style="width: 100%;overfloat:hidden;">
              <div class="default-picture"><img :src="item2.product.defaultPicture" :alt="item2.product.name"></div>
              <div class="text-info">
                <p>{{handleName(item2.product.name)}}</p>
                <span class="price">￥{{ handlePrice(item2.product.price) }}</span>
                <span class="quantity">×{{item2.quantity}}</span>
              </div>
            </div>
          </cell-box>
          <cell title="运费" value="免运费"></cell>
          <cell-box>
            <div class="account">
              <span>共计{{calcQuantity(item.SettlementProductItem)}}件商品</span>
              <span>合计:<span class="price">￥{{handlePrice(item.amount)}}</span></span>
            </div>
          </cell-box>
        </group> -->
        <group v-for="(merchant, index) in merchants" :key="index">
          <div v-for="(promotion, index2) in merchant.promotionItems" :key="index2">
            <div class="promotion-info">
              <div>
                <span v-if="promotion.type === 1" v-for="(item, index) in promotion.pdsArray" :key="index">满{{item.fullLimit / 100}}减{{item.subtract / 100}}</span>
                <span v-if="promotion.type === 2" v-for="(item, index) in promotion.pdsArray" :key="index">满{{item.fullLimit / 100}}折{{item.discount / 10}}</span>
                <span v-if="promotion.type === 3">打{{promotion.discount / 10}}折</span>
                <span v-if="promotion.type === 4">直降{{promotion.directAmount / 100}}元</span>
              </div>
            </div>
            <cell-box v-for="(product, index3) in promotion.productItems" :key="index3">
              <div style="width: 100%;overfloat:hidden;">
                <div class="default-picture"><img :src="product.defaultPicture" :alt="product.name"></div>
                <div class="text-info">
                  <p>{{handleName(product.name)}}</p>
                  <span class="price">￥{{ handlePrice(product.price) }}</span>
                  <span class="quantity">×{{product.quantity}}</span>
                </div>
              </div>
            </cell-box>
          </div>
          <cell title="运费" value="免运费"></cell>
          <cell>
            <div class="account">
              <span class="discount">促销优惠：<span class="price">￥ -{{calcDiscountedPrice}}</span></span>
            </div>
          </cell>
          <cell-box>
            <div class="account">
              <span>共计{{calcQuantity2(merchant)}}件商品</span>
              <span>合计:<span class="price">￥{{merchant.afterPromotion}}</span></span>
            </div>
          </cell-box>
        </group>
        <group v-if="merchants.length > 0">
          <cell-box is-link class="coupon" title="优惠券" @click.native="openCoupon">
            <div class="account" >
              <span class="title">
                <span class="dis-coupon">优惠券</span>
                <span class="discount" v-for="item in selected" :key="item.code">{{item.rules === 1 ? `满${item.fullSubtract / 100}减${item.subtract / 100}` : `直减${item.subtract / 100}`}}</span>
              </span>
            </div>
          </cell-box>
        </group>
        <group v-if="merchants.length > 0">
          <cell-box>
            <div class="account" >
              <span class="title">商品总价</span>
              <span><span class="price">￥{{afterPromotion}}</span></span>
            </div>
          </cell-box>
          <cell-box>
            <div class="account" >
              <span class="title">优惠券：</span>
              <span><span class="price">￥ {{handlePrice(couponsValue) * -1}}</span></span>
            </div>
          </cell-box>
        </group>
        <!-- <pdCoupons v-model="couponFlag"></pdCoupons> -->
        <group v-if="merchants.length > 0">
          <x-textarea v-model="memberRemark" :max="50" @on-focus="onTheSoftKeyboard" @on-blur="killTheSoftKeyboard">
            <div slot="label">备注：</div>
          </x-textarea>
        </group>
        <div style="height:20px"></div>
      </div>
    </scroller>
    <div v-show="!couponFlag" class="sub-bar">
      <div class="amount">合计:<span class="price">￥{{calcAmount}}</span></div>
      <div id="percreateorder" v-show="orderAble" class="order-btn" @click="order">下单</div>
      <div v-show="!orderAble" class="order-btn-disable">下单</div>
    </div>
    <cashier v-model="cashierFlag" :price="payAmount" :orderNum="orderNum"></cashier>
    <useCoupons v-show="couponFlag" v-model="couponFlag" ref="useCoupons" :merchants="merchants" @selected="getSelected"></useCoupons>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as tool from '@/services/myTool.es6'
  import * as orderAPI from '@/services/API/orderServices.es6'
  import cashier from '@/components/cashier.vue'
  import { XHeader, Group, Cell, CellBox, XTextarea, Scroller, debounce } from 'vux'
  import useCoupons from '@/pages/promotion/useCoupons.vue'
  export default {
    name: 'createOrder',
    components: { cashier, XHeader, Group, Cell, CellBox, XTextarea, Scroller, debounce, useCoupons },
    data () {
      return {
        scrollerHeight: 0,
        params: [],
        address: '',
        tempOrders: [],
        merchants: [], // 商家-》促销-》商品
        cashierFlag: false,
        couponFlag: false,
        orderNum: '',
        orderAble: true,
        memberRemark: '',
        selected: [], // 已选优惠券
        sum: 0
      }
    },
    mounted: function () {
      if (sessionStorage.getItem('memberRemark')) {
        this.memberRemark = sessionStorage.getItem('memberRemark')
      }
      this.scrollerHeight = document.body.clientHeight - 66
      tool.preCartToCart(this, () => {
        this.getSettlementDate()
      })
    },
    methods: {
      getSettlementDate () {
        if (sessionStorage.getItem('settlementProductItems')) {
          this.params = JSON.parse(sessionStorage.getItem('settlementProductItems'))
          this.statements()
        } else {
          this.orderAble = false
          setTimeout(() => {
            this.$vux.alert.show({
              title: '提示',
              content: '您未选择商品或所选商品已下单',
              onShow: () => {},
              onHide: () => {
                this.$router.replace({path: '/myOrders/0'})
              }
            })
          }, 500)
        }
      },
      statements () {
        this.$http.post(...orderAPI.getSettleMent(this.params)).then((response) => {
          if (response.data.code === 200) {
            // this.renderData(response.data.TempOrder)
            this.renderData2(response.data.TempOrder)
          } else {
            this.orderAble = false
          }
        }).catch(() => {
          this.orderAble = false
        })
      },
      renderData2 (tempOrder) {
        if (this.$store.state.address.id) {
          this.address = this.$store.state.address
        } else {
          this.address = tempOrder[0].address
          if (this.address) {
            this.$store.commit('setAddress', this.address)
          } else {
            this.address = this.$store.state.address
          }
        }
        let merchants = []
        // 重整结构
        for (let i of tempOrder) {
          let afterPromotionBack = 0
          for (let j of i.SettlementProductItem) {
            afterPromotionBack += j.sum - j.proDiscount
          }
          let merchantInfo = {
            amount: i.amount,
            address: i.address,
            afterPromotion: afterPromotionBack,
            promotionItems: []
          }
          let qobj = {}
          let esistNumId = false
          for (let j of i.SettlementProductItem) {
            if (j.promotionItem.id) {
              if (qobj[j.promotionItem.id]) {
                for (let k in merchantInfo.promotionItems) {
                  if (merchantInfo.promotionItems[k].id === j.promotionItem.id) {
                    merchantInfo.promotionItems[k].productItems.push(
                      Object.assign(j.product, {quantity: j.quantity, sum: j.sum, specValues: j.specValues, proDiscount: j.proDiscount})
                    )
                  }
                }
              } else {
                merchantInfo.promotionItems.push(Object.assign(j.promotionItem, {productItems: [
                  Object.assign(j.product, {quantity: j.quantity, sum: j.sum, specValues: j.specValues, proDiscount: j.proDiscount})
                ]}))
                qobj[j.promotionItem.id] = 1
              }
            } else if (esistNumId) {
              for (let k in merchantInfo.promotionItems) {
                if (merchantInfo.promotionItems[k].id === null) {
                  merchantInfo.promotionItems[k].productItems.push(
                    Object.assign(j.product, {quantity: j.quantity, sum: j.sum, specValues: j.specValues, proDiscount: j.proDiscount})
                  )
                }
              }
            } else {
              merchantInfo.promotionItems.push(Object.assign(j.promotionItem, {productItems: [
                Object.assign(j.product, {quantity: j.quantity, sum: j.sum, specValues: j.specValues, proDiscount: j.proDiscount})
              ]}))
              esistNumId = true
            }
          }
          merchants.push(merchantInfo)
        }
        // 计算促销优惠
        for (let [i, index] of new Map(merchants.map((i, index) => [i, index]))) {
          let amount = 0 // 商家级别总价
          let afterPromotion = 0 // 商家级别促销后总价
          for (let j of i.promotionItems) {
            let amount1 = 0 // 促销级别总价
            let afterPromotion1 = 0 // 促销级别促销后总价
            for (let k of j.productItems) { // 促销级别总价赋值
              amount1 += parseFloat(k.price) * parseFloat(k.quantity)
            }
            afterPromotion1 = amount1 // 促销级别促销后总价赋值
            if (j.id) {
              if (j.type === 1) { // 满减
                let largest = 0
                let indexLs = 0
                for (let index = 0; index < j.pdsArray.length; index++) {
                  if (afterPromotion1 >= j.pdsArray[index].fullLimit && j.pdsArray[index].fullLimit > largest) {
                    largest = j.pdsArray[index].fullLimit
                    indexLs = index
                  }
                }
                afterPromotion1 = afterPromotion1 - j.pdsArray[indexLs].subtract
                afterPromotion1 = tool.handlePrice(afterPromotion1)
              } else if (j.type === 2) { // 满折
                let largest = 0
                let indexLs = 0
                for (let index = 0; index < j.pdsArray.length; index++) {
                  if (afterPromotion1 >= j.pdsArray[index].fullLimit && j.pdsArray[index].fullLimit > largest) {
                    largest = j.pdsArray[index].fullLimit
                    indexLs = index
                  }
                }
                afterPromotion1 = afterPromotion1 * j.pdsArray[indexLs].discount * 0.01
                afterPromotion1 = tool.handlePrice(afterPromotion1)
              } else if (j.type === 3) { // 单品折扣
//                afterPromotion1 = afterPromotion1 * j.discount * 0.01
                afterPromotion1 = parseInt(afterPromotion1 * j.discount * 0.01) + afterPromotion1 % 100
                if (j.typeAlone === 1) { // 元级取整
                  console.log('typeAlone=2')
                  afterPromotion1 = tool.handlePrice(afterPromotion1)
                  afterPromotion1 = parseInt(afterPromotion1)
                } else if (j.typeAlone === 2) {
                  console.log('typeAlone=2')
                  afterPromotion1 = tool.handlePrice(afterPromotion1)
                  afterPromotion1 = parseFloat(afterPromotion1).toFixed(1)
                }
              } else if (j.type === 4) { // 直降
                afterPromotion1 = afterPromotion1 - j.directAmount
                afterPromotion1 = tool.handlePrice(afterPromotion1)
              }
            } else {
              afterPromotion1 = tool.handlePrice(afterPromotion1)
            }
            amount += amount1
            afterPromotion += +afterPromotion1
          }
          merchants[index].amount = amount
          merchants[index].afterPromotion = afterPromotion
        }
        this.merchants = merchants
        this.getCouponOrderInfo()
      },
      getCouponOrderInfo () {
        let ids = []
        for (let i of this.merchants) {
          for (let j of i.promotionItems) {
            for (let k of j.productItems) {
              ids.push(k.id)
            }
          }
        }
        // console.log('ids', ids)
        if (ids.length > 0) {
          this.$refs.useCoupons.getCouponOrderInfo(ids)
        }
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      handleName (name) {
        return tool.handleName(name)
      },
      // ---------------------------------  弹起优惠券窗口
      openCoupon () {
        this.couponFlag = true
        setTimeout(() => {
          this.$refs.useCoupons.$refs.scroller.reset()
        }, 100)
      },
      // 在结算页根据商品获取优惠券的接口
      getCoupon () {
        return 0
      },
      calcQuantity (data) {
        let quantity = 0
        for (let i of data) {
          quantity += i.quantity
        }
        return quantity
      },
      calcQuantity2 (merchant) {
        let quantity = 0
        for (let i of merchant.promotionItems) {
          for (let j of i.productItems) {
            quantity += j.quantity
          }
        }
        return quantity
      },
      order: debounce(function () {
        if (!this.address.id) {
          this.$vux.toast.show({type: 'text', text: '请选择收货地址', width: '200px'})
          return
        }
        sessionStorage.removeItem('memberRemark')
        let params = {
          addressId: this.address.id,
          remark: this.memberRemark,
          couponList: []
        }
        for (let i of this.selected) {
          params.couponList.push({
            couponId: i.id,
            code: i.code
          })
        }
        this.$http.patch(...orderAPI.order(params)).then(res => {
          if (res.data.code === 200) {
            this.$vux.toast.show({type: 'text', text: '下单成功', width: '200px'})
            this.goPay(res.data.orderItems[0])
            sessionStorage.removeItem('settlementProductItems')
          } else if (res.data.code === 2016) {
            this.$vux.alert.show({
              content: `商品不可用`,
              onHide: () => {
                this.$router.go(-1)
              }
            })
          } else if (res.data.code === 2008) {
            this.$vux.alert.show({
              content: `库存不足`,
              onHide: () => {
                this.$router.go(-1)
              }
            })
          } else if (res.data.code === 404) {
            this.$vux.alert.show({
              content: res.data.message,
              onHide: function () {
                this.$router.go(-1)
              }
            })
          }
          this.orderAble = false
        })
      }, 500),
      getSelected (selected) {
        console.log('selected', selected)
        this.selected = selected
      },
      // ----------去付款
      goPay (order) {
        console.log(order, 'gopay')
        this.orderNum = order.number
        this.cashierFlag = true
      },
      // ----------踩上软键盘
      onTheSoftKeyboard () {
        if (tool.isIOS()) {
          return
        }
        let h = document.body.clientHeight
        setTimeout(() => {
          this.scrollerHeight = h / 2 * 3
          this.$refs.scroller.reset({top: h / 2})
        }, 500)
      },
      // ----------收起软键盘
      killTheSoftKeyboard () {
        setTimeout(() => {
          this.scrollerHeight = document.body.clientHeight - 66
          this.$refs.scroller.reset({top: 0})
        }, 500)
      }
    },
    computed: {
      couponsValue () {
        let sum = 0
        for (let i of this.selected) {
          sum += i.subtract
        }
        return sum
      },
      afterPromotion () {
        let afterPromotion = 0
        for (let i of this.merchants) {
          afterPromotion = +i.afterPromotion + afterPromotion
        }
        return afterPromotion
      },
      calcAmount () {
        let couponsValue = tool.handlePrice(this.couponsValue)
        return (this.afterPromotion - couponsValue).toFixed(2)
      },
      payAmount () {
        let couponsValue = tool.handlePrice(this.couponsValue)
        let payPrice = (this.afterPromotion - couponsValue).toFixed(2) * 100
        return payPrice
      },
      calcDiscountedPrice () {
        let amount = 0
        for (let i of this.merchants) {
          amount = +i.amount + amount
        }
        let discountPrice = tool.handlePrice(amount) - this.afterPromotion
        console.log(discountPrice)
        return discountPrice.toFixed(2)
      }
    },
    beforeRouteLeave: function (to, from, next) {
      if (to.path !== '/addressList' && to.path !== '/signin') {
        this.$store.commit('clearAddress')
        sessionStorage.removeItem('settlementProductItems')
        sessionStorage.removeItem('memberRemark')
      } else {
        if (this.memberRemark) {
          sessionStorage.setItem('memberRemark', this.memberRemark)
        }
      }
      next()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.address {
  width: calc(100% - 10px);
  .address-bar1 {
    overflow: hidden;
    font-size: 14px;
    .receiverName {
      float: left;
    }
    .receiverMobile {
      float: right;
    }
  }
  .address-bar2 {
    padding: 10px 0px 10px 15px;
    p {
      font-size: 12px;
      color: #7f7f7f;
    }
  }
}
.discount{
  color:#000;
}
.promotion-info {
  min-height: 25px;
  padding-bottom: 5px;
  overflow: hidden;
  background-color: #FFF4E8;
  div {
    width: calc(100% - 50px);
  }
  span {
    font-size: 8px;
    display: block;
    float: left;
    border: 1px solid #E4393C;
    color: #E4393C;
    border-radius: 6px;
    padding: 0px 5px;
    margin: 0 0 0 5px;
    transform: translateY(10px);
  }
  a {
    font-size: 12px;
    color: #E4393C;
    float: right;
    margin: 5px 10px 0 0;
  }
}
.default-picture {
  width: 88px;
  height: 88px;
  display: inline-block;
  vertical-align: middle;
  background: #eee;
  float: left;
  img {
    display: block;
    font-size: 14px;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
.text-info {
  float: left;
  padding-left: 10px;
  font-size: 14px;
  position: relative;
  width: calc(100% - 98px);
  height: 88px;
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .price {
    position: absolute;
    bottom: 0px;
    color: red;
  }
  .quantity {
    position: absolute;
    right: 0px;
    top: 50px;
  }
}
.coupon {
  background: #fff;
}
.account {
  width: 100%;
  text-align: right;
  font-size: 14px;
  .title {
    width: 100%;
    font-size: 17px;
    .dis-coupon {
      float: left;
    }
    .discount {
      margin-right: 20px;
      color: red;
      font-size: 12px;
      border: 1px solid red;
      border-radius: 3px;
      padding: 0 2px;
    }
  }
  .price {
    font-size: 16px;
    color: red;
  }
}
.sub-bar {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 50px;
  overflow: hidden;
  background-color: #fff;
  .amount {
    width: calc(100% - 110px);
    text-align: right;
    line-height: 50px;
    padding: 0px 10px 0px 0px;
    float: left;
    .price {
      color: red;
    }
  }
  .order-btn {
    width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    float: left;
    color: #fff;
    //background: $tsl-color;
  }
  .order-btn-disable {
    width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    float: left;
    color: #fff;
    background: #7f7f7f;
  }
}
</style>

