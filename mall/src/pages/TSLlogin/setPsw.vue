<style lang="scss" rel="stylesheet/scss">
#setPsw {
  background: #eee;
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #000;
  }
  input:-ms-input-placeholder{
    color: #000;
  }
  input::-webkit-input-placeholder{
    color: #000;
  }
}
</style>

<template>
  <div id="setPsw">
    <XHeader :left-options="headerContent.leftOptions" :title="headerContent.title"></XHeader>
    <div>请设置登录密码</div>
    <div>
      <group class="pw-group">
        <x-input v-model="password" type="password" placeholder="请设置6-16位登录密码" show-clear>
          <div slot="label" class="label-icon"></div>
        </x-input>
        <x-input v-model="confirmPassword" type="password" placeholder="请确认设置的密码" show-clear>
          <div slot="label" class="label-icon"></div>
        </x-input>
        <x-button class="stepBtn" @click.native="setBtn" :show-loading="loading">完成</x-button>
      </group>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as myAPI from '../../services/API/loginServices.es6'
import { XHeader, Group, XInput, CheckIcon, XButton, Confirm } from 'vux'

export default {
  name: 'setPsw',
  components: {
    XHeader,
    Group,
    XInput,
    CheckIcon,
    XButton,
    Confirm
  },
  data () {
    return {
      headerContent: {
        leftOptions: {
          showBack: true,
          backText: '',
          preventGoBack: false
        },
        rightOptions: {
          showMore: false
        },
        title: '注册'
      },
      loading: false,
      phone: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    setPw (params) {
      this.$http.put(...myAPI.updatePwd(params)).then((response) => {
        if (response.data.code === 200) {
          this.loading = false
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: '设置成功！'
          })
          this.$store.commit('setPw')
          let _url = window.location.protocol + '//' + window.location.host + '/#/setPsw'
          window.history.pushState({}, 0, _url)
          this.$router.replace({path: 'signin'})
        } else {
          this.loading = false
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: response.data.message
          })
        }
      })
    },
    setBtn () {
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.password.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请设置密码'
        })
        this.loading = false
      } else if (this.password.length < 6 || this.password.length > 16) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请输入6-16位密码'
        })
        this.loading = false
      } else if (this.password.length >= 6 && this.password.length <= 16) {
        if (this.confirmPassword === this.password) {
          let user = JSON.parse(sessionStorage.getItem('setPw'))
          let params = {
            phone: user.phone,
            newPwd: this.password
          }
          this.loading = true
          this.setPw(params)
        } else {
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: '两次输入密码不一致!'
          })
          this.loading = false
        }
      }
    }
  }
}
</script>
