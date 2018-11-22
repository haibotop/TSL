<template>
  <div id="asOrders">
    <header1></header1>
    <header2></header2>
    <div class="asorder-content">
      <v-title :titleTpye="titleTpye"></v-title>
       <div class="asorder-box">
        <div class="no-datas" v-if="list.length === 0">暂无数据</div>
        <div v-for="(item, index) in list" :key="index" class="asorder-item clearfix">
          
          <div class="asorder-left">
            <div class="default-picture"><img :src="item.defaultPicture" :alt="handleName(item.productName)"></div>
            <div class="text-info">
              <p>{{handleName(item.productName)}}</p>
              <p class="price">
                <span>￥{{handlePrice(item.price)}}</span>
                <span>×{{item.quantity}}</span>
              </p>
            </div>
          </div>
          <div class="order-control">
            <p class="amount">退款金额:<span>￥{{handlePrice(item.sum)}}</span></p>
            <p class="amount" v-show="item.refundOrderItem">实退款金额:<span>￥{{item.refundOrderItem ? handlePrice(item.refundOrderItem.actuallyRefundAmount) : '--'}}</span></p>
            <div class="status">{{statusText[item.status]}}</div>
            <div class="btns" @click="goDetail(item.afterSaleNo)">订单详情</div>
          </div>
          
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>
<script type="text/ecmascript-6">
  import header1 from "../homePages/header1"
  import header2 from "../homePages/header2"
  import vFooter from "@/pages/homePages/footer.vue"
  import vTitle from "@/pages/homePages/title.vue"
  import * as tool from '@/services/myTool.es6'
  import * as orderAPI from '@/services/API/orderServices.es6'
  import { Cell, CellBox, XButton } from 'vux'
  export default {
    name: 'asOrders',
    components: { 
      Cell, 
      CellBox, 
      XButton,
      header1,
      header2, 
      vFooter,
      vTitle
    },
    data () {
      return {
        titleTpye: ["首页", "我的", "售后订单"],
        statusText: ['', '待审核', '审核通过', '审核不通过', '待退货', '退货失败', '待退款', '退款失败', '已退款'],
        pageSize: 15,
        pageNum: 1,
        pages: 0,
        list: [],
        
        orderNum: ''
      }
    },
    mounted: function () {
      this.getOrders(this.pageSize, this.pageNum)
    },
    methods: {
      getOrders (pageSize, pageNum) {
        this.$http.get(orderAPI.getAsOrders(pageSize, pageNum))
        .then(res => {
          if (res.data.code === 200) {
            console.log(res.data)
            this.list = res.data.afterSaleOrderItems.list
            // if (this.pageNum === 1) {
            //   this.$refs.scroller.donePulldown()
            //   this.$refs.scroller.reset()
            // } else {
            //   this.$refs.scroller.donePullup()
            // }
            this.pages = res.data.afterSaleOrderItems.pages
            // this.$nextTick(() => {
            //   this.$refs.scroller.reset()
            // })
          }
        })
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      handleName (name) {
        return tool.handleName(name)
      },
      /*pulldown () {
        this.pageNum = 1
        this.getOrders(this.pageSize, this.pageNum)
      },
      pullup () {
        if (this.pageNum < this.pages) {
          this.pageNum++
          this.getOrders(this.pageSize, this.pageNum)
        } else {
          this.$refs.scroller.donePullup()
        }
      },*/
      goDetail (afterSaleNo) {
        this.$router.push({path: `/asOrderDetail/${afterSaleNo}`})
      }
    },
    computed: {
      // listStyle () {
      //   return `min-height: ${document.body.clientHeight - 90}px;`
      // }
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
<style rel="stylesheet/scss" lang="scss">
  @import "~styles/_global.scss";
  .asorder-content {
    padding: 48px 48px 100px;
    background-color: #fafafa;

    .asorder-box {
      background-color: #fff;
      padding: 48px;
      margin-top: 30px;

      .asorder-item {
        border-bottom: 1px solid #ddd;
        margin-bottom: 48px;
        padding-bottom: 48px;

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .asorder-left {
          float: left;
          width: 765px;

          .default-picture {
            width: 88px;
            height: 88px;
            display: inline-block;
            vertical-align: middle;
            background: #fff;
            float: left;
            border: 1px solid #ddd;
            padding: 10px;

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
            // width: calc(100% - 98px);
            width: 677px;
            height: 88px; 

            .price {
              color: #352665;
              margin-top: 15px;

              span {
                margin-right: 5px;
              }
            }
          } 
        }

        .order-control {
          width: 200px;
          float: right;
          text-align: center;

          .status {
            color: red;
          }

          .amount {
            font-size: 16px;
            line-height: 33px;
            span {
              color: red;
            }
          }
          .btns {
            text-align: center;
            background-color: #352665;
            width: 118px;
            padding: 3px 20px;
            color: #fff;
            margin: 8px auto 0;
          }
        }
      }
    }
  }
  



.no-datas {
  text-align: center;
  padding: 10px 0px;
}
</style>
