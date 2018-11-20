<style lang="scss" rel="stylesheet/scss" scoped>
  #editEmptySeat {
    width: 400px;
  }
</style>
<template>
  <div id="editEmptySeat">
    空白高度：
    <slider v-model="height" show-input :min="1" :max="100"></slider>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'editEmptySeat',
    props: {
      value: [String, Number]
    },
    computed: {
      height: {
        get () {
          if (this.value) {
            return this.value
          } else {
            this.height = 30
            return 30
          }
        },
        set (val) {
          this.$emit('change', val)
          this.$emit('input', val)
        }
      }
    }
  }
</script>