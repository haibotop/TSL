<style rel="scss" rel="stylesheet/scss">
  #editCube .edit-block .ivu-form-item {
    margin: 10px 0px
  }
</style>
<style rel="scss" rel="stylesheet/scss" scoped>
  #editCube {
    width: 324px;
  }
  .block-box {
    overflow: hidden;
    position: relative;
  }
  .default-block {
    background-color: #bbbec4;
    width: 80px;
    height: 80px;
    float: left;
    margin: 0px 1px 1px 0px;
    border-radius: 2px;
    cursor: pointer;
  }
  .selected-block {
    position: absolute;
    border-radius: 2px;
  }
  .edit-block {
    margin: 10px 0px 0px 0px;
    background-color: #fff;
    border: 1px solid #dddee1;
    position: relative;
  }
   .close-icon {
      position: absolute;
      right: -10px;
      top: -5px;
      cursor: pointer;
      z-index: 10;
    }
  .tips {
    color: #80848f;
    font-size: 12px;
  }
</style>
<template>
  <div id="editCube">
    <div class="block-box" @contextmenu.prevent="contextmenu">
      <div
      class="default-block"
      v-for="item in defaultBlock"
      :key="item.xy"
      :style="item.style"
      @click="selectBlock(item)"
      @mouseenter="enterBlock(item.xy)"></div>
      <div
      class="selected-block"
      v-for="(item, index) in selectedBlock"
      :key="index"
      :style="item.style"
      @click="editBlock(item)"
      ></div>
    </div>

    <p class="tips">请点击选择起点，以左上向右下滑动光标选择区域，再次点击确定所选区域，选取过程中可右击取消</p>

    <div class="edit-block" v-if="editObj !== ''">
      <Button type="text" icon="close" class="close-icon" @click="deleteBlock"></Button>
      <Form :label-width="90">
        <FormItem label="选择图片："><Button>选择图片</Button><span class="tips" style="margin: 0px 0px 0px 10px">建议尺寸：{{`${editObj.w * 160}X${editObj.h * 160}`}}像素</span></FormItem>
        <FormItem label="链接地址："></FormItem>
      </Form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'editCube',
    data () {
      return {
        defaultBlock: [
          {xy: '1,1', style: ''},
          {xy: '2,1', style: ''},
          {xy: '3,1', style: ''},
          {xy: '4,1', style: ''},
          {xy: '1,2', style: ''},
          {xy: '2,2', style: ''},
          {xy: '3,2', style: ''},
          {xy: '4,2', style: ''},
          {xy: '1,3', style: ''},
          {xy: '2,3', style: ''},
          {xy: '3,3', style: ''},
          {xy: '4,3', style: ''},
          {xy: '1,4', style: ''},
          {xy: '2,4', style: ''},
          {xy: '3,4', style: ''},
          {xy: '4,4', style: ''}
        ],
        selectedBlock: [],
        clicked1: '', // 第一次点击的块坐标
        overStyle: 'background-color: #5cadff;',
        colors: ['#FF8C05', '#A2B700', '#065FB9', '#1291A9', '#A73880', '#BD7803'],
        editObj: ''
      }
    },
    props: {
      values: [Array, String]
    },
    methods: {
      isEmpty (val) {
        if (!/^['']*$/.test(val) && !/^[' ']+$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      contextmenu (event) {
        this.clicked1 = ''
        for (let i of this.defaultBlock) {
          i.style = ''
        }
      },
      selectBlock (block) {
        let xy = block.xy
        if (this.isEmpty(this.clicked1)) {
          this.clicked1 = xy
          for (let i of this.defaultBlock) {
            if (i.xy === xy) {
              i.style = this.overStyle
            }
          }
        } else if (!this.isEmpty(block.style)) {
          let x1 = parseInt(this.clicked1.split(',')[0])
          let y1 = parseInt(this.clicked1.split(',')[1])
          let x2 = parseInt(xy.split(',')[0])
          let y2 = parseInt(xy.split(',')[1])
          if (x1 >= x2) {
            [x1, x2] = [x2, x1]
          }
          if (y1 >= y2) {
            [y1, y2] = [y2, y1]
          }
          let ci = Math.floor(Math.random() * this.colors.length)
          let block = {
            id: new Date().getTime(),
            xyArr: [],
            w: x2 - x1 + 1,
            h: y2 - y1 + 1,
            style: `top: ${(y1 - 1) * 81}px;left: ${(x1 - 1) * 81}px;width: ${(x2 - x1) ? (x2 - x1 + 1) * 81 - 1 : 80}px;height: ${(y2 - y1) ? (y2 - y1 + 1) * 81 - 1 : 80}px;background: ${this.colors[ci]}`
          }
          for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
              block.xyArr.push(`${x},${y}`)
            }
          }
          this.selectedBlock.push(block)
          this.contextmenu()
        }
      },
      enterBlock (xy) {
        if (!this.isEmpty(this.clicked1)) {
          let x1 = parseInt(this.clicked1.split(',')[0])
          let y1 = parseInt(this.clicked1.split(',')[1])
          let x2 = parseInt(xy.split(',')[0])
          let y2 = parseInt(xy.split(',')[1])
          if (x1 > x2 || y1 > y2) {
            return
          }
          let arr = [] // 悬浮的区域块数组
          for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
              arr.push(`${x},${y}`)
            }
          }
          let xArr = []
          let yArr = []
          for (let i of arr) {
            xArr.push(i.split(',')[0]) // 悬浮区域块的x坐标数组，用于和y坐标数组比较，得出所选区域长宽取舍
            yArr.push(i.split(',')[1])
          }
          if (this.selectedBlock.length > 0) {
            let selectedArr = [] // 已选择的区域块数组
            let banArr = []
            for (let i of this.selectedBlock) {
              for (let j of i.xyArr) {
                selectedArr.push(j)
              }
            }
            for (let i of arr) {
              if (selectedArr.indexOf(i) !== -1) {
                banArr.push(i)
              }
            }
            if (banArr.length > 0) {
              return
            }
          }
          for (let i of this.defaultBlock) {
            if (arr.indexOf(i.xy) !== -1) {
              i.style = this.overStyle
            } else {
              i.style = ''
            }
          }
        }
      },
      editBlock (block) {
        this.editObj = block
      },
      deleteBlock () {
        let selectedBlock = []
        for (let i of this.selectedBlock) {
          if (i.id !== this.editObj.id) {
            selectedBlock.push(i)
          }
        }
        this.selectedBlock = selectedBlock
      }
    },
    computed: {
      selectBlockStr () {
        return JSON.stringify(this.selectedBlock)
      }
    },
    watch: {
      selectBlockStr (newV, oldV) {
        if (newV !== oldV) {
          this.$emit('config', JSON.parse(newV))
        }
      },
      values (newV) {
        if (newV) {
          this.selectedBlock = newV
        } else {
          this.selectedBlock = []
        }
      }
    }
  }
</script>
