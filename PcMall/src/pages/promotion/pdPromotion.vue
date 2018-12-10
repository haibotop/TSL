<template>  
  <div id="pdPromotion" v-show="promotionInfos.length > 0">
    <span class="name">促销：</span>
    <div class="detial">
      <div class="detial-content" v-for="(item,index) in promotionInfos" :key="item.id" v-show="index<2||isShow">
        <span class="type">{{typeText[item.type]}}</span>
        <span class="pdsArray"> {{pdsArrayText(item)}}</span>
        <router-link :to="`/couponPl?promotionId=${item.id}`" class="goDetial">详情&nbsp;<Icon type="ios-arrow-forward" /></router-link>
      </div>      
      <span class="more" v-if="promotionInfos.length > 2" @click="handelClick">{{flag?'收起':'展开'}}&nbsp;<Icon :type="flag?'ios-arrow-up':'ios-arrow-down'" /></span>
    </div>
  </div>

  <!-- <div id="pdPromotion">
    <cell is-link border-intent @click.native="flag=true" v-show="promotionInfos.length > 0">
      <div slot="title" class="my-cell-title">
        <span>促销</span><span style="float:right;">{{pdsArrayText(selected)}}</span>
      </div>
      <div v-transfer-dom>
        <popup v-model="flag" height="50%" :popup-style="popupStyle">
          <popup-header title="促销"></popup-header>
          <scroller lock-x ref="scroller" :height="scrollerHeight">
            <group gutter="0px">
              <cell v-for="item in promotionInfos" :key="item.id" is-link :link="`/couponPl?promotionId=${item.id}`">
                <div slot="title">
                  <span class="type">{{typeText[item.type]}}</span>
                  <span class="pdsArray">
                    {{pdsArrayText(item)}}
                  </span>
                </div>
              </cell>
            </group>
          </scroller>
        </popup>
      </div>
    </cell>
  </div> -->
</template>
<script type="text/ecmascript-6">
  import { TransferDom, Scroller, Group, Cell, Popup, PopupHeader } from 'vux'
  import * as API from '@/services/API/marketing.es6'
  export default {
    name: 'pdPromotion',
    directives: { TransferDom },
    components: { Scroller, Group, Cell, Popup, PopupHeader },
    data () {
      return {
        promotionInfos: [],
        typeText: ['', '满减促销', '满折促销', '单品折扣', '直降促销'],
        flag: false,
        popupStyle: {
          'background-color': '#fff',
          'overflow': 'visible'
        },
        selected: '',
        isShow: false
      }
    },
    methods: {
      handelClick(){
        this.flag = !this.flag
        this.isShow = !this.isShow
      },
      getPromotions (skuId, callback) {
        this.$http.get(API.getProductPromotions(skuId)).then(res => {
          if (res.data.code === 200) {
            this.promotionInfos = res.data.promotionInfo
            if (typeof (callback) === 'function') {
              callback()
            }
          }
        })
      },
      pdsArrayText (promotion) {
        let text = ''
        if (promotion.type === 1) {
          promotion.pdsArray.forEach(e => {
            text += `${text ? '、' : ''}满${e.fullLimit / 100}减${e.subtract / 100}`
          })
        } else if (promotion.type === 2) {
          promotion.pdsArray.forEach(e => {
            text += `${text ? '、' : ''}满${e.fullLimit / 100}打${e.discount / 10}折`
          })
        } else if (promotion.type === 3) {
          text = `打${promotion.discount / 10}折`
        } else if (promotion.type === 4) {
          text = `直降${promotion.directAmount / 100}元`
        }
        return text
      },
      bestPromotion () {
        // let price = this.$parent.$parent.$parent.skuInfo.sku.price
        let price = this.$parent.skuInfo.sku.price
        if (!price) { return }
        if (!price) { return }
        let selected = ''
        let youhui = 0
        for (let promotion of this.promotionInfos) {
          if (promotion.type === 1) {
            for (let j of promotion.pdsArray) {
              if (j.fullLimit <= price && j.subtract > youhui) {
                youhui = j.subtract
                selected = promotion
              }
            }
          } else if (promotion.type === 2) {
            for (let j of promotion.pdsArray) {
              if (j.fullLimit <= price && price - price * j.discount * 0.01 > youhui) {
                youhui = price - price * j.discount * 0.01
                selected = promotion
              }
            }
          } else if (promotion.type === 3) {
            if (price - price * promotion.discount * 0.01 > youhui) {
              youhui = price - price * promotion.discount * 0.01
              selected = promotion
            }
          } else if (promotion.type === 4) {
            if (promotion.directAmount > youhui) {
              youhui = promotion.directAmount
              selected = promotion
            }
          }
          console.log(promotion, youhui)
        }
        console.log('selected', selected)
        this.selected = selected
      }
    },
    mounted: function () {
      this.getPromotions(this.$route.params.skuId, () => {
        this.bestPromotion()
      })
    },
    computed: {
      // scrollerHeight () {
      //   return document.body.clientHeight * 0.5 - 44 + 'px'
      // }
      
    }
  }
</script>
<style lang="stylus" scoped>
@import "~styles/common/common.styl";
  #pdPromotion
    &::after
      content "."       
      display block       
      height 0        
      clear both     
      visibility hidden       
    .name 
      float left
    .detial
      float left
      line-height 28px
      $mt(3px)
      background-color #fafafa
      width 88%
      position relative
      .detial-content
        $mb(6px)
        .type 
          display inline-block
          border 1px solid  $blue
          color $blue
          font-size 12px
          width 60px
          text-align center
          $mr(10px)
          vertical-align middle
        .pdsArray,.goDetial
          font-size 14px
          $mr(10px)
          // color #FF9900
          vertical-align middle
        .goDetial
          color #4a90e2
          cursor pointer
      .more
        position absolute
        color $blue
        right 10px
        bottom 0
        cursor pointer
        
            
      
        
      
</style>


<style lang="scss" rel="stylesheet/scss" scoped>
.my-cell-title {
  font-size: 12px;
  color: #7f7f7f;
}
// .type {
//   display: inline-block;
//   border: 1px solid  #E4393C;
//   border-radius: 5px;
//   color: #E4393C;
//   font-size: 12px;
//   width: 60px;
//   text-align: center
// }
// .pdsArray {
//   font-size: 14px;
//   color: #FF9900;
// }
</style>

