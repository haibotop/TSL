<template>
  <div>
    <component v-bind:is="page"></component>
  </div>
</template>
<script type="text/ecmascript-6">
  import orderManager from './orderManager.vue'
  import outStore from './outStore.vue'
  import orderDetail from './orderDetail.vue'
  export default {
    components: {
      orderManager,
      outStore,
      orderDetail
    },
    data () {
      return {
        page: 'orderManager',
        pages: ['orderManager', 'outStore', 'orderDetail']
      }
    }
  }
</script>
