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
    width: 100%;
  }
  .newPw-a {
    float: right;
  }
</style>
<template>
  <div id="login">
    <Card class="my-card">
      <p slot="title">谢瑞麟</p>
      <Form ref="loginForm" :model="formValidate" :rules="ruleValidate">
        <FormItem prop="userName">
          <Input placeholder="用户名" v-model="formValidate.userName">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" placeholder="密码" v-model="formValidate.password">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="pin">
          <Input class="pin-input" placeholder="验证码" v-model="formValidate.pin"></Input><div class="pin-img"><img src="" alt="点击刷新"></div>
        </FormItem>
        <FormItem>
          <Checkbox>自动登录</Checkbox>
          <a href="javscript:" class="newPw-a">忘记密码</a>
        </FormItem>
        <FormItem>
          <Button type="primary" long @click="loginValidate">登录</Button>
        </FormItem>
      </Form>
    </Card>

  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'login',
  data () {
    return {
      formValidate: {
        useerName: '',
        password: '',
        pin: ''
      },
      ruleValidate: {
        userName: [
          { required: true, message: '用户名为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码为空', trigger: 'blur' }
        ],
        pin: [
          { required: true, message: '验证码为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginValidate () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$Message.success('提交成功!')
          this.$router.push({path: 'home_'})
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    }
  }
}
</script>
