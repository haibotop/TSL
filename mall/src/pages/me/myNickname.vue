<template>
  <div id="myNickname">
    <x-header :left-options="{ backText: '' }" title="修改昵称"></x-header>
    <group>
      <x-input v-model.trim="name" :max="25"></x-input>
    </group>

    <x-button text="保存" :show-loading="loading" @click.native="updateNickname" style="margin: 20px auto;width: 90%;color:#352665;"></x-button>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as myAPI from '@/services/API/mineServices.es6'
  import { XHeader, Group, XInput, XButton } from 'vux'
  export default {
    name: 'myNickname',
    components: { XHeader, Group, XInput, XButton },
    data () {
      return {
        name: '',
        loading: false
      }
    },
    mounted: function () {
      if (sessionStorage.getItem('userInfo')) {
        this.name = JSON.parse(sessionStorage.getItem('userInfo')).nickName
      }
    },
    methods: {
      updateNickname () {
        if (this.loading) {
          return
        }
        this.loading = true
        if (this.name === '') {
          this.$vux.toast.show({type: 'text', text: `请输入昵称`, width: '200px'})
          this.loading = false
        } else if (this.name.length < 3) {
          this.$vux.toast.show({type: 'text', text: `昵称限输入3-25个字符`, width: '200px'})
          this.loading = false
        } else {
          this.$http.put(...myAPI.updateNickName(this.name)).then(res => {
            if (res.data.code === 200) {
              let params = JSON.parse(sessionStorage.getItem('userInfo'))
              params.nickName = this.name
              sessionStorage.setItem('userInfo', JSON.stringify(params))
              this.$vux.toast.show({type: 'text', text: `修改成功`, width: '200px'})
              this.loading = false
              this.$router.go(-1)
            }
          })
        }
      }
    }
  }
</script>
