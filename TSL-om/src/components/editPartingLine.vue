<style>
  #editPartingLine .ivu-radio-group {
    width: 100%;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  #editPartingLine {
    width: 400px;
    .solid-line,
    .dotted-line,
    .dashed-line,
    .double-line {
      width: 75%;
      position: absolute;
      top: 50%;
      left: 25%;
    }
    .solid-line {
      border-bottom: 5px solid #dddee1;
    }
    .dotted-line {
      border-bottom: 5px dotted #dddee1;
    }
    .dashed-line {
      border-bottom: 5px dashed #dddee1;
    }
    .double-line {
      border-bottom: 5px double #dddee1;
    }
  }
</style>
<template>
  <div id="editPartingLine">
    <Form :label-width="100">
      <FormItem label="粗细：">
        <Slider :min="1" :max="10" show-input v-model="size"></Slider>
      </FormItem>
      <FormItem label="类型：">
        <RadioGroup vertical v-model="type">
          <Radio label="solid">实线<div class="solid-line"></div></Radio>
          <Radio label="dotted">点状<div class="dotted-line"></div></Radio>
          <Radio label="dashed">虚线<div class="dashed-line"></div></Radio>
          <Radio label="double">双实线<div class="double-line"></div></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="颜色：">
        <ColorPicker v-model="color"></ColorPicker>
      </FormItem>
      <FormItem label="水平边距：">
        <Slider :min="0" :max="100" show-input v-model="horizontalMargin"></Slider>
      </FormItem>
      <FormItem label="垂直边距：">
        <Slider :min="0" :max="30" show-input v-model="verticalMargin"></Slider>
      </FormItem>
    </Form>
  </div>
</template>
<script type="text/javascript-6">
  export default {
    name: 'editPartingLine',
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
              size: 1,
              type: 'solid',
              color: '#dddee1',
              horizontalMargin: 0,
              verticalMargin: 15
            }
            this.config = config
            return config
          }
        },
        set (val) {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      },
      size: {
        get () {
          return this.config.size
        },
        set (val) {
          let config = JSON.parse(JSON.stringify(this.config))
          config.size = val
          this.config = config
        }
      },
      type: {
        get () {
          return this.config.type
        },
        set (val) {
          let config = JSON.parse(JSON.stringify(this.config))
          config.type = val
          this.config = config
        }
      },
      color: {
        get () {
          return this.config.color
        },
        set (val) {
          let config = JSON.parse(JSON.stringify(this.config))
          config.color = val
          this.config = config
        }
      },
      horizontalMargin: {
        get () {
          return this.config.horizontalMargin
        },
        set (val) {
          let config = JSON.parse(JSON.stringify(this.config))
          config.horizontalMargin = val
          this.config = config
        }
      },
      verticalMargin: {
        get () {
          return this.config.verticalMargin
        },
        set (val) {
          let config = JSON.parse(JSON.stringify(this.config))
          config.verticalMargin = val
          this.config = config
        }
      }
    }
  }
</script>

