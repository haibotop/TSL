<style lang="scss" rel="stylesheet/scss">
#newPw1, #newPw2, #newPw3,
#register1, #register2, #register3,
#editMobile1, #editMobile2, #editMobile3, #editMobile4,
#bindMobile1, #bindMobile2, #bindMobile3 {
  min-height: 100%;
  background-color: #fff;
  .weui-cells:before {
    border: none;
  }
  .weui-cells:after {
    border: none;
  }
  .weui-cell:before {
    border: none;
  }
  // 按钮
  .stepBtn {
    background-color: #352665;
    height: 44px;
    line-height: 44px;
    color: #FFF;
    font-size: 18px;
    margin-top: 60px;
  }
  // 进度条
  .flowBar {
    padding: 30px;
    .weui-wepay-flow__bd {
      width: 66%;
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
  .phone-group,
  .pin-group,
  .pw-group {
    width: 295px;
    margin: 0 auto;
    margin-top: 40px;
    .weui-input {
      font-size: 19px;
    }
    .vux-x-input {
      border-bottom: 1px solid #DBDBDB;
    }
    .label-icon {
      padding-right: 15px;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #BDBDBD;
    }
    input:-ms-input-placeholder{
      color: #BDBDBD;
    }

    input::-webkit-input-placeholder{
      color: #BDBDBD;
    }
  }
  .phone-group {
    .agreementBar {
      margin-top: 20px;
    }
    .weui-icon-clear:before {
      font-size: 20px;
      color: #EEEEEE;
    }
    .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before {
      color: #352665;
      font-size: 20px;
    }
    .agreement {
      display: inline-block;
      line-height: 20px;
      font-size: 14px;
      color: #7F7F7F;
      a {
        color: #0076FF;
      }
    }
  }
  .pin-group {
    .pin-tip {
      font-size: 17px;
      color: #DBDBDB;
    }
    .pin-phone {
      margin-top: 15px;
      font-size: 24px;
      font-weight: 400;
      color: #352665;
      text-align: center;
    }
    .vux-x-input {
      margin-top: 30px;
    }
    .weui-input {
      width: 145px;
    }
    .weui-cell__ft {
      position: absolute;
      right: 0px;
      padding-left: 10px;
      border-left: 1px solid #DBDBDB;
      button {
        width: 90px;
        height: 25px;
        font-size: 12px;
        border: none;
        border-radius: 5px;
        background-color: #352665;
        color: #FFF;
      }
    }
  }
}
</style>
<template>
  <div id="register1">
      <header1></header1>
      <header2></header2>
    <XHeader :left-options="headerContent.leftOptions" :title="headerContent.title"></XHeader>
    <tab v-show="isWX" v-model="index" class="login-tab">
      <tab-item>
        TSL会员
      </tab-item>
      <tab-item>
        普通用户
      </tab-item>
    </tab>
    <flow class="flowBar">
      <flow-state state="1" title="填写手机号" is-done></flow-state>
      <flow-line></flow-line>
      <flow-state state="2" title="输入验证码"></flow-state>
      <flow-line></flow-line>
      <flow-state state="3" title="设置登录密码"></flow-state>
    </flow>
    <div>
      <group class="phone-group">
        <x-input v-model="phone"  type="text" placeholder="请输入您的手机号码" show-clear ref="numInput" @on-change="handlePhone">
        </x-input>
        <div class="agreementBar">
          <check-icon :value.sync="agree"></check-icon>
          <span class="agreement">同意<a href="/#/agreement">用户条款</a>和<a href="/#/screatment">隐私协议</a></span>
        </div>
        <x-button class="stepBtn" @click.native="step1Btn" :show-loading="loading">下一步</x-button>
      </group>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import header1 from '../homePages/header1'
import header2 from '../homePages/header2'
import * as myAPI from '../../services/API/myService.es6'
import { XHeader, Tab, TabItem, Flow, FlowState, FlowLine, Group, XInput, CheckIcon, XButton, Confirm } from 'vux'
export default {
  name: 'register1',
  components: {
    header1,
    header2,
    XHeader,
    Tab,
    TabItem,
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
      // 是否微信登录
      isWX: false,
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
      index: 0,
      loading: false,
      phone: '',
      agree: true
    }
  },
  methods: {
    handlePhone (val) {
      if (val) {
        let arr = val.match(/[0-9]/g)
        if (arr) {
          this.phone = arr.join('')
          this.$refs.numInput.reset(arr.join(''))
        } else {
          this.phone = ''
          this.$refs.numInput.reset('')
        }
      }
    },
    submitPhone (phone) {
      this.$http.get(myAPI.phone(phone)).then((response) => {
        // TODO 注册-发送电话号码
        if (response.data.code === 6002) {
          this.$router.replace({
            path: 'signup2'
          })
          this.$store.commit('setPhone', this.phone)
        } else if (response.data.code === 6008) {
          this.showPlugin('', '手机号已注册', '立即登录', () => {
            this.$router.replace({path: 'signin'})
          })
        }
        this.loading = false
      })
    },
    step1Btn () {
      this.loading = true
      if (this.agree === false) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请阅读条款并勾选'
        })
        this.$refs.numInput.focus()
        this.loading = false
        return
      }
      if (this.phone.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请输入手机号'
        })
        this.$refs.numInput.focus()
        this.loading = false
      } else if (this.phone.length !== 11) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请输入正确的手机号码'
        })
        this.$refs.numInput.focus()
        this.loading = false
      } else if (this.phone.length === 11) {
        this.submitPhone(this.phone)
      }
    },
    showPlugin (title, content, confirmText, callback) {
      this.$vux.confirm.show({
        title: title,
        content: content,
        confirmText: confirmText,
        onCancel: () => {
          this.loading = false
          setTimeout(() => {
            this.$refs.numInput.focus()
          }, 500)
        },
        onConfirm: () => {
          console.log('plugin confirm')
          if (typeof callback === 'function') {
            callback()
          }
        }
      })
    }
  },
  mounted () {
    this.$store.commit('authDel')
    this.$store.commit('clearnPhone')
  }
}
</script>
