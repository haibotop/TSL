<style lang="scss" rel="stylesheet/scss">
    #register3 {
        padding-bottom: 40px;
        background: #fafafa;
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #9c9c9c;
        }
        input:-ms-input-placeholder{
            color: #9c9c9c;
        }
        input::-webkit-input-placeholder{
            color: #9c9c9c;
        }
        .login-title{
            margin-top: 50px;
            height: 80px;
            text-align: center;
            .login-t{
                position: relative;
                display: inline-block;
                text-align: center;
                font-size: 20px;
                color: #0F0F0F;
            }
            .login-t:after{
                content: '';
                position: absolute;
                bottom: -20px;
                left: 50%;
                margin-left: -20px;
                display: inline-block;
                width: 40px;
                height: 2px;
                background-color: #504379;
            }
        }
        .login-content{
            margin: 0 10%;
            padding: 80px 0;
            width: 80%;
            background: #fff;
            .login-cont{
                width: 385px;
                margin: 0 auto;
                text-align: center;
            }
        }
        .xiegang:after{
            content: '';
            position: relative;
            top: 8px;
            margin: 0 15px;
            display: inline-block;
            width: 1px;
            height: 30px;
            background-color: #2E0F6E;
            transform: rotate(30deg);
        }
    }
</style>
<template>
  <div id="register3">
      <header1></header1>
      <header2></header2>
      <div class="login-title">
          <div class="login-t">普通用户 <span class="xiegang"></span> 注册</div>
      </div>
      <div class="login-content">
          <div class="login-cont">
    <!--<flow class="flowBar">-->
      <!--<flow-state state="1" title="填写手机号" is-done></flow-state>-->
      <!--<flow-line is-done></flow-line>-->
      <!--<flow-state state="2" title="输入验证码" is-done></flow-state>-->
      <!--<flow-line is-done></flow-line>-->
      <!--<flow-state state="3" title="设置登录密码" is-done></flow-state>-->
    <!--</flow>-->
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
      </div>
      <v-footer></v-footer>
  </div>
</template>
<script type="text/ecmascript-6">
    import header1 from '../homePages/header1'
    import header2 from '../homePages/header2'
    import vFooter from '../homePages/footer.vue'
import * as myAPI from '../../services/API/loginServices.es6'
import * as tools from '../../services/myTool.es6'
import { XHeader, Flow, FlowState, FlowLine, Group, XInput, CheckIcon, XButton, Confirm } from 'vux'

export default {
  name: 'register3',
  components: {
      header1,
      header2,
      vFooter,
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
