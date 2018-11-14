<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
      <transition name="vux-fade">
        <inline-loading class="router-loading" v-show="isRouterLoading"></inline-loading>
      </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { InlineLoading } from 'vux'
// import * as pageAPI from '@/services/API/homePage.es6'

export default {
  name: 'app',
  components: {
    InlineLoading
  },
  data () {
    return {
      isRouterLoading: true
    }
  },
  mounted () {
    // console.log('打开了app！')
    window.addEventListener(
      'onorientationchange' in window ? 'orientationchange' : 'resize',
      function () {
        window.location.reload()
      },
      false
    )
    setTimeout(() => {
      this.isRouterLoading = false
    }, 200)
    this.$router.beforeEach((to, from, next) => {
      this.isRouterLoading = true
//      if (to.name === 'home' && from.name === 'login') {
//        to.meta.keepAlive = false
//      }
      next()
    })
    this.$router.afterEach((to, form, next) => {
      setTimeout(() => {
//        if (to.name === 'home') {
//          to.meta.keepAlive = true
//        }
        this.isRouterLoading = false
      }, 200)
    })

    // this.$http.get(...pageAPI.getHome()).then(res => {
    //   if (res.data.code === 200) {
    //     console.log(res.data.template.friendContent, res.data.template.friendCircleContent)
    //   }
    // })
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "~vux/src/styles/reset";
</style>
<style lang="scss" rel="stylesheet/scss">
@import "styles/global";
#app {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
