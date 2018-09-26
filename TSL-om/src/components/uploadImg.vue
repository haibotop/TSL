<style lang="scss" rel="stylesheet/scss">
  .p-main-img, .p-main-img-50 {
    display: inline-block;
    width: 100px;
    height: 100px;
    line-height: 100px;
    overflow: hidden;
    position: relative;
    margin: 10px 10px 0px 0px;
    img {
      width: 100%;
      height:100%;
      display: block;
    }
  }
  .p-main-img-50 {
    position: relative;
    width: 50px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
  }
  .p-main-img-cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 100px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
    i {
      font-size: 20px;
      color: #FFF;
      cursor: pointer;
      margin: 0 10px;
    }
  }
  .remove-icon {
    position: absolute;
    top: 0px;
    right: 0px;
    color: #ed3f14;
    font-size: 16px;
    cursor: pointer;
  }
  .p-main-img:hover .p-main-img-cover {
    display: block;
  }
  .my-upload {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-left: 10px;
    .my-upload-icon {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
  }
  .my-upload-50 {
    display: inline-block;
    width: 50px;
    height: 50px;
    .my-upload-icon-50 {
      width: 50px;
      height: 50px;
      line-height: 50px;
    }
  }
</style>
<template>
  <div id="uploadImg">

    <div :class="smallImg" v-for="(item, index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
        <img :src="item.url" alt="" v-if="defaultSize">
        <img :src="item.url" alt="" v-if="!defaultSize" @click="handleView(item)">
        <div class="p-main-img-cover" v-if="defaultSize">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
        <Icon class="remove-icon" type="close-circled" v-if="!defaultSize" @click.native="handleRemove(item)"></Icon>
      </template>
      <template v-else>
        <!--<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>-->
      </template>
    </div>

    <Modal v-model="showImg.flag" class="img-modal">
      <img :src="showImg.url" alt="">
    </Modal>

    <Upload
      ref="upload"
      action=""
      :multiple="true"
      :show-upload-list="false"
      :default-file-list="defaultList"
      type="drag"
      :class="uploadClass">
      <div :class="iconClass">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'uploadImg',
    data () {
      return {
        uploadClass: 'my-upload',
        iconClass: 'my-upload-icon',
        smallImg: 'p-main-img',
        // 上传
        defaultList: [
          {url: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'},
          {url: 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'},
          {url: 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'}
        ],
        uploadList: [],
        // 展示图片
        showImg: {
          flag: false,
          url: ''
        }
      }
    },
    props: ['size'],
    methods: {
      handleView (item) {
        this.showImg.flag = true
        this.showImg.url = item.url
      },
      handleRemove (item) {
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(item), 1)
      }
    },
    computed: {
      defaultSize () {
        if (this.size === 'small') {
          this.uploadClass = 'my-upload-50'
          this.iconClass = 'my-upload-icon-50'
          this.smallImg = 'p-main-img-50'
          return false
        } else {
          this.uploadClass = 'my-upload'
          this.iconClass = 'my-upload-icon'
          this.smallImg = 'p-main-img'
          return true
        }
      }
    },
    mounted: function () {
      this.uploadList = this.$refs.upload.fileList
    }
  }
</script>
