<style lang="scss" rel="stylesheet/scss" scoped>
  #editEmptySeat {
    width: 400px;
  }
</style>
<template>
  <div id="editEmptySeat">
    空白高度：
    <slider v-model="height"></slider>
    <InputNumber :min="0" :max="100" v-model="height"></InputNumber >
    </Row>
    
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'editEmptySeat',
    data () {
      return {
        height: 30
      }
    },
    watch: {
      height (newV) {
        this.$emit('change', newV)
      }
    }
  }
</script>