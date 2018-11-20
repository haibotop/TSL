<style lang="scss" rel="stylesheet/scss" scoped>
#editSwiper {
  width: 500px;
}
.swiper-item {
  margin: 10px 0px 0px 0px;
  height: 110px;
  border-bottom: 1px dashed #dddee1;
  position: relative;
}
.close-icon {
  position: absolute;
  top: 0px;
  right: 0px;
}
.float-left {
  float: left;
}
.add-btn {
  margin: 10px 0px 0px 0px;
}
</style>
<template>
  <div id="editSwiper">
    <div v-for="(item, index) in list" :key="index" class="swiper-item">
      <Button type="text" icon="close" class="close-icon" @click="deleteSwiper(index)"></Button>
      <uploadImg1 v-model="item.img" class="float-left" style="margin: 15px 0px 0px 0px;"></uploadImg1>
      <selectLink v-model="item.linkObj"></selectLink>
    </div>
    <Button type="dashed" long class="add-btn" @click="addImg">新增图片</Button>
  </div>
</template>
<script type="text/ecmascript-6">
  import uploadImg1 from './uploadImg1.vue'
  import selectLink from './selectLink/selectLink.vue'
  export default {
    name: 'editSwiper',
    components: {
      uploadImg1,
      selectLink
    },
    props: {
      config: [Array, String]
    },
    data () {
      return {
        list: [
          // {
          //   img: [],
          //   linkObj: {
          //     link: 'javascript:',
          //     linkModel: '1',
          //     linkName: '',
          //     optionName: ''
          //   }
          // }
        ]
      }
    },
    mounted: function () {
      if (this.config) {
        this.list = this.config
      }
    },
    methods: {
      addImg () {
        let check = this.list.length >= 5
        if (check) {
          this.$Message.warning('限制5张图片')
          return
        }
        this.list.push({
          img: [],
          linkObj: {
            link: 'javascript:',
            linkModel: '1',
            linkName: '',
            optionName: ''
          }
        })
      },
      deleteSwiper (index) {
        this.list.splice(index, 1)
      }
    },
    computed: {
      configStr () {
        if (this.config) {
          return JSON.stringify(this.config)
        } else {
          return ''
        }
      }
    },
    watch: {
      configStr (newV, oldV) {
        if (newV !== oldV) {
          console.log(newV)
          this.list = this.config
        }
      },
      emitListStr (newV, oldV) {
        if (newV) {
          this.$emit('config', this.list)
        }
      }
    }
  }
</script>

