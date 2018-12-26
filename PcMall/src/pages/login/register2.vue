<style scoped lang="scss" rel="stylesheet/scss">
    #register2 {
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
            padding-bottom: 80px;
            width: 80%;
            background: #fff;
            .login-cont{
                width: 650px;
                margin: 0 auto;
                text-align: center;
                .pin-group{
                    margin: 30px 0 0;
                }
                .pin-tip{
                    margin-bottom: 40px;
                    font-size: 16px;
                    color: #666;
                }
                .getYzm{
                    height: 40px;
                }
                //进度条
                .weui-wepay-flow__li_done .weui-wepay-flow__state,.weui-wepay-flow__process{
                    background-color: #352665;
                }
                .pin-phone{
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .ivu-input-wrapper,.ivu-input{
                    width: 300px;
                    height: 40px;
                }
                //去掉Input[type='number']上下
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                }
                input[type="number"]{
                    -moz-appearance: textfield;
                }
                .stepBtn{
                    margin-top: 60px;
                    width: 200px;
                    height: 50px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #352665;
                    line-height: normal;
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
  <div id="register2">
      <div class="login-title">
          <div class="login-t">会员 <span class="xiegang"></span> 注册</div>
      </div>
      <div class="login-content">
          <div class="login-cont">
    <flow class="flowBar">
      <flow-state state="1" title="填写手机号" is-done></flow-state>
      <flow-line is-done></flow-line>
      <flow-state state="2" title="输入验证码" is-done></flow-state>
      <flow-line></flow-line>
      <flow-state state="3" title="设置登录密码" ></flow-state>
    </flow>

      <div class="pin-group">
        <p class="pin-tip">短信验证码已经发送到 {{ phone }}</p>
          <Input v-model="pin" ref="yzm" placeholder="请输入验证码" :show-clear="false" />
          <Button @click="pinBtn" class="getYzm">{{ pinBtnText }}</Button>
      </div>
      <Button class="stepBtn" @click.native="step2Btn" :show-loading="loading">提交验证码</Button>
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
      pin: '',
      oneMin: 0
    }
  },
  methods: {
    getPin (params) { 
      // TODO 获取验证码
      if (this.oneMin === 0) {
        this.$http.get(myAPI.getPin(params)).then((response) => {
          if (response.data.code === 200 && !response.data.object) {
            console.log('进来了，没空')
            this.pinCD()
          } else if (response.data.code === 200 && response.data.object) {
            this.pinCD(this.response.data.object)
          } else if (response.data.code === 9001) {
              this.$Modal.warning({
                  title: '提示',
                  content: '发送失败'
              })
          }
        })
      }
    },
    submitPin (params) {
      // TODO 提交验证码
      this.loading = false
      this.$http.post(myAPI.submitPin(params)).then((response) => {
        if (response.data.code === 200) {
          this.$router.replace({
            path: 'signup3'
          })
          this.$store.commit('authSucc')
        } else {
            this.$Modal.warning({
                title: '提示',
                content: '验证码错误',
                onOk: () => {
                    this.$refs.yzm.focus();
                }
            })
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    step2Btn () {
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.pin.length > 0) {
        if (this.pin.length === 6) {
          this.submitPin(this.pin)
         // TODO 验证验证码
        } else {
            this.$Modal.warning({
                title: '提示',
                content: '请输入6位验证码',
                onOk: () => {
                    this.$refs.yzm.focus();
                }
            })
          this.loading = false
        }
      } else {
          this.$Modal.warning({
              title: '提示',
              content: '请输入验证码',
              onOk: () => {
                  this.$refs.yzm.focus();
              }
          })
        this.loading = false
      }
    },
    pinBtn () {
      this.getPin(this.phone)
    },
    pinCD (sec) {
      if (sec) {
        this.oneMin = sec
      } else {
        this.oneMin = 60
      }
      let interval = setInterval(() => {
        if (this.oneMin > 0) {
          this.oneMin--
        } else {
          clearInterval(interval)
        }
      }, 1000)
    }
  },
  computed: {
    pinBtnText () {
      if (this.oneMin === 0) {
        return '获取验证码'
      } else {
        return `${this.oneMin}秒后重新获取`
      }
    }
  },
  mounted: function () {
    if (this.$store.getters.phone === '' || this.$store.getters.authsuccess) {
      this.$router.replace({path: 'signup2'})
    } else {
      this.phone = this.$store.getters.phone
      this.getPin(this.phone)
    }
  }
}
</script>
