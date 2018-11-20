<style lang="scss" rel="stylesheet/scss" scoped>
  #editIconNav {
    width: 500px;
  }
  .title {
    font-weight: 700;
    margin: 0px 0px 15px 0px;
  }
  .tips {
    color: #bbbec4;
    font-size: 12px;
    margin: 15px 0px;
  }
  .sub-line {
    border-bottom: 1px solid #dddee1;
  }
</style>
<template>
  <div id="editIconNav">
    <div class="title">选择图片导航的按钮个数</div>
    <RadioGroup v-model="num">
      <Radio :label="2">2</Radio>
      <Radio :label="3">3</Radio>
      <Radio :label="4">4</Radio>
      <Radio :label="5">5</Radio>
    </RadioGroup>
    <div class="tips">建议图片尺寸: 160px × 160px   支持图片格式: jpg,jpeg,png,bmp,gif</div>
    <div class="sub-line"></div>
    <div v-for="(item, index) in list" :key="index" class="">
      <div>
        <img src="" alt="">
        <Icon type="plus-round"></Icon>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'editIconNav',
    data () {
      return {
        list: []
      }
    },
    props: {
      value: [String, Object]
    },
    computed: {
      config: {
        get () {
          if (this.value) {
            return this.value
          } else {
            let config = {
              num: 4,
              list: [
                {icon: '', iconName: '', linkObj: {link: '', linkModel: '0', linkName: '', optionName: ''}},
                {icon: '', iconName: '', linkObj: {link: '', linkModel: '0', linkName: '', optionName: ''}},
                {icon: '', iconName: '', linkObj: {link: '', linkModel: '0', linkName: '', optionName: ''}},
                {icon: '', iconName: '', linkObj: {link: '', linkModel: '0', linkName: '', optionName: ''}}
              ]
            }
            this.$emit('input', config)
            return config
          }
        },
        set (val) {
          this.$emit('input', val)
        }
      },
      num: {
        get () {
          this.list = this.config.num
          return this.config.num
        },
        set (val) {
          let config = JSON.parse(JSON.stringify(this.config))
          config.num = val
          if (config.list.length > config.num) {
            let list = []
            for (let i in config.list) {
              if (i < config.num) {
                list.push(config.list[i])
              }
            }
            config.list = list
          } else if (config.list.length < config.num) {
            for (let i = config.list.length; i < config.num; i++) {
              config.list.push(
                {icon: '', iconName: '', linkObj: {link: '', linkModel: '0', linkName: '', optionName: ''}}
              )
            }
          }
          this.list = config.list
          this.config = config
        }
      }
    }
  }
</script>
