<template>
  <div>
    <component v-bind:is="page"></component>
  </div>
</template>
<script type="text/ecmascript-6">
  import buyerList from './buyerList.vue'
  import vipInfo from './vipInfo.vue'
  export default {
    components: {
      buyerList,
      vipInfo
    },
    data () {
      return {
        page: 'buyerList',
        pages: ['buyerList', 'vipInfo']
      }
    }
  }
</script>
