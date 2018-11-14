<style lang="scss" rel="stylesheet/scss">
  #registerTsl {
    .code-img {
      width: 200px;
      height: 200px;
      margin-left: 12%;
    }
  }
</style>
<template>
  <div id="registerTsl">
    <XHeader :left-options="headerContent.leftOptions" :title="headerContent.title"></XHeader>
    <div>请关注微信公众号并注册会员，将获得更多优惠信息！</div>
  </div>
</template>
<script type="text/ecmascript-6">
import * as myAPI from '../../services/API/myService.es6'
import { XHeader, Tab, TabItem, Flow, FlowState, FlowLine, Group, XInput, CheckIcon, XButton, Confirm } from 'vux'
export default {
  name: 'register1',
  components: {
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
          this.$router.push({
            path: 'signup2',
            query: {
              mobile: this.phone
            }
          })
        } else if (response.data.code === 6008) {
          this.showPlugin('', '手机号已注册', '立即登录', () => {
            this.$router.push({path: 'signin'})
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
  }
}
</script>
