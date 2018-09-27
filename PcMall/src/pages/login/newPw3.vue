<style lang="scss" rel="stylesheet/scss">
    #newPw3{
        padding-bottom: 40px;
        background: #fafafa;
        .login-title{
            margin-top: 50px;
            height: 100px;
            text-align: center;
            .login-t{
                position: relative;
                display: inline-block;
                text-align: center;
                font-size: 21px;
                color: #111;
            }
            .login-t:after{
                content: '';
                position: absolute;
                bottom: -33px;
                left: 50%;
                margin-left: -20px;
                display: inline-block;
                width: 44px;
                height: 3px;
                background-color: #504379;
            }
        }

        .login-content{
            margin: 0 10%;
            padding-bottom: 80px;
            width: 80%;
            background: #fff;
            .login-cont{
                width: 510px;
                margin: 0 auto;
                text-align: center;
                .pin-group{
                    span.yzm{
                        display: inline-block;
                        margin-right: 20px;
                        width: 60px;
                        text-align: left;
                        font-size: 16px;
                        vertical-align: middle;
                        color: #333;
                    }
                }
                .ivu-input-wrapper,input{
                    margin-right: 10px;
                    width: 290px;
                    height: 40px;
                }
                .getYzm{
                    height: 40px;
                }
                .stepBtn{
                    margin-top: 80px;
                    width: 200px;
                    height: 50px;
                    color:#fff;
                    background-color: #352665;
                }
                //去掉Input[type='number']上下
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                }
                input[type="number"]{
                    -moz-appearance: textfield;
                }
            }
            // 进度条
            .flowBar {
                margin-bottom: 70px;
                padding-top: 70px;
                .weui-wepay-flow__bd {
                    width: 100%;
                    margin: 0 auto;
                    height: 2px;
                }
                .weui-wepay-flow__li {
                    width: 20px;
                    height: 20px;
                }
                .weui-wepay-flow__li .weui-wepay-flow__state {
                    width: 20px;
                    height: 20px;
                    line-height: 16px;
                    border: 2px solid #B7B7B7;
                    border-radius: 50%;
                    background-color: #fff;
                    color: #B7B7B7;
                }
                .weui-wepay-flow__li_done .weui-wepay-flow__state {
                    line-height: 20px;
                    border: none;
                    background-color: #352665;
                    color: #fff;
                }
                .weui-wepay-flow__line {
                    height: 2px;
                    background-color: #B7B7B7;
                }
                .weui-wepay-flow__line_done .weui-wepay-flow__process {
                    background-color: #352665;
                }
                .weui-wepay-flow__title-bottom,
                .weui-wepay-flow__li_done .weui-wepay-flow__title-bottom {
                    color: #7F7F7F;
                }
                .weui-wepay-flow__title-bottom {
                    width: 100px;
                    margin: auto 10px;
                }
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
  <div id="newPw3">
      <header1></header1>
      <header2></header2>
      <div class="login-title">
          <div class="login-t">普通用户 <span class="xiegang"></span> 忘记密码</div>
      </div>
      <div class="login-content">
          <div class="login-cont">
                <flow class="flowBar">
                  <flow-state state="1" title="填写手机号" is-done></flow-state>
                  <flow-line is-done></flow-line>
                  <flow-state state="2" title="输入验证码" is-done></flow-state>
                  <flow-line is-done></flow-line>
                  <flow-state state="3" title="设置登录密码" is-done></flow-state>
                </flow>

                <div>
                  <group class="pw-group">
                    <x-input v-model="password" type="password" placeholder="请输入6-16位密码" show-clear>
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
  name: 'newPw3',
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
        title: '找回密码'
      },
      loading: false,
      phone: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    // 登录
    login (params) {
      this.$http.post(...myAPI.login(params)).then((response) => {
        if (response.data.code === 200) {
          // TODO 注册成功直接登录
          sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
          // if (sessionStorage.getItem('pormission')) {
          //   this.$router.replace({path: sessionStorage.getItem('pormission')})
          // } else {
          this.$router.replace({path: '/'})
          // }
        } else if (response.data.code === 9999) {
          this.$vux.alert.show({
            content: '服务器繁忙，请稍后再试'
          })
        }
      })
    },
    // 提交密码
    submitPw (params) {
      // TODO 提交密码
      this.$http.put(...myAPI.updatePwd(params)).then((response) => {
        if (response.data.code === 200) {
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: '密码设置成功!'
          })
          let params = {
            mobile: this.phone,
            loginPassword: this.password
          }
          this.login(params)
        }
        this.$store.commit('clearnPhone')
        this.$store.commit('authDel')
      }).catch(() => {
        this.loading = false
      })
    },
    step3Btn () {
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
            phone: this.$store.getters.phone,
            newPwd: this.password
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
        this.$router.replace({path: 'fgpsw'})
      } else {
        this.phone = this.$store.getters.phone
      }
    } else {
      this.$router.replace({path: 'fgpsw'})
    }
  }
}
</script>
