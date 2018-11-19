<style lang="scss" rel="stylesheet/scss" scoped>
#swiperBlock {
  min-height: 30px;
}
.swiper-slide {
  text-align: center;
  font-size: 38px;
  font-weight: 700;
  background-color: #eee;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  float: left;
  img {
    width: 100%;
    display: block;
  }
}
</style>
<style>
#swiperBlock .swiper-pagination {
  width: 100%;
  bottom: 0px;
}
#swiperBlock .swiper-pagination-bullet {
  margin: 0px 4px;
}
</style>
<template>
  <div id="swiperBlock">
    <swiper :options="swiperOption" ref="swiperBlock">
      <swiper-slide v-for="(item, index) in imgs" :key="index">
        <img :src="item.img" alt="">
      </swiper-slide>
      <!-- <span class="swiper-pagination" slot="pagination"></span> -->
    </swiper>
    <span class="swiper-pagination" slot="pagination" v-show="imgs.length !== 0"></span>
  </div>
</template>
<script type="text/ecmascript-6">
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: 'swiperBlock',
    components: {
      swiper,
      swiperSlide
    },
    props: {
      config: [Array, String]
    },
    data () {
      return {
        swiperOption: {
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象
          // 假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper http://www.swiper.com.cn/api/start/new.html
          autoplay: 3000,
          direction: 'horizontal',
          setWrapperSize: true,
          preloadImages: true,
          autoHeight: true,
          uniqueNavElements: false,
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets'
          },
          // 当前页面可容纳slider数
          // slidesPerView: 3,
          // effect: 'coverflowEffect',
          // coverflowEffect: {
            // slide做3d旋转时Y轴的旋转角度
            // rotate: 50,
            // 每个slide之间的拉伸值，越大slide靠得越紧
            // stretch: 0,
            // slide的位置深度。值越大z轴距离越远，看起来越小
            // depth: 0,
            // depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，
            // 值越大这三个参数的效果越明显。
            // modifire: 1,
            // 产生了3d旋转的slide是否使用阴影
            // shadowms: true
          // },
          init: true
        }
      }
    },
    computed: {
      imgs () {
        if (this.config) {
          console.log(this.config)
          let imgs = []
          for (let i of this.config) {
            if (i.img.length > 0) {
              let img = {
                img: i.img[0].url,
                link: i.linkObj.link
              }
              imgs.push(img)
            }
          }
          return imgs
        } else {
          return []
        }
      }
    }
  }
</script>

