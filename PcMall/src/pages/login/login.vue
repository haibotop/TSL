<style scoped lang="scss" rel="stylesheet/scss">
#login {
  padding: 50px 0;
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
            width: 650px;
            margin: 0 auto;
            text-align: center;
            .phoneNum,.password{
                span{
                    display: inline-block;
                    margin-right: 20px;
                    width: 60px;
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
            .password{
                margin-top: 30px;
            }
            .forget-password{
                margin-top: 15px;
                margin-right: 80px;
                text-align: right;
            }
            .login-footer{
                margin-top: 60px;
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
  <div id="login">
      <div class="login-title">
          <div class="login-t">普通用户 <span class="xiegang"></span> 登录</div>
      </div>
      <div class="login-content">
          <div class="login-cont">
              <div class="phoneNum">
                  <span>手机号</span>
                  <Input v-model="account" ref="numInput" placeholder="请输入您的手机号码" :maxlength=11  @on-change="handlePhone" />
              </div>
              <div class="password">
                  <span>密码</span>
                  <Input v-model="password" ref="pwdInput" type="password" placeholder="请输入您的密码" />
              </div>
              <div class="forget-password">
                  <a href="/#/fgpsw" class="newPw-btn">忘记密码？</a>
              </div>
              <div class="login-footer">
                  <Button class="sign" id="signup" @click.native="toSignup" >注册</Button>
                  <Button class="login" @click.native="loginBtn" :show-loading="loading" >登录</Button>
              </div>
              <Modal v-model="model1" footerHide style="width: 850px;height: 300px;" :styles="{top: '355px'}">
                  <p solt="header" style="font-size: 24px;color: #352665;text-align: left;margin-left: 30px;">提示</p>
                  <p style="margin: 50px 0; font-size: 16px;color: #111;text-align: center;">您填写的手机号未注册为手机会员</p>
                  <div  style="margin: 30px 0; text-align: center;" >
                      <Button @click.native="reWrite" style="margin-right: 30px; width: 200px;height: 50px;font-size: 16px;">重新填写</Button>
                      <Button @click.native="signBtn" style="width: 200px;height: 50px;font-size: 16px; background-color: #352665;color: #fff;">注册</Button>
                  </div>
              </Modal>
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
      index: 0,
      loading: false,
      account: '',
      password: '',
      userId: '',
      isWeChat: false,
      model1: false,
    }
  },
  methods: {
    getUrlParam () {
      let url = window.location.href
      let obj = {}
      let arr = []
      if (url.indexOf('?') !== -1) {
        let str = url.substr(url.indexOf('?') + 1)
        arr = str.split('&')
        for (let i in arr) {
          obj[arr[i].split('=')[0]] = unescape(arr[i].split('=')[1])
        }
      }
      return obj
    },
    handlePhone(){
      var val = this.account;
      console.log(val)
        this.userId = val.replace(/[^0-9]/g, '')
    },
    logout () {
      this.$http.delete(myAPI.logout())
    },
    loginTsl () {
      if (this.isWeChat) {
        this.getAuthUrl(document.URL, (res) => {
          window.location.href = res.data.authUrl
        })
      } else {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '该功能仅限微信端进入TSL会员使用!'
        })
      }
    },
    toSignup () {
      this.$router.push({path: '/signup'})
    },
    loginBtn () {
      if (this.userId.length === 0) {
          this.$Modal.warning({
              title: '提示',
              content: '请填写手机号码',
              onOk: () => {
                  this.$refs.numInput.focus()
              }
          });
      } else if (this.userId.length !== 11) {
          this.$Modal.warning({
              title: '提示',
              content: '请输入正确的手机号码',
              onOk: () => {
                  this.$refs.numInput.focus()
              }
          });
      } else if (this.userId.length === 11) {
        if (this.password.length === 0) {
            this.$Modal.warning({
                title: '提示',
                content: '请输入密码',
                onOk: () => {
                    this.$refs.pwdInput.focus()
                }
            });
        } else if (this.password.length < 6 || this.password.length > 16) {
            this.$Modal.warning({
                title: '提示',
                content: '用户名或密码错误',
                onOk: () => {
                    this.$refs.numInput.focus()
                }
            });
        } else if (this.password.length >= 6 && this.password.length <= 16) {
          let param = {
            loginPassword: this.password,
            mobile: this.userId,
            type: 0
          }
          this.login(param, (userInfo) => {
            // userInfo
          })
        }
      }
    },
    // ========================= API =======================
    login (param, callback) {
      if (navigator.onLine) {
        this.$http.post(...myAPI.login(param)).then((response) => {
          if (response.data.code === 200) {
            if (typeof (callback) === 'function') {
              callback(response.data.userInfo)
            }
              sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
              if (localStorage.getItem('pormission')) {
                  this.$router.replace({path: localStorage.getItem('pormission')})
              } else {
                  // this.$router.replace({path: 'home'})
                  this.$router.replace({path: '/loginSuccess'})
              }
            // sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
            //   this.$router.replace({path: '/loginSuccess'})
          } else {
              if(response.data.code == 6002){
                  this.model1 = true;
              }else{
                  this.$Modal.warning({
                      title: '提示',
                      content: response.data.message,
                      onOk: () => {
                          this.$refs.numInput.focus()
                      }
                  });
              }
          }
        }).catch(() => {
          this.loading = false
        })
      } else {
          this.$Modal.warning({
              title: '提示',
              content: '当前无网络！',
          });
      }
    },
    reWrite(){
        this.model1 = false;
        this.$refs.numInput.focus();
    },
    signBtn(){
        this.model1 = false;
        this.$router.push({path: '/signup'})
    },
    getAuthUrl (redirUrl, callback) {
      this.$http.get(myAPI.getAuthUrl(redirUrl))
      .then((res) => {
        if (res.data.code === 200) {
          if (typeof (callback) === 'function') {
            callback(res)
          }
        }
      })
    },
    getloginTsl (params, callback) {
      this.$http.post(...myAPI.loginTsl(params))
      .then((res) => {
        if (res.data.code === 200) {
          if (typeof (callback) === 'function') {
            callback(res.data)
          }
        } else if (res.data.code === 6022) {
          let user = {
            phone: res.data.userInfo.mobile
          }
          // let _url = window.location.protocol + '//' + window.location.host + '/#/signin'
          // window.history.pushState({}, 0, _url)
          sessionStorage.setItem('setPw', JSON.stringify(user))
          this.$router.replace({path: 'setPsw'})
        } else {
            this.$Modal.warning({
                title: '提示',
                content: response.data.message
            });
          this.loading = false
          let _url = window.location.protocol + '//' + window.location.host + '/#/signin'
          window.history.pushState({}, 0, _url)
        }
      })
    }
  },
  mounted () {
    this.loading = true
    let code = this.getUrlParam().code
    if (sessionStorage.getItem('fromPath')) {
      let pormission = sessionStorage.getItem('fromPath')
      if (pormission === '/fgpsw3' || pormission === '/signin') {
        localStorage.setItem('pormission', '/home')
      } else if (pormission === '/fgpsw' || pormission === '/fgpsw2' || pormission === '/fgpsw3' || pormission === '/signup2' || pormission === '/signup3' || pormission === '/signup' || pormission === '/myPassword' || pormission === '/myAccount' || pormission === '/mySet' || pormission === '/setPsw') {
        // 什么都不做，不修改localStorage
        console.log('pormission', pormission)
      } else {
        localStorage.setItem('pormission', pormission)
      }
    }
    if (this.$store.getters.setPw) {
      this.$store.commit('clearnPw')
      this.loginTsl()
    }
    if (sessionStorage.getItem('userInfo')) {
      window.location.href = window.location.protocol + '//' + window.location.host + '/#/signin'
      this.$router.replace({path: 'home'})
    } else if (code) {
      this.getloginTsl(code, (res) => {
        sessionStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        this.loading = false
          this.$Modal.success({
              title: '提示',
              content: '登录成功！'
          });
        let _url = window.location.protocol + '//' + window.location.host + '/#/signin'
        window.history.pushState({}, 0, _url)
        if (localStorage.getItem('pormission')) {
          this.$router.replace({path: localStorage.getItem('pormission')})
        } else {
          this.$router.replace({path: 'home'})
        }
      })
    } else {
      this.loading = false
    }
  }
}
</script>
