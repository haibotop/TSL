<style lang="scss" rel="stylesheet/scss" scoped>
 #cube {
   width: 100%;
   position: relative;
   .block {
     position: absolute;
   }
 }
</style>
<template>
  <div id="cube">
    <div class="blocks" :style="`height:${boxHeight}px;width:100%;`">
      <div v-for="(block, index) in blocks" :key="index" :style="block.style" class="block"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'cube',
    data () {
      return {
        clientWidth: 0
      }
    },
    props: {
      config: [Array, String]
    },
    mounted () {
      this.clientWidth = this.$el.clientWidth
    },
    computed: {
      // clientWidth () {
      //   console.log(this.$el)
      //   if (this.$el) {
      //     return this.$el.clientWidth
      //   } else {
      //     return 0
      //   }
      // },
      allXY () {
        let arr = []
        if (this.config) {
          for (let i of this.config) {
            arr = arr.concat(i.xyArr)
          }
        }
        return arr
      },
      blocks () {
        if (this.config) {
          let config = JSON.parse(JSON.stringify(this.config))
          let blocks = []
          // 去掉空行
          let y = [0, 0, 0, 0]
          for (let i of this.allXY) {
            if (i.split(',')[1] === '1') {
              y[0]++
            } else if (i.split(',')[1] === '2') {
              y[1]++
            } else if (i.split(',')[1] === '3') {
              y[2]++
            } else if (i.split(',')[1] === '4') {
              y[3]++
            }
          }
          if (y[0] === 0) {
            for (let i of config) {
              let xyArr = []
              for (let j of i.xyArr) {
                if (j.split(',')[1] === '2') {
                  xyArr.push(`${j.split(',')[0]},1`)
                }
              }
              if (xyArr.length > 0) {
                i.xyArr = xyArr
              }
            }
          }
          if (y[1] === 0) {
            let emptyLine = 1
            if (y[0] === 0) {
              emptyLine++
            }
            for (let i of config) {
              let xyArr = []
              for (let j of i.xyArr) {
                if (j.split(',')[1] === '3') {
                  xyArr.push(`${j.split(',')[0]},${3 - emptyLine}`)
                }
              }
              if (xyArr.length > 0) {
                i.xyArr = xyArr
              }
            }
          }
          if (y[2] === 0) {
            let emptyLine = 0
            for (let i of y) {
              if (i === 0) {
                emptyLine++
              }
            }
            for (let i of config) {
              let xyArr = []
              for (let j of i.xyArr) {
                if (j.split(',')[1] === '4') {
                  xyArr.push(`${j.split(',')[0]},${4 - emptyLine}`)
                }
              }
              if (xyArr.length > 0) {
                i.xyArr = xyArr
              }
            }
          }
          // 计算样式
          for (let i of config) {
            let width = this.clientWidth / 4 * parseInt(i.w)
            let height = this.clientWidth / 4 * parseInt(i.h)
            let top = (parseInt(i.xyArr[0].split(',')[1]) - 1) * this.clientWidth / 4
            let left = (parseInt(i.xyArr[0].split(',')[0]) - 1) * this.clientWidth / 4
            let block = {
              style: `width:${width - 2}px;height:${height - 2}px;left:${left}px;top:${top}px;border: 1px solid #000`
            }
            blocks.push(block)
          }
          return blocks
        } else {
          return ''
        }
      },
      boxHeight () {
        if (this.config) {
          let y = [0, 0, 0, 0]
          for (let i of this.allXY) {
            if (i.split(',')[1] === '1') {
              y[0]++
            } else if (i.split(',')[1] === '2') {
              y[1]++
            } else if (i.split(',')[1] === '3') {
              y[2]++
            } else if (i.split(',')[1] === '4') {
              y[3]++
            }
          }
          let cen = 0
          for (let i of y) {
            if (i > 0) {
              cen++
            }
          }
          return cen * this.clientWidth / 4
        }
      }
    }
  }
</script>

