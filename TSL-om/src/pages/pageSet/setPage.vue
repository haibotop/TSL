<style lang="scss" rel="stylesheet/scss" scoped>
  #setPage {
    padding: 10px;
    min-width: 1000px;
  }
  .wrapper {
    margin: 20px 0px;
    padding: 10px;
    width: 397px;
    min-height: 520px;
    border: 1px solid #dddee1;
    background-color: #FFFFFF;
    border-radius: 18px;
  }
  .phone-header {
    width: 100%;
    height: 70px;
  }
  .wx-header {
    width: 100%;
    height: 75px;
    background-image: url('../../assets/images/titlebar.png');
    background-repeat: no-repeat;
    background-size: cover;
    .page-name {
      width: 100%;
      text-align: center;
      padding: 35px 0px 0px 0px;
      font-size: 18px;
      color: rgba(255,255,255,0)
    }
  }
  .com-list {
    background-color: #f8f8f9;
    min-height: 300px;
    margin: 0px 0px 10px 0px;
    .inner {
      position: relative;
      width: 375px;
      cursor: move;
      border: 1px solid transparent;
      .seat {
        width: 100%;
        height: 100px;
        margin: 0px 0px 0px -10px;
        border: 1px solid orange;
      }
      .dom {
        width: 100%;
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
      .editOrDelete2 {
        position: absolute;
        right: -90px;
        top: 0px;
        z-index: 11;
        background-color: rgba(0, 0, 0, 0.5);
        a {
          color: #fff;
          margin: 0px 5px;
        }
      }
      .editOrDelete2:before {
        content: '';
        width: 0px;
        height: 0px;
        position: absolute;
        top: 0px;
        left: -20px;
        border-right: 10px solid rgba(0, 0, 0, 0.5);
        border-top: 10px solid transparent;
        border-left: 10px solid transparent;
        border-bottom: 10px solid transparent;
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
    .inner:hover .mask {
      border: 2px dotted #2b85e4;
    }
    .inner:active .mask {
      border: none;
    }
  }
  .control-bar {
    padding: 10px 0px;
    position: fixed;
    left: 231px;
    bottom: 20px;
    width: 395px;
    background: rgba(000, 000, 000, 0.2);
    color: #fff;
    text-align: center;
    z-index: 10;
    .btn-L, .btn-R {
      margin: 0px 20px;
    }
  }
  .components {
    margin: 0px 0px 40px -10px;
    width: 395px;
    padding: 10px;
    border-top: 1px solid #e9eaec;
    background-color: #f8f8f9;
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
  <div id="setPage">
    <Breadcrumb>
        <BreadcrumbItem>页面管理</BreadcrumbItem>
        <BreadcrumbItem to="/home/pageList" href="/home/pageList">页面设置</BreadcrumbItem>
        <BreadcrumbItem>页面设置</BreadcrumbItem>
    </Breadcrumb>
    <div class="wrapper">
      <div class="phone-header">
        <div style="width: 15px;height: 15px;background-color: #dddee1;border-radius: 50%;float: left;margin: 25px 0px 0px 30%;"></div>
        <div style="width: 100px;height: 15px;background-color: #dddee1;border-radius: 15px;float: left;margin: 25px;"></div>
      </div>
      <div class="wx-header"><div class="page-name">{{template.name}}</div></div>
      <div class="com-list">
        <div
        class="inner"
        v-for="(item, index) in dom"
        :key="index"
        draggable
        @dragstart="dragstart($event, item, index)"
        @dragend="dragend" 
        @dragover="dragover($event, item)"
        @drop="drop"
        >
          <div class="mask" :style="item.style"></div>
          <div class="seat" v-show="item.seat"></div>
          <div class="dom" v-show="item.id">
            <cube v-if="item.type === 0" :config="item.config"></cube>
            <showRichText  v-else-if="item.type === 1" :config="item.config"></showRichText>
            <productBlock v-else-if="item.type === 2 || item.type === 9" :config="item.config"></productBlock>
            <imgBlock v-else-if="item.type === 3" :config="item.config"></imgBlock>
            <swiperBlock v-else-if="item.type === 4" :config="item.config"></swiperBlock>
            <emptySeat v-else-if="item.type === 5" :height="item.config"></emptySeat>
            <partingLine v-else-if="item.type === 6" :config="item.config"></partingLine>
            <iconNav v-else-if="item.type === 7" :config="item.config"></iconNav>
            <videoBlock v-else-if="item.type === 8" :config="item.config"></videoBlock>
          </div>
          <div class="editOrDelete" v-show="item.type !== 5 && item.type !== 6">
            <a href="javascript:" @click="inEdit($event, item)">编辑</a>
            <a href="javascript:" @click="deleteDom(item)">删除</a>
          </div>
          <div class="editOrDelete2" v-show="item.type === 5 || item.type === 6">
            <a href="javascript:" @click="inEdit($event, item)">编辑</a>
            <a href="javascript:" @click="deleteDom(item)">删除</a>
          </div>
        </div>
      </div>
      <div class="components">
        <Button class="com-btn" @click="addDom(0)">魔方</Button>
        <Button class="com-btn" @click="addDom(1)">富文本</Button>
        <Button class="com-btn" @click="addDom(2)">商品</Button>
        <!-- <Button class="com-btn" @click="addDom(9)">静态商品</Button> -->
        <Button class="com-btn" @click="addDom(3)">图片广告</Button>
        <Button class="com-btn" @click="addDom(4)">轮播广告</Button>
        <Button class="com-btn" @click="addDom(5)">空白占位</Button>
        <Button class="com-btn" @click="addDom(6)">分割线</Button>
        <!-- <Button class="com-btn" @click="addDom(7)">Icon导航</Button> -->
        <Button class="com-btn" @click="addDom(8)">视频</Button>
      </div>
      <div class="control-bar">
        <Button class="btn-L" type="success" @click="openPageInfo('1')">立即发布</Button>
        <Button class="btn-R" type="info" @click="openPageInfo('0')">保存</Button>
      </div>
    </div>
    <div class="edit-box" v-show="editing" :style="editBoxStyle">
      <div class="triangle"></div>
      <div class="edit-area">
        <editCube v-if="editObj.type === 0" @config="setEditObjConfig" :config="editObj.config"></editCube>
        <richText ref="richText" v-else-if="editObj.type === 1" :config="editObj.config"></richText>
        <editProduct v-else-if="editObj.type === 2 || editObj.type === 9" @config="setEditObjConfig" :config="editObj.config"></editProduct>
        <editImgBlock v-else-if="editObj.type === 3" v-model="editObj.config"></editImgBlock>
        <editSwiper v-else-if="editObj.type === 4" :config="editObj.config" @config="setEditObjConfig"></editSwiper>
        <editEmptySeat v-else-if="editObj.type === 5" v-model="editObj.config" @change="editChange"></editEmptySeat>
        <editPartingLine v-else-if="editObj.type === 6" v-model="editObj.config" @change="editChange"></editPartingLine>
        <editIconNav v-else-if="editObj.type === 7" v-model="editObj.config"></editIconNav> 
        <uploadVideo v-else-if="editObj.type === 8" v-model="editObj.config"></uploadVideo>
      </div>
      <Button class="save-edit" type="primary" @click="saveEdit">确定</Button>
      <Button class="save-edit" @click="editing = false">取消</Button>
    </div>
    <Modal v-model="pageInfoModalFlag" title="基本信息编辑">
      <Form :label-width="155" ref="pageInfo" :model="template" :rules="pageInfoRule">
        <FormItem label="页面名称：" prop="name"><Input v-model="template.name" :maxlength="50"></Input></FormItem>
        <FormItem label="所属分类：" prop="classifyId">
          <Select v-model="template.classifyId">
            <Option v-for="(item, index) in classify" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="转发到朋友圈的内容：">
          <Input type="textarea" v-model="template.friendCircleContent" :maxlength="100"></Input>
        </FormItem>
        <FormItem label="转发给朋友的内容：">
          <Input type="textarea" v-model="template.friendContent" :maxlength="500"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelSave">取消</Button>
        <Button type="primary" @click="toSave" :loading="okLoading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pageAPI from '../../services/homePage.es6'
  // 0 魔方
  import cube from '../../components/cube.vue'
  import editCube from '../../components/editCube.vue'
  // 1 富文本
  import showRichText from '../../components/showRichText.vue'
  import richText from '../../components/richText.vue'
  // 2 动态商品 9 静态商品
  import productBlock from '../../components/productBlock.vue'
  import editProduct from '../../components/editProduct.vue'
  // 3 图片广告
  import imgBlock from '../../components/imgBlock.vue'
  import editImgBlock from '../../components/editImgBlock.vue'
  // 4 轮播广告
  import swiperBlock from '../../components/swiperBlock.vue'
  import editSwiper from '../../components/editSwiper.vue'
  // 5 空白占位
  import emptySeat from '../../components/emptySeat.vue'
  import editEmptySeat from '../../components/editEmptySeat.vue'
  // 6 分割线
  import partingLine from '../../components/partingLine.vue'
  import editPartingLine from '../../components/editPartingLine.vue'
  // 7 icon 导航
  import iconNav from '../../components/iconNav.vue'
  import editIconNav from '../../components/editIconNav.vue'
  // 8 视频
  import uploadVideo from '../../components/uploadVideo.vue'
  import videoBlock from '../../components/videoBlock.vue'

  let restrictor = '' // 节流器
  export default {
    name: 'setPage',
    components: {
      cube,
      editCube,
      showRichText,
      richText,
      productBlock,
      editProduct,
      imgBlock,
      editImgBlock,
      swiperBlock,
      editSwiper,
      emptySeat,
      editEmptySeat,
      partingLine,
      editPartingLine,
      iconNav,
      editIconNav,
      uploadVideo,
      videoBlock
    },
    data () {
      return {
        template: {
          id: '',
          classifyId: '',
          name: '',
          friendCircleContent: '',
          friendContent: '',
          templateJson: ''
        },
        classify: [],
        dom: [],
        dragObj: {},
        editing: false,
        editObj: {},
        editBoxStyle: '', // 编辑区域的高度
        redBorder: 'border: 2px dotted rgba(255, 0, 0, 0.5);', // 当前选择的模块
        pageInfoModalFlag: false,
        okLoading: false,
        pageInfoRule: {
          name: [{required: true, message: '请输入页面名称', trigger: 'blur'}],
          classifyId: [{required: true, message: '请选择所选分类', trigger: 'blur'}]
        },
        status: '' // 页面状态 发布 未发布
      }
    },
    mounted: function () {
      this.$http.get(...pageAPI.getClassify()).then(res => {
        if (res.data.code === 200) {
          this.classify = res.data.classify
        }
      })
      if (window.location.href.indexOf('page=') === -1) {
        return
      }
      let urlParams = window.location.href.split('?')[1].split('&')
      for (let i of urlParams) {
        if (i.indexOf('page=') !== -1) {
          this.$http.get(...pageAPI.getTemplate(i.split('=')[1])).then(res => {
            if (res.data.code === 200) {
              this.template.id = res.data.template.id
              this.template.name = res.data.template.name
              this.template.classifyId = res.data.template.classifyId
              this.template.friendCircleContent = res.data.template.friendCircleContent
              this.template.friendContent = res.data.template.friendContent
              this.dom = JSON.parse(res.data.template.templateJson)
            }
          })
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
        this.dom = dom
        setTimeout(() => {
          this.dom = JSON.parse(JSON.stringify(this.dom))
        }, 100)
        this.dragObj = {}
        clearTimeout(restrictor)
        restrictor = ''
      },
      addDom (type) {
        // type 0 魔方 1 文字 2 动态商品 3 图片广告 4 轮播广告 5 空白占位 6 分割线 7 Icon导航 8 视频 9 静态商品
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
        if (type === 2 || type === 9) {
          dom.config = {
            pStyle: '1',
            pList: []
          }
        }
        if (type === 4) {
          dom.config = [{
            img: [],
            linkObj: {
              link: 'javascript:',
              linkModel: '1',
              linkName: '',
              optionName: ''
            }
          }]
        }
        if (type === 5) {
          dom.config = 30
        }
        if (type === 6) {
          dom.config = {
            size: 1,
            type: 'solid',
            color: '#dddee1',
            horizontalMargin: 0,
            verticalMargin: 15
          }
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
      // 改edit
      setEditObjConfig (config) {
        if (this.editObj.type === 3) {
          for (let i of this.dom) {
            if (i.id === this.editObj.id) {
              i.config = this.editObj.config
            }
          }
        }
        this.editObj.config = config
      },
      // 改dom
      editChange (val) {
        for (let i of this.dom) {
          if (i.id === this.editObj.id) {
            i.config = val
          }
        }
      },
      saveEdit () {
        // 富文本
        if (this.editObj.type === 1) {
          this.editObj.config = this.$refs.richText.getText()
        }
        // 轮播广告
        if (this.editObj.type === 4) {
          let arr = []
          for (let i of this.editObj.config) {
            if (i.img !== '') {
              arr.push(i)
            }
          }
          this.editObj.config = arr
        }
        for (let i of this.dom) {
          if (i.id === this.editObj.id) {
            i.config = this.editObj.config
          }
        }
        this.editing = false
      },
      // 第一次发布时的信息填写 Modal
      openPageInfo (status) {
        this.pageInfoModalFlag = true
        this.status = status
      },
      cancelSave () {
        this.pageInfoModalFlag = false
      },
      toSave () {
        this.$refs.pageInfo.validate((valid) => {
          if (valid) {
            this.okLoading = true
            this.template.templateJson = JSON.stringify(this.dom)
            if (this.template.id === '') {
              if (this.status === '0') {
                this.postTemplate(this.template)
              } else if (this.status === '1') {
                this.postTemplateIssue(this.template)
              }
            } else {
              this.putTemplate(this.template)
            }
          }
        })
      },
      // ----------编辑页面-接口
      putTemplate (template) {
        this.$http.put(...pageAPI.putTemplate(template)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('编辑成功')
            this.pageInfoModalFlag = false
            if (this.status === '0') {
              this.okLoading = false
            } else if (this.status === '1') {
              this.postTemplate2(this.template.id)
            }
          } else {
            this.$Message.error('编辑失败')
            this.okLoading = false
          }
        }).catch(() => {
          this.okLoading = false
        })
      },
      // ----------立即发布-接口
      postTemplate2 (templateId) {
        this.$http.post(...pageAPI.postTemplate2(templateId)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('发布成功')
            this.pageInfoModalFlag = false
          } else {
            this.$Message.error('发布失败')
          }
          this.okLoading = false
        }).catch(() => {
          this.okLoading = false
        })
      },
      // ----------新增页面-接口
      postTemplate (template) {
        this.$http.post(...pageAPI.postTemplate(template)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('保存成功')
            this.pageInfoModalFlag = false
          } else {
            this.$Message.error('保存失败')
          }
          this.okLoading = false
        }).catch(() => {
          this.okLoading = false
        })
      },
      // ----------新增并发布页面-接口
      postTemplateIssue (template) {
        this.$http.post(...pageAPI.postTemplateIssue(template)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('发布成功')
            this.pageInfoModalFlag = false
          } else {
            this.$Message.error('发布失败')
          }
          this.okLoading = false
        }).catch(() => {
          this.okLoading = false
        })
      }
    },
    watch: {
      editing (flag) {
        if (flag === false) {
          this.editObj = {}
        }
      }
    }
  }
</script>
