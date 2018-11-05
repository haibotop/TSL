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
  <div id="CreateAddress">
      <p solt="header" style="margin: 10px 0 0 30px; font-size: 24px;color: #352665;text-align: left;">添加收获地址</p>
      <!--<a slot="right" @click="saveAddress()">保存</a></x-header>-->
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
                          <Select ref="select11" v-model="formValidate.province" placeholder="请选择城市" @on-change="change($event)" :clearable=true>
                              <Option v-for="item,index in provinceArr" :key="index" :value="item.name">{{ item.name}}</Option>
                          </Select>
                          <Select ref="select" v-model="formValidate.city" placeholder="请选择省份"  @on-change="change2($event)" :clearable=true>
                              <Option v-for="item,index2 in cities" :key="item.name" :value="item.name" >{{ item.name}}</Option>
                          </Select>
                          <Select ref="select_" v-model="formValidate.areaList" placeholder="请选择地区" @on-change="change3($event)" :clearable=true>
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
    <!--<group class="newAddress">-->
      <!--<x-input placeholder="姓名" type="text" ref="name" v-model="personalInfo.name"></x-input>-->
      <!--<x-input placeholder="手机号码" type="text" v-model="personalInfo.tel" ref="telephone" @on-change="handlePhone"></x-input>-->
      <!--<x-address title="省,市,区" :list="addressData" :raw-value="true" @on-shadow-change="onShadowChange"-->
                 <!--v-model="personalInfo.province.ids"></x-address>-->
      <!--<x-textarea placeholder="请填写详细地址，不少于五个字" type="text" v-model="personalInfo.street"></x-textarea>-->
    <!--</group>-->

  </div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, Group, XInput, XAddress, ChinaAddressV3Data, CheckIcon, Alert, XTextarea} from 'vux'
  import {regionList} from '@/pages/me/region'
  import * as myAPI from '@/services/API/mineServices.es6'
  export default{
    name: 'CreateAddress',
    components: {
      XHeader,
      Group,
      XInput,
      XAddress,
      CheckIcon,
      Alert,
      XTextarea
    },
    data () {
      return {
        addressData: ChinaAddressV3Data,
        checkIcon: true,
        personalInfo: {
          name: '',
          tel: '',
          telNull: false,
          province: {
            ids: [],
            names: [],
            str: ''
          },
          street: ''
        },
        datailAddress: '',
        params: {
          default_status: 1,
          memberId: '',
          receiverAddress: '',
          receiverMobile: '',
          receiverName: ''
        },
        default_status: 0,
        // saveLoading: false,
        provinceArr: [],
        cities: "",
        formValidate:{},
        ruleValidate:{},
        areaList:[],
        provinceItem:[]
      }
    },
    methods: {
        //取消保存
        hideModel(){
            this.$emit('hideModelCreat')
        },
        //选择省
        change(val){
            console.log('sfdsf',val)
            this.$refs.select.clearSingleSelect();
            this.$refs.select_.clearSingleSelect();
            this.provinceItem[0] = val;
            this.cities=[]
            this.areaList = []
            for(var i=0; i<this.provinceArr.length; i++){
                if(val == this.provinceArr[i].name ){
                    console.log('this.provinceArr[i].name',this.provinceArr[i].name)
                    this.cities = this.provinceArr[i].cityList;
                }
            }
            // console.log('this.cities',this.cities)
        },
        //选择市
        change2(val){
            // console.log('xxxxxxxxxxxxxxxxxxx',this.formValidate)
            this.provinceItem[1] = val;
            this.$refs.select_.clearSingleSelect();
            for(var i=0; i<this.cities.length; i++){
                if(val == this.cities[i].name ){
                    this.areaList = this.cities[i].areaList;
                    // console.log('dsfdsg',this.areaList)
                }
            }
            console.log(this.provinceItem)
        },
        //选择地区
        change3(val){
            this.provinceItem[2] = val;
            let i = this.provinceItem
            this.personalInfo.province.str = `${i[0]}${i[1]}${i[2]}`
            this.datailAddress = this.personalInfo.province.str
            console.log(this.datailAddress)
        },

      foucs () {
        this.$refs.name.focus()
      },
      // 地址内容处理 + 是否默认
      detailAddress () {
        this.datailAddress = this.personalInfo.province.str + this.personalInfo.street
        console.log(this.datailAddress)
        console.log(this.checkIcon)
        if (this.checkIcon) {
          this.default_status = 1
        } else {
          this.default_status = 0
        }
        console.log(this.default_status)
      },
      // 保存
      saveAddress () {
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
        // if (this.saveLoading === false) {
          this.detailAddress()
          this.getParams()
        // }
        // this.saveLoading = true
      },
      // 省市区内容处理
      // onShadowChange (ids, names) {
      //   this.personalInfo.province.names = names
      //   let i = this.personalInfo.province.names
      //   this.personalInfo.province.str = `${i[0]}${i[1]}${i[2]}`
      //   console.log('xxxxxxxxxxx',this.personalInfo.province.str)
      // },
      // 存值注入params
      getParams () {
        this.params.receiverName = this.personalInfo.name
        this.params.receiverMobile = this.personalInfo.tel
        this.params.receiverAddress = this.personalInfo.province.str + this.personalInfo.street
        this.params.default_status = this.default_status
        this.postAddress(this.params)
      },
      // 提交保存收货信息
      postAddress (params) {
        this.params.memberId = JSON.parse(sessionStorage.getItem('userInfo')).memberId
        console.log(this.params)
        this.$http.post(...myAPI.postshippingAddress(params))
          .then((response) => {
              console.log('reee',response)
            if (response.status === 200) {
                this.$parent.$parent.getSettlementDate()
                this.bus.$emit('addNewAddress')
                this.$Modal.success({
                    title: '提示',
                    content: response.data.message,
                    onOk: ()=>{
                        this.hideModel()
                        this.personalInfo.name = ''
                        this.personalInfo.tel = ''
                        this.personalInfo.province.str = ''
                        this.personalInfo.street = ''
                        this.$refs.select.clearSingleSelect();
                        this.$refs.select_.clearSingleSelect();
                        this.$refs.select11.clearSingleSelect();
                    }
                });
              // setTimeout(() => {
              //    this.$router.replace({path: '/addressList'})
              //   this.$router.go(-1)
              // }, 1000)
            }
          })
          .catch((error) => {
              console.log(error)
            if (error.response.data.status === 500) {
                this.$Modal.warning({
                    title: '提示',
                    content: '服务器错误,请重试'
                });
              setTimeout(() => {
                window.location.reload()
              }, 500)
            }
            if (error.response.status === 404) {
                this.$Modal.show({
                    title: '提示',
                    content: '添加失败请重试'
                });
            } else {
                this.$Modal.show({
                    title: '提示',
                    content: error.response.data.message
                });
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
      }
    },
   mounted(){
       //读取省市区数据
       this.provinceArr = regionList
       this.foucs()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #CreateAddress {
    .login-cont{
        width: 650px;
        margin: 50px auto;
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
    .defaultPlace {
      margin-top: 20px;
      position: relative;
      .defaultPosition{
        position: absolute;
        left: 40%;
      }
    }
  }
  .newAddress {
    .weui-cells:before {
      margin-top: 0%;
    }
    .weui-label{
      color: #7f7f7f;
    }
  }
</style>
