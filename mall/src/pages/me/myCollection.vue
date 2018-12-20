<template>
  <div id="myCollection">
    <x-header :left-options="{backText: ''}" title="全部宝贝"></x-header>
    <div class="madeOrder" v-show="madeOrderStatus">
      <span>您挑选的 99 件订制货品尚未付款发货。</span>
      <a href="javascript:void(0);" class="lookMore">查看</a>
    </div>
    <div v-show="datas.length === 0" class="noProduct-tips">
      <img src="../../assets/images/nullCollection.svg" alt="">
      <span>无收藏商品</span>
    </div>
    <div class="controll-bar">
      <!-- <checker v-model="haveStock" default-item-class="default-item-class" selected-item-class="selected-item-class">
        <checker-item value="1">仅看有货</checker-item>
      </checker> -->
      <group gutter="0px" style="height:45px;">
        <x-switch title="仅看有货" v-model="haveStock"></x-switch>
      </group>
      <span class="edit-text" v-show="!status" @click="status = true">编辑</span>
      <span class="ok-text" v-show="status" @click="status = false">完成</span>
    </div>

    <scroller
      v-show="datas.length !== 0"
      ref="scroller"
      lock-x
      v-model="scrollerStatus"
      use-pullup
      @on-pullup-loading="onPullup"
      use-pulldown
      @on-pulldown-loading="onPulldown"
      height="-82"
      :pulldown-config="pulldownDefaultConfig"
      :pullup-config="pullupDefaultConfig">

      <div :class="listLayout" :style="listStyle">
        <div class="block" v-show="datas.length !== 0" v-for="(item, index) in datas" :key="index">
          <checker v-show="status" v-model="flags[index]" style="float:left;">
            <checker-item value="1">
              <check-icon v-show="flags[index] === '1'" :value="true"></check-icon>
              <check-icon v-show="flags[index] !== '1'" :value="false"></check-icon>
            </checker-item>
          </checker>
          <div class="img-block" @click="goPd(item)">
            <img :src="item.defaultPicture" alt="">
            <div class="img-mask" v-show="item.status === 2 || item.stock === 0"><div class="circle"><span class="middle" v-show="item.status === 2">售罄</span><span class="middle" v-show="item.status === 1 && item.stock === 0">无库存</span></div></div>
          </div>
          <div class="info-block" @click="goPd(item)">
            <p class="name">{{handleName(item.name)}}</p>
            <span class="price" :style="`color: ${color};`">{{ '￥' + handlePrice(item.price) }}</span>
          </div>
          <!-- <x-icon v-show="!status && item.status !== 2 && item.stock !== 0" @click="postCartItem(item.productId)" type="ios-cart-outline" size="30" style="fill:#352665;position:absolute;right:0px;top:60px;"></x-icon> -->
          <img v-show="!status && item.status !== 2 && item.stock !== 0" @click="postCartItem(item.productId)" src="../../assets/icons/bag.svg" type="image/svg+xml" style="position:absolute;right:0px;top:60px;"/>
        </div>
      </div>



    </scroller>
    <div v-show="status" class="edit-sub-bar">
      <div class="check-all">
        <checker v-model="checkAll" style="float:left;margin: 0px 0px 0px 5%;">
          <checker-item value="1">
            <check-icon v-show="checkAll === '1'" :value="true"></check-icon>
            <check-icon v-show="checkAll !== '1'" :value="false"></check-icon>
          </checker-item>
        </checker>
        全选
      </div>
      <div class="remove-btn" @click="removeCollections">移除</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as myAPI from '../../services/API/mineServices.es6'
  import * as pdAPI from '@/services/API/pdServices.es6'
  import * as tool from '@/services/myTool.es6'
  import { XHeader, Checker, CheckerItem, Scroller, CheckIcon, debounce, Group, XSwitch } from 'vux'
  export default {
    name: 'myCollection',
    components: { XHeader, Checker, CheckerItem, Scroller, CheckIcon, debounce, Group, XSwitch },
    data () {
      return {
        madeOrderStatus: true,
        color: '#352665',
        // haveStock: '',
        haveStock: false,
        status: false, // 页面编辑|查看状态
        datas: [],
        flags: [],
        listLayout: 'row-layout',
        // ----------上拉或下拉的状态
        scrollerStatus: {
          pulldownStatus: 'default',
          pullupStatus: 'default'
        },
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
        pageNum: 1,
        pageSize: 6,
        size: 0,
        total: 0,
        pages: 0
        // ----------选择
        // checkAll: ''
      }
    },
    mounted: function () {
      this.getCollection(this.pageNum, this.pageSize)
    },
    methods: {
      getCollection (pageNum, pageSize, callback) {
        let thenCallback = (res) => {
          if (res.data.code === 200) {
            if (this.pageNum === 1) {
              this.flags = []
              res.data.pageInfo.list.forEach(element => {
                this.flags.push('')
              })
              this.size = res.data.pageInfo.size
              this.total = res.data.pageInfo.total
              this.pages = res.data.pageInfo.pages
              this.datas = res.data.pageInfo.list
              setTimeout(() => {
                this.$refs.scroller.donePulldown()
              }, 30)
              this.$refs.scroller.reset({top: 0})
            } else {
              res.data.pageInfo.list.forEach(element => {
                this.flags.push('')
              })
              this.size += res.data.pageInfo.size
              this.total = res.data.pageInfo.total
              this.pages = res.data.pageInfo.pages
              this.datas = this.datas.concat(res.data.pageInfo.list)
              setTimeout(() => {
                this.$refs.scroller.donePullup()
              }, 30)
              this.$refs.scroller.reset()
            }
          }
        }
        let catchCallback = () => {
          this.$refs.scroller.donePullup()
          this.$refs.scroller.donePulldown()
        }
        if (this.haveStock) {
          this.$http.get(...myAPI.getProductCollectHasStock({pageNum: pageNum, pageSize: pageSize})).then(res => {
            thenCallback(res)
          }).catch(() => {
            catchCallback()
          })
        } else {
          this.$http.get(...myAPI.getProductCollect({pageNum: pageNum, pageSize: pageSize})).then(res => {
            thenCallback(res)
          }).catch(() => {
            catchCallback()
          })
        }
      },
      // ----------上拉
      onPullup () {
        if (this.size >= this.total) {
          setTimeout(() => {
            this.$refs.scroller.donePullup()
          }, 30)
          return
        }
        this.getCollection(++this.pageNum, this.pageSize)
      },
      // ----------下拉
      onPulldown () {
        this.pageNum = 1
        this.getCollection(this.pageNum, this.pageSize)
      },
      removeCollections () {
        if (this.flags.indexOf('1') === -1) {
          this.$vux.toast.show({text: '未选择商品', type: 'text', width: '200px'})
          return
        }
        let action = () => {
          let collectIds = []
          for (let i in this.flags) {
            if (this.flags[i] === '1') {
              collectIds.push(this.datas[i].id)
            }
          }
          this.$http.post(...myAPI.deleteProductCollects(collectIds)).then(res => {
            if (res.data.code === 200) {
              let datas = []
              for (let i of this.datas) {
                if (collectIds.indexOf(i.id) === -1) {
                  datas.push(i)
                }
              }
              let flags = []
              datas.forEach(e => {
                flags.push('')
              })
              this.datas = datas
              this.flags = flags
            }
          })
        }
        this.$vux.confirm.show({
          content: '是否确认移除商品',
          confirmText: '确认',
          onConfirm: () => {
            action()
          }
        })
      },
      // ----------pd
      goPd (item) {
        if (item.status === 1) {
          this.$router.push({path: `/pd/${item.productId}`})
        }
      },
      handleName (name) {
        return tool.handleName(name)
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      // ----------加入购物车
      postCartItem (skuId) {
        if (!skuId) { return }
        let cartItemData = {
          memberId: null,
          merchantId: '123',
          productId: skuId,
          productItemId: null,
          quantity: 1
        }
        this.$http.post(...pdAPI.postCartItem(cartItemData), {certified: true}).then((response) => {
          if (response.data.code === 200) {
            this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
          } else {
            this.$vux.toast.show({text: response.data.message, type: 'text', width: '200px'})
          }
        })
      }
    },
    computed: {
      checkAll: {
        get () {
          let num = 0
          this.flags.forEach(e => {
            if (e === '1') {
              num++
            }
          })
          return num === this.flags.length ? '1' : ''
        },
        set (flag) {
          let num = 0
          this.flags.forEach(e => {
            if (e === '1') {
              num++
            }
          })
          if (num !== this.flags.length - 1) {
            for (let i in this.flags) {
              this.flags[i] = flag || ''
            }
            this.datas = JSON.parse(JSON.stringify(this.datas))
          }
        }
      },
      listStyle () {
        return this.status ? `min-height: ${document.body.clientHeight - 141}px;` : `min-height: ${document.body.clientHeight - 91}px;`
      }
    },
    watch: {
      status (flag) {
        if (flag) {
          this.listLayout = 'edit-layout'
        } else {
          this.listLayout = 'row-layout'
          for (let i in this.flags) {
            this.flags[i] = flag || ''
          }
        }
        debounce(() => {
          if (this.$refs.scroller) {
            this.$refs.scroller.reset()
          }
        }, 500)()
      },
      haveStock: debounce(function (flag) {
        this.pageNum = 1
        this.datas = []
        this.getCollection(this.pageNum, this.pageSize)
      }, 300)
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .madeOrder{
    position: relative;
    margin-bottom: 10px;
    padding: 8px 10px 8px 15px;
    font-size: 14px;
    color: #6A6A6A;
    background-color: #FFF4E8;
    .lookMore{
      float: right;
      margin-right: 5px;
      color: #4A90E2;
      cursor: pointer;
    }
  }
.controll-bar {
  height: 36px;
  background-color: #fff;
  // .default-item-class, .selected-item-class {
  //   float: left;
  //   display: block;
  //   width: 100px;
  //   height: 30px;
  //   text-align: center;
  //   line-height: 30px;
  //   border: 1px solid #eee;
  //   color: #7f7f7f;
  //   border-radius: 6px;
  //   margin: 7px 0px 0px 10px;
  // }
  // .selected-item-class {
  //   border: 1px solid $tsl-color;
  //   color: $tsl-color;
  // }
  .edit-text, .ok-text {
    position: absolute;
    right: 13px;
    top: 90px;
  }
}
.edit-sub-bar {
  width: 100%;
  height: 50px;
  border-top: 1px solid #dbdbdb;
  background-color: #fff;
  position: fixed;
  bottom: 0px;
  left: 0px;
  .check-all {
    width: 25%;
    height: 100%;
    float: left;
    line-height: 50px;
  }
  .remove-btn {
    width: 75%;
    height: 100%;
    line-height: 50px;
    text-align: center;
    background-color: $tsl-color;
    color: #fff;
    float: left;
  }
}
.row-layout, .edit-layout {
  background-color: #fff;
  position: relative;
  width: calc(100% - 10px);
  padding: 0px 10px 0px 0px;
  .block {
    position: relative;
    overflow: hidden;
    width: 100%;
    margin: 0px 0px 10px 0px;
  }
  .img-block {
    width: 35%;
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
    }
    .img-mask {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 0px;
      left: 0px;
      .circle {
        width: 90%;
        height: 90%;
        margin: 5%;
        border-radius: 50%;
        background-color: rgba(255,255,255,0.5);
      }
      .middle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18px;
      }
    }
  }
  .img-block:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .info-block {
    width: calc(65% - 10px);
    margin: 0px 0px 0px 10px;
    position: absolute;
    top: 0;
    bottom: 0px;
    right: 0;
    float: left;
    .name {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .price {
      position: absolute;
      bottom: 0;
      font-weight: 400;
    }
  }
}
.edit-layout {
  .info-block {
    width: 55%;
  }
}
.noProduct-tips {
  line-height: 50px;
  font-size: 14px;
  color: #7f7f7f;
  text-align: center;
  position: absolute;
  top: 91px;
  width: 100%;
  img {
    display: block;
    margin: 30% auto 0px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
#myCollection {
  .vux-x-switch.weui-cell_switch {
    width: 120px;
  }
  .weui-switch, .weui-switch-cp__box {
    width: 42px;
    height: 22px;
  }
  .weui-switch:before, .weui-switch-cp__box:before {
    width: 40px;
    height: 20px;
  }
  .weui-switch:after, .weui-switch-cp__box:after {
    width: 20px;
    height: 20px;
  }
}
</style>
