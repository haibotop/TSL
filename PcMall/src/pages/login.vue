<style scoped>
  .my-card {
    width: 400px;
    position: absolute;
    top: 40px;
    right: 40px;
  }
  .pin-input {
    width: 50%;
  }
  .pin-img {
    float: right;
    width: 40%;
    height: 40px;
    margin-top: -3px;
    border: 1px solid #dddee1;
  }
  .pin-img img {
    display: block;
    height:100%;
    width: 100%;
    cursor: pointer;
  }
  .newPw-a {
    float: right;
  }
  /* loading */
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
<template>
  <div id="login">
    <Card class="my-card">
      <p slot="title">谢瑞麟</p>
      <Form ref="loginForm" :model="formValidate" :rules="ruleValidate">
        <FormItem prop="mobile">
          <Input placeholder="用户名" v-model.trim="formValidate.mobile" @on-enter="sumbitForm">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="loginPassword">
          <Input type="password" placeholder="密码" v-model="formValidate.loginPassword" @on-enter="sumbitForm">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" long @click="loginValidate">登录</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as lgAPI from '../services/login.es6'
  import cryptoJs from 'crypto-js'
  export default {
    name: 'login',
    components: {
    },
    data () {
      return {
        ueditor: {
          id: 'ueditor',
          value: '编辑器默认文字',
          config: {
            autoHeightEnabled: true,
            autoFloatEnabled: true,
            initialFrameWidth: 600,
            initialFrameHeight: 150
          }
        },
        formValidate: {
          mobile: '',
          password: '',
          type: 0
        },
        ruleValidate: {
          mobile: [
            { required: true, message: '用户名为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // ----------接口调试----------
      postLoginInfo (params, callback) {
        this.$http.post(...lgAPI.postLoginInfo(params), {timeout: 3000})
            .then((response) => {
              switch (response.data.code) {
                case 200: {
                  if (typeof callback === 'function') {
                    callback(response)
                  }
                  break
                }
                case 10000: {
                  this.$Spin.hide()
                  this.$refs.codeImg.src = this.codeUrl + '?rnd=' + new Date().getTime()
                  break
                }
                case 20005: {
                  this.$Spin.hide()
                  this.$refs.codeImg.src = this.codeUrl + '?rnd=' + new Date().getTime()
                  break
                }
                case 20006: {
                  this.$Spin.hide()
                  this.$refs.codeImg.src = this.codeUrl + '?rnd=' + new Date().getTime()
                  break
                }
                case 20007 : {
                  this.$Spin.hide()
                  this.$refs.codeImg.src = this.codeUrl + '?rnd=' + new Date().getTime()
                  break
                }
              }
            })
            .catch((err) => {
              if (err) {
                this.$Spin.hide()
              }
            })
      },
      // ----------数据处理----------
      loginValidate () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            // this.loadingOpen()
            this.postLoginInfo(this.formValidate, (response) => {
              if (response.data.menuVoList === null) {
                response.data.menuVoList = ['null']
                this.$Message.success({content: '登录成功，该用户无任何权限，请分配权限后重新登录', duration: 3})
                this.$refs.loginForm.resetFields()
              }
              let userInfo = {
                groupVoList: response.data.groupVoList,
                menuVoList: response.data.menuVoList,
                operatorVoList: response.data.operatorVoList
              }
              console.log(userInfo)
              let b = cryptoJs.AES.encrypt(JSON.stringify(userInfo), 'key', 'conf')
              sessionStorage.setItem('userInfo', b)
              this.$router.push({path: 'home2'})
              this.$Spin.hide()
            })
          } else {
            this.$Message.error('登录信息有误')
          }
        })
      },
      reflashCode () {
        this.$refs.codeImg.src = this.codeUrl + '?rnd=' + new Date().getTime()
      },
      loadingOpen () {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'load-c',
                  size: 18
                },
                style: {
                  animation: 'ani-demo-spin 1s linear infinite'
                }
              }),
              h('div', 'Loading')
            ])
          }
        })
      },
      // enter event
      sumbitForm () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loginValidate()
          }
        })
      }
    },
    computed: {
      codeUrl: function () {
        let server = this.$http.defaults.baseURL
        return `${server}/kaptcha`
      }
    }
  }
</script>

