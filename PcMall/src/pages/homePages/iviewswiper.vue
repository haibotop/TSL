<template>
  <div id="iviewSwiper">
    <Carousel autoplay loop :height="562">
      <CarouselItem v-for="(item, index) in list" :key='index'>
        <div class="swiper-img">
            <router-link tag="a" :to="item.url">
              <img :src="item.img" alt="">
            </router-link>
        </div>
      </CarouselItem>
    </Carousel>
    <img ref="img1" @load="setHeight" style="width:100%;height: 307px;" v-show="false" :src="list[0] ? list[0].img : ''" alt="">
  </div>
</template>
<script script="text/ecmascript-6">
// import { Carousel } from 'iview'
export default {
  // components: { Carousel },
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
  // 轮播
  .swiper-img {
    width: 100%;
    height: 100%;
    img{
      width:100%;
      height:100%;
    }
  }
</style>

