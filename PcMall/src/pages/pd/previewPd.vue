<template>
  <div id="previewPd">
    <x-header v-show="!moreFlag" :left-options="leftOption">
      <div slot="default">商品详情</div>
      <!-- <div slot="right"><x-icon @click="menuFlag = true" type="navicon" size="38" style="fill: #fff;position:absolute;top:-8px;right:-8px;"></x-icon></div> -->
      <div slot="right">
        <my-svg type="home" color="#fff" width="25" height="25" opacity="1" style="transform: translateY(-2px);"></my-svg>
      </div>
    </x-header>
    <scroller ref="scroller" lock-x v-model="scrollerStatus" :bounce="false" use-pullup :pullup-config="pullupConfig" @on-pullup-loading="onPullup" height="-96">
      <div :style="`min-height:${scrollerHeight}px;`">
        <pdSwiper :data1="swiperData"></pdSwiper>
        <Group gutter="-1px" id="skuInfo-group">
          <CellBox>
            <div style="width:100%">
              <div class="p-name-wrapper">
                <div class="p-name">{{skuInfo.sku ? handleName(skuInfo.sku.name) : ''}}</div>
              </div>
              <div class="p-adv-wrapper">
                <div v-for="(item, index) in commonSpecArray" :key="index" v-show="item.specName === '商品广告词'" class="p-adv">
                  {{handleSpecValueArray(item.specValueArray)}}
                </div>
              </div>
              <div class="p-price-wrapper">
                <div class="p-price"><span>￥</span>{{skuInfo.sku ? handlePrice(skuInfo.sku.price) : 0}}</div>
              </div>
            </div>
          </CellBox>
          <Cell is-link v-show="specStr.length > 0" @click.native="specFlag = true">
            <div slot="title" class="my-cell-title" style="display: inline-block;">产品类型 {{specValueNameStr}}</div>
          </Cell>
          <Cell>
            <div slot="title" class="my-cell-title">运费</div>
            <div class="my-cell-title">免运费</div>
          </Cell>
        </Group>

        <div style="height:30px;"></div>
        <div class="more-popup" :style="moreStyle">
          <tab :active-color="color" :line-width="1" v-if="introduction !== ''">
            <tab-item selected @on-item-click="tabIndex = 2">更多详情</tab-item>
            <tab-item @on-item-click="tabIndex = 0">规格参数</tab-item>
            <tab-item @on-item-click="tabIndex = 1">商品介绍</tab-item>
          </tab>
          <tab :active-color="color" :line-width="1" v-if="introduction === ''">
            <tab-item selected @on-item-click="tabIndex = 2">更多详情</tab-item>
            <tab-item @on-item-click="tabIndex = 0">规格参数</tab-item>
          </tab>
          <div v-show="tabIndex === 0">
            <x-table full-bordered content-bordered cell-bordered>
              <tbody>
                <tr v-for="(item, index) in commonSpecArray" :key="index">
                  <td class="left-td">{{item.specName}}</td>
                  <td class="right-td">{{handleSpecValueArray(item.specValueArray)}}</td>
                </tr>
              </tbody>
            </x-table>
          </div>
          <div v-show="tabIndex === 1">
            <p class="introduction">{{introduction}}</p>
          </div>
          <div v-show="tabIndex === 2">
            <pdRichText ref="pdRichText" :spuId="spuId"></pdRichText>
          </div>
        </div>
        <!-- <div class="pullup-step1" v-show="pullupStep1"><x-icon type="ios-arrow-up" style="margin-bottom:-5px;fill:#7f7f7f;"></x-icon>上拉展示更多详情</div> -->
      </div>
    </scroller>

    <div class="sub-tab">
      <div class="collection">
        <img v-show="!isCollected" src="../../assets/icons/heart.svg" type="" style="fill:#352665;display:block;margin:5px auto 5px;"/>
        <img v-show="isCollected" src="../../assets/icons/heart-fill.svg" style="fill:#352665;display:block;margin:5px auto 5px;"/>收藏
      </div>
      <div class="shopping-cart">
        <img src="../../assets/icons/bag.svg" type="image/svg+xml" style="width:22px;height:22px;fill:#352665;display:block;margin:5px auto 5px;"/>购物袋
      </div>
      <div :class="cartBtnStyle">加入购物袋</div>
      <div :class="buyBtnStyle">直接购买</div>
    </div>

    <!-- 选择规格 -->
    <div v-transfer-dom>
      <popup v-model="specFlag" height="75%" :popup-style="{'overflow-y': 'visible'}" is-transparent>
        <div slot="default" class="spec-popup bkcolor">
          <div class="skuInfo">
            <div class="default-picture-wrapper">
              <div class="default-picture-inner">
                <img :src="skuInfo.sku ? skuInfo.sku.defaultPicture : ''" alt="">
              </div>
            </div>
            <div class="sku-info">
              <div class="sku-info-price"><span>￥</span>{{skuInfo.sku ? handlePrice(skuInfo.sku.price) : 0}}</div>
              <div class="sku-info-stock">库存 {{skuInfo.sku ? skuInfo.sku.stock : ' '}}件</div>
            </div>
          </div>
          <scroller lock-x :height="specScrollerHeight">
            <div class="spec-wrapper">
              <div class="spec-inner" v-for="(item, index) in specArray" :key="index">
                <span class="spec-name">{{item.specName.replace('WeightOfGold&IsOnly1', '重量(g)')}}</span>
                <Checker
                  v-model="specArrayOn[index]"
                  type="radio"
                  radio-required
                  default-item-class="default-item-class"
                  selected-item-class="selected-item-class"
                  disabled-item-class="disabled-item-class">
                  <checker-item
                    v-for="(item2, index2) in item.specValueArray"
                    :key="index2"
                    :value="item2"
                    :disabled="!item.specValueFlags[index2]">{{item2.specValueName}}</checker-item>
                </Checker>
              </div>
              <group id="pd-popup-group" gutter="5px" class="spec-inner">
                <span class="spec-name">数量</span>
                <inline-x-number v-model="num" style="display:inline-block;float:right;" :min="1" :max="skuInfo ? skuInfo.sku.stock : 0" width="50px"></inline-x-number>
              </group>
            </div>
          </scroller>
          <div class="spec-sub-tab">
            <div :class="cartBtnStyle">加入购物袋</div>
            <div :class="buyBtnStyle">直接购买</div>
          </div>
        </div>
      </popup>
    </div>

    <!-- 更多详情 -->
    <!-- <div v-transfer-dom>
      <popup v-model="moreFlag" is-transparent :show-mask="false" style="overflow-y: visible;">
        <div class="more-popup" :style="moreStyle">
          <tab :active-color="color" :line-width="1">
            <tab-item selected @on-item-click="tabIndex = 0">规格参数</tab-item>
            <tab-item @on-item-click="tabIndex = 1" v-show="introduction !== ''">商品介绍</tab-item>
            <tab-item @on-item-click="tabIndex = 2">更多详情</tab-item>
          </tab>
          <div v-show="tabIndex === 0">
            <x-table full-bordered content-bordered cell-bordered>
              <tbody>
                <tr v-for="(item, index) in commonSpecArray" :key="index" v-show="item.specName !== '商品广告词'">
                  <td class="td1">{{item.specName}}</td><td class="td2">{{handleSpecValueArray(item.specValueArray)}}</td>
                </tr>
              </tbody>
            </x-table>
          </div>
          <div v-show="tabIndex === 1">
            <p>{{introduction}}</p>
          </div>
          <div v-show="tabIndex === 2">
            <pdRichText :spuId="spuId" ref="pdRichText"></pdRichText>
          </div>
        </div>
      </popup>
    </div> -->
  </div>
</template>
<script type="text/ecmasprict-6">
  import * as tool from '@/services/myTool.es6'
  import * as pdAPI from '@/services/API/pdServices.es6'
  import { XHeader, Scroller, Group, CellBox, Cell, TransferDom, Popup, Checker, CheckerItem, XNumber, InlineXNumber, debounce, Tab, TabItem, XTable } from 'vux'
  import pdSwiper from './pdSwiper3.vue'
  import pdRichText from './pdRichText.vue'
  let interval
  let interval2
  let getSkuCancel
  export default {
    name: 'previewPd',
    directives: {
      TransferDom
    },
    components: Object.assign({
      pdSwiper,
      pdRichText
    }, {
      XHeader,
      Scroller,
      Group,
      CellBox,
      Cell,
      Popup,
      Checker,
      CheckerItem,
      InlineXNumber,
      XNumber,
      debounce,
      Tab,
      TabItem,
      XTable
    }),
    data () {
      return {
        color: '#352665',
        scrollerHeight: 0,
        leftOption: {
          backText: '',
          preventGoBack: true
        },
        // ----------上拉或下拉的状态
        scrollerStatus: {
          pulldownStatus: 'default',
          pullupStatus: 'default'
        },
        pullupConfig: {
          content: '', // Pull Up To Refresh
          pullUpHeight: 60,
          height: 50,
          autoRefresh: false,
          downContent: '', // Release To Refresh
          upContent: '', // Pull Up To Refresh
          loadingContent: '', // Loading...
          clsPrefix: '' // xs-plugin-pullup-
        },
        // ---------sku信息
        skuId: '',
        skuInfo: '',
        // ---------spu信息
        spuId: '',
        spuInfo: '',
        specArray: [], // sku属性数组 [{specId:'', specName:'', specValueArray:[specId:'',specName:'',specValueId:'',specValueName:''], specValueFlags:[booleam]}]
        specValueArray: [], 
        skuSpecArray: [], // 可用的sku组合 [[specId:'',specName:'',specValueId:'',specValueName:''], []]
        usedSpecValueArray: [], // 正在使用的sku组合的 sku属性 的 JSON 数组
        // ----------已选sku组合[{specId,specName,specValueId,specValueName}]
        specArrayOn: [],
        num: 1,
        // ----------选择规格
        specFlag: false,
        // ----------更多详情
        moreFlag: false,
        tabIndex: 2,
        introduction: '',
        commonSpecArray: [],
        // ----------收藏
        isCollected: false,
        // ----------购物车信息
        cartItemsData: '',
        // ----------一次上拉完成，可执行二次上拉
        pullupStep1: false
      }
    },
    mounted: function () {
      this.scrollerHeight = document.body.clientHeight - 96
      this.skuId = this.$route.params.skuId
      interval = setInterval(() => {
        if (this.skuId) {
          // 获得 图集、sku、默认规格
          this.getSkuInfo(this.skuId, (res) => {
            this.skuInfo = res.data.skuInfo
            this.spuId = res.data.skuInfo.sku.spuId
            this.specArrayOn = res.data.skuInfo.spec
            // 获取 可用的sku组合、所有sku属性数组、视频
            this.getSpuInfo(res.data.skuInfo.sku.spuId, (res) => {
              this.spuInfo = res.data.spuInfo
              // 可用的sku组合
              this.skuSpecArray = res.data.spuInfo.skuSpecArray
              // 处理sku属性数组，元素格式为{specId, specName, specValueId, specValueName}
              this.getSpecArray(res.data.spuInfo.specArray)
            })
            // 获取商品简介、spu名字、spu属性
            this.getSpuSpec(res.data.skuInfo.sku.spuId)
          })
          clearInterval(interval)
        }
      }, 0)
    },
    methods: {
      // ----------接口-get-skuInfo
      getSkuInfo (skuId, callback) {
        this.$http.get(...pdAPI.getSkuInfo(skuId)).then(res => {
          if (res.data.code === 200) {
            if (typeof callback === 'function') { callback(res) }
          } else {
          }
        }).catch(() => {})
      },
      // ----------接口-get-spuInfo
      getSpuInfo (spuId, callback) {
        this.$http.get(...pdAPI.getSpuInfo(spuId)).then(res => {
          if (res.data.code === 200) {
            if (typeof callback === 'function') { callback(res) }
          } else {
          }
        }).catch(() => {})
      },
      // ----------处理spec属性数组，属性值对象加上specId和specName
      getSpecArray (data) {
        let specArray = []
        for (let i of data) {
          let spec1 = {
            specId: i.specId,
            specName: i.specName,
            specValueArray: [],
            specValueFlags: []
          }
          for (let j of i.specValueArray) {
            spec1.specValueArray.push({
              specId: i.specId,
              specName: i.specName,
              specValueId: j.specValueId,
              specValueName: j.specValueName
            })
            spec1.specValueFlags.push(false)
          }
          specArray.push(spec1)
        }
        this.specArray = specArray
        this.handleSpecState()
      },
      // ----------处理spec置灰
      handleSpecState () {
        this.$vux.loading.show()
        this.$vux.loading.show()
        // ----------取出正在使用的sku组合包含的属性值
        let usedSpecValueArray = []
        let qobj = {}
        for (let i of this.skuSpecArray) {
          for (let j of i) {
            if (qobj[JSON.stringify(j)] !== 1) {
              usedSpecValueArray.push(JSON.stringify(j))
              qobj[JSON.stringify(j)] = 1
            }
          }
        }
        this.usedSpecValueArray = usedSpecValueArray
        qobj = {}
        // ----------将会使用的设为true,即完全没有使用到的属性值设为false
        for (let i of usedSpecValueArray) {
          for (let j in this.specArray) {
            for (let k in this.specArray[j].specValueArray) {
              if (i === JSON.stringify(this.specArray[j].specValueArray[k])) {
                this.specArray[j].specValueFlags[k] = true
              }
            }
          }
        }
        // ----------根据当前选择的属性值，置灰不能成为组合的属性值
        // 本次高亮的属性值
        let thisValueArray = []
        for (let i of this.specArrayOn) {
          for (let j of this.skuSpecArray) {
            // 当前选择的sku属性值 存在于 可使用的sku组合
            if (JSON.stringify(j).indexOf(JSON.stringify(i)) !== -1) {
              // 遍历 可使用的sku组合的属性值
              for (let k of j) {
                if (JSON.stringify(i) !== JSON.stringify(k) && !qobj[JSON.stringify(k)]) {
                  thisValueArray.push(JSON.stringify(k))
                  qobj[JSON.stringify(k)] = 1
                }
              }
            }
          }
        }
        console.log('thisValueArray', thisValueArray)
        for (let i in this.specArray) {
          for (let j in this.specArray[i].specValueArray) {
            if (thisValueArray.length > 0 && thisValueArray.indexOf(JSON.stringify(this.specArray[i].specValueArray[j])) === -1) {
              this.specArray[i].specValueFlags[j] = false
            }
          }
        }
        this.$vux.loading.hide()
        this.getSkuBySpec()
      },
      // ----------spec组合变动，获取spec组合信息
      getSkuBySpec: debounce(function () {
        this.$http.post(...pdAPI.specGetSku(this.specArrayOn).concat({
        cancelToken: new this.$http.CancelToken(function (cancel) {
          if (typeof getSkuCancel === 'function') {
            getSkuCancel()
          }
          getSkuCancel = cancel
        })
      })).then((res) => {
        if (res.data.code === 200) {
          this.skuInfo = res.data.skuInfo
          this.spuId = res.data.skuInfo.sku.spuId
          this.$router.replace({path: `/previewPd/${this.skuInfo.sku.id}`})
        }
      })
      }, 500),
      // ----------上拉
      onPullup: debounce(function () {
        if (this.pullupStep1) {
          this.moreFlag = true
          this.pullupStep1 = false
          clearInterval(interval2)
        } else {
          clearInterval(interval2)
          this.pullupStep1 = true
          interval2 = setInterval(() => {
            if (document.getElementsByClassName('xs-container')[0].style.transform.indexOf('translateY(0px)') !== -1) {
              console.log('1')
              this.pullupStep1 = false
              clearInterval(interval2)
            }
          }, 300)
        }
        this.$refs.scroller.donePullup()
      }, 100),
      // ----------接口-spu和spu通用属性信息
      getSpuSpec (spuId) {
        this.$http.get(...pdAPI.spuSpec(spuId)).then(res => {
          if (res.data.code === 200) {
            this.introduction = res.data.spuInfo.introduction
            this.commonSpecArray = res.data.spuInfo.spuSpecArray
          }
        })
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      handleName (name) {
        return tool.handleName(name)
      },
      handleSpecValueArray (arr) {
        let isTime = false
        if (/^1[0-9]{12}$/.test(arr[0])) {
          isTime = true
        }
        if (isTime) {
          let date = new Date(arr[0] * 1)
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        } else {
          return arr.join(',')
        }
      }
    },
    computed: {
      heartSvg () {
        return require('../../assets/icons/heart.svg')
      },
      heartFillSvg () {
        return require('../../assets/icons/heart-fill.svg')
      },
      bagSvg () {
        return require('../../assets/icons/bag.svg')
      },
      // ----------轮播数据
      swiperData () {
        let arr = []
        if (this.spuInfo) {
          if (this.spuInfo.videoUrl) {
            arr.push({
              type: 'video',
              data: this.spuInfo.videoUrl
            })
          }
        }
        if (this.skuInfo) {
          if (this.skuInfo.image.length > 0) {
            for (let i of this.skuInfo.image) {
              arr.push({
                type: 'img',
                src: i.pictureUrl,
                link: ''
              })
            }
          }
        }
        return arr
      },
      specValueNameStr () {
        let arr = []
        for (let i of this.specArrayOn) {
          arr.push(i.specValueName)
        }
        return arr.join(' ')
      },
      // 默认规格字符串，判断是否是单品
      specStr () {
        return JSON.stringify(this.specArrayOn)
      },
      specScrollerHeight () {
        return document.body.clientHeight * 0.75 - 101 - 50 + 'px'
      },
      cartBtnStyle () {
        return 'add-to-cart-disabled'
      },
      buyBtnStyle () {
        return 'buy-disabled'
      },
      // ---------图文详情
      moreStyle () {
        return `height: ${document.body.clientHeight - 46}px`
      }
    },
    watch: {
      specStr (newV, oldV) {
        if (oldV !== '[]') {
          if (newV !== oldV) {
            this.handleSpecState()
          }
        }
      },
      specFlag (flag) {
        if (!flag) {
          this.modalmodel = ''
        }
        if (this.$refs.pdSwiper) {
          this.$refs.pdSwiper.hideVideo(flag)
        }
      },
      moreFlag (flag) {
        if (this.$refs.pdSwiper) {
          this.$refs.pdSwiper.hideVideo(flag)
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.bkcolor {
  background-color: #fff;
}
// ----------商品信息
.p-name-wrapper {
  padding: 0px 0px 5px 0px;
  .p-name {
    text-align: center;
    display: inline-block;
    width: 100%;
    // min-height: 38px;
    font-size: 14px;
    color: #4d4d4d;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
.p-adv-wrapper {
  .p-adv {
    text-align: center;
    display: inline-block;
    width: 100%;
    font-size: 14px;
    color: #7f7f7f;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
.p-price-wrapper {
  .p-price {
    span {
      font-size: 14px;
    }
    text-align: center;
    font-weight: 400;
    font-size: 20px;
    color: $tsl-color;
  }
}
.my-cell-title {
  font-size: 12px;
  color: #7f7f7f;
}
.pullup-step1 {
  position: absolute;
  width: 100%;
  height: 500px;
  line-height: 50px;
  bottom: -500px;
  text-align: center;
  background:#fff;
  color: #7f7f7f
}
// ----------底部按钮
.sub-tab {
  border-top: 1px solid #dbdbdb;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  div {
    height: 100%;
    float: left;
  }
  .collection:after, .shopping-cart:after {
    content: '';
    display: block;
    position: absolute;
    top: 0px;
    right: 0px;
    height: 100%;
    width: 1px;
    background-color: #dbdbdb;
  }
  .collection, .shopping-cart {
    img {
      display: block;
      margin: 5px auto 3px;
      width: 22px;
      height: 22px;
    }
    background-color: #fff;
    color: #7f7f7f;
    text-align: center;
    position: relative;
    width: 20%;
    font-size: 10px;
  }
  .add-to-cart, .buy, .add-to-cart-disabled, .buy-disabled {
    width: 30%;
    text-align: center;
    line-height: 50px;
  }
  .add-to-cart {background-color: $tsl-color;color: #fff;}
  .buy {background-color: #fff;color: $tsl-color;}
  .add-to-cart-disabled {background-color: #fff;color: #7f7f7f;}
  .buy-disabled {background-color: #7f7f7f;color: #fff;}
}
// ----------商品规格弹窗
.spec-popup {
  width: 100%;
  height: 100%;
  border-radius: 6px 6px 0px 0px;
}
.skuInfo {
  height: 80px;
  padding: 10px 0px 10px 0px;
  border-bottom: 1px solid #d9d9d9;
}
.default-picture-wrapper {
  position: absolute;
  top: -20px;
  left: 10px;
  width: 98px;
  height: 98px;
  border-radius: 10px;
  border: 1px solid #eee;
  background-color: #fff;
}
.default-picture-inner {
  margin: 5px;
  width: 88px;
  height: 88px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #eee;
  img {
    display: block;
    width: 100%;
  }
}
.sku-info {
  margin: 0px 0px 0px 115px;
  .sku-info-price {
    font-size: 14px;
    color: $tsl-color;
    letter-spacing: 1.15px;
  }
  .sku-info-stock {
    font-size: 12px;
    color: #4d4d4d;
    letter-spacing: .5px;
  }
}
.spec-wrapper {
  padding: 10px 10px 0px 10px;
  height: calc(100% - 30px);
  overflow-y: scroll;
  .spec-inner {
    margin: 0px 0px 10px 0px;
  }
}
.spec-name {
  font-size: 14px;
  color: #535353;
  letter-spacing: .6px;
}
.default-item-class, .selected-item-class, .disabled-item-class {
  margin: 12px 15px 0 0;
  height: 30px;
  line-height: 30px;
  border: 1px solid #eee;
  padding: 0 15px;
  border-radius: 6px;
  font-size: 14px;
  color: #7f7f7f;
  letter-spacing: .6px;
}
.selected-item-class {
  border: 1px solid $tsl-color;
  color: $tsl-color;
}
.disabled-item-class {
  border: 1px solid #eee;
  color: #eee;
}
.spec-sub-tab {
  border-top: 1px solid #dbdbdb;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  div {
    width: 50%;
    height: 100%;
    text-align: center;
    line-height: 50px;
    float: left;
  }
  .add-to-cart {color: #fff;background-color: $tsl-color;}
  .buy {color: $tsl-color;background-color: #fff;}
  .add-to-cart-disabled {background-color: #fff;color: #7f7f7f;}
  .buy-disabled {background-color: #7f7f7f;color: #fff;}
}
// ----------图文详情
.more-popup {
  background-color: #fff;
  .td1 {min-width: 100px;}
  .td2 {min-width: 200px;}
}
</style>
<style rel="stylesheet/scss" lang="scss">
#pd {
  .xs-container {
    height: 100%;
  }
  .xs-plugin-pullup-container {
    position: relative !important;
  }
}
#skuInfo-group .weui-cells:before {
  display: none;
}
</style>
