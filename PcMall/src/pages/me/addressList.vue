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
    .addressEdit .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color: #352665;
        background-color: #352665;
    }
    .addressEdit .ivu-checkbox-checked:hover .ivu-checkbox-inner{
        border-color: #352665;
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
      <div class="addressContentBig" v-if="!noAddress && menuName == 1" style="margin-top: 5px;padding-right: 5px;">
        <div v-for="(item, index) in addressInfo" :key="item.id">
          <div slot="content" class="addressContent" ref="addressContent">
            <div class="addressChoose" @click="flag && chooseAddress(index)" :class="addressChooseIndex == index?'addressChooseActive':''">
              <div class="addressee">
                <span class="name">{{ item.receiverName }}</span>
                <span class="tel">{{ item.receiverMobile }}</span>
                <p class="addressInfo">{{ item.receiverAddress }}</p>
                <div class="addressEdit">
                    <span class="edit" @click="editAddress(index)"><Icon type="ios-create-outline" />编辑</span>
                    <span class="setDefault">
                        <Checkbox v-model="checkDefault[index]" @click.native.stop="checkClick(index)"></Checkbox>
                        <!--<check-icon :value.sync="checkDefault[index]" @click.native.stop="checkClick(index)" class="checkIconFoot"></check-icon>-->
                        <span class="defaultAddress">
                          <span v-if="addressInfo[index].default_status">默认地址</span>
                          <span v-else>设为默认</span>
                        </span>
                    </span>
                </div>
              </div>
              <i class="activeIcon"></i>
            </div>
          </div>
        </div>
        
      </div>
      <div class="Mfooter" >
          <Button @click.native="hideAddressList" style="margin-right: 30px; width: 200px;height: 50px;font-size: 16px;">取消</Button>
          <Button @click.native="saveAddressList1" style="width: 200px;height: 50px;font-size: 16px; background-color: #352665;color: #fff;">保存</Button>
      </div>
      <div class="NAfooter" v-if="noAddress  && menuName == 1">
          无收货地址信息
      </div>
      <div class="addressContentBig" v-if="menuName == 2" style="margin-top: 5px;padding-right: 5px;">
          <div class="NAfooter" v-if="selfLiftingAddress.length === 0">无自提地址数据</div>
          <div v-for="(item, index) in selfLiftingAddress" :key="item.id">
              <div slot="content" class="addressContent" ref="addressContent">
                  <div class="addressChoose" @click="flag && chooseSelfLiftingAddress(index)" :class="selfaddressChooseIndex == index?'addressChooseActive':''">
                      <div class="addressee">
                          <span class="name">{{ item.receiverName }}</span>
                          <span class="tel">{{ item.receiverMobile }}</span>
                          <p class="addressInfo">{{ item.receiverAddress }}</p>
                      </div>
                      <i class="activeIcon"></i>
                  </div>
              </div>
          </div>
          <div class="Mfooter" >
              <Button @click.native="hideAddressList" style="margin-right: 30px; width: 200px;height: 50px;font-size: 16px;">取消</Button>
              <Button @click.native="saveAddressList2" style="width: 200px;height: 50px;font-size: 16px; background-color: #352665;color: #fff;">保存</Button>
          </div>
        <!--<group gutter="0px"><x-address title="筛选地址" v-model="filters" :list="addressData" hide-district :raw-value="true" @on-shadow-change="changeFilters" @on-hide="doFilters"></x-address></group>-->
        <!--<div class="NAfooter" v-if="selfLiftingAddress.length === 0">无自提地址数据</div>-->
        <!--<group gutter="0px" v-for="(item, index) in selfLiftingAddress" :key="item.id">-->
          <!--<div class="addressContent selfLiftingAddressContent">-->
            <!--<div class="addressChoose" @click="flag && chooseSelfLiftingAddress(index)">-->
              <!--<div class="addressee">-->
                <!--<span class="name">{{ item.receiverName }}</span>-->
                <!--<span class="tel">{{ item.receiverMobile }}</span>-->
                <!--<p class="addressInfo">{{ item.receiverAddress }}</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;<div class="addressInfo">&ndash;&gt;-->
                <!--&lt;!&ndash;<span class="addressDetail">{{ item.receiverAddress }}</span>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</div>-->
          <!--</div>-->
        <!--</group>-->
      </div>
      <div class="Mfooter" >
          <Button @click.native="hideAddressList" style="margin-right: 30px; width: 200px;height: 50px;font-size: 16px;">取消</Button>
          <Button @click.native="saveAddressList2" style="width: 200px;height: 50px;font-size: 16px; background-color: #352665;color: #fff;">保存</Button>
      </div>
    </div>
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
        addressChooseIndex: '-1', //地址选择
        selfaddressChooseIndex: '-1', //自提地址选择
        checkClickParam: []//默认地址
      }
    },
    mounted () {
      // this.getRouter()
      this.memberId = JSON.parse(sessionStorage.getItem('userInfo')).memberId
      this.bus.$on('addNewAddress',()=>{
          this.noAddress = false
          this.getAddressData((addressInfos) => {
              this.setDefault(addressInfos)
          })
      })
      this.bus.$on('deleteAddress11',()=>{
          this.getAddressData((addressInfos) => {
              this.setDefault(addressInfos)
          })
      })
        this.bus.$on('openAdress',()=>{
            this.getAddressData((addressInfos) => {
                this.setDefault(addressInfos)
            })
        })
        this.bus.$on('fun',()=>{
            this.getAddressData((addressInfos) => {
                this.setDefault(addressInfos)
            })
        })
      this.getSelfLiftingAddress()
    },
    methods: {
      //隐藏收获地址
      hideAddressList(){
          this.addressChooseIndex = '-1'
          this.selfaddressChooseIndex = '-1'
          this.checkClickParam = []
          this.$parent.$parent.hideAddressModel()
      },
      //保存地址
      saveAddressList2(){
          console.log("this.selfaddressChooseIndex",this.selfaddressChooseIndex)
          if(this.selfaddressChooseIndex == '-1'){
              this.$Modal.warning({
                  title: "提示",
                  content: '请选择一个自提地址'
              })
              return
          }
          let choose = this.selfaddressChooseIndex
          let data = {
              'id': this.selfLiftingAddress[choose].id,
              'receiverName': this.selfLiftingAddress[choose].receiverName,
              'receiverMobile': this.selfLiftingAddress[choose].receiverMobile,
              'receiverAddress': this.selfLiftingAddress[choose].receiverAddress,
              'default_status': this.selfLiftingAddress[choose].default_status
          }
          this.$store.commit('setAddress', data)
          if (this.$parent.$parent.getSettlementDate !== undefined) {
            this.$parent.$parent.getSettlementDate()
          }
          this.$Modal.success({
              title: "提示",
              content: "保存成功",
              onOk: () => {
                  this.$parent.$parent.hideAddressModel()
              }
          })
        },
        saveAddressList1(){
          //默认地址
          if(this.checkClickParam.length != 0){
              this.putshippingAddress(this.checkClickParam)
          }
          // console.log('this.addressChooseIndex',this.addressChooseIndex)
          if(this.addressChooseIndex == '-1'){
              this.$Modal.warning({
                  title: "提示",
                  content: '请选择一个收货地址'
              })
              return
          }
          this.setAddress(this.addressChooseIndex)
          this.$Modal.success({
              title: "提示",
              content: "保存成功",
              onOk: () => {
                  this.$parent.$parent.hideAddressModel()
              }
          })
      },
    //增加配送地址
      showCreatAddressModel(){
        console.log(this.$parent, 'one')
        console.log(this.$parent.$parent, 'tow')
        if (this.$parent.$parent.showCreatAddressModel != undefined) {
            this.$parent.$parent.showCreatAddressModel()
        } else {
          this.$parent.showCreatAddressModel()
        }
          
      },
    //导航切换
      menuChoose(name){
          this.menuName = name
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
              this.noAddress = true
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
            // param = {default_status: 1, id: "ca80b89a688d4a4094f7a201ecfddd27"}
            console.log('param',param)
          this.$http.put(...myAPI.putshippingAddress(param))
          .then((response) => {
            if (response.status === 200) {
              this.$Modal.success({
                title: '提示',
                content: response.data.message
              })
            }
          })
          .catch((error) => {
            //   console.log('param22222',param)
            // if (error.response.status === 404) {
            //   console.log(error)
            //   window.location.reload()
            // }
          })
      },
      // ------------------- <=接口------
      // 编辑地址操作
      editAddress (edit) {
        this.catchSession(edit)
        if (this.$parent.$parent.showEditAddressModel !== undefined) {
           this.$parent.$parent.showEditAddressModel()
        } else {
           this.$parent.showEditAddressModel()
        }
        this.bus.$emit('setSession')
      },
      // 选择地址操作
      chooseAddress (choose) {
          this.addressChooseIndex = choose
      },
      // 选择自提地址操作
      chooseSelfLiftingAddress (choose) {
            this.selfaddressChooseIndex = choose
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
        this.checkDefault = []
        for (let i in addressInfos) {
          addressInfos[i].default_status ? this.checkDefault.push(true) : this.checkDefault.push(false)
            // console.log(addressInfos[i].default_status)
            // console.log('ddddd',this.checkDefault)
        }
        this.addressInfo = addressInfos
          // console.log('22222222',addressInfos)
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
        this.$store.commit('setAddress', data)
        if (this.$parent.$parent.getSettlementDate !== undefined) {
          this.$parent.$parent.getSettlementDate()
        }
        
        // this.addressChooseIndex = index

      },

      // 修改默认地址
      checkClick (index) {
            console.log('checkDefault',this.checkDefault)
        // 修改default_status状态
        if (this.checkDefault[index] === false) {
          for (let i in this.checkDefault) {
              console.log('this.addressInfo[i]',this.addressInfo)
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
        this.checkClickParam = param
        console.log('safsafsfsf',param)
        this.putshippingAddress(param)
      },
      getSelfLiftingAddress () { //自提地址
        this.$http.get(myAPI.selfLiftingAddress()).then(res => {
              console.log('111',res.data.addressInfos)
          if (res.data.code === 200) {
              console.log('2222222222222222222',res.data.addressInfos)
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
    height: 515px;
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
      .addressContent{
          cursor: pointer;
      }
    }
    .addressContentBig {
      height: 312px;
      overflow-y: scroll;
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
  }
  .Mfooter{
      position: absolute;
      bottom: -70px;
      left: 50%;
      margin-left: -214px;
  }
  /*滚动条样式*/
  .addressContentBig::-webkit-scrollbar{
      /*滚动条整体样式*/
      width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 2px;
  }
  .addressContentBig::-webkit-scrollbar-thumb{
      /*滚动条里面小方块样式*/
      border-radius: 6px;
      background: #979797;
  }
  .addressContentBig::-webkit-scrollbar-track{
      /*滚动条里面轨道样式*/
      background: transparent;
  }
</style>
