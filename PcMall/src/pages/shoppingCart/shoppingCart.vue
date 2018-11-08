<template>
  <div>
    <header1></header1>
    <header2></header2>
    <div id="shoppingCart">
      <!-- <div class="detail-title"><div class="detail-t">珠宝类型 <span class="xiegang"></span> 戒指</div></div> -->
      <v-title :titleTpye="titleTpye"></v-title>
      <div class="shoppingCart-content" >
        <loading v-if="showLoading"></loading>  
        <!-- 无数据内容 v-show="shoppingCarts.length === 0"-->
        <div class="no-data-mask" v-if="shoppingCarts.length === 0">
          <img src="../../assets/images/nullShoppingCart.svg" alt="购物袋缺省">
          <p>您的购物袋没有任何物品。</p>
          <Button class="btn" @click.native="$router.push({path: '/home'})">继续购物</Button>
        </div>
        <div v-else>
          <div class="shoppingCart-content-top">
            <span class="sp_1">已选择<i>{{checkNum}}</i>件商品</span>
            <!-- <span class="sp_2"><Checkbox>只显示有货商品</Checkbox></span> -->
          </div>
          <div class="shoppingCart-content-center" > <!--v-show="shoppingCarts-->
            <div v-for="item in shoppingCarts" :key="item.merchantInfo.id">
              <div class="shoppingCart-promotions" v-for="(promotion,index) in item.promotions" :key="promotion.promotionInfo.id">
                <div class="shoppingCart-product" v-for="product in promotion.productItems" :key="product.id">
                  <div class="checkbox"><Checkbox v-model="checkedObj[product.id]"></Checkbox></div><!--选中按钮-->
                  <div class="img">
                    <div>
                      <img :src="product.defaultPicture" alt="" @click="$router.push({path: `/pd/${product.id}`})">
                      <div class="mask" v-show="product.status === 2 || product.stock === 0">
                        <div class="circle">
                          <p v-show="product.status === 2">已下架</p>
                          <p v-show="product.status === 1 && product.stock === 0">无库存</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="detial">
                    <p class="title">{{toolFun('name', product.name)}}</p><!-- @on-open-change="onOpenChange(product,$event)"-->
                    <p class="price">￥{{toolFun('price', product.price)}}</p><!--@on-change="onChange(index)"  v-model="product.specs[specIndex].specValueName"  allSpecArrayOn[index][specIndex].specValueName-->
                    <div v-for="(specs,specIndex) in product.specs" :key="specIndex" style="float:left">
                      <Select :placeholder="specs.specValueName" @on-open-change="onOpenChange(product,$event)" @on-change="onChange(specIndex,specs.specValueName,$event)"  :label-in-value="true" size="small" style="width:120px;margin-right:10px" >
                        <Option v-for="(specs2, indexSpec) in sortSpecArray[specIndex]"  
                          :key="indexSpec" 
                          :value="JSON.stringify(specs2)"
                          :disabled="!specs2.specValueFlags"
                          >{{ specs2.specValueName }}
                        </Option>
                      </Select>
                    </div>
                  </div>
                  
                  <div class="num" >
                    <span class="tb-stock">
                      <span v-if="!editFlag && product.amount > product.stock" class="no-stock">暂无库存</span>
                      <input-number v-else v-model="product.amount" @on-change="putNum(product)" :min="1" :max="product ? product.stock : 0"></input-number>
                      <!-- <span v-show="!editFlag && product.amount > product.stock">抱歉，该商品最大购买数量为{{product.stock}}件</span> -->
                      
                    </span>
                    
                  </div>
                  <!-- <div class="no-num" style="display:block">
                    <p class="p1">暂无库存</p>
                    <p class="p2">添加到收藏</p>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
          <!-- 底下 -->
          <div class="shoppingCart-content-bottom">
            <div class="shoppingCart-content-bottom-content">
              <div class="left">
                <div @click="checkAll"></div>
                <Checkbox v-model="checkedAll"></Checkbox>全选
                <span class="delete" @click="deleteConfirm">删除</span>
                <!-- <span>添加到收藏 </span> -->
              </div>
              <div class="right">
                <p>总计：<span>￥{{sum}}</span></p>
                <Button class="btn" @click.native="checkout">结算<Icon type="ios-arrow-forward" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-footer></v-footer>
  </div>
</template>
<script type="text/ecmascript-es6">
  import header1 from '@/pages/homePages/header1'
  import header2 from '@/pages/homePages/header2'
  import vFooter from '@/pages/homePages/footer.vue'
  import loading from '@/pages/homePages/loading.vue'
  import vTitle from '@/pages/homePages/title.vue'
  import inputNumber from '@/pages/shoppingCart/inputNumber.vue'
  import res from './data.es6'
  import * as scAPI from '@/services/API/shoppingCartServices.es6'
  import * as pdAPI from '@/services/API/pdServices.es6'
  import { XHeader, Scroller, XButton, CheckIcon, TransferDomDirective as TransferDom, Popup, debounce, Checker, CheckerItem, Group, InlineXNumber } from 'vux'
  import MyInlineXNumber from './my-inline-x-number.vue'
  
  import * as tool from '@/services/myTool.es6'
  let getSkuCancel
  export default {
    name: 'shoppingCart',
    directives: { TransferDom },
    // components: {
    //   header1,
    //   header2,
    //   vFooter,
    //   pdRichText,
    //   Checker,
    //   CheckerItem,
    //   pdPromotion
    // },
    components: { header1,header2,vFooter,vTitle,loading,inputNumber,XHeader, Scroller, XButton, CheckIcon, Popup, debounce, Checker, CheckerItem, Group, InlineXNumber, MyInlineXNumber },
    data () {
      return {
        showLoading: true,//loading
        checkNum:0,
        titleTpye: ['珠宝类型','戒指'],//珠宝类型的头部
        list: [], // 原数据
        shoppingCarts: [], // 处理后展示用的数据
        sum: 0, // 总计价格
        checkedAll: false, // 全选状态
        checkedObj: {}, // 已选项的容器对象 {id: Boolean}
        promotionPopupFlag: false, // 选择促销弹窗Boolean
        promotionPopupData: [], // 选择促销弹窗的项数组
        promotionPopupSkuId: '', // 选择促销弹窗对应的SkuId
        editFlag: false, // 是否处在编辑状态
        // --------------------specs规格选择popup--------------------
        specsPopupFlag: false,
        specsPopupData_bs: {},
        specsPopupData: {}, // 弹窗商品
         // sku
        specArray: [],
        // ----------已选sku组合[{specId,specName,specValueId,specValueName}]
        specArrayOn: [],
        usedSpecValueArray: [],
        skuSpecArray: [],
        leftOption: {
          backText: ''
        },
      }
    },
    //  updated(){
    //   console.log('shoppingCarts！！！',this.shoppingCarts)
    //   console.log('更新之后',this.specArray)
    //   console.log('sortSpecArray',this.sortSpecArray)
    //   // this.xxxxx = this.specArray[0].specValueArray
    // },
    methods: {
      onChange(specIndex,specValueName,$event){
        let product = JSON.parse($event.value)
        if(product.specValueName!=specValueName){
          this.showLoading = !this.showLoading
          this.specArrayOn[specIndex] = product
          this.handleSpecState()
          this.postSpuInfo()
        }
      },
      onOpenChange(product,$event){
        if($event){
          console.log('specArrayspecArrayspecArray',this.specArray)
          this.openSpecsPopup(product)
        }
      },
      toolFun (type, value) {
        if (type === 'name') {
          return tool.handleName(value)
        } else if (type === 'price') {
          // 转换价格单位
          return tool.handlePrice(value)
        } else if (type === 'specs') {
          // 拼接商品规格字符串
          let specs = value || []
          let msg = ''
          specs.forEach(e => {
            msg = msg + (msg || ' ') + ((e.specName === 'WeightOfGold&IsOnly1' ? e.specValueName + 'g' : e.specValueName) || '')
          })
          return msg
        }
      },
      // 商品项的高度（+促销高度）
      productItemStyle (promotionList) {
        return (promotionList || []).length ? 'height:130px' : 'height:100px'
      },
      // 底部全选按钮事件
      checkAll: debounce(function () {
        let checkedObj = JSON.parse(JSON.stringify(this.checkedObj))
        for (let i in checkedObj) {
          checkedObj[i] = !this.checkedAll
        }
        this.checkedObj = checkedObj
      }, 0),
      // 本地-获取购物车数据
      getCartDataLocal () {
        if (localStorage.getItem('cartProductItems') === '[]') {
          localStorage.removeItem('cartProductItems')
        }
        if (localStorage.getItem('cartProductItems')) {
          let productItems = JSON.parse(localStorage.getItem('cartProductItems'))
          for (let i in productItems) {
            productItems[i].defaultPromotionId = ''
          }
          let list = [{ merchantInfo: {id: ''}, productItem: productItems }]
          this.handleRes(list)
        } else {
          this.handleRes([])
        }
      },
      // 接口-获取购物车数据
      getCartData () {
        this.$http.get(scAPI.getshoppingCart1()).then(res => {
          if (res.data.code === 200) {
            if (res.data.list) {
              this.list = res.data.list
              this.handleRes(res.data.list)
              this.showLoading = false
            }
          }
        })
      },
      handleRes (list = []) {
        let datas = []
        list.forEach(e => {
          let data = {
            merchantInfo: e.merchantInfo,
            promotions: []
          }
          let noPromotionData = ''
          let obj = {} // 去重促销
          for (let i of e.productItem) {
            // 未参加促销的商品
            if (i.defaultPromotionId === '') {
              let promotion = {}
              if (noPromotionData === '') {
                promotion.promotionInfo = {id: ''}
                promotion.productItems = [i]
                noPromotionData = promotion
              } else {
                noPromotionData.productItems.push(i)
              }
            } else if (!obj[i.defaultPromotionId]) {
              // 参加促销的商品
              let promotion = {}
              for (let j of i.promotionList) {
                if (j.id === i.defaultPromotionId) {
                  promotion.promotionInfo = j
                }
              }
              promotion.productItems = [i]
              data.promotions.push(promotion)
              obj[i.defaultPromotionId] = 1
            } else {
              for (let index in data.promotions) {
                if (data.promotions[index].promotionInfo.id === i.defaultPromotionId) {
                  data.promotions[index].productItems.push(i)
                }
              }
            }
          }
          if (noPromotionData) { data.promotions.push(noPromotionData) }
          datas.push(data)
        })
        this.setChecked(datas)
        this.shoppingCarts = datas
        this.checkedObj = JSON.parse(JSON.stringify(this.checkedObj))
      },
      // 设置check-icon的绑定对象
      setChecked (datas) {
        for (let i of datas) {
          for (let j of i.promotions) {
            for (let k of j.productItems) {
              typeof this.checkedObj[k.id] === Boolean ? this.checkedObj[k.id] = !this.checkedObj[k.id] : this.checkedObj[k.id] = false
            }
          }
        }
      },
      // 改变商品使用促销
      changePromotion (promotionId) {
        let list = JSON.parse(JSON.stringify(this.list))
        for (let i in list) {
          for (let j in list[i].productItem) {
            if (list[i].productItem[j].id === this.promotionPopupSkuId) {
              list[i].productItem[j].defaultPromotionId = promotionId
            }
          }
        }
        this.handleRes(list)
        this.list = list
        this.promotionPopupFlag = false
      },
      // 计算总价
      getSum () {
        let sum = 0
        console.log('计算总价',this.shoppingCarts)
        for (let i of this.shoppingCarts) {
          for (let j of i.promotions) {
            let iSum = 0
            let checked = 0
            for (let k of j.productItems) {
              if (this.checkedObj[k.id]) {
                iSum += k.price * k.amount
                checked++
              }
            }
            if (checked === 0) {
            } else if (j.promotionInfo.id === '') {
              iSum = tool.handlePrice(iSum)
            } else if (j.promotionInfo.type === 1) { // 满减
              for (let index = 0; index < j.promotionInfo.pdsArray.length; index++) {
                if (iSum >= j.promotionInfo.pdsArray[index].fullLimit) {
                  iSum = iSum - j.promotionInfo.pdsArray[index].subtract
                  index = j.promotionInfo.pdsArray.length
                }
              }
              iSum = tool.handlePrice(iSum)
              console.log('type1', iSum)
            } else if (j.promotionInfo.type === 2) { // 满折
              for (let index = 0; index < j.promotionInfo.pdsArray.length; index++) {
                if (iSum >= j.promotionInfo.pdsArray[index].fullLimit) {
                  iSum = iSum * j.promotionInfo.pdsArray[index].discount * 0.01
                  index = j.promotionInfo.pdsArray.length
                }
              }
              iSum = tool.handlePrice(iSum)
              console.log('type2', iSum)
            } else if (j.promotionInfo.type === 3) { // 单品折扣
                iSum = parseInt(iSum * j.promotionInfo.discount * 0.01) + iSum % 100
              if (j.promotionInfo.typeAlone === 1) { // 元级取整
                iSum = tool.handlePrice(iSum)
                iSum = parseInt(iSum)
                console.log('typeAlone1', iSum)
                // iSum = iSum.toString().replace(/[.][0-9]*/, '')
              } else if (j.promotionInfo.typeAlone === 2) { // 角级取整
                // iSum = iSum.toString().replace(/[.][0-9]*/, iSum.toString().match(/[.][0-9]{1}/))
                iSum = tool.handlePrice(iSum)
                iSum = parseFloat(iSum).toFixed(1)
                console.log('typeAlone2', iSum)
              }
            } else if (j.promotionInfo.type === 4) { // 直减
              iSum = iSum - j.promotionInfo.directAmount
              iSum = tool.handlePrice(iSum)
              console.log('type4', iSum)
            }
            sum = sum + parseFloat(iSum)
          }
        }
        this.sum = sum
      },
      putNum: debounce(function (product) {
        if (sessionStorage.getItem('userInfo')) {
          let params = { oldSkuId: product.id, quantity: product.amount, skuId: '' }
          this.$http.put(...scAPI.putCartItems([params])).then((response) => {
            if (response.data.code === 200) {}
          })
          .catch((error) => {
            console.log(error.response)
          })
        } else {
          let productItems = JSON.parse(localStorage.getItem('cartProductItems'))
          for (let i in productItems) {
            if (productItems[i].id === product.id) {
              productItems[i].amount = product.amount
            }
          }
          localStorage.setItem('cartProductItems', JSON.stringify(productItems))
          this.getCartDataLocal()
        }
      }, 200),
      deleteConfirm () {
        let checked = []
        for (let i in this.checkedObj) {
          if (this.checkedObj[i]) {
            checked.push(i)
          }
        }
        if (checked.length === 0) {
          // this.$vux.toast.show({
          //   text: '未选择删除商品',
          //   type: 'text',
          //   width: '200px'
          // })
          this.$Message.error({content:'未选择删除商品',duration:3})
        } else {
          // this.$vux.confirm.show({
          //   content: '确认删除该商品?',
          //   onConfirm: () => {
          //     this.deleteProduct(checked)
          //   }
          // })
          this.$Modal.confirm({
            title: '',
            content: '<p>确认删除该商品 </p>',
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
              this.deleteProduct(checked)
            },
          })

        }
      },
      deleteProduct (checked) {
        if (sessionStorage.getItem('userInfo')) {
          this.$http.post(...scAPI.deleteCartItems(checked)).then((response) => {
            if (response.data.code === 200) {
              // this.$vux.toast.show({
              //   text: '删除成功',
              //   type: 'text',
              //   width: '200px'
              // })
              this.$Message.error({content:'删除成功',duration:3});
              this.getCartData()
              location.reload()
            }
          }).catch((error) => {
            console.log(error.response)
          })
        } else {
          let cartProductItems1 = JSON.parse(localStorage.getItem('cartProductItems'))
          let cartProductItems2 = []
          for (let i in cartProductItems1) {
            if (checked.indexOf(cartProductItems1[i].id) === -1) {
              cartProductItems2.push(cartProductItems1[i])
              // this.quantityParam.splice(i, 1)
            }
          }
          localStorage.setItem('cartProductItems', JSON.stringify(cartProductItems2))
          this.getCartDataLocal()
        }
      },
      checkout () {
        let checked = []
        let params = [] // [{productId, quantity}]
        for (let i in this.checkedObj) {
          if (this.checkedObj[i]) {
            checked.push(i)
          }
        }
        if (checked.length === 0) {
          // this.$vux.toast.show({ text: '未选择结算商品', type: 'text', width: '200px' })
          this.$Message.error({content:'未选择结算商品',duration:3});
          return
        } else {
          for (let i of this.shoppingCarts) {
            for (let j of i.promotions) {
              for (let k of j.productItems) {
                if (checked.indexOf(k.id) !== -1) {
                  if (k.status !== 1) {
                    // this.$vux.toast.show({ text: '商品已下架', type: 'text', width: '200px' })
                    this.$Message.error({content:'商品已下架',duration:3});
                    return
                  } else if (k.amount > k.stock) {
                    // this.$vux.toast.show({ text: '库存不足', type: 'text', width: '200px' })
                    this.$Message.error({content:'库存不足',duration:3});
                    return
                  } else {
                    // params.push({productId: k.id, quantity: k.amount, promotionId: j.promotionInfo.id})
                    let existThisId = false
                    let existNullId = false
                    params.forEach(e => {
                      if (e.promotionId === j.promotionInfo.id) {
                        existThisId = true
                      } else if (e.promotionId === '') {
                        existNullId = true
                      }
                    })
                    if (j.promotionInfo.id && existThisId) {
                      for (let i in params) {
                        if (params[i].promotionId === j.promotionInfo.id) {
                          params[i].productItem.push({productId: k.id, quantity: k.amount})
                        }
                      }
                    } else if (j.promotionInfo.id && !existThisId) {
                      params.push({
                        promotionId: j.promotionInfo.id,
                        productItem: [{productId: k.id, quantity: k.amount}]
                      })
                    } else if (!j.promotionInfo.id && existNullId) {
                      for (let i in params) {
                        if (params[i].promotionId === '') {
                          params[i].productItem.push({productId: k.id, quantity: k.amount})
                        }
                      }
                    } else if (!j.promotionInfo.id && !existNullId) {
                      params.push({
                        promotionId: '',
                        productItem: [{productId: k.id, quantity: k.amount}]
                      })
                    }
                  }
                }
              }
            }
          }
          if (sessionStorage.getItem('userInfo')) {
            sessionStorage.setItem('settlementProductItems', JSON.stringify(params))
            this.$router.push({path: '/createOrder'})
          } else {
            // this.$vux.confirm.show({
            //   content: '用户未登录',
            //   confirmText: '去登录',
            //   onConfirm: () => {
            //     sessionStorage.setItem('settlementProductItems', JSON.stringify(params))
            //     this.$router.push({path: '/signin'})
            //   }
            // })
            this.$Modal.confirm({
              title: '',
              content: '<p>用户未登录</p>',
              okText: '去登陆',
              cancelText: '取消',
              onOk:()=>{
                sessionStorage.setItem('settlementProductItems', JSON.stringify(params))
                this.$router.push({path: '/login'})
              }
            });
          }
        }
      },
      // ====================选择规格====================
      openSpecsPopup (product) {
        this.specsPopupData_bs = {}
        this.specsPopupData = {} // 弹窗商品
        // sku
        this.specArray = []
        // ----------已选sku组合[{specId,specName,specValueId,specValueName}]
        // this.specArrayOn = []
        this.usedSpecValueArray = []
        this.skuSpecArray = []

        console.log('openSpecsPopupopenSpecsPopup',product)
        
        this.specsPopupFlag = true //是否弹窗
        this.specsPopupData_bs = JSON.parse(JSON.stringify(product))
        console.log('specsPopupData_bs',product)
        this.specsPopupData = JSON.parse(JSON.stringify(product))
        if (this.specsPopupData) {
          // if (this.specsPopupData.specs.length === 0) {
          //   this.$vux.toast.show({
          //     text: '无规格可选',
          //     type: 'text',
          //     width: '200px'
          //   })
          // } else {
            this.getSpuInfo(this.specsPopupData.spuId, (res) => {
              this.specArrayOn = this.specsPopupData.specs
              console.log('这是原来specArrayOn',this.specsPopupData.specs)
              // alert(this.specArrayOn)
              this.skuSpecArray = res.data.spuInfo.skuSpecArray
              this.getSpecArray(res.data.spuInfo.specArray)
              this.specFlag = true
            })
          }
        // }
        console.log('openSpecsPopup点击之后的specArray',this.specArray)
      },
      // 获取商品所有规格 spu接口
      getSpuInfo (spuId, callback) {
        this.$http.get(...pdAPI.getSpuInfo(spuId)).then((response) => {
          if (response.data.code === 200) {
            if (typeof callback === 'function') {
              callback(response)
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
              specValueName: j.specValueName,
            })
            spec1.specValueFlags.push(false)
          }
          specArray.push(spec1)
        }
        this.specArray = specArray
        this.handleSpecState()
        // console.log('uuuuuuuu',this.specArray[0].specValueArray)
        // this.xxx = this.specArray[0].specValueArray
      },
      // ----------处理spec置灰
      handleSpecState () {
        this.$Loading.start()
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
        // 本次置灰的属性值
        let thisValueArray = []
        for (let i of this.specArrayOn) {
          for (let j of this.skuSpecArray) {
            if (JSON.stringify(j).indexOf(JSON.stringify(i)) !== -1) {
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
        this.$Loading.finish()
      },
      // 获取new skuid
      postSpuInfo: debounce(function (callback) {
        console.log('这是点击specArrayOn',this.specArrayOn)
        this.$http.post(...pdAPI.specGetSku(this.specArrayOn).concat({
          cancelToken: new this.$http.CancelToken(function (cancel) {
            if (typeof getSkuCancel === 'function') {
              getSkuCancel()
            }
            getSkuCancel = cancel
            
          })
        })).then((response) => {
          if (response.data.code === 200) {
            let skuInfo = response.data.skuInfo
            this.specsPopupData = Object.assign(skuInfo.sku, {specs: skuInfo.spec})
            console.log('Object.assign(skuInfo.sku, {specs: skuInfo.spec})',Object.assign(skuInfo.sku, {specs: skuInfo.spec}))
            setTimeout(()=>{
              this.putSku(Object.assign(skuInfo.sku, {specs: skuInfo.spec}))
            })
          }
          if (typeof callback === 'function') {
            callback()
          }
        })
        .catch((error) => {
          console.log('new skuid找不到',error.response)
        })
        
      }, 300),
      // 点击确认
      finishChangeSize () {
        // for (let i in this.quantityParam) {
        //   if (this.productMsg[this.index1].productItem[this.index2].id === this.quantityParam[i].oldSkuId) {
        //     this.quantityParam[i].skuId = this.popupProduct.id
        //   }
        // }
        this.putSku()
      },
      // 修改商品规格接口
      putSku (obj) {
        console.log('obj',obj)
        if (sessionStorage.getItem('userInfo')) {
          console.log('545454545454545',this.specsPopupData_bs)
          let params = {
            oldSkuId: this.specsPopupData_bs.id,
            // quantity: this.specsPopupData.amount,
            quantity: 1,
            skuId: this.specsPopupData.id
          }
          console.log('params',params)
          this.$http.put(...scAPI.putCartItems([params])).then((response) => {//修改规格与数量
            if (response.data.code === 200) {
              this.specsPopupFlag = false
              this.getCartData()
            }
          })
          .catch((error) => {
            console.log(error.response)
          })
        } else {
          let productItems = JSON.parse(localStorage.getItem('cartProductItems'))
          for (let i in productItems) {
            if (productItems[i].id === this.specsPopupData_bs.id) {
              productItems[i] = this.specsPopupData
            }
          }
          localStorage.setItem('cartProductItems', JSON.stringify(productItems))
          this.specsPopupFlag = false
          this.getCartDataLocal()
        }
      },
      // 点击完成
      finishEdit () {
        this.editFlag = false
      }
    },
    mounted: function () {  
      let userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        this.memberId = JSON.parse(userInfo).memberId
        if (localStorage.getItem('cartProductItems') === '[]') {
          localStorage.removeItem('cartProductItems')
        }
        if (localStorage.getItem('cartProductItems')) {
          tool.preCartToCart(this, () => {
            if (sessionStorage.getItem('settlementProductItems')) {
              this.$router.push('/createOrder')
            } else {
              this.getCartData()
            }
          })
        } else {
          this.getCartData()
        }
      } else {
        this.getCartDataLocal()
      }
    },
    computed: {
      checkedStr () {
        return JSON.parse(JSON.stringify(this.checkedObj))
      },
      specScrollerHeight () {
        return document.body.clientHeight * 0.75 - 101 - 50 + 'px'
      },
      specArrayOnStr () {
        return JSON.stringify(this.specArrayOn)
      },
      sortSpecArray () {
        let arr = []
        for(let i=0;i<this.specArray.length;i++){
          for(let k=0;k<this.specArray[i].specValueArray.length;k++){
            this.specArray[i].specValueArray[k].specValueFlags = this.specArray[i].specValueFlags[k]
          }
          arr.push(this.specArray[i].specValueArray)
        }

        return arr
      }
    },
    watch: {
      checkedStr: debounce (function (str1, str2) {
        if (str1 !== str2) {
          let num1 = 0 // 商品数
          let num2 = 0 // 勾选数
          for (let i in this.checkedObj) {
            num1++
            if (this.checkedObj[i]) { num2++ }
          }
          this.checkNum = num2
          this.checkedAll = num1 === num2 ? true : false
        }
        this.getSum()
      }, 150),
      promotionPopupFlag (flag) {
        if (flag === false) {
          this.promotionPopupData = []
          this.promotionPopupSkuId = ''
        }
      },
      // specArrayOnStr (newV, oldV) {
      //   if (oldV !== '[]' && newV !== '[]') {
      //     if (newV !== oldV) {
      //       alert(0)
      //       // this.handleSpecState()
      //       // this.postSpuInfo()
      //       console.log('newV',newV)
      //       console.log('oldV',oldV)
      //     }
      //   }
      // },
      // specsPopupFlag (flag) {
      //   if (flag === false) {
      //     this.specsPopupData_bs = {}
      //     this.specsPopupData = {} // 弹窗商品
      //     // sku
      //     this.specArray = []
      //     // ----------已选sku组合[{specId,specName,specValueId,specValueName}]
      //     // this.specArrayOn = []
      //     this.usedSpecValueArray = []
      //     this.skuSpecArray = []
      //   }
      // },
      productAmount: {
        get (product) {
          return product.amount
        },
        set (product) {

        }
      }
    }
  }
</script>
<style>
  #shoppingCart .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    color:#515a6e
  }
</style>
<style lang="stylus" scoped>
@import "~styles/common/common.styl";
  #shoppingCart 
    background #fafafa
    padding 0 100px 100px 100px 
    .shoppingCart-content
      height 500px
      background #fff
      position relative
      .no-data-mask
        position absolute
        top 50%
        left 50%
        $ml(-100px)
        $mt(-150px)
        text-align center
        p
          margin 10px 0
          color #c8c8c8
        button
          width 120px
          height 40px
          color #fff
          background-color $blue
      .shoppingCart-content-top
        height 60px
        padding 0 50px 50px 50px
        color #000
        span
          line-height 44px
        .sp_1
          float left
          i
            font-style normal
            margin 0 3px
        .sp_2
          float right  
      .shoppingCart-content-center
        height 440px
        overflow auto
        .shoppingCart-product
          height 110px
          padding 0 50px 50px 50px
          border-bottom 1px solid #dfdfdf
          $mt(20px)
          .checkbox
            float left
            height inherit
            width 40px
            input
              $mt(30px)
          .img
            float left
            $mr(40px)
            div
              width 90px
              height 90px
              $border(1,1px)
              position relative
              img
                height 100%
                width 100%
                cursor pointer
              .mask,.circle 
                position absolute
                top 0
                left 0
                width 100%
                height 100% 
                background-color rgba(0, 0, 0, 0.5)
              .circle
                border-radius 50% 
                background-color rgba(255, 255, 255, 0.5)
                color #000
                p
                  line-height 86px
                  text-align center
          .detial
            float left
            color #000
            .title
              line-height 30px
            .price
              $mb(10px)
              color $blue
          .num
            float right
            $mt(53px)
            .tb-stock 
              position relative
              float left  
              $mt(6px)
              $ml(3px)
              span
                position absolute
                top 28px
                left -42px
                font-size 12px
                color red
              .no-stock
                top 8px
                left -75px
          .no-num
            float right
            $mt(20px)
            $mr(20px)
            line-height 30px
            .p1
              color #ff2222
              text-indent 5px
            .p2
              color #66a2e7
              cursor pointer

      .shoppingCart-content-bottom 
        $mt(20px)
        $border(border-top,1px)
        .shoppingCart-content-bottom-content
          padding 20px 0 50px 50px
          div,p
            float left
          .left
            div
              width 52px
              height 20px
              position absolute
              z-index 200
              cursor pointer
            color #000
            span
              color #66a2e7
              margin 0 10px
              cursor pointer
            .delete
              $ml(40px)
          .right
            float right
            p
              $mr(80px)
              color $blue
              span
                font-size 18px
                font-weight bold
            button
              height 60px
              width 130px
              color #000
              $mr(20px)
              position relative
              top -14px
              i
                  font-size 16px
                  vertical-align text-bottom
                  $ml(6px)
            .btn
              background-color $blue
              color #fff

</style>

