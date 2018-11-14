<template>
  <div id="pdSwiper">

    <!-- vue-video -->

    <div class="my-swiper" :style="`height: ${height}px;background-color: ${swiperBk}`">
      <div class="my-swiper-item" :style="itemsStyle[0]" v-show="hasVideo">
        <div class="video-item"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend">
          <plyr-video
            ref="plyr"
            v-show="videoFlag"
            :poster="video.poster"
            :videos="video.sources"
            crossorigin
            :width="width"
            :style="{height:`${height}px`,background:'#ffffff'}"></plyr-video>
        </div>
      </div>
      
      <div class="my-swiper-item" :style="itemsStyle[1]">
        <div class="vux-swiper-item"  @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
          <swiper :list="imgs" :show-dots="false" :show-desc-mask="false" :height="`${height}px`" v-model="vuxSwiperIndex">

          </swiper>
        </div>
      </div>

    </div>
    <div class="dots-area">
      <div class="dots-bar" v-show="hasVideo ? offsetX < 0 : imgs.length">
        <a href="javascript:" v-for="(item, index) of imgs" :key="index">
          <span v-show="index === vuxSwiperIndex" class="dots active-dots"></span><span v-show="index !== vuxSwiperIndex" class="dots"></span>
        </a>
      </div>
      <div v-show="offsetX === 0 && hasVideo" class="dots-tab tab1">视频</div>
      <div @click="scrollToImg" v-show="offsetX === 0 && hasVideo" class="dots-tab tab2">图片</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  let interval // 轮播动画
  let timeout // 判断左右
  import * as colorTool from '@/services/color.es6'
  import { PlyrVideo } from 'vue-plyr'
  import { Swiper, debounce } from 'vux'
  import 'vue-plyr/dist/vue-plyr.css'
  export default {
    name: 'pdSwiper',
    components: { Swiper, debounce, PlyrVideo },
    props: {
      data1: Array,
      ratio: Number // 比例
    },
    data () {
      return {
        video: {
          sources: [
            // {
              // src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
              // format: 'mp4'
            // }
          ],
          poster: require('../../assets/images/default_video_img.png')
        },
        // data1: [
        //   {type: 'video', data: 'http://www.w3school.com.cn/i/movie.ogg'},
        //   {type: 'img', src: 'http://isoftstone.b0.upaiyun.com/uploads/images/1515747603697.jpg', link: ''},
        //   {type: 'img', src: 'http://isoftstone.b0.upaiyun.com/uploads/images/1515747603697.jpg', link: ''}
        // ],
        width: 0,
        x1: 0, // touch起始坐标X
        y1: 0, // touch起始坐标Y
        offsetX: 0, // 偏移值
        offsetX1: 0, // 滑动未释放时的偏移值
        vuxSwiperIndex: 0,
        color: '#352665',
        // 渐变颜色
        colorArr: [],
        videoFlag: true
      }
    },
    mounted: function () {
      this.colorArr = colorTool.gradientColor('#000000', '#ffffff', 10)
      this.width = this.$el.clientWidth
    },
    methods: {
      touchstart (e) {
        if (!this.hasVideo) {
          return
        }
        clearInterval(interval)
        this.x1 = e.touches[0].pageX
        this.y1 = e.touches[0].pageY
        if (this.offsetX1 !== 0) {
          // 将上次终止滑动的偏移值算入起点
          this.x1 -= this.offsetX1
        }
      },
      touchmove (e) {
        if (!this.hasVideo) {
          return
        }
        if (this.x2 === 0 && !timeout) {
          timeout = setTimeout(() => {
            this.x2 = e.touches[0].pageX - this.offsetX1
            this.y2 = e.touches[0].pageY
          }, 10)
        }
        let w = e.touches[0].pageX - this.x1
        if (this.x2) {
          // console.log(this.$refs.plyr)
          this.$refs.plyr.player.pause()
          if (w > 0) {
            // 右拉
            if (this.offsetX === 0) {
              return
            }
            if (this.vuxSwiperIndex !== 0) {
              return
            }
          } else {
            // 左拉
            if (this.offsetX === this.width * -1) {
              return
            }
          }
          this.offsetX1 = w
        }
      },
      touchend (e) {
        this.x2 = 0
        this.y2 = 0
        clearTimeout(timeout)
        timeout = ''
        // 偏移值大于5分一，进行轮播切换，否则还原
        if (Math.abs(this.offsetX1) > this.width / 5) {
          // this.pause()
          interval = setInterval(() => {
            if (parseInt(this.offsetX1) !== this.width) {
              if (this.offsetX1 > 0) {
                this.offsetX1 += this.step * 3
                if (this.offsetX1 >= this.width) {
                  this.offsetX1 = 0
                  this.offsetX += this.width
                  clearInterval(interval)
                }
              } else {
                this.offsetX1 -= this.step * 3
                if (this.offsetX1 <= -1 * this.width) {
                  this.offsetX1 = 0
                  this.offsetX -= this.width
                  clearInterval(interval)
                }
              }
            }
          }, 30)
        } else {
          interval = setInterval(() => {
            if (parseInt(this.offsetX1) !== 0) {
              if (this.offsetX1 > 0) {
                this.offsetX1 -= this.step * 2
                if (this.offsetX1 < 0) {
                  this.offsetX1 = 0
                  clearInterval(interval)
                }
              } else {
                this.offsetX1 += this.step * 2
                if (this.offsetX1 > 0) {
                  this.offsetX1 = 0
                  clearInterval(interval)
                }
              }
            }
          }, 30)
        }
      },
      scrollToVideo () {
        clearInterval(interval)
        interval = setInterval(() => {
          this.offsetX1 += this.step * 3
          if (this.offsetX1 >= this.width) {
            this.offsetX1 = 0
            this.offsetX += this.width
            clearInterval(interval)
          }
        }, 30)
      },
      scrollToImg () {
        if (this.$refs.plyr) {
          this.$refs.plyr.player.pause()
        }
        clearInterval(interval)
        interval = setInterval(() => {
          this.offsetX1 -= this.step * 3
          if (this.offsetX1 <= -1 * this.width) {
            this.offsetX1 = 0
            this.offsetX -= this.width
            clearInterval(interval)
          }
        }, 30)
      },
      btnEvent (flag) {
        if (this.$refs.plyr) {
          if (flag) {
            this.$refs.plyr.player.play()
          } else {
            this.$refs.plyr.player.pause()
          }
        }
      },
      hideVideo (flag) {
        if (flag) {
          this.videoFlag = false
        } else {
          this.videoFlag = true
        }
      }
    },
    computed: {
      imgs () {
        let imgs = []
        if (this.data1.length > 0) {
          this.data1.forEach(e => {
            if (e.type === 'img') {
              if (this.video.poster === '') {
                this.video.poster = e.src
              }
              imgs.push({img: e.src, url: e.link, title: ''})
            } else {
              console.log('this', this)
              this.video.sources.push({
                src: e.data,
                format: 'mp4'
              })
            }
          })
        }
        return imgs
      },
      height () {
        return this.width * 0.9
      },
      step () {
        return this.width / 30
      },
      itemsStyle () {
        if (this.hasVideo) {
          return [
            `transform: translate(${0 * this.width + this.offsetX + this.offsetX1}px, 0px);`,
            `transform: translate(${1 * this.width + this.offsetX + this.offsetX1}px, 0px);`
          ]
        } else {
          return ['', 'left: 0px']
        }
      },
      swiperBk () {
        if (this.colorArr.length > 0 && this.hasVideo) {
          if (this.offsetX1 !== 0) {
            let a = this.width / this.colorArr.length
            let b = Math.abs(this.offsetX1 / a)
            let colorArr = JSON.parse(JSON.stringify(this.colorArr))
            if (this.offsetX1 > 0) {
              colorArr = colorArr.reverse()
            }
            return colorArr[Math.floor(b)]
          } else {
            return this.offsetX === 0 ? '#000' : '#fff'
          }
        } else {
          return '#fff'
        }
      },
      hasVideo () {
        return this.video.sources.length !== 0 && true
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.my-swiper {
  position: relative;
  .my-swiper-item {
    position: absolute;
    top: 0px;
    width: 100%;
  }
}
.my-swiper-item {
  height: 100%;
}
.vux-swiper-item {
  width: 90%;
  margin: 0px auto;
}
.dots-area {
  height:30px;
  background-color:#fff;
  text-align: center;
  position: relative;
  .dots {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
    background-color: #999;
    margin: 0 5px;
  }
  .active-dots {
    background-color: $tsl-color;
  }
  .dots-tab {
    position: absolute;
    top: 4px;
    font-size: 12px;
    width: 40px;
    height: 20px;
    border-radius: 5px;
  }
  .tab1 {
    right: 55px;
    color: $tsl-color;
    border: 1px solid $tsl-color;
  }
  .tab2 {
    right: 5px;
    color: #999;
    border: 1px solid #999;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
#pdSwiper #app {
  width: 100%;
  height: 100%;
  .container {
    width: 100%;
    height: 100%;
    .__cov-video-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

