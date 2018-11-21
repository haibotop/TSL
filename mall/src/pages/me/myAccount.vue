<template>
  <div id="myAccount">
    <x-header :left-options="{ backText: '' }" title="账户安全"></x-header>

    <group>
      <cell title="登录密码" value="修改密码" is-link link="/myPassword"></cell>
    </group>

    <group gutter="10px">
      <cell title="绑定手机" :value="showMobile"></cell>
    </group>

    <!-- <group gutter="10px">
      <cell title="第三方账号" :value="showOtherAccount"></cell>
    </group> -->
  </div>
</template>
<script type="text/ecmascript-6">
  import { XHeader, Group, Cell } from 'vux'
  export default {
    name: 'myAccount',
    components: { XHeader, Group, Cell },
    data () {
      return {
        mobile: ''
      }
    },
    mounted: function () {
      if (sessionStorage.getItem('userInfo')) {
        this.mobile = JSON.parse(sessionStorage.getItem('userInfo')).mobile
      }
    },
    computed: {
      showMobile () {
        return this.mobile ? this.mobile : ''
      },
      showOtherAccount () {
        return '未绑定'
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>

