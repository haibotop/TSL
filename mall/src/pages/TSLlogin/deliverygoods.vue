<style lang="scss" rel="stylesheet/scss">
#screatment {
  background-color: #FFFFFF;
  height: 100%;

  .vux-popup-dialog .vux-header-title{
    margin: 0 8px;
  }
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
    margin: 10px auto;
    font-size: 14px;
    color: #7F7F7F;
    padding: 0px 10px 50px 10px;
  }
  h6 {
    color: #000000;
  }
  p, h6 {
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
    padding-bottom: 15px;
    padding-left: 40px;
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
      padding-left: 24px;
      list-style-type: none;
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
  <div id="screatment">
    <XHeader :left-options="headerContent.leftOptions">
      <div class="logo"><img src="../../assets/icons/logo.png" alt=""></div>
    </XHeader>
    <div class="content">
      <h1 class="text-headline">商品配送政策</h1>
      <div class="divider bg-gray-lighter">&nbsp;</div>
      <div class="content-menu">
        <ul class="slide">
          <li v-for="(item, index) in sliderList" :key="index">
            <div class="slide-panel" @click="showSlider(index)">
              <span>{{item.title}}</span>
            </div>
            <div class="divider bg-gray-lighter">&nbsp;</div>
          </li>
          <li>
            <div class="slide-panel" @click="$router.push({path: `/backgoods`})">
              <span>6. 退换货政策</span>
            </div>
            <div class="divider bg-gray-lighter">&nbsp;</div>
          </li>
        </ul>
        <!-- <p>&nbsp;&nbsp;为了提高您的购物体验，我们提供快递配送/门店自提服务，您可以根据您的个人需要，选择合适的配送方式，如有任何问题，欢迎联系我们的在线客服。</p>
        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(0)">&nbsp;&nbsp;1 关于快递配送：</p>
        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(1)">&nbsp;&nbsp;2 关于门店自提（仅限中国大陆地区）：</p>

        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(2)">&nbsp;&nbsp;3 关于商品包装</p>
        <ul><li></li></ul>
        <p style="margin-bottom:0;font-weight:bold;">&nbsp;&nbsp;4 关于退换货政策</p>
        <ul>
            <li @click="$router.push({path: '/backgoods'})" style="text-decoration:underline;">》》详情请点击“退换货政策”</li>
        </ul> -->
      </div>
    </div>
    <popup v-model="show" position="right" width="100%" :show-mask="false">
      <XHeader :left-options="headerContent.slider" :title="sliderTitle" @on-click-back="sliderBack" style="position:fixed;z-index:1;width:100%"></XHeader>
      <div class="position-horizontal-demo" ref="textfuwu">
        <div v-if="sliderIndex === 0">
          <p>为了提升您的购物体验，我们提供快递配送/门店自提服务，您可以根据您的个人需要，选择合适的配送方式，如有任何问题，欢迎联系我们的在线客服。</p>
        </div>
        <div v-if="sliderIndex === 1">
          <p>您所订购的商品，将在订单付款成功后1-2周内发出。</p>
        </div>
        <div v-if="sliderIndex === 2">
          <p>3.1 指定快递：EMS中国邮政速递或顺丰快递，全场免运费（仅限中国大陆地区，不包括港澳台或海外地区）。同时，我们会为商品购买全程运输保险。</p>
          <p>3.2 收货提醒：因寄送物为贵重商品，为保障您的合法权益，建议本人当面验货，并签收包裹。如有问题，请及时与在线客服联系，我们将诚挚为您提供服务。</p>
        </div>
        <div v-if="sliderIndex === 3">
          <p>4.1 目前，我们已在指定门店“门店自提”服务，您可以选择就近的指定门店进行取货；您的订单支付成功后，我们将免费为您配送商品至指定门店。</p>
          <p>4.2 商品送达您选定的指定门店后，我们将会发送取货信息通知您提货，自该信息发出之日起，您订购的商品将在指定门店内保存7天，在此期间您应在门店正常营业时间（一般商城营业时间为10:00-22:00）内提取您所订购的全部商品；如您未能于上述期间内提取全部商品，需根据本店退换货政策的规定申请退货并办理相关手续。</p>
          <p>4.3 您到指定门店提货时，需向门店店员出示您的身份证原件、下单的订单编号、登记的取货人姓名及取货码等取货信息以提取商品。</p>
          <p>4.4 收货提醒：为方便您顺利取货，如非本人取货，请提前联系我们的在线客服修改取货信息，否则，我们保留拒绝接受他人代取商品的权利。</p>
          <p>4.5 支持现场验货，我们将为您提供专业的佩戴与保养建议，让您享受门店的尊享服务。</p>
          <p>提供“线上下单，线下提货”服务的实体门店如下所列：</p>
          <ul>
            <li>
              1、北京：北京东直门银座<br>
              地址：北京市东城区东直门外大街48号银座mall一层<br>
              电话：13810530018
            </li>
            <li>
              2、上海：上海五角场万达<br>
              地址：上海市万达广场杨浦区淞沪路77号B1层B1022B-B1023谢瑞麟珠宝专柜<br>
              电话：021-55660108
            </li>
            <li>
              3、重庆：重庆大都会<br>
              地址：重庆市渝中区邹容路68号大都会广场LG层02铺谢瑞麟专柜<br>
              电话：023-63719917
            </li>
            <li>
              4、广州：广州天环<br>
              地址：广州市天河区天河路天环广场地下二层B247号商铺<br>
              电话：020-38559932
            </li>
          </ul>
        </div>
        <div v-if="sliderIndex === 4">
          <p>我们会为每个订单，配备商品保证书、商品清单、精美首饰盒及手提袋等。</p>
        </div>
      </div>
    </popup>
  </div>
</template>
<script type="text/ecmascript-6">
import { XHeader, Popup } from 'vux'
export default {
  name: 'deliverygoods',
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
        {title: '1. 前言'},
        {title: '2. 发货时间'},
        {title: '3. 快递配送服务'},
        {title: '4. 门店自提服务（仅限中国大陆地区）'},
        {title: '5. 商品包装'}
        // {title: '6. 退换货政策'}
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
