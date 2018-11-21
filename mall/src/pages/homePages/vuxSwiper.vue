<template>
  <div id="vuxSwiper">
    <swiper
    v-if="init"
    :list="list"
    :show-desc-mask="false"
    dots-position="center"
    :auto="true"
    :loop="true"
    :interval="5000"
    :aspect-ratio="ratio"></swiper>
    <img ref="img1" @load="setHeight" style="width:100%" v-show="false" :src="list[0] ? list[0].img : ''" alt="">
  </div>
</template>
<script script="text/ecmascript-6">
import { Swiper } from 'vux'
export default {
  components: { Swiper },
  props: {
    config: Array
  },
  data () {
    return {
      init: false,
      ratio: ''
    }
  },
  methods: {
    setHeight () {
      this.ratio = this.$refs.img1.height / this.$refs.img1.width
      this.init = true
    }
  },
  computed: {
    list () {
      let list = []
      for (let i of this.config) {
        list.push({
          url: i.linkObj.link,
          img: i.img[0].url
        })
      }
      return list
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

