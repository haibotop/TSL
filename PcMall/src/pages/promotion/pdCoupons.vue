<template>
  <section id="pdCoupons">
    <div class="title">优惠券<Icon type="ios-close"  size="40" @click.native="closeGetCoupon"/></div>
    <div class="pdCoupons-content">
      <div>
        <loading v-if="loading" :scope=true></loading> 
        <div class="pdCoupons-content-get">
          <h3 v-if="list0.length > 0">可领取优惠券:<span></span></h3>
          <div>
            <coupon v-for="(item, index) in list0" :key="index" :status="0" :coupon="item" v-if="list0.length > 0" @eventCoupon="receiveCoupon"></coupon>
            <div style="text-align:center;margin-top:20px;" v-if="list0.length === 0">
              <img class="null-coupon" src="../../assets/images/nullCoupon.png" alt="">
              <div style="color:#C8C8C8;">暂无可领取的优惠券</div>
            </div>
          </div>
        </div>
        <div class="pdCoupons-content-get">
          <h3 v-if="list1.length > 0">已领取优惠券:<span></span></h3>
          <div>
            <coupon class="coupon" v-for="(item, index) in list1" :key="index" :status="5" :coupon="item" v-if="list1.length > 0"></coupon>
            <div style="text-align:center;margin-top:20px;" v-if="list1.length === 0">
              <img class="null-coupon" src="../../assets/images/nullCoupon.png" alt="">
              <div style="color:#C8C8C8;">您还没有未使用的优惠券</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- <div id="pdCoupons">
    <div v-transfer-dom>
      <popup v-model="flag" height="75%" :popup-style="popupStyle">
        <x-icon @click.native="close" type="ios-close-empty" fill="#bbb" style="width:40px;height:40px;position:absolute;top:10px;right:10px;"></x-icon>
        <div class="title">优惠券</div>
        <scroller lock-x height="-65">
          <div class="scroller-wrapper">
            <div>
              <span v-if="list0.length > 0">可领取优惠券</span>
              <coupon class="coupon" v-for="(item, index) in list0" :key="index" :status="0" :coupon="item" v-if="list0.length > 0" @eventCoupon="receiveCoupon"></coupon>
              <div style="text-align:center;margin-top:20px;" v-if="list0.length === 0">
                <img class="null-coupon" src="../../assets/images/nullCoupon.png" alt="">
                <div style="color:#C8C8C8;">暂无可领取的优惠券</div>
              </div>
            </div>
            <div>
              <span v-if="list1.length > 0">已领取优惠券</span>
              <coupon class="coupon" v-for="(item, index) in list1" :key="index" :status="5" :coupon="item" v-if="list1.length > 0"></coupon>
              <div style="text-align:center;margin-top:20px;" v-if="list1.length === 0">
                <img class="null-coupon" src="../../assets/images/nullCoupon.png" alt="">
                <div style="color:#C8C8C8;">您还没有未使用的优惠券</div>
              </div>
            </div>
          </div>
        </scroller>
      </popup>
    </div>
  </div> -->
</template>
<script type="text/ecmascript-es6">
  // import { TransferDom, Popup, Scroller } from 'vux'
  import * as mkApi from '@/services/API/marketing.es6'
  import coupon from './coupon.vue'
  import loading from '@/pages/homePages/loading.vue'

  export default {
    name: 'pdCoupons',
    // directives: { TransferDom },
    // components: { TransferDom, Popup, Scroller, coupon },
    components: { coupon, loading },
    props: {
      value: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      couponList: {
        default: function () {
          return []
        },
        type: Array
      }
    },
    mounted () {
      this.listTrye() 
    },
    data () {
      return {
        loading: false,
        list0: [],
        list1: [],
        popupStyle: {
          'background-color': '#fff'
          // 'position': 'relative'
        }
      }
    },
    methods: {
      closeGetCoupon(){
        this.$emit('closeGetCoupon')
      },
      // close () {
      //   this.$emit('input', false)
      // },
      // 领取优惠券事件
      receiveCoupon (coupon) {
        this.loading = true
        // this.disabledMouseWheel()
        this.$http.get(mkApi.receiveCoupon(coupon.id, coupon.couponCode))
          .then(res => {
            console.log(res)
            if(res.data.code === 200){
              this.$Message.success({content:'领取成功',duration:3})
              this.$parent.getSkuCoupon(this.$route.params.skuId)
            }
          })
      },
      listTrye(){
        for (let i of this.couponList) {
          if (i.mstatus === 0) {
            this.list0.push(i)
          } else if (i.mstatus === 1) {
            i.mstatus = 4
            this.list1.push(i)
          }
        }
        this.loading = false
      },
      // scrollFunc(evt) {  
      //   evt = evt || window.event;  
      //   if(evt.preventDefault) {  
      //     // Firefox  
      //     evt.preventDefault();  
      //     evt.stopPropagation();  
      //   } else{  
      //     // IE  
      //     evt.cancelBubble=true;  
      //     evt.returnValue = false;  
      //   }  
      //     return false;  
      // },
      // //阻止浏览器事件
      // disabledMouseWheel() {  
      //   document.addEventListener('DOMMouseScroll', this.scrollFunc, false);  
      //   document.addEventListener('mousewheel', this.scrollFunc,false);
      // },
      // //取消阻止浏览器事件
      // cancelDisMouseWheel(){
      //   document.removeEventListener('DOMMouseScroll', this.scrollFunc,false);
      //   document.removeEventListener('mousewheel', this.scrollFunc,false);
      // }  
    },
    computed: {
      // 弹窗状态改变
      // flag: {
      //   get () {
      //     return this.value
      //   },
      //   set (flag) {
      //     this.$emit('input', flag)
      //   }
      // }
    },
    watch: {
      couponList () {
        // 优惠券分类
        this.list0 = []
        this.list1 = []
        this.listTrye()
      }
    }
  }
</script>
 <style>

/*滚动条样式*/
.pdCoupons-content::-webkit-scrollbar{
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 2px;
    position: relative;
    /* left: -42px; */
}
.pdCoupons-content::-webkit-scrollbar-thumb{
    /*滚动条里面小方块样式*/
    border-radius: 6px;
    background: #979797;
}
.pdCoupons-content::-webkit-scrollbar-track{
    /*滚动条里面轨道样式*/
    background: transparent;
}
 </style>


<style lang="stylus" scoped>
  @import "~styles/common/common.styl";

  #pdCoupons
    width 1070px
    height 432px!important
    background-color #fff
    position absolute
    right 0
    z-index 2
    $border(1,1px)
    $border(border-left,8px)
    padding 20px
    .pdCoupons-content
      height 350px
      overflow-y auto
      // &:before
      //   content:""
      //   display inline-block
      //   width 20px
      //   height 50px
      //   position absolute
      //   z-index 0
      //   right 52px
      //   background-color #fff
      // &:after
      //   content:""
      //   display inline-block
      //   width 20px
      //   height 50px
      //   position absolute
      //   z-index 0
      //   right 52px
      //   bottom 0
      //   background-color #fff
      .pdCoupons-content-get
        overflow hidden
        h3
          color $blue
          $mb(10px)   
    .title
      text-align center
      color #ccc
      font-size 18px
      i 
        position relative
        float right
        cursor pointer
        color $blue
</style> 
