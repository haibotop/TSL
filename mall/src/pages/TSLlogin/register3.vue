<template>
  <div id="register3">
    <XHeader :left-options="headerContent.leftOptions" :title="headerContent.title"></XHeader>
    <flow class="flowBar">
      <flow-state state="1" title="填写手机号" is-done></flow-state>
      <flow-line is-done></flow-line>
      <flow-state state="2" title="输入验证码" is-done></flow-state>
      <flow-line is-done></flow-line>
      <flow-state state="3" title="设置登录密码" is-done></flow-state>
    </flow>
    <div>
      <group class="pw-group">
        <x-input v-model="password" type="password" placeholder="请设置6-16位密码" show-clear>
          <div slot="label" class="label-icon"></div>
        </x-input>
        <x-input v-model="confirmPassword" type="password" placeholder="请确认设置的密码" show-clear>
          <div slot="label" class="label-icon"></div>
        </x-input>
        <x-button class="stepBtn" @click.native="step3Btn" :show-loading="loading">完成</x-button>
      </group>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import * as myAPI from '../../services/API/loginServices.es6'
import * as tools from '../../services/myTool.es6'
import { XHeader, Flow, FlowState, FlowLine, Group, XInput, CheckIcon, XButton, Confirm } from 'vux'

export default {
  name: 'register3',
  components: {
    XHeader,
    Flow,
    FlowState,
    FlowLine,
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
    login (params) {
      this.$http.post(...myAPI.login(params)).then((response) => {
        if (response.data.code === 200) {
          // TODO 注册成功直接登录
          sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
          if (sessionStorage.getItem('pormission')) {
            this.$router.replace({path: sessionStorage.getItem('pormission')})
          } else {
            this.$router.replace({path: '/'})
          }
        } else if (response.data.code === 9999) {
          this.$vux.alert.show({
            content: '服务器繁忙，请稍后再试'
          })
        }
      })
    },
    submitPw (params) {
      // TODO 提交密码
      this.$http.post(...myAPI.regist(params)).then((response) => {
        // 提交密码完成后立即登录
        if (response.data.code === 200) {
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: '密码设置成功!'
          })
          setTimeout(() => {
            let params = {
              mobile: this.phone,
              loginPassword: this.password
            }
            this.login(params)
          }, 1000)
        } else {
        // 跳回登录页面
          this.loading = false
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: response.data.message
          })
          setTimeout(() => {
            this.$router.replace(
              {path: 'signin'}
            )
          })
        }
      })
    },
    step3Btn () {
      if (this.loading) {
        return
      }
      this.loading = false
      if (this.password.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请设置密码'
        })
        this.loading = false
      } else if (!tools.checkPw(this.password)) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请重新设置密码(6-16位字母数字组合)'
        })
        this.loading = false
      } else if (tools.checkPw(this.password)) {
        if (this.confirmPassword === this.password) {
          let params = {
            mobile: this.phone,
            loginPassword: this.password,
            sex: 0
          }
          this.loading = true
          this.submitPw(params)
        } else if (this.confirmPassword.length === 0) {
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: '确认密码(6-16位字母数字组合)'
          })
          this.loading = false
        } else {
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: '两次密码不一致!'
          })
          this.loading = false
        }
      }
    }
  },
  mounted: function () {
    if (this.$store.getters.authsuccess) {
      if (this.$store.getters.phone === '') {
        this.$router.replace({path: 'signup'})
      } else {
        this.phone = this.$store.getters.phone
      }
    } else {
      this.$router.replace({path: 'signup'})
    }
  }
}
</script>
