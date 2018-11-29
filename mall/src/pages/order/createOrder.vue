<style lang="scss">
  .memberBox{
    .weui-cells:after{
      border: none;
    }
  }
</style>
<template>
  <div id="createOrder">
    <x-header v-show="!couponFlag" :left-options="{backText: '',preventGoBack: true}" @on-click-back="goBack" title="填写订单" ></x-header>
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
                  <span class="quantity" ref="quantity">×{{product.quantity}}</span>
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
          <cell-box is-link class="coupon" title="折扣码" @click.native="showDiscountEvent">
            <div class="account" >
              <span class="title">
                <span class="dis-coupon">折扣码</span>
                <span class="discount" v-for="item in chooseDisItem" :key="item.code">
                  <span v-if="item.rule === 1">满{{item.minExpense/100}}减{{item.discountAmount/100}}</span>
                  <span v-if="item.rule === 2">直减{{item.discountAmount/100}}</span>
                  <span v-if="item.rule === 3">满{{item.discountcodePiecediscountList[0].min_quantity}}件打{{item.discountcodePiecediscountList[0].discountRatio/10}}折</span>
                </span>
              </span>
            </div>
          </cell-box>
        </group>
        <group v-if="merchants.length > 0" class="memberBox" @click.native="memberStatus = true">
          <cell-box title="员工编号">
            <div class="account" >
              <span class="title">
                <span class="dis-coupon">员工编号</span>
                <input type="text" class="memberNum" v-model="memberNumber" >
              </span>
            </div>
          </cell-box>
          <cell-box class="memberExplain" v-if="memberStatus">
            <span>尊敬的谢瑞麟会员，请输入为您服务的员工编号，感谢您对我们服务的支持！</span>
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
          </cell-box><cell-box>
            <div class="account" >
              <span class="title">折扣码优惠：</span>
              <span class="price">￥ {{(Number(disPrice.jian) + Number(disPrice.manjianzhe)).toFixed(2) * -1}}</span>
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
      <div class="amount">合计:<span class="price">￥{{Number(calcAmount)}}</span></div>
      <div id="percreateorder" v-show="orderAble" class="order-btn" @click="order">下单</div>
      <div v-show="!orderAble" class="order-btn-disable">下单</div>
    </div>
    <cashier v-model="cashierFlag" :price="payAmount" :orderNum="orderNum"></cashier>
    <useCoupons v-show="couponFlag" v-model="couponFlag" ref="useCoupons" :merchants="merchants" @selected="getSelected"></useCoupons>
    <div v-transfer-dom >
      <popup v-model="showDiscount" position="bottom" max-height="75%" class="discountBox" :style="readyTradeItem.length >2 ? 'height:100% !important;':''">
        <img src="../../assets/icons/icon_close_b.png" alt="" class="iconCloseDis" @click="showDiscount = false">
        <div :class="readyTradeItem.length >2 ? 'discountBox_lit' :''">
          <p class="disTitle" >请在方框内输入对应的折扣码，输入正确才可领取对应的优惠券，如有任何问题，请联系在线客服。</p>
          <div style="margin: 0 10px 70px;">
          <div v-if="readyTradeItem != null" v-for="(item,index) in readyTradeItem"
               class="cardList" :class="{cardListActived : item.a == true , noClick : index > okUse ,
               noClick_:(item.a!=true&&flag1)||(item.a!=true&&item.exclusived==1&&flag2)}"
               @click="chooseDiscount(item,index)">
            <div class="cardList_left" :class="{noUse : index > okUse,noUse_:(item.a!=true&&flag1)||(item.a!=true&&item.exclusived==1&&flag2)}">
              <p class="disPrice" v-if="item.rule  === 1 || item.rule  === 2">￥{{item.discountAmount/100}}</p>
              <p class="disPrice" v-if="item.rule   === 3">{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
              <p class="manjian" v-if="item.rule   === 2">直减</p>
              <div class="manjian" v-if="item.rule   === 3" >
                <p v-for="item1 in item.discountcodePiecediscountList.slice(0,1)">满{{item1.min_quantity}}件打{{item1.discountRatio/10}}折</p>
              </div>
              <p class="manjian" v-if="item.rule === 1">满{{item.minExpense/100}}减{{item.discountAmount/100}}</p>
              <p class="reUse">
                <img src="../../assets/icons/icon_overlay.png" alt="">
                <span v-if="item.exclusived === 1">不</span><span>可叠加使用</span>
              </p>
            </div>
            <div class="cardList_right" :class="{cardActived : item.a == true}">
              <p class="zkmCode">折扣码：{{item.discountcode}}</p>
              <p class="expiryDate">有效期：{{(item.startDate || '').replace("T", " ").split(' ')[0]}}至{{(item.endDate || '').replace("T", " ").split(' ')[0]}}</p>
              <p class="lookDetail" @click.stop="lookDetail1(index)">查看明细<img src="../../assets/icons/icon_drop_down.png" alt=""></p>
              <i class="rightTopCss"></i>
              <span class="displayNone" :class="{noUseTxt : index > okUse}">不适用</span>
              <i class="displayNone" :class="{noUseCss : index > okUse}"></i>
            </div>
            <div class="cardList_bottom" v-show="lookDetailIndex1 == index">
              <p class="explain" >说明：<span v-if="item.memo">{{item.memo || '无'}}</span></p>
            </div>
          </div>
          </div>
          <div class="discountBottom1" v-if="chooseDiscountStatus">
            <input type="text" v-model="cashingDiscount" placeholder="请输入折扣码">
            <span class="exchange" @click="changeDiscount">兑换</span>
          </div>
          <div class="discountBottom2" v-else>
            <span class="disCancel" @click="discountCancel">取消选择</span>
            <span class="disUse" @click="discountUse">使用</span>
            <div style="clear:both;"></div>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as disAPI from '../../services/API/discountServices.es6'
  import * as tool from '@/services/myTool.es6'
  import * as orderAPI from '@/services/API/orderServices.es6'
  import cashier from '@/components/cashier.vue'
  import { TransferDom, XHeader, Popup, Group, Cell, CellBox, XTextarea, Scroller, debounce } from 'vux'
  import useCoupons from '@/pages/promotion/useCoupons.vue'
  export default {
    directives: {
      TransferDom
    },
    name: 'createOrder',
    components: { cashier, XHeader, Popup, Group, Cell, CellBox, XTextarea, Scroller, debounce, useCoupons },
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
        sum: 0,
        memberNumber: '', // 员工编号
        memberStatus: false,
        showDiscount: false, // 折扣码弹窗
        userId: '', // memberId
        productId: [], // 产品Id
        readyTradeItem: '',  // 已兑换折扣码
        lookDetailIndex1: -1, // 查看明细
        chooseDiscountStatus: true,
        chooseDisItem: [], // 已选择折扣码
        disPrice: { // 折扣码优惠
          'jian': 0, // 满减or直减
          'manjianzhe': 0 // 满减折
        },
        cashingDiscount: '', // 输入折扣码
        okUse: 0, // 判断折扣码是否可用
        flag1: false,
        flag2: false,
        goBackStatus: false, // 头部返回事件
        disParams: [] // 折扣码参数
      }
    },
    mounted: function () {
      this.userId = JSON.parse(sessionStorage.getItem('userInfo')).memberId
      for (var i of JSON.parse(sessionStorage.getItem('settlementProductItems'))) {
        for (var j of i.productItem) {
          this.productId.push({productId: j.productId, count: j.quantity})
        }
      }
      // this.readyTrade() // 已兑换折扣码
      if (sessionStorage.getItem('memberRemark')) {
        this.memberRemark = sessionStorage.getItem('memberRemark')
      }
      this.scrollerHeight = document.body.clientHeight - 66
      tool.preCartToCart(this, () => {
        this.getSettlementDate()
      })
    },
    methods: {
      goBack () { // 下单成功后点头部后退按钮，返回到订单页
        this.productId = []
        if (this.goBackStatus == true) {
          this.$router.replace({path: '/myOrders/1'})
        } else {
          this.$router.back(-1)
        }
      },
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
      discountUse () {
        let arr = this.readyTradeItem.filter (item => {
          return item.a === true
        })
        this.chooseDisItem = arr
        this.disPrice = { // 折扣码优惠
          'jian': 0, // 满减or直减
          'manjianzhe': 0 // 满减折
        }
        console.log('arrr',arr)
        for (var i of arr) {
          this.disPrice.jian += i.discountAmount / 100
          if (i.rule === 3) {
            let aa = i.discountcodePiecediscountList[0].discountRatio
              // * this.productId[index].count
            for (let [index, j] of i.productIdsssss.entries()) {
              for (var z of this.productId) {
                console.log('j.proPrice', j.proPrice)
                if (z.productId == j.productId) {
                  this.disPrice.manjianzhe = (j.price * z.count - j.proPrice) / 100 * (1 - aa / 100) - 0 + Number(this.disPrice.manjianzhe)
                }
              }
            }
            this.disPrice.manjianzhe = this.disPrice.manjianzhe.toFixed(2)
          }
        }
        console.log('this.disPrice', this.disPrice)
        this.showDiscount = false
      },
      discountCancel () {
        for (var a of this.readyTradeItem) {
          this.$set(a, 'a', false)
        }
        // this.showDiscount = false
        this.chooseDiscountStatus = true
        this.lookDetailIndex1 = -1
        this.chooseDisItem = []
        this.flag1 = false
        this.flag2 = false
        this.disPrice = { // 折扣码优惠
          'jian': 0, // 满减or直减
          'manjianzhe': 0 // 满减折
        }
      },
      chooseDiscount (item, index) {
        if (item.a) {
          this.$set(item, 'a', false)
          if (item.exclusived == 1) {
            this.flag1 = false
          } else if (item.exclusived == 2) {
            this.flag1 = false
            let f = this.readyTradeItem.every((item, index) => {
              if (!item.a) item.a = ''
              return item.a == false || ''
            })
            console.log('this.readyTradeItemthis.readyTradeItem',this.readyTradeItem)
            if (f) {
              this.flag2 = false
            }
          }
        } else {
          this.$set(item, 'a', true)
          if (item.exclusived == 1) {
            this.flag1 = true
            this.flag2 = false
          } else if (item.exclusived == 2) {
            this.flag2 = true
            this.flag1 = false
          }
        }
        console.log('1111', item.a)
        let a = this.readyTradeItem.every(item => {
          return item.a == false || ''
        })
        console.log('aaa', a)
        if (a) {
          this.chooseDiscountStatus = true
        } else {
          this.chooseDiscountStatus = false
          this.chooseDisItem = []
        }
      },
      showDiscountEvent () { // 显示折扣码弹窗
        this.showDiscount = true
        if (this.chooseDiscountStatus == true) {
          this.readyTrade ()
        }
      },
      readyTrade () { // 已兑换折扣码
        let parms = this.productId
        this.$http.post(...disAPI.getDiscountInfo(parms))
          .then(res => {
            if (res.data.code === 200) {
              let a = res.data.couponUseProductInfos[0]
              this.readyTradeItem = a.couponProductUseInfo
              this.readyTradeItem = a.couponProductUseInfo.concat(a.couponProductNoUseInfo)
              this.okUse = a.couponProductUseInfo.length - 1
            } else if (res.data.code === -1) {
              this.$vux.alert.show({
                title: '提示',
                content: '出错了！'
              })
            }
          })
          // .catch(res => {
          //   this.$vux.alert.show({
          //     title: '提示',
          //     content: '您输入的折扣码有误！'
          //   })
          // })
      },
      lookDetail1 (index) { // 查看已兑换明细
        this.lookDetailIndex1 = this.lookDetailIndex1 == index ? -1 : index
      },
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
          console.log('merchants', merchants)
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
        // this.chooseDisItem
        let params = {
          addressId: this.address.id,
          remark: this.memberRemark,
          couponList: [],
          discountcodeList: [],
          operator: this.memberNumber
        }
        for (let i of this.selected) {
          params.couponList.push({
            couponId: i.id,
            code: i.code
          })
        }
        for (let i of this.chooseDisItem) {
          params.discountcodeList.push({
            discountcodeId: i.discountcodeRecordId
          })
        }
        console.log('params', params)
        this.$http.patch(...orderAPI.order(params)).then(res => {
          if (res.data.code === 200) {
            this.$vux.toast.show({type: 'text', text: '下单成功', width: '200px'})
            this.goBackStatus = true // 下单成功后点头部后退按钮，返回到订单页
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
        return ((this.afterPromotion - couponsValue).toFixed(2) - this.disPrice.jian - this.disPrice.manjianzhe).toFixed(2)
      },
      payAmount () {
        let couponsValue = tool.handlePrice(this.couponsValue)
        let payPrice = (((this.afterPromotion - couponsValue) - this.disPrice.jian - this.disPrice.manjianzhe) * 100).toFixed(2)
        return Number(payPrice)
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
.discountBox{
  position: fixed;
  bottom: 0;
  width: 100%;
  /*height: 100% !important;*/
  max-height: 80%;
  background: #fff;
  overflow: visible;
  .discountBox_lit{
    overflow-y: scroll;
    position: absolute;
    width: 100%;
    height: 100%;
    max-height: 100%;
  }
  .iconCloseDis{
    position: absolute;
    top: -48px;
    right: 15px;
    width: 36px;
    height: 48px;
  }
  .disTitle{
    margin: 10px 15px 15px;
    padding: 10px 15px;
    background-color: #FFF4E8;
    font-size: 14px;
    color: #A3A3A3;
  }
  .noClick{
    pointer-events: none;
  }
  .noClick_{
    pointer-events: none;
  }
  .cardList{
    position: relative;
    margin: 10px 0;
    background-color: #fff;
    font-size: 12px;
    line-height: 24px;
    border: 1px solid #CFCFCF;
    .name{
      color: #352665;
    }
    .zkmCode,.expiryDate,.explain{
      color: #8b8b8b;
    }
    .cardList_left{
      display: inline-block;
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
    .noUse{
      background-color: #979797;
    }
    .noUse_{
      background-color: #979797;
    }
    .displayNone{
      display: none;
    }
    .noUseTxt,.noUseTxt_{
      display: inline-block;
      position: absolute;
      top: 5px;
      right: 0;
      color: #fff;
      font-size: 12px;
      z-index: 1;
      transform: rotate(45deg);
    }
    .noUseCss{
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
    }
    .noUseCss::before{
      display: inline-block;
      position: absolute;
      right: 0;
      top: 0;
      content: '';
      display: inline-block;
      border: 25px solid transparent;
      border-top-color: #979797;
      border-right-color: #979797;
    }
    .cardList_right{
      position: absolute;
      top: 0;
      left: 30%;
      padding: 20px;
      width: 60%;
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
    .cardList_right.cardActived::before, .cardList_right.cardActived_::before{
      position: absolute;
      right: 0;
      top: 0;
      content: '';
      display: inline-block;
      border: 15px solid transparent;
      border-top-color: #352665;
      border-right-color: #352665;
    }
    .rightTopCss::before{
      content: '';
      display: inline-block;
      position: absolute;
      top: 8px;
      right: 11px;
      width: 2px;
      height: 5px;
      background-color: #fff;
      transform: rotate(-45deg);
    }
    .rightTopCss::after{
      content: '';
      display: inline-block;
      position: absolute;
      top: 4px;
      right: 6px;
      width: 2px;
      height: 10px;
      background-color: #fff;
      transform: rotate(-135deg);
    }
    .cardList_bottom{
      position: relative;
      padding: 10px 20px;
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
  .cardListActived{
    border-color: #352665;
  }
  .discountBottom1{
    position: fixed;
    bottom: 0;
    width: calc(100% - 30px);
    padding: 15px;
    background-color: #F8F8F8;
    box-shadow: 10px 10px 50px #000;
    z-index: 9;
    input{
      padding-left: 5px;
      width: 65%;
      height: 46px;
      outline: none;
      border-color: transparent;
      font-size: 18px;
    }
    span{
      display: inline-block;
      width: 30%;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      text-align: center;
      background: #352665;
      color: #fff;
      float: right;
    }
  }
  .discountBottom2{
    position: fixed;
    bottom: 0;
    width: calc(100% - 30px);
    padding: 15px;
    background-color: #fff;
    box-shadow: 10px 10px 50px #000;
    text-align: center;
    z-index: 9;
    font-size: 20px;
    .disCancel{
      display: inline-block;
      float: left;
      width: 46%;
      height: 48px;
      line-height: 48px;
      border: 1px solid #979797;
    }
    .disUse{
      display: inline-block;
      float: right;
      width: 46%;
      height: 48px;
      line-height: 48px;
      border: 1px solid #352665;
      background-color: #352665;
      color: #fff;
    }
  }
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
.memberExplain{
  background-color: #eee;
  font-size: 14px;
  color: #a3a3a3;
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
  .memberNum{
    padding-left: 5px;
    width: 72%;
    height: 26px;
    background: #fafafa;
    outline: none;
    border: 1px solid #979797;
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
    background: $tsl-color;
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

