<style>
    .addressPlace .ivu-select{
        width: auto;
    }
    .ivu-select-single .ivu-select-selection{
        display: inline-block;
        width: 130px;
    }
    .addressPlace .ivu-select-single .ivu-select-selection .ivu-select-placeholder,.addressPlace  .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
        padding: 0;
        font-size: 14px !important;
    }
    .addressPlace .ivu-select-dropdown{
        font-size: 14px;
    }
</style>
<template>
  <div id="editAddress">
    <p solt="header" style="margin: 10px 0 0 30px; font-size: 24px;color: #352665;text-align: left;">编辑收获地址</p>
    <!--<x-header title="编辑地址" :left-options="{backText: ''}">-->
      <!--<a slot="right" @click="saveAddress()">保存</a></x-header>-->
    <!--</x-header>-->
      <div class="login-cont">
          <div class="addressee">
              <span>收件人</span>
              <Input v-model="personalInfo.name" ref="name" placeholder="请填写收件人"  />
          </div>
          <div class="phoneNum">
              <span>手机号</span>
              <Input v-model="personalInfo.tel" ref="telephone" type="text" :maxlength=11 placeholder="请填写收件人手机号码" />
          </div>
          <div class="addressPlace">
              <span>收货地址</span>
              <template>
                  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="display: inline-block;">
                      <!--<FormItem prop="province" label="省份">-->
                      <Select v-model="formValidate.province || readProvince[0]" placeholder="请选择省份" @on-change="change($event)"  >
                          <Option v-for="item,index in provinceArr" :key="index" :value="item.name" :clearable=true>{{ item.name}}</Option>
                      </Select>
                      <Select ref="select" v-model="formValidate.city || readProvince[1]" placeholder="请选择城市"  @on-change="change2($event)" :clearable=true>
                          <Option v-for="item,index2 in cities" :key="item.name" :value="item.name" >{{ item.name}}</Option>
                      </Select>
                      <Select ref="select_" v-model="formValidate.areaList  || readProvince[2]" placeholder="请选择地区" @on-change="change3($event)" :clearable=true>
                          <Option v-for="item,index3 in areaList" :key="item" :value="item" >{{ item}}</Option>
                      </Select>
                  </Form>
              </template>
          </div>
          <div class="account">
              <span class="discount">备注：</span>
              <Input v-model="personalInfo.street" :maxlength="50" ref="addressXx" placeholder="请填写详细地址，不少于五个字"/>
          </div>
          <div class="defaultPlace">
              <div class="defaultPosition">
                  <check-icon :value.sync="checkIcon" type="plain">设为默认地址</check-icon>
              </div>
          </div>
          <div class="login-footer">
              <Button class="sign" id="signup" @click.native="hideModel" >取消</Button>
              <Button class="login" @click.native="saveAddress" >保存</Button>
          </div>
      </div>
    <!--<group>-->
      <!--<div class="editPersonalInfo">-->
        <!--<x-input placeholder="姓名" v-model="personalInfo.name"></x-input>-->
        <!--<x-input placeholder="手机号码" v-model="personalInfo.tel" type="text" ref="telephone" @on-change="handlePhone"></x-input>-->
        <!--&lt;!&ndash; <x-input placeholder="省，市，区" v-model="personalInfo.province"></x-input> &ndash;&gt;-->
        <!--<x-address title="省,市,区" :list="addressData" :raw-value="true" @on-shadow-change="onShadowChange"-->
          <!--v-model="personalInfo.province.ids"></x-address>-->
        <!--<x-textarea placeholder="请填写详细地址，不少于五个字" type="text" v-model="personalInfo.street"></x-textarea>-->
      <!--</div>-->
    <!--</group>-->
    <!--<div class="defaultPlace">-->
      <!--<div class="defaultPosition">-->
        <!--<check-icon  :value.sync="checkIcon" type="plain">设为默认地址</check-icon>-->
      <!--</div>-->
    <!--</div>-->
      <Button class="deleteBtn" @click.native="deleteAddress" >删除地址</Button>

  </div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, Group, Cell, XButton, CellBox, XInput, CheckIcon, XTextarea, ChinaAddressV3Data, XAddress} from 'vux'
  import {regionList} from '@/pages/me/region'
  import * as myAPI from '@/services/API/mineServices.es6'
  export default{
    name: 'editAddress',
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      CellBox,
      XInput,
      CheckIcon,
      XTextarea,
      XAddress
    },
    data () {
      return {
        checkIcon: false,
        addressData: ChinaAddressV3Data,
        personalInfo: {
          name: '',
          tel: '',
          province: {
            ids: [],
            names: []
          },
          street: '',
          default_status: 0
        },
        sessionAddress: {},
        id: '',
       provinceArr: [],
       cities: "",
       formValidate:{},
       ruleValidate:{},
       areaList:[],
       provinceItem:[],
       readProvince:[],
      }
    },
      // updated(){
      //     this.getAddress()
      // },
    mounted () {
      //获取最新地址和id
      this.bus.$on('setSession',()=>{
          this.getAddress()
          this.id = this.sessionAddress.id
      })
        if(this.sessionAddress.id != undefined){
            this.getAddress()
        }
      // 删除地址param
      this.id = this.sessionAddress.id
      //读取省市区数据
      this.provinceArr = regionList
    },
    methods: {
        // 隐藏编辑收获地址
        hideModel(){
            this.$emit('hideModelEdit')
        },
        //选择省
        change(val){
            this.$refs.select.clearSingleSelect();
            this.$refs.select_.clearSingleSelect();
            this.provinceItem[0] = val;
            this.cities=[]
            this.areaList = []
            for(var i=0; i<this.provinceArr.length; i++){
                if(val == this.provinceArr[i].name ){
                    // console.log('this.provinceArr[i].name',this.provinceArr[i].name)
                    this.cities = this.provinceArr[i].cityList;
                }
            }
        },
        //选择市
        change2(val){
            this.provinceItem[1] = val;
            this.$refs.select_.clearSingleSelect();
            for(var i=0; i<this.cities.length; i++){
                if(val == this.cities[i].name ){
                    this.areaList = this.cities[i].areaList;
                }
            }
        },
        //选择地区
        change3(val){
            this.provinceItem = this.personalInfo.province.str
            // console.log('this.provinceItem',this.provinceItem)
            this.provinceItem[2] = val;
            let i = this.provinceItem
            let a = ''
            a = `${i[0]}${i[1]}${i[2]}`
            this.datailAddress = a
            this.personalInfo.province.str = `${i[0]}${i[1]}${i[2]}`
            // this.datailAddress = this.personalInfo.province.str
        },
      warnningTips () {
        let p = this.personalInfo
          if (p.name === '') {
              this.$Modal.warning({
                  title: '提示',
                  content: '姓名不能为空',
                  onOk: () => {
                      this.$refs.name.focus()
                  }
              });
              return
          }
          if (p.name.length > 12) {
              this.$Modal.warning({
                  title: '提示',
                  content: '姓名不能超过12个字',
                  onOk: () => {
                      this.$refs.name.focus()
                  }
              });
              return
          }
          if (p.tel === '') {
              this.$Modal.warning({
                  title: '提示',
                  content: '请输入手机号码',
                  onOk: () => {
                      this.$refs.telephone.focus()
                  }
              });
              return
          }
          if (p.tel.length !== 11) {
              this.$Modal.warning({
                  title: '提示',
                  content: '请输入11位手机号码',
                  onOk: () => {
                      this.$refs.telephone.focus()
                  }
              });
              return
          }
          if (this.provinceItem[2] == undefined) {
              this.$Modal.warning({
                  title: '提示',
                  content: '请输入省市区',
              });
              return
          }
          if (p.street === '') {
              this.$Modal.warning({
                  title: '提示',
                  content: '请输入详细地址',
                  onOk: () => {
                      this.$refs.addressXx.focus()
                  }
              });
              return
          }
          if (p.street.length < 5) {
              this.$Modal.warning({
                  title: '提示',
                  content: '详细地址不能少于5个字',
                  onOk: () => {
                      this.$refs.addressXx.focus()
                  }
              });
              return
          }
          if (p.street.length > 30) {
              this.$Modal.warning({
                  title: '提示',
                  content: '详细地址不可超出30个字符',
                  onOk: () => {
                      this.$refs.addressXx.focus()
                  }
              });
              return
          }
        return true
      },
      saveAddress () {
        if (this.warnningTips()) {
          // console.log(this.personalInfo)
          // 默认修改
          if (this.checkIcon === true) {
            this.personalInfo.default_status = 1
          } else if (this.checkIcon === false) {
            this.personalInfo.default_status = 0
          }
          // 收集修改数据
          let param = {
            id: JSON.parse(sessionStorage.getItem('addressInfo')).id,
            default_status: this.personalInfo.default_status,
            receiverName: this.personalInfo.name,
            receiverMobile: this.personalInfo.tel,
            receiverAddress: this.personalInfo.province.str + this.personalInfo.street
          }
          // console.log('param',param)
          this.$http.put(...myAPI.putshippingAddress(param))
            .then((response) => {
                // console.log('response',response)
              if (response.status === 200) {
                  this.$parent.$parent.getSettlementDate()
                  this.$Modal.success({
                      title: '提示',
                      content: response.data.message,
                      onOk: () =>{
                          this.$parent.$parent.hideModelEdit()
                          this.bus.$emit("fun")
                      }
                  });
                // setTimeout(() => {
                //   this.$router.replace({path: '/addressList'})
                // }, 300)
              }
            })
            // .catch((error) => {
            //   if (error.response.status === 404) {
            //     console.log(error)
            //     window.location.reload()
            //   }
            // })
        }
      },
      getAddress () {
        let b = sessionStorage.getItem('addressInfo')
          // console.log('bbbbbbbb',b)
        this.sessionAddress = JSON.parse(b)
        this.personalInfo.name = this.sessionAddress.receiverName
        this.personalInfo.tel = this.sessionAddress.receiverMobile
        // console.log('this.sessionAddress',this.sessionAddress)
        this.detailAddress()
        if (this.sessionAddress.default_status === 0) {
          this.checkIcon = false
          this.personalInfo.default_status = this.sessionAddress.default_status
        } else if (this.sessionAddress.default_status === 1) {
          this.checkIcon = true
          this.personalInfo.default_status = this.sessionAddress.default_status
        }
      },
      detailAddress () {
        let a = this.sessionAddress.receiverAddress
        // console.log(a)
        let b = this.addressData
       // console.log('bbbbbb',b)
        let arr = []
        let str
        for (let i = 0; i < b.length; i++) {
          if (a.search(b[i].name) !== -1) {
            arr.push(b[i].name)
          }
        }
        if (arr.length > 2) {
          arr = arr.slice(0, 3)
          // console.log(1)
          str = `${arr[0]}${arr[1]}${arr[2]}`
        } else {
          arr = arr.slice(0, 2)
          // console.log(2)
          arr.push('--')
          str = `${arr[0]}${arr[1]}`
        }
        // console.log('arrrrrrrrr',arr)
        this.readProvince = arr
        this.personalInfo.province.str = arr
        //初始化省市区数据
        for(var i=0; i<this.provinceArr.length; i++){
            if(arr[0] == this.provinceArr[i].name ){
                // console.log('this.provinceArr[i].name',this.provinceArr[i].name)
                this.cities = this.provinceArr[i].cityList;
            }
        }
        for(var i=0; i<this.cities.length; i++){
            if(arr[1] == this.cities[i].name ){
                this.areaList = this.cities[i].areaList;
            }
        }
        // console.log('this.readProvince', this.provinceItem)
        // console.log('test', arr)
        // console.log(a)
        // 判断存在?
        // console.log(a.indexOf(str))
        let detailaddress = a.slice(str.length)
        // console.log(detailaddress)
        this.personalInfo.province.ids = arr
//        this.personalInfo.province.names = arr
        this.personalInfo.street = detailaddress
      },
      // 删除地址
      deleteAddress () {
        this.$Modal.warning({
          title: '提示',
          content: '是否确定删除该地址',
          onOk: () => {
              // sessionStorage.setItem('addressInfo',null)
            this.$http.delete(myAPI.deleteshippingAddress(this.id))
              .then((response) => {
                if (response.status === 200) {
                    this.bus.$emit('deleteAddress11')
                    this.bus.$emit('fun')
                    this.$parent.$parent.hideModelEdit()
                  this.$defaultServiceTip.success(response)
                    alert('删除成功')
                  // this.$Modal.success({
                  //   title: '提示',
                  //   content: '删除成功'
                  // })
                  // setTimeout(() => {
                  //   // this.$router.replace({path: 'ManageAddress'})
                  //   this.$router.go(-1)
                  // }, 500)
                }
                console.log(response)
              })
          }
        })
      },
      // 手机号码规则处理
      handlePhone (val) {
        if (val) {
          let arr = val.match(/[0-9]/g)
          if (arr) {
            this.personalInfo.tel = arr.join('')
            this.$refs.telephone.reset(arr.join(''))
          } else {
            this.personalInfo.tel = ''
            this.$refs.telephone.reset('')
          }
        }
      },
      onShadowChange (ids, names) {
        this.personalInfo.province.names = names
        console.log(names)
        console.log(ids)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #editAddress {
      .login-cont{
          width: 650px;
          margin: 50px auto 30px;
          text-align: center;
          .addressee,.phoneNum,.addressPlace,.account{
              span{
                  display: inline-block;
                  margin-right: 20px;
                  width: 80px;
                  text-align: left;
                  font-size: 16px;
                  vertical-align: text-bottom;
                  color: #333;
              }
              .ivu-input-wrapper,input{
                  width: 400px;
                  height: 40px;
              }
          }
          .phoneNum,.addressPlace,.discount{
              margin-top: 30px;
          }
          .login-footer{
              margin-top: 75px;
              .sign{
                  margin-right: 30px;
                  width: 200px;
                  height: 50px;
                  font-size: 16px;
              }
              .login{
                  padding-bottom: 8px;
                  width: 200px;
                  height: 50px;
                  font-size: 16px;
                  color:#fff;
                  background-color: #352665;
              }
          }
      }
    .deleteBtn {
        margin-left: 27%;
        margin-bottom: 20px;
        width: 45%;
        height: 50px;
        background-color: #352665;
        color: #fff;
        font-size: 14px;
    }
    .defaultPlace {
      margin-top: 20px;
      position: relative;
      .defaultPosition{
        position: absolute;
        left: 40%;
      }
    }
    .editPersonalInfo{
      .weui-cell:before {
        left: 0;
      }
    }
  }
</style>
