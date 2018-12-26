<style scoped lang="scss" rel="stylesheet/scss">
    #newPw3{
        padding: 50px 0;
        background: #fafafa;
        .login-title{
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
                width: 650px;
                margin: 0 auto;
                text-align: center;
                .setPaswd,.password{
                    span{
                        display: inline-block;
                        margin-right: 20px;
                        text-align: left;
                        font-size: 16px;
                        vertical-align: middle;
                        color: #333;
                    }
                }
                .password{
                    margin-top: 30px;
                }
                .forget-password{
                    margin-top: 15px;
                    text-align: right;
                }
                .ivu-input-wrapper,input{
                    margin-right: 10px;
                    width: 300px;
                    height: 40px;
                }
                .getYzm{
                    height: 40px;
                }

                .login-footer{
                    margin-top: 60px;
                    .preBtn{
                        margin-right: 20px;
                        width: 200px;
                        height: 50px;
                        font-size: 16px;
                    }
                    .stepBtn{
                        padding-bottom: 8px;
                        width: 200px;
                        height: 50px;
                        font-size: 16px;
                        color:#fff;
                        background-color: #352665;
                    }
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
<div>
<header1></header1>
<header2></header2>
  <div id="newPw3">
      <div class="login-title">
          <div class="login-t">会员 <span class="xiegang"></span> 忘记密码</div>
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
                  <div class="pw-group">
                      <div class="setPaswd">
                          <span>请输入登录密码</span>
                          <Input v-model="password" ref="lgPaswd" style="width: 300px;" type="password" placeholder="请输入您要设置的登录密码" :maxlength=16 />
                      </div>
                      <div class="password">
                          <span>请确认登录密码</span>
                          <Input v-model="confirmPassword" ref="rePaswd" type="password" style="width: 300px;" placeholder="请再输入登录密码" />
                      </div>
                      <div class="login-footer">
                          <Button class="preBtn" @click.native="step2Btn" >上一步</Button>
                          <Button class="stepBtn" @click.native="step3Btn" :show-loading="loading">下一步</Button>
                      </div>
                  </div>
                </div>
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
import {Flow, FlowState, FlowLine, CheckIcon,} from 'vux'
export default {
    name: 'register1',
    components: {
        header1,
        header2,
        vFooter,
        Flow,
        FlowState,
        FlowLine,
        CheckIcon,
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
          this.$router.replace({path:'/newPwSuccess'})
          // }
        } else if (response.data.code === 9999) {
            this.$Modal.warning({
                title: '提示',
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
      //上一步
      step2Btn(){
        this.$router.push({path: '/fgpsw2'})
      },
    step3Btn () {
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.password.length === 0) {
          this.$Modal.warning({
              title: '提示',
              content: '请设置密码',
              onOk: () => {
                  this.$refs.lgPaswd.focus();
              }
          })
        this.loading = false
      } else if (!tools.checkPw(this.password)) {
          this.$Modal.warning({
              title: '提示',
              content: '请重新设置密码(6-16位字母数字组合)',
              onOk: () => {
                  this.$refs.lgPaswd.focus();
              }
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
            this.$Modal.warning({
                title: '提示',
                content: '确认密码(6-16位字母数字组合)',
                onOk: () => {
                    this.$refs.rePaswd.focus();
                }
            })
          this.loading = false
        } else {
            this.$Modal.warning({
                title: '提示',
                content: '两次密码不一致',
                onOk: () => {
                    this.$refs.rePaswd.focus();
                }
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
      this.$router.replace({path: 'fgpsw3'})
    }
  }
}
</script>
