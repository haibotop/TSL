<style lang="scss" rel="stylesheet/scss" scoped>
  #revisePassword {
    position: relative;
  }
  .margin-10 {
    margin: 10px;
  }
  .formInput {
    position: absolute;
    left: 300px;
    top: 200px;
  }
</style>
<template>
  <div id="revisePassword">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>账户权限管理</BreadcrumbItem>
      <BreadcrumbItem>密码修改</BreadcrumbItem>
    </Breadcrumb>
    <div class="formInput">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="150">
        <FormItem label="原密码：" prop="originPasswd">
          <Input style="width: 200px" v-model="formCustom.originPasswd" type="password" :maxlength="6"></Input>
        </FormItem>
        <FormItem label="新密码：" prop="passwd">
          <Input style="width: 200px" v-model="formCustom.passwd" type="password" :maxlength="6"></Input>
          <span>6位（数字+字母）</span>
        </FormItem>
        <FormItem label="重复密码：" prop="passwdCheck">
          <Input style="width: 200px" v-model="formCustom.passwdCheck" type="password" :maxlength="6"></Input>
          <span>重复密码必须与新密码保持一致</span>
        </FormItem>
        <FormItem style="text-align: left">
          <Button style="width: 100px;" type="primary" @click="handleSubmit('formCustom')">提交</Button>
          <Button style="width: 100px;" type="primary" @click="handleReset('formCustom')">重置</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as ujAPI from '../../services/userjurisdiction.es6'
  export default {
    name: 'revisePassword',
    data () {
      return {
        formCustom: {
          originPasswd: '',
          passwd: '',
          passwdCheck: ''
        },
        ruleCustom: {
          originPasswd: [
            {
              validator: (rule, value, callback) => {
                if (value === '' || !value) {
                  callback(new Error('原密码不可为空'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          passwd: [
            {
              validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('新密码不可为空'))
                } else if (value.length < 6) {
                  callback(new Error('新密码必须设置长度为6的密码'))
                } else if (value === this.formCustom.originPasswd) {
                  callback(new Error('新密码不可与原密码相同'))
                } else if (value === '123456') {
                  callback(new Error('新密码不可与初始密码相同'))
                } else if (!/^(?!\D+$)(?![^a-zA-Z]+$)[a-zA-Z\d]{6}$/.test(value)) {
                  callback(new Error('新密码必须为数字+字母'))
                } else {
                  if (this.formCustom.passwdCheck !== '') {
                    // 对重复密码验证
                    this.$refs.formCustom.validateField('passwdCheck')
                  }
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          passwdCheck: [
            {
              validator: (rule, value, callback) => {
                if (value !== this.formCustom.passwd) {
                  callback(new Error('重复密码必须与新密码保持一致'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      putPassword (params, callback) {
        this.$http.put(...ujAPI.putPassword(params))
          .then((response) => {
            if (typeof callback === 'function') {
              callback(response)
            }
          })
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(this.formCustom)
            // oldPwd: 原密码 newPwd: 新密码
            let params = {
              newPwd: this.formCustom.passwdCheck,
              oldPwd: this.formCustom.originPasswd
            }
            this.putPassword(params, (res) => {
              if (res.data.code === 200) {
                this.$Message.success({content: '密码修改成功'})
                this.$router.replace({path: '/login'})
                sessionStorage.removeItem('userInfo')
              }
            })
          } else {
            this.$Message.error('密码设置有误')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    }
  }
</script>
