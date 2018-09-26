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
    <quill-editor :options="editorOption" disabled :value="showText" class="editor"></quill-editor>
  </div>
</template>
<script type="text/ecmascript-6">
  import { quillEditor } from 'vue-quill-editor'
  export default {
    name: 'richText',
    components: {
      quillEditor
    },
    data () {
      return {
        editorOption: {
          placeholder: ' ',
          theme: 'bubble'
        }
      }
    },
    props: {text: String},
    computed: {
      showText () {
        if (this.text) {
          return this.text
        } else {
          return ''
        }
      }
    }
  }
</script>

