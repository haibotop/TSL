<template>
  <div id="uploadVideo1">
    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
          <span>{{item.name}}</span>
          <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
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
      name="video"
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
          <Icon type="ios-film" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Video" v-model="visible" :styles="{top: '20px', zIndex: '10'}">
      <video :src="videoUrl" width="100%" controls></video>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'uploadVideo1',
    props: {
      value: [Array]
    },
    data () {
      return {
        action: `${this.$http.defaults.baseURL}/resource/uploadVideo`,
        format: ['mp4', 'rmvb', 'AVI'],
        defaultList: [],
        videoUrl: '',
        visible: false,
        imgs: []
      }
    },
    methods: {
      handleView (item) {
        this.videoUrl = item.video_169_mp4 || item.video_original
        this.visible = true
      },
      handleRemove (file) {
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
        if (JSON.stringify(this.uploadList) !== JSON.stringify(this.$refs.upload.fileList)) {
          this.uploadList = this.$refs.upload.fileList
        }
      },
      handleSuccess (res, file, filelist) {
        console.log(res, file)
        if (res.code === 200) {
          file.video_original = res.data.video_original
          file.video_169_mp4 = res.data.video_169_mp4
        }
        if (JSON.stringify(this.uploadList) !== JSON.stringify(this.$refs.upload.fileList)) {
          this.uploadList = this.$refs.upload.fileList
        }
      },
      handleFormatError (file) {
        this.$Message.warning(`视频格式须为：${this.format.toString()}`)
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 1
        if (!check) {
          this.$Message.warning('只可上传1个视频')
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
          console.log('set', val)
          this.$emit('input', val)
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>

