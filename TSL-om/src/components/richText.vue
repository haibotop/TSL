<style lang="scss" rel="stylesheet/scss">
  #richText .ql-container {
    min-height: 20px;
    .ql-editor {
      padding: 0px 10px;
    }
  }
</style>
<template>
  <div id="richText">
    <ueditor :id="ueditor.id" :value="config" :config="ueditor.config" ref="ueditor"></ueditor>
  </div>
</template>
<script type="text/ecmascript-6">
  import ueditor from './ueditor.vue'
  export default {
    name: 'richText',
    components: {
      ueditor
    },
    props: {config: String},
    data () {
      return {
        ueditor: {
          id: `ueditor${new Date().getTime()}`,
          config: {
            autoHeightEnabled: true,
            autoFloatEnabled: true,
            initialFrameWidth: 600,
            initialFrameHeight: 300,
            enableAutoSave: false
          }
        }
      }
    },
    mounted: function () {
      setTimeout(() => { this.$refs.ueditor.init() }, 100)
    },
    methods: {
      getText () {
        return this.$refs.ueditor.getUEContent()
      }
    }
  }
</script>

