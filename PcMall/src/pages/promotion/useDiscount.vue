<style>
    .coupon-wrapper .ivu-checkbox{
        display: none;
    }
</style>
<template>
  <div id="useDiscount" style="height: 600px;">
      <p  style="margin: 10px 0 20px 30px; font-size: 24px;color: #352665;text-align: left;">我的折扣码</p>
      <div class="discountBox">
          <div v-if="this.readyTradeItem.length == 0" style="font-size: 16px;text-align: center;">暂无可使用的折扣码</div>
          <div v-if="readyTradeItem != null" v-for="(item,index) in readyTradeItem"
               class="cardList" ref="cardList" :class="{cardListActived : item.a == true , noClick : index > okUse ,
                   noClick_:(item.a!=true&&flag1)||(item.a!=true&&item.exclusived==1&&flag2)}"
               @click="chooseDiscount(item,index)" v-bind:hidden="item.discountAmount == null && item.discountcodePiecediscountList == null">
              <div class="cardList_left" :class="{noUse : index > okUse,noUse_:(item.a!=true&&flag1)||(item.a!=true&&item.exclusived==1&&flag2)}">
                  <p class="disPrice" v-if="item.rule  === 1 || item.rule  === 2">￥{{item.discountAmount/100}}</p>
                  <p class="disPrice" v-if="item.rule   === 3 && item.discountcodePiecediscountList != null">{{item.discountcodePiecediscountList[0].discountRatio/10}}折</p>
                  <p class="manjian" v-if="item.rule   === 2">直减</p>
                  <div class="manjian" v-if="item.rule   === 3 && item.discountcodePiecediscountList != null" >
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
                  <p class="explain" >说明：<span v-if="item.memo">{{item.memo || '无'}}</span></p>
                  <i class="rightTopCss"></i>
                  <span class="displayNone" :class="{noUseTxt : index > okUse}">不适用</span>
                  <i class="displayNone" :class="{noUseCss : index > okUse}"></i>
              </div>
          </div>
      </div>
        <div class="discountBottom" >
            <input type="text" v-model="cashingDiscount" placeholder="请输入折扣码" >
            <span class="exchange" @click="changeDiscount">兑换</span>
            <loading v-if="loading"></loading>
        </div>
      <div class="Mfooter" >
          <Button @click.native="discountCancel" style="margin-right: 30px; width: 200px;height: 50px;font-size: 16px;">返回</Button>
          <Button @click.native="discountUse" style="width: 200px;height: 50px;font-size: 16px; background-color: #352665;color: #fff;">确定使用</Button>
      </div>
  </div>
</template>
<!--<script type="text/ecmascript-es6">-->
<script >
  import { XHeader, Scroller, Tab, TabItem, CheckIcon } from 'vux'
  import loading from '@/pages/homePages/loading.vue'
  import * as disAPI from '../../services/API/discountServices.es6'
  import coupon from './coupon.vue'
  export default {
    name: 'useDiscount',
    components: Object.assign({ XHeader, Scroller, Tab, TabItem, CheckIcon, loading }, { coupon }),
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
          loading: false,
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
        this.bus.$on('readyTrade',()=> {
            this.readyTrade()
        })
    },
    beforeMount () {
        this.loading = true
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
                        this.$Modal.confirm({
                            title: '提示',
                            content: res.data.message
                        })
                        this.readyTrade() // 已兑换折扣码
                    } else {
                        this.$Modal.confirm({
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
            // console.log('arrr',arr)
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
            arr.push(this.disPrice)
            // console.log('this.disPrice', this.disPrice)
            // this.showDiscount = false
            this.$emit('chooseDisItem',arr,this.disPrice)
            this.$parent.$parent.hideCDiscount()
        },
        discountCancel () { // pc端返回只关闭弹窗
        //     for (var a of this.readyTradeItem) { // 取消所有已选折扣码
        //         this.$set(a, 'a', false)
        //     }
        //     // this.showDiscount = false
        //     this.chooseDiscountStatus = true
        //     this.lookDetailIndex1 = -1
        //     this.chooseDisItem = []
        //     this.flag1 = false
        //     this.flag2 = false
        //     this.disPrice = { // 折扣码优惠
        //         'jian': 0, // 满减or直减
        //         'manjianzhe': 0 // 满减折
        //     }
            this.$parent.$parent.hideCDiscount()
        },
        chooseDiscount (item, index) {
            if (index > this.okUse || (item.a!=true&&this.flag1)||(item.a!=true&&item.exclusived==1&&this.flag2)) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '该折扣码不适用于此订单商品'
                })
                return
            }
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
                    // console.log('this.readyTradeItemthis.readyTradeItem',this.readyTradeItem)
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
            // console.log('1111', item.a)
            let a = this.readyTradeItem.every(item => {
                return item.a == false || ''
            })
            // console.log('aaa', a)
            if (a) {
                this.chooseDiscountStatus = true
            } else {
                this.chooseDiscountStatus = false
                this.chooseDisItem = []
            }
            // }
            // }
        },
        readyTrade () { // 已兑换折扣码
            let parms = this.productId
            this.$http.post(...disAPI.getDiscountInfo(parms))
                .then(res => {
                    if (res.data.code === 200) {
                        this.loading = false
                        let a = res.data.couponUseProductInfos[0]
                        if (a.couponProductUseInfo != null && a.couponProductNoUseInfo == null) {
                            this.readyTradeItem = a.couponProductUseInfo
                        } else if (a.couponProductUseInfo != null && a.couponProductNoUseInfo != null) {
                            this.readyTradeItem = a.couponProductUseInfo.concat(a.couponProductNoUseInfo)
                            this.okUse = a.couponProductUseInfo.length - 1
                        } else {
                            this.readyTradeItem = a.couponProductNoUseInfo
                            this.okUse = -1
                        }
                        // this.readyTradeItem = a.couponProductUseInfo
                        // this.readyTradeItem = a.couponProductUseInfo.concat(a.couponProductNoUseInfo)
                        // this.okUse = a.couponProductUseInfo.length - 1
                    } else if (res.data.code === -1) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '出错了！'
                        })
                    }
                })
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
    },
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
    .cardList{
        position: relative;
        margin-top: 10px;
        background-color: #fff;
        font-size: 16px;
        line-height: 25px;
        border: 1px solid #CFCFCF;
        cursor: pointer;
        .name{
            color: #352665;
        }
        .zkmCode,.expiryDate,.explain{
            color: #8b8b8b;
        }
        .explain{
            display: inline-block;
            line-height: 25px;
        }
        .cardList_left{
            display: inline-block;
            padding: 20px 0;
            width: 26%;
            background-color: #352665;
            color: #fff;
            text-align: center;
            .disPrice{
                font-size: 40px;
                line-height: 50px;
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
            display: inline-block;
            padding-left: 5%;
            padding-top: 25px;
            width: 60%;
            vertical-align: top;
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
            border: 25px solid transparent;
            border-top-color: #352665;
            border-right-color: #352665;
        }
        .rightTopCss::before{
            content: '';
            display: inline-block;
            position: absolute;
            top: 13px;
            right: 18px;
            width: 2px;
            height: 10px;
            background-color: #fff;
            transform: rotate(-45deg);
        }
        .rightTopCss::after{
            content: '';
            display: inline-block;
            position: absolute;
            top: 6px;
            right: 9px;
            width: 2px;
            height: 17px;
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
    .discountBottom{
        position: absolute;
        bottom: 120px;
        width: calc(100% - 30px);
        padding: 15px;
        background-color: #F8F8F8;
        z-index: 9;
        text-align: center;
        input{
            padding-left: 5px;
            width: 65%;
            height: 50px;
            outline: none;
            border-color: transparent;
            font-size: 18px;
        }
        span{
            display: inline-block;
            width: 120px;
            height: 50px;
            line-height: 44px;
            font-size: 20px;
            border: 1px solid #111;
            text-align: center;
            background: #fff;
            color: #111;
            cursor: pointer;
        }
    }
.Mfooter{
    position: absolute;
    bottom: 55px;
    left: 50%;
    margin-left: -214px;
}
.discountBox{
    padding: 0 85px;
    padding-bottom: 50px;
    height: 400px;
    overflow-y: scroll;
}
/*滚动条样式*/
.discountBox::-webkit-scrollbar{
    /*滚动条整体样式*/
    width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 2px;
}
.discountBox::-webkit-scrollbar-thumb{
    /*滚动条里面小方块样式*/
    border-radius: 6px;
    background: #979797;
}
.discountBox::-webkit-scrollbar-track{
    /*滚动条里面轨道样式*/
    background: transparent;
}
</style>
