<template>
  <div id="myOrders">
    <header1></header1>
    <header2></header2>

   
    <!-- <x-header v-show="!searching" :left-options="{backText: '', preventGoBack: true}" @on-click-back="backMine" title="我的订单">
      <div slot="right"><x-icon type="ios-search-strong" fill="#fff" @click.native="searching = true;setFocus()"></x-icon></div>
    </x-header> -->
    <div class="myorders">
       <v-title :titleTpye="titleTpye"></v-title>
      <div class="myorders-content">
        <div class="myorders-left">
          <ul>
            <li v-for="(item, index) in imgArr" :key="index" :class="{active: index==liIndex}" @click="init(index)">
              <img :src="item.src" alt=""> <span>{{item.content}}</span>
            </li>
          </ul>
        </div>
        <div class="myorders-right">
          <loading v-if="loading"></loading>
          <div class="null-coupons" v-if="list.length === 0">
            <img src="../../assets/icons/icon_order_empty.png" alt="">
            <div>目前您没有任何订单。</div>
          </div>
          <div v-if="list.length > 0">
            <div v-for="(item, index) in list" :key="index" class="myorder-item clearfix">
              <div class="asorder-left">
                <div v-for="(item2, index2) in item.orderProductItems" :key="index2" class="inner-item clearfix">
                  <div class="default-picture" @click="goPd(item2.productId)"><img :src="item2.defaultPicture" :alt="handleName(item.productName)"></div>
                  <div class="text-info">
                    <p class="pd-name" @click="goPd(item2.productId)">{{handleName(item2.name)}}</p>
                    <p class="price">
                      <span>￥{{handlePrice(item2.price)}}</span>
                      <span>×{{item2.quantity}}</span>
                    </p>
                    <p class="value-name">{{handleValueName(item2.orderProductSpecItems)}}</p>
                  </div>
                </div>
                
              </div>
              <div class="order-control">
                <p class="amount">实付:<span>￥{{handleAmount(item)}}</span></p>
                <div class="status">{{statusText[item.status]}}</div>
                <div class="btns-default" @click="goDetail(item.number)" :class="{'btns':statusText[item.status] === '已关闭'}">订单详情</div>
                <div v-if="item.status === 1" class="btns" @click="goPay(item)">立即付款</div>
                <div v-if="item.status === 1" style="margin-top: 5px; cursor: pointer" @click="cancelOrder(item)">取消订单</div>
                <div v-if="[2, 3, 4].indexOf(item.status) !== -1" class="btns-default" @click="goPayAgain(item)" type="default" :class="{'btns':item.status === 4 || item.status === 2}">再来一单</div>
                <div v-if="item.status === 3" class="btns" @click="confirmGet(item)">确认收货</div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="cashierFlag" footerHide :styles="{width: '1000px',top: '200px'}">
      <cashier :price="cashierPrice" :orderNum="orderNum"></cashier>
    </Modal>
    <v-footer></v-footer>
  </div>
</template>
<script type="text/ecmascript-6">
  import header1 from "../homePages/header1"
  import header2 from "../homePages/header2"
  import vFooter from "@/pages/homePages/footer.vue"
  import vTitle from "@/pages/homePages/title.vue"
  import * as tool from '@/services/myTool.es6'
  import loading from '@/pages/homePages/loading.vue'
  import * as orderAPI from '@/services/API/orderServices.es6'
  import { XHeader, Tab, TabItem, Scroller, Group, Cell, CellBox, XButton, Search } from 'vux'
  import cashier from '@/components/cashier.vue'
  import * as cartAPI from '@/services/API/shoppingCartServices.es6'
  let interval
  export default {
    name: 'myOrders',
    components: { header1, header2, vFooter, vTitle, cashier, XHeader, Tab, TabItem, Scroller, Group, Cell, CellBox, XButton, Search, loading },
    data () {
      return {
        searching: false,
        name_bs: '', // 输入框关键词
        name: '', // submit后确定的搜索关键词
        statusText: ['', '待付款', '待发货', '待收货', '交易完成', '已关闭', '待退款', '退款失败', '已退款', '已完结'],
        pageSize: 1000,
        pageNum: 1,
        pages: 0,
        list: [],
        loading: false,
        // pullupDefaultConfig: {
        //   content: '上拉刷新',
        //   pullUpHeight: 60,
        //   height: 40,
        //   autoRefresh: false,
        //   downContent: '释放后加载',
        //   upContent: '已到底端',
        //   loadingContent: '加载中...',
        //   clsPrefix: 'xs-plugin-pullup-'
        // },
        // pulldownDefaultConfig: {
        //   content: '下拉刷新',
        //   height: 40,
        //   autoRefresh: false,
        //   downContent: '下拉刷新',
        //   upContent: '释放后刷新',
        //   loadingContent: '加载中...',
        //   clsPrefix: 'xs-plugin-pulldown-'
        // },
        // ----------收银台
        cashierFlag: false,
        cashierPrice: 0,
        orderNum: '',
        titleTpye: ["首页", "我的", "全部订单"],
        imgArr: [
                  {src:require('../../assets/icons/odr_all.png'),content:'全部订单'},
                  {src:require('../../assets/icons/odr_pay.png'),content:'待付款'},
                  {src:require('../../assets/icons/odr_process.png'),content:'待发货'},
                  {src:require('../../assets/icons/odr_transfer.png'),content:'待收货'},
                  {src:require('../../assets/icons/odr_done.png'), content:'已完成'}
              ],
        liIndex: 0
      }
    },
    mounted: function () {
      this.getOrders()
        this.liIndex = this.$route.params.status
    },
    methods: {
      // ----------跳转商品详情
      goPd (skuId) {
        this.$router.push({path: `../pd/${skuId}`})
      },
      init (status) {
        this.liIndex = status
        this.$router.replace({path: `/myOrders/${status}`})
        this.getOrders()
      },
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
      getOrders (callback) {
        this.loading = true
        if (this.name === '') {
          let params = {status: this.status, pageSize: this.pageSize, pageNum: this.pageNum}
          this.$http.get(...orderAPI.getOrderList(params)).then(res => {
            if (res.data.code === 200) {
              this.loading = false
              if (this.pageNum === 1) {
                this.list = res.data.orderItems.list || []
                // this.$refs.scroller.donePulldown()
                // this.$refs.scroller.reset({top: 0})
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
                // this.$refs.scroller.donePulldown()
                this.$refs.scroller.reset({top: 0})
              } else {
                this.list = this.list.concat(res.data.orderItems.list || [])
                // this.$refs.scroller.donePullup()
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
        // console.log(order)
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
              this.$Message.success("取消成功");
              for (let i in this.list) {
                if (this.list[i].number === item.number) {
                  this.list[i].status = 5
                }
              }
            } else {
              this.$Message.error("取消失败");
            }
          })
        }
        this.$Modal.confirm({
            title: '是否取消订单',
            content: '是否取消订单',
            okText: '是',
            cancelText: '否',
            onOk: () => {
              action()
            }
        });
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
            this.$Message.success("加入购物袋成功");
          } else if (res.data.code === 1007) {
            this.$Message.warning("购买数量超过库存");
          } else if (res.data.code === 1008) {
            this.$Message.warning("商品不可用");
          } else {
            this.$Message.success("加入购物袋成功");
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
              this.$router.push({path: `/orderOk/${item.number}`})
            } else {
              this.$Message.error("确认失败");
            }
          })
        }
        this.$Modal.confirm({
          title: '是否确认收货',
          content: '是否取消订单',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            action()
          }
        });
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
        console.log(flag,'flag')
        if (!flag) {
          this.cashierPrice = 0
          this.orderNum = ''
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "~styles/common/common.styl";
    .myorders
        background #fafafa
        padding 0 60px 100px 60px 
        .myorders-content
            color $blue
            overflow hidden
            .myorders-left
                width 280px
                height 400px
                padding-top 40px 
                background-color #fff
                $mr(10px)
                float left
                li
                    text-align center
                    margin 10px 40px
                    cursor pointer
                    img 
                        width 40px
                        height 40px
                        vertical-align middle
                        $mr(20px)
                    span 
                        line-height 60px
                .active
                    $border(1,2px)
            .myorders-right
                height 400px;
                overflow-y auto;
                float left
                width 780px
               
                min-height 400px
                text-align center
                .null-coupons
                    background-color #fff
                    padding 94px 0 100px
                    
                    img
                      width 160px
                      margin 0 auto 20px

    .myorder-item
        // border-bottom 1px solid #ddd
        margin-bottom 10px
        padding: 30px;
        background #fff

        &:last-child 
          border-bottom none
          margin-bottom 0
          
        
        .inner-item 
          margin-bottom 10px
          padding-bottom 10px
        
          &:last-child 
            border-bottom none
            margin-bottom 0
            padding-bottom 0

        .asorder-left 
          float left
          width 560px

          .default-picture 
            width 88px
            height 88px
            display inline-block
            vertical-align middle
            background #fff
            float left
            border 1px solid #ddd
            padding 5px
            cursor pointer;

            img 
              display block
              font-size 14px
              width 100%
              height 100%
              overflow hidden
            
          

          .text-info 
            float left
            padding-left 10px
            font-size 14px
            position relative
            width 466px
            height 88px;
            text-align: left;

            .pd-name{
              cursor pointer;
            }

            .price 
              color #352665
              margin-top 15px

              span 
                margin-right 5px
              
        
        .order-control 
          width 140px
          float right
          text-align center
          font-size 12px
          .status 
            color red
          
          .amount 
            line-height 33px
            font-size 12px
            float none
            span 
              margin-left 8px

          .btns-default 
            text-align center
            width 118px
            padding 5px 20px
            border 1px solid #000
            color #000
            cursor pointer
            margin 8px auto 0
          
          .btns 
            text-align center
            background-color #352665
            width 118px
            padding 5px 20px
            color #fff
            margin 8px auto 0
            cursor pointer
            float none

                
</style>


