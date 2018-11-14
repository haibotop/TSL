<template>
  <div id="pdSwiper">
    <div class="my-swiper" :style="`height: ${height}px;background-color: ${swiperBk}`">
      <div class="my-swiper-item" :style="itemsStyle[0]" v-show="video">
        <div class="video-item"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend">
          <video
            v-show="!btnFlag"
            ref="video"
            controls
            preload
            @loadeddata="onloadeddata"
            @pause="onpause"
            @ended="onended"
            :src="video"
            :height="height"
            style="margin: 0px auto;display:block;"></video>
          <x-icon v-show="readyFlag && !playFlag && btnFlag" @click="playFlag = true" type="play" size="40" style="fill:#fff;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);z-index:10;"></x-icon>
          <x-icon v-show="!readyFlag && btnFlag" type="load-a" size="40" style="fill:#fff;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);z-index:10;"></x-icon>
          <div v-show="btnFlag" class="mask"></div>
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
      <div class="dots-bar">
        <a href="javascript:" v-for="(item, index) of imgs" :key="index" v-show="offsetX">
          <span v-show="index === vuxSwiperIndex" class="dots active-dots"></span><span v-show="index !== vuxSwiperIndex" class="dots"></span>
        </a>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  let interval // 轮播动画
  let timeout1 // 判断左右
  import * as colorTool from '@/services/color.es6'
  import { Swiper, debounce } from 'vux'
  let timeout = ''
  export default {
    name: 'pdSwiper',
    components: { Swiper, debounce },
    props: {
      data1: Array,
      ratio: Number // 比例
    },
    data () {
      return {
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
        video: '',
        vuxSwiperIndex: 0,
        color: '#352665',
        // 渐变颜色
        colorArr: [],
        // 视频按钮
        btnFlag: false,
        readyFlag: false,
        playFlag: false
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
        this.playFlag = false
        if (this.x2 === 0 && !timeout1) {
          timeout1 = setTimeout(() => {
            this.x2 = e.touches[0].pageX - this.offsetX1
            this.y2 = e.touches[0].pageY
          }, 10)
        }
        let w = e.touches[0].pageX - this.x1
        if (this.x2) {
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
        clearTimeout(timeout1)
        timeout1 = ''
        // 偏移值大于5分一，进行轮播切换，否则还原
        if (Math.abs(this.offsetX1) > this.width / 5) {
          // this.pause()
          interval = setInterval(() => {
            if (parseInt(this.offsetX1) !== this.width) {
              if (this.offsetX1 > 0) {
                this.offsetX1 += this.step * 3
                if (this.offsetX1 > this.width) {
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
      btnEvent (flag) {
        if (this.$refs.video) {
          if (flag) {
            this.btnFlag = false
            if (!timeout) {
              timeout = setTimeout(() => { this.$refs.video.play() }, 500)
            } else {
              this.$refs.video.play()
            }
          } else {
            this.$refs.video.pause()
            this.btnFlag = true
          }
        }
      },
      onloadeddata () {
        this.readyFlag = true
      },
      onpause: debounce(function (flag) {
        this.playFlag = false
      }, 300),
      onended () {
        this.btnFlag = true
        this.playFlag = false
      }
    },
    computed: {
      imgs () {
        let imgs = []
        if (this.data1) {
          this.data1.forEach(e => {
            if (e.type === 'img') {
              imgs.push({img: e.src, url: e.link, title: ''})
            } else {
              this.video = e.data
            }
          })
        }
        return imgs
      },
      hasVideo () {
        if (this.video) {
          return true
        } else {
          return false
        }
      },
      height () {
        return this.width / 4 * 3
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
      }
    },
    watch: {
      playFlag (flag) {
        this.btnEvent(flag)
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
  width: 70%;
  margin: 0px auto;
}
.dots-area {
  height:30px;
  background-color:#fff;
  text-align: center;
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
}
.mask {
  width: 100%;
  height: 100%;
  background: #000;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9;
}
</style>
