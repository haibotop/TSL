<style lang="scss" rel="stylesheet/scss" scoped>
#shoppingCart{
  background-color: #f2f2f2;
  height: 100%;
  position: relative;
  .SPheader{
    position:absolute;
    left:0;
    right:0;
    top:0;
    z-index:1;
    height:47px;
  }
  .SPcontent{
    position:absolute;
    left:0;
    right:0;
    top:47px;
    bottom:47px;
    overflow:auto;
    .SPcontentCell {
      width: 100%;
    }
  }
  .SPfooter{
    width: 100%;
    position: absolute;
    bottom: 0%;
  }
  .noCart{
    .noCartIcon{
      margin: 70px 0 auto;
      text-align: center;
    }
    .noCartContent{
      text-align: center;
      .noCartTips{
        font-size: 12px;
        color: #7f7f7f;
        letter-spacing: 0.52px;
      }
    }
    .noCartBtn{
      width: 80%;
      margin: 20px auto;
      .nocartButton{
        width:100%;
        height:35px;
        color:#ffffff;
        background-color: #352665;
        font-size:16px;
      }
    }
  }
  .storeBlock{
    width: 100%;
    position: relative;
    .checkIcon{
      display: inline-block;
    }
    .storeHouse{
      display: inline-block;
    }
    .storeIcon {
      display: inline-block;
      margin-bottom: 2px;
      width: 9px;
      height: 9px;
      border: 1px solid #b7b7b7;
      border-bottom: none;
      border-left: none;
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    }
    .postageTips{
      position: absolute;
      right: 0;
      top:20%;
      font-size: 11px;
      color: #352665;
    }
  }
  .productList {
    .checkIconbtn{
      width: 10%;
      vertical-align: middle;
    }
    .pFlex{
      width: 88%;
      vertical-align: middle;
      display: inline-block;
      flex-direction:column ;
      .pFlex1{
        display: flex;
      }
      .pFlex2{
        display: flex;
      }
    }
    .productImg {
      width: 88px;
      height: 88px;
      display: inline-block;
      vertical-align: middle;
      background: #eeeeee;
      position: relative;
      .PdImg {
        width: 88px;
        height: 88px;
        border-radius: 5px;
      }
      .img-mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: rgba(0, 0, 0, 0.4);
      }
      .img-mask .circle {
        width: 90%;
        height: 90%;
        margin: 5%;
        border-radius: 50%;
        background-color: rgba(255,255,255,0.5);
      }
      .img-mask .middle {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        text-align: center;
        transform: translate(-50%, -50%);
        font-size: 18px;
      }
    }
    .productConent {
      width: 68%;
      margin-left: 10px;
      display: inline-block;
      vertical-align: middle;
      font-family: "黑体", serif;
      .productConent > div {
        display: inline-block;
      }
      .productTitle {
        font-size: 14px;
        display: inline-block;
      }
      .productQuantity {
        float: right;
        color: #808080;
        font-size: 11px;
        line-height: 24px;
        font-weight: bolder;
      }
      .productSize {
        span {
          color: #808080;
          font-size: 11px;
          padding-right: 10px;
        }
        .editSize {
          background: #F2F2F2;
          border-radius: 6px;
          position: relative;
          .editPcolor{
            margin-left: 5px;
          }
          .downbtn{
            position: absolute;
            top: 5px;
            right: 16px;
            width: 9px;
            height: 9px;
            border: 1px solid #b7b7b7;
            border-top: none;
            border-left: none;
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          }
        }
      }
      .price{
        margin-top: 10px;
        position: relative;
        .discountedPrice {
          font-size: 14px;
          padding-right: 10px;
          color: #352665;
        }
        .originalPrice{
          font-size: 14px;
          color: #5f5f5f;
          text-decoration: line-through;
        }
        .calculate{
          position: absolute;
          bottom:0;
          right: 0;
          .weui-cell{
            padding: 0px;
          }
        }
      }
      .spec{
        display: inline-block;
      }
    }
  }
  .settlement-cell {
    padding: 0;
    .account {
      position: absolute;
      top: 14px;
      left: 90px;
      .accNum {
        font-size: 16px;
        color: red;
      }
    }
    .settlementBtn
    {
      color: #fff;
      width: 100px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      display: inline-block;
      background-color: #352665;
    }
  }
}
.item,.itemSelected {
  width: 64px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  padding:5px;
  border-radius: 6px;
}
.item{
  border:1px solid #DBDBDB;
  color: #DBDBDB;
}
.itemSelected{
  border:1px solid #352665;
  color: #352665;
}

// ----------商品规格弹窗
.bkcolor {
  background-color: #fff;
}
.spec-popup {
  width: 100%;
  height: 100%;
  border-radius: 6px 6px 0px 0px;
}
.skuInfo {
  height: 80px;
  padding: 10px 0px 10px 0px;
  border-bottom: 1px solid #d9d9d9;
}
.default-picture-wrapper {
  position: absolute;
  top: -20px;
  left: 10px;
  width: 98px;
  height: 98px;
  border-radius: 10px;
  border: 1px solid #eee;
  background-color: #fff;
}
.default-picture-inner {
  margin: 5px;
  width: 88px;
  height: 88px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #eee;
  img {
    display: block;
    width: 100%;
  }
}
.sku-info {
  margin: 0px 0px 0px 115px;
  .sku-info-price {
    font-size: 14px;
    color: $tsl-color;
    letter-spacing: 1.15px;
  }
  .sku-info-stock {
    font-size: 12px;
    color: #4d4d4d;
    letter-spacing: .5px;
  }
}
.spec-wrapper {
  padding: 10px 10px 0px 10px;
  height: calc(100% - 30px);
  overflow-y: scroll;
  .spec-inner {
    margin: 0px 0px 10px 0px;
  }
}
.spec-name {
  font-size: 14px;
  color: #535353;
  letter-spacing: .6px;
}
.default-item-class, .selected-item-class, .disabled-item-class {
  margin: 12px 15px 0 0;
  height: 30px;
  line-height: 30px;
  border: 1px solid #eee;
  padding: 0 15px;
  border-radius: 6px;
  font-size: 14px;
  color: #7f7f7f;
  letter-spacing: .6px;
}
.selected-item-class {
  border: 1px solid $tsl-color;
  color: $tsl-color;
}
.disabled-item-class {
  border: 1px solid #eee;
  color: #eee;
}
.btn-confirm {
  text-align: center;
  line-height: 50px;
  background-color: $tsl-color;
  color: #fff;
  width: 100%;
}
</style>
<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div id="shoppingCart">
    <div class="SPheader">
      <x-header title="购物袋" :left-options="{backText: '', preventGoBack:false}">
        <a slot="right" v-show="EditStage" v-on:click="finishEdit()" style="color:#fff;" >完成</a>
        <a slot="right" v-show="!EditStage && !nullShoppingCart" v-on:click="editStage()" style="color:#fff;" >编辑</a>
      </x-header>
    </div>
    <!-- 购物车内容 -->
    <div class="SPcontent noCart" v-if="nullShoppingCart">
      <div class="noCartIcon">
        <img src="../../assets/images/nullShoppingCart.svg" alt="购物袋缺省">
      </div>
      <div class="noCartContent">
        <span class="noCartTips">你的购物袋什么都没有哦！</span>
      </div>
      <div class="noCartBtn">
        <x-button class="nocartButton" @click.native="onClickBack">
          去逛逛
        </x-button>
      </div>
    </div>
    <div class="SPcontent" v-else>
      <group gutter="5px" v-for="(item, index1) in productMsg" :key="item.merchantInfo.id">
        <!-- <cell-box>
          <div class="storeBlock">
            <div class="checkIcon">
              <check-icon :value.sync="item.storecheck" @click.native="allProductItem(index1)"></check-icon>
            </div>
            <div class="storeHouse">
              <span>{{ item.merchantInfo.name }}</span>
              <div class="storeIcon"></div>
            </div>
            <div class="postageTips" v-if="EditStage===false">
              <span>已免邮费</span>
            </div>
          </div>
        </cell-box> -->
        <cell-box class="productMsg productList" v-for="(productlist, index2) in item.productItem" :key="productlist.productId">
          <div class="SPcontentCell">
            <check-icon @click.native="handleChecked" :value.sync="productlist.checked" class="checkIconbtn"></check-icon>
            <div class="pFlex">
              <div class="pFlex1" @click="goPd(productlist)">
                <div class="productImg">
                  <div style="text-align:center;">
                    <img :src="productlist.defaultPicture" class="PdImg"></img>
                  </div>
                  <div class="img-mask" v-show="productlist.status !== 1 || productlist.stock === 0"><div class="circle"><span class="middle" v-show="productlist.status !== 1">售罄</span><span class="middle" v-show="productlist.status === 1 && productlist.stock === 0">无库存</span></div></div>
                </div>
                <div class="productConent">
                  <div>
                    <span class="productTitle">{{ handleName(productlist.name) }}</span>
                  </div>
                  <!--编辑状态切换 规格选择-->
                  <div class="productSize " v-if="EditStage">
                    <div class="editSize" @click="loadSize(index1, index2)">
                      <span class="editPcolor">{{ productlist.sizeMsg }}</span>
                      <div class="downbtn"></div>
                    </div>
                  </div>
                  <div class="productSize" v-else="EditStage===false">
                    <span>{{ productlist.sizeMsg }}</span>
                  </div>
                  <div class="price">
                    <span class="discountedPrice">¥{{ handlePrice(productlist.price) }}</span>
                    <!--购物车编辑状态切换 计算数量-->
                    <div class="calculate" v-if="EditStage">
                      <x-number v-model="productlist.amount" :min="1" :max="productlist ? productlist.stock : 0"></x-number>
                    </div>
                    <span class="productQuantity" v-else="EditStage===false">X{{ productlist.amount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </cell-box>
      </group>
    </div>
    <!-- 下单 -->
    <div class="SPfooter" v-if="nullShoppingCart===false">
      <group>
        <cell class="settlement-cell">
          <div slot="after-title">
            <check-icon :value.sync="allcheck" @click.native="allchecked" style="font-size: 14px;">全选</check-icon>
          </div>
          <div slot="child" class="account"><span>总计：</span><span class="accNum">¥{{ account }}</span></div>
          <div class="settlementBtn" v-if="EditStage" @click="deleteConfirm">删除</div>
          <div class="settlementBtn" @click="finishOrder" v-else>结算</div>
        </cell>
      </group>
    </div>
    <!-- 编辑选框,编辑规格选择 继承pd.vue select-Psize样式 -->
    <!--<div v-transfer-dom>-->
      <!--<popup v-model="editSize" hide-on-deactivated height="75%" style="background: transparent; overflow-y: visible" class="select-pSize">-->
        <!--<div class="popupBody">-->
          <!--<div class="popupCheck">-->
            <!--<div class="defaultPicture"><div class="defaultPictureInner"><img class="popupImg" :src="popupProduct.defaultPicture" alt=""></div></div>-->
            <!--<div class="pInfo">-->
              <!--<p class="popupPrice">¥{{ popupProduct.floatPrice }}</p>-->
              <!--<p class="pStock">库存 {{ popupProduct.stock }}件</p>-->
              <!--<p class="pSize">请选择 颜色 尺码</p>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="select-area">-->
            <!--<div>-->
              <!--<scroller lock-x height="auto" ref="selectScroller" class="select-scroller">-->
                <!--<group>-->
                  <!--<cell-box v-for="(item, index) in spuInfo.specArray" :key="item.specId" v-show="specs.length > 0">-->
                    <!--<div>-->
                      <!--<span class="label">{{ item.specName }}</span>-->
                      <!--<checker class="labels" default-item-class="default-item" selected-item-class="selected-item" disabled-item-class="disabled-item" v-model="specs[index]">-->
                        <!--<checker-item v-for="(item2, index2) in item.specValueArray" :key="item2.specValueId" :value="{specId: item.specId, specName: item.specName, specValueId: item2.specValueId, specValueName: item2.specValueName}" :disabled="false">{{ item2.specValueName }}</checker-item>-->
                      <!--</checker>-->
                    <!--</div>-->
                  <!--</cell-box>-->
                  <!--<cell-box>-->
                    <!--<span class="label">数量：</span>-->
                    <!--<x-number v-model="popupProduct.amount" :min="1" :max="popupProduct.stock" class="pd-number"></x-number>-->
                  <!--</cell-box>-->
                  <!--<cell class="last-cell"></cell>-->
                <!--</group>-->
              <!--</scroller>-->
              <!--<div class="btn-bar">-->
                <!--<x-button class="btn-confirm" @click.native="finishChangeSize">-->
                  <!--确认-->
                <!--</x-button>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</popup>-->
    <!--</div>-->
      <div v-transfer-dom>
        <popup v-model="specFlag" height="75%" :popup-style="{'overflow-y': 'visible'}" is-transparent>
          <div slot="default" class="spec-popup bkcolor">
            <div class="skuInfo">
              <div class="default-picture-wrapper">
                <div class="default-picture-inner">
                  <img :src="popupProduct ? popupProduct.defaultPicture : ''" alt="">
                </div>
              </div>
              <div class="sku-info">
                <div class="sku-info-price"><span>￥</span>{{popupProduct ? handlePrice(popupProduct.price) : 0}}</div>
              </div>
            </div>
            <scroller lock-x :height="specScrollerHeight">
              <div class="spec-wrapper">
                <div class="spec-inner" v-for="(item, index) in specArray" :key="item.specId">
                  <span class="spec-name">{{handleName(item.specName)}}</span>
                  <Checker
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
                      :disabled="!item.specValueFlags[index2]">{{item2.specValueName}}</checker-item>
                  </Checker>
                </div>
                <group id="pd-popup-group" gutter="5px" class="spec-inner">
                  <span class="spec-name">数量</span>
                  <inline-x-number v-model="popupProduct.amount" style="display:inline-block;float:right;" :min="1" :max="popupProduct ? popupProduct.stock : 0" width="50px"></inline-x-number>
                  <!--<x-number v-model="popupProduct.amount" :min="1" :max="popupProduct.stock" class="pd-number"></x-number>-->
                </group>
              </div>
            </scroller>
            <div class="btn-confirm" @click="finishChangeSize">确定</div>
          </div>
        </popup>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import { XHeader, CellBox, Cell, Group, CheckIcon, Checklist, Scroller, XNumber, InlineXNumber, TransferDomDirective as TransferDom, Popup, Checker, CheckerItem, XButton, debounce, Confirm } from 'vux'
  import * as myAPI from '@/services/API/myService.es6'
  import * as tool from '@/services/myTool.es6'
  let getSkuCancel
  export default {
    name: 'shoppingCart',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      CellBox,
      Cell,
      Group,
      CheckIcon,
      Checklist,
      XNumber,
      Popup,
      Checker,
      Scroller,
      CheckerItem,
      XButton,
      InlineXNumber,
      debounce,
      Confirm
    },
    data () {
      return {
        memberId: '',
        productMsg: [],
        popupProduct: {},
        param: [],
        deleteParam: [],
        quantityParam: [],
        index1: '',
        index2: '',
        //  默认/已选规格  specs: [{pecId: '', specName: '', specValueId: '', specValueName: ''}]
        specs: [],
        specssAmount: [],
        skuInfo: [
          {}
        ],
        // 规格集
        spuInfo: {
          specArray: [{specId: '', specName: '', specValueArray: [{specValueId: '', specValueName: ''}]}]
        },
        editparam: {},
        account: 0,
        EditStage: false,
        changeQuantitySuccess: false,
        allcheck: false,
        specFlag: false,
        nullShoppingCart: false,
        a: true,
        // sku
        specArray: [],
        // ----------已选sku组合[{specId,specName,specValueId,specValueName}]
        specArrayOn: [],
        usedSpecValueArray: [],
        skuSpecArray: []
      }
    },
    mounted: function () {
      this.getCartItem()
    },
    methods: {
      // 只处理一个商家的
      timeSorting (shoppingCarts) {
        let data = shoppingCarts
        if (data) {
          if (data[0].productItem.length) {
            let productItem = []
            productItem = data[0].productItem.sort(function (a, b) {
              // .replace(/[^0-9 | - | : | /]/g, ' ')去除怪异空格
              let a1 = new Date(a.createDate.replace(/-/g, '/').replace(/\.\d+/, '').replace(/[^0-9 | : | /]/g, ' ')).getTime()
              let b1 = new Date(b.createDate.replace(/-/g, '/').replace(/\.\d+/, '').replace(/[^0-9 | : | /]/g, ' ')).getTime()
              console.log(b1, a1)
              return b1 - a1
            })
            data[0].productItem = productItem
          }
        }
        return data
      },
      // 获取购物车接口
      getCartData () {
        this.$http.get(myAPI.getshoppingCart()).then((response) => {
          this.productMsg = []
          if (response.data.code === 200) {
            this.loadCart(this.timeSorting(response.data.shoppingCarts))
            this.initQuantityParam()
          } else if (response.data.code === 9006) {
            this.nullproduct(response.data)
          }
        })
      },
      getCartItem () {
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
          if (localStorage.getItem('cartProductItems') === '[]') {
            localStorage.removeItem('cartProductItems')
          }
          if (localStorage.getItem('cartProductItems')) {
            let productItems = JSON.parse(localStorage.getItem('cartProductItems'))
            console.log(productItems)
            this.loadCart([
              {
                merchantInfo: {
                  id: '123',
                  logoUrl: 'http://www.tslj.cn',
                  name: '谢瑞麟官网',
                  registerAddress: '香港'
                },
                productItem: productItems
              }
            ])
            this.initQuantityParam()
          } else {
            this.nullproduct({message: '购物袋为空'})
          }
        }
      },
      // 删除商品项接口
      deleteCartItem (ids) {
        this.$http.post(...myAPI.deleteCartItems(ids))
          .then((response) => {
            console.log(ids)
            if (response.data.code === 200) {
              this.$vux.toast.show({
                text: '删除成功',
                type: 'text',
                width: '200px'
              })
              console.log(ids)
              this.getCartItem()
            }
          })
          .catch((error) => {
            console.log(error.response)
          })
      },
      // 获取商品已选规格sku接口
      getSkuInfo (callback) {
        this.$http.get(myAPI.getskuInfo(this.popupProduct.id))
          .then((response) => {
            if (response.data.code === 200) {
              this.skuInfo[0].oldSkuId = response.data.skuInfo.sku.id
            }
            if (typeof callback === 'function') {
              callback()
            }
          })
          .catch((error) => {
            if (error.response.data.status === 500) {
              this.$vux.toast.show({
                text: '获取规格失败，请稍后再试',
                type: 'text',
                width: '250px'
              })
              this.specFlag = false
            }
          })
      },
      // 获取商品所有规格 spu接口
      getSpuInfo (spuId, callback) {
        this.$http.get(myAPI.getspuInfo(spuId))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 修改商品规格接口
      putSku () {
        if (sessionStorage.getItem('userInfo')) {
          let params = {
            oldSkuId: this.productMsg[this.index1].productItem[this.index2].id,
            quantity: this.popupProduct.amount,
            skuId: this.popupProduct.id
          }
          this.$http.put(...myAPI.putCartItems([params])).then((response) => {
            if (response.data.code === 200) {
              this.getCartItem()
            }
          })
          .catch((error) => {
            console.log(error.response)
          })
        } else {
          let productItems = JSON.parse(localStorage.getItem('cartProductItems'))
          for (let i in productItems) {
            if (productItems[i].id === this.productMsg[this.index1].productItem[this.index2].id) {
              productItems[i] = this.popupProduct
            }
          }
          localStorage.setItem('cartProductItems', JSON.stringify(productItems))
          this.getCartItem()
        }
        this.specFlag = false
      },
      // 修改数量
      putNum: debounce(function () {
        let params
        for (let i in this.quantityParam) {
          for (let j of this.productMsg) {
            for (let k of j.productItem) {
              if (this.quantityParam[i].oldSkuId === k.id && this.quantityParam[i].oldQuantity !== k.amount) {
                this.quantityParam[i].quantity = k.amount
                params = this.quantityParam[i]
              }
            }
          }
        }
        if (!params) { return }
        if (sessionStorage.getItem('userInfo')) {
          // delete params.oldQuantity
          this.$http.put(...myAPI.putCartItems([params]).concat({
            cancelToken: new this.$http.CancelToken(function (cancel) {
              if (typeof getSkuCancel === 'function') {
                getSkuCancel()
              }
              getSkuCancel = cancel
            })
          })).then((response) => {
            if (response.data.code === 200) {
              this.getCartItem()
            }
          })
          .catch((error) => {
            console.log(error.response)
          })
        } else {
          let productItems = JSON.parse(localStorage.getItem('cartProductItems'))
          for (let i in productItems) {
            if (productItems[i].id === params.oldSkuId) {
              productItems[i].amount = params.quantity
            }
          }
          localStorage.setItem('cartProductItems', JSON.stringify(productItems))
          this.getCartItem()
        }
      }, 300),
      // --------------- <= 接口--------
      // 购物车为空
      nullproduct (data) {
        // 购物车为空
        this.$vux.toast.show({
          type: 'text',
          text: '购物袋为空',
          width: '200px',
          position: 'bottom'
        })
        this.nullShoppingCart = true
        this.productMsg = []
        this.EditStage = ''
      },
      // 去逛逛
      onClickBack () {
        this.$router.push({path: 'home'})
      },
      // ------------ <= 购物车为空-------
      // 加载购物车数据
      loadCart (shoppingCarts) {
        this.productMsg = []
        let data = JSON.parse(JSON.stringify(shoppingCarts))
        for (let item of data) {
          item.storecheck = false
          for (let obj of item.productItem) {
            obj.checked = false
            this.specssAmount.push(obj.amount)
          }
        }
        console.log(this.specssAmount)
        this.productMsg = data
        this.changeData()
      },
      // 数据转换
      changeData () {
        for (let item of this.productMsg) {
          for (let i of item.productItem) {
            i.sizeMsg = ''
            if (i.status === 1) {
              for (let obj of i.specs) {
                i.sizeMsg += ` ${obj.specValueName}`
              }
            }
          }
        }
      },
      // 全选商品
      allProductItem (index) {
        let data = JSON.parse(this.productMsgData)
        let storecheck = 0
        let allstorecheck = data.length
        console.log(this.productMsg[index])
        for (let obj of this.productMsg[index].productItem) {
          obj.checked = this.productMsg[index].storecheck
        }
        for (let obj of data) {
          if (obj.storecheck) {
            storecheck++
          }
        }
        if (storecheck === allstorecheck) {
          this.allcheck = true
        } else {
          this.allcheck = false
        }
      },
      handleChecked () {
        let data = JSON.parse(this.productMsgData)
        let allchecked = 0
        let allitem = 0
        for (let i in data) {
          let checked = 0
          for (let obj of data[i].productItem) {
            allitem++
            if (obj.checked) {
              checked++
              allchecked++
            }
          }
          if (checked === data[i].productItem.length) {
            this.productMsg[i].storecheck = true
          } else {
            this.productMsg[i].storecheck = false
          }
          if (allchecked === allitem) {
            this.allcheck = true
          } else {
            this.allcheck = false
          }
        }
      },
      allchecked () {
        for (let item of this.productMsg) {
          item.storecheck = this.allcheck
          for (let obj of item.productItem) {
            obj.checked = this.allcheck
          }
        }
      },
      // --------------- <= 购物车操作------
      // 点击编辑
      editStage () {
        this.initQuantityParam()
        this.EditStage = true
      },
      initQuantityParam () {
        this.quantityParam = []
        for (let i of this.productMsg) {
          for (let j of i.productItem) {
            this.quantityParam.push({oldSkuId: j.id, oldQuantity: j.amount, quantity: '', skuId: ''})
          }
        }
      },
      // 加载规格信息
      loadSize (index1, index2) {
        if (this.productMsg[index1].productItem[index2].status !== 1 || this.productMsg[index1].productItem[index2].stock === 0) {
          return
        }
        this.popupProduct = JSON.parse(JSON.stringify(this.productMsg[index1].productItem[index2]))
        this.index1 = index1
        this.index2 = index2
        this.specFlag = false
        if (this.popupProduct) {
          if (this.popupProduct.specs.length === 0) {
            this.$vux.toast.show({
              text: '无规格可选',
              type: 'text',
              width: '200px'
            })
          } else {
            this.getSpuInfo(this.popupProduct.spuId, (res) => {
              this.specArrayOn = this.popupProduct.specs
              this.skuSpecArray = res.data.spuInfo.skuSpecArray
              this.getSpecArray(res.data.spuInfo.specArray)
              this.specFlag = true
            })
          }
        }
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
        this.$vux.loading.show()
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
                console.log(this.specArray[j].specValueFlags[k])
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
        console.log(thisValueArray, this.specArray)
        for (let i in this.specArray) {
          for (let j in this.specArray[i].specValueArray) {
            if (thisValueArray.length > 0 && thisValueArray.indexOf(JSON.stringify(this.specArray[i].specValueArray[j])) === -1) {
              console.log(this.specArray[i].specValueFlags[j])
              this.specArray[i].specValueFlags[j] = false
            }
          }
        }
        this.$vux.loading.hide()
      },
      // 获取new skuid
      postSpuInfo: debounce(function (callback) {
        this.$http.post(...myAPI.postspecGetSku(this.specArrayOn).concat({
          cancelToken: new this.$http.CancelToken(function (cancel) {
            if (typeof getSkuCancel === 'function') {
              getSkuCancel()
            }
            getSkuCancel = cancel
          })
        })).then((response) => {
          if (response.data.code === 200) {
            this.skuInfo[0].skuId = response.data.skuInfo.sku.id
            this.skuInfo[0].quantity = this.popupProduct.amount
            let skuInfo = response.data.skuInfo
            this.popupProduct = Object.assign(skuInfo.sku, {specs: skuInfo.spec})
          }
          if (typeof callback === 'function') {
            callback()
          }
        })
        .catch((error) => {
          console.log(error.response)
        })
      }, 300),
      // 点击确认
      finishChangeSize () {
        for (let i in this.quantityParam) {
          if (this.productMsg[this.index1].productItem[this.index2].id === this.quantityParam[i].oldSkuId) {
            this.quantityParam[i].skuId = this.popupProduct.id
          }
        }
        // this.productMsg[this.index1].productItem[this.index2] = this.popupProduct
        // this.changeData()
        this.putSku()
      },
      // 点击完成
      finishEdit () {
        this.EditStage = false
      },
      // ---------------- <= 编辑状态---------
      // 结算和删除
      finishOrder () {
        let param = this.param
        if (param.length === 0) {
          this.$vux.toast.show({ text: '未选择结算商品', type: 'text', width: '200px' })
          return
        }
        for (let i of this.productMsg) {
          for (let j of i.productItem) {
            for (let k of param) {
              if (k.productId === j.id && j.status !== 1) {
                this.$vux.toast.show({ text: '商品售罄', type: 'text', width: '200px' })
                return
              }
            }
          }
        }
        if (sessionStorage.getItem('userInfo')) {
          sessionStorage.setItem('settlementProductItems', JSON.stringify(param))
          this.$router.push({path: '/createOrder'})
        } else {
          this.$vux.confirm.show({
            content: '用户未登录',
            confirmText: '去登录',
            onConfirm: () => {
              sessionStorage.setItem('settlementProductItems', JSON.stringify(param))
              this.$router.push({path: '/signin'})
            }
          })
        }
      },
      deleteConfirm () {
        if (this.deleteParam.length === 0) {
          this.$vux.toast.show({
            text: '未选择删除商品',
            type: 'text',
            width: '200px'
          })
        } else {
          this.$vux.confirm.show({
            content: '确认删除该商品?',
            onConfirm: () => {
              this.deleteProduct()
            }
          })
        }
      },
      deleteProduct () {
        if (sessionStorage.getItem('userInfo')) {
          this.deleteCartItem(this.deleteParam)
        } else {
          let cartProductItems1 = JSON.parse(localStorage.getItem('cartProductItems'))
          let cartProductItems2 = []
          for (let i in cartProductItems1) {
            if (this.deleteParam.indexOf(cartProductItems1[i].id) === -1) {
              cartProductItems2.push(cartProductItems1[i])
              this.quantityParam.splice(i, 1)
            }
          }
          localStorage.setItem('cartProductItems', JSON.stringify(cartProductItems2))
          this.getCartItem()
        }
      },
      // ---------------- <= 结算和删除--------
      // ----------处理名字
      handleName (name) {
        return tool.handleName(name)
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      goPd (product) {
        if (!this.EditStage) {
          if (product.status === 1) {
            let skuId = product.id
            this.$router.push({path: `/pd/${skuId}`})
          }
        }
      }
    },
    computed: {
      productMsgData () {
        return JSON.stringify(this.productMsg)
      },
      specScrollerHeight () {
        return document.body.clientHeight * 0.75 - 101 - 50 + 'px'
      },
      specStr () {
        return JSON.stringify(this.specArrayOn)
      },
      allAmount () {
        let sum = 0
        for (let i of this.productMsg) {
          for (let j of i.productItem) {
            sum = sum + j.amount * 1
          }
        }
        return sum
      }
    },
    watch: {
      productMsgData: function (newValue, oldValue) {
        let data = JSON.parse(newValue)
        let arr = []
        let deleteArr = []
        let price = 0
        let floatPrice = 0
        let allchecked = true
        for (let i in data) {
          for (let obj of data[i].productItem) {
            if (obj.checked) {
              arr.push({productId: obj.id, quantity: obj.amount})
              deleteArr.push(obj.id)
              price += obj.amount * obj.price
              price % 100 === 0 ? floatPrice = `${price / 100}.00` : floatPrice = price / 100
            } else {
              allchecked = false
            }
          }
        }
        if (!allchecked) {
          this.allcheck = false
        }
        this.param = arr
        this.deleteParam = deleteArr
        this.account = floatPrice
      },
      specStr (newV, oldV) {
        if (oldV !== '[]') {
          if (newV !== oldV) {
            this.handleSpecState()
            this.postSpuInfo()
          }
        }
      },
      allAmount (newV, oldV) {
        console.log(arguments)
        if (oldV !== 0) {
          this.putNum()
        }
      }
    }
  }
</script>
