<style lang="scss" rel="stylesheet/scss">
    #screatment {
        padding: 50px 0;
        background: #fafafa;
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
        .login-title{
            height: 80px;
            text-align: center;
            .login-t{
                position: relative;
                display: inline-block;
                text-align: center;
                font-size: 20px;
                color: #0F0F0F;
            }
            .login-t:after{
                content: '';
                position: absolute;
                bottom: -20px;
                left: 50%;
                margin-left: -20px;
                display: inline-block;
                width: 40px;
                height: 2px;
                background-color: #504379;
            }
            .xiegang:after{
                content: '';
                position: relative;
                top: 8px;
                margin: 0 15px;
                display: inline-block;
                width: 1px;
                height: 30px;
                background-color: #2E0F6E;
                transform: rotate(30deg);
            }
        }
        .vux-popup-dialog {
            background: #fff;
        }
        .content {
            margin: 0 10%;
            padding: 80px 0;
            width: 80%;
            height: 600px;
            background: #fff;
            font-size: 14px;
            color: #7F7F7F;
        }
        .content-menu {
            width: 330px;
            height: 100%;
            float: left;
            /*height: calc(100% - 120px);*/
            overflow-y: scroll;
        }
        h6 {
            color: #000000;
        }
        p, h6 {
            /*margin: 10px 0;*/
        }
        .divider {
            width: 100%;
            height: 1px;
            margin-bottom: 20px;
            margin-top: 10px;
            display: block;
        }
        .slide {
            padding: 0 50px;
            li{
                padding-left: 50px;
                width: 250px;
                height: 80px;
                line-height: 80px;
                color: #4a4a4a;
                font-size: 16px;
            }
            .divider {
                margin-bottom: 0;
                margin-top: 2px;
            }
            .slideActive{
                border: 2px solid #352665;
            }
        }
        .slide-panel {
            /*padding-top: 15px;*/
            /*padding-left: 40px;*/
            /*padding-bottom: 15px;*/
            /*color: #000;*/
        }
        .position-horizontal-demo {
            margin-right: 60px;
            padding-right: 30px;
            float: right;
            width: 540px;
            height: 100%;
            overflow-y: scroll;
            font-size: 14px;
            color: #454545;
            background: #fff;
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
        /*滚动条样式*/
        .content-menu::-webkit-scrollbar ,.position-horizontal-demo::-webkit-scrollbar{
            /*滚动条整体样式*/
            width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 2px;
        }
        .content-menu::-webkit-scrollbar-thumb ,.position-horizontal-demo::-webkit-scrollbar-thumb{
            /*滚动条里面小方块样式*/
            border-radius: 6px;
            background: #979797;
        }
        .content-menu::-webkit-scrollbar-track ,.position-horizontal-demo::-webkit-scrollbar-track{
            /*滚动条里面轨道样式*/
            background: transparent;
        }
    }
</style>
<template>
<div>
<header1></header1>
<header2></header2>
  <div id="screatment">
    <div class="login-title">
      <div class="login-t">普通用户 <span class="xiegang"></span> 隐私协议</div>
    </div>
    <div class="content">
      <div class="content-menu">
        <ul class="slide">
          <li v-for="(item, index) in sliderList" :key="index" :class="{slideActive:sliderIndex==index}">
            <div class="slide-panel" @click="showSlider(index)">
              <span>{{item.title}}</span>
            </div>
          </li>
        </ul>
      </div>
    <!--<popup v-model="show" position="right" width="100%" :show-mask="false">-->
      <!--<XHeader :left-options="headerContent.slider" :title="sliderTitle" @on-click-back="sliderBack" style="position:fixed;z-index:1;width:100%"></XHeader>-->
      <div class="position-horizontal-demo" ref="textCon">
        <div v-if="this.sliderIndex === 0">
          <p>隐私权保护政策适用于在中国境内(不包括香港、澳门及台湾)居住的，在TSL | 谢瑞麟 网上珠宝店（网址：http://eshop.tslj.cn，下称“本店”）订购商品之顾客（下称“用户”），本店的各项电子服务的所有权和运作权归谢瑞麟(深圳)商贸有限公司（下称“我们”）。</p>
        </div>
        <div v-if="this.sliderIndex === 1">
          <p>2.1 我们收集个人资料，以确保我们可履行服务承诺，并在本店为用户带来个人化体验。</p>
          <p style="margin-bottom:0;">2.2 我们可能会因应用户使用我们的服务，向用户收集不同程度的个人资料︰</p>
          <ul>
            <li>1）如果用户并非注册用户，而是以访客身份以不记名方式浏览本店，我们不会向用户收集任何个人资料，但用户可能无法使用我们向注册用户所提供的服务及内容。</li>
            <li>2）用户须输入相关个人资料进行注册，以便我们处理一些向注册用户提供的内容及服务，如电子邮件更新或向客户服务部索取数据；我们可能会为相关项目而储存若干就该项目内容及服务而提供的数据，用户有权拒绝向我们提供个人资料，但我们可能因此不能提供部分服务及功能。</li>
            <li>3）用户可以访客的身份在本店下订单，我们仅收集履行相关订单所需的数据（例如：用户的姓名、联系方式和付款数据）。</li>
            <li>4）用户参与我们的宣传及推广活动时，须向我们提供个人资料 。</li>
            <li>5）用户还可以使用其他的社交网络登录信息，或其他与本店相连的登录服务登录本店。这些服务的供应商可能会核实用户的身份，并向用户提供与我们分享某些个人资料的选择，例如用户的名字及电邮地址，以完成本店预先设定的注册表格。这些服务的供应商为用户提供本店的活动信息，以及在用户的个人页面及个人网络里与他人分享的选择。</li>
            <li>6）用户还可以使用本店上运行的其他社交网络功能、Widgets及／或小型互动程序，这些功能是小的内容模块，或会收集个人资料，包括用户的IP地址、用户在本店浏览的网页，或设置Cookie使之可以妥善运作；这些社交网络功能是由我们或第三方在本店设置，如果相关功能是由第三方提供，则对用户的个人资料的使用将受该第三方的隐私政策规管，因此用户须审阅、知悉并遵守该等第三方的隐私政策，我们概不对该等政策承担任何责任或法律责任。</li>
          </ul>
          <p style="margin-bottom:0;">2.3 我们可能会将用户的个人资料作以下用途︰</p>
          <ul>
            <li>1）回应用户的查询；</li>
            <li>2）推广新产品、在线的活动或宣传，详情请参阅「直接促销」部份；
按用户提供的个人资料与用户沟通，如电话、电邮、短讯、智能电话应用程序的推动通知或邮寄方式；
</li>
            <li>3）特定功能：如与朋友分享产品、维持用户的购物清单、维持用户在本店的购物袋，包括对用户数据的确认和安全审查及处理用户的付款；</li>
            <li>4）进行顾客市场调查，分析趋势及行为，用以提升我们的产品及服务水平；让我们可按规定作披露以符合任何具约束力的法例、法规或法院指令要求；及与上述直接有关的所有用途。</li>
          </ul>
          <p style="margin-bottom:0;">2.4 当用户再次登录本店时，我们使用Cookies</p>
          <ul>
            <li>用户进行确认，为用户提供个人化的购物体验并且保留购物袋内的物品。Cookies是储存于用户电子装置或设备上的细小数据文件，能自动被大多数浏览器所接受。用户可改变浏览器的选项，以获通知被设定新的Cookies、删除旧的Cookies或者整体封锁Cookies。请注意，如果封锁Cookies，用户可能会无法使用本店提供的所有内容及服务。</li>
          </ul>
          <p>2.5 我们会自动收集有关用户在线使用情况的不记名数据，以获得我们服务器使用量的统计数据，并帮助我们更妥善迎合用户的需求及期望，这可能包括但不限于用户的浏览器类型及版本、用户的操作系统、用户的IP地址及／或域名。</p>
        </div>
        <div v-if="this.sliderIndex === 2">
          <p>3.1 本政策适用于本店，但不适用于与我们进行连结或合作宣传的其他公司或组织设立的网站。</p>
          <p>3.2 非经用户同意，我们不会向该等广告商或第三方网站提供任何可识别个人身份的顾客资料。如果用户通过本店的连接，进入任何该等网站或向第三方提交数据，在用户提交个人资料前，请查阅、知悉并遵守该等网站的隐私政策，我们概不对该等政策承担任何责任或法律责任。</p>
        </div>
        <div v-if="this.sliderIndex === 3">
          <p>4.1 我们可能使用用户的个人资料履行我们的客户服务承诺，此等数据的发放受到实质、电子及管理措施保障，我们的雇员及代理只会因工作需要才取得用户的数据。</p>
          <p>4.2 我们将绝对不会以书面形式或电话方式询问用户的个人密码，请用户妥善保护密码及电子装置或设备，避免受到未经授权使用。</p>
          <p>4.3 请注意：虽然在提供(不论是亲自提供、通过电话或互联网提供)个人资料时经常存在相关的风险，而且任何技术系统均不能完全安全、或能抵御 "窜改" 或 "计算机黑客" 的侵袭，但我们已作出努力采取适当的措施，防止并尽量减少他人未经授权进入、不适当地使用用户的私人数据，以及防止用户的个人资料出现不准确的情况。例如，我们在收集或传送诸如信用卡数据的敏感数据时均使用加密技术。</p>
        </div>
        <div v-if="this.sliderIndex === 4">
          <p>5.1 我们不会故意通过本店向儿童或未满十八岁的青年索取讯息，或对他们进行市场推广。</p>
          <p>5.2 如果用户未满十八岁，用户必须在使用本店及其服务前，让父母或监护人知悉本政策及我们的<a href="/#/agreement">[服务条款]</a></p>
        </div>
        <div v-if="this.sliderIndex === 5">
          <p style="margin-bottom:0;">6.1 我们所持有的用户的个人资料将被保密，但为履行收集数据的目的或与其直接有关的目的时，我们可能会向以下各方披露数据︰</p>
          <ul>
            <li>1）我们的任何附属公司或联属公司，或受我们控制的公司，或与我们受共同控制的公司；任何代表我们行事的人士或公司，或与我们共同行事的任何人士或公司，以符合用户提供数据的目的或与其直接有关的目的；</li>
            <li>2）须向我们承担保密责任，并已承诺将有关资料保密的任何其他人士或公司，该人士或公司需有合法权利取得有关资料；</li>
          </ul>
          <p>6.2 用户的个人资料亦可能根据任何法定或合约义务，政府机关或法庭的要求而向任何人士披露，惟该人士或该等人士须能够证明取得有关资料的所需权利／权限。</p>
        </div>
        <div v-if="this.sliderIndex === 6">
          <p>7.1 用户向我们提供的个人资料，我们可能用作直接促销目的。就此请留意；</p>
          <p> 7.1.1 我们会使用所持有的用户的姓名、性别、电邮地址、电话号码、居住城巿、地址、邮编、出生日期、其他服务组合信息、交易模式与行为及人口巿场统计资料作直接促销。</p>
          <p style="margin-bottom:0;">7.1.2 我们会使用用户的个人资料推广我们以下的货品及服务：</p>
          <ul>
            <li>1）珠宝货品及配件，赠品；</li>
            <li>2）与上述货品有关的顾客服务；</li>
            <li>3）社交网络服务；</li>
            <li>4）顾客回馈、长期支持或礼遇活动与有关的服务、货品及设施；</li>
            <li>5）与上述项目有关的在线购物服务；及</li>
            <li>6）与上述项目相关的推广/社交活动。</li>
          </ul>
          <p>7.2 我们也会将用户的个人资料向其他附属公司或本集团内的公司发放，以用于直接促销。有关此项，请注意：</p>
          <p> 7.2.1 上述6.1.1项描述的各项个人资料会由我们向集团其他公司提供作直接促销之用。</p>
          <p> 7.2.2 集团其他公司会使用所述用户的个人资料促销上述6.1.2项的货品及服务。</p>
          <p>7.3 我们会按本政策使用用户提供的个人资料作直接促销并只提供予集团其他公司。</p>
          <p>7.4 如用户不希望我们使用或提供予集团其他公司作直接促销，用户可在任何时间免费以电邮或电话向我们提出。</p>
        </div>
        <div v-if="this.sliderIndex === 7">
          <p style="margin-bottom:0;">8.1 在本政策下，用户本人拥有以下权利：</p>
          <ul>
            <li>1）要求了解我们是否持有用户的资料;</li>
            <li>2）要求阅览第1）项所列资料；及</li>
            <li>3）要求修正第1）项所列资料（须提交相关证明）。</li>
          </ul>
          <p>8.2 用户可以下列方式提出以上要求：</p>
          <p> 8.2.1 电邮至ehsop-cs@tslj.com</p>
          <p>8.3 按本政策的条款，我们有权为处理任何数据存取的要求而收取合理的费用。</p>
        </div>
        <div v-if="this.sliderIndex === 8">
          <p>我们保留随时修订本政策的权利，并会在本店或我们的相关网站上登载相关修订内容。本隐私政策并不构成我们与用户达成的任何合约权利或任何其他法律权利。</p>
        </div>
        <div class="clear"></div>
      </div>
    <!--</popup>-->
    </div>
  </div>
<v-footer></v-footer>
</div>
</template>
<script type="text/ecmascript-6">
import header1 from '../homePages/header1'
import header2 from '../homePages/header2'
import vFooter from '../homePages/footer.vue'
import { XHeader, Popup } from 'vux'
export default {
  name: 'screatment',
  components: {
    XHeader,
    Popup,
    header1,
    header2,
    vFooter,
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
      sliderIndex: 0,
      show: false,
      // 条款数据
      sliderList: [
        {
          title: '1. 前言'
        },
        {
          title: '2. 如何收集及使用用户数据'
        },
        {
          title: '3. 第三方'
        },
        {
          title: '4. 用户数据的安全及保障'
        },
        {
          title: '5. 儿童'
        },
        {
          title: '6. 披露用户的个人资料'
        },
        {
          title: '7. 直接促销'
        },
        {
          title: '8. 用户的资料存取权利'
        },
        {
          title: '9. 免责声明'
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
        this.$refs.textCon.scrollTo(0, 0)
      }
    }
  }
}
</script>
