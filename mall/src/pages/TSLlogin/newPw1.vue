<style lang="scss" rel="stylesheet/scss">
</style>
<template>
  <div id="newPw1">
    <XHeader :left-options="headerContent.leftOptions" :title="headerContent.title"></XHeader>
    <flow class="flowBar">
      <flow-state state="1" title="填写手机号" is-done></flow-state>
      <flow-line></flow-line>
      <flow-state state="2" title="输入验证码"></flow-state>
      <flow-line></flow-line>
      <flow-state state="3" title="设置登录密码"></flow-state>
    </flow>

    <div>
      <group class="phone-group">
        <x-input v-model="phone" type="text" placeholder="请输入注册时的手机号码" show-clear ref="numInput" @on-change="handlePhone">
          <div slot="label" class="label-icon"></div>
        </x-input>
        <x-button class="stepBtn" @click.native="step1Btn" :show-loading="loading">下一步</x-button>
      </group>
    </div>

  </div>
</template>
<script type="text/ecmascript-6">
import * as myAPI from '../../services/API/loginServices.es6'
import { XHeader, Flow, FlowState, FlowLine, Group, XInput, CheckIcon, XButton, Confirm } from 'vux'

export default {
  name: 'newPw1',
  components: {
    XHeader,
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
        if (response.data.code === 6008) {
          this.$router.replace({
            path: 'fgpsw2'
          })
          this.$store.commit('setPhone', this.phone)
        } else if (response.data.code === 6002) {
          this.$vux.confirm.show({
            content: '手机号未注册',
            confirmText: '立即注册',
            onConfirm: () => {
              this.$router.replace({path: 'signup'})
              this.loading = false
              this.$refs.numInput.focus()
            },
            onCancel: () => {
              this.loading = false
              this.$refs.numInput.focus()
            }
          })
        }
      }).catch(() => {
        this.loading = false
        this.$refs.numInput.focus()
      })
    },
    step1Btn () {
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.phone.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请输入手机号'
        })
        this.loading = false
        this.$refs.numInput.focus()
      } else if (this.phone.length !== 11) {
        this.$vux.toast.show({
          type: 'text',
          width: '200px',
          text: '请输入正确的手机号码'
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
