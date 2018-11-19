<style lang="scss" rel="stylesheet/scss" scoped>
  #pdSwiper {
    width: 100%;
  }
  .my-swiper {
    position: relative;
    overflow: hidden;
  }
  // 轮播
  .swiper-item {
    position: absolute;
    top: 0px;
  }
  .swiper-video {
    background-color: #dddee1;
    .controls {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      z-index: 9999999999;
      .controls-sub {
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: 0px;
        left: 0px;
        background: -prefix-linear-zgradient(top, transparent, rgba(0, 0, 0, 0.4));
        background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
      }
      .current-time {
        margin: 0px 0px 0px 5px;
        vertical-align: middle;
        color: #fff;
      }
      .progress-wrapper {
        display: inline-block;
        position: relative;
        width: calc(100% - 120px);
        height: 5px;
        border-radius: 5px;
        background-color: rgba(255,255,255,0.5);
      }
      .progress-inner {
        display: block;
        height: 5px;
        background: #352665;
        border-radius: 5px;
      }
      .progress-point {
        width: 15px;
        height: 15px;
        background-color: #fff;
        position: absolute;
        top: -5px;
        margin: 0px 0px 0px -2.5px;
        border-radius: 50%;
        overflow: hidden;
      }
      .duration-time {
        vertical-align: middle;
        margin: 0px 0px 0px 10px;
        color: #fff;
      }
      .full-screen {
        display: inline-block;
        width: 25px;
        height: 25px;
        vertical-align: middle;
        img {
          width: 100%;
        }
      }
    }
    .play-icon, .pause-icon {
      position: absolute;
      width: 60px;
      height: 60px;
      overflow: hidden;
      top: calc(50% - 30px);
      left: calc(50% - 30px);
      background-color: rgba(0,0,0,0.5);
      border-radius: 50%;
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .swiper-img {
    background: #dddee1;
    overflow: hidden;
    img {
      display: block;
      width: 100%
    }
  }
  // 底部tab
  .sub-tabs {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 40px;
    left: 0px;
  }
  .tab {
    margin: 0px 10px;
    display: inline-block;
    width: 40px;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  // 右下图片页数
  .page-tab {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
  }
</style>
<style>
#pdSwiper video::-webkit-media-controls-enclosure {
  /*禁用播放器控制栏的样式*/
  display: none !important;
}
</style>
<template>
  <div id="pdSwiper">
    <div class="my-swiper" :style="wh" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
      <!-- 滑动区域 -->
      <div class="swiper-item" v-for="(item, index) in data1" :key="index" :style="swiperItem1[index]">
        <div class="swiper-video" v-if="item.type === 'video'" :style="wh" id="videoItem" ref="videoItem" @click="videoClickEvents">
          <video :src="item.data" :width="`${width}px`" :height="`${height}px`"></video>
          <div class="controls" v-show="controlsFlag">
            <span class="play-icon" v-show="!playing"><img id="playIcon" src="../assets/icons/play.png" alt=""></span>
            <span class="pause-icon" v-show="playing"><img id="pauseIcon" src="../assets/icons/pause.png" alt=""></span>
            <div class="controls-sub">
              <span class="current-time">{{currentTimeStr}}</span>
              <span class="progress-wrapper">
                <span class="progress-inner" :style="`width:${currentPercent}%;background:${color},`"></span>
                <span class="progress-point" :style="`left:${currentPercent}%;`"></span>
              </span>
              <span class="duration-time">{{durationStr}}</span>
              <span class="full-screen" v-show="!fulling"><img src="../assets/icons/fullscreen.png" alt=""></span>
              <span class="full-screen" v-show="fulling"><img src="../assets/icons/narrow.png" alt=""></span>
            </div>
          </div>
        </div>
        <div class="swiper-img" v-if="item.type === 'img'" :style="wh">
            <a :href="item.link"></a>
            <img :src="item.src" alt="">
        </div>
      </div>
      <!-- 视频/图片tabs -->
      <div class="sub-tabs" :style="subTabs">
        <span class="tab" :style="subTab1" @click="goVideoTab">视频</span>
        <span class="tab" :style="subTab2" @click="goImgTab">图片</span>
      </div>
      <!-- 图片页数 -->
      <div class="page-tab tab" v-show="pageTabFlag">{{imgIndex}}/{{imgPages}}</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  let interval // 轮播动画
  let videoInterval // 视频当前时间
  let dorationInterval // 视频总时间
  export default {
    name: 'pdSwiper',
    data () {
      return {
        width: 0,
        // height: 0,
        transition: 300,
        data1: [
          {
            type: 'video',
            img1: '',
            img2: '',
            data: 'http://www.w3school.com.cn/i/movie.ogg'
          },
          {
            type: 'img',
            src: 'http://www.w3school.com.cn/i/eg_tulip.jpg',
            link: ''
          },
          {
            type: 'img',
            src: 'http://www.w3school.com.cn/i/eg_compman.gif',
            link: ''
          }
        ],
        // -------------- swiper -----------------
        x1: 0, // touch起始坐标X
        y1: 0, // touch起始坐标Y
        x2: 0,
        y2: 0,
        offsetX: 0, // 偏移值
        offsetX1: 0, // 滑动未释放时的偏移值
        // -------------- video -----------------
        controlsFlag: false,
        playing: false,
        fulling: false,
        currentTimeStr: '00:00',
        currentPercent: 0,
        durationStr: '00:00',
        color: '#352665'
      }
    },
    props: {
      ratio: Number
    },
    mounted: function () {
      this.width = this.$el.clientWidth
      this.setDurationStr()
    },
    methods: {
      touchstart (e) {
        clearInterval(interval)
        this.x1 = e.touches[0].pageX
        this.y1 = e.touches[0].pageY
        if (this.offsetX1 !== 0) {
          // 将上次终止滑动的偏移值算入起点
          this.x1 -= this.offsetX1
        }
      },
      touchmove (e) {
        if (this.data1.length < 2) {
          return
        }
        let w = e.touches[0].pageX - this.x1
        let h = e.touches[0].pageY - this.y1
        if (w > 0) {
          // 向右
          if (this.offsetX === 0) {
            return
          }
        } else {
          // 向左
          if (this.offsetX === this.width * (this.data1.length - 1) * -1) {
            return
          }
        }
        if (Math.abs(w) > Math.abs(h)) {
          this.offsetX1 = w
        }
      },
      touchend (e) {
        // 偏移值大于4分一，进行轮播切换，否则还原
        if (Math.abs(this.offsetX1) > this.width / 4) {
          this.pause()
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
      videoClickEvents (e) {
        console.log(e)
        if (e.target === this.$refs.videoItem[0].children[0] || e.target === this.$refs.videoItem[0].children[1]) {
          this.controlsFlag = !this.controlsFlag
        }
        if (e.target.id === 'playIcon' || e.target.className === 'play-icon') {
          this.play()
        }
        if (e.target.id === 'pauseIcon' || e.target.className === 'pause-icon') {
          this.pause()
        }
        if (e.target.className === 'progress-wrapper') {
          let p = e.offsetX / e.target.clientWidth
          this.currentPercent = p * 100
          document.getElementById('videoItem').children[0].currentTime = document.getElementById('videoItem').children[0].duration * p
        }
        if (e.target.className === 'progress-inner') {
          let p = e.offsetX / e.target.parentElement.clientWidth
          this.currentPercent = p * 100
          console.log(p)
          document.getElementById('videoItem').children[0].currentTime = document.getElementById('videoItem').children[0].duration * p
        }
        if (e.target.parentElement.className === 'full-screen') {
          this.fulling = !this.fulling
        }
      },
      play () {
        videoInterval = setInterval(() => {
          this.setCurrentTimeStr()
        }, 0)
        this.playing = true
        if (this.$refs.videoItem) {
          this.$refs.videoItem[0].children[0].play()
        }
      },
      pause () {
        clearInterval(videoInterval)
        this.playing = false
        if (this.$refs.videoItem) {
          this.$refs.videoItem[0].children[0].pause()
        }
      },
      fullScreen () {
        let docElm = document.getElementById('videoItem').children[0]
        if (docElm.requestFullscreen) {
          // W3C
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          // FireFox
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          // Chrome等
          docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          // IE11
          docElm.msRequestFullscreen()
        }
      },
      exitFull () {
        // let docElm = document.getElementById('videoItem').children[0]
        // if (docElm.exitFullscreen) {
        //   docElm.exitFullscreen()
        // } else if (docElm.msExitFullscreen) {
        //   docElm.msExitFullscreen()
        // } else if (docElm.mozCancelFullScreen) {
        //   docElm.mozCancelFullScreen()
        // } else if (docElm.webkitCancelFullScreen) {
        //   docElm.webkitCancelFullScreen()
        // }
        // W3C Chrome等 FireFox IE11
        let exitMethod = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.webkitExitFullscreen
        if (exitMethod) {
          exitMethod.call(document)
        }
      },
      // 视频中的当前播放位置-秒
      setCurrentTimeStr () {
        if (document.getElementById('videoItem')) {
          let time = document.getElementById('videoItem').children[0].currentTime
          let minute = time / 60 < 10 ? `0${parseInt(time / 60)}` : `${parseInt(time / 60)}`
          let second = time % 60 < 10 ? `0${parseInt(time % 60)}` : `${parseInt(time % 60)}`
          this.currentTimeStr = `${minute}:${second}`
          this.currentPercent = time / document.getElementById('videoItem').children[0].duration * 100
          if (this.currentPercent === 100) {
            this.pause()
          }
        } else {
          this.currentTimeStr = '00:00'
          this.currentPercent = 0
        }
      },
      // 视频中的总时间-秒
      setDurationStr () {
        dorationInterval = setInterval(() => {
          if (document.getElementById('videoItem').children[0].duration) {
            let time = document.getElementById('videoItem').children[0].duration
            let minute = time / 60 < 10 ? `0${parseInt(time / 60)}` : `${parseInt(time / 60)}`
            let second = time % 60 < 10 ? `0${parseInt(time % 60)}` : `${parseInt(time % 60)}`
            this.durationStr = `${minute}:${second}`
            clearInterval(dorationInterval)
          }
        }, 0)
      },
      goVideoTab () {
        if (this.offsetX !== 0) {
          this.offsetX = 0
          this.controlsFlag = true
          this.play()
        }
      },
      goImgTab () {
        if (this.offsetX === 0) {
          this.pause()
          this.offsetX = this.width * -1
        }
      }
    },
    computed: {
      height () {
        return parseInt(this.width / (this.ratio || 1))
      },
      wh () {
        if (this.width && this.height) {
          return `width: ${this.width}px;height: ${this.height}px;`
        } else {
          return ''
        }
      },
      // 计算滚动
      swiperItem1 () {
        let items = []
        for (let i in this.data1) {
          items.push(`transform: translate(${i * this.width + this.offsetX + this.offsetX1}px, 0px);`)
        }
        return items
      },
      // 每次执行interval滚动距离
      step () {
        return this.width / 30
      },
      // 视频/图片底部位置
      subTabs () {
        if (this.data1.length === 0) {
          return 'display: none;'
        } else {
          if (this.data1[0].type !== 'video') {
            return 'display: none;'
          } else if (this.offsetX === 0) {
            if (this.controlsFlag) {
              return 'bottom: 40px;'
            } else {
              return 'bottom: 20px;'
            }
          } else {
            return 'bottom: 20px;'
          }
        }
      },
      subTab1 () {
        if (this.data1.length === 0) {
          return ''
        } else {
          if (this.data1[0].type !== 'video') {
            return ''
          } else if (this.offsetX === 0) {
            return `background-color: ${this.color};color:#fff;`
          } else {
            return ''
          }
        }
      },
      subTab2 () {
        if (this.data1.length === 0) {
          return ''
        } else {
          if (this.data1[0].type !== 'video') {
            return ''
          } else if (this.offsetX === 0) {
            return ''
          } else {
            return `background-color: ${this.color};color:#fff;`
          }
        }
      },
      // 图片分页显示
      pageTabFlag () {
        if (this.data1.length === 0) {
          return false
        } else {
          if (this.data1[0].type !== 'video') {
            return true
          } else if (this.offsetX !== 0) {
            return true
          } else {
            return false
          }
        }
      },
      // 图片数量
      imgPages () {
        if (this.data1.length === 0) {
          return 0
        } else {
          let pages = this.data1.length
          if (this.data1[0].type === 'video') {
            pages -= 1
          }
          return pages
        }
      },
      // 图片下标
      imgIndex () {
        if (this.data1.length === 0) {
          return 0
        } else {
          let index = 0
          index = Math.abs(parseInt(this.offsetX / this.width))
          index += 1
          if (this.data1[0].type === 'video') {
            index -= 1
          }
          return index
        }
      }
    },
    watch: {
      fulling (flag) {
        if (flag) {
          this.fullScreen()
        } else {
          this.exitFull()
        }
      }
    }
  }
</script>

