<style>
.tips {
  color: #80848f;
  font-size: 12px;
  margin: 0px 0px 0px 10px;
}
</style>
<template>
  <div id="uploadVideo">
    <Upload
      ref="uploadVideo"
      name="video"
      :action="`${this.$http.defaults.baseURL}/resource/uploadVideo`"
      :format="format"
      :on-format-error="handleFormatError"
      :on-success="onSuccess"
      :on-remove="onRemove"
      :on-error="onError">
        <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
    </Upload>
    <div class="tips">
      <p>支持视频格式: {{format.toString()}}</p>
    </div>
    <div v-show="false">{{video_original}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
  let interval
  export default {
    name: 'uploadVideo',
    props: {
      value: [Object, String]
    },
    data () {
      return {
        format: ['flv', 'mp4', 'avi', 'rmvb']
      }
    },
    methods: {
      handleFormatError (file) {
        this.$Message.warning('视频格式不符')
      },
      onSuccess (response, file, fileList) {
        console.log(response)
        if (response.code === 200) {
          let obj = response.data
          obj.name = file.name
          this.$emit('input', obj)
        }
      },
      onRemove () {
        console.log('remove video file')
        this.$emit('input', '')
      },
      onError (error, file, fileList) {
        console.log(error)
      }
    },
    computed: {
      video_original () {
        if (this.value) {
          clearInterval(interval)
          interval = setInterval(() => {
            if (this.$refs.uploadVideo) {
              let obj = JSON.parse(JSON.stringify(this.value))
              obj.status = 'finished'
              this.$refs.uploadVideo.fileList = [obj]
              console.log(this.$refs.uploadVideo)
            }
            clearInterval(interval)
          }, 0)
          return this.value.video_original
        } else {
          return ''
        }
      }
    }
  }
</script>
