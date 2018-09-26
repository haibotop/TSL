<style lang="scss" rel="stylesheet/scss" scoped>
  .empty {
    width: 100%
  }
</style>
<template>
  <div id="emptySeat">
    <div class="empty" :style="style"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'emptySeat',
    props: {height: Number},
    computed: {
      style () {
        return `height: ${this.height}px`
      }
    }
  }
</script>
