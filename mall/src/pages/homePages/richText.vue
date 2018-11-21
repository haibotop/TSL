<template>
  <div id="richText">
    <!-- <scroller lock-x ref="scroller" height="-90"> -->
    <div class="rich-wrapper">
      <div id="richContent" v-html="config">

      </div>
    </div>
    <!-- </scroller> -->
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'richText',
    data () {
      return {
        richText: ''
      }
    },
    props: {
      config: String
    },
    mounted: function () {
      console.log(this.config)
      // document.getElementById('richContent').innerHTML = this.config
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
#richText img {
  display: block;
  width: 100% !important;
}
.rich-wrapper {
  overflow-x: visible;
  overflow-y: scroll;
}
</style>

