<style lang="scss" rel="stylesheet/scss">

</style>
<style lang="scss" rel="stylesheet/scss" scoped>
 
</style>
<template>
  <div id="selectImg">
   <Modal title="选择图片" width="900" v-model="modalFlag">
     <div slot="footer">
       <Button type="primary">保存</Button>
       <Button>取消</Button>
     </div>
   </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  // 不做图库，可能用不到这个组件
  // component is selecting img in modal
  export default {
    name: 'selectImg',
    props: {
      value: [String, Boolean]
    },
    computed: {
      modalFlag: {
        get () {
          if (this.value) {
            return true
          } else {
            return false
          }
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>

