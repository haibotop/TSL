<template>
  <div id="asOrders">
    <x-header :left-options="{backText: ''}" title="售后订单"></x-header>
    <scroller
      lock-x
      ref="scroller"
      height="-46"
      use-pulldown
      use-pullup
      :pulldown-config="pulldownConfig"
      :pullup-config="pullupConfig"
      @on-pulldown-loading="pulldown"
      @on-pullup-loading="pullup">
      <div :style="listStyle">
        <div class="no-datas" v-if="list.length === 0">暂无数据</div>
        <group v-for="(item, index) in list" :key="index">
          <cell :value="statusText[item.status]"></cell>
          <cell-box @click.native="goDetail(item.afterSaleNo)">
            <div class="default-picture"><img :src="item.defaultPicture" :alt="handleName(item.productName)"></div>
            <div class="text-info">
              <p>{{handleName(item.productName)}}</p>
              <span class="price">￥{{handlePrice(item.price)}}</span>
              <span class="quantity">×{{item.quantity}}</span>
            </div>
          </cell-box>
          <cell-box>
            <div class="order-control">
              <span class="amount" style="margin-right:20px;">退款金额:<span>￥{{handlePrice(item.sum)}}</span></span>
              <span class="amount" v-show="item.refundOrderItem">实退款金额:<span>￥{{item.refundOrderItem ? handlePrice(item.refundOrderItem.actuallyRefundAmount) : '--'}}</span></span>
              <div class="btns">
              </div>
            </div>
          </cell-box>
        </group>
      </div>
    </scroller>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as tool from '@/services/myTool.es6'
  import * as orderAPI from '@/services/API/orderServices.es6'
  import { XHeader, Tab, TabItem, Scroller, Group, Cell, CellBox, XButton } from 'vux'
  export default {
    name: 'asOrders',
    components: { XHeader, Tab, TabItem, Scroller, Group, Cell, CellBox, XButton },
    data () {
      return {
        statusText: ['', '待审核', '审核通过', '审核不通过', '待退货', '退货失败', '待退款', '退款失败', '已退款'],
        pageSize: 15,
        pageNum: 1,
        pages: 0,
        list: [],
        pulldownConfig: {
          content: 'Pull Down To Refresh',
          height: 60,
          autoRefresh: false,
          downContent: 'Pull Down To Refresh',
          upContent: 'Release To Refresh',
          loadingContent: 'Loading...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        pullupConfig: {
          content: 'Pull Up To Refresh',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: 'Release To Refresh',
          upContent: 'Pull Up To Refresh',
          loadingContent: 'Loading...',
          clsPrefix: 'xs-plugin-pullup-'
        },
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
            if (this.pageNum === 1) {
              this.$refs.scroller.donePulldown()
              this.$refs.scroller.reset()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.pages = res.data.afterSaleOrderItems.pages
            this.$nextTick(() => {
              this.$refs.scroller.reset()
            })
          }
        })
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      handleName (name) {
        return tool.handleName(name)
      },
      pulldown () {
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
      },
      goDetail (afterSaleNo) {
        this.$router.push({path: `/asOrderDetail/${afterSaleNo}`})
      }
    },
    computed: {
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
    text-align: right;
    .btn-col-2 {
      font-size: 16px;
      width: 30%;
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
  text-align: center;
  padding: 10px 0px;
}
</style>
