<style lang="scss" rel="stylesheet/scss">
    #newPw1 .ivu-input ,#newPw2 .ivu-input ,#newPw3 .ivu-input {
        height: 40px;
    }
</style>
<style scoped lang="scss" rel="stylesheet/scss">
    #newPw1{
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
                .phone-group{
                    span{
                        display: inline-block;
                        margin-right: 20px;
                        width: 60px;
                        text-align: left;
                        font-size: 16px;
                        vertical-align: text-bottom;
                        color: #333;
                    }
                }
                .password{
                    margin-top: 30px;
                }
                .agreementBar{
                    margin: 50px 0 20px;
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
                .ivu-input-wrapper,input{
                    width: 400px;
                    height: 40px;
                }
                .stepBtn{
                    margin-top: 60px;
                    width: 200px;
                    height: 50px;
                    font-size: 16px;
                    color:#fff;
                    background-color: #352665;
                }
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
  <div id="newPw1">
      <div class="login-title">
          <div class="login-t">会员 <span class="xiegang"></span> 忘记密码</div>
      </div>
      <div class="login-content">
          <div class="login-cont">
            <flow class="flowBar">
              <flow-state state="1" title="填写手机号" is-done></flow-state>
              <flow-line></flow-line>
              <flow-state state="2" title="输入验证码"></flow-state>
              <flow-line></flow-line>
              <flow-state state="3" title="设置登录密码"></flow-state>
            </flow>

            <div>
              <div class="phone-group">
                  <span>手机号</span>
                <Input v-model="phone" placeholder="请输入注册时的手机号码" :maxlength="11" ref="numInput" />
              </div>
              <Button class="stepBtn" @click.native="step1Btn" :show-loading="loading">下一步</Button>
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
      phone: ''
    }
  },
  methods: {
    submitPhone (phone) {
        console.log(phone)
      this.$http.get(myAPI.phone(phone)).then((response) => {
        // TODO 注册-发送电话号码
        if (response.data.code === 6008) {
          this.$router.replace({
            path: 'fgpsw2'
          })
          this.$store.commit('setPhone', this.phone)
        } else if (response.data.code === 6002) {
            this.$Modal.warning({
                title: '提示',
                content: '手机号未注册',
                onOk: () => {
                    this.$refs.numInput.focus();
                }
            })
        }
      }).catch(() => {
        this.loading = false
        this.$refs.numInput.focus()
      })
    },
    step1Btn () {
      this.loading = true
      if (this.phone.length === 0) {
          this.$Modal.warning({
              title: '提示',
              content: '请输入手机号',
              onOk: () => {
                  this.$refs.numInput.focus();
              }
          })
        this.loading = false
        this.$refs.numInput.focus()
      } else if (this.phone.length !== 11) {
          this.$Modal.warning({
              title: '提示',
              content: '请输入正确的手机号码',
              onOk: () => {
                  this.$refs.numInput.focus();
              }
          })
        this.loading = false
        this.$refs.numInput.focus()
      } else if (this.phone.length === 11) {
        this.submitPhone(this.phone)
      }
    }
  },
  mounted () {
    this.$store.commit('authDel')
    this.$store.commit('clearnPhone')
  }
}
</script>
