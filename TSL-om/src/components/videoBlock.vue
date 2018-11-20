<style lang="scss" rel="stylesheet/scss" scoped>
  #videoBlock {
    min-height: 30px;
    position: relative;
  }
  .my-video {
    display: block;
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
  .pause-mask {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
</style>
<template>
  <div id="videoBlock">
    <video :src="videoSrc" :width="`${width}px`" class="my-video" id="myVideo"></video>
    <span class="play-icon" v-show="!playing" @click="play"><img id="playIcon" src="../assets/icons/play.png" alt=""></span>
    <!-- <span class="pause-icon" v-show="playing" @click="pause"><img id="pauseIcon" src="../assets/icons/pause.png" alt=""></span> -->
    <div class="pause-mask" v-show="playing" @click="pause"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  let interval
  export default {
    name: 'videoBlock',
    props: {
      config: [Object, String]
    },
    data () {
      return {
        width: 375,
        playing: false
      }
    },
    mounted: function () {
      this.width = this.$el.clientWidth
    },
    methods: {
      play () {
        this.playing = true
        document.getElementById('myVideo').play()
        interval = setInterval(() => {
          if (document.getElementById('myVideo').currentTime === document.getElementById('myVideo').duration) {
            this.pause()
            clearInterval(interval)
          }
        }, 0)
      },
      pause () {
        this.playing = false
        document.getElementById('myVideo').pause()
        clearInterval(interval)
      }
    },
    computed: {
      videoSrc () {
        if (this.config) {
          return this.config.video_original
        } else {
          return ''
        }
      }
    }
  }
</script>
