<style lang="scss" rel="stylesheet/scss" scoped>
  .wrapper {
    margin: 20px 10px;
    padding: 10px;
    width: 395px;
    min-height: 520px;
    border: 1px solid #dddee1;
    background-color: #f8f8f9;
  }
  .com-list {
    min-height: 300px;
    .inner {
      position: relative;
      width: 375px;
      cursor: move;
      border: 1px solid transparent; 
      min-height: 30px;
      .seat {
        width: 100%;
        height: 100px;
        margin: 0px 0px 0px -10px;
        border: 1px solid orange;
      }
      .dom {
        width: 100%;
        height: auto;
      }
      .editOrDelete {
        padding: 0px 5px;
        position: absolute;
        right: 0px;
        bottom: 0px;
        z-index: 11;
        background-color: rgba(0, 0, 0, 0.5);
        a {
          color: #fff;
          margin: 0px 5px;
        }
      }
      .mask {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 10;
      }
    }
    .inner:hover {
      border: 1px dashed #5cadff;
    }
    .inner:active {
      border: none;
    }
  }
  .control-bar {
    padding: 10px 0px;
    position: fixed;
    left: calc(100% / 6 + 10px);
    bottom: 20px;
    width: 395px;
    background: rgba(000, 000, 000, 0.2);
    color: #fff;
    text-align: center;
  }
  .components {
    margin: 0px 0px 40px -10px;
    width: 395px;
    padding: 10px;
    border-top: 1px solid #e9eaec;
    .com-btn {
      width: 20%;
      margin: 0px 2% 10px 2%;
    }
  }
  // 右侧  编辑区域
  .edit-box {
    position: absolute;
    top: 100px;
    left: 440px;
    padding: 10px;
    min-width: 200px;
    min-height: 50px;
    background-color: #f8f8f9;
    border: 1px solid #dddee1;
    border-radius: 6px;
    .edit-area {
      width: 100%;
      // min-height: 150px;
    }
    .save-edit {
      margin: 10px 0px 0px 0px;
    }
    .triangle {
      position: absolute;
      top: 20px;
      left: -11px;
      width: 0px;
      height: 0px;
      border-bottom: 10px solid transparent;
      border-top: 10px solid transparent;
      border-right: 10px solid #dddee1;
      &:before {
        content: '';
        width: 0px;
        height: 0px;
        border-bottom: 10px solid transparent;
        border-top: 10px solid transparent;
        border-right: 10px solid #f8f8f9;
        position: absolute;
        left: 1px;
        top: -10px;
      }
    }
  }
</style>
<template>
  <div id="setHome">
    <div class="wrapper">
      <div class="com-list">
        <div
        class="inner"
        v-for="(item, index) in dom"
        :key="index"
        :style="item.style"
        draggable
        @dragstart="dragstart($event, item, index)"
        @dragend="dragend" 
        @dragover="dragover($event, item)"
        @drop="drop"
        >
        <div class="mask"></div>
        <div class="seat" v-show="item.seat"></div>
        <div class="dom" v-show="item.id">
          <cube v-if="item.type === 0" :config="item.config"></cube>
          <richText  v-else-if="item.type === 1" :text="item.config"></richText>
          <emptySeat v-else-if="item.type === 5" :height="item.config"></emptySeat>
        </div>
        <div class="editOrDelete">
          <a href="javascript:" @click="inEdit($event, item)">编辑</a>
          <a href="javascript:" @click="deleteDom(item)">删除</a>
        </div>
        </div>
      </div>
      <div class="components">
        <Button class="com-btn" @click="addDom(0)">魔方</Button>
        <Button class="com-btn" @click="addDom(1)">文字</Button>
        <Button class="com-btn" @click="addDom(2)">商品</Button>
        <Button class="com-btn">图片广告</Button>
        <Button class="com-btn">轮播广告</Button>
        <Button class="com-btn" @click="addDom(5)">空白占位</Button>
        <Button class="com-btn">分割线</Button>
        <Button class="com-btn">Icon导航</Button>
      </div>
      <div class="control-bar">
        <Button>立即发布</Button>
        <Button>保存草稿</Button>
      </div>
    </div>
    <div class="edit-box" v-show="editing" :style="editBoxStyle">
      <div class="triangle"></div>
      <div class="edit-area">
        <editCube v-if="editObj.type === 0" @config="setEditObjConfig" :values="editObj.config"></editCube>
        <quill-editor v-else-if="editObj.type === 1" :options="editorOption2" style="width: 600px" v-model="editObj.config"></quill-editor>
        <editProduct v-else-if="editObj.type === 2"></editProduct>
        <editEmptySeat v-else-if="editObj.type === 5" @change="changeEmptySeat"></editEmptySeat>
      </div>
      <Button class="save-edit" @click="saveEdit">确定</Button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import cube from '../../components/cube.vue'
  import editCube from '../../components/editCube.vue'
  import richText from '../../components/richText.vue'
  import editProduct from '../../components/editProduct.vue'
  import emptySeat from '../../components/emptySeat.vue'
  import editEmptySeat from '../../components/editEmptySeat.vue'
  let last = '' // 去抖
  let restrictor = '' // 节流器
  export default {
    name: 'setHome',
    components: {
      cube,
      editCube,
      richText,
      editProduct,
      emptySeat,
      editEmptySeat
    },
    data () {
      return {
        dom: [],
        dragObj: {},
        editing: false,
        editObj: {},
        editBoxStyle: '',
        redBorder: 'border: 1px dashed red;',
        editorOption2: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote'],
              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction
              [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean']                                         // remove formatting button
            ]
          }
        }
      }
    },
    methods: {
      dragstart (e, item, index) {
        e.dataTransfer.setDragImage(e.srcElement, e.srcElement.offsetWidth / 2, e.srcElement.offsetHeight / 2)
        e.dataTransfer.effectAllowed = 'all'
        console.log(`----------start----------`)
        if (item.seat) {
          return
        }
        this.dragObj = item
        let dom = JSON.parse(JSON.stringify(this.dom))
        setTimeout(() => {
          dom[index] = {seat: true}
          this.dom = dom
        }, 100)
      },
      dragover (e, item) {
        if (JSON.stringify(this.dragObj) === '{}') {
          return
        }
        e.preventDefault()
        if (restrictor === '') {
          restrictor = setTimeout(() => {
            console.log(`----------over----------`)
            if (!item.seat) {
              let height = parseInt(e.srcElement.offsetHeight)
              let top = parseInt(e.offsetY)
              let seat = {seat: true}
              let dom = JSON.parse(JSON.stringify(this.dom))
              let arr = []
              let seatNum = 0
              for (let i of dom) {
                if (i.seat === true) {
                  i.seat = 'temp'
                  seatNum++
                }
              }
              for (let i of dom) {
                if (top <= height / 2) {
                  if (i.id === item.id) {
                    seatNum++
                    arr.push(seat)
                  }
                  arr.push(i)
                } else {
                  arr.push(i)
                  if (i.id === item.id) {
                    seatNum++
                    arr.push(seat)
                  }
                }
              }
              if (seatNum > 1) {
                let arr1 = []
                for (let i of arr) {
                  if (i.seat !== 'temp') {
                    arr1.push(i)
                  }
                }
                this.dom = arr1
              } else if (seatNum === 1) {
                for (let i of arr) {
                  if (i.seat === 'temp') {
                    i.seat = true
                  }
                }
                this.dom = arr
              }
            }
            restrictor = ''
          }, 200)
        }
      },
      drop (e) {
        e.preventDefault()
      },
      dragend () {
        console.log(`----------end----------`)
        let dom = JSON.parse(JSON.stringify(this.dom))
        for (let i in dom) {
          if (dom[i].seat) {
            dom[i] = this.dragObj
          }
        }
        setTimeout(() => {
          this.dom = dom
        }, 100)
        this.dragObj = {}
        clearTimeout(restrictor)
        restrictor = ''
      },
      addDom (type) {
        // type 0 魔方 1 文字 2 商品 3 图片广告 4 轮播广告 5 空白占位 6 分割线 7 Icon导航
        this.editing = false
        for (let i of this.dom) {
          i.style = ''
        }
        let dom = {
          id: new Date().getTime(),
          style: this.redBorder,
          type: type,
          config: ''
        }
        if (type === 5) {
          dom.config = 30
        }
        this.dom.push(dom)
      },
      inEdit (e, item) {
        this.editing = false
        this.editObj = JSON.parse(JSON.stringify(item))
        for (let i of this.dom) {
          if (i.id === item.id) {
            i.style = this.redBorder
          } else {
            i.style = ''
          }
        }
        let ele = e.srcElement
        while (ele.className !== 'inner') {
          ele = ele.parentNode
        }
        this.editBoxStyle = `top: ${ele.offsetTop}px;`
        this.editing = true
      },
      deleteDom (item) {
        this.$Modal.confirm({
          title: '删除',
          content: '是否删除模块',
          onOk: () => {
            for (let i in this.dom) {
              if (item.id === this.dom[i].id) {
                this.dom.splice(i, 1)
                this.editing = false
              }
            }
          }
        })
      },
      setEditObjConfig (config) {
        this.editObj.config = config
      },
      saveEdit () {
        if (this.editObj.type === 0) {
          for (let i of this.dom) {
            if (i.id === this.editObj.id) {
              i.config = this.editObj.config
            }
          }
        }
        if (this.editObj.type === 1) {
          for (let i of this.dom) {
            if (i.id === this.editObj.id) {
              i.config = this.editObj.config
            }
          }
        }
        this.editing = false
      },
      // -----------空白占位符----------
      changeEmptySeat (val) {
        clearTimeout(last)
        last = setTimeout(() => {
          this.editObj.config
          for (let i of this.dom) {
            if (i.id === this.editObj.id) {
              i.config = val
            }
          }
        }, 30)
      }
    },
    watch: {
      editing (flag) {
        if (flag === false) {
          this.dragObj = {}
        }
      }
    }
  }
</script>
