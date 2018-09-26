<template>
  <div>
    <component v-bind:is="page"></component>
  </div>
</template>
<script type="text/ecmascript-6">
  import selectCate from './selectCate.vue'
  // import addProduct from './addProduct.vue'
  import addProduct from './addProduct_.vue'
  export default {
    components: {
      selectCate,
      addProduct
    },
    data () {
      return {
        page: 'selectCate',
        currCate: {
  //        cate3: {
  //          id: '110777389350465536'
  //        },
  //        path: '衣服1>>袜子>>长袜1'
        }
      }
    }
  }
</script>
