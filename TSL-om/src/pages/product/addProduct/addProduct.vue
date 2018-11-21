<style lang="scss" rel="stylesheet/scss">
  #addProduct .ivu-tabs-bar {
    margin-bottom: 0px;
  }
  #addProduct .ivu-tabs-nav {
    padding-left: 0px;
  }
  #addProduct .ivu-tabs-content {
    border: 1px solid #dddee1;
    border-top: none;
    padding: 10px 0px;
  }
  #addProduct .my-html textarea.ivu-input {
    font-size: 10px;
    min-height: 230px;
  }
  #addProduct .ql-container {
    min-height: 230px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  .cate-input {
    margin: 0px 0px 10px 180px;
    width: 450px;
  }
  .margin-10 {
    margin: 10px;
  }
  .row-cate {
    margin-left: 10px;
  }
  .my-input {
    width: 450px;
  }
  .tips-text {
    display: inline-block;
    color: #80848f;
    text-indent: 10px;
  }
  .my-btn-bar {
    text-align: center;
  }
  .color-input {
    width: 80px;
    margin: 0px 10px 0px 0px;
  }
  .diy-sku-box {
    margin: 10px;
    padding: 10px 0px 0px 0px;
    border: 1px solid #dddee1;
  }
  .my-close-icon {
    cursor: pointer;
  }
  .diy-sku-input {
    width: calc(100% - 20px);
  }
  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .margin-left-10 {
    margin-left: 10px;
  }
  .my-select {
    width: 150px;
  }
</style>
<template>
  <div id="addProduct">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>商品管理</BreadcrumbItem>
      <BreadcrumbItem>发布新商品</BreadcrumbItem>
      <BreadcrumbItem>选择类目</BreadcrumbItem>
      <BreadcrumbItem>实物</BreadcrumbItem>
    </Breadcrumb>

    <Tabs type="card" :animated="false" class="margin-10" ref="tab" v-model="currTab">
      <TabPane label="商品信息">
          <b class="margin-10">您当前选择的类目</b><br/>
          <Input class="cate-input" @on-focus="goBack" v-model="currCate"></Input><br/>
        <b class="margin-10">商品基本信息</b>
        <Form :label-width="180" :model="baseInfo" :rules="baseInfoRules" ref="baseInfoForm">
          <FormItem label="商品名称：" prop="name"><Input class="my-input" v-model="baseInfo.name" :maxlength="50"></Input><span class="tips-text">还能输入{{`${50 - baseInfo.name.length}`}}个字</span></FormItem>
          <FormItem label="商品广告词：" prop="advert"><Input class="my-input" v-model="baseInfo.advert" :maxlength="50"></Input><span class="tips-text">还能输入{{`${50 - baseInfo.advert.length}`}}个字</span></FormItem>
          <FormItem label="产地：" prop="placeOfOrigin"><Input class="my-input" v-model="baseInfo.placeOfOrigin" :maxlength="10"></Input><span class="tips-text">10个字以内</span></FormItem>
          <FormItem label="商品关键词：" prop="keyword"><Input class="my-input" v-model="baseInfo.keyword"></Input><span class="tips-text">关键词之间用空格隔开2</span></FormItem>
          <FormItem label="商品简介："><Input type="textarea" v-model="baseInfo.desc" :maxlength="200" class="my-input"></Input><span class="tips-text">200个字以内</span></FormItem>
        </Form>
        <b class="margin-10">通用参数</b>
        <Form :label-width="180" :model="publicParamsModel" :rules="publicParamsRules" ref="publicParamsForm">
          <FormItem v-for="(item, index) in publicParams" :key="index" :label="`${item.name}：`" :prop="`common${index}`">
            <RadioGroup v-if="item.type === 1" v-model="item.value[0]">
              <Radio v-for="(item2, index2) in item.values" :key="index2" :label="item2.name">{{item2.name}}</Radio>
            </RadioGroup>
            <CheckboxGroup v-if="item.type === 2" v-model="item.value">
              <Checkbox v-for="(item2, index2) in item.values" :key="index2" :label="item2.name">{{item2.name}}</Checkbox>
            </CheckboxGroup>
            <Select v-if="item.type === 3" v-model="item.value[0]" class="my-select">
              <Option v-for="(item2, index2) in item.values" :key="index2" :value="item2.name">{{item2.name}}</Option>
            </Select>
            <Input v-if="item.type === 4" :maxlength="30" placeholder="限30字" class="my-input" v-model="item.value[0]"></Input>
            <Input v-if="item.type === 5" type="textarea" :maxlength="200" placeholder="限200字" class="my-input" v-model="item.value[0]"></Input>
            <DatePicker v-if="item.type === 6" format="yyyy年MM月dd日" placeholder="选择时间" v-model="item.value[0]"></DatePicker>
          </FormItem>
        </Form>
        <div class="my-btn-bar">
          <Button class="margin-left-10" @click="next">下一步</Button>
        </div>
      </TabPane>

      <TabPane label="销售属性" :disabled="currTab < 1">
        <b class="margin-10" v-show="!checkColor">商品主图</b>
        <uploadImg5 class="margin-left-10" v-show="!checkColor"></uploadImg5>
        <b class="margin-10">销售属性</b>
        <Form :label-width="100" v-for="(item, index) in skuParams" :key="index">
          <FormItem :label="`${item.name}：`">
            <CheckboxGroup v-model="selectedSku[index].values">
              <Checkbox v-for="(item2, index2) in item.values" :key="index2" :label="item2.name">{{item2.name}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="自定义颜色：" v-show="item.name === '颜色'">
            <Input class="color-input" @on-blur="diyColorChange" v-for="(item2, index2) in diyColors" :key="index2" v-model="diyColors[index2]"></Input>
          </FormItem>
          <Table :columns="imgCol" :data="imgData" class="margin-10" v-show="checkColor && item.name === '颜色'"></Table>
        </Form>
        <div v-for="(item, index) in diySku" :key="index" class="diy-sku-box">
          <Row>
            <Col span="4" offset="1" class-name="margin-bottom-10"><Input class="diy-sku-input" v-model="item.name" size="small"></Input>：</Col>
            <Col span="1" offset="18">
            <Button type="text" shape="circle" icon="close" class="my-close-icon" @click="removeDiySku(index)"></Button>
            </Col>
          </Row>
          <Row>
            <Col span="4" offset="1" v-for="(item2, index2) in item.values" :key="index2" v-if="index2 === 0 || index2 === 5" class-name="margin-bottom-10">
            <Input class="diy-sku-input" v-model="diySku[index].values[index2]" size="small"></Input>
            </Col>
            <Col span="4" v-else class="margin-bottom-10"><Input class="diy-sku-input" v-model="diySku[index].values[index2]" size="small"></Input></Col>
          </Row>
        </div>
        <Button class="margin-left-10" @click="addDiySku" :disabled="addDiySkuDisable">添加销售属性</Button>
        <Button @click="getSkuGroups" :loading="skuGroupsLoading">获取SKU组合</Button>
        <Table :columns="skuColumn" :data="skuGroups" class="margin-10"></Table>
        <Form inline class="margin-10" :model="noSku" :rules="noSkuRules" ref="noSkuForm">
          <FormItem label="软通售价：" :label-width="90" prop="price">
            <Input :disabled="skuGroups.length !== 0" v-model="noSku.price"><span slot="prepend">￥</span></Input>
          </FormItem>
          <FormItem label="原价：" :label-width="60">
            <Input :disabled="skuGroups.length !== 0" v-model="noSku.originalPrice"><span slot="prepend">￥</span></Input>
          </FormItem>
          <FormItem label="展示库存(件)：" :label-width="110" prop="stock">
            <Input :disabled="skuGroups.length !== 0" v-model="noSku.stock"></Input>
          </FormItem>
          <FormItem label="SKU编码：" :label-width="80" v-show="skuGroups.length !== 0">
            <Select class="my-select" v-model="noSku.selectedSkuCode">
              <Option v-for="(item, index) in skuGroups" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="my-btn-bar">
          <Button @click="back">上一步</Button><Button class="margin-left-10" @click="next">下一步</Button>
        </div>
      </TabPane>

      <TabPane label="商品详情" :disabled="currTab < 2">
        <Tabs type="card" :animated="false" class="margin-10">
          <TabPane label="HTML">
            <Input type="textarea" v-model="richTextHtml" class="margin-10 my-html"></Input>
            <Button @click="handleHtml" class="margin-10">保存</Button>
          </TabPane>
          <TabPane label="富文本">
            <quill-editor ref="myTextEditor" v-model="richText" :options="editorOption" @change="onEditorChange" class="margin-10"></quill-editor>
          </TabPane>
        </Tabs>
        <div class="my-btn-bar">
          <Button @click="back">上一步</Button><Button class="margin-left-10" @click="next">下一步</Button>
        </div>
      </TabPane>

      <TabPane label="其他设置" :disabled="currTab < 3">
        <b class="margin-10">设置常见问题</b>
        <Button class="margin-10" @click="problem_flag = true">选择常见问题</Button>
        <Table :columns="problemColumn1" :data="problemData1" class="margin-10"></Table>
        <Modal v-model="problem_flag" title="选择常见问题" width="700">
          <Table :columns="problemColumn2" :data="problemData2"></Table>
          <div slot="footer"></div>
        </Modal>
        <b class="margin-10">商品物流信息</b>
        <Form>
          <FormItem label="选择运费模板：" :label-width="130">
            <Select class="my-select">
            </Select>
          </FormItem>
        </Form>
        <b class="margin-10">消保标签</b>
        <Form>
          <FormItem label="参与消保类型：" :label-width="130">
            <CheckboxGroup>
              <Checkbox v-for="(item, index) in cp" :key="index" :label="item">{{item}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
        <b class="margin-10">其他信息</b>
        <Form class="margin-10">
          <FormItem label="包装清单：" :label-width="100">
            <Input type="textarea" class="my-input"></Input>
          </FormItem>
        </Form>
        <div class="my-btn-bar">
          <Button @click="back">上一步</Button><Button class="margin-left-10" @click="addProduct" :loading="pAdding">发布</Button>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as cateAPI from '../../../services/operationCate.es6'
  import * as pAPI from '../../../services/product.es6'
  import { quillEditor } from 'vue-quill-editor'
  import { default as uploadImg5 } from '../../../components/uploadImg5.vue'
  export default {
    name: 'addProduct',
    components: {
      quillEditor,
      uploadImg5
    },
    data () {
      return {
        currTab: 0,
        // 当前类目
        currCate: '',
        currCateId: '',
        // 基本信息
        baseInfo: {
          name: '',
          advert: '',
          placeOfOrigin: '',
          keyword: '',
          desc: ''
        },
        baseInfoRules: {
          name: [{required: true, message: '此项不可为空'}],
          advert: [{required: true, message: '此项不可为空'}],
          placeOfOrigin: [{required: true, message: '此项不可为空'}],
          keyword: [{required: true, message: '此项不可为空'}]
        },
        // 通用参数
        publicParams: [
//          {name: '保健功能', type: 'radio', values: ['补充蛋白质', '补充矿物质', '补血', '肠胃保健'], value: ''},
//          {name: '适宜人群', type: 'checkbox', values: ['男性', '女性', '儿童', '孕妇'], value: []},
//          {name: '主要成分', type: 'input', values: [], value: ''},
//          {name: '报警功能', type: 'radio', values: ['有', '无'], value: ''},
//          {name: '自动断电', type: 'radio', values: ['有', '无'], value: ''}
        ],
        // ---------------------------2-----------------------------
        // SKU
        skuParams: [
//          {name: '颜色', values: ['红色', '黄色', '深紫色', '蓝色', '灰色', '白色']},
//          {name: '尺码', values: ['L', 'M', 'S']}
        ],
        selectedSku: [
          {name: '颜色', values: []},
          {name: '尺码', values: []}
        ],
        diyColors: [''],
        diySku: [],
        // sku组合 table
        skuColumn: [
          {title: 'SKU组合', key: 'name', width: '150px'},
          {title: 'SKU编码', key: 'id', width: '150px'},
          {
            title: '售价',
            render: (h, params) => {
              return h('Input', {
                style: {width: '80px'},
                props: {value: params.row.price},
                on: {
                  'on-blur': (val) => {
                    this.skuGroups[params.index].price = val.target.value
                  }
                }
              })
            }
          },
          {
            title: '原价',
            render: (h, params) => {
              return h('Input', {
                style: {width: '80px'},
                props: {value: params.row.originalPrice},
                on: {
                  'on-blur': (val) => {
                    this.skuGroups[params.index].originalPrice = val.target.value
                  }
                }
              })
            }
          },
          {
            title: '展示库存',
            render: (h, params) => {
              return h('Input', {
                style: {width: '80px'},
                props: {value: params.row.stock},
                on: {
                  'on-blur': (val) => {
                    this.skuGroups[params.index].stock = val.target.value
                  }
                }
              })
            }
          },
          {
            title: 'SKU图集',
            width: '250px',
            render: (h, params) => {
              let imgs = [
                h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}}),
                h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}}),
                h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}}),
                h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}}),
                h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}})
              ]
              return h('div', {}, imgs)
            }
          },
          {
            title: '操作',
            width: '150px',
            render: (h, params) => {
              return h('div', {}, [
                h('a', {
                  style: {
                    margin: '0px 10px 0px 0px'
                  }
                }, '选图'),
                h('a', {
                  style: {
                    margin: '0px 10px 0px 0px'
                  }
                }, '复制'),
                h('a', {}, '黏贴')
              ])
            }
          }
        ],
        skuGroups: [],
        imgCol: [
          {title: '颜色分类', key: 'color', width: '100px'},
          {
            title: '图片（每种颜色最多上传5张，800*800像素，单张大小不超过1m。仅支持 JPG、JPEG、PNG格式。）',
            render: (h, params) => {
              return h(uploadImg5, {
                props: {size: 'small'}
              })
            }
          }
        ],
        imgData: [
          {color: '红色', imgs: []}
        ],
        // sku组合入参
        skuGroupsLoading: false,
        skuGroupsParam: {},
        // 选择sku编码
        noSku: {
          price: '',
          originalPrice: '',
          stock: '',
          selectedSkuCode: ''
        },
        noSkuRules: {
          price: [{required: true, message: '价格不可为空'}],
          stock: [{required: true, message: '库存不可为空'}]
        },
        // --------------------------3-------------------------------
        // 富文本
        richTextHtml: '',
        richText: '',
        editorOption: {
//          debug: 'info',
          placeholder: '编辑商品详情',
          theme: 'snow'
        },
        // --------------------------4-------------------------------
        // 已选 常见问题
        problemColumn1: [
          {title: 'ID', key: 'id'},
          {title: '名称', key: 'name'},
          {
            title: '内容',
            render: (h, params) => {
              let arr = []
              params.row.contents.forEach(e => {
                arr.push(h('p', {}, e))
              })
              return h('div', {}, arr)
            }
          },
          {title: '状态', key: 'status', width: '80px'},
          {
            title: '操作',
            width: '80px',
            render: (h, params) => {
              return h('a', {
                domProps: {
                  href: 'javascript:'
                },
                on: {
                  click: () => {
                    this.problemData1.splice(params.index, 1)
                  }
                }
              }, '删除')
            }
          }
        ],
        problemData1: [],
        // 弹窗 常见问题
        problem_flag: false,
        problemColumn2: [
          {title: 'ID', key: 'id'},
          {title: '名称', key: 'name'},
          {
            title: '内容',
            render: (h, params) => {
              let arr = []
              params.row.contents.forEach(e => {
                arr.push(h('p', {}, e))
              })
              return h('div', {}, arr)
            }
          },
          {title: '状态', key: 'status', width: '80px'},
          {
            title: '操作',
            width: '80px',
            render: (h, params) => {
              return h('a', {
                domProps: {
                  href: 'javascript:'
                },
                on: {
                  click: () => {
                    this.problemData1 = []
                    this.problemData1.push(params.row)
                    this.problem_flag = false
                  }
                }
              }, '选择')
            }
          }
        ],
        problemData2: [
          {id: '12314', name: '跨境类商品详情页常见问题...', contents: ['常见问题1：…', '常见问题2：…'], status: '启用'}
        ],
        // 消保
        cp: ['7天理由退货', '48小时快递发货', '假一赔十', '无忧退货', '商品如实描述'],
        // 发布商品
        pAdding: false
      }
    },
    mounted: function () {
      this.currCate = this.$parent.currCate.path
      this.currCateId = this.$parent.currCate.cate3.id
      this.getPublicParams()
      this.getSkuParams()
    },
    methods: {
      isEmpty (val) {
        if (!/^['']*$/.test(val) && !/^[' ']+$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      getCommonAttr (callback) {
        this.$http.get(cateAPI.getCommonAttr(this.currCateId)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      getSkuAttr (callback) {
        this.$http.get(cateAPI.getSkuAttr(this.currCateId)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      // 页面 - 通用参数
      getPublicParams () {
        this.getCommonAttr((response) => {
          if (response.data.code === 200) {
            let catalogAttr = response.data.catalogAttr
            for (let i of catalogAttr) {
              i.value = [] // 储存所选值
              if (i.type !== 2) {
                i.value = ['']
              }
            }
            this.publicParams = catalogAttr
            setTimeout(() => {
              this.$refs.publicParamsForm.resetFields()
            }, 500)
          }
        })
      },
      // 页面 - SKU参数
      getSkuParams () {
        this.getSkuAttr((response) => {
          if (response.data.code === 200) {
            let catalogAttr = response.data.catalogAttr
//            for (let i of catalogAttr) {
//              let arr = []
//              for (let j of i.values) {
//                arr.push(j.name)
//              }
//              i.values = arr
//            }
            this.skuParams = catalogAttr
          }
        })
      },
      goBack () {
        this.$parent.page = 'selectCate'
      },
      back () {
        this.currTab--
      },
      next () {
        if (this.$refs.tab.activeKey === 0) {
          this.$refs.baseInfoForm.validate((valid) => {
            if (valid) {
              this.$refs.publicParamsForm.validate((valid) => {
                if (valid) {
                  this.currTab++
                } else {
                  this.$Message.warning('请填充必填项')
                }
              })
            } else {
              this.$Message.warning('请填充必填项')
            }
          })
        } else if (this.$refs.tab.activeKey === 1) {
          let skuEdited = 0
          let skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
          for (let i of skuGroups) {
            if (!this.isEmpty(i.price) && !this.isEmpty(i.stock)) {
              skuEdited++
            }
          }
          if (skuEdited === 0) {
            this.$Message.warning('请填写SKU价格、库存')
            return
          }
          if (this.skuGroups.length !== 0) {
            if (this.noSku.selectedSkuCode) {
//              this.currTab++
              this.addProduct()
            } else {
              this.$Message.warning('请选择SKU编码')
            }
          }
        }
      },
      diyColorChange () {
        let arr = []
        for (let i of this.diyColors) {
          if (!this.isEmpty(i)) {
            arr.push(i)
          }
        }
        arr.push('')
        this.diyColors = arr
      },
      addDiySku () {
        this.diySku.unshift({
          name: '',
          values: ['', '', '', '', '', '', '', '', '', '']
        })
      },
      removeDiySku (index) {
        this.diySku.splice(index, 1)
      },
      getSkuGroups () {
        // 传商品基本属性、通用属性、销售属性
        if (this.skuGroupsParam1.specArray.length === 0) {
          this.skuGroups = []
          return
        }
        this.skuGroupsLoading = true
        let params = JSON.parse(JSON.stringify(this.skuGroupsParam1))
        params.categoryId = this.currCateId
        params.name = this.baseInfo.name
        params.merchantId = '123'
        params.keyword = this.baseInfo.keyword
        params.specArray.push({specName: '商品广告词', specValueArray: [{specValueName: this.baseInfo.advert}], type: 1})
        params.specArray.push({specName: '产地', specValueArray: [{specValueName: this.baseInfo.placeOfOrigin}], type: 1})
        params.specArray = params.specArray.concat(this.publicParamsArr)
        console.log(params)
//        if (params) { return }
        this.$http.post(...pAPI.getSkuGroups(params)).then((response) => {
          if (response.data.code === 200) {
            this.skuGroups = response.data.skuInfos
            this.skuGroupsLoading = false
          }
        })
      },
      // 富文本
      handleHtml () {
        this.richText = this.richTextHtml
      },
      onEditorChange () {
        this.richTextHtml = this.richText
      },
      addProduct () {
        this.pAdding = true
        let params = []
        // 有SKU组合
        if (this.skuGroups.length !== 0) {
          let skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
          for (let i of skuGroups) {
            if (!this.isEmpty(i.price) && !this.isEmpty(i.stock)) {
              params.push({
                name: i.name,
                originalPrice: i.originalPrice,
                price: i.price,
                stock: i.stock,
                skuId: i.id,
                spuId: i.spuId,
                pictures: ['https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar']
              })
            }
          }
//          console.log(params)
//          if (skuGroups) { return }
          this.$http.post(...pAPI.postSkuInfos(params)).then(response => {
            if (response.data.code === 200) {
              this.$Message.success('商品发布成功')
              this.pAdding = false
            } else {
              this.$Message.error('商品发布失败')
              this.pAdding = false
            }
          })
        } else {
          // 没有SKU组合
        }
      }
    },
    computed: {
      // 判断是否有勾选颜色
      checkColor () {
        let a = 0
        this.selectedSku.forEach(e => {
          if (e.name === '颜色') {
            if (e.values.length > 0) {
              a++
            }
          }
        })
        this.diyColors.forEach(e => {
          if (!this.isEmpty(e)) {
            a++
          }
        })
        if (a === 0) {
          return false
        } else {
          return true
        }
      },
      // 通用属性表单验证用
      publicParamsModel () {
        let publicParams = JSON.parse(JSON.stringify(this.publicParams))
        let obj = {}
        for (let i in publicParams) {
          if (publicParams[i].type === 2) {
            obj[`common${i}`] = publicParams[i].value
          } else {
            obj[`common${i}`] = publicParams[i].value[0]
          }
        }
        return obj
      },
      publicParamsRules () {
        let publicParams = JSON.parse(JSON.stringify(this.publicParams))
        let obj = {}
        for (let i in publicParams) {
          if (publicParams[i].isWrite === 1) {
            obj[`common${i}`] = [{required: true, message: '此项不可为空', trigger: 'submit'}]
          } else {
            obj[`common${i}`] = []
          }
        }
        return obj
      },
      // 拿出specArray数组，用于获取sku组合时生成spu
      publicParamsArr () {
        let publicParams = JSON.parse(JSON.stringify(this.publicParams))
        let arr = []
        for (let i of publicParams) {
          let obj = {
            specName: i.name,
            specValueArray: [],
            type: 1
          }
          if (i.type === 6) {
            obj.specValueArray.push({specValueName: new Date(i.value[0]).getTime()})
            arr.push(obj)
          } else {
            for (let j of i.value) {
              obj.specValueArray.push({specValueName: j})
            }
            arr.push(obj)
          }
        }
        return arr
      },
      skuGroupsParam1 () {
        let obj = {
          merchantId: '',
          name: '',
          specArray: []
        }
        // sku
        for (let i in this.selectedSku) {
          let spec = {
            specName: this.selectedSku[i].name,
            specValueArray: []
          }
          for (let j in this.selectedSku[i].values) {
            spec.specValueArray.push({
              specValueName: this.selectedSku[i].values[j]
            })
          }
          obj.specArray.push(spec)
        }
        // 自定义颜色
        for (let i in obj.specArray) {
          if (obj.specArray[i].specName === '颜色') {
            for (let j of this.diyColors) {
              if (!this.isEmpty(j)) {
                obj.specArray[i].specValueArray.push({
                  specValueName: j
                })
              }
            }
          }
        }
        // 自定义sku
        for (let i in this.diySku) {
          if (!this.isEmpty(this.diySku[i].name)) {
            let spec = {
              specName: this.diySku[i].name,
              specValueArray: []
            }
            for (let j in this.diySku[i].values) {
              if (!this.isEmpty(this.diySku[i].values[j])) {
                spec.specValueArray.push({
                  specValueName: this.diySku[i].values[j]
                })
              }
            }
            obj.specArray.push(spec)
          }
        }
        // 去空 + attrType
        let specArray = []
        for (let i in obj.specArray) {
          if (obj.specArray[i].specValueArray.length !== 0) {
            obj.specArray[i].type = 2
            specArray.push(obj.specArray[i])
          }
        }
        obj.specArray = specArray
        this.skuGroupsParam = obj
        return this.skuGroupsParam
      },
      addDiySkuDisable () {
        let skuGroupNum = 0
        skuGroupNum += this.skuParams.length
        skuGroupNum += this.diySku.length
        if (skuGroupNum >= 4) {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      currTab (newV, oldV) {
        if (newV !== oldV) {
          if (this.$refs.tab) {
            this.$refs.tab.activeKey = newV
          }
        }
      }
    }
  }
</script>
