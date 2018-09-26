<style lang="scss" rel="stylesheet/scss">
#screatment {
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
      <h1 class="text-headline">退换货政策</h1>
      <div class="divider bg-gray-lighter">&nbsp;</div>
      <div class="content-menu">
        <ul class="slide">
          <li v-for="(item, index) in sliderList" :key="index">
            <div class="slide-panel" @click="showSlider(index)">
              <span>{{item.title}}</span>
            </div>
            <div class="divider bg-gray-lighter">&nbsp;</div>
          </li>
        </ul>
        <!-- <p>&nbsp;&nbsp;商品退换政策（下称“政策”）仅适用于T S L | 謝瑞麟（下称“本公司”）在互联网上自行开设、运营及控制的T S L | 謝瑞麟网上珠宝店（网址：（待定），下称“本店”），顾客（下称“阁下”）可通过上述网址或T S L | 謝瑞麟微信公众号（搜索名称：“谢瑞麟珠宝”）的会员栏目注册并登录。</p>
        <p>&nbsp;&nbsp;本政策旨在向阁下提供退换商品指引，凡符合政策规定的可退换的商品，阁下可享受本公司为您提供的相关协商退货或更换保障。</p>
        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(0)">&nbsp;&nbsp;1 定义</p>
        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(1)">&nbsp;&nbsp;2 退货</p>
        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(2)">&nbsp;&nbsp;3 更换</p>
        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(3)">&nbsp;&nbsp;4 购物优惠</p>
        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(4)">&nbsp;&nbsp;5 特别说明</p>
        <p style="margin-bottom:0;font-weight:bold;text-decoration:underline;" @click="showSlider(5)">&nbsp;&nbsp;温馨提示</p> -->
      </div>
    </div>
    <popup v-model="show" position="right" width="100%" :show-mask="false">
      <XHeader :left-options="headerContent.slider" :title="sliderTitle" @on-click-back="sliderBack" style="position:fixed;z-index:1;width:100%"></XHeader>
      <div class="position-horizontal-demo" ref="textfuwu">
        <div v-if="sliderIndex === 0">
          <p>商品退换政策（下称“政策”）仅适用于TSL | 謝瑞麟 下称“我们”）在互联网上自行开设、运营及控制的TSL | 謝瑞麟 线上珠宝店（网址：eshop.tslj.cn），下称“本店”），顾客（下称“阁下”）可通过上述网址或T S L | 謝瑞麟微信公众号（搜索名称：“谢瑞麟珠宝”）的会员栏目注册并登录。</p>
          <p>本政策旨在向阁下提供本店的退换商品指引，凡符合本政策规定的可退换的商品，阁下可享受我们为您提供的相关协商退货或更换保障。</p>
        </div>
        <div v-if="sliderIndex === 1">
          <p>2.1 “商品”指阁下选购并成功付款的交易项下货品，且我们已接受该交易。</p>
          <p>2.2 “原销售状态”是指商品经我们专业人员检测并确认：</p>
          <ul>
            <li>（1）有完好的包装，齐备所有附带的发票、货品保证单、真品证书及赠品均完好无缺；</li>
            <li>（2）未曾佩戴、使用或修改，且保持销售时的状态；及</li>
            <li>（3）无任何损坏。</li>
          </ul>
          <p>2.3 “不设退换商品”是指，部分商品因应其产品性质，不设退货或更换，包括：</p>
          <ul>
            <li>（1）特别订造、有花损、经雕刻或修改的商品；</li>
            <li>（2）销售发票注明 “不设退货及更换”之商品。</li>
            <li>（3）黄金、铂金商品（根据本店标示的每日金价计算价格的货品）</li>
          </ul>
        </div>
        <div v-if="sliderIndex === 2">
          <p>除不设退换商品外，阁下购买的商品在保持原销售状态及符合以下细则的前提下，可自签收商品次日起计7日内与我们协商退货，如经确认同意退货的，将会按阁下购买商品时的支付方式退回实际支付的款项。</p>
          <p>2.1 退货条件</p>
          <ul>
            <li>（1）通过快递方式或在我们指定的实体门店取货（视情况而定）的，阁下应自签收商品次日起计2日内，向在线客服申请退货，并经客服确认后开通售后窗口；</li>
            <li>（2）经我们指定之专业人员检测确认商品符合原销售状态；</li>
            <li>（3）如有赠品，阁下须将赠品一并退回，否则我们将会扣除相关费用。</li>
          </ul>
          <p>2.2 退货流程：</p>
          <p>当阁下的退货申请获得客服确认后，应于签收商品次日起计7日内，按以下方式退回商品：</p>
          <ul>
            <li>（1）如阁下原在我们指定的实体门店提货的，可将符合原销售状态的商品交回该指定门店，或选择第（2）项所列邮寄方式退回；</li>
            <li>（2）如阁下原通过快递方式收取商品的，仅可将符合原销售状态的商品快递退回我们指定的地址，且需自行支付相关的寄运费用（包括运费、保价费及税费等）。</li>
            <li>（3）我们在收到阁下的退货后，会将商品交由指定专业人员进行检查，确认货品符合原销售状态后，将会尽快处理您的退款（自我们收到退回货品次日起计，退款期间预计需要两周时间）。</li>
          </ul>
        </div>
        <div v-if="sliderIndex === 3">
          <p>除不设退换商品外，阁下购买的商品在保持原销售状态及符合以下细则的前提下，仅可自签收商品次日起计7日内与我们协商更换1次。</p>
          <p>4.1 更换条件</p>
          <ul>
            <li>（1）通过快递方式或在我们指定的实体门店取货（视情况而定）的，阁下应自签收商品次日起计2日内，向在线客服申请更换商品，并经客服确认后开通售后窗口；</li>
            <li>（2）经我们指定之专业人员检测确认商品符合原销售状态；</li>
            <li>（3）任何更换不设退回差额、不支持以旧换新服务，且我们只接受更换同类型及同计价方式之商品；</li>
            <li>（4）如阁下在线上下单后，前往我们指定的实体门店提货的，暂不提供在任何线下实体门店更换商品服务。</li>
          </ul>
          <p>4.2 更换流程：</p>
          <ul>
            <li>（1）当阁下的更换商品申请获得客服确认并开通售后窗口后，应于签收商品次日起计7日内，将符合原销售状态的商品通过快递方式寄回我们指定的地址更换，且自行支付相关的寄运费用（包括往来运费、保价费及税费等）。</li>
            <li>（2）我们在收到阁下寄回的商品后，会将商品交由指定专业人员进行检查，确认商品符合原销售状态后，将会尽快协助您更换经客服确认的商品。</li>
          </ul>
        </div>
        <div v-if="sliderIndex === 4">
          <p>若阁下已享受本店推广活动优惠折扣的商品需更换，且更换时优惠期已过，则不能再享有相同优惠。若优惠折扣由我们以外之其他机构提供，则按照该机构的条款及细则处理。</p>
        </div>
        <div v-if="sliderIndex === 5">
          <p>由于网络购物无面对面实物交易过程，系通过第三方寄送商品到顾客手中，可能出现损坏或跟预期有差异等情况，故为阁下提供退换货服务，该服务不适用于T S L | 謝瑞麟各实体门店。</p>
        </div>
        <div v-if="sliderIndex === 6">
          <p>为了保障阁下的权利，我们建议阁下在寄出商品后，将快递单号及时反馈给在线客服，以便我们收到商品后为阁下办理相关业务；在退换货过程中，如遇任何问题，请联系在线客服人员解决（服务电话：020-32107607  服务时间：周一至周五：9:00-18:00 ）</p>
          <p>提供“线上下单，线下提货”服务的实体门店如下所列：</p>
          <ul>
            <li>
              1、北京：北京东直门银座<br>
              地址：北京市东城区东直门外大街48号银座mall一层<br>
              电话：010-64171811
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
      </div>
    </popup>
  </div>
</template>
<script type="text/ecmascript-6">
import { XHeader, Popup } from 'vux'
export default {
  name: 'backgoods',
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
        {title: '2. 定义'},
        {title: '3. 退货'},
        {title: '4. 更换'},
        {title: '5. 购物优惠'},
        {title: '6. 特别说明'},
        {title: '7. 温馨提示'}
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
