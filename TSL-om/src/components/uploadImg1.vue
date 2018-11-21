<template>
  <div id="uploadImg1">
    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
          <img :src="item.url1 || item.url">
          <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
      </template>
      <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      v-show="uploadList.length === 0"
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="format"
      :on-format-error="handleFormatError"
      :before-upload="handleBeforeUpload"
      type="drag"
      :action="action"
      style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible" :styles="{top: '20px', zIndex: '10'}">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'uploadImg1',
  props: {
    value: [Array]
  },
  data () {
    return {
      // action: '//jsonplaceholder.typicode.com/posts/',
      action: `${this.$http.defaults.baseURL}/resource/uploadImage`,
      format: ['jpg', 'jpeg', 'png'],
      defaultList: [],
      imgUrl: '',
      visible: false,
      // uploadList: [],
      imgs: []
    }
  },
  methods: {
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      if (JSON.stringify(this.uploadList) !== JSON.stringify(this.$refs.upload.fileList)) {
        // console.log(this.$refs.upload.fileList)
        this.uploadList = this.$refs.upload.fileList
      }
    },
    handleSuccess (res, file, filelist) {
      // console.log(res, file, filelist)
      // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      // file.url3 = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      // file.url2 = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      // file.url1 = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      if (res.code === 200) {
        file.name = res.data.pic_original
        file.url = res.data.pic_original
        file.url1 = res.data.pic_56
        file.url2 = res.data.pic_160
        file.url3 = res.data.pic_352
      }
      if (JSON.stringify(this.uploadList) !== JSON.stringify(this.$refs.upload.fileList)) {
        // console.log(this.$refs.upload.fileList)
        this.uploadList = this.$refs.upload.fileList
      }
    },
    handleFormatError (file) {
      this.$Message.warning(`图片格式须为：${this.format.toString()}`)
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Message.warning('只可上传1张图片')
      }
      return check
    }
  },
  computed: {
    uploadList: {
      get () {
        if (this.value) {
          if (this.$refs.upload) {
            this.$refs.upload.fileList = this.value
          }
          return this.value
        } else {
          if (this.$refs.upload) {
            this.$refs.upload.fileList = []
          }
          return []
        }
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
<style>
  .demo-upload-list{
      display: inline-block;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 4px;
  }
  .demo-upload-list img{
      width: 100%;
      height: 100%;
  }
  .demo-upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
      display: block;
  }
  .demo-upload-list-cover i{
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
  }
</style>
