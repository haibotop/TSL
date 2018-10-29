<template>
  <div id="myPassword">
    <x-header :left-options="{backText: ''}" title="修改密码"></x-header>
    <group>
      <x-input placeholder="请输入当前密码" :min="6" :max="16" type="password" v-model.trim="currPw">
        <div slot="label" class="pw-label">当前密码</div>
      </x-input>
      <x-input placeholder="请输入6-16位密码" :min="6" :max="16" type="password" v-model.trim="newPw">
        <div slot="label" class="pw-label">新密码</div>
      </x-input>
      <x-input placeholder="请输入6-16位密码" :min="6" :max="16" type="password" v-model.trim="confirmPw">
        <div slot="label" class="pw-label">确认密码</div>
      </x-input>
    </group>
    <x-button style="width: 90%;margin: 20px auto;" @click.native="updatePw">确定修改</x-button>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as myAPI from '@/services/API/mineServices.es6'
  import { XHeader, Group, CellBox, XInput, XButton, base64 } from 'vux'
  export default {
    name: 'myPassword',
    components: { XHeader, Group, CellBox, XInput, XButton },
    data () {
      return {
        mobile: '',
        currPw: '',
        newPw: '',
        confirmPw: ''
      }
    },
    mounted: function () {
      if (sessionStorage.getItem('userInfo')) {
        this.mobile = JSON.parse(sessionStorage.getItem('userInfo')).mobile
      }
    },
    methods: {
      updatePw () {
        if (this.currPw === '') {
          this.$vux.toast.show({type: 'text', text: `请输入当前密码`, width: '200px'})
        } else if (this.newPw.length < 6 || this.newPw.length > 16) {
          this.$vux.toast.show({type: 'text', text: `设置新密码(6-16位)`, width: '200px'})
        } else if (this.confirmPw.length < 6 || this.confirmPw.length > 16) {
          this.$vux.toast.show({type: 'text', text: `确认新密码(6-16位)`, width: '200px'})
        } else if (this.currPw === this.newPw) {
          this.$vux.toast.show({type: 'text', text: `新密码不可与当前密码一致`, width: '200px'})
        } else if (this.newPw !== this.confirmPw) {
          this.$vux.toast.show({type: 'text', text: `两次密码不一致`, width: '200px'})
        } else {
          console.log(base64.encode(this.currPw))
          this.$http.get(...myAPI.checkPw(this.currPw)).then(res => {
            if (res.data.code === 200) {
              this.$http.put(...myAPI.updatePw({phone: this.mobile, newPwd: this.newPw})).then(res => {
                if (res.data.code === 200) {
                  this.$vux.toast.show({type: 'text', text: `修改成功`, width: '200px'})
                  this.currPw = ''
                  this.newPw = ''
                  this.confirmPw = ''
                }
              })
            } else if (res.data.code === 6013 || res.data.message === '密码不正确') {
              this.$vux.toast.show({type: 'text', text: `当前密码不正确`, width: '200px'})
            }
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.pw-label {
  width: 80px;
}
</style>

