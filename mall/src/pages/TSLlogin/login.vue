<style lang="scss" rel="stylesheet/scss">
#login {
  background: #eee;
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #9c9c9c;
  }
  input:-ms-input-placeholder{
    color: #9c9c9c;
  }
  input::-webkit-input-placeholder{
    color: #9c9c9c;
  }
  .login-header{
    position:absolute;
    left:0;
    right:0;
    top:0;
    z-index:1;
    height:47px;
  }
  .login-tab{
    margin-top: 46px;
    color: #352665
  }
  .login-group {
    width: 265px;
    margin: 0 auto;
    margin-top: 57px;
    .weui-cells:before,
    .weui-cells:after,
    .weui-cell:before{
      border: none;
    }
    .weui-cells {
      background-color: transparent;
    }
    .weui-cell {
      border-bottom: 1px solid #9c9c9c; 
      width: 100%;
      height: 36px;
      padding: 0px !important;
      position: relative;
    }
    .weui-input {
      font-size: 14px;
      text-indent: 19px;
      color: #9c9c9c;
      letter-spacing: 2.3px;
    }
    .pw-input {
      margin-top: 10px;
    }
    .weui-cell__hd {
      position: absolute;
      width: 46px;
      height: 27px;
      padding-top: 9px;
      img {
        display: block;
        width: 18px;
        height: 18px;
        margin: 0px auto;
      }
    }
    .weui-cell__bd {
      margin-left: 47px;
    }
    .signup-btn {
      margin-top: 20px;
      font-size: 16px;
      border: 1px solid #352665;
      border-radius: 30px;
      color: #352665;
      background-color: transparent;
    }
    .login-btn {
      margin-top: 50px;
      font-size: 16px;
      line-height: 2.5;
      border-radius: 30px;
      color: #fff;
      background-color: #352665;
    }
    .sub-btn {
      margin-top: 20px;
      font-size: 14px;
      line-height: 2.5;
      text-align: center;      
      a {
        color: #4D4D4D;
        font-size: 14px;
      }
    }
  }
  .divider {
    font-size: 12px;
    color: #000;
    width: 114px;
    text-align: center;
    margin: 0 auto;
    margin-top: 68px;
    position: relative;
  }
  .divider:before,
  .divider:after {
    content: '';
    display: block;
    width: 74px;
    border-top: 1px solid #fff;
    position: absolute;
    top: 10px;
  }
  .divider:before {
    left: -76px;
  }
  .divider:after {
    left: 114px;
  }
  .orderLogin {
    width: 265px;
    margin: 0 auto;
    padding: 30px 0px 82px 0px;
    a {
      display: inline-block;
      width: 32%;
    }
    img {
      display: block;
      width: 48px;
      height: 48px;
      margin: 0 auto;
    }
  }
}
</style>
<template>
  <div id="login">
    <div class="login-header">
      <x-header title="商城登录" :left-options="{backText: '', preventGoBack:false}">
      </x-header>
    </div>
    <tab v-model="index" class="login-tab">
      <tab-item>
        TSL会员
      </tab-item>
      <tab-item>
        普通用户
      </tab-item>
    </tab>
    <group class="login-group" v-show="index === 1">
      <x-input type="text" v-model="account" placeholder="请输入您的手机号码" ref="numInput" :max="11" @on-change="handlePhone">
        <div slot="label"><img src="../../assets/icons/icon_ipone.svg" alt=""></div>
      </x-input>
      <x-input type="password" v-model="password" class="pw-input" placeholder="请输入您的密码" ref="pwdInput">
        <div slot="label"><img src="../../assets/icons/icon_password.svg" alt=""></div>
      </x-input>
      <x-button id="login" class="login-btn" @click.native="loginBtn" :show-loading="loading">登录</x-button>
      <x-button id="signup" class="signup-btn" @click.native="toSignup">注册</x-button>
      <div class="sub-btn">
        <a href="/#/fgpsw" class="newPw-btn">忘记密码？</a>
      </div>
    </group>
    <group class="login-group" v-show="index === 0" style="color: #fff;">
      <div style="text-align:center;margin-top:20px;" v-show="!isWeChat">
        <img src="../../assets/icons/tips.svg" alt="">
        <div style="color:#c8c8c8;margin-top:40px">TSL会员仅供微信客户端登录</div>
      </div>
      <div v-show="isWeChat">
      <x-button id="tsllogin" class="login-btn" @click.native="loginTsl" :show-loading="loading">登录</x-button>
      <div class="sub-btn">
        <x-button id="tslsignup" class="signup-btn" @click.native="signupTsl">注册</x-button>
      </div>
      </div>
    </group>
  </div>
</template>
<script type="text/ecmascript-6">
import * as myAPI from '../../services/API/loginServices.es6'
import { XHeader, Tab, TabItem, Group, XInput, XButton, Toast, debounce } from 'vux'

export default {
  name: 'login',
  components: {
    XHeader,
    Tab,
    TabItem,
    Group,
    XInput,
    XButton,
    Toast,
    debounce
  },
  data () {
    return {
      index: 0,
      loading: false,
      account: '',
      password: '',
      userId: '',
      isWeChat: false
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
    handlePhone: debounce(function (val) {
      this.userId = val.replace(/[^0-9]/g, '')
      // setTimeout(() => { this.$refs.numInput.reset(val.replace(/[^0-9]/g, '')) }, 30)
      this.$refs.numInput.reset(val.replace(/[^0-9]/g, ''))
    }, 100),
    logout () {
      this.$http.delete(myAPI.logout())
    },
    signupTsl () {
      if (this.is_WX) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0f946bc97a01fe9b&redirect_uri=http%3A%2F%2Fwx0f946bc97a01fe9b.pub-wechat.bizvane.com%2FbizvaneApp%2Fviews%2Fmember_center.html&response_type=code&scope=snsapi_base&state=123&component_appid=wx7e7319a046a816d5&connect_redirect=1#wechat_redirect'
        // this.$router.push({path: 'registerTsl'})
      }
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
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请输入手机号码'
        })
        this.$refs.numInput.focus()
        this.loading = false
      } else if (this.userId.length !== 11) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请输入正确的手机号码'
        })
        this.$refs.numInput.focus()
        this.loading = false
      } else if (this.userId.length === 11) {
        if (this.password.length === 0) {
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: '请输入密码'
          })
          this.$refs.pwdInput.focus()
          this.loading = false
        } else if (this.password.length < 6 || this.password.length > 16) {
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: '用户名或密码错误'
          })
          this.$refs.numInput.focus()
          this.loading = false
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
    // 判断当前是否在微信浏览器中打开
    is_WX () {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') !== -1) {
        return true
      } else {
        return false
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
            setTimeout(() => {
              this.loading = false
              console.log(localStorage.getItem('pormission'))
              if (localStorage.getItem('pormission')) {
                this.$router.replace({path: localStorage.getItem('pormission')})
              } else {
                this.$router.replace({path: 'home'})
              }
            }, 500)
          } else {
            this.$vux.toast.show({
              type: 'text',
              text: response.data.message,
              width: '200px'
            })
            this.$refs.numInput.focus()
            this.loading = false
          }
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '当前无网络！'
        })
      }
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
          this.$vux.toast.show({
            type: 'text',
            width: '200px',
            text: res.data.message
          })
          this.loading = false
          let _url = window.location.protocol + '//' + window.location.host + '/#/signin'
          window.history.pushState({}, 0, _url)
        }
      })
    }
  },
  beforeMount () {
    // 判断是否微信端
    this.isWeChat = this.is_WX()
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
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '登录成功！'
        })
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
