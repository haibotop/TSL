<style lang="scss" rel="stylesheet/scss" scoped>
  #imgBlock {
    width: 100%;
    min-height: 30px;
    .img-block {
      width: 100%;
      img {
        width: 100%;
        display: block;
      }
    }
  }
</style>
<template>
  <div id="imgBlock">
    <div class="img-block">
      <img :src="img" alt="" @click="goLink">
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'imgBlock',
    data () {
      return {
        link: ''
      }
    },
    props: {
      config: [String, Object]
    },
    methods: {
      goLink () {
        console.log(this.link)
      }
    },
    computed: {
      img () {
        if (this.config) {
          return this.config.img[0].url
        } else {
          return ''
        }
      }
    }
  }
</script>