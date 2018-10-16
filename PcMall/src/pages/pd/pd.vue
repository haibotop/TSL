<template>
  <div>
    <header1></header1>
    <header2></header2>
    <div id="detail">
      <div class="detail-title"><div class="detail-t">珠宝类型 <span class="xiegang"></span> 戒指</div></div>
      <div class="detail-content">
        <div class="breadcrumb">
          <template>
              <Breadcrumb separator=">">
                <BreadcrumbItem to="/" class="color">首页</BreadcrumbItem>
                <BreadcrumbItem to="/components/breadcrumb">珠宝类型</BreadcrumbItem>
                <BreadcrumbItem to="/">戒指</BreadcrumbItem>
                <BreadcrumbItem to="/" class="last">型号</BreadcrumbItem>
            </Breadcrumb>
          </template>
        </div>
        <div class="detail-content-center">
          <div class="detail-content-left">
            <div class="goodDetails_name_img">
              <div class="little_img" >
                  <Icon type="ios-arrow-up" @click='handleMove(1)'/>
                  <div>
                    <ul ref="picMove" :style="moveTop">
                      <li v-for="(img,index) in swiperData" :key="index" @click="getIndex(img.src,index)" :class="{active:active === index}">
                          <img :src="img.src">
                      </li>
                    </ul>
                  </div>
                  <Icon type="ios-arrow-down" @click='handleMove(2)'/>
              </div>
              <div class="big_img">
                  <img ref="ImgUrl" :src="ImgUrl">
              </div>
            </div>
          </div>
          <div class="detail-content-right">
            <h3 class="title">{{skuInfo.sku ? handleName(skuInfo.sku.name) : ''}}</h3>
            <div class="adv">
              <div v-for="(item, index) in commonSpecArray" :key="index" v-show="item.specName === '商品广告词'" class="p-adv">
                {{handleSpecValueArray(item.specValueArray)}}
              </div>
            </div>
            <div class="price">
              <p>价格：<span class="sp_1">￥{{skuInfo.sku ? handlePrice(skuInfo.sku.price) : 0}}</span>
                <span class="sp_2" @click="collect">
                    <span v-show="!isCollected"><img src="../../assets/icons/heart.png"  style="width:20px;float: left;margin-right: 8px;margin-top: 10px;"/>添加收藏</span>
                    <span v-show="isCollected"><img src="../../assets/icons/heart-fill.png" style="width:20px;float: left;margin-right: 8px;margin-top: 10px;"/>已收藏</span>
                </span>
              </p>
            </div>
            <div class="originalPrice">原价：<span>￥{{skuInfo.sku ? handlePrice(skuInfo.sku.originalPrice) : 0}}</span></div>
            <div class="spec" v-for="(item, index) in specArray" :key="index">
              <span style="float:left">{{handleName(item.specName)}}：</span>
              <!-- <span class="spec-sp2"
                v-for="(item2, index2) in item.specValueArray"
                :key="index2"
                :value="item2"
                :disabled="!item.specValueFlags[index2]">{{item2.specValueName}}
                <Icon type="ios-checkmark" size="18"/>
                <div class="triangle_border_left">
                    <span></span>
                </div>
              </span> -->
              <template>
                <!-- <RadioGroup class="spec-check" v-model="xoxoxo"  type="button" @on-change="toOtherSpec($event,specArrayOn[index])">
                  <div v-for="(item2, index2) in item.specValueArray" :key="index2">
                    <Radio
                    :label="item2.specValueName"
                    :disabled="!item.specValueFlags[index2]"
                    @click.native="checkSpec(index,index2)"
                    :value="JSON.stringify(item2)"
                    >
                    </Radio>
                    <Icon type="ios-checkmark" size="18" v-if="index==xoxo&&index2==isShowCheckSpec"/>
                    <div class="triangle_border_left" v-if="index==xoxo&&index2==isShowCheckSpec">
                        <span></span>
                    </div>
                  </div>
                </RadioGroup> -->
                <Checker
                  @on-change="onItemClick"
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
                    :disabled="!item.specValueFlags[index2]">{{item2.specValueName}}
                  </checker-item>
                </Checker>
              </template>
            </div>
            <div class="number">
              <p>数量：</p>
              <span class="tb-stock" id="J_Stock">
                <a href="javascript:void(0);" title="减1"  :class="{'tb-reduceActive':reduceActive}" class="tb-reduce J_Reduce tb-iconfont" @click="reduceNumber">-</a>
                <input id="J_IptAmount" type="text" class="tb-text" v-model="buyNumber"  maxlength="8" title="请输入购买量">
                <a href="javascript:void(0);"  class="tb-increase J_Increase tb-iconfont" title="加1" @click="addNumber">+</a>件
              </span>
            </div>
            <div class="cost">
              <span>运费：免运费</span>
              <!-- <span style="margin-left:250px">配送及退换</span> -->
              <Dropdown @mouseenter.native="handleOpen" @mouseleave.native="handleOpen" trigger="custom" placement="top-end"  :visible="visible" style="margin-left: 220px;padding-left:10px;padding-right:6px" :class="{bgColor:bgColor}" >
                <a href="javascript:void(0)" >
                    <span>配送及退换</span>
                    <Icon :type="type" size="16"></Icon>
                </a>
                <DropdownMenu  slot="list" class="cost-detail" >
                  <div class="cost-detail-content" style="width:730px">
                    <div class="left">
                      <div v-if="backGoodsArrayIndex==0">
                        <h2>前言</h2>
                        <p >为了提升您的购物体验，我们提供快递配送/门店自提服务，您可以根据您的个人需要，选择合适的配送方式，如有任何问题，欢迎联系我们的在线客服。</p>
                      </div>
                      <div v-if="backGoodsArrayIndex==1">
                        <h2>发货时间</h2>
                        <p>您所订购的商品，将在订单付款成功后1-2周内发出。</p>
                      </div>
                      <div v-if="backGoodsArrayIndex==2">
                        <h2>快递配送服务</h2>
                        <p>3.1 指定快递：EMS中国邮政速递或顺丰快递，全场免运费（仅限中国大陆地区，不包括港澳台或海外地区）。同时，我们会为商品购买全程运输保险。</p>
                        <p>3.2 收货提醒：因寄送物为贵重商品，为保障您的合法权益，建议本人当面验货，并签收包裹。如有问题，请及时与在线客服联系，我们将诚挚为您提供服务。</p>
                      </div>
                      <div v-if="backGoodsArrayIndex==3">
                        <h2>门店自提服务（仅限中国大陆地区）</h2>
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
                      <div v-if="backGoodsArrayIndex==4">
                        <h2>商品包装</h2>
                        <p>我们会为每个订单，配备商品保证书、商品清单、精美首饰盒及手提袋等。</p>
                      </div>
                      <div v-if="backGoodsArrayIndex==5">
                        <h2>退换货政策</h2>
                        <p>............</p>
                      </div>
                    </div>
                    <div class="right">
                      <ul>
                        <li v-for="(item,index) in backGoodsArray">
                          <Icon type="ios-arrow-back" /><span @mouseenter="backGoodsArrayFuc(index)">{{item}}</span>
                        </li>
                        <!-- <li><Icon type="ios-arrow-back" /><span>前言</span></li>
                        <li><Icon type="ios-arrow-back" /><span>发货时间</span></li>
                        <li><Icon type="ios-arrow-back" /><span>快递配送服务</span></li>
                        <li><Icon type="ios-arrow-back" /><span>门店自提服务（仅限中国大陆地区）</span></li>
                        <li><Icon type="ios-arrow-back" /><span>商品包装</span></li>
                        <li><Icon type="ios-arrow-back" /><span>退换货政策</span></li> -->
                      </ul>
                    </div>
                  </div>
                </DropdownMenu>
                <!-- <DropdownMenu slot="list">
                    <Dropdown placement="left-start">
                        <DropdownItem>
                          <Icon type="ios-arrow-back"></Icon>
                            前言
                        </DropdownItem>
                        <DropdownMenu slot="list" >
                            <h2>前言</h2>
                            <p>为了提升您的购物体验，我们提供快递配送/门店自提服务，您可以根据您的个人需要，选择合适的配送方式，如有任何问题，欢迎联系我们的在线客服。</p>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown placement="left-end">
                        <DropdownItem>
                          <Icon type="ios-arrow-back"></Icon>
                            发货时间
                        </DropdownItem>
                        <DropdownMenu slot="list">
                            erere
                        </DropdownMenu>
                    </Dropdown>

                    <DropdownItem>冰糖葫芦</DropdownItem>
                </DropdownMenu> -->
              </Dropdown>
            </div>
            <!-- 领券 -->
            <!-- <Cell is-link v-show="specStr.length > 0" @click.native="openGetCoupon" v-if="hasCoupon">
              <div slot="title" class="my-cell-title" style="display: inline-block;">领券</div>
            </Cell> -->
            <!-- 促销 -->
            <pdPromotion ref="pdPromotion" v-if="getSkuCompeleted"></pdPromotion>
            <div class="cart">
              <Button v-show="!disabledBuy && modalmodel === ''" @click="createOrder" class="btn1">立即购买</Button>
              <Button v-show="!disabledBuy && modalmodel === ''" @click="postCartItem" class="btn2" id="signup">加入购物袋</Button>
              <Button v-show="disabledBuy" onclick="qimoChatClick()" class="btn1" >联系客服</Button>              
              <!-- <div v-show="!disabledBuy && modalmodel === ''" :class="cartBtnStyle" @click="postCartItem">加入购物袋</div>
              <div v-show="!disabledBuy && modalmodel === ''" :class="buyBtnStyle" @click="createOrder">直接购买</div>
              <div v-show="disabledBuy" class="call-service" onclick="qimoChatClick();">联系客服</div> -->
            </div>
          </div>
        </div>
        <div style="clear:both"></div>
        <div class="detail-content-bottom">
          <template>
            <Tabs value="name1" size="small" class="ioioi">
                <TabPane label="产品详情" name="name1">
                  <pdRichText ref="pdRichText" :spuId="spuId"></pdRichText>
                </TabPane>
                <TabPane label="规格参数" name="name2">
                  <table>
                    <tbody>
                      <tr v-for="(item, index) in commonSpecArray" :key="index" v-if="item.specName!=='商品广告词'">
                        <td class="left-td">{{item.specName}}</td>
                        <td class="right-td">{{handleSpecValueArray(item.specValueArray)}}</td>
                      </tr>
                    </tbody>
                  </table>
                </TabPane>
            </Tabs>
        </template>
        </div>
      </div>
    </div>
  </div>
</template>

 <script >
 //type="text/ecmasprict-6"
  import header1 from '@/pages/homePages/header1'
  import header2 from '@/pages/homePages/header2'
  import vFooter from '@/pages/homePages/footer.vue'
  import * as tool from '@/services/myTool.es6'
  import * as pdAPI from '@/services/API/pdServices.es6'
  import * as mkApi from '@/services/API/marketing.es6'
  import { XHeader, Scroller, Group, CellBox, Cell, TransferDom, Popup, Checker, CheckerItem, XNumber, InlineXNumber, debounce, Tab, TabItem, XTable, Badge } from 'vux'
//   import pdSwiper from './pdSwiper3.vue'
  import pdRichText from './pdRichText.vue'
//   import pdCoupons from '../promotion/pdCoupons.vue'
  import pdPromotion from '@/pages/promotion/pdPromotion.vue'
  import {getSkuInfo} from '@/services/API/pdServices.es6'
  let interval
  let getSkuCancel
  let interval2 // 用于计算‘一次上拉’是否显示
  export default {
    name: 'pd',
    // directives: {
    //   TransferDom
    // },
    components: {
      header1,
      header2,
      pdRichText,
      Checker,
      CheckerItem,
      pdPromotion
    },
    // components: Object.assign({ XHeader, Scroller, Group, CellBox, Cell, Popup, Checker, CheckerItem, InlineXNumber, XNumber, debounce, Tab, TabItem, XTable, Badge }),
    data () {
      return {
        backGoodsArray:['前言','发货时间','快递配送服务','门店自提服务（仅限中国大陆地区）','商品包装','退换货政策'],
        backGoodsArrayIndex : 0,
        xoxo:0,
        reduceActive: false,//商品减到0
        buyNumber: 1,//商品数量
        isShowCheckSpec: 0,//三角形样式
        type:"ios-arrow-down",
        bgColor:false,
        visible: false,
        imgUrlLength:1,
        active: 0,
        moveTop:{
          top: "0px"
        },
        imgUrl: [
          {index:1, src: require('../../assets/images/logo.png')},
          {index:2, src: require('../../assets/images/anmoqi.jpg')},
          {index:3, src: require('../../assets/images/style_03.jpg')},
          {index:4, src: require('../../assets/images/style_02.jpg')},
          {index:5, src: require('../../assets/images/logo.png')}
        ],
        ImgUrl: '',
        filstLoad: 0,
        color: '#352665',
        leftOption: {
          backText: ''
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
        scrollerHeight: 0,
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
        modalmodel: '', // 0 加入购物车 1 立即购买
        // ----------领取优惠券
        couponList: [],
        hasCoupon: false,
        couponFlag: false,
        // ----------更多详情
        moreFlag: false,
        tabIndex: 2,
        introduction: '',
        commonSpecArray: [],
        // ----------收藏
        isCollected: false,
        // ----------购物车信息
        cartNum: 0,
        // ----------一次上拉完成，可执行二次上拉
        pullupStep1: false,
        // 菜单
        menuFlag: false,
        getSkuCompeleted: false
      }
    },
    updated:function(){
        if(this.swiperData!=""){
          this.ImgUrl = this.swiperData[0].src

        }
    },
    mounted: function () {
      // this.scrollerHeight = document.body.clientHeight - 96
      this.skuId = this.$route.params.skuId
      this.getSkuInfo(this.skuId,function(){})
     // this.getOptimal(this.skuId)
      if (sessionStorage.getItem('settlementProductItems') && sessionStorage.getItem('userInfo')) {
        this.$router.push({path: '/createOrder'})
        return
      }
      interval = setInterval(() => {
        if (this.skuId) {
          // 获得 图集、sku、默认规格
          this.getSkuInfo(this.skuId, (res) => {
            this.skuInfo = res.data.skuInfo
            if (res.data.skuInfo.minPrice) {
              this.skuInfo.sku.discountPrice = this.getDiscountPrice(res.data.skuInfo.minPrice, res.data.skuInfo.sku.price)
              this.skuInfo.hasDiscount = true

            } else {
              this.skuInfo.hasDiscount = false
            }
            console.log('价格：', this.skuInfo.sku.price)
            this.getSkuCompeleted = true
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
          if (sessionStorage.getItem('userInfo')) {
            // TODO 当localStorage存在，后台缓存不存在，会出现401
            // 收藏
            this.checkCollect(() => {
              this.getCartItem()
            })
            // 获取优惠券
            this.getSkuCoupon(this.skuId)
          }
          clearInterval(interval)
        }
      }, 0)
    },
    methods: {
      // toOtherSpec(name,to){
      //   console.log(name)
      //   // console.log(to.specValueId)
      //   // this.handleSpecState()
      //   // if(name==to.specValueName){
      //     // this.$router.push({path: `/pd/${to.specValueId}`});
      //   // }
      //   this.xoxoxo = JSON.stringify(to)
      // },
      backGoodsArrayFuc(index){
        this.backGoodsArrayIndex = index
      },
      onItemClick(){
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        console.log(scrollTop)
        document.documentElement.scrollTop = scrollTop;
      },
      addNumber(){
        this.reduceActive = false
        this.buyNumber = parseInt(this.buyNumber)
        this.buyNumber += 1
      },
      reduceNumber(){
        if(this.buyNumber==1){
          this.reduceActive = true
        }
        if(this.buyNumber==0){
          this.buyNumber = 0

        }else {
          this.buyNumber = parseInt(this.buyNumber)
          this.buyNumber -= 1
        }
      },
      checkSpec(index,index2){
        this.xoxo = index
        this.isShowCheckSpec = index2
      },
      handleOpen () {
        this.backGoodsArrayIndex = 0
        this.bgColor = !this.bgColor
        this.visible =  !this.visible
        this.type = this.type === "ios-arrow-down"?"ios-arrow-up":"ios-arrow-down"
      },
      getIndex(imgUrl,index){
        // this.ImgUrl = imgUrl
        this.$refs.ImgUrl.src = imgUrl
        this.active = index
      },
      handleMove(num){
        let length = this.swiperData.length - 4
        let imgTop = 70
        if(num === 1){
          if(length>0){
            if(length - this.imgUrlLength < 0){
              this.imgUrlLength -= 1
              this.moveTop.top = parseInt(this.moveTop.top) + imgTop + 'px'
            }
          }
        }else{
          if(length - this.imgUrlLength >= 0){
            this.imgUrlLength += 1
            this.moveTop.top = parseInt(this.moveTop.top) - imgTop + 'px'
          }
        }
      },
      getOptimal (skuId) {
        let params = [];
        params.push(skuId)
        this.$http.post(...mkApi.getOptimal(params)).then(res => {
          if (res.data.code === 200) {
            console.log('getOptimal', res.data)
          } else {
          }
        }).catch(() => {})
      },
       // ---计算促销后的价格
      getDiscountPrice (discountParams, price) {
        if (discountParams.type === 3) { // 单品折扣
          console.log(discountParams.type)
          price = parseInt(price * discountParams.discount * 0.01) + price % 100
          if (discountParams.typeAlone === 1) { // 元级取整
            price = tool.handlePrice(price)
            price = parseInt(price)
          } else if (discountParams.typeAlone === 2) {
            price = tool.handlePrice(price)
            price = parseFloat(price).toFixed(1)
          }
        } else if (discountParams.type === 4) { // 直降
          console.log(discountParams.type)
          price = price - discountParams.directAmount
          price = tool.handlePrice(price)
        } else {
          console.log(discountParams.type)
          price = tool.handlePrice(price)
        }
        return price
      },
      // ----------接口-get-skuInfo
      getSkuInfo (skuId, callback) {
        this.$http.get(...pdAPI.getSkuInfo(skuId)).then(res => {
          if (res.data.code === 200) {
            console.log('getSkuInfo优惠', res.data)
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
      // ----------接口-获取商品优惠券
      getSkuCoupon (skuid) {
        this.$http.get(mkApi.getSkuCoupon(skuid)).then(res => {
          if (res.data.code === 200) {
            console.log('获取了skuid对应的商品优惠券', res)
            this.couponList = res.data.proCouponInfos
            if (this.couponList.length < 1) {
              this.hasCoupon = false
            } else {
              this.hasCoupon = true
              let couponArr = []
              for (var i in this.couponList) {
                couponArr.push(this.getDiscountPrice(this.couponList[i], this.skuInfo.sku.price))
              }
              console.log('couponArr', couponArr)
            }
          }
        })
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
        for (let i in this.specArray) {
          for (let j in this.specArray[i].specValueArray) {
            if (thisValueArray.length > 0 && thisValueArray.indexOf(JSON.stringify(this.specArray[i].specValueArray[j])) === -1) {
              this.specArray[i].specValueFlags[j] = false
            }
          }
        }
        // this.$vux.loading.hide()
        if (this.filstLoad === 0) {
          this.filstLoad++
        } else {
          this.getSkuBySpec()
        }
      },
      // ----------spec组合变动，获取spec组合信息
      getSkuBySpec: debounce(function () {
        this.num = 1
        this.$http.post(...pdAPI.specGetSku(this.specArrayOn).concat({
        cancelToken: new this.$http.CancelToken(function (cancel) {
          if (typeof getSkuCancel === 'function') {
            getSkuCancel()
          }
          getSkuCancel = cancel
        })
      })).then((res) => {
        if (res.data.code === 200) {
          this.skuId = res.data.skuInfo.sku.id
          this.skuInfo = res.data.skuInfo
          if (res.data.skuInfo.minPrice) {
              this.skuInfo.sku.discountPrice = this.getDiscountPrice(res.data.skuInfo.minPrice, res.data.skuInfo.sku.price)
              this.skuInfo.hasDiscount = true

            } else {
              this.skuInfo.hasDiscount = false
            }
          this.spuId = res.data.skuInfo.sku.spuId
          this.$router.replace({path: `/pd/${this.skuInfo.sku.id}`})
          this.checkCollect()
        }
      })
      }, 300),
      // ----------上拉
      onPullup: debounce(function () {
        if (this.pullupStep1) {
          if (this.$refs.pdSwiper) {
            this.$refs.pdSwiper.btnEvent(false)
          }
          this.moreFlag = true
          this.pullupStep1 = false
          clearInterval(interval2)
        } else {
          clearInterval(interval2)
          this.pullupStep1 = true
          interval2 = setInterval(() => {
            if (document.getElementsByClassName('xs-container')[0].style.transform.indexOf('translateY(0px)') !== -1) {
              this.pullupStep1 = false
              clearInterval(interval2)
            }
          }, 300)
        }
        this.$refs.scroller.donePullup()
      }, 100),
      checkCollect (callback) {
        if (sessionStorage.getItem('userInfo')) {
          this.$http.get(...pdAPI.isProductCollection(this.skuId)).then(res => {
            if (res.data.code === 6017) {
              this.isCollected = true
            } else if (res.data.code === 6018) {
              this.isCollected = false
            }
            if (typeof callback === 'function') {
              callback()
            }
          })
        }
      },
      collect: debounce(function () {
        if (this.isCollected) {
          this.$http.delete(...pdAPI.deleteProductCollect(this.skuId).concat({
            cancelToken: new this.$http.CancelToken(function (cancel) {
              if (typeof getSkuCancel === 'function') {
                getSkuCancel()
              }
              getSkuCancel = cancel
            })
          })).then(res => {
            if (res.data.code === 200) {
              this.isCollected = false
            }
          })
        } else {
          let source = this.$http.CancelToken.source()
          this.$http.post(...pdAPI.productCollect({productId: this.skuId}), {cancelToken: source.token, certified: true, source: source}).then(res => {
            if (res.data.code === 200) {
              this.isCollected = true
            } else if (res.data.code === 6017) {
              this.isCollected = true
            }
          })
        }
      }, 300),
      goShoppingCart () {
        this.$router.push({path: '/shoppingCart'})
      },
      // ----------加入购物车
      postCartItem () {
        if (this.skuInfo.sku.stock === 0) { return }
        if (sessionStorage.getItem('userInfo')) {
          let cartItemData  = {
            memberId: null,
            merchantId: '123',
            productId: this.skuId,
            productItemId: null,
            quantity: this.num
          }
          this.$http.post(...pdAPI.postCartItem(cartItemData), {certified: true}).then((response) => {
            this.specFlag = true
            this.num = 1
            if (response.data.code === 200) {
              // this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
              this.$Message.success({content:'加入购物袋成功',duration:3})
              this.getCartItem()
            } else {
              if (response.data.code === 1008) {
                this.skuInfo.sku.status = 2
              }
              // this.$vux.toast.show({text: response.data.message, type: 'text', width: '200px'})
              this.$Message.info(response.data.message)
            }
          })
        } else {
          if (!localStorage.getItem('cartProductItems')) {
            localStorage.setItem('cartProductItems', '[]')
          }
          if (localStorage.getItem('cartProductItems') === '[]') {
            let arr = [{
              amount: this.num,
              barcode: this.skuInfo.sku.barcode,
              code: this.skuInfo.sku.code,
              defaultPicture: this.skuInfo.sku.defaultPicture,
              id: this.skuInfo.sku.id,
              memberId: '',
              merchantId: '123',
              name: this.skuInfo.sku.name,
              originalPrice: 0,
              price: this.skuInfo.sku.price,
              sales: this.skuInfo.sku.sales,
              specs: this.specArrayOn,
              spuId: this.skuInfo.sku.spuId,
              status: this.skuInfo.sku.status,
              stock: this.skuInfo.sku.stock
            }]
            localStorage.setItem('cartProductItems', JSON.stringify(arr))
            // this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
            this.$Message.success({content:'加入购物袋成功',duration:3});
            this.num = 1
            this.specFlag = true
            this.getCartItem()
          } else {
            let arr = JSON.parse(localStorage.getItem('cartProductItems'))
            let repetition = false
            for (let i of arr) {
              if (this.skuInfo.sku.id === i.id) {
                i.amount = i.amount * 1 + this.num * 1
                repetition = true
              }
            }
            if (!repetition) {
              arr.push({
                amount: this.num,
                barcode: this.skuInfo.sku.barcode,
                code: this.skuInfo.sku.code,
                defaultPicture: this.skuInfo.sku.defaultPicture,
                id: this.skuInfo.sku.id,
                memberId: '',
                merchantId: '123',
                name: this.skuInfo.sku.name,
                originalPrice: 0,
                price: this.skuInfo.sku.price,
                sales: this.skuInfo.sku.sales,
                specs: this.specArrayOn,
                spuId: this.skuInfo.sku.spuId,
                status: this.skuInfo.sku.status,
                stock: this.skuInfo.sku.stock
              })
            }
            localStorage.setItem('cartProductItems', JSON.stringify(arr))
            // this.$vux.toast.show({text: '加入购物袋成功3', type: 'text', width: '200px'})
            this.$Message.success({content:'加入购物袋成功',duration:3});
            this.getCartItem()
          }
        }
      },
      // ----------------- 领取优惠券
      openGetCoupon () {
        this.couponFlag = true
      },
      // ---------- 直接购买 创建订单
      createOrder () {
        console.log('直接购买')
        if (this.skuInfo.sku.stock === 0) { return }
        if (sessionStorage.getItem('userInfo')) {
          let cartItemData  = {
            memberId: null,
            merchantId: '123',
            productId: this.skuId,
            productItemId: null,
            quantity: this.num
          }
          this.$http.post(...pdAPI.postCartItem(cartItemData), {certified: true}).then((response) => {
            if (response.data.code === 200) {
              sessionStorage.setItem('settlementProductItems',`[{"promotionId":"${this.$refs.pdPromotion.selected ? this.$refs.pdPromotion.selected.id : ''}","productItem":[{"productId":"${this.skuId}","quantity":${this.num}}]}]`)
              this.$router.push({path: `/createOrder`})
               this.specFlag = true
               this.num = 1
            } else {
              // this.$vux.toast.show({text: response.data.message, type: 'text', width: '200px'})
              this.$Message.info(response.data.message)
            }
          })
        } else {
          // this.$vux.confirm.show({
          //   content: '用户未登录',
          //   confirmText: '去登录',
          //   onConfirm: () => {
          //     sessionStorage.setItem('settlementProductItems', `[{"promotionId":"${ this.$refs.pdPromotion.selected ? this.$refs.pdPromotion.selected.id : ''}","productItem":[{"productId":"${this.skuId}","quantity":${this.num}}]}]`)
          //     this.$router.push({path: '/signin'})
          //   }
          // })
          this.$Modal.confirm({
            title: '',
            content: '<p>用户未登录</p>',
            okText: '去登陆',
            cancelText: '取消',
            onOk:()=>{
              sessionStorage.setItem('settlementProductItems', `[{"promotionId":"${ this.$refs.pdPromotion.selected ? this.$refs.pdPromotion.selected.id : ''}","productItem":[{"productId":"${this.skuId}","quantity":${this.num}}]}]`)
              this.$router.push({path: '/login'})
            }
          });
        }
      },
      // ----------获取购物车商品数量
      getCartItem () {
        if (sessionStorage.getItem('userInfo')) {
          tool.preCartToCart(this, () => {
            this.$http.get(...pdAPI.getCartItem()).then((response) => {
              if (response.data.code === 200) {
                this.getCartNum(response.data.pageInfo.list)
              }
            })
          })
        } else {
          if (localStorage.getItem('cartProductItems')) {
            let cartProductItems = JSON.parse(localStorage.getItem('cartProductItems'))
            this.getCartNum(cartProductItems)
          }
        }
      },
      getCartNum (data) {
        // let sum = 0
        // for (let i of data) {
        //   sum += i.amount * 1
        // }
        // this.cartNum = sum
        this.cartNum = data.length
      },
      // ----------接口-spu和spu通用属性信息
      getSpuSpec (spuId) {
        this.$http.get(...pdAPI.spuSpec(spuId)).then(res => {
          if (res.data.code === 200) {
            this.introduction = res.data.spuInfo.introduction
            let commonSpecArray = []
            if (res.data.spuInfo.spuSpecArray) {
              res.data.spuInfo.spuSpecArray.forEach(e => {
                if (e.specName !== '产地') {
                  commonSpecArray.push(e)
                }
              })
            }
            this.commonSpecArray = commonSpecArray
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
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        } else {
          return arr.join(',')
        }
      },
      openSpecModal (model) {
        this.modalmodel = model
        if (this.skuInfo.sku) {
          this.specFlag = this.skuInfo.sku.status === 1 ? true : false
        } else {
          this.specFlag = false
        }
      },
      onScroll: debounce(function (position) {
        if (this.$refs.scroller) {
          this.$refs.scroller.reset()
        }
      }, 30)
    },
    computed: {
      heartSvg () {
        return require('../../assets/icons/heart.png')
      },
      heartFillSvg () {
        return require('../../assets/icons/heart-fill.png')
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

        console.log('arr1')
        // debugger
         console.log(arr)
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
        // return this.specArrayOn
      },
      specScrollerHeight () {
        return document.body.clientHeight * 0.75 - 101 - 50 + 'px'
      },
      bottomStyle () {
        return `top:${document.body.clientHeight - 50}px`
      },
      cartBtnStyle () {
        if (this.skuInfo) {
          return this.skuInfo.sku.stock !== 0 ? 'add-to-cart' : 'add-to-cart-disabled'
        } else {
          return 'add-to-cart-disabled'
        }
      },
      buyBtnStyle () {
        if (this.skuInfo) {
          return this.skuInfo.sku.stock !== 0 ? 'buy' : 'buy-disabled'
        } else {
          return 'buy-disabled'
        }
      },
      // ---------图文详情
      moreStyle () {
        return `min-height: ${document.body.clientHeight - 46}px`
      },
      // ---------是否允许购买
      disabledBuy () {
        if (this.skuInfo.sku) {
          return this.skuInfo.sku.stock === 0 || this.skuInfo.sku.status !== 1 ? true : false
        } else {
          return true
        }
      },
      canBuy () {
        if (this.disabledBuy) {
          return false
        } else {
          return true
        }
      }
    },
    watch: {
//       '$route':function(to,from){
// 　　　　 document.body.scrollTop = 1330
//         document.documentElement.scrollTop = 2330
//       },
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
    },
    beforeRouteLeave: (to, from, next) => {
      clearInterval(interval)
      clearInterval(interval2)
      next()
    }
  }
 </script>
 <style rel="stylesheet/scss" lang="scss" scoped>
//  .discount-price{
//    color:red;
//  }
//  .discount-price span{font-size:25px;}
//  .discountPrice{
//    color:#aaa;
//  }
// .bkcolor {
//   background-color: #fff;
// }
// // ----------商品信息
// .customer-service{
//   width: 13.7%;
//   background-color: #fff;
//   color: #352665;
//   line-height: 50px;
//   text-align: center;
//   border-right: 1px solid #ccc;
// }
// .p-name-wrapper {
//   padding: 0px 0px 5px 0px;
//   .p-name {
//     text-align: center;
//     display: inline-block;
//     width: 100%;
//     // min-height: 38px;
//     font-size: 16px;
//     color: #4d4d4d;
//     text-overflow: ellipsis;
//     overflow: hidden;
//     display: -webkit-box;
//     -webkit-box-orient: vertical;
//     -webkit-line-clamp: 2;
//   }
// }
// .p-adv-wrapper {
//   .p-adv {
//     text-align: center;
//     display: inline-block;
//     width: 100%;
//     font-size: 14px;
//     color: #7f7f7f;
//     text-overflow: ellipsis;
//     overflow: hidden;
//     display: -webkit-box;
//     -webkit-box-orient: vertical;
//     -webkit-line-clamp: 2;
//   }
// }
// .p-price-wrapper {
//   .p-price {
//     .discountPrice {
//       font-size: 14px;
//     }
//     .discount-price {
//       font-size:20px;
//     }
//     text-align: center;
//     font-weight: 400;
//     font-size: 20px;
//     color: $tsl-color;
//   }
// }
// .my-cell-title {
//   font-size: 12px;
//   color: #7f7f7f;
// }
// .pullup-step1 {
//   position: absolute;
//   width: 100%;
//   height: 500px;
//   line-height: 50px;
//   bottom: -500px;
//   text-align: center;
//   background:#fff;
//   color: #7f7f7f
// }
// // ----------底部按钮
// .sub-tab {
//   border-top: 1px solid #dbdbdb;
//   position: fixed;
//   bottom: 0px;
//   left: 0px;
//   width: 100%;
//   height: 50px;
//   div {
//     height: 100%;
//     float: left;
//   }
//   .cart-badge {
//     position: absolute;
//     top: 10px;
//     right: 10px;
//   }
//   .collection:after, .shopping-cart:after {
//     content: '';
//     display: block;
//     position: absolute;
//     top: 0px;
//     right: 0px;
//     height: 100%;
//     width: 1px;
//     background-color: #dbdbdb;
//   }
//   .collection, .shopping-cart {
//     img {
//       display: block;
//       margin: 5px auto 3px;
//       width: 22px;
//       height: 22px;
//     }
//     background-color: #fff;
//     color: #7f7f7f;
//     text-align: center;
//     position: relative;
//     width: 17%;
//     font-size: 10px;
//   }
//   .add-to-cart, .buy, .add-to-cart-disabled, .buy-disabled {
//     width: 24.5%;
//     text-align: center;
//     line-height: 50px;
//   }
//   .add-to-cart {background-color: #fff;color: $tsl-color;}
//   .buy {background-color: $tsl-color;color: #fff;}
//   .add-to-cart-disabled {background-color: #fff;color: #7f7f7f;}
//   .buy-disabled {background-color: #7f7f7f;color: #fff;}
//   .call-service {
//     width: 66%;
//     text-align: center;
//     line-height: 50px;
//     background-color: $tsl-color;
//     color: #fff;
//   }
// }
// // ----------商品规格弹窗
// .spec-popup {
//   width: 100%;
//   height: 100%;
//   border-radius: 6px 6px 0px 0px;
// }
// .skuInfo {
//   height: 80px;
//   padding: 10px 0px 10px 0px;
//   border-bottom: 1px solid #d9d9d9;
// }
// .default-picture-wrapper {
//   position: absolute;
//   top: -20px;
//   left: 10px;
//   width: 98px;
//   height: 98px;
//   border-radius: 10px;
//   border: 1px solid #eee;
//   background-color: #fff;
// }
// .default-picture-inner {
//   margin: 5px;
//   width: 88px;
//   height: 88px;
//   border-radius: 10px;
//   overflow: hidden;
//   background-color: #eee;
//   img {
//     display: block;
//     width: 100%;
//     height: 100%;
//   }
// }
// .sku-info {
//   margin: 0px 0px 0px 115px;
//   .sku-info-price {
//     font-size: 14px;
//     color: $tsl-color;
//     letter-spacing: 1.15px;
//   }
//   .discount-price{
//     font-size:20px;
//   }
//   .sku-info-stock {
//     font-size: 12px;
//     color: #4d4d4d;
//     letter-spacing: .5px;
//   }
// }
// .spec-wrapper {
//   padding: 10px 10px 0px 10px;
//   height: calc(100% - 30px);
//   overflow-y: scroll;
//   .spec-inner {
//     margin: 0px 0px 10px 0px;
//   }
// }
// .spec-name {
//   font-size: 14px;
//   color: #535353;
//   letter-spacing: .6px;
// }
// .default-item-class, .selected-item-class, .disabled-item-class {
//   margin: 12px 15px 0 0;
//   height: 30px;
//   line-height: 30px;
//   border: 1px solid #eee;
//   padding: 0 15px;
//   border-radius: 6px;
//   font-size: 14px;
//   color: #7f7f7f;
//   letter-spacing: .6px;
// }
// .selected-item-class {
//   border: 1px solid $tsl-color;
//   color: $tsl-color;
// }
// .disabled-item-class {
//   border: 1px solid #eee;
//   color: #eee;
// }
// .spec-sub-tab {
//   border-top: 1px solid #dbdbdb;
//   position: fixed;
//   bottom: 0px;
//   left: 0px;
//   width: 100%;
//   height: 50px;
//   div {
//     width: 50%;
//     height: 100%;
//     text-align: center;
//     line-height: 50px;
//     float: left;
//   }
//   .add-to-cart {color: $tsl-color;background-color: #fff;}
//   .buy {color: #fff;background-color: $tsl-color;}
//   .add-to-cart-disabled {background-color: #fff;color: #7f7f7f;}
//   .buy-disabled {background-color: #7f7f7f;color: #fff;}
//   .call-service {
//     width: 100%;
//     text-align: center;
//     line-height: 50px;
//     background-color: $tsl-color;
//     color: #fff;
//   }
//   .just-buy {
//     width: 100%;
//     text-align: center;
//     line-height: 50px;
//     background-color: $tsl-color;
//     color: #fff;
//   }
// }
// // ----------规格参数
// .left-td {
//   min-width: 100px;
//   padding: 5px 10px;
//   text-align: left;
//   line-height: 30px;
// }
// .right-td {
//   min-width: 200px;
//   padding: 5px 15px 5px 10px;
//   text-align: left;
//   text-align: left;
//   font-size: 14px;
//   line-height: 28px;
// }
// // ----------图文详情
// .more-popup {
//   background-color: #fff;
//   .introduction {
//     text-indent: 2em;
//     padding: 5px 10px;
//     font-size: 14px;
//   }
// }
// // ----------右上菜单
// .menu1 {
//   line-height: 45px;
//   text-indent: 20px;
// }
// .divider {
//   border-bottom: 2px solid #e6e6e6;
// }
// </style>
// <style rel="stylesheet/scss" lang="scss">
// #pd {
//   position: relative;
//   .xs-container {
//     height: 100%;
//   }
//   .xs-plugin-pullup-container {
//     position: relative !important;
//   }
// }
</style>

<style>
  #detail .breadcrumb .ivu-breadcrumb-item-link{
    color: #4a90e2
  }
  #detail .breadcrumb .last .ivu-breadcrumb-item-link{
    color: #000;
    font-weight: normal;
  }
</style>

<style>
  .ioioi .ivu-tabs-nav-wrap{
    margin-left: 42%
  }    
  #detail .cost .ivu-select-dropdown{
      padding: 0;
      margin: 0;
      /* left: 100px!important */
  }
  /* #detail .cost .ivu-select-dropdown{
      padding: 0;
      margin: 0;
      left: 724px!important
  }                */

  /* #detail .cost .ivu-select-dropdown{
    width: 385px;
    padding-left: 10px  ;   
    height: 350px;
    border:1px solid red;
    border-left:8px solid red;
    padding: 0;
    margin-top: -2px
  }
  #detail .cost .ivu-select-dropdown{
     width: 315px
  } */
</style>

<style lang="stylus" scoped>
@import "~styles/common/common.styl";
  #detail 
    background #fafafa
    padding 0 30px
    .detail-title 
      padding 30px 0     
      text-align center
      .detail-t 
        position relative
        display inline-block
        text-align center
        font-size 20px
        color #0f0f0f
        &:after
          content ''
          position absolute
          bottom -20px
          left 50%
          $ml(-20px)
          display inline-block
          width 40px
          height 2px
          background-color $blue
        .xiegang:after
          content ''
          position relative
          top 8px
          margin 0 15px
          display inline-block
          width 1px
          height 30px
          background-color $blue
          transform rotate(30deg)
    .detail-content
      overflow hidden
      background #fff
      padding 0 50px
      .breadcrumb
        $mb(20px)
        height 80px
        line-height 80px
        .ivu-breadcrumb
          font-size 14px
      .detail-content-center
        // overflow hidden
        // clear both
        // display:block;
        // height 0
        // visibility:hidden;

        .detail-content-left
          width 600px
          .goodDetails_name_img
            .little_img
              width 50px
              float left
              position relative
              i
                cursor pointer
                width 70px
                height 24px
                font-size 20px
                text-align center
              div
                height 280px
                width 70px
                overflow hidden
                position relative
                ul
                  position absolute
                  transition all .5s
                  top 0
                  li
                    width 70px
                    height 70px
                    img
                      width 100%
                      height 100%
                    &.active
                      $border(b,2px)
                    &:hover
                      $border(b,2px)
            .big_img
              float left
              $ml(120px)
              width 300px
              height 300px
              img
                width 100%
                height 100%
        .detail-content-right   
          float left 
          width 450px
          $ml(120px)
          color #000
          div
            height 38px
            line-height 40px
          .title
            line-height 18px
            $mb(10px)
          .adv
            .p-adv
              line-height 16px
              font-size 14px
              color #9B9B9B
          .price
            .sp_1
              color $blue
              font-size 22px
              font-weight: bold
            .sp_2
              float right
              $mr(30px)
              cursor pointer
          .originalPrice
            span
              $ml(15px)
          .spec
            overflow hidden
            .default-item-class
              height 30px
              line-height 30px
              padding 0px 15px
              display inline-block
              border 1px solid #dcdee2
              margin-right 20px
              cursor pointer
            .selected-item-class
              $border(1,1px)
              color $blue
            .spec-check
              .ivu-radio-wrapper-checked 
                color #000
                border-color $blue
                box-shadow none
                position relative
                &:after
                  // content ''
                  // position absolute
                  // z-index 999
                  // bottom -20px
                  // left 50%
                  // $ml(-20px)
                  // display inline-block
                  // width 40px
                  // height 2px
                  // background-color $blue
              div
                float left
                height 29px
                line-height 29px  
                margin-right 20px 
                position relative
                label
                  border-radius 0px  
                  height 30px 
                .ivu-radio-wrapper:after
                  opacity  1                      
              .triangle_border_left
                width 0 
                height 0
                border-width 10px 10px 10px 0
                border-style solid
                border-color transparent #333 transparent transparent            
                position absolute
                transform rotate(223deg)
                right -21px
                top 16px
                z-index 88
                span                 
                  display block
                  width 0
                  height 0
                  border-width 8px 8px 8px 0
                  border-style solid
                  border-color transparent $blue transparent transparent
                  position absolute
                  top -8px
                  left 1px
              i
                position absolute
                right -5px
                bottom -4px
                color #fff
                z-index 89
            // .spec-sp2
            //   cursor pointer
            //   padding 4px 12px 4px 8px
            //   $border(1,1px)
            //   $mr(20px)
            //   position relative
            //   .triangle_border_left
            //     width 0 
            //     height 0
            //     border-width 10px 10px 10px 0
            //     border-style solid
            //     border-color transparent #333 transparent transparent            
            //     position absolute
            //     transform rotate(223deg)
            //     right -2px
            //     top 14px
            //     span                 
            //       display block
            //       width 0
            //       height 0
            //       border-width 8px 8px 8px 0
            //       border-style solid
            //       border-color transparent $blue transparent transparent
            //       position absolute
            //       top -8px
            //       left 1px
            //   i
            //     position absolute
            //     right -5px
            //     bottom -5px
            //     color #fff
            //     z-index 3

          .number
            overflow hidden
            p
              float left
            .tb-stock 
                position relative
                float left  
                $mt(6px)
                $ml(3px)
              a,a:hover
                display block
                _display inline
                *zoom 1
                float left
                width 26px
                height 26px
                border 1px solid #ccc
                line-height 26px
                padding 0
                vertical-align top
                overflow hidden
                text-align center
                background-color #ededed
                overflow hidden
              .tb-reduce 
                border-right 0!important
              .tb-reduceActive
                background-color #ccc
                cursor no-drop
              .tb-disable-reduce
                color #ccc
                cursor not-allowed
                background-color #ededed; 
              .tb-increase 
                border-left 0!important
                margin-right 8px 
              input
                float left
                margin 0
                padding 0
                width 48px
                height 26px
                font-size 16px
                line-height 26px
                text-align center
                color #666
                border 1px solid #CCC
                outline 0
                background #FFF
                ime-mode disabled  
          .cost
            a
              color #000
            .bgColor              
              background-color $blue
              a 
                i,span 
                  color #fff 
              .cost-detail 
                padding-left 10px     
                width 730px
                height 350px
                $border(b,1px)
                $border(border-left,8px)
                padding 0
                margin-top -2px  
                .cost-detail-content
                  height inherit
                  .left
                    width 395px
                    height 90%
                    float left
                    margin 20px 
                    $border(border-right,1px) 
                    overflow auto
                    h2
                      color $blue
                    p
                      $mt(20px)
                      font-size 14px
                      line-height 22px 
                      width 380px 
                    li
                      $mt(20px)
                      line-height 22px  
                  .right       
                    float right
                    margin 20px 20px 20px 0px
                    li
                      margin 10px 0
                      i
                        margin-right 10px
                        color $blue
                      span
                        width: 240px;
                        height inherit
                        display inline-block
                        border 1px solid #fff
                        text-indent 10px
                        &:hover
                          border-color $blue
                      
                    
          .cart
            $mt(12px)
            .btn1
              padding-bottom 8px
              width 200px
              height 40px
              font-size 16px
              color #fff
              background-color #352665
            .btn2
              $ml(30px) 
              width 200px
              height 40px
              font-size 16px
      .detail-content-bottom
        $mt(120px)
        height 1400px
        .ioioi 
          text-align center
          .ivu-tabs-nav-wrap
            margin-left 42%
            






  
      
// .ivu-radio-group-button .ivu-radio-wrapper:after
//   opacity  1          

      
                



</style>
