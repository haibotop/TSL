<style lang="scss" rel="stylesheet/scss" scoped>
  .empty {
    height: 15px;
  }
</style>
<template>
  <div id="partingLine">
    <div class="line-box">
      <!-- <div class="empty"></div> -->
      <div :style="style" class="line"></div>
      <!-- <div class="empty"></div> -->
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'partingLine',
    props: {
      config: [String, Object]
    },
    computed: {
      config1 () {
        if (this.config) {
          return this.config
        } else {
          return {}
        }
      },
      style () {
        return `border-bottom: ${this.config1.size}px ${this.config1.type} ${this.config1.color};margin: ${this.config1.verticalMargin}px ${this.config1.horizontalMargin}px;`
      }
    }
  }
</script>
