<style rel="stylesheet/scss" lang="scss">
    #createOrder{
        padding: 50px 0;
        background: #fafafa;
        .login-title{
            height: 80px;
            text-align: center;
            .login-t{
                position: relative;
                display: inline-block;
                text-align: center;
                font-size: 20px;
                color: #0F0F0F;
            }
            .login-t:after{
                content: '';
                position: absolute;
                bottom: -20px;
                left: 50%;
                margin-left: -20px;
                display: inline-block;
                width: 40px;
                height: 2px;
                background-color: #504379;
            }
            .xiegang:after{
                content: '';
                position: relative;
                top: 8px;
                margin: 0 15px;
                display: inline-block;
                width: 1px;
                height: 30px;
                background-color: #2E0F6E;
                transform: rotate(30deg);
            }
        }
        .content{
            margin: 0 10%;
            padding: 40px 50px 0;
            width: 80%;
            /*height: 600px;*/
            background: #fff;
            font-size: 14px;
            color: #111;
            .goodsList{

            }
            .goodsLi{
                width: 100%;
                height: 130px;
                overflow: hidden;
                /*border-bottom: 1px solid #eaeaea;*/
            }
            .change-coupon,.change-address{
                position: absolute;
                right: 20px;
                color: #4A90E2;
                cursor: pointer;
            }
            .change-address{
                top: 30px;
                right: 35px;
            }
            .no-address{
                display: inline-block;
            }
        }
        .footer{
            margin: 0 10%;
            padding: 0 50px 40px;
            width: 80%;
            border-top: 1px solid #352665;
            background: #fff;
            font-size: 14px;
            color: #7F7F7F;
        }
        .marBot10{
            margin-bottom: 10px;
        }

    }
</style>
<template>
<div>
<header1></header1>
<header2></header2>
  <div id="createOrder">
      <div class="login-title">
          <div class="login-t">首页 <span class="xiegang"></span> 购物袋 <span class="xiegang"></span> 结算</div>
      </div>
    <!--<x-header v-show="!couponFlag" :left-options="{backText: ''}" title="填写订单"></x-header>-->
    <!--<scroller v-show="!couponFlag" lock-x height="-96" ref="scroller">-->
      <div class="content marBot10">
        <!--<group v-if="address">-->
          <!--<cell-box is-link link="/addressList">-->
            <!--<div v-if="address.id" class="address">-->
              <!--<div class="address-bar1"><span class="receiverName">{{address.receiverName}}</span><span class="receiverMobile">{{address.receiverMobile}}</span></div>-->
              <!--<div class="address-bar2"><x-icon type="ios-location-outline" size="15" style="position:absolute;left:10px;"></x-icon><p>{{address.receiverAddress}}</p></div>-->
            <!--</div>-->
            <!--<div v-else class="address">-->
              <!--<div class="address-bar2"><x-icon type="ios-location-outline" size="15" style="position:absolute;left:10px;"></x-icon><p>请输入收货地址</p></div>-->
            <!--</div>-->
          <!--</cell-box>-->
        <!--</group>-->

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
        <div v-for="(merchant, index) in merchants" :key="index" class="goodsList">
          <div v-for="(promotion, index2) in merchant.promotionItems" :key="index2">
            <!--<div class="promotion-info">-->
              <!--<div>-->
                <!--<span v-if="promotion.type === 1" v-for="(item, index) in promotion.pdsArray" :key="index">满{{item.fullLimit / 100}}减{{item.subtract / 100}}</span>-->
                <!--<span v-if="promotion.type === 2" v-for="(item, index) in promotion.pdsArray" :key="index">满{{item.fullLimit / 100}}折{{item.discount / 10}}</span>-->
                <!--<span v-if="promotion.type === 3">打{{promotion.discount / 10}}折</span>-->
                <!--<span v-if="promotion.type === 4">直降{{promotion.directAmount / 100}}元</span>-->
              <!--</div>-->
            <!--</div>-->
            <div v-for="(product, index3) in promotion.productItems" :key="index3">
              <div class="goodsLi">
                <div class="default-picture">
                    <img :src="product.defaultPicture" :alt="product.name">
                </div>
                <div class="text-info">
                  <p>{{handleName(product.name)}}</p>
                  <p class="price">￥{{ handlePrice(product.price) }} ×{{product.quantity}}</p>
                    <!--<span class="quantity">×{{product.quantity}}</span>-->
                  <p  class="specs">{{toolFun('specValues', product.specValues)}}</p>
                </div>
                <div class="text-info-right">
                    <p class="price">价格：￥{{ handlePrice(product.price) }}</p>
                    <p style="margin:20px 0;">运费：免运费</p>
                    <p>（新客户免运费）</p>
                </div>
              </div>
            </div>
          </div>
          <!--<cell title="运费" value="免运费"></cell>-->
          <!--<cell>-->
            <!--<div class="account">-->
              <!--<span class="discount">促销优惠：<span class="price">￥ -{{calcDiscountedPrice}}</span></span>-->
            <!--</div>-->
          <!--</cell>-->
          <!--<cell-box>-->
            <!--<div class="account">-->
              <!--<span>共计{{calcQuantity2(merchant)}}件商品</span>-->
              <!--<span>合计:<span class="price">￥{{merchant.afterPromotion}}</span></span>-->
            <!--</div>-->
          <!--</cell-box>-->
        </div>
      </div>
      <div class="content">
        <div class="account">
            <span class="title">配送地址：</span>
            <div >
                <div v-if="address" class="address">
                    <div class="address-bar1"><span class="receiverName">{{address.receiverName}}</span><span class="receiverMobile">{{address.receiverMobile}}</span></div>
                    <div class="address-bar2"><p>{{address.receiverAddress}}</p></div>
                    <span class="change-address" @click="showAddressModel">更换地址</span>
                </div>
                <div v-else class="no-address">
                    <p style="padding-bottom:20px;color: #111;">目前您没有设置配送地址</p>
                    <!--<span class="change-address" @click="showAddressModel">更换地址</span>-->
                    <p style="color: #4A90E2;cursor: pointer;" @click="showCreatAddressModel">
                        <Icon type="ios-add-circle-outline" style="position: relative;top: -3px;margin-right: 5px;font-size: 20px;"/>
                        增加配送地址
                    </p>
                </div>
            </div>
        </div>
        <!--<div v-if="merchants.length > 0">-->
          <!--<cell-box is-link class="coupon" title="优惠券" @click.native="openCoupon">-->
            <!--<div class="account" >-->
              <!--<span class="title">-->
                <!--<span class="dis-coupon">优惠券</span>-->
                <!--<span class="discount" v-for="item in selected" :key="item.code">{{item.rules === 1 ? `满${item.fullSubtract / 100}减${item.subtract / 100}` : `直减${item.subtract / 100}`}}</span>-->
              <!--</span>-->
            <!--</div>-->
          <!--</cell-box>-->
        <!--</div>-->
        <div v-if="merchants.length > 0">
            <!--<div class="account" >-->
              <!--<span class="title">商品总价</span>-->
              <!--<span><span class="price">￥{{afterPromotion}}</span></span>-->
            <!--</div>-->
            <div class="account" >
              <span class="title">优惠券：</span>
              <span class="price">￥ {{handlePrice(couponsValue) * -1}}
                  <span v-for="item in selected" :key="item.code">（已使用{{item.rules === 1 ? `满${item.fullSubtract / 100}减${item.subtract / 100}` : `直减${item.subtract / 100}`}}）</span>
              </span>
              <span class="change-coupon" @click="showDiscountModel">更换优惠券</span>
            </div>
            <div class="account">
                <span class="discount">促销优惠：</span>
                <span class="price">￥ -{{calcDiscountedPrice}}</span>
            </div>
            <div class="account">
                <span class="discount">备注：</span>
                <Input v-model="memberRemark" :maxlength="50" style="width: 300px" placeholder="请输入"/>
            </div>
        </div>
      </div>
      <div class="footer">
          <div class="sub-bar">
              <div class="amount" v-for="(merchant, index) in merchants" :key="index">
                <span>共{{calcQuantity2(merchant)}}件商品，</span>
                <span>待付款:<span class="price">￥{{calcAmount}}</span></span>
                <p style="color: #352665">优惠已抵扣：￥{{-Number(calcDiscountedPrice) + Number(handlePrice(couponsValue) * -1)}}</p>
              </div>
              <!--<div class="amount">合计:<span class="price">￥{{calcAmount}}</span></div>-->
              <div id="percreateorder" class="order-btn" @click="order">结算<Icon type="ios-arrow-forward" style="position: absolute;top: 33px;right: 30px;font-size: 15px;"/></div>
              <!--<div v-show="!orderAble" class="order-btn-disable">下单</div>-->
          </div>
          <!--<cashier v-model="cashierFlag" :price="payAmount" :orderNum="orderNum"></cashier>-->
          <!--<useCoupons v-show="couponFlag" v-model="couponFlag" ref="useCoupons" :merchants="merchants" @selected="getSelected"></useCoupons>-->
      </div>
        <!-- <pdCoupons v-model="couponFlag"></pdCoupons> -->
        <!--<cell-box v-if="merchants.length > 0">-->
          <!--<x-textarea v-model="memberRemark" :max="50"  @on-blur="killTheSoftKeyboard">-->
            <!--<div slot="label">备注：</div>-->
          <!--</x-textarea>-->
        <!--</cell-box>-->
      <!--<create-address></create-address>-->
      <Modal v-model="model1" footerHide :styles="{width: '1000px',top: '100px'}">
        <address-list></address-list>
      </Modal>
      <Modal v-model="model2" footerHide :styles="{width: '1000px',top: '100px'}">
        <create-address @hideModelCreat="hideModelCreat"></create-address>
      </Modal>
      <Modal v-model="model3" footerHide :styles="{width: '1000px',top: '100px'}">
          <edit-address @hideModelEdit="hideModelEdit"></edit-address>
      </Modal>
      <Modal v-model="model4" footerHide :styles="{width: '1000px',top: '200px'}">
          <useCoupons ref="useCoupons" :merchants="merchants" @selected="getSelected"></useCoupons>
      </Modal>
      <Modal v-model="cashierFlag" footerHide :styles="{width: '1000px',top: '200px'}">
          <!--<useCoupons ref="useCoupons" :merchants="merchants" @selected="getSelected"></useCoupons>-->
          <cashier v-model="cashierFlag" :price="payAmount" :orderNum="orderNum"></cashier>
      </Modal>
      </div>
    <!--</scroller>-->
<v-footer></v-footer>
</div>
</template>
<script type="text/ecmascript-6">
    // 根据需要按需引入数据
  import header1 from '../homePages/header1'
  import header2 from '../homePages/header2'
  import vFooter from '../homePages/footer.vue'
  import addressList from '../me/addressList'
  import createAddress from '../me/CreateAddress'
  import editAddress from '../me/editAddress'
  import * as tool from '@/services/myTool.es6'
  import * as orderAPI from '@/services/API/orderServices.es6'
  import cashier from '@/components/cashier.vue'
  import { XHeader, Group, Cell, CellBox, XTextarea, Scroller, debounce } from 'vux'
  import useCoupons from '@/pages/promotion/useCoupons.vue'
    import {mapState} from 'vuex'
  export default {
    name: 'createOrder',
    components: { cashier, XHeader, Group, Cell, CellBox, XTextarea, Scroller, debounce, useCoupons,
        header1,
        header2,
        vFooter,
        addressList,
        createAddress,
        editAddress,
    },
    data () {
      return {
        scrollerHeight: 0,
        params: [],
        address: '',
        tempOrders: [],
        merchants: [], // 商家-》促销-》商品
        cashierFlag: false,
        // couponFlag: false,
        orderNum: '',
        orderAble: true,
        memberRemark: '',
        selected: [], // 已选优惠券
        sum: 0,
        model1: false,
        model2: false,
        model3: false,
        model4: false,
      }
    },
      updated(){
          console.log('xxx',this.address)
          console.log('vux',this.$store.state.address)
      },
    mounted: function () {
        this.bus.$on('fun',()=>{
            console.log('9999999')
            this.getSettlementDate()
        })
      if (sessionStorage.getItem('memberRemark')) {
        this.memberRemark = sessionStorage.getItem('memberRemark')
      }
      // this.scrollerHeight = document.body.clientHeight - 66
      tool.preCartToCart(this, () => {
        this.getSettlementDate()
      })

    },
    methods: {
        toolFun (type, value) {
            if (type === 'specValues') {
                // 拼接商品规格字符串
                let specValues = value || []
                let msg = []
                specValues.forEach(e => {
                    // msg = msg + (msg || ' ') + ((e.specName === '重量' ? e.specValueName + 'g' : e.specValueName) || '')+'fsdf'
                    msg.push(e.specValueName)
                })
                // msg = `${msg[0]}-${msg[1]}-${msg[2]}`
                let msg_=''
                msg.forEach((item,index)=>{
                    msg_+=item
                    if(index<msg.length-1){
                        msg_+='-'
                    }

                })
                console.log('1111',msg)
                return msg_
            }
        },
      //隐藏编辑收获地址
      hideModelEdit(){
          this.model3 = !this.model3
      },
      //隐藏编辑收获地址
      hideCoupons(){
          this.model4 = !this.model4
      },
      //隐藏新建收获地址
      hideModelCreat(){
        this.model2 = !this.model2
      },
      //隐藏更换地址
      hideAddressModel(){
          this.model1 = !this.model1
      },
      //显示更换优惠券
      showDiscountModel(){
          this.model4 = true
      },
      //显示更换地址
      showAddressModel(){
          this.model1 = true
          this.bus.$emit("openAdress")
      },
      //增加配送地址
      showCreatAddressModel(){
          this.model2 = true
      },//编辑配送地址
      showEditAddressModel(){
          this.model3 = !this.model3
      },
      getSettlementDate () {
        if (sessionStorage.getItem('settlementProductItems')) {
          this.params = JSON.parse(sessionStorage.getItem('settlementProductItems'))
          this.statements()
        } else {
          this.orderAble = false
          setTimeout(() => {
            this.$Modal.warning({
              title: '提示',
              content: '您未选择商品或所选商品已下单',
              onShow: () => {},
              onOk: () => {
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
              console.log('response.data.TempOrder',response.data.TempOrder)
            this.renderData2(response.data.TempOrder)
          } else {
            this.orderAble = false
          }
        }).catch(() => {
          this.orderAble = false
        })
      },
      renderData2 (tempOrder) {
          console.log('77777',tempOrder[0].address)
          console.log('88888',this.$store.state.address)
          // this.address = this.$store.state.address
        if (this.$store.state.address.id && tempOrder[0].address != null) {
              // console.log('ppppp')
          this.address = this.$store.state.address
          //   this.address = tempOrder[0].address
        } else {
              // console.log('ooooo')
          this.address = tempOrder[0].address
          /*if (this.address) {
                  console.log('iiiiii')
            this.$store.commit('setAddress', this.address)
          } else {
                  console.log('uuuuuu')
            // this.address = this.$store.state.address
          }*/
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
            console.log('qqqqqqqqqq',merchants)
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
        // this.couponFlag = true
        // setTimeout(() => {
        //   this.$refs.useCoupons.$refs.scroller.reset()
        // }, 100)
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
          // this.$vux.toast.show({type: 'text', text: '请选择收货地址', width: '200px'})
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
        // this.goPay()
        console.log('params',params)
        this.$http.patch(...orderAPI.order(params)).then(res => {
            console.log('1211111',res.data)
          if (res.data.code === 200) {
          //   // this.$vux.toast.show({type: 'text', text: '下单成功', width: '200px'})
          //     this.$Modal.success({
          //         title: '提示',
          //         content: '下单成功'
          //     })
            this.goPay(res.data.orderItems[0])
            sessionStorage.removeItem('settlementProductItems')
          } else if (res.data.code === 2016) {
            this.$Modal.warning({
                title: '提示',
                content: '商品不可用',
                onOk: ()=> {
                    this.$router.go(-1)
                }
            })
          } else if (res.data.code === 2008) {
              this.$Modal.warning({
                  title: '提示',
                  content: '库存不足',
                  onOk: ()=> {
                      this.$router.go(-1)
                  }
              })
          } else if (res.data.code === 404) {
              this.$Modal.warning({
                  title: '提示',
                  content: res.data.message,
                  onOk: ()=> {
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
      }
    },

    computed: {
        ...mapState(['address.receiverAddress']),
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
  width: 500px;
  .address-bar1 {
    overflow: hidden;
    font-size: 14px;
    .receiverName {
      float: left;
    }
    .receiverMobile {
      margin-left: 50px;
    }
  }
  .address-bar2 {
    padding: 10px 0px;
    p {
      font-size: 14px;
      color: #111;
    }
  }
}
.account .discount, .account .title{
    display: inline-block;
    width: 70px;
    margin-right: 50px;
    color: #352665;
}
.promotion-info {
  /*min-height: 25px;*/
  /*padding-bottom: 5px;*/
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
  margin-right: 30px;
  margin-bottom: 30px;
  width: 100px;
  height: 100px;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #979797;
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
  width: 60%;
  height: 88px;
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .price {
    margin: 10px 0;
    color: #352665;
  }
  .specs{
      color: #352665;
  }
  .quantity {
    position: absolute;
    right: 0px;
    top: 50px;
  }
}
.text-info-right{
    float: right;
    margin-right: 20px;
    text-align: center;
    .price{
        color: #352665;
    }
    p{
        color: #111;
    }
}
.coupon {
  background: #fff;
}
.account {
  position: relative;
  padding: 15px;
  width: 100%;
  font-size: 14px;
  border-bottom: 1px solid #eaeaea;
  .title {
      float: left;
    width: 70px;
    font-size: 14px;
    color: #352665;
    .dis-coupon {
      float: left;
      color: #352665;
    }
    .discount {
      color: #111;;
      font-size: 12px;
      border: 1px solid red;
      border-radius: 3px;
      padding: 0 2px;
    }
  }
  .price {
    font-size: 14px;
    color: #111;
  }
}
.account>div{
    display: inline-block;
}
.sub-bar {
  position: relative;
  bottom: 0px;
  width: 100%;
  overflow: hidden;
  color: #352665;
  background-color: #fff;
  .amount {
    margin-top: 20px;
    width: calc(100% - 150px);
    text-align: right;
    padding: 0px 50px 0px 0px;
    float: left;
    .price {
      color: #352665;
    }
  }
  .order-btn {
    margin-top: 10px;
    width: 150px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    float: left;
    color: #fff;
    background: #352665;
    cursor: pointer;
  }
  .order-btn-disable {
    margin-top: 10px;
    width: 150px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    float: left;
    color: #fff;
    background: #7f7f7f;
  }
}
</style>

