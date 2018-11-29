<template>
  <div id="myOrders">
    <x-header v-show="!searching" :left-options="{backText: '', preventGoBack: true}" @on-click-back="backMine" title="我的订单">
      <div slot="right"><x-icon type="ios-search-strong" fill="#fff" @click.native="searching = true;setFocus()"></x-icon></div>
    </x-header>

    <tab v-show="!searching">
      <tab-item :selected="status === 0" @on-item-click="changeStatus(0)">全部订单</tab-item>
      <tab-item :selected="status === 1" @on-item-click="changeStatus(1)">待付款</tab-item>
      <tab-item :selected="status === 2" @on-item-click="changeStatus(2)">待发货</tab-item>
      <tab-item :selected="status === 3" @on-item-click="changeStatus(3)">待收货</tab-item>
      <tab-item :selected="status === 4" @on-item-click="changeStatus(4)">已完成</tab-item>
    </tab>

    <search
      v-show="searching"
      ref="mySearch"
      v-model.trim="name_bs"
      cancel-text=" "
      @on-submit="onSubmit"
      auto-scroll-to-top>
      <a slot="right" href="javascript:" class="weui-search-bar__cancel-btn my-cancel" @click="onCancel">取消</a>
    </search>
    <div style="height:44px" v-show="searching"></div>

    <scroller
      lock-x
      ref="scroller"
      :height="searching ? '-44' : '-90'"
      use-pulldown
      use-pullup
      :pulldown-config="pulldownDefaultConfig"
      :pullup-config="pullupDefaultConfig"
      @on-pulldown-loading="pulldown"
      @on-pullup-loading="pullup">
      <div :style="listStyle">
        <div class="no-datas" v-if="list.length === 0">
          <img src="../../assets/images/nullOrder.svg" alt="">
          <span>无订单数据</span>
        </div>
        <group v-for="(item, index) in list" :key="index">
          <cell :value="statusText[item.status]"></cell>
          <cell-box v-for="(item2, index2) in item.orderProductItems" :key="index2" @click.native="goDetail(item.number)">
            <div class="default-picture"><img :src="item2.defaultPicture" alt=""></div>
            <div class="text-info">
              <p>{{handleName(item2.name)}}</p>
              <span class="value-name">{{handleValueName(item2.orderProductSpecItems)}}</span>
              <span class="price">￥{{handlePrice(item2.price)}}</span>
              <span class="quantity">×{{item2.quantity}}</span>
            </div>
          </cell-box>
          <cell-box>
            <div class="order-control">
              <span class="amount">实付:<span>￥{{handleAmount(item)}}</span></span>
              <div class="btns">
                <x-button v-if="item.status === 1" class="btn-col-2" @click.native="cancelOrder(item)">取消订单</x-button>
                <x-button v-if="item.status === 1" class="btn-col-2 btn-fill" @click.native="goPay(item)">去付款</x-button>
                <!-- <x-button v-if="item.status === 2" class="btn-col-2">提醒发货</x-button> -->
                <x-button v-if="[2, 3, 4].indexOf(item.status) !== -1" class="btn-col-2" @click.native="goPayAgain(item)">再次购买</x-button>
                <x-button v-if="item.status === 3" class="btn-col-2 btn-fill" @click.native="confirmGet(item)">确认收货</x-button>
              </div>
            </div>
          </cell-box>
        </group>
      </div>
    </scroller>

    <cashier v-model="cashierFlag" :price="cashierPrice" :orderNum="orderNum"></cashier>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as tool from '@/services/myTool.es6'
  import * as orderAPI from '@/services/API/orderServices.es6'
  import { XHeader, Tab, TabItem, Scroller, Group, Cell, CellBox, XButton, Search } from 'vux'
  import cashier from '@/components/cashier.vue'
  import * as cartAPI from '@/services/API/shoppingCartServices.es6'
  let interval
  export default {
    name: 'myOrders',
    components: { cashier, XHeader, Tab, TabItem, Scroller, Group, Cell, CellBox, XButton, Search },
    data () {
      return {
        searching: false,
        name_bs: '', // 输入框关键词
        name: '', // submit后确定的搜索关键词
        statusText: ['', '待付款', '待发货', '待收货', '交易完成', '已关闭', '待退款', '退款失败', '已退款', '已完结'],
        pageSize: 15,
        pageNum: 1,
        pages: 0,
        list: [],
        pullupDefaultConfig: {
          content: '上拉刷新',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '释放后加载',
          upContent: '已到底端',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        pulldownDefaultConfig: {
          content: '下拉刷新',
          height: 40,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '释放后刷新',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        // ----------收银台
        cashierFlag: false,
        cashierPrice: 0,
        orderNum: ''
      }
    },
    mounted: function () {
      this.getOrders()
    },
    methods: {
      setFocus () {
        clearInterval(interval)
        interval = setInterval(() => {
          if (this.$refs.mySearch) {
            setTimeout(() => {
              this.$refs.mySearch.setFocus()
            }, 100)
            clearInterval(interval)
          }
        }, 0)
      },
      setBlur (callback) {
        clearInterval(interval)
        interval = setInterval(() => {
          if (this.$refs.mySearch) {
            this.$refs.mySearch.setBlur()
            if (typeof callback === 'function') {
              callback()
            }
            clearInterval(interval)
          }
        }, 0)
      },
      onSubmit () {
        if (this.name_bs === '') {
          return
        }
        this.name = this.name_bs
        this.setBlur()
        this.pulldown()
      },
      onCancel () {
        this.setBlur(() => {
          setTimeout(() => {
            this.searching = false
          }, 300)
        })
        this.name = ''
        this.pulldown()
      },
      backMine () {
        this.$router.push({path: '/mine'})
      },
      changeStatus (status) {
        this.$router.replace({path: `/myOrders/${status}`})
        this.list = []
        this.getOrders(() => {
          this.$refs.scroller.reset({top: 0})
        })
      },
      getOrders (callback) {
        if (this.name === '') {
          let params = {status: this.status, pageSize: this.pageSize, pageNum: this.pageNum}
          this.$http.get(...orderAPI.getOrderList(params)).then(res => {
            if (res.data.code === 200) {
              if (this.pageNum === 1) {
                this.list = res.data.orderItems.list || []
                this.$refs.scroller.donePulldown()
                this.$refs.scroller.reset({top: 0})
              } else {
                this.list = this.list.concat(res.data.orderItems.list || [])
                this.$refs.scroller.donePullup()
              }
              this.pages = res.data.orderItems.pages
              if (typeof callback === 'function') {
                callback()
              }
            }
          })
        } else {
          let params = {name: this.name, pageSize: this.pageSize, pageNum: this.pageNum}
          this.$http.get(orderAPI.orderListName(params)).then(res => {
            if (res.data.code === 200) {
              if (this.pageNum === 1) {
                this.list = res.data.orderItems.list || []
                this.$refs.scroller.donePulldown()
                this.$refs.scroller.reset({top: 0})
              } else {
                this.list = this.list.concat(res.data.orderItems.list || [])
                this.$refs.scroller.donePullup()
              }
              this.pages = res.data.orderItems.pages
              if (typeof callback === 'function') {
                callback()
              }
            }
          })
        }
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
      handleAmount (order) {
        console.log(order, 'order')
        let amount = order.amount
        // for (let i of order.orderProductItems) {
        //   amount += i.sum
        // }
        return this.handlePrice(amount)
      },
      pulldown () {
        this.pageNum = 1
        this.getOrders()
      },
      pullup () {
        if (this.pageNum < this.pages) {
          this.pageNum++
          this.getOrders()
        } else {
          this.$refs.scroller.donePullup()
        }
      },
      goDetail (orderNum) {
        this.$router.push({path: `/myOrderDetail/${orderNum}`})
      },
      // ----------取消订单
      cancelOrder (item) {
        let action = () => {
          this.$http.delete(...orderAPI.deleteOrder(item.number)).then(res => {
            if (res.data.code === 200) {
              this.$vux.toast.show({type: 'text', text: `取消成功`, width: '200px'})
              for (let i in this.list) {
                if (this.list[i].number === item.number) {
                  this.list[i].status = 5
                }
              }
            } else {
              this.$vux.toast.show({type: 'text', text: `取消失败`, width: '200px'})
            }
          })
        }
        this.$vux.confirm.show({
          content: '是否取消订单',
          confirmText: '是',
          cancelText: '否',
          onConfirm: () => {
            action()
          }
        })
      },
      // ----------去付款
      goPay (order) {
        console.log(order)
        this.orderNum = order.number
        this.cashierPrice = order.amount
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
            this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
          } else if (res.data.code === 1007) {
            this.$vux.toast.show({text: '购买数量超过库存', type: 'text', width: '200px'})
          } else if (res.data.code === 1008) {
            this.$vux.toast.show({text: '商品不可用', type: 'text', width: '200px'})
          } else {
            this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
          }
        })
      },
      // ----------确认收货
      confirmGet (item) {
        let action = () => {
          this.$http.post(...orderAPI.receivingNote(item.number)).then(res => {
            if (res.data.code === 200) {
              for (let i in this.list) {
                if (this.list[i].number === item.number) {
                  this.list[i].status = 4
                }
              }
              // this.$vux.toast.show({type: 'text', text: `确认成功`, width: '200px'})
              this.$router.push({path: `/orderOk/${item.number}`})
            } else {
              this.$vux.toast.show({type: 'text', text: `确认失败`, width: '200px'})
            }
          })
        }
        this.$vux.confirm.show({
          content: '是否确认收货',
          confirmText: '确认',
          onConfirm: () => {
            action()
          }
        })
      }
    },
    computed: {
      status () {
        return this.$route ? parseInt(this.$route.params.status) : 0
      },
      listStyle () {
        return `min-height: ${document.body.clientHeight - 90}px;`
      }
    },
    watch: {
      cashierFlag (flag) {
        if (!flag) {
          this.cashierPrice = 0
          this.orderNum = ''
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.default-picture {
  width: 88px;
  height: 88px;
  display: inline-block;
  vertical-align: middle;
  background: #eee;
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
  .value-name {
    position: absolute;
    font-size: 12px;
    color: #999999;
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
.order-control {
  width: 100%;
  .amount {
    float: left;
    font-size: 16px;
    line-height: 33px;
    span {
      color: red;
    }
  }
  .btns {
    float: right;
    width: auto;
    .btn-col-2 {
      font-size: 16px;
      width: 100px;
      margin: 0px;
      display: inline-block;
    }
    .btn-fill {
      background-color: $tsl-color;
      color: #fff;
    }
  }
}
.no-datas {
  line-height: 50px;
  font-size: 14px;
  color: #7f7f7f;
  text-align: center;
  position: absolute;
  width: 100%;
  img {
    display: block;
    margin: 20% auto 0px;
  }
}
</style>
