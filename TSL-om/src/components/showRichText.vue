<template>
  <div id="showRichText">

  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'showRichText',
    props: {
      config: {
        default: '',
        type: String
      }
    },
    mounted: function () {
      this.$el.innerHTML = this.config
    },
    watch: {
      config (newV, oldV) {
        if (newV !== oldV) {
          this.$el.innerHTML = this.config
        }
      }
    }
  }
</script>
<style>
  #showRichText {
    min-height: 30px;
  }
  #showRichText img {
    display: block;
    width: 100%;
  }
</style>

