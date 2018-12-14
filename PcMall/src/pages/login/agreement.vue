<style lang="scss" rel="stylesheet/scss">
#agreement {
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
        width: 240px;
        height: 80px;
        line-height: 80px;
        color: #4a4a4a;
        font-size: 16px;
        cursor: pointer;
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
      .textIndent{
          text-indent: 2em;
      }
      .fontWeight{
          font-weight: 700;
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
  <div id="agreement">
    <div class="login-title">
      <div class="login-t">普通用户 <span class="xiegang"></span> 用户条款</div>
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
        <div class="position-horizontal-demo" ref="textfuwu">
            <div v-if="this.sliderIndex === 0">
                <p class="textIndent">T S L | 谢瑞麟 网上珠宝店（网址：http://eshop.tslj.cn，下称“本店”）的各项电子服务的所有权和运作权归谢瑞麟(深圳)商贸有限公司（下称“我们”）。本服务条款适用于在中国境内(不包括香港、澳门及台湾)居住之顾客（下称“用户”）在本店订购商品时之交易合约。用户须完全同意所有服务条款并完成注册程序，才能成为本店的正式会员。</p>
            </div>
            <div v-if="this.sliderIndex === 1">
                <p>2.1 用户资格：本店的个人用户必须年满18周岁，具有完全民事行为能力并且未曾被本店临时或无限期中止使用权限；如个人用户不符合前述要求的，本店将不提供相关服务。未满18周岁的个人访客，可以浏览本店页面，但不获提供在线购买商品服务。</p>
                <p style="margin-bottom:0;">2.2 基于本店所提供的网络服务的重要性，用户应同意：</p>
                <ul>
                    <li>提供详尽、准确的个人资料。</li>
                    <li>不断更新注册资料，符合及时、详尽、准确的要求。</li>
                    <li>本店不公开用户的姓名、地址、电子邮箱，除以下情况外：</li>
                    <ul>
                        <li class="textIndent">- 1) 用户授权本店透露上述个人信息。</li>
                        <li class="textIndent">- 2) 司法机关通过法律程序要求本店提供用户的个人资料。</li>
                    </ul>
                </ul>
                <p>2.3 用户注册成为会员时，必须同时接受本店不定期的通过用户所注册的电话号码发布服务信息及相关信息的服务；用户日后可通过本店系统/官网客服取消收取信息。</p>
                <p>2.4 如果用户提供的资料包含有不正确的信息，本店保留终止用户使用网络服务的权利。 </p>
                <p>2.5 用户一旦注册成功，用户将对其用户名和密码安全负全部责任。另外，每个用户都要对以其用户名进行的所有行为负全部法律责任。用户可随时根据需要更改密码。</p>
                <p>2.6 如本店查知未满18周岁的个人用户，该用户的订单将被无条件取消。若个人用户未满18周岁，但希望购买本店的商品，须由用户的监护人协助订购。用户及相关方因未遵守此规定而造成的一切损失，我们将不作承担。</p>
                <p>2.7 用户若发现任何非法使用用户帐号或存在安全漏洞的情况，请立即通知本店。</p>
            </div>
            <div v-if="this.sliderIndex === 2">
                <p>3.1 用户在使用本店提供的服务及购买物品时应遵守所有相关的中国法律、法规、条例和地方性法规。用户还必须遵守相关用户协议和隐私权保护政策及纳入上述文件的所有其它条款和规则的所有规定及不时修订之相关条款。</p>
                <p>3.2 本店将会标明商品的价格，这类信息将随时更改且不另行发出通知。商品的价格包含增值税，送货费将与用户另行结算，该费用根据用户选择之送货方式的不同而异。如发生意外情况，在用户订单确认后，由于供货商提价、税额变化引起的价格变化，或是由于价格的显示错误等造成的商品价格变化，用户有权取消订单，但我们希望用户能及时通过电话或者在线客服渠道通知本店客户服务人员。</p>
                <p>3.3 本店将尽最大努力保证用户所购商品与本店上公布的价格一致，但价目表和说明书并不构成要约。本店有权在发现了本店显现的商品及订单的明显错误或缺货的情况下，单方面撤回订单。</p>
                <p>3.4 本店之商品，只在中国大陆境内(不包括香港、澳门及台湾)销售。</p>
                <p>3.5 用户在订购商品时，务请先确认所在的地区属于本店列明的送达范围，如在送达地区发生订购商品被拒绝运送或没收的情况，本店恕不承担责任。本店也无法因第三方的原因而将货款和送货手续费等退还给顾客。</p>
                <p>3.6 订单经受理后的订购内容、送货地址等将无法变更，订单亦无法取消。</p>
                <p>3.7 因用户输入资料错误而造成商品无法送抵时，本店恕不承担责任。此外，若用户要求将商品再次寄送至正确地址，本店也将有权向用户收取送货资费等费用。</p>
                <p>3.8 将显示有存货之商品放入购物车后，有可能因用户下单的时候恰好订购商品出现缺货而无法进行支付，本店无需就此承担任何违约责任。</p>
                <p>3.9 即使本店发送确认信息后，由于本店内显示的存货讯息并非实时讯息，仍有可能出现部分或全部商品缺货的情况。</p>
                <p>3.10 若订购商品出现缺货，或短缺商品在寄送后有新进货，恕无法追加寄送，敬请重新下单订购。</p>
            </div>
            <div v-if="this.sliderIndex === 3">
                <p>4.1 支付金额为本店最终确认的订单商品之总计金额与送货手续费相加之总计金额。</p>
                <p>4.2 支付方式按照各类支付服务提供商的服务条款规定办理。</p>
            </div>
            <div v-if="this.sliderIndex === 4">
                <p>本政策旨在向用户提供本店的退换商品指引，凡符合本政策规定的可退换的商品，用户可享受我们为您提供的相关协商退货或更换保障。</p>
                <ul>
                    <li class="fontWeight">5.1 定义</li>
                    <li>5.1.1 “商品”指用户选购并成功付款的交易项下商品，且我们已接受该交易。</li>
                    <li>5.1.2 “原销售状态”是指商品经我们专业人员检测并确认：</li>
                    <ul>
                        <li>（1）有完好的包装，齐备所有附带的发票、商品保证单、真品证书及赠品均完好无缺；</li>
                        <li>（2）未曾佩戴、使用或修改，且保持销售时的状态；及</li>
                        <li>（3）无任何损坏。</li>
                    </ul>
                    <li>5.1.3 “不设退换商品”是指，部分商品因应其产品性质，不设退货或更换，包括：</li>
                    <ul>
                        <li>（1）特别订造、有花损、经雕刻或修改的商品；</li>
                        <li>（2）销售发票注明 “不设退货及更换”之商品。</li>
                        <li>（3）黄金、铂金商品（根据本店标示的每日金价计算价格的商品）</li>
                    </ul>
                </ul>
                <br>
                <ul>
                    <li class="fontWeight">5.2 退货</li>
                    <li>除不设退换商品外，用户购买的商品在保持原销售状态及符合以下细则的前提下，可自签收商品次日起计7日内与我们协商退货，如经确认同意退货的，将会按用户购买商品时的支付方式退回实际支付的款项。</li>
                    <li>5.2.1 退货条件</li>
                    <ul>
                        <li>（1）通过快递方式或在我们指定的实体门店取货（视情况而定）的，用户应自签收商品次日起计2日内，向在线客服申请退货，并经客服确认后开通售后窗口；</li>
                        <li>（2）经我们指定之专业人员检测确认商品符合原销售状态；</li>
                        <li>（3）如有赠品，用户须将赠品一并退回，否则我们将会扣除相关费用。</li>
                    </ul>
                    <li>5.2.2 退货流程：</li>
                    <li>当用户的退货申请获得客服确认后，应于签收商品次日起计7日内，按以下方式退回商品：</li>
                    <ul>
                        <li>（1）如用户原在我们指定的实体门店提货的，可将符合原销售状态的商品交回该指定门店，或选择第（2）项所列邮寄方式退回； </li>
                        <li>（2）如用户原通过快递方式收取商品的，仅可将符合原销售状态的商品快递退回我们指定的地址，且需自行支付相关的寄运费用（包括运费、保价费及税费等）。</li>
                        <li>（3）我们在收到用户的退货后，会将商品交由指定专业人员进行检查，确认商品符合原销售状态后，将会尽快处理您的退款（自我们收到退回货品次日起计，退款时间预计需要15个工作日）。</li>
                    </ul>
                </ul>
                <br>
                <ul>
                    <li class="fontWeight">5.3 更换</li>
                    <li>除不设退换商品外，用户购买的商品在保持原销售状态及符合以下细则的前提下，仅可自签收商品次日起计7日内与我们协商更换1次。</li>
                    <li>5.3.1 更换条件</li>
                    <ul>
                        <li>（1）通过快递方式或在我们指定的实体门店取货（视情况而定）的，用户应自签收商品次日起计2日内，向在线客服申请更换商品，并经客服确认后开通售后窗口；</li>
                        <li>（2）经我们指定之专业人员检测确认商品符合原销售状态；</li>
                        <li>（3）任何更换不设退回差额、不支持以旧换新服务，且我们只接受更换同类型及同计价方式之商品； </li>
                        <li>（4）如用户在线上下单后，前往我们指定的实体门店提货的，暂不提供在任何线下实体门店更换商品服务。</li>
                    </ul>
                    <li>5.3.2 更换流程：</li>
                    <ul>
                        <li>（1）当用户的更换商品申请获得客服确认并开通售后窗口后，应于签收商品次日起计7日内，将符合原销售状态的商品通过快递方式寄回我们指定的地址更换，且自行支付相关的寄运费用（包括往来运费、保价费及税费等）。</li>
                        <li>（2）我们在收到用户寄回的商品后，会将商品交由指定专业人员进行检查，确认商品符合原销售状态后，将会尽快协助您更换经客服确认的商品。
                        </li>
                    </ul>
                </ul>
                <br>
                <ul>
                    <li class="fontWeight">5.4 购物优惠</li>
                    <li>若用户已享受本店推广活动优惠折扣的商品需更换，且更换时优惠期已过，则不能再享有相同优惠。若优惠折扣由我们以外之其他机构提供，则按照该机构的条款及细则处理。</li>
                </ul>
                <br>
                <ul>
                    <li class="fontWeight">5.5 特别说明</li>
                    <li class="fontWeight">由于网络购物无面对面实物交易过程，系通过第三方寄送商品到顾客手中，可能出现损坏或跟预期有差异等情况，故为用户提供退换货服务，该服务不适用于T S L | 谢瑞麟各实体门店。</li>
                </ul>
                <ul>
                    <li class="fontWeight">温馨提示</li>
                    <li class="fontWeight">为了保障用户的权利，我们建议用户在寄出商品后，将快递单号及时反馈给在线客服，以便我们收到商品后为用户办理相关业务；在退换货过程中，如遇任何问题，请联系在线客服人员解决（服务电话：020-32107607  服务时间：周一至周五：9:00-18:00）。</li>
                    <li class="fontWeight">提供“线上下单，线下提货”服务的实体门店如下所列：</li>
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
                </ul>
            </div>
            <div v-if="this.sliderIndex === 5">
                <ul>
                    <li>6.1 说明：</li>
                    <li>  6.1.1 用户在本店购买的商品需享用售后服务。用户可以凭商品保证单在全线谢瑞麟分店享受全国统一的售后服务，包括免费进行商品验货、为用户提供谢瑞麟品牌商品的维修保养服务。其中常规保修的服务项目包括商品清洁、翻新、商品检查及简单性保养维护服务。</li>
                    <li>  6.1.2 非常规性保修项目需计费，如更换损耗配件，配制遗失物料或改大圈号超出常规范围而加金等维修服务，费用请向客服查询。</li>
                    <li>  6.1.3 交修之商品可能因款式或损毁情况所限，如无法修理；我们将退回交修之商品及相关的预付款项。我们保留不承接非常规维修要求的权利。</li>
                    <li>  6.1.4 交修之商品在维修过程中，金属部分可能会出现损耗。实际损耗会因商品状况及修复程度有所不同，但我们会尽可能减少有关损耗。维修效果与全新商品不尽相同也属正常情况，请顾客给予理解。</li>
                    <li>  6.1.5 我们将妥善保管顾客交付之商品。如交付之商品在我们负责保管期间发生损坏、被窃或遗失，我们将以价格相近的同类产品或不超过报修工作单上约定商品价值的等值现金作为补偿，并以此为限。</li>
                </ul>
            </div>
            <div v-if="this.sliderIndex === 6">
                <p>本店不提供任何回购或以旧换新服务。</p>
            </div>
            <div v-if="this.sliderIndex === 7">
                <p>8.1 我们有义务在技术上确保本店的正常运行，尽力避免服务中断或将中断时间限制在最短时间内，保证用户网上交易活动的顺利进行。但如因不可抗力或其它我们无法控制的原因使本店崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等，我们不承担任何相关责任；因用户向我们提供错误、不完整、不实信息等造成不能正常使用网上服务或遭受任何其它损失，由用户自己承担责任。</p>
                <p>8.2 我们对任何直接、间接、偶然、特殊及继起的损害不负责任，这些损害可能来自：不正当使用网络服务，非法使用网络服务或用户传送的信息有所变动等。这些行为都有可能会导致我们的形象受损，因此事先提醒用户注意。</p>
                <p>8.3 本店包含许多链接，该等链接所指向之网页或资料均为被链接本店所提供，相关权利并由该等本店或合法权利人所有，本店不担保其正确性、实时性或完整性。我们对本店中所提及或所连结的本店的内容的疏漏或错误，不负任何责任。</p>
                <p>8.4 用户使用本店提供的定制服务时，应对其所提供的资料所有权等信息负责。如因用户提供的该类资料发生任何侵权行为，本店不承担任何责任。</p>
            </div>
            <div v-if="this.sliderIndex === 8">
                <p>9.1 我们拥有本店之全部材料及内容(包括但不限于文字、影像、声音、视像、软件、网页、设计、外观与感觉等等) 的所有知识产权权利等，用户同意只限于本条款所订明，与及我们以书面明确授权方式使用此数据及或内容，用户不得以其他方式复制、复写、传送、分发、公开展示、商业开发或利用、改编、翻译、修改、合并、共享或向任何人或机构提供此等数据或内容或创作衍生产品。</p>
                <p>9.2 “谢瑞麟集团属下的公司”、“ eshop.tslj.cn”、“谢瑞麟商标”,”TSL|谢瑞麟”及于本店内展示的商品商标、服务商标和商号，其使用权均属于我们或我们授权使用之合法权利人所有，非经书面授权同意，不得使用任何本店展示的任何商标。</p>
                <p>9.3 经合法授权复制本店内容的全部或某一部份时，都必须包含本知识产权声明，本店之知识产权声明、商标或其它声明等均严禁更改或移除。</p>
                <p>9.4 本店内的著作所有权、网址所有权、商标使用权及商业秘密，我们均予保留。</p>
            </div>
            <div v-if="this.sliderIndex === 9">
                <p>10.1 用户在本店登记的姓名、电话号码、地址等个人资料发生更改时，请立即登入本本店(http:// eshop.tslj.cn)进入“我的帐户”中进行更改。</p>
                <ul>
                    <li>10.2 当用户发生下列行为时，我们有权随时删除用户个人资料。</li>
                    <li>(1) 当用户不遵守本条款时。</li>
                    <li>(2) 有妨碍其它用户或我们的合法权益的行为并造成损失，或有其它不正当行为时。</li>
                    <li>(3) 一年以上未使用时。</li>
                    <li>(4) 我们认为其不适合作为用户的其他原因。</li>
                    <li>(5) 用户存在违反中国法律法规及政府要求的行为。</li>
                </ul>
                <p>10.3 如因我们原因造成用户损失的，我们对有关交易合约以外的损失不负任何责任。</p>
                <p>10.4 对于商品销售过程中，我们与用户之间发生的纠纷在双方协商无法解决时，应依据中国法律，在谢瑞麟(深圳)商贸有限公司所在地法院通过裁判予以解决。</p>
                <p>10.5 用户提供之个人资料，我们仅用于向用户销售商品以及通过互联网、邮政局等渠道向用户提供有关商品之讯息等，绝不用于除此以外之任何非法目的。当用户要求删除或更改个人资料时，我们将会迅速反应并作出相应更新。</p>
                <p>10.6 本店的服务条款用于为用户提供的商品销售服务，这些条款将有可能不时被修订、删除。服务条款一旦发生变动，将会在本店的显著页面发布修改内容。如用户不同意修订内容，可以主动取消账户。如用户选择接受相关服务，则视为接受服务条款的变动。</p>
                <p>10.7 我们保留随时修改或暂停本店服务而不需事先通知用户的权利。我们行使修改或暂停本店服务的权利，无需对用户或第三方承担任何责任</p>
                <p>10.8 用户在提交订单之前已充分阅读和理解上述服务条款，并愿意接受和承担相关法律责任。 </p>
                <p>10.9 用户知悉并同意，我们有权随时根据本店运营情况对本条款内容作适当更改。</p>
            </div>
            <div class="clear"></div>
        </div>
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
          title: '2. 用户注册'
        },
        {
          title: '3. 订购和送货'
        },
        {
          title: '4. 支付'
        },
        {
          title: '5. 商品退换政策'
        },
        {
          title: '6. 售后服务'
        },
        {
          title: '7. 回购、以旧换新'
        },
        {
          title: '8. 免责声明'
        },
        {
          title: '9. 知识产权声明'
        },
        {
          title: '10. 其它'
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
