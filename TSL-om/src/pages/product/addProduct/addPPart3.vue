<template>
  <div id="addPPart3">
    <ueditor :id="ueditor.id" :value="ueditor.value" :config="ueditor.config" ref="ueditor"></ueditor>
    <div class="my-btn-bar">
      <Button @click="back">上一步</Button>
      <Button class="margin-left-10" @click="next" :loading="nextLoading">下一步</Button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import ueditor from '../../../components/ueditor.vue'
  export default {
    name: 'addPPart3',
    components: {
      ueditor
    },
    data () {
      return {
        ueditor: {
          id: `ueditor${new Date().getTime()}`,
          value: '',
          config: {
            autoHeightEnabled: true,
            autoFloatEnabled: true,
            initialFrameWidth: 600,
            initialFrameHeight: 300,
            enableAutoSave: false
          }
        },
        nextLoading: false
      }
    },
    mounted: function () {
      setTimeout(() => { this.$refs.ueditor.init() }, 100)
    },
    methods: {
      next () {
        let richText = ''
        if (this.$refs.ueditor) {
          richText = this.$refs.ueditor.getUEContent()
        }
        this.$emit('next', richText)
      },
      back () {
        this.$emit('back')
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #addPPart3 {
    margin: 0px 0px 0px 10px;
  }
  .margin-left-10 {
    margin: 0px 0px 0px 10px;
  }
  .my-btn-bar {
    margin: 10px 0px 0px 0px;
    text-align: center;
  }
</style>

