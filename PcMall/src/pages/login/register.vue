<style lang="scss" rel="stylesheet/scss">
    #register1 .ivu-input ,#register2 .ivu-input ,#register3 .ivu-input {
        height: 40px;
    }
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
    .vux-check-icon>.weui-icon-success-circle:before, .vux-check-icon>.weui-icon-success:before{
        color: #352665;
    }
</style>
<style scoped lang="scss" rel="stylesheet/scss">
    #register1{
        padding: 50px 0;
        background: #fafafa;
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

        .backHomePage{
            padding-bottom: 8px;
            width: 200px;
            height: 50px;
            font-size: 16px;
            color:#fff;
            background-color: #352665;
        }
        .login-content{
            position: relative;
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
                        vertical-align: middle;
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
                img{
                    display: block;
                    margin: 35px auto;
                }
                .login-footer{
                    margin-top: 60px;
                    .sign{
                        margin-right: 20px;
                        width: 200px;
                        height: 50px;
                        font-size: 16px;
                    }
                    .login{
                        padding-bottom: 6px;
                        width: 200px;
                        height: 50px;
                        font-size: 16px;
                        color:#fff;
                        background-color: #352665;
                    }
                }
            }
            .changeTab{
                position: absolute;
                top: 5px;
                right: 5px;
                cursor: pointer;
                img{
                    width: 80px;
                    height: 80px;
                }
                .saoma_txt{
                    position: absolute;
                    top: 40px;
                    right: 65px;
                    width: 130px;
                    display: inline-block;
                    font-size: 12px;
                    padding: 5px 10px;
                    border: 1px solid #352665;
                    color: #352665;
                }
                .saoma_txt:before{
                    content: '';
                    display: inline-block;
                    position: absolute;
                    top: 9px;
                    right: -4px;
                    width: 8px;
                    height: 8px;
                    background: #fff;
                    border: 1px solid transparent;
                    border-top-color: #352665;
                    border-right-color: #352665;
                    transform: rotate(45deg);
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
        .telephone{
            padding: 4px 7px;
            font-size: 14px;
            border: 1px solid #dcdee2;
            border-radius: 4px;
            color: #515a6e;
        }
    }
</style>
<template>
<div>
    <header1></header1>
    <header2></header2>
    <div id="register1" >
        <div class="login-title">
            <div class="login-t">会员 <span class="xiegang"></span> 注册</div>
        </div>
        <div class="login-content">
            <div class="changeTab" style="display:none;">
                <img :src="loginSrc" @click="loginStatus = !loginStatus" >
                <span class="saoma_txt" v-show="!loginStatus">TSL会员微信扫码注册</span>
                <span class="saoma_txt" v-show="loginStatus">点此切换到账号注册</span>
            </div>
            <div class="login-cont" v-show="loginStatus"  style="display:none;">
                <p>打开微信扫描二维码，可以在手机上完成注册：</p>
                <img src="../../assets/images/login_qrcode_b.png" alt="">
                <Button class="backHomePage"  @click.native="backHomePage" >返回首页</Button>
            </div>
            <div class="login-cont" v-show="!loginStatus">
                <flow class="flowBar">
                    <flow-state state="1" title="填写手机号" is-done></flow-state>
                    <flow-line></flow-line>
                    <flow-state state="2" title="输入验证码"></flow-state>
                    <flow-line></flow-line>
                    <flow-state state="3" title="设置登录密码"></flow-state>
                </flow>
                <div class="phoneNum">
                    <span>手机号</span>
                    <input v-model="phone11" class="telephone" ref="numInput" placeholder="请输入您的手机号码" :maxlength=11 />
                </div>
                <div class="agreementBar">
                    <check-icon :value.sync="agree"></check-icon>
                    <span class="agreement">同意<router-link tag="a" to="/agreement"> 用户条款 </router-link>和<router-link tag="a" to="/screatment"> 隐私协议</router-link></span>
                </div>
                <div class="login-footer">
                    <Button class="sign" id="signup" @click.native="login" >上一步</Button>
                    <Button class="login"  @click.native="step1Btn" :show-loading="loading" >下一步</Button>
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
    import * as myAPI from '../../services/API/myService.es6'
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
                agree: true,
                loginStatus: false
            }
        },
        computed: {
            loginSrc(){
                return this.loginStatus == false ? require('../../assets/icons/login_qrcode_s.png') : require('../../assets/icons/login_pc.png')
            },
            phone11: {
                set: function (value) {
                    this.phone = value
                },
                get: function () {
                    return this.phone.replace(/[^0-9]+/g, '')
                },
            }
        },
        methods: {
            backHomePage () {
                this.$router.replace({path:'/home'})
            },
            submitPhone (phone) {
                console.log(phone)
                this.$http.get(myAPI.phone(phone)).then((response) => {
                    // // TODO 注册-发送电话号码
                    if (response.data.code === 6002) {
                        this.$router.replace({
                            path: 'signup2'
                        })
                        this.$store.commit('setPhone', this.phone)
                    } else if (response.data.code === 6008) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '手机号已注册',
                            okText: '立即登录',
                            cancelText: '重新填写',
                            onOk: () => {
                                this.$router.replace({path: 'login'})
                            },
                            onCancel: () => {
                                this.$refs.numInput.focus()
                            }
                        })
                    }


                })

            },
            login() {
              this.$router.push({path:'login'})
            },
            step1Btn () {
                this.loading = true
                if (this.agree === false) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '请阅读条款并勾选'
                    });
                    this.$refs.numInput.focus()
                    this.loading = false
                    return
                }
                if (this.phone.length === 0) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '请输入手机号',
                        onOk: () => {
                            this.$refs.numInput.focus();
                        }
                    });
                    this.$refs.numInput.focus()
                    this.loading = false
                } else if (this.phone.length !== 11) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '请输入正确的手机号码',
                        onOk: () => {
                            this.$refs.numInput.focus();
                        }
                    });
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
