<template>
  <div id="CreateAddress">
    <x-header title="新增地址" :left-options="{backText: ''}">
      <a slot="right" @click="saveAddress()">保存</a></x-header>
    <group class="newAddress">
      <x-input placeholder="姓名" type="text" ref="name" v-model="personalInfo.name"></x-input>
      <x-input placeholder="手机号码" type="text" v-model="personalInfo.tel" ref="telephone" @on-change="handlePhone"></x-input>
      <x-address title="省,市,区" :list="addressData" :raw-value="true" @on-shadow-change="onShadowChange"
                 v-model="personalInfo.province.ids"></x-address>
      <x-textarea placeholder="请填写详细地址，不少于五个字" type="text" v-model="personalInfo.street"></x-textarea>
    </group>
    <div class="defaultPlace">
      <div class="defaultPosition">
        <check-icon :value.sync="checkIcon" type="plain">设为默认地址</check-icon>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, Group, XInput, XAddress, ChinaAddressV3Data, CheckIcon, Alert, XTextarea} from 'vux'
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
        saveLoading: false
      }
    },
    mounted () {
      this.foucs()
    },
    methods: {
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
          this.$vux.toast.show({
            text: '姓名不能为空',
            type: 'text',
            width: '200px'
          })
          return
        }
        if (p.name.length > 12) {
          this.$vux.toast.show({
            text: '姓名不能超过12个字',
            type: 'text',
            width: '200px'
          })
          return
        }
        if (p.tel === '') {
          this.$vux.toast.show({
            text: '请输入手机号码',
            type: 'text',
            width: '200px'
          })
          return
        }
        if (p.tel.length !== 11) {
          this.$vux.toast.show({
            text: '请输入11位手机号码',
            type: 'text',
            width: '200px'
          })
          return
        }
        if (p.province.ids.length === 0) {
          this.$vux.toast.show({
            text: '请输入省市区',
            type: 'text',
            width: '200px'
          })
          return
        }
        if (p.street === '') {
          this.$vux.toast.show({
            text: '请输入详细地址',
            type: 'text',
            width: '200px'
          })
          return
        }
        if (p.street.length < 5) {
          this.$vux.toast.show({
            text: '详细地址不能少于5个字',
            type: 'warn',
            width: '200px'
          })
          return
        }
        if (p.street.length > 30) {
          this.$vux.toast.show({
            text: '详细地址不可超出30个字符',
            type: 'text',
            width: '200px'
          })
          return
        }
        if (this.saveLoading === false) {
          this.detailAddress()
          this.getParams()
        }
        this.saveLoading = true
      },
      // 省市区内容处理
      onShadowChange (ids, names) {
        this.personalInfo.province.names = names
        let i = this.personalInfo.province.names
        this.personalInfo.province.str = `${i[0]}${i[1]}${i[2]}`
        console.log(this.personalInfo.province.str)
      },
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
            if (response.status === 200) {
              this.$vux.toast.show({
                text: response.data.message,
                type: 'success'
              })
              setTimeout(() => {
                // this.$router.replace({path: '/addressList'})
                this.$router.go(-1)
              }, 1000)
            }
          })
          .catch((error) => {
            if (error.response.data.status === 500) {
              this.$vux.toast.show({
                text: '服务器错误,请重试',
                type: 'text',
                width: '200px'
              })
              setTimeout(() => {
                window.location.reload()
              }, 500)
            }
            if (error.response.status === 404) {
              this.$vux.toast.show({
                text: '添加失败请重试',
                type: 'warn'
              })
            } else {
              this.$vux.toast.show({
                text: error.response.data.message,
                type: 'warn'
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
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #CreateAddress {
    .defaultPlace {
      margin-top: 20px;
      position: relative;
      .defaultPosition{
        position: absolute;
        left: 30%;
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
