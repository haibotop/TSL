<style lang="scss" rel="stylesheet/scss">
    #register1{
        padding-bottom: 40px;
        background: #fafafa;
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
            padding-bottom: 80px;
            width: 80%;
            background: #fff;
            .login-cont{
                width: 510px;
                margin: 0 auto;
                text-align: center;
                .phoneNum,.password{
                    span{
                        display: inline-block;
                        margin-right: 20px;
                        width: 60px;
                        text-align: left;
                        font-size: 18px;
                        vertical-align: middle;
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

                .login-footer{
                    margin-top: 30px;
                    .sign{
                        margin-right: 20px;
                        width: 150px;
                    }
                    .login{
                        padding-bottom: 6px;
                        width: 150px;
                        color:#fff;
                        background-color: #352665;
                    }
                }
            }
            // 进度条
            .flowBar {
                margin-bottom: 40px;
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
    <div id="register1" >
        <header1></header1>
        <header2></header2>
        <div class="login-title">
            <div class="login-t">普通用户 <span class="xiegang"></span> 注册</div>
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
                <div class="phoneNum">
                    <span>手机号</span>
                    <Input v-model="phone" style="width: 300px;" ref="numInput" placeholder="请输入您的手机号码" :maxlength=11  @on-change="handlePhone" />
                </div>
                <div class="agreementBar">
                    <check-icon :value.sync="agree"></check-icon>
                    <span class="agreement">同意<a href="/#/agreement">用户条款</a>和<a href="/#/screatment">隐私协议</a></span>
                </div>
                <div class="login-footer">
                    <Button class="sign" id="signup" @click.native="login" >上一步</Button>
                    <Button class="login" id="login" @click.native="step1Btn" :show-loading="loading" >下一步</Button>
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
    import * as myAPI from '../../services/API/myService.es6'
    import { XHeader, Tab, TabItem, Flow, FlowState, FlowLine, Group, XInput, CheckIcon, XButton, Confirm } from 'vux'
    export default {
        name: 'register1',
        components: {
            header1,
            header2,
            vFooter,
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
            handlePhone () {
                var val = this.phone;
                // if (val) {
                //   let arr = val.match(/[0-9]/g)
                //   if (arr) {
                //     this.phone = arr.join('')
                //     this.$refs.numInput.reset(arr.join(''))
                //   } else {
                //     this.phone = ''
                //     this.$refs.numInput.reset('')
                //   }
                // }
            },
            submitPhone (phone) {
                console.log(phone)
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
            login() {
              this.$router.push({path:'login'})
            },
            step1Btn () {
                this.loading = true
                if (this.agree === false) {
                    alert('请阅读条款并勾选')
                    // this.$vux.toast.show({
                    //   type: 'text',
                    //   width: '200px',
                    //   text: '请阅读条款并勾选'
                    // })
                    this.$refs.numInput.focus()
                    this.loading = false
                    return
                }
                if (this.phone.length === 0) {
                    alert('请输入手机号')
                    // this.$vux.toast.show({
                    //   type: 'text',
                    //   width: '200px',
                    //   text: '请输入手机号'
                    // })
                    this.$refs.numInput.focus()
                    this.loading = false
                } else if (this.phone.length !== 11) {
                    alert('请输入正确的手机号码')
                    // this.$vux.toast.show({
                    //   type: 'text',
                    //   width: '200px',
                    //   text: '请输入正确的手机号码'
                    // })
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
