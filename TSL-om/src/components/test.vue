<style>

</style>

<template>
    <div id="test">
        this is child part
        <!-- <component :is="activeName"></component> -->
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'test',
  component: {},
  data () {
    return {
      a: 1
    }
  },
  mounted: function () {
    console.log(this.$route)
    console.log(this.$route.path)
  }
}
</script>