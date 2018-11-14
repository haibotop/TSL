<template>
  <div id="CreateOrders" ref="CreateOrders">
    <div class="COheader">
      <x-header title="填写订单" :left-options="{backText: '', preventGoBack: false}"></x-header>
    </div>
    <!-- 商品信息 -->
    <div class="COcontent">
      <div class="addressGroup">
        <group>
          <cell-box v-if="noAddress" is-link link="ManageAddress">
            <div class="noAddress">
              <span class="addrssIcon">
            <img src="../assets/icons/position.svg" alt="position">
          </span>
              <p class="noAddressContent">请输入收货地址</p>
            </div>
          </cell-box>
          <cell-box v-else class="address" is-link @click.native="clearSession">
            <div class="addressBlock">
              <div class="addressee">
                <span class="name">{{ addressInfo.receiverName }}</span>
                <span class="tel">{{ addressInfo.receiverMobile }}</span>
              </div>
              <div class="addressInfo">
              <span class="addrssIcon">
            <img src="../assets/icons/position.svg" alt="position">
          </span>
                <span class="addressDetail">{{ addressInfo.receiverAddress }}</span>
              </div>
            </div>
          </cell-box>
        </group>
      </div>
      <group v-for="(item, index1) in productMsg" :key="productMsg.memberId">
        <cell-box>
          <div class="storeHouse">{{ item.merchantName }}</div>
        </cell-box>
        <cell-box class="productMsg productList" v-for="(products, index3) in item.SettlementProductItem"
                  :key="products.product.id">
          <div class="productImg">
            <div style="text-align:center;">
              <x-img :src="products.product.defaultPicture" success-class="PdImg" :offset="100"></x-img>
            </div>
          </div>
          <div class="productConent">
            <div>
              <span class="productTitle">{{ products.product.name }}</span>
            </div>
            <span class="productSize" v-for="spec in products.specValues">
              <span>{{ spec.specValueName }}</span>
            </span>
            <div>
              <span class="discountedPrice">¥{{ products.product.floatPrice }}</span>
              <span class="productQuantity">X{{ products.quantity }}</span>
            </div>
          </div>
        </cell-box>
        <!-- 购买信息 -->
        <cell title="运费">
          <div>
            <span class="fontColor">免邮费</span>
            <!--<span class="fontColor">¥{{ item.info.postage.price }}</span>-->
          </div>
        </cell>
        <div>
        </div>
        <cell>
          <!-- To do -->
          <div class="account">
            <span class="fontColor">共{{ total[index1] }}件商品</span>
            <span class="accSum">合计:</span>
            <span class="accNum">¥{{ item.floatamount }}</span>
          </div>
        </cell>
      </group>
    </div>
    <!-- 结算 -->
    <div class="COfooter">
      <group>
        <cell class="settlement-cell">
          <div>
            <div class="account">
              <span class="accSum">合计:</span>
              <span class="accNum">¥{{ totalfloatamount }}</span>
            </div>
            <div class="settlement" @click="finishSettlement" v-if="finishOrder">下单完成</div>
            <div class="settlement" @click="getSettlement" v-else>下单</div>
          </div>
        </cell>
      </group>
    </div>
    <!-- 组件 -->
    <div v-transfer-dom>
      <popup v-model="settlementInfo.flag" is-transparent>
        <div class="popupTitle" style="padding: 10px 20px;position: relative; text-align: center;background-color: #eeeeee;border-top-left-radius: 10px;
    border-top-right-radius: 10px;">
          <span>甄品收银台</span>
          <!--<x-icon type="ios-close-empty" size="30" @click.native="getSettlementFalse"-->
                  <!--style="position: absolute;top: 0;right: 5px;"></x-icon>-->
          <span style="position: absolute;top: 0;right: 10px;"  @click="getSettlementFalse">
            <img src="../assets/icons/close.svg" alt="close">
          </span>
        </div>
        <div style="background-color: white;">
          <div>
            <div style="text-align: center;padding: 10px;">
              <span style="color: red; font-size: 22px;">¥{{ totalfloatamount }}</span>
            </div>
            <div style="border-top: 1px solid #eeeeee;padding: 10px 15px;">付款方式</div>
            <div style="border: 1px solid #eeeeee">
              <radio :options="radiopay" v-model="payway"></radio>
            </div>
          </div>
          <div style="padding: 10px">
            <x-button @click.native="checkOut"
                      style="width:85%;height:35px;color:#ffffff;background-color: #FC781C;font-size:16px">
              立即支付
            </x-button>
          </div>
        </div>
      </popup>
    </div>
    <!--遮罩-->
    <div class="my-mask" v-if="datafailed"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {
    XHeader,
    Group,
    Cell,
    CellBox,
    Actionsheet,
    XDialog,
    TransferDomDirective as TransferDom,
    XInput,
    XImg,
    XButton,
    Spinner,
    Popup,
    Confirm,
    XNumber,
    Radio
  } from 'vux'
  import * as myAPI from '@/services/API/myService.es6'
  import wx from 'weixin-js-sdk'
  export default {
    name: 'CreateOrders',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      Cell,
      CellBox,
      Actionsheet,
      XDialog,
      XInput,
      XImg,
      Spinner,
      Popup,
      XButton,
      Confirm,
      XNumber,
      Radio
    },
    data () {
      return {
        // 地址信息
        noAddress: false,
        addressInfo: {
          receiverName: '',
          receiverMobile: '',
          receiverAddress: ''
        },
        // 商品信息
        productMsg: [
          {
            merchantName: '',
            SettlementProductItem: [
              {
                product: {
                  defaultPicture: '',
                  name: '',
                  price: ''
                },
                specValues: [
                  {
                    specValueName: ''
                  }
                ],
                quantity: 0
              }
            ],
            amount: 0,
            freightPrice: 0
          }
        ],
        responseData: {},
        // 结算相关操作
        settlementInfo: {
          flag: false
        },
        // getSettlementDate param
        params: [],
        // radio Content
        // 支付
        payOrderInfo: {
          orderNum: ''
        },
        payParams: [],
        payway: '',
        radiopay: [{
          icon: require('../assets/icons/zhifubao.svg'),
          key: 'alipay',
          value: '支付宝支付'
        }, {
          icon: require('../assets/icons/weixin.svg'),
          key: 'wxpay',
          value: '微信支付'
        }],
        datafailed: false,
        loadDataSuccess: false,
        // 订单状态
        finishOrder: false
      }
    },
    mounted () {
      this.getSettlementDate(this.params)
    },
    methods: {
      // 结算接口
      postOrder () {
        this.$http.patch(myAPI.postOrder())
          .then((response) => {
            if (response.data.code === 200) {
              this.$vux.toast.show({
                text: '下单成功',
                type: 'text',
                width: '200px'
              })
              for (let obj of response.data.orderItems) {
                this.payOrderInfo.orderNum = obj.number
                console.log(this.payOrderInfo.orderNum)
                let b = {'orderNo': this.payOrderInfo.orderNum, 'terminalIp': '192.168.0.1', 'productDescription': '软通甄品', 'currency': 'CNY', 'payType': 1}
                this.payParams.push(b)
              }
              console.log(this.payParams)
              this.settlementInfo.flag = true
              this.finishOrder = true
            }
          })
          .catch((error) => {
            if (error.response.data.status === 500) {
              this.$vux.toast.show({
                text: '下单失败',
                type: 'text',
                width: '200px'
              })
            }
          })
      },
      // 点击下单
      getSettlement () {
        if (this.noAddress) {
          this.$vux.toast.show({
            text: '请填写收货地址',
            type: 'text',
            width: '200px'
          })
          return
        } else {
          // 结算数据加载完成
          if (this.loadDataSuccess === false) {
            this.$vux.toast.show({
              text: '暂无数据,无法下单',
              type: 'text',
              width: '200px'
            })
          } else if (this.loadDataSuccess === true) {
            // 弹出结算框
            this.postOrder()
          }
        }
      },
      finishSettlement () {
        this.$vux.toast.show({
          text: '商品已下单',
          type: 'text',
          width: '200px'
        })
      },
      // 关闭收银台
      getSettlementFalse () {
        this.settlementInfo.flag = false
      },
      // 支付宝
      aliPay () {
        this.payParams.payType = 3
        console.log(this.payParams)
        let params = this.payParams
        this.$http.post(...myAPI.alipay(params), {async: false}).then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            document.write(response.data.aliPay)
          } else if (response.data.code === 5001) {
            this.$vux.toast.show({ type: 'text', text: response.data.message, width: '200px' })
          }
        })
      },
      // 微信
      wxPay () {
        let params = this.payParams
        this.$http.post(...myAPI.wxpay(params), {async: false}).then((response) => {
          if (response.data.code === 200) {
            let params = {
              appId: response.data.paymentOrder.appId,
              timestamp: new Date().getTime(),
              nonceStr: response.data.paymentOrder.nonceStr,
              signature: response.data.paymentOrder.sign,
              jsApiList: ['chooseWXPay']
            }
            wx.config(params)
            window.location.href = response.data.paymentOrder.mwebUrl
//          console.log(response.data.paymentOrder.mwebUrl)
          }
        })
      },
      // 下单确认操作
      checkOut () {
        if (this.noAddress) {
          this.$vux.toast.show({
            text: '请输入您的收货地址',
            type: 'text',
            width: '200px'
          })
          return
        } else if (this.payway === 'alipay') {
          console.log('alipay')
          this.aliPay()
        } else if (this.payway === 'wxpay') {
          console.log('wxpay')
          this.wxPay()
        } else {
          sessionStorage.setItem('addressInfo', '')
          this.$vux.toast.show({
            text: '请选择支付方式支付',
            type: 'text',
            width: '200px'
          })
        }
      },
      // 获取购物车数据
      getSettlementDate (param) {
        this.params = JSON.parse(sessionStorage.getItem('settlementProductItems'))
        this.$http.post(...myAPI.getSettleMent(this.params))
          .then((response) => {
            if (response.status === 200) {
              this.loadData(response.data.TempOrder)
            }
          })
          .catch((error) => {
            if (error.response.data.status === 500) {
              console.log(this.addressInfo)
              console.log(this.productMsg)
              this.datafailed = true
              this.$vux.toast.show({
                text: '请求超时',
                type: 'warn'
              })
            }
          })
      },
      loadData (data) {
        for (let dataItem of data) {
          if (dataItem.address === null) {
            this.noAddress = true
          }
          let b = sessionStorage.getItem('addressInfo')
          if (b) {
            this.addressInfo = JSON.parse(b)
          } else {
            this.addressInfo = dataItem.address
          }
          dataItem.amount % 100 === 0 ? dataItem.floatamount = `${dataItem.amount / 100}.00` : dataItem.floatamount = dataItem.amount / 100
          for (let obj of dataItem.SettlementProductItem) {
            obj.product.price % 100 === 0 ? obj.product.floatPrice = `${obj.product.price / 100}.00` : obj.product.floatPrice = obj.product.price / 100
            obj.sum % 100 === 0 ? obj.floatsum = `${obj.sum / 100}.00` : obj.floatsum = obj.sum / 100
            console.log(obj.floatsum)
          }
          this.productMsg = data
        }
        this.loadDataSuccess = true
      },
      // 清楚session 跳转地址管理
      clearSession () {
        sessionStorage.setItem('addressInfo', '')
        this.$router.replace({path: 'ManageAddress'})
      }
    },
    computed: {
      total: function (index) {
        let total = []
        for (let i in this.productMsg) {
          let shopNum = 0
          for (let obj of this.productMsg[i].SettlementProductItem) {
            shopNum += obj.quantity
          }
          total.push(shopNum)
        }
        return total
      },
      totalfloatamount: function () {
        let totalamount = 0
        let totalfloatamount = 0
        for (let item of this.productMsg) {
          if (item.floatamount !== null) {
            totalamount += parseFloat(item.floatamount)
            if (item.floatamount === undefined) {
              totalamount = 0
            }
            totalamount % 100 === 0 ? totalfloatamount = `${totalamount}.00` : totalfloatamount = totalamount
          }
        }
        return totalfloatamount
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #CreateOrders {
    font-family: initial;
    background-color: #eeeeee;
    overflow: hidden;
    .COheader {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      z-index: 1;
      height: 47px;
    }
    .COcontent {
      position: absolute;
      left: 0;
      right: 0;
      top: 47px;
      bottom: 47px;
      overflow: auto;
      .weui-cell:before {
        left: 0px;
      }
    }
    .COfooter {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      height: 70px;
    }
    /* 地址详情 */
    .addressGroup {

    }
    .noAddress {
      position: relative;
      .addrssIcon {
        position: absolute;
        top: 3px;
        left: 0px;
        img {
          width: 18px;
        }
      }
      .noAddressContent{
        margin-left: 26px;
      }
    }
    .address {
      .addrssIcon {
        position: absolute;
        top: 3px;
        left: -16px;
        img {
          width: 15px;
        }
      }
      .addressBlock{
        width: 96%;
        height: 90px;
      }
      .addressee {
        width: 94%;
        height: 30px;
        margin-left: 5px;
        display: block;
        font-size: 14px;
        .name {
          position: absolute;
        }
        .tel {
          position: absolute;
          right: 30px;
        }
        .icon-default {
          width: 50px;
        }
      }
      .addressInfo {
        position: relative;
        width: 100%;
        margin-left: 5px;
        .addressDetail {
          font-size: 12px;
          color: #7F7F7F;
        }
      }
    }
    .fontColor {
      color: #000;
    }
    .sumFontColor {
      color: red;
    }
    /* 商品购买信息 */
    .productList {
      .productImg {
        width: 88px;
        height: 88px;
        display: inline-block;
        vertical-align: middle;
        background: #EEEEEE;
        .PdImg {
          width: 88px;
          height: 88px;
          border-radius: 5px;
        }
      }
      .productConent {
        width: 223px;
        margin-left: 10px;
        display: inline-block;
        vertical-align: middle;
        font-family: "黑体", serif;
        .productConent > div {
          display: inline-block;
        }
        .productTitle {
          width: 218px;
          font-size: 14px;
          display: inline-block;
        }
        .productQuantity {
          float: right;
          color: #808080;
          font-size: 11px;
          line-height: 24px;
          font-weight: bolder;
        }
        .productSize {
          span {
            color: #808080;
            font-size: 11px;
            padding-right: 10px;
          }
        }
        .discountedPrice {
          font-size: 14px;
          padding-right: 10px;
          color: #E65841;
        }
      }
    }
    .account {
      display: inline-block;
      padding: 0 10px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      .accSum {
        line-height: 10px;
        color: #000;
      }
      .accNum {
        font-size: 16px;
        color: red;
      }
    }
    /* 结算 */
    .settlement-cell {
      padding: 0;
    }
    .settlement {
      color: #fff;
      width: 100px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      display: inline-block;
      background-color: #FC781C;
    }
    .my-mask {
      position: absolute;
      top: 47px;
      bottom: 51px;
      width: 100%;
      background-color: #EEE;
    }
  }
</style>
