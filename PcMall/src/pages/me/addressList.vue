<style>
    .MAcontent .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,.MAcontent  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover{
        color: #352665;
        border-bottom-color: #352665;
    }
    .ivu-icon-ios-create-outline,.checkIconFoot .weui-icon-success ,.checkIconFoot .weui_icon_circle{
        margin-top: -3px;
        margin-right: 10px;
        font-size: 20px;
        color: #352665;
        cursor: pointer;
    }
</style>
<template>
  <div id="addressList" ref="addressList">
      <p solt="header" style="margin: 10px 0 0 30px; font-size: 24px;color: #352665;text-align: left;">地址管理</p>
    <!-- No Address -->
    <!--<div class="noAddress" v-if="noAddress && menuName == 1">-->
      <!--<div class="noAddressContent">-->
        <!--&lt;!&ndash;<img src="../../assets/images/nullAddress.svg" alt="noAddress" class="NAimg">&ndash;&gt;-->
        <!--<p class="NAcontent">目前您还没有设置收货地址</p>-->
      <!--</div>-->
    <!--</div>-->
    <div class="MAcontent">
        <Menu mode="horizontal" active-name="1" @on-select="menuChoose">
            <MenuItem name="1">
                配送地址
            </MenuItem>
            <MenuItem name="2">
                自提地址
            </MenuItem>
        </Menu>
        <p class="addNewAddress" @click="showCreatAddressModel">
            <Icon type="ios-add-circle-outline" style="position: relative;top: -3px;margin-right: 5px;font-size: 20px;"/>
            增加配送地址
        </p>
      <!--<div class="part-title" v-if="menuName == 1"><span class="title">配送地址</span><span class="control" @click="newAddress">+增加配送地址</span></div>-->
      <!-- If ios -->
      <div class="ifIphone" v-if="menuName == 1" style="margin-top: 5px;">
        <div v-for="(item, index) in addressInfo" :key="item.id">
          <div>
              <!--<div slot="right-menu">-->
                <!--<swipeout-button background-color="#FC781C" @click.native="deleteAddress(index)">删除</swipeout-button>-->
              <!--</div>-->
              <div slot="content" class="addressContent" ref="addressContent">
                <div class="addressChoose" @click="flag && chooseAddress(index)" :class="addressChooseIndex == index?'addressChooseActive':''">
                  <div class="addressee">
                    <span class="name">{{ item.receiverName }}</span>
                    <span class="tel">{{ item.receiverMobile }}</span>
                    <p class="addressInfo">{{ item.receiverAddress }}</p>
                    <div class="addressEdit">
                        <span class="edit" @click="editAddress(index)"><Icon type="ios-create-outline" />编辑</span>
                        <span class="setDefault">
                            <check-icon :value.sync="checkDefault[index]" @click.native.stop="checkClick(index)" class="checkIconFoot"></check-icon>
                            <span class="defaultAddress">
                              <span v-if="addressInfo[index].default_status">默认地址</span>
                              <span v-else>设为默认</span>
                            </span>
                        </span>
                    </div>
                  </div>
                  <i class="activeIcon"></i>
                </div>
                <!--<div class="addressFooter">-->
                  <!--<check-icon :value.sync="checkDefault[index]" @click.native.stop="checkClick(index)" class="checkIconFoot"></check-icon>-->
                  <!--<span class="defaultAddress">-->
                    <!--<span v-if="addressInfo[index].default_status">默认地址</span>-->
                    <!--<span v-else>设为默认</span>-->
                  <!--</span>-->
                  <!--<span class="editAddress" @click="editAddress(index)">-->
                    <!--&lt;!&ndash;<img src="../../assets/icons/edit.svg" alt="edit">&ndash;&gt;-->
                    <!--编辑-->
                  <!--</span>-->
                <!--</div>-->
              </div>
          </div>
        </div>
      </div>
      <div class="NAfooter" v-if="noAddress  && menuName == 1">
        无地址数据
      </div>
      <div class="part-title" style="margin-top: 1.17647059em;" v-if="menuName == 2">
        <span class="title">自提地址</span>
        <x-icon type="ios-help-outline" fill="#F47825" style="transform:translate(2px, 6px)" @click="toselfAddress"></x-icon>
        <x-icon type="ios-reload" class="control" style="transform:translate(2px, 6px)" @click="clearFilters"></x-icon>
      </div>
      <div v-if="menuName == 2">
        <group gutter="0px"><x-address title="筛选地址" v-model="filters" :list="addressData" hide-district :raw-value="true" @on-shadow-change="changeFilters" @on-hide="doFilters"></x-address></group>
        <div class="NAfooter" v-if="selfLiftingAddress.length === 0">无自提地址数据</div>
        <group gutter="0px" v-for="(item, index) in selfLiftingAddress" :key="item.id">
          <div class="addressContent selfLiftingAddressContent">
            <div class="addressChoose" @click="flag && chooseSelfLiftingAddress(index)">
              <div class="addressee">
                <span class="name">{{ item.receiverName }}</span>
                <span class="tel">{{ item.receiverMobile }}</span>
                <p class="addressInfo">{{ item.receiverAddress }}</p>
              </div>
              <!--<div class="addressInfo">-->
                <!--<span class="addressDetail">{{ item.receiverAddress }}</span>-->
              <!--</div>-->
            </div>
          </div>
        </group>
      </div>
    </div>

    <!-- <div class="MAfooter" v-else="noAddress">
      <div class="footerBtn" @click="newAddress">
        <span>+新增地址</span>
      </div>
    </div> -->
  </div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, Group, CellBox, XButton, ChinaAddressV3Data, Swipeout, SwipeoutItem, SwipeoutButton, CheckIcon, XAddress} from 'vux'
  import * as myAPI from '@/services/API/mineServices.es6'
  export default{
    name: 'addressList',
    components: {
      XHeader,
      Group,
      CellBox,
      XButton,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      CheckIcon,
      XAddress,
    },
    data () {
      return {
        checkDefault: [],
        addressData: ChinaAddressV3Data,
        addressInfo: [{}],
        noAddress: false,
        ifIphone: false,
        ifAndroid: false,
        memberId: '',
        a: true,
        flag: true,
        selfLiftingAddress_bs: [],
        selfLiftingAddress: [],
        filters: [],
        filtersNames: [],
        menuName: '1', //地址切换
        addressChooseIndex: '', //地址选择
      }
    },
    mounted () {
      this.getRouter()
      this.memberId = JSON.parse(sessionStorage.getItem('userInfo')).memberId
      this.bus.$on('addNewAddress',()=>{
          this.getAddressData((addressInfos) => {
              this.setDefault(addressInfos)
          })
      })
      this.bus.$on('deleteAddress11',()=>{
          this.getAddressData((addressInfos) => {
              this.setDefault(addressInfos)
          })
      })
      this.getAddressData((addressInfos) => {
        this.setDefault(addressInfos)
      })
        this.bus.$on('openAdress',()=>{
            this.getAddressData((addressInfos) => {
                this.setDefault(addressInfos)
            })
        })
        this.bus.$on('fun',val=>{
            console.log('sfsaf',val)
            this.getAddressData((addressInfos) => {
                this.setDefault(addressInfos)
            })
        })
      this.getSelfLiftingAddress()
    },
    // beforeRouteEnter (to, from, next) {
    //   if (from.name === 'mine') {
    //     sessionStorage.setItem('chooseAddress', false)
    //   } else if (from.name === 'createOrder') {
    //     sessionStorage.setItem('chooseAddress', true)
    //   }
    //   next((vm) => {
    //     console.log(vm)
    //   })
    // },
    methods: {
      //增加配送地址
        showCreatAddressModel(){
            this.$parent.$parent.showCreatAddressModel()
        },
      //导航切换
        menuChoose(name){
            this.menuName = name
        },
      // 识别路由来历
      getRouter () {
        if (this.$route.params) {
          if (this.$route.params.from) {
            if (this.$route.params.from === 'me') {
              this.flag = false
            }
          }
        }
      },
      // 第一次新增地址
      NoAddress () {
        this.ifIphone = false
        this.ifAndroid = false
        // this.noAddress = true
      },
      // ios android 切换
      IosOrAndroid () {
        /* Navigator 是HTML DOM中的内置对象，
         它包含有关浏览器的信息。
         userAgent是Navigator 的属性方法，
         可返回由客户机发送服务器的 user-agent 头部的值。
         作用其实就是返回当前用户所使用的是什么浏览器，
         toLowerCase() 楼上的说了，
         是将获得的信息变成小写的。 */
        var ua = navigator.userAgent.toLowerCase()
        if (/iphone|ipad|ipod/.test(ua)) {
          this.ifIphone = true
          console.log('iphone')
        } else if (/android/.test(ua)) {
          this.ifAndroid = true
          console.log('android')
        }
      },
      // 自提地址协议
      toselfAddress () {
        this.$router.push({path: '/selfAddress'})
      },
      // 获取查询所有地址接口
      getAddressData (callback) {
        this.$http.get(myAPI.getshippingAddress(this.memberId))
          .then((response) => {
//            this.$defaultServiceTip.success(response)
            if (response.data.code === 6007 || response.data === null) {
              this.NoAddress()
            } else if (response.status === 200) {
              this.IosOrAndroid()
              if (typeof callback === 'function') {
                callback(response.data.addressInfos)
              }
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.$vux.toast.show({
                text: '数据加载失败，请重新加载',
                type: 'warn'
              })
              return
            }
            if (error.response.data === null) {
              this.NoAddress()
              return
            }
            console.log(error.response)
            this.$vux.toast.show({
              text: error.response.data.message,
              type: 'warn'
            })
          })
      },
      // 请求修改地址内容接口
      putshippingAddress (param) {
        this.$http.put(...myAPI.putshippingAddress(param))
          .then((response) => {
            if (response.status === 200) {
              this.$vux.toast.show({
                text: response.data.message
              })
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              console.log(error)
              window.location.reload()
            }
          })
      },
      // 删除地址接口
      deleteshoppingAddress (cancel) {
        let id = this.addressInfo[cancel].id
        this.$http.delete(myAPI.deleteshippingAddress(id))
          .then((response) => {
            if (response.data.code === 200) {
              this.$vux.toast.show({
                text: '删除成功',
                type: 'text',
                width: '200px'
              })
              this.getAddressData((addressInfos) => {
                this.setDefault(addressInfos)
              })
            }
          })
          .catch((error) => {
//            this.$defaultServiceTip.error(error)
            console.log(error)
            if (error.response.status === 404) {
              this.$vux.confirm.show({
                title: status,
                content: '网络异常，请重试',
                confirmText: '确定',
                onConfirm () {
                  window.location.reload()
                },
                onCancel () {
                  window.location.reload()
                }
              })
            }
            return
          })
      },
      // ------------------- <=接口------
      // 编辑地址操作
      editAddress (edit) {
        this.catchSession(edit)
        this.$parent.$parent.showEditAddressModel()
        this.bus.$emit('setSession')
      },
      // 选择地址操作
      chooseAddress (choose) {
          sessionStorage.setItem('chooseAddress', true)
            console.log(choose)
          this.setAddress(choose)
        // if (sessionStorage.getItem('chooseAddress') === 'true') {
        //     console.log(2)
        //   // this.$router.go(-1)
        // }
      },
      chooseSelfLiftingAddress (choose) {
        // if (sessionStorage.getItem('chooseAddress') === 'true') {
          let data = {
            'id': this.selfLiftingAddress[choose].id,
            'receiverName': this.selfLiftingAddress[choose].receiverName,
            'receiverMobile': this.selfLiftingAddress[choose].receiverMobile,
            'receiverAddress': this.selfLiftingAddress[choose].receiverAddress,
            'default_status': this.selfLiftingAddress[choose].default_status
          }
          this.$store.commit('setAddress', data)
          // this.$emit('createOrder')
          // this.$router.go(-1)
        // }
      },
      // 删除地址操作
      deleteAddress (index) {
        this.$vux.confirm.show({
          content: '是否确认删除',
          onConfirm: () => {
            this.deleteshoppingAddress(index)
          }
        })
      },
      setDefault (addressInfos) {
        // 默认地址首位
        for (let obj of addressInfos) {
          if (obj.default_status === 1 && addressInfos[0].default_status !== 1) {
            addressInfos.unshift(JSON.parse(JSON.stringify(obj)))
          }
        }
        for (let i in addressInfos) {
          if (addressInfos[i].default_status === 1 && i !== '0') {
            addressInfos.splice(i, 1)
          }
        }
        // 默认地址操作
        for (let i in addressInfos) {
          console.log(i)
          console.log(addressInfos[i])
          addressInfos[i].default_status ? this.checkDefault.push(true) : this.checkDefault.push(false)
        }
        this.addressInfo = addressInfos
        return this.addressInfo
      },
      // ----------- <=地址操作--------
      // 传入session值
      catchSession (index) {
        let sessionData = {
          'id': this.addressInfo[index].id,
          'receiverName': this.addressInfo[index].receiverName,
          'receiverMobile': this.addressInfo[index].receiverMobile,
          'receiverAddress': this.addressInfo[index].receiverAddress,
          'default_status': this.addressInfo[index].default_status
        }
        sessionStorage.setItem('addressInfo', JSON.stringify(sessionData))
      },
      setAddress (index) {
        let data = {
          'id': this.addressInfo[index].id,
          'receiverName': this.addressInfo[index].receiverName,
          'receiverMobile': this.addressInfo[index].receiverMobile,
          'receiverAddress': this.addressInfo[index].receiverAddress,
          'default_status': this.addressInfo[index].default_status
        }
        console.log(data)
        this.$store.commit('setAddress', data)
        this.$parent.$parent.getSettlementDate()
        this.addressChooseIndex = index

      },

      // 修改默认地址
      checkClick (index) {
        // 修改default_status状态
        if (this.checkDefault[index] === true) {
          for (let i in this.checkDefault) {
            this.checkDefault[i] = false
            this.addressInfo[i].default_status = 0
          }
          this.checkDefault[index] = true
          this.addressInfo[index].default_status = 1
        } else if (this.checkDefault[index] === false) {
          this.checkDefault[index] = false
          this.addressInfo[index].default_status = 0
        }
        let param = {
          default_status: this.addressInfo[index].default_status,
          id: this.addressInfo[index].id
        }
        this.putshippingAddress(param)
      },
      newAddress () {
        this.$router.push({path: 'CreateAddress'})
      },
      getSelfLiftingAddress () {
        this.$http.get(myAPI.selfLiftingAddress()).then(res => {
          if (res.data.code === 200) {
            this.selfLiftingAddress_bs = res.data.addressInfos
            this.selfLiftingAddress = res.data.addressInfos
          }
        })
      },
      doFilters () {
        if (this.filters.length === 0) {
          this.filtersNames = []
          return
        } else {
          let selfLiftingAddress = []
          this.selfLiftingAddress_bs.forEach(e => {
            let flag = false
            this.filtersNames.forEach(e1 => {
              console.log(e.receiverAddress, e1)
              if (e.receiverAddress.indexOf(e1) !== -1) {
                flag = true
              }
            })
            if (flag) {
              selfLiftingAddress.push(e)
            }
          })
          this.selfLiftingAddress = selfLiftingAddress
        }
      },
      changeFilters (ids, names) {
        this.filtersNames = names
      },
      clearFilters () {
        this.filters = []
        this.selfLiftingAddress = this.selfLiftingAddress_bs
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #addressList {
    padding: 0 15px;
    height: 450px;
    .noAddressContent{
      position: absolute;
      top: 24.3%;
      width: 100%;
      text-align: center;
      .NAcontent {
        margin-top: 30px;
        color: #7f7f7f;
        font-size: 12px;
      }
    }
    .NAfooter{
      text-align: center;
      margin: 10px;
    }
    .MAheader{
      /*position:absolute;*/
      /*left:0;*/
      /*right:0;*/
      /*top:0;*/
      /*z-index:1;*/
      /*height:47px;*/
    }
    .MAcontent{
        position: relative;
      .part-title {
        width: calc(100% - 20px);
        height: 40px;
        line-height: 40px;
        background-color: #E0D7D0;
        padding: 0 10px;
      }
      .part-title .title {
        float: left;
      }
      .part-title .control {
        float: right;
      }
      .addNewAddress{
          position: absolute;
          right: 20px;
          top: 25px;
          font-size: 14px;
          color: #4A90E2;
          z-index: 999;
          cursor: pointer;
      }
    }
    .addressContent {
      .addressChoose{
          border: 2px solid transparent;
      }
      .addressChooseActive{
          position: relative;
          border: 2px solid #352665;
          .activeIcon{
              position: absolute;
              left: 0;
              bottom: 0;
              display: inline-block;
              border: 20px solid transparent;
              border-bottom-color: #352665;
              border-left-color: #352665;
          }
          .activeIcon::before{
              position: absolute;
              top: 8px;
              left: -14px;
              content: '';
              display: inline-block;
              width: 2px;
              height: 5px;
              background-color: #fff;
              transform: rotate(-45deg);
          }
          .activeIcon::after{
              position: absolute;
              top: 3px;
              left: -9px;
              content: '';
              display: inline-block;
              width: 2px;
              height: 10px;
              background-color: #fff;
              transform: rotate(45deg);
          }
      }
      .addressee {
        padding: 20px 50px;
        height: 100px;
        font-size: 14px;
        color: #111;
        border-bottom: 1px solid #eaeaea;
        .name {
            margin-right: 100px;
        }
        .tel {

        }
        .icon-default {
          width: 50px;
        }
        .addressEdit{
            float: right;
            margin-top: -45px;
            .edit{
                margin-right: 40px;
                cursor: pointer;
            }
        }
      }
      .addressInfo {
        padding-top: 20px;
      }
      .editIcon {
        float: right;
        margin-top: 24px;
        .icon-edit {
          width: 22px;
        }
      }
    }
    .selfLiftingAddressContent {
      height: 70px;
    }
    .addressFooter{
      height:44px;
      position: relative;
      border-top: 1px solid #eeeeee;
      .checkIconFoot{
        margin-right: 10px;
        font-size: 20px;
        margin-top: 0.5%;
      }
      .defaultAddress{
        position: absolute;
        top: 10%;
        left: 9%;
      }
      .editAddress {
        position: absolute;
        top: 5px;
        right: 15px;
      }
    }
    .MAfooter {
      width: 100%;
      position:absolute;
      bottom:0;
      left:0;
      right:0;
      z-index:1;
      height:49px;
    }
    .footerBtn{
      width: 100%;
      color: #ffffff;
      padding:12px 0;
      text-align: center;
      background-color: #352665;
    }
  }
  .ifIphone, .ifAndroid {
    .weui-cells {
      margin-top: 0px;
      margin-bottom: 1.17647059em;
    }
  }
</style>
