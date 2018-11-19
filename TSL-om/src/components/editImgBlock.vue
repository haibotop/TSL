<style lang="scss" rel="stylesheet/scss">
  #editImgBlock {
    .ivu-form-item {
      margin: 10px 0px;
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  #editImgBlock {
    width: 500px;
    .edit-area {
      width: 100%;
      min-height: 150px;
      background-color: #FFFFFF;
      border: 1px solid #dddee1;
      .btn-select {
      }
    }
  }
</style>
<template>
  <div id="editImgBlock">
    <div class="edit-area">
      <Form inline :label-width="90">
        <FormItem label="选择图片：">
          <uploadImg1 v-model="img"></uploadImg1>
        </FormItem>
      </Form>
      <selectLink v-model="config.linkObj"></selectLink>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import uploadImg1 from './uploadImg1.vue'
  import selectLink from './selectLink/selectLink.vue'
  export default {
    name: 'editImgBlock',
    components: {
      uploadImg1,
      selectLink
    },
    data () {
      return {
        imgModal: true
      }
    },
    props: {
      value: [String, Object]
    },
    methods: {
      getImg (img) {
        this.config = {
          img: img,
          linkObj: this.config.linkObj
        }
      }
    },
    computed: {
      config: {
        get () {
          if (this.value) {
            return this.value
          } else {
            let config = {
              img: [],
              linkObj: {
                linkModel: '1',
                linkName: '',
                optionName: '',
                link: 'javascript:'
              }
            }
            this.$emit('input', config)
            return config
          }
        },
        set (val) {
          this.$emit('input', val)
        }
      },
      img: {
        get () {
          return this.config.img
        },
        set (img) {
          this.config = {
            img: img,
            linkObj: this.config.linkObj
          }
        }
      }
    }
  }
</script>