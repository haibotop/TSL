<template>
  <div id="myOrderDetail">
    <header1></header1>
    <header2></header2>

    <!-- <x-header :left-options="{backText: ''}" title="订单详情"></x-header> -->
    <div class="asorder-content detail">
      <v-title :titleTpye="titleTpye"></v-title>
      <div class="asorder-box">
        <div class="backup"><router-link to="/myOrders"><Icon type="ios-arrow-back" />返回订单列表</router-link></div>
        <!-- 退货进度条 -->
        <div class="order-steps">
          <div v-if="orderItem.status == 1" class="asorder-steps">
            <Steps :current="1" size="small">
                <Step title="下单成功" :content="handleDate(orderItem.createDate)"></Step>
                <Step title="待付款" content="" v-if="!orderItem.timeDifference"></Step>
                <Step title="待付款" :content="countDown" v-if="orderItem.timeDifference"></Step>
            </Steps>
          </div>
          <div v-if="orderItem.status == 2" class="asorder-steps">
            <Steps :current="1" size="small">
              <Step title="下单成功" :content="handleDate(orderItem.createDate)"></Step>
              <Step title="待发货" content="卖家正努力打包中"></Step>
            </Steps>
          </div>
          <div v-if="orderItem.status == 3" class="asorder-steps">
            <Steps :current="3" size="small">
              <Step title="下单成功" :content="handleDate(orderItem.createDate)"></Step>
              <Step title="已付款" :content="handleDate(orderItem.payDate)"></Step>
              <Step title="已发货"></Step>
              <Step title="待收货" content="" v-if="!orderItem.timeDifference"></Step>
              <Step title="待收货" :content="countDown" v-if="orderItem.timeDifference"></Step>
            </Steps>
          </div>
          <div v-if="orderItem.status == 4" class="asorder-steps">
            <Steps :current="4" size="small">
              <Step title="下单成功" :content="handleDate(orderItem.createDate)"></Step>
              <Step title="已付款" :content="handleDate(orderItem.payDate)"></Step>
              <Step title="已发货" :content="handleDate(sendGoodTime)"></Step>
              <Step title="已送达" :content="handleDate(getGoodTime)"></Step>
            </Steps>
          </div>
          <div v-if="orderItem.status == 5" class="asorder-steps">
            <Steps :current="3" size="small">
              <Step title="下单成功" :content="handleDate(orderItem.createDate)"></Step>
              <Step title="未付款" content="1小时内未付款"></Step>
              <Step title="已关闭" :content="handleDate(parseInt(orderItem.createDate) + 3600000)"></Step>
            </Steps>
          </div>
          </div>
        <!-- 订单产品 -->
        <div>
          <div class="asorder-item clearfix" v-for="(item, index) in orderItem.orderProductItems" :key="index">
            <div class="asorder-left">
              <div class="default-picture" @click="goPd(item.productId)"><img :src="item.defaultPicture" alt=""></div>
              <div class="text-info">
                <p @click="goPd(item.productId)" class="pd-name">{{handleName(item.name)}}</p>
                <!-- <p class="price">
                  <span>￥{{handlePrice(item.price)}}</span>
                  <span>×{{item.quantity}}</span>
                </p> -->
                <p class="value-name">{{handleValueName(item.orderProductSpecItems)}}</p>
              </div>
              
            </div>
            <div class="order-control">
              <p class="price">￥{{handlePrice(item.price)}}</p>
              <p>×{{item.quantity}}</p>
              <!-- <div class="status">{{statusText[orderItem.status]}}</div> -->
            </div>
          </div>
          <div class="order-detail-bottom">
            <!-- v-show="[4, 5].indexOf(orderItem.status) === -1" -->
            <div class="text-center">  
              <span class="btn-white" v-if="orderItem.status === 1" @click="cancelOrder(orderItem)">取消订单</span> <!-- 待付款-->
              <span class="btn-purple" v-if="orderItem.status === 1" @click="goPay(orderItem)">立即付款</span> <!-- 待付款-->
              <span class="btn-white" v-if="[2, 3].indexOf(orderItem.status) !== -1">联系客服</span><!-- 待发货-->
              <span class="btn-purple" v-if="[2, 3].indexOf(orderItem.status) !== -1" @click="goPayAgain(orderItem)" :class="{'btn-white': orderItem.status === 3}">再来一单</span><!-- 待发货、待收货-->
              <span class="btn-purple" v-if="orderItem.status === 3" @click="confirmGet(orderItem)">确认收货</span> <!-- 待收货-->
              <span class="btn-white" v-if="orderItem.status === 4" onclick="qimoChatClick();">申请售后</span><!-- 已完成-->
              <span class="btn-purple" v-if="orderItem.status === 4" @click="goPayAgain(orderItem)">再来一单</span> <!-- 已完成-->
              <span class="btn-purple" v-if="orderItem.status === 5" @click="goPayAgain(orderItem)">重新下单</span> <!-- 已关闭-->
            </div>
            <div class="odb-summary">
              <p>商品总价：￥{{handlePrice(totalPrice)}}</p>
              <p>运费： {{orderItem.freightPrice ? orderItem.freightPrice : '免运费'}}</p>
              <p>优惠扣减： -￥{{cuponPrice}}</p>
              <p class="price-text">实付：￥{{calcSum()}}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <!-- 订单其他信息 -->
    <div class="asorder-detail-content">
      <div class="asorder-box" v-if="orderItem">
        <div class="ab-item">
          <Row>
            <Col span="3">收货地址:</Col>
            <Col span="21">
              <div>
                <span class="receiverName">{{orderItem.orderAddressItem.receiverName}}</span>
                <span class="receiverMobile">{{`${orderItem.orderAddressItem.receiverMobile.substring(0, 3)}****${orderItem.orderAddressItem.receiverMobile.substring(7, 11)}`}}</span>
              </div>
              <div>{{orderItem.orderAddressItem.receiverAddress}}</div>
            </Col>
          </Row>
        </div>
        <div class="ab-item">
          <Row>
            <Col span="3">订单信息:</Col>
            <Col span="21" class="order-info">
              <div>
                订单编号：{{orderItem.number}}
                <input id="orderNumInput" type="text" v-model="orderItem.number" readonly style="position:absolute;top:-30px;">
                <button class="copy-btn" data-clipboard-target="#orderNumInput">复制单号</button>
              </div>
              <div> 创建时间：{{handleDate(orderItem.createDate)}}</div>
              <div v-if="[2, 3, 4].indexOf(orderItem.status) !== -1"> 付款时间：{{handleDate(orderItem.payDate)}} </div>
              <div v-if="[3, 4].indexOf(orderItem.status) !== -1"> 发货时间：{{handleDate(sendGoodTime)}} </div>
              <div v-if="[4].indexOf(orderItem.status) !== -1">收货时间：{{handleDate(getGoodTime)}}</div> 
            </Col>
          </Row>
        </div>
        <div class="ab-item">
          <Row>
            <Col span="3">备注:</Col>
            <Col span="21">{{orderItem.merchantRemark}}</Col>
          </Row>
        </div>
        <div class="ab-item">
          <Row>
            <Col span="3">员工编号:</Col>
            <Col span="21">{{orderItem.merchantRemark}}</Col>
          </Row>
        </div>
      </div>
    </div>
    <v-footer></v-footer>

    <div>
      <confirm v-model="confirm"title="已复制订单号" cancel-text=" "></confirm>
    </div>
    <Modal v-model="cashierFlag" footerHide :styles="{width: '1000px',top: '200px'}">
      <cashier :price="cashierPrice" :orderNum="orderNum"></cashier>
    </Modal>

  </div>
</template>
<script type="text/ecmascript-6">
import header1 from "../homePages/header1"
import header2 from "../homePages/header2"
import vFooter from "@/pages/homePages/footer.vue"
import vTitle from "@/pages/homePages/title.vue"
import Clipboard from 'clipboard'
import * as tool from '@/services/myTool.es6'
import * as orderAPI from '@/services/API/orderServices.es6'
import cashier from '@/components/cashier.vue'
import { XHeader, Scroller, Group, Cell, CellBox, Clocker, XButton, XTextarea, Confirm } from 'vux'
import * as cartAPI from '@/services/API/shoppingCartServices.es6'
export default {
  name: 'myOrderDetail',
  components: { header1, header2, vTitle, vFooter, cashier, XHeader, Scroller, Group, Cell, CellBox, Clocker, XButton, XTextarea, Confirm },
  data () {
    return {
      titleTpye: ["我的", "全部订单", "订单详情"],
      statusText: ['', '待付款', '待发货', '待收货', '已完成', '已关闭', '待退款', '退款失败', '已退款', '已完结'],
      orderNum: '',
      orderItem: '', //订单 
      cashierFlag: false,
      cashierPrice: 0,
      copyBtnObj: '',
      confirm: false,
      cuponPrice: 0,
      totalPrice: 0,
      countDown: ''
    }
  },
  mounted: function () {
    this.copyBtnObj = new Clipboard('.copy-btn')
    this.copyBtnObj.on('success', (e) => {
      this.confirm = true
    })
    let date = new Date()
    this.time = date.getTime() + 1000 * 60 * 60
    if (this.$route) {
      this.orderNum = this.$route.params.orderNum
      this.getOrder()
    }
  },
  methods: {
    // ----------跳转商品详情
    goPd (skuId) {
      this.$router.push({path: `../pd/${skuId}`})
    },
    getCountDown () { // 倒计时
      var myMinute, mySecond, myTime, myDay, myHour
      if (this.orderItem.timeDifference) {
        myTime = Math.abs(parseInt(this.orderItem.timeDifference))
        setInterval(() => {
          myTime -= 1
          myDay = Math.floor(myTime/3600/24)
          myHour = Math.floor((myTime/3600) % 24)
          myMinute = Math.floor((myTime / 60) % 60)
          mySecond = myTime % 60 

          if (this.orderItem.status === 3) { //确认收货
            this.countDown = `剩 ${myDay < 10 ? '0'+myDay : myDay} 天 ${myHour < 10 ? '0'+myHour : myHour} 小时 ${myMinute < 10 ? '0'+myMinute : myMinute} 分 ${mySecond < 10 ? '0'+mySecond : mySecond} 秒自动关闭`
          } else {
            this.countDown = `剩 ${myMinute < 10 ? '0'+myMinute : myMinute} 分 ${mySecond < 10 ? '0'+mySecond : mySecond} 秒自动关闭`
          }
          
        }, 1000)
      } 
    },
    getOrder () {
      this.$http.get(...orderAPI.getOrder(this.orderNum)).then(res => {
        if (res.data.code === 200) {
          this.orderItem = res.data.orderItem
          this.getCountDown ()   
          for (let i of this.orderItem.orderProductItems) {
            this.totalPrice += (i.price * i.quantity)
          }
          this.cuponPrice = tool.handlePrice(this.totalPrice - this.orderItem.amount)
        } else if (res.data.code === 3201) {
          this.$Message.warning('无相关订单')
          // this.$vux.toast.show({type: 'text', text: '无相关订单', width: '200px'})
        }
      })
    },
    handlePrice (price) {
      return tool.handlePrice(price)
    },
    handleName (name) {
      return tool.handleName(name)
    },
    handleValueName (arr) {
      let arr1 = []
      for (let i of arr) {
        i.specName === 'WeightOfGold&IsOnly1' ? arr1.push(i.specValueName + 'g') : arr1.push(i.specValueName)
      }
      return arr1.join(' ')
    },
    handleDate (time) {
      return tool.handleDate(time)
    },
    calcSum () {
      if (this.orderItem) {
        let sum = 0
        for (let i of this.orderItem.orderProductItems) {
          
          sum += i.sum
        }
        
        return tool.handlePrice(sum)
      }
      
    },
    // ----------取消订单
    cancelOrder (item) {
      let action = () => {
        this.$http.delete(...orderAPI.deleteOrder(item.number)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('取消成功')
            // this.$vux.toast.show({type: 'text', text: `取消成功`, width: '200px'})
            this.orderItem.status = 5
          } else {
            this.$Message.error('取消失败')
            // this.$vux.toast.show({type: 'text', text: `取消失败`, width: '200px'})
          }
        })
      }
      this.$Modal.confirm({
        // title: '是否取消订单',
        content: '是否取消订单',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          action()
        }
      });
      // this.$vux.confirm.show({
      //   content: '是否取消订单',
      //   confirmText: '是',
      //   cancelText: '否',
      //   onConfirm: () => {
      //     action()
      //   }
      // })
    },
    // ----------去付款
    goPay (order) {
      this.orderNum = order.number
      // this.cashierPrice = parseInt(this.calcSum())
      if (this.orderItem) {
        let sum = 0
        for (let i of this.orderItem.orderProductItems) {
          
          sum += i.sum
        }
        this.cashierPrice = sum
      }


      console.log(this.cashierPrice, 'this.cashierPrice')
       console.log(typeof this.cashierPrice)
      this.cashierFlag = true
    },
    // ----------再次购买
    goPayAgain (item) {
      let pl = []
      for (let i of item.orderProductItems) {
        pl.push({
          'merchantId': '123',
          'productId': i.productId,
          'productItemId': null,
          'quantity': i.quantity
        })
      }
      this.$http.post(...cartAPI.visitorCartItem(pl)).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('加入购物袋成功')
          // this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
        } else if (res.data.code === 1007) {
          this.$Message.error('购买数量超过库存')
          // this.$vux.toast.show({text: '购买数量超过库存', type: 'text', width: '200px'})
        } else if (res.data.code === 1008) {
          this.$Message.error('商品不可用')
          // this.$vux.toast.show({text: '商品不可用', type: 'text', width: '200px'})
        } else {
          this.$Message.success('加入购物袋成功')
          // this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
        }
      })
    },
    // ----------确认收货
    confirmGet (item) {
      let action = () => {
        this.$http.post(...orderAPI.receivingNote(item.number)).then(res => {
          if (res.data.code === 200) {
            this.orderItem.status = 4
            this.$router.push({path: `/orderOk/${item.number}`})
            this.$Message.success('确认成功')
            // this.$vux.toast.show({type: 'text', text: `确认成功`, width: '200px'})
          } else {
            this.$Message.error('确认失败')
            // this.$vux.toast.show({type: 'text', text: `确认失败`, width: '200px'})
          }
        })
      }
      this.$Modal.confirm({
          // title: '是否取消订单',
          content: '是否确认收货',
          okText: '确认',
          cancelText: '否',
          onOk: () => {
            action()
          }
      });
      // this.$vux.confirm.show({
      //   content: '是否确认收货',
      //   confirmText: '确认',
      //   onConfirm: () => {
      //     action()
      //   }
      // })
    }
  },
  computed: {
    sendGoodTime () {
      let time = ''
      if (this.orderItem.orderTrackItems) {
        for (let i of this.orderItem.orderTrackItems) {
          if (i.status === 3) {
            time = i.createDate
          }
        }
      }
      return time
    },
    getGoodTime () {
      let time = ''
      if (this.orderItem.orderTrackItems) {
        for (let i of this.orderItem.orderTrackItems) {
          if (i.status === 4) {
            time = i.createDate
          }
        }
      }
      return time
    }
  }
}
</script>
<style>
  .order-steps .asorder-steps .ivu-steps-main,.order-steps .asorder-steps .ivu-steps-head{
    width: 125px;
  }
  .order-steps .asorder-steps .ivu-steps-item .ivu-steps-main .ivu-steps-content{
    padding-left: 0;
    width: 125px;

  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .clocker {
    font-size: 14px;
    color: #7f7f7f;
  }
  .address {
    .address-bar1 {
      overflow: hidden;
      font-size: 16px;
      .receiverName {
        float: left;
      }
      .receiverMobile {
        float: right;
      }
    }
    .address-bar2 {
      padding: 5px 0px 0px 15px;
      p {
        font-size: 14px;
        color: #7f7f7f;
      }
    }
  }
  .default-picture {
    width: 88px;
    height: 88px;
    display: inline-block;
    vertical-align: middle;
    background: #eee;
    float: left;
    cursor: pointer;
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

    .pd-name {
      cursor: pointer;
    }
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .value-name {
      position: absolute;
      bottom: 0px;
    }
    .price {
      margin-top: 6px !important;
    }
    .quantity {
      position: absolute;
      right: 0px;
      top: 30px;
    }
    .btn {
      position: absolute;
      right: 0px;
      bottom: 0px;
    }
  }
  .price-text {
    color: red;
  }
  .order-number-time {
    color: #7f7f7f;
    font-size: 16px;
    .copy-btn {
      width: 40px;
      height: 20px;
      display: block;
      position: absolute;
      right: 20px;
      top: 10px;
      border: 1px solid #7f7f7f;
      background-color: #f8f8f8;
      line-height: 20px;
      text-align: center;
      border-radius: 6px;
      font-size: 12px;
    }
  }

  .sub-control {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
    background-color: #fff;
    border-top: 1px solid #d9d9d9;
    text-align: right;
    line-height: 50px;
    .btn-col-2-a, .btn-col-2-b {
      font-size: 16px;
      width: 30%;
      margin: 0px;
      display: inline-block;
      margin: 0px 10px 0px 0px;
    }
    .btn-col-2-a {
      // background-color: $tsl-color;
      color: #fff;
    }

  }
  .order-detail-bottom {
    position: relative;
    padding-bottom: 10px;

    .text-center {
      padding-top: 10px;
    }

    .odb-summary {
      position: absolute;
      right: 0;
      top: 0;
      text-align: right;

      p {
        margin-bottom: 4px;
      }
    }
  }
  .order-info div{
    margin-bottom: 8px;
  }

</style>
