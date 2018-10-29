<style lang="scss" rel="stylesheet/scss">
#selfAddress {
  background-color: #FFFFFF;
  height: 100%;
  .logo {
    width: 140px;
    position: absolute;
    top: 12px;
    left: 0px;
    left: 50%;
    transform: translateX(-50%);
    img {
      display: block;
      width: 100%;
    }
  }
  .vux-popup-dialog {
    background: #fff;
  }
  .content {
    background: #fff;
    height: calc(100% - 46px);
    font-size: 14px;
    color: #7F7F7F;
    padding: 0px 10px 0 10px;
  }
  .content-menu {
    height: calc(100% - 170px);
    overflow: scroll;
  }
  h6 {
    color: #000000;
    margin: 10px 0;
  }
  .divider {
    width: 100%;
    height: 1px;
    margin-bottom: 20px;
    margin-top: 10px;
    display: block;
  }
  .slide {
    .divider {
      margin-bottom: 0;
      margin-top: 2px;
    }
  }
  .bg-gray-lighter {
    background-color: #E9E7E8;
  }
  .slide-panel {
    padding-top: 15px;
    padding-left: 20px;
    padding-bottom: 15px;
    color: #000;
  }
  .position-horizontal-demo {
    position: relative;
    top: 46px;
    font-size: 14px;
    color: #454545;
    background: #fff;
    &>div {
      padding: 10px;
      height: 100%;
    }
    p {
      margin-bottom: 1.5em;
      line-height: 1.5em;
    }
    ul {
      margin-top: 0;
      padding-left: 34px;
    }
    .vux-close {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%) scale(4);
      color: #000;
    }
    .clear {
      clear: both;
    }
  }
}
</style>
<template>
  <div id="selfAddress">
    <XHeader :left-options="headerContent.leftOptions">
      <!--<div class="logo"><img src="../../assets/icons/logo.png" alt=""></div>-->
    </XHeader>
    <div class="content">
      <h1 class="text-headline">货品配送政策</h1>
      <div class="divider bg-gray-lighter">&nbsp;</div>
      <p style="text-indent:2em;">为了提高您的购物体验，我们提供快递配送/门店自提服务，您可以根据您的个人需要，选择最合适的配送方式，如有任何问题，欢迎联系我们的在线客服！</p>
      <div class="content-menu">
        <ul class="slide">
          <li v-for="(item, index) in sliderList" :key="index">
            <div class="slide-panel">
              <span>{{item.title}}</span>
              <div v-html="item.p"></div>
            </div>
            <div class="divider bg-gray-lighter">&nbsp;</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { XHeader, Popup } from 'vux'
export default {
  name: 'selfAddress',
  components: {
    XHeader,
    Popup
  },
  data () {
    return {
      headerContent: {
        leftOptions: {
          showBack: true,
          backText: '',
          preventGoBack: false // 是否阻止返回
        },
        rightOptions: {
          showMore: false // 是否显示更多图标
        },
        slider: {
          showBack: true,
          backText: '',
          preventGoBack: true
        }
      },
      // 当前的标题
      sliderTitle: '',
      // 当前的标题Index
      sliderIndex: '',
      show: false,
      // 条款数据
      sliderList: [
        {
          title: '1. 关于商品包装',
          p: '<p style="text-indent:2em;color:#7f7f7f;">每个订单，我们都会配备货品保证单、货品清单及精美首饰盒、手提袋。</p>'
        },
        {
          title: '2. 关于快递配送',
          p: '<p style="text-indent:2em;color:#7f7f7f;">1、合作快递：EMS中国邮政速递和顺丰快递，全场免运费（仅限大陆地区，不包括港澳台及海外地区）。同时，我们会为商品购买全程运输保险。</p><p style="text-indent:2em;color:#7f7f7f;">2、发货时间：订单付款成功后，我们将在下单后48小时内寄出包裹。<p style="text-indent:2em;color:#7f7f7f;">3、收货提醒：因为商品贵重，为了保障您的权益，建议本人当面验货并签收包裹。如有问题，请及时与我们联系，我们将为您提供诚挚服务。</p>'
        },
        {
          p: '<p style="text-indent:2em;color:#7f7f7f;">1、在官网下单的时候，您可以选择合适的门店享受门店取货服务，支付成功后，我们将在48小时内发货，免费为您配送货品至指定门店。</p>' +
             '<p style="text-indent:2em;color:#7f7f7f;">2、货品送达门店后，我们将发送取货信息至您的手机或者电子邮箱，请您向门店店员出示订单信息及验证码（短信/电邮通知，即可提取货品。</p>' +
             '<p style="text-indent:2em;color:#7f7f7f;">3、收货提醒：支持现场验货，我们将为您提供专业的佩戴与保养建议，让您享受门店的尊享服务。</p>'
        }
      ]
    }
  },
  methods: {
    showSlider (index) {
      this.sliderIndex = index
      this.sliderTitle = this.sliderList[index].title
      this.show = true
    },
    sliderBack () {
      this.show = false
    }
  },
  watch: {
    sliderIndex (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.textfuwu.scrollTo(0, 0)
      }
    }
  }
}
</script>
