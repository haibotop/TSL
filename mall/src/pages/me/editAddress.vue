<template>
  <div id="editAddress">
    <x-header title="编辑地址" :left-options="{backText: ''}">
      <a slot="right" @click="saveAddress()">保存</a></x-header>
    </x-header>
    <group>
      <div class="editPersonalInfo">
        <x-input placeholder="姓名" v-model="personalInfo.name"></x-input>
        <x-input placeholder="手机号码" v-model="personalInfo.tel" type="text" ref="telephone" @on-change="handlePhone"></x-input>
        <!-- <x-input placeholder="省，市，区" v-model="personalInfo.province"></x-input> -->
        <x-address title="省,市,区" :list="addressData" :raw-value="true" @on-shadow-change="onShadowChange"
          v-model="personalInfo.province.ids"></x-address>
        <x-textarea placeholder="请填写详细地址，不少于五个字" type="text" v-model="personalInfo.street"></x-textarea>
      </div>
    </group>
    <div class="defaultPlace">
      <div class="defaultPosition">
        <check-icon  :value.sync="checkIcon" type="plain">设为默认地址</check-icon>
      </div>
    </div>
    <Group class="deleteBtn">
      <x-button @click.native="deleteAddress">删除地址</x-button>
    </Group>
  </div>
</template>
<script type="text/ecmascript-6">
  import {XHeader, Group, Cell, XButton, CellBox, XInput, CheckIcon, XTextarea, ChinaAddressV3Data, XAddress} from 'vux'
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
        id: ''
      }
    },
    mounted () {
      this.getAddress()
      // 删除地址param
      this.id = this.sessionAddress.id
    },
    methods: {
      warnningTips () {
        let p = this.personalInfo
        if (p.name === '') {
          this.$vux.toast.show({
            text: '请输入姓名',
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
            text: '手机号码格式不正确',
            type: 'text',
            width: '200px'
          })
          return
        }
        if (p.province === '') {
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
        return true
      },
      saveAddress () {
        if (this.warnningTips()) {
          console.log(this.personalInfo)
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
            receiverAddress: this.personalInfo.province.names.join('') + this.personalInfo.street
          }
          console.log(param)
          this.$http.put(...myAPI.putshippingAddress(param))
            .then((response) => {
              if (response.status === 200) {
                this.$vux.toast.show({
                  text: response.data.message
                })
                setTimeout(() => {
                  this.$router.replace({path: '/addressList'})
                }, 300)
              }
            })
            .catch((error) => {
              if (error.response.status === 404) {
                console.log(error)
                window.location.reload()
              }
            })
        }
      },
      getAddress () {
        let b = sessionStorage.getItem('addressInfo')
        this.sessionAddress = JSON.parse(b)
        this.personalInfo.name = this.sessionAddress.receiverName
        this.personalInfo.tel = this.sessionAddress.receiverMobile
        console.log(this.sessionAddress)
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
        console.log(a)
        let b = this.addressData
        let arr = []
        let str
        for (let i = 0; i < b.length; i++) {
          if (a.search(b[i].name) !== -1) {
            arr.push(b[i].name)
          }
        }
        if (arr.length > 2) {
          arr = arr.slice(0, 3)
          console.log(1)
          str = `${arr[0]}${arr[1]}${arr[2]}`
        } else {
          arr = arr.slice(0, 2)
          console.log(2)
          arr.push('--')
          str = `${arr[0]}${arr[1]}`
        }
        console.log('test', arr)
        console.log(a)
        // 判断存在?
        console.log(a.indexOf(str))
        let detailaddress = a.slice(str.length)
        console.log(detailaddress)
        this.personalInfo.province.ids = arr
//        this.personalInfo.province.names = arr
        this.personalInfo.street = detailaddress
      },
      // 删除地址
      deleteAddress () {
        this.$vux.confirm.show({
          content: '是否确定删除该地址',
          onConfirm: () => {
            this.$http.delete(myAPI.deleteshippingAddress(this.id))
              .then((response) => {
                if (response.status === 200) {
                  this.$defaultServiceTip.success(response)
                  this.$vux.toast.show({
                    text: '删除成功',
                    type: 'success'
                  })
                  setTimeout(() => {
                    // this.$router.replace({path: 'ManageAddress'})
                    this.$router.go(-1)
                  }, 500)
                }
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
    .deleteBtn {
      margin: 280px 0 0 18px;
      width: 90%;
      .weui-btn_default{
        background-color: $tsl-color;
        color: #ffffff;
      }
    }
    .defaultPlace {
      margin-top: 20px;
      position: relative;
      .defaultPosition{
        position: absolute;
        left: 30%;
      }
    }
    .editPersonalInfo{
      .weui-cell:before {
        left: 0;
      }
    }
  }
</style>
