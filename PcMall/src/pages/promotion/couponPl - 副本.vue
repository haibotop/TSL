<template>
  <div id="couponPl">
    <Search
      class="cp-search"
      :placeholder="placeholder"
      v-model.trim="keyWord"
      cancel-text="取消"
      @on-submit="onSubmit"
      auto-scroll-to-top>
      <x-icon slot="left" type="ios-arrow-back" size="35" style="fill:#fff;position:relative;left:-3px;" @click="goBack"></x-icon>
    </Search>
    <tab>
      <tab-item :selected="currTabSort === 0" @on-item-click="setTabItem(0)">综合</tab-item>
      <tab-item :selected="currTabSort === 1" @on-item-click="setTabItem(1)">
        <span class="tab-item-sort">销量
          <!-- <i class="up" :style="triangles[1][0]"></i>
          <i class="down" :style="triangles[1][1]"></i> -->
          <x-icon v-show="currTabSort === 1" type="arrow-down-a" size="14" style="margin-bottom: -2px;"></x-icon>
          <x-icon v-show="currTabSort !== 1" type="arrow-down-a" size="14" fill="#ddd" style="margin-bottom: -2px;"></x-icon>
        </span>
      </tab-item>
      <tab-item :selected="currTabSort === 2" @on-item-click="setTabItem(2)">
        <span class="tab-item-sort">价格
          <x-icon v-show="currTabSort === 2" type="arrow-down-a" size="14" style="margin-bottom: -2px;"></x-icon>
          <x-icon v-show="currTabSort !== 2" type="arrow-down-a" size="14" fill="#ddd" style="margin-bottom: -2px;"></x-icon>
        </span>
      </tab-item>
      <tab-item :selected="currTabSort === 3" @on-item-click="setTabItem(3)">
        <span class="tab-item-sort">时间
          <x-icon v-show="currTabSort === 3" type="arrow-down-a" size="14" style="margin-bottom: -2px;"></x-icon>
          <x-icon v-show="currTabSort !== 3" type="arrow-down-a" size="14" fill="#ddd" style="margin-bottom: -2px;"></x-icon>
        </span>
      </tab-item>
    </tab>
    <scroller
      ref="scroller"
      lock-x
      use-pullup
      @on-pullup-loading="onPullup"
      use-pulldown
      @on-pulldown-loading="onPulldown"
      height="-91">
      <div :class="listLayout" :style="listStyle">
        <div class="no-datas" v-if="(datas || []).length === 0">暂无数据</div>
        <div class="block" v-for="(item, index) in datas" :key="index" @click="goPd(item.id)">
          <div class="img-block">
            <div class="img-block-inner">
              <img :src="item.picture" alt="">
            </div>
          </div>
          <div class="info-block">
            <p class="name">
              {{handleName(item.name)}}
            </p>
            <span v-show="!discountClass" :class="discountClass ? 'discountPrice' : 'price' ">{{ '￥' + handlePrice(item.price) }}</span>
            <span class="price" v-show="discountClass">{{'￥' + item.discountPrice}}</span>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as tool from '@/services/myTool.es6'
  import * as mkApi from '@/services/API/marketing.es6'
  import { XHeader, Icon, Tab, TabItem, Scroller, Search } from 'vux'
  let timeout = ''
  let interval
  export default {
    name: 'couponPl',
    components: {
      XHeader,
      Icon,
      Tab,
      TabItem,
      Scroller,
      Search
    },
    data () {
      return {
        discountClass: false,
        currentPage: 1,
        pageSize: 10,
        totalCount: null,
        totalPage: null,
        color: '#352665',
        keyword: '',
        catalogId: '',
        catalogName: '',
        catalogType: '',
        leftOption: {
          'showback': false,
          'backText': ''
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
        // ----------0综合 1销量 2价格 3评论
        currTabSort: 0,
        // ----------1升序 2降序
        sort: 1,
        // 商品列表
        datas: [],
        // 搜索条件
        keyWord: '',
        placeholder: '',
        listLayout: 'row-layout'
      }
    },
    mounted: function () {
      this.getPl()
      interval = setInterval(() => {
        if (this.$refs.scroller) {
          this.$refs.scroller.reset()
          clearInterval(interval)
        }
      }, 0)
    },
    methods: {
      getPl () {
        let param = {}
        // sort 0:综合排序、1：销量降序、2：价格升序、3:时间降序
        switch (this.currTabSort) {
          case 0:
            param.zongStatus = 1
            param.svStatus = null
            param.priceStatus = null
            param.dateStatus = null
            break
          case 1:
            param.zongStatus = null
            param.svStatus = 1
            param.priceStatus = null
            param.dateStatus = null
            break
          case 2:
            param.zongStatus = null
            param.svStatus = null
            param.priceStatus = 1
            param.dateStatus = null
            break
          case 3:
            param.zongStatus = null
            param.svStatus = null
            param.priceStatus = null
            param.dateStatus = 1
            break
        }
        param.promotionId = this.$route.query.couponId || this.$route.query.promotionId || this.$route.query.discountcode
          console.log('折扣码11111', param)
        this.getProduct(param, this.pageSize, this.currentPage)
      },
      //  ---------- 根据优惠券信息获取商品集合
      getProduct (param, pageSize, pageNum) {
        let api = ''
        if (this.$route.query.couponId) {
          api = mkApi.getCouponSku
        } else if (this.$route.query.promotionId) {
          api = mkApi.getPromSku
        } else if (this.$route.query.discountcode) {
            api = mkApi.getDiscountProduct
        }  else {
          return
        }
        this.$http.post(...api(param, pageSize, pageNum)).then(res => {
          this.handleRes(true, res)
        }).catch(() => {
          this.handleRes(false)
        })
      },
      // ----------处理数据
      handleRes (flag, res) {
        if (flag) {
          // http 200
          if (res.data.code === 200) {
            // 首刷 || 下拉
            if (this.currentPage === 1) {
              this.datas = res.data.productSkuVOInfo.list
              for (var i in this.datas) {
                this.datas[i].discountPrice = this.getDiscountPrice(res.data.promotionInfo, this.datas[i].price)
              }
              if (res.data.promotionInfo.type === 3 || res.data.promotionInfo.type === 4) {
                this.discountClass = true
              } else {
                this.discountClass = false
              }
              console.log('datas', this.datas)
              this.$refs.scroller.donePulldown()
              this.$refs.scroller.reset({top: 0})
            } else {
              // 上拉
              this.datas = this.datas.concat(res.data.productSkuVOInfo.list)
              this.$refs.scroller.donePullup()
            }
            this.totalCount = res.data.page.totalCount
            this.totalPage = res.data.page.totalPage
          }
        } else {
          // http !200
          if (this.currentPage === 1) {
            this.$refs.scroller.donePulldown()
          } else {
            this.$refs.scroller.donePullup()
          }
        }
      },
      // ---计算促销后的价格
      getDiscountPrice (discountParams, price) {
        if (discountParams.type === 3) { // 单品折扣
          price = parseInt(price * discountParams.discount * 0.01) + price % 100
          if (discountParams.typeAlone === 1) { // 元级取整
            price = tool.handlePrice(price)
            price = parseInt(price)
          } else if (discountParams.typeAlone === 2) {
            price = tool.handlePrice(price)
            price = parseFloat(price).toFixed(1)
          }
        } else if (discountParams.type === 4) { // 直降
          price = price - discountParams.directAmount
          price = tool.handlePrice(price)
        } else {
          price = tool.handlePrice(price)
        }
        return price
      },
      // ----------切换tab及sort
      setTabItem (index) {
        if (this.currTabSort === index && index === 0) {
          return
        }
        if (this.currTabSort === index && this.sort === 1) {
          this.sort = 2
        } else if (this.currTabSort === index && this.sort === 2) {
          this.sort = 1
        } else {
          this.sort = 1
        }
        this.currTabSort = index
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          this.getPl()
          clearTimeout(timeout)
          timeout = ''
        }, 300)
      },
      onPulldown () {
        this.currentPage = 1
        this.getPl()
      },
      // ----------上拉
      onPullup () {
        if (this.currentPage < this.totalPage) {
          this.currentPage++
          this.getPl()
        } else {
          this.$refs.scroller.donePullup()
        }
      },
      // ----------跳转商品详情
      goPd (skuId) {
        this.$router.push({path: `../pd/${skuId}`})
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      handleName (name) {
        return tool.handleName(name)
      },
      // 处理搜索条件
      onSubmit () {
        if (this.isEmpty(this.keyWord)) {
          return
        }
        let param = {}
        // sort 0:综合排序、1：销量降序、2：价格升序、3:时间降序
        switch (this.currTabSort) {
          case 0:
            param.zongStatus = 1
            param.svStatus = null
            param.priceStatus = null
            param.dateStatus = null
            break
          case 1:
            param.zongStatus = null
            param.svStatus = 1
            param.priceStatus = null
            param.dateStatus = null
            break
          case 2:
            param.zongStatus = null
            param.svStatus = null
            param.priceStatus = 1
            param.dateStatus = null
            break
          case 3:
            param.zongStatus = null
            param.svStatus = null
            param.priceStatus = null
            param.dateStatus = 1
            break
        }
        param.promotionId = this.$route.query.couponId
        param.name = this.keyWord
        this.getProduct(param, this.pageSize, this.currentPage)
      },
      isEmpty (val) {
        return /^[' ']*$/.test(val)
      },
      goBack () {
        this.$router.go(-1)
      }
    },
    computed: {
      // 三角形样式
      triangles () {
        let wrapper = [['', ''], ['', ''], ['', ''], ['', '']]
        for (let i in wrapper) {
          if ([1, 3].indexOf(this.currTabSort) !== -1) {
            wrapper[i][0] = ''
            wrapper[i][1] = this.currTabSort === parseInt(i) ? `border-top-color: ${this.color}` : ''
          } else {
            wrapper[i][0] = this.currTabSort === parseInt(i) && this.sort === 1 ? `border-bottom-color: ${this.color}` : ''
            wrapper[i][1] = this.currTabSort === parseInt(i) && this.sort === 2 ? `border-top-color: ${this.color}` : ''
          }
        }
        return wrapper
      },
      listStyle () {
        return `min-height: ${document.body.clientHeight - 90}px;`
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.search-bar {
  position: absolute;
  left: 50px;
  top: 9px;
  width: 80%;
  height: 28px;
  background: #f2f2f2;
  border-radius: 6px;
  .search-icon {
    float: left;
    line-height: 30px;
    margin: 0px 0px 0px 10px;
  }
  .search-text {
    float: left;
    margin: 0px 0px 0px 5px;
    line-height: 28px;
  }
}
.tab-item-sort {
  position: relative;
  .up {
    position: absolute;
    top: calc(50% - 6px);
    right: -15px;
    width: 0px;
    height: 0px;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #ddd;
    border-left: 4px solid transparent;
  }
  .down {
    position: absolute;
    bottom: calc(50% - 6px);
    right: -15px;
    width: 0px;
    height: 0px;
    border-top: 4px solid #ddd;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
}
.no-datas {
  text-align: center;
  padding: 10px 0px;
}
.column-layout {
  position: relative;
  overflow: hidden;
  width: calc(100% - 10px);
  padding: 10px 10px 0px 0px;
  .block {
    position: relative;
    float: left;
    margin: 0px 0px 10px 10px;
    width: calc(50% - 10px);
    background:#fff;
  }
  .img-block {
    width: 100%;
    position: relative;
    img {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      background: #ddd;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .img-block:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .info-block {
    padding: 0 5px;
    .name {
      width: 100%;
      height: 50px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .price {
      bottom: 0;
      font-weight: 400;
    }
  }
}
.row-layout {
  position: relative;
  width: 100%;
  .block {
    position: relative;
    overflow: hidden;
    width: 100%;
    border-bottom: 1px solid #eee;
    background: rgb(250,250,250);
  }
  .img-block {
    width: 100%;
  }
  .img-block-inner {
    width: 28%;
    height: 100%;
    position: relative;
    float: left;
    img {
      background: #ddd;
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .img-block-inner:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .info-block {
    width: calc(72% - 24px);
    padding: 0px 14px 0px 10px;
    position: absolute;
    top: 0;
    bottom: 0px;
    right: 0;
    float: left;
    .name {
      padding: 0;
      width: 100%;
      height: 100%;
      display: -webkit-box;
      display: flex;
      display: -webkit-flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      overflow: hidden;
      font-size: 14px;
      line-height: 20px;

    }
    .price {
      position: absolute;
      bottom: 5px;
      right: 14px;
      font-size: 14px;
      font-weight: 400;
      color:#352665;
    }
    .discountPrice {
      position: absolute;
      bottom: 5px;
      right: 0px;
      font-size: 14px;
      font-weight: 400;
      text-decoration: line-through;
      color: #ccc;
      display: inline-block;
      width: 35%;
      text-align: left;
      text-indent: 1em;
    }
    .discount-price {
      position: absolute;
      bottom: 3px;
      right: 84px;
      font-size: 18px;
      font-weight: 400;
      color: red;
      display: inline-block;
      width: 47%;
      text-align: right;
    }
  }
}
.my-cancel {
  margin: 0px;
}
.search-header div.vux-header-title-area{
  margin: 8px 10% !important;
}
.cp-search {
  width: 100%;
}
</style>

