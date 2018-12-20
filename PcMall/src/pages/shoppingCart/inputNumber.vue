<template>
  <div class="input-number">
    <button @click="handleDown" :disabled="currentValue <= min" :class="{notAllow:currentValue <= min}">-</button>
    <input type="text" :value="currentValue" @change="handleChange" @keyup.down="handleDown" @keyup.up="handleUp"/>
    <button @click="handleUp"  :disabled="currentValue >= max" :class="{notAllow:currentValue >= max}">+</button>
  </div>
</template>
<script>
function isValueNumber (value) {
    var reg = /^[0-9]+.?[0-9]*$/
    if (reg.test(value)) {
      return true
    }
    return false
    // return (/(^-?[0-9]+\.{1}\d)+$)| (^-?[1-9][0-9]*$)|(^-?0{1}$)/).test(value + '')
}
export default {
  data () {
    return {
      currentValue: this.value,
    }
  },
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {
      type: Number,
      default: 0
    }
  },
  watch: {
    currentValue: function (val) {
      this.$emit('input', val)
      this.$emit('on-change', val)
    },
    value: function (val) {
      this.updateValue(val)
    }
  },
  methods: {
    handleDown: function () {
      if (this.currentValue <= this.min) return
      this.currentValue -= 1
    },
    handleUp: function () {
      if (this.currentValue >= this.max) return
      this.currentValue += 1
    },
    updateValue: function (val) {
      if (val > this.max) val = this.max
      if (val < this.min) val = this.min
      this.currentValue = val
    },
    handleChange: function (event) {
      var val = event.target.value.trim()
      var max = this.max
      var min = this.min
      if (isValueNumber(val)) {
        val = Number(val)
        this.currentValue = val
        if (val > max) {
          this.currentValue = max
        } else if (val < min) {
          this.currentValue = min
        }
      } else {
        event.target.value = this.currentValue
      }
    }
  },
  mounted: function () {
    this.updateValue(this.value)
  }
}
</script>

<style lang="stylus" scoped>
  .input-number
    float left
    button
      width 26px
      height 26px
      line-height 26px
      float left
      border 1px solid #ccc
      cursor pointer
    .notAllow
      cursor not-allowed
    input 
      padding 0
      width 48px
      height 26px
      font-size 16px
      color #666
      text-align center
      float left
      line-height 26px
    
</style>
