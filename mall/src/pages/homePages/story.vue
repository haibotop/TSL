<template>
  <div>
    <x-header :left-options="leftOption">
      <div slot="default">品牌故事</div>
    </x-header>
    <!-- <scroller ref="scroller" lock-x> -->
      <iframe src="https://mp.weixin.qq.com/s/8AY2DNVvb6SXD_U9CSVIBQ" :style="mystyle"></iframe>
    <!-- </scroller> -->
  </div>
</template>
<script type="text/ecmasprict-6">
import { XHeader, Scroller } from 'vux'
export default {
  name: "story",
  components: {XHeader, Scroller},
  data() {
    return {
      leftOption: {
        backText: ''
      },
      mystyle: {
        width: '100%',
        height: '200px'
      }
    }
  },
  mounted () {
    this.mystyle.height = document.documentElement.clientHeight - 46 + 'px'
  }
};
</script>
