<template>
  <script :id="id" type="text/plain" charset="utf-8"></script>
</template>

<script type="text/ecmascript">
// 百度UEditor
import '../../static/ue/ueditor.config'
import '../../static/ue/ueditor.all'
import '../../static/ue/lang/zh-cn/zh-cn'
import '../../static/ue/ueditor.parse'
export default {
  name: "ueditor",
  data() {
    return {
      editor: null
    }
  },
  props: {
    id: '',
    value: '',
    config: {}
  },
  mounted: function () {
    console.log('ue组件内的数据', this.value)
  },
  destoryed() {
    this.editor.destory();
  },
  methods: {
    init () {
      this.editor = window.UE.getEditor(this.id, this.config)
      this.editor.addListener('ready', () => {
        if (this.value === null) {
          this.editor.setContent('')
        } else {
          this.editor.setContent(this.value)
        }
      })
    },
    getUEContent: function(){
      return this.editor.getContent()
    }
  }
}
</script>
<style>
.edui-editor-iframeholder,.edui-default .edui-editor{
  width: auto!important;
  height: auto;
}
.edui-default .edui-editor{
  margin-right: 10px;
}
.view{
  text-align: center;
}
.view img{
  width: 80%;
  height: auto;
}
</style>
