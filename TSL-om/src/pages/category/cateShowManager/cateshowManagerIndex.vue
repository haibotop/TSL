<template>
  <div>
    <component v-bind:is="page"></component>
  </div>
</template>
<script type="text/ecmascript-6">
  import cateshowManager from './cateshowManager.vue'
  import categoryAssociation from './categoryAssociation.vue'
  export default {
    components: {
      cateshowManager,
      categoryAssociation
    },
    data () {
      return {
        page: 'cateshowManager'
      }
    }
  }
</script>
