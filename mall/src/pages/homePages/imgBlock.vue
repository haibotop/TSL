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
      <a :href="link"><img :src="img" alt=""></a>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'imgBlock',
    props: {
      config: [String, Object]
    },
    computed: {
      img () {
        if (this.config) {
          return this.config.img[0].url
        } else {
          return ''
        }
      },
      link () {
        if (this.config) {
          return this.config.linkObj.linkModel === '0' ? `/#${this.config.linkObj.link}` : this.config.linkObj.link
        } else {
          return 'javascript:'
        }
      }
    }
  }
</script>
