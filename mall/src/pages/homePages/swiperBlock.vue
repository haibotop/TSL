<template>
  <div id="swiperBlock">
    <div class="my-swiper" :style="wh" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
      <!-- 滑动区域 -->
      <div class="swiper-item" v-for="(item, index) in data1" :key="index" :style="swiperItem1[index]">
        <div class="swiper-img" v-if="item.type === 'img'">
            <a :href="item.link"><img :src="item.src" alt=""></a>
        </div>
      </div>
      <div class="sub-point-bar">
        <i v-for="(item, index) in data1" :key="index" :class="subPointClass[index]"></i>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  let interval // 轮播动画
  // let timeout1
  let timeout2
  // let interval2 // 取图片高度
  export default {
    name: 'swiperBlock',
    data () {
      return {
        width: 0,
        imgHeight: 0,
        transition: 300,
        // -------------- swiper -----------------
        x1: 0, // touch起始坐标X
        y1: 0, // touch起始坐标Y
        x2: 0, // 100ms后的坐标x
        y2: 0, // 100ms后的坐标y
        offsetX: 0, // 偏移值
        offsetX1: 0, // 滑动未释放时的偏移值
        // -------------- video -----------------
        controlsFlag: false,
        playing: false,
        fulling: false,
        currentTimeStr: '00:00',
        currentPercent: 0,
        durationStr: '00:00',
        color: '#352665',
        interval2: ''
      }
    },
    props: {
      config: Array,
      ratio: Number // 比例
    },
    mounted: function () {
      this.width = this.$el.clientWidth
      this.interval2 = setInterval(() => {
        if (document.getElementsByClassName('swiper-item')) {
          this.imgHeight = document.getElementsByClassName('swiper-item')[0].offsetHeight
          if (this.imgHeight > 0) {
            clearInterval(this.interval2)
          }
        } else {
          clearInterval(this.interval2)
        }
      })
      setTimeout(() => {
        clearInterval(this.interval2)
      }, 1000)
    },
    methods: {
      touchstart (e) {
        e ? e.cancelBubble = true : e.stopPropagation()
        // e ? e.cancelBubble = false : e.preventDefault()
        // this.$parent.$parent.disablePullup()
        clearInterval(interval)
        this.x1 = e.touches[0].pageX
        this.y1 = e.touches[0].pageY
        if (this.offsetX1 !== 0) {
          // 将上次终止滑动的偏移值算入起点
          this.x1 -= this.offsetX1
        }
      },
      touchmove (e) {
        // e ? e.cancelBubble = true : e.stopPropagation()
        if (this.data1.length < 2) {
          return
        }
        // if (this.x2 === 0 && !timeout1) {
        //   timeout1 = setTimeout(() => {
        //     this.x2 = e.touches[0].pageX - this.offsetX1
        //     this.y2 = e.touches[0].pageY
        //   }, 10)
        // }
        this.x2 = e.touches[0].pageX - this.offsetX1
        this.y2 = e.touches[0].pageY
        let w = e.touches[0].pageX - this.x1
        let h = e.touches[0].pageY - this.y1
        if (this.x2) {
          if (Math.abs(this.x2 - this.x1) > Math.abs(this.y2 - this.y1)) {
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
            this.offsetX1 = w
          } else {
            console.log(h)
            // this.$parent.reset({top: h > 40 ? -40 : -h})
          }
        }
      },
      touchend (e) {
        clearTimeout(timeout2)
        timeout2 = setTimeout(() => {
          // this.$parent.enablePullup()
        }, 30)
        this.x2 = 0
        this.y2 = 0
        // clearTimeout(timeout1)
        // timeout1 = ''
        // 偏移值大于4分一，进行轮播切换，否则还原
        if (Math.abs(this.offsetX1) > this.width / 4) {
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
      }
    },
    computed: {
      data1 () {
        if (this.config) {
          let arr = []
          for (let i of this.config) {
            arr.push({
              type: 'img',
              src: i.img[0].url,
              link: i.linkObj.linkModel === '0' ? `/#${i.linkObj.link}` : i.linkObj.link
            })
          }
          return arr
        } else {
          return []
        }
      },
      subPointClass () {
        let className = []
        let index = (this.offsetX && this.width) ? Math.abs(parseInt(this.offsetX / this.width)) : 0
        for (let i in this.data1) {
          parseInt(i) === index ? className[i] = 'sub-point-active' : className[i] = 'sub-point-default'
        }
        return className
      },
      height () {
        if (this.ratio) {
          return parseInt(this.width / this.ratio)
        } else if (this.imgHeight) {
          return this.imgHeight
        } else {
          return this.width
        }
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
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #swiperBlock {
    background-color: #fff;
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
    width: 100%;
  }
  .swiper-img {
    background: #dddee1;
    overflow: hidden;
    img {
      display: block;
      width: 100%
    }
  }
  .sub-point-bar {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 30px;
    text-align: center;
    .sub-point-default, .sub-point-active {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin: 0px 5px;
      background-color: #000;
      opacity: .2;
    }
    .sub-point-active {
      background-color: #007aff;
      // background-color: $tsl-color;
      opacity: 1;
    }
  }
</style>

