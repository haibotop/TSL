<style lang="scss" rel="stylesheet/scss" scoped>
</style>
<template>
  <div id="productLink">
    <selectProduct v-model="flag" :pNum="-4" @on-select="getLink"></selectProduct>
  </div>
</template>
<script type="text/ecmascript-6">
  import selectProduct from '../selectProduct.vue'
  export default {
    name: 'productLink',
    components: {
      selectProduct
    },
    data () {
      return {
        totalSize: 0
      }
    },
    props: {
      value: [Boolean]
    },
    methods: {
      getLink (val) {
        console.log(1, val)
        if (val[0]) {
          this.$emit('selected', {
            link: `/pd/${val[0].defaultSkuId}`,
            linkName: val[0].skuName
          })
        }
      }
    },
    computed: {
      flag: {
        get () {
          if (this.value) {
            return this.value
          } else {
            return false
          }
        },
        set (flag) {
          this.$emit('input', flag)
        }
      }
    }
  }
</script>