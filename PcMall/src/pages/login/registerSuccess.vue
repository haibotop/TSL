<style scoped lang="scss" rel="stylesheet/scss">
#registerSuccess {
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
        padding: 60px 0;
        width: 80%;
        background: #fff;
        .login-cont{
            width: 650px;
            margin: 0 auto;
            text-align: center;
            .success-tb{
                position: relative;
                margin: 0 auto;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: #352665;
            }
            .success-tb::before{
                position: absolute;
                top: 50%;
                margin-top: 4px;
                left: 50%;
                margin-left: -17px;
                content: '';
                display: inline-block;
                width: 17px;
                height: 3px;
                background-color: #fff;
                transform: rotate(38deg);

            }
            .success-tb::after{
                position: absolute;
                top: 50%;
                margin-top: -2px;
                left: 50%;
                margin-left: -7px;
                content: '';
                display: inline-block;
                width: 30px;
                height: 3px;
                background-color: #fff;
                transform: rotate(-45deg);

            }
            .success-txt{
                margin-top: 40px;
                font-size: 16px;
                color: #111111;
            }
            .timeOut{
                margin-top: 20px;
                font-size: 16px;
                color: #111111;
            }
            .login-footer{
                margin-top: 80px;
                .goto-home{
                    margin-right: 30px;
                    width: 200px;
                    height: 50px;
                    font-size: 16px;
                    color:#fff;
                    background-color: #352665;
                }
                .look-more{
                    padding-bottom: 8px;
                    width: 200px;
                    height: 50px;
                    font-size: 16px;
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
  <div id="registerSuccess">
      <div class="login-title">
          <div class="login-t">普通用户 <span class="xiegang"></span> 注册</div>
      </div>
      <div class="login-content">
          <div class="login-cont">
              <div class="login-success">
                  <p class="success-tb"></p>
                  <p class="success-txt">恭喜您已成功注册为TSL会员</p>
                  <p class="timeOut">{{timeOut_num}}s后跳转到主页</p>
              </div>
              <div class="login-footer">
                  <Button class="goto-home" @click.native="toHome" >返回首页</Button>
                  <Button class="look-more" @click.native="toHome" :show-loading="loading" >查看全部产品</Button>
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
export default {
    name: 'loginSuccess',
    components: {
        header1,
        header2,
        vFooter,
    },
    data() {
        return {
            timeOut_num: 0,
            index: 0,
            loading: false,
            account: '',
            password: '',
            userId: '',
            isWeChat: false
        }
    },
    methods: {
        countDown() {
          this.timeOut_num--;
        },
        toHome() {
            this.$router.push({path: '/'})
        }
    },
    mounted(){
        this.timeOut_num = 5;
        setInterval(this.countDown,1000)
    },
    watch:{
        'timeOut_num':function(newVal,oldVal) {
            if(newVal == 0){
                this.$router.push({path: '/'})
            }
        }
    }

}
</script>
