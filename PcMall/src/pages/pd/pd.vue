<template>
  <div>
    这是详情页
  </div>
</template>
// <script type="text/ecmasprict-6">
//   import * as tool from '@/services/myTool.es6'
//   import * as pdAPI from '@/services/API/pdServices.es6'
//   import * as mkApi from '@/services/API/marketing.es6'
//   import { XHeader, Scroller, Group, CellBox, Cell, TransferDom, Popup, Checker, CheckerItem, XNumber, InlineXNumber, debounce, Tab, TabItem, XTable, Badge } from 'vux'
//   import pdSwiper from './pdSwiper3.vue'
//   import pdRichText from './pdRichText.vue'
//   import pdCoupons from '../promotion/pdCoupons.vue'
//   import pdPromotion from '../promotion/pdPromotion.vue'
//   import {getSkuInfo} from '@/services/API/pdServices.es6'
//   let interval
//   let getSkuCancel
//   let interval2 // 用于计算‘一次上拉’是否显示
//   export default {
//     name: 'pd',
//     directives: {
//       TransferDom
//     },
//     components: Object.assign({ pdSwiper, pdRichText, pdCoupons, pdPromotion }, { XHeader, Scroller, Group, CellBox, Cell, Popup, Checker, CheckerItem, InlineXNumber, XNumber, debounce, Tab, TabItem, XTable, Badge }),
//     data () {
//       return {
//         filstLoad: 0,
//         color: '#352665',
//         leftOption: {
//           backText: ''
//         },
//         // ----------上拉或下拉的状态
//         scrollerStatus: {
//           pulldownStatus: 'default',
//           pullupStatus: 'default'
//         },
//         pullupConfig: {
//           content: '', // Pull Up To Refresh
//           pullUpHeight: 60,
//           height: 50,
//           autoRefresh: false,
//           downContent: '', // Release To Refresh
//           upContent: '', // Pull Up To Refresh
//           loadingContent: '', // Loading...
//           clsPrefix: '' // xs-plugin-pullup-
//         },
//         scrollerHeight: 0,
//         // ---------sku信息
//         skuId: '',
//         skuInfo: '',
//         // ---------spu信息
//         spuId: '',
//         spuInfo: '',
//         specArray: [], // sku属性数组 [{specId:'', specName:'', specValueArray:[specId:'',specName:'',specValueId:'',specValueName:''], specValueFlags:[booleam]}]
//         specValueArray: [],
//         skuSpecArray: [], // 可用的sku组合 [[specId:'',specName:'',specValueId:'',specValueName:''], []]
//         usedSpecValueArray: [], // 正在使用的sku组合的 sku属性 的 JSON 数组
//         // ----------已选sku组合[{specId,specName,specValueId,specValueName}]
//         specArrayOn: [],
//         num: 1,
//         // ----------选择规格
//         specFlag: false,
//         modalmodel: '', // 0 加入购物车 1 立即购买
//         // ----------领取优惠券
//         couponList: [],
//         hasCoupon: false,
//         couponFlag: false,
//         // ----------更多详情
//         moreFlag: false,
//         tabIndex: 2,
//         introduction: '',
//         commonSpecArray: [],
//         // ----------收藏
//         isCollected: false,
//         // ----------购物车信息
//         cartNum: 0,
//         // ----------一次上拉完成，可执行二次上拉
//         pullupStep1: false,
//         // 菜单
//         menuFlag: false,
//         getSkuCompeleted: false
//       }
//     },
//     mounted: function () {
//       this.scrollerHeight = document.body.clientHeight - 96
//       this.skuId = this.$route.params.skuId
//       this.getSkuInfo(this.skuId,function(){})
//      // this.getOptimal(this.skuId)
//       if (sessionStorage.getItem('settlementProductItems') && sessionStorage.getItem('userInfo')) {
//         this.$router.push({path: '/createOrder'})
//         return
//       }
//       interval = setInterval(() => {
//         if (this.skuId) {
//           // 获得 图集、sku、默认规格
//           this.getSkuInfo(this.skuId, (res) => {
//             this.skuInfo = res.data.skuInfo
//             if (res.data.skuInfo.minPrice) {
//               this.skuInfo.sku.discountPrice = this.getDiscountPrice(res.data.skuInfo.minPrice, res.data.skuInfo.sku.price)
//               this.skuInfo.hasDiscount = true

//             } else {
//               this.skuInfo.hasDiscount = false
//             }
//             console.log('价格：', this.skuInfo.sku.price)
//             this.getSkuCompeleted = true
//             this.spuId = res.data.skuInfo.sku.spuId
//             this.specArrayOn = res.data.skuInfo.spec
//             // 获取 可用的sku组合、所有sku属性数组、视频
//             this.getSpuInfo(res.data.skuInfo.sku.spuId, (res) => {
//               this.spuInfo = res.data.spuInfo
//               // 可用的sku组合
//               this.skuSpecArray = res.data.spuInfo.skuSpecArray
//               // 处理sku属性数组，元素格式为{specId, specName, specValueId, specValueName}
//               this.getSpecArray(res.data.spuInfo.specArray)
//             })
//             // 获取商品简介、spu名字、spu属性
//             this.getSpuSpec(res.data.skuInfo.sku.spuId)
//           })
//           if (sessionStorage.getItem('userInfo')) {
//             // TODO 当localStorage存在，后台缓存不存在，会出现401
//             // 收藏
//             this.checkCollect(() => {
//               this.getCartItem()
//             })
//             // 获取优惠券
//             this.getSkuCoupon(this.skuId)
//           }
//           clearInterval(interval)
//         }
//       }, 0)
//     },
//     methods: {
//       getOptimal (skuId) {
//         let params = [];
//         params.push(skuId)
//         this.$http.post(...mkApi.getOptimal(params)).then(res => {
//           if (res.data.code === 200) {
//             console.log('getOptimal', res.data)
//           } else {
//           }
//         }).catch(() => {})
//       },
//        // ---计算促销后的价格
//       getDiscountPrice (discountParams, price) {
//         if (discountParams.type === 3) { // 单品折扣
//           console.log(discountParams.type)
//           price = parseInt(price * discountParams.discount * 0.01) + price % 100
//           if (discountParams.typeAlone === 1) { // 元级取整
//             price = tool.handlePrice(price)
//             price = parseInt(price)
//           } else if (discountParams.typeAlone === 2) {
//             price = tool.handlePrice(price)
//             price = parseFloat(price).toFixed(1)
//           }
//         } else if (discountParams.type === 4) { // 直降
//           console.log(discountParams.type)
//           price = price - discountParams.directAmount
//           price = tool.handlePrice(price)
//         } else {
//           console.log(discountParams.type)
//           price = tool.handlePrice(price)
//         }
//         return price
//       },
//       // ----------接口-get-skuInfo
//       getSkuInfo (skuId, callback) {
//         this.$http.get(...pdAPI.getSkuInfo(skuId)).then(res => {
//           if (res.data.code === 200) {
//             console.log('getSkuInfo优惠', res.data)
//             if (typeof callback === 'function') { callback(res) }
//           } else {
//           }
//         }).catch(() => {})
//       },
//       // ----------接口-get-spuInfo
//       getSpuInfo (spuId, callback) {
//         this.$http.get(...pdAPI.getSpuInfo(spuId)).then(res => {
//           if (res.data.code === 200) {
//             if (typeof callback === 'function') { callback(res) }
//           } else {
//           }
//         }).catch(() => {})
//       },
//       // ----------接口-获取商品优惠券
//       getSkuCoupon (skuid) {
//         this.$http.get(mkApi.getSkuCoupon(skuid)).then(res => {
//           if (res.data.code === 200) {
//             console.log('获取了skuid对应的商品优惠券', res)
//             this.couponList = res.data.proCouponInfos
//             if (this.couponList.length < 1) {
//               this.hasCoupon = false
//             } else {
//               this.hasCoupon = true
//               let couponArr = []
//               for (var i in this.couponList) {
//                 couponArr.push(this.getDiscountPrice(this.couponList[i], this.skuInfo.sku.price))
//               }
//               console.log('couponArr', couponArr)
//             }
//           }
//         })
//       },
//       // ----------处理spec属性数组，属性值对象加上specId和specName
//       getSpecArray (data) {
//         let specArray = []
//         for (let i of data) {
//           let spec1 = {
//             specId: i.specId,
//             specName: i.specName,
//             specValueArray: [],
//             specValueFlags: []
//           }
//           for (let j of i.specValueArray) {
//             spec1.specValueArray.push({
//               specId: i.specId,
//               specName: i.specName,
//               specValueId: j.specValueId,
//               specValueName: j.specValueName
//             })
//             spec1.specValueFlags.push(false)
//           }
//           specArray.push(spec1)
//         }
//         this.specArray = specArray
//         this.handleSpecState()
//       },
//       // ----------处理spec置灰
//       handleSpecState () {
//         // ----------取出正在使用的sku组合包含的属性值
//         let usedSpecValueArray = []
//         let qobj = {}
//         for (let i of this.skuSpecArray) {
//           for (let j of i) {
//             if (qobj[JSON.stringify(j)] !== 1) {
//               usedSpecValueArray.push(JSON.stringify(j))
//               qobj[JSON.stringify(j)] = 1
//             }
//           }
//         }
//         this.usedSpecValueArray = usedSpecValueArray
//         qobj = {}
//         // ----------将会使用的设为true,即完全没有使用到的属性值设为false
//         for (let i of usedSpecValueArray) {
//           for (let j in this.specArray) {
//             for (let k in this.specArray[j].specValueArray) {
//               if (i === JSON.stringify(this.specArray[j].specValueArray[k])) {
//                 this.specArray[j].specValueFlags[k] = true
//               }
//             }
//           }
//         }
//         // ----------根据当前选择的属性值，置灰不能成为组合的属性值
//         // 本次高亮的属性值
//         let thisValueArray = []
//         for (let i of this.specArrayOn) {
//           for (let j of this.skuSpecArray) {
//             // 当前选择的sku属性值 存在于 可使用的sku组合
//             if (JSON.stringify(j).indexOf(JSON.stringify(i)) !== -1) {
//               // 遍历 可使用的sku组合的属性值
//               for (let k of j) {
//                 if (JSON.stringify(i) !== JSON.stringify(k) && !qobj[JSON.stringify(k)]) {
//                   thisValueArray.push(JSON.stringify(k))
//                   qobj[JSON.stringify(k)] = 1
//                 }
//               }
//             }
//           }
//         }
//         for (let i in this.specArray) {
//           for (let j in this.specArray[i].specValueArray) {
//             if (thisValueArray.length > 0 && thisValueArray.indexOf(JSON.stringify(this.specArray[i].specValueArray[j])) === -1) {
//               this.specArray[i].specValueFlags[j] = false
//             }
//           }
//         }
//         this.$vux.loading.hide()
//         if (this.filstLoad === 0) {
//           this.filstLoad++
//         } else {
//           this.getSkuBySpec()
//         }
//       },
//       // ----------spec组合变动，获取spec组合信息
//       getSkuBySpec: debounce(function () {
//         this.num = 1
//         this.$http.post(...pdAPI.specGetSku(this.specArrayOn).concat({
//         cancelToken: new this.$http.CancelToken(function (cancel) {
//           if (typeof getSkuCancel === 'function') {
//             getSkuCancel()
//           }
//           getSkuCancel = cancel
//         })
//       })).then((res) => {
//         if (res.data.code === 200) {
//           this.skuId = res.data.skuInfo.sku.id
//           this.skuInfo = res.data.skuInfo
//           if (res.data.skuInfo.minPrice) {
//               this.skuInfo.sku.discountPrice = this.getDiscountPrice(res.data.skuInfo.minPrice, res.data.skuInfo.sku.price)
//               this.skuInfo.hasDiscount = true

//             } else {
//               this.skuInfo.hasDiscount = false
//             }
//           this.spuId = res.data.skuInfo.sku.spuId
//           this.$router.replace({path: `/pd/${this.skuInfo.sku.id}`})
//           this.checkCollect()
//         }
//       })
//       }, 300),
//       // ----------上拉
//       onPullup: debounce(function () {
//         if (this.pullupStep1) {
//           if (this.$refs.pdSwiper) {
//             this.$refs.pdSwiper.btnEvent(false)
//           }
//           this.moreFlag = true
//           this.pullupStep1 = false
//           clearInterval(interval2)
//         } else {
//           clearInterval(interval2)
//           this.pullupStep1 = true
//           interval2 = setInterval(() => {
//             if (document.getElementsByClassName('xs-container')[0].style.transform.indexOf('translateY(0px)') !== -1) {
//               this.pullupStep1 = false
//               clearInterval(interval2)
//             }
//           }, 300)
//         }
//         this.$refs.scroller.donePullup()
//       }, 100),
//       checkCollect (callback) {
//         if (sessionStorage.getItem('userInfo')) {
//           this.$http.get(...pdAPI.isProductCollection(this.skuId)).then(res => {
//             if (res.data.code === 6017) {
//               this.isCollected = true
//             } else if (res.data.code === 6018) {
//               this.isCollected = false
//             }
//             if (typeof callback === 'function') {
//               callback()
//             }
//           })
//         }
//       },
//       collect: debounce(function () {
//         if (this.isCollected) {
//           this.$http.delete(...pdAPI.deleteProductCollect(this.skuId).concat({
//             cancelToken: new this.$http.CancelToken(function (cancel) {
//               if (typeof getSkuCancel === 'function') {
//                 getSkuCancel()
//               }
//               getSkuCancel = cancel
//             })
//           })).then(res => {
//             if (res.data.code === 200) {
//               this.isCollected = false
//             }
//           })
//         } else {
//           let source = this.$http.CancelToken.source()
//           this.$http.post(...pdAPI.productCollect({productId: this.skuId}), {cancelToken: source.token, certified: true, source: source}).then(res => {
//             if (res.data.code === 200) {
//               this.isCollected = true
//             } else if (res.data.code === 6017) {
//               this.isCollected = true
//             }
//           })
//         }
//       }, 300),
//       goShoppingCart () {
//         this.$router.push({path: '/shoppingCart'})
//       },
//       // ----------加入购物车
//       postCartItem () {
//         if (this.skuInfo.sku.stock === 0) { return }
//         if (sessionStorage.getItem('userInfo')) {
//           let cartItemData  = {
//             memberId: null,
//             merchantId: '123',
//             productId: this.skuId,
//             productItemId: null,
//             quantity: this.num
//           }
//           this.$http.post(...pdAPI.postCartItem(cartItemData), {certified: true}).then((response) => {
//             this.specFlag = true
//             this.num = 1
//             if (response.data.code === 200) {
//               this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
//               this.getCartItem()
//             } else {
//               if (response.data.code === 1008) {
//                 this.skuInfo.sku.status = 2
//               }
//               this.$vux.toast.show({text: response.data.message, type: 'text', width: '200px'})
//             }
//           })
//         } else {
//           if (!localStorage.getItem('cartProductItems')) {
//             localStorage.setItem('cartProductItems', '[]')
//           }
//           if (localStorage.getItem('cartProductItems') === '[]') {
//             let arr = [{
//               amount: this.num,
//               barcode: this.skuInfo.sku.barcode,
//               code: this.skuInfo.sku.code,
//               defaultPicture: this.skuInfo.sku.defaultPicture,
//               id: this.skuInfo.sku.id,
//               memberId: '',
//               merchantId: '123',
//               name: this.skuInfo.sku.name,
//               originalPrice: 0,
//               price: this.skuInfo.sku.price,
//               sales: this.skuInfo.sku.sales,
//               specs: this.specArrayOn,
//               spuId: this.skuInfo.sku.spuId,
//               status: this.skuInfo.sku.status,
//               stock: this.skuInfo.sku.stock
//             }]
//             localStorage.setItem('cartProductItems', JSON.stringify(arr))
//             this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
//             this.num = 1
//             this.specFlag = true
//             this.getCartItem()
//           } else {
//             let arr = JSON.parse(localStorage.getItem('cartProductItems'))
//             let repetition = false
//             for (let i of arr) {
//               if (this.skuInfo.sku.id === i.id) {
//                 i.amount = i.amount * 1 + this.num * 1
//                 repetition = true
//               }
//             }
//             if (!repetition) {
//               arr.push({
//                 amount: this.num,
//                 barcode: this.skuInfo.sku.barcode,
//                 code: this.skuInfo.sku.code,
//                 defaultPicture: this.skuInfo.sku.defaultPicture,
//                 id: this.skuInfo.sku.id,
//                 memberId: '',
//                 merchantId: '123',
//                 name: this.skuInfo.sku.name,
//                 originalPrice: 0,
//                 price: this.skuInfo.sku.price,
//                 sales: this.skuInfo.sku.sales,
//                 specs: this.specArrayOn,
//                 spuId: this.skuInfo.sku.spuId,
//                 status: this.skuInfo.sku.status,
//                 stock: this.skuInfo.sku.stock
//               })
//             }
//             localStorage.setItem('cartProductItems', JSON.stringify(arr))
//             this.$vux.toast.show({text: '加入购物袋成功', type: 'text', width: '200px'})
//             this.getCartItem()
//           }
//         }
//       },
//       // ----------------- 领取优惠券
//       openGetCoupon () {
//         this.couponFlag = true
//       },
//       // ---------- 直接购买 创建订单
//       createOrder () {
//         console.log('直接购买')
//         if (this.skuInfo.sku.stock === 0) { return }
//         if (sessionStorage.getItem('userInfo')) {
//           let cartItemData  = {
//             memberId: null,
//             merchantId: '123',
//             productId: this.skuId,
//             productItemId: null,
//             quantity: this.num
//           }
//           this.$http.post(...pdAPI.postCartItem(cartItemData), {certified: true}).then((response) => {
//             if (response.data.code === 200) {
//               sessionStorage.setItem('settlementProductItems',`[{"promotionId":"${this.$refs.pdPromotion.selected ? this.$refs.pdPromotion.selected.id : ''}","productItem":[{"productId":"${this.skuId}","quantity":${this.num}}]}]`)
//               this.$router.push({path: `/createOrder`})
//                this.specFlag = true
//                this.num = 1
//             } else {
//               this.$vux.toast.show({text: response.data.message, type: 'text', width: '200px'})
//             }
//           })
//         } else {
//           this.$vux.confirm.show({
//             content: '用户未登录',
//             confirmText: '去登录',
//             onConfirm: () => {
//               sessionStorage.setItem('settlementProductItems', `[{"promotionId":"${ this.$refs.pdPromotion.selected ? this.$refs.pdPromotion.selected.id : ''}","productItem":[{"productId":"${this.skuId}","quantity":${this.num}}]}]`)
//               this.$router.push({path: '/signin'})
//             }
//           })
//         }
//       },
//       // ----------获取购物车商品数量
//       getCartItem () {
//         if (sessionStorage.getItem('userInfo')) {
//           tool.preCartToCart(this, () => {
//             this.$http.get(...pdAPI.getCartItem()).then((response) => {
//               if (response.data.code === 200) {
//                 this.getCartNum(response.data.pageInfo.list)
//               }
//             })
//           })
//         } else {
//           if (localStorage.getItem('cartProductItems')) {
//             let cartProductItems = JSON.parse(localStorage.getItem('cartProductItems'))
//             this.getCartNum(cartProductItems)
//           }
//         }
//       },
//       getCartNum (data) {
//         // let sum = 0
//         // for (let i of data) {
//         //   sum += i.amount * 1
//         // }
//         // this.cartNum = sum
//         this.cartNum = data.length
//       },
//       // ----------接口-spu和spu通用属性信息
//       getSpuSpec (spuId) {
//         this.$http.get(...pdAPI.spuSpec(spuId)).then(res => {
//           if (res.data.code === 200) {
//             this.introduction = res.data.spuInfo.introduction
//             let commonSpecArray = []
//             if (res.data.spuInfo.spuSpecArray) {
//               res.data.spuInfo.spuSpecArray.forEach(e => {
//                 if (e.specName !== '产地') {
//                   commonSpecArray.push(e)
//                 }
//               })
//             }
//             this.commonSpecArray = commonSpecArray
//           }
//         })
//       },
//       handlePrice (price) {
//         return tool.handlePrice(price)
//       },
//       handleName (name) {
//         return tool.handleName(name)
//       },
//       handleSpecValueArray (arr) {
//         let isTime = false
//         if (/^1[0-9]{12}$/.test(arr[0])) {
//           isTime = true
//         }
//         if (isTime) {
//           let date = new Date(arr[0] * 1)
//           return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
//         } else {
//           return arr.join(',')
//         }
//       },
//       openSpecModal (model) {
//         this.modalmodel = model
//         if (this.skuInfo.sku) {
//           this.specFlag = this.skuInfo.sku.status === 1 ? true : false
//         } else {
//           this.specFlag = false
//         }
//       },
//       onScroll: debounce(function (position) {
//         if (this.$refs.scroller) {
//           this.$refs.scroller.reset()
//         }
//       }, 30)
//     },
//     computed: {
//       heartSvg () {
//         return require('../../assets/icons/heart.svg')
//       },
//       heartFillSvg () {
//         return require('../../assets/icons/heart-fill.svg')
//       },
//       bagSvg () {
//         return require('../../assets/icons/bag.svg')
//       },
//       // ----------轮播数据
//       swiperData () {
//         let arr = []
//         if (this.spuInfo) {
//           if (this.spuInfo.videoUrl) {
//             arr.push({
//               type: 'video',
//               data: this.spuInfo.videoUrl
//             })
//           }
//         }
//         if (this.skuInfo) {
//           if (this.skuInfo.image.length > 0) {
//             for (let i of this.skuInfo.image) {
//               arr.push({
//                 type: 'img',
//                 src: i.pictureUrl,
//                 link: ''
//               })
//             }
//           }
//         }
//         return arr
//       },
//       specValueNameStr () {
//         let arr = []
//         for (let i of this.specArrayOn) {
//           arr.push(i.specValueName)
//         }
//         return arr.join(' ')
//       },
//       // 默认规格字符串，判断是否是单品
//       specStr () {
//         return JSON.stringify(this.specArrayOn)
//       },
//       specScrollerHeight () {
//         return document.body.clientHeight * 0.75 - 101 - 50 + 'px'
//       },
//       bottomStyle () {
//         return `top:${document.body.clientHeight - 50}px`
//       },
//       cartBtnStyle () {
//         if (this.skuInfo) {
//           return this.skuInfo.sku.stock !== 0 ? 'add-to-cart' : 'add-to-cart-disabled'
//         } else {
//           return 'add-to-cart-disabled'
//         }
//       },
//       buyBtnStyle () {
//         if (this.skuInfo) {
//           return this.skuInfo.sku.stock !== 0 ? 'buy' : 'buy-disabled'
//         } else {
//           return 'buy-disabled'
//         }
//       },
//       // ---------图文详情
//       moreStyle () {
//         return `min-height: ${document.body.clientHeight - 46}px`
//       },
//       // ---------是否允许购买
//       disabledBuy () {
//         if (this.skuInfo.sku) {
//           return this.skuInfo.sku.stock === 0 || this.skuInfo.sku.status !== 1 ? true : false
//         } else {
//           return true
//         }
//       },
//       canBuy () {
//         if (this.disabledBuy) {
//           return false
//         } else {
//           return true
//         }
//       }
//     },
//     watch: {
//       specStr (newV, oldV) {
//         if (oldV !== '[]') {
//           if (newV !== oldV) {
//             this.handleSpecState()
//           }
//         }
//       },
//       specFlag (flag) {
//         if (!flag) {
//           this.modalmodel = ''
//         }
//         if (this.$refs.pdSwiper) {
//           this.$refs.pdSwiper.hideVideo(flag)
//         }
//       },
//       moreFlag (flag) {
//         if (this.$refs.pdSwiper) {
//           this.$refs.pdSwiper.hideVideo(flag)
//         }
//       }
//     },
//     beforeRouteLeave: (to, from, next) => {
//       clearInterval(interval)
//       clearInterval(interval2)
//       next()
//     }
//   }
// </script>
// <style rel="stylesheet/scss" lang="scss" scoped>
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
// </style>
