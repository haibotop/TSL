<template>
  <div>
    <inline-x-number v-model="num" :width="width" :button-style="buttonStyle" :min="min" :max="max"></inline-x-number>
  </div>
</template>
<script type="text/ecmascript-es6">
  import { InlineXNumber } from 'vux'
  export default {
    components: { InlineXNumber },
    props: {
      value: {
        type: Number,
        default: function () {
          return 0
        }
      },
      width: {
        type: String,
        default: function () {
          return '50px'
        }
      },
      buttonStyle: {
        type: String,
        default: function () {
          return 'square'
        }
      },
      min: {
        type: Number,
        default: function () {
          return 0
        }
      },
      max: {
        type: Number,
        default: function () {
          return 999
        }
      }
    },
    data () {
      return {
        old: ''
      }
    },
    computed: {
      num: {
        get () {
          return this.value
        },
        set (num) {
          this.$emit('input', num)
          if (this.old !== num && this.old !== '') {
            this.$emit('on-change')
          }
          this.old = num
        }
      }
    }
  }
</script>
