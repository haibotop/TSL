<style lang="scss" rel="stylesheet/scss" scoped>
.margin-10 {
  margin: 10px;
}
.tips-text {
  display: inline-block;
  color: #80848f;
  text-indent: 10px;
}
.w-420 {
  width: 420px;
}
.dr-ed-curcate {
  margin: 10px 10px 20px 10px;
}
.dr-ed-req {
  display: inline-block;
  margin-left: 400px;
}
.dr-ed-req>span {
  color: red;
}

.swiper-edit {
  overflow: hidden;
}
.swiper-video, .swiper-img {
  float: left;
}
.swiper-video {
  margin: 0px 8px 0px 0px;
}
.a-btn1-box {
  margin: 20px 8px;
  float: left;
  .a-btn1 {
    display: block;
  }
}
.diy-sku-box {
  margin: 10px;
  padding: 10px 0px 0px 10px;
  border: 1px solid #dddee1;
  position: relative;
}
.my-close-icon {
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
}
.diy-sku-input {
  width: 180px;
  margin: 0px 10px 10px 0px;
}
.my-push-icon {
  font-size: 16px;
  margin: -10px 0px 0px -10px;
}
.my-select {
  width: 150px;
}
.my-radio {
  margin: 0px 0px 0px 10px;
}
.color-input {
  width: 80px;
  margin: 0px 10px 0px 0px;
}
.mymodal{
  position: absolute;
  z-index: 1001;
}
.simgs {
  overflow: hidden;
}
.simg {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  float: left;
  cursor: pointer;
  margin: 0px 10px 0px 0px;
}
</style>
<template>
  <div>
    <div class="dr-ed-curcate">
      <b>商品所属类目：</b><span style="margin-left:30px;">{{curCate}}</span>
      <div class="dr-ed-req"><span>*</span>表示该项必填</div>
    </div>
    <Tabs type="card" @on-click="tabHandler" v-model="step">
      <TabPane label="商品信息">
        <b class="margin-10">商品基本信息</b>
        <Form :label-width="180" :model="baseInfo" :rules="baseInfoRules" ref="baseInfoForm">
          <FormItem label="商品名称" prop="name">
            <Input v-model.trim="baseInfo.name" :maxlength="50" class="w-420"></Input>
            <span class="tips-text">还能输入{{`${50 - baseInfo.name.length}`}}个字</span>
          </FormItem>
          <FormItem label="设计编码" prop="designCode">
            <Input v-model.trim="baseInfo.designCode" :maxlength="16" class="w-420"></Input>
            <span class="tips-text">还能输入{{`${16 - baseInfo.designCode.length}`}}个字</span>
          </FormItem>
          <FormItem label="商品广告词" prop="advertising">
            <Input v-model.trim="baseInfo.advertising" :maxlength="50" class="w-420"></Input>
            <span class="tips-text">还能输入{{`${50 - baseInfo.advertising.length}`}}个字</span>
          </FormItem>
          <FormItem label="商品关键词" prop="keyword">
            <Input v-model.trim="baseInfo.keyword" :maxlength="50" class="w-420"></Input>
            <span class="tips-text" style="width:260px;vertical-align:top;text-indent:0;margin-left:10px;line-height:18px;">最多输入5个关键词，关键词之间用空格隔开，总字数限制在50个字以内</span>
          </FormItem>
          <FormItem label="产地" prop="originPlace">
            <Input v-model.trim="baseInfo.originPlace" :maxlength="10" class="w-420"></Input>
            <span class="tips-text">还能输入{{`${10 - baseInfo.originPlace.length}`}}个字</span>
          </FormItem>
          <FormItem label="商品简介" prop="introduction">
            <Input type="textarea" v-model.trim="baseInfo.introduction" :maxlength="200" class="w-420"></Input>
            <span class="tips-text">还能输入{{`${200 - baseInfo.introduction.length}`}}个字</span>
          </FormItem>
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
            <Select v-if="item.type === 3" v-model="item.value[0]" class="my-select" placement="top">
              <Option v-for="(item2, index2) in item.values" :key="index2" :value="item2.name">{{item2.name}}</Option>
            </Select>
            <Input v-if="item.type === 4" :maxlength="30" placeholder="限30字" class="w-420" v-model.trim="item.value[0]"></Input>
            <Input v-if="item.type === 5" type="textarea" :maxlength="200" placeholder="限200字" class="w-420" v-model.trim="item.value[0]"></Input>
            <DatePicker v-if="item.type === 6" format="yyyy年MM月dd日" placeholder="选择时间" placement="top" v-model="item.value[0]"></DatePicker>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="更多详情" :disabled="step < 1">
        <div style="margin-bottom:10px;font-weight:bold;">商品描述：</div>
        <ueditor :id="ueditor.id" :value="ueditor.value" :config="ueditor.config" ref="df_ed_ueditor"></ueditor>
      </TabPane>
      <TabPane label="销售属性" :disabled="step < 2">
        <div class="swiper-edit margin-10">
          <div class="swiper-video">
            <b class="margin-10">视频</b>
            <uploadVideo1 v-model="video"></uploadVideo1>
          </div>
          <div class="swiper-img" v-show="imgFlag1">
            <b class="margin-10">图集</b>
            <uploadImg5 v-model="imgs"></uploadImg5>
          </div>
          <div v-show="skuGroups.length > 0 && imgFlag1" class="a-btn1-box">
            <a href="javascript:" class="a-btn1" @click="setAllImgs">所有sku组合使用默认图集</a>
            <a href="javascript:" class="a-btn1" @click="copyImgsEvent1(imgs)">复制图集链接</a>
          </div>
        </div>
        <Form :label-width="105">
          <b class="margin-10">销售属性</b>
          <div v-for="(item,index) in skuParams" >
            <FormItem :key="index" :label="`${item.name}：`">
              <CheckboxGroup v-if="selectedSku.length>0" v-model="selectedSku[index].values">
                <Checkbox v-for="(item2, index2) in item.values" :key="index2" :label="item2.name">{{item2.name}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="自定义颜色：" v-show="item.name==='颜色'">
              <Input class="color-input" @on-blur="diyColorChange" v-for="(item2, index2) in diyColors" :key="index2" v-model="diyColors[index2]"></Input>
            </FormItem>
          </div>
        </Form>
        <Form>
          <div v-for="(item, index) in diySku" class="diy-sku-box" :key="index">
            <div>
              <Input class="diy-sku-input" :maxlength="20" v-model="item.name" size="small" placeholder="请输入属性名"></Input>：
              <Button type="text" shape="circle" icon="close" class="my-close-icon" @click="removeDiySku(index)"></Button>
            </div>
            <div>
              <Input class="diy-sku-input" :maxlength="20" v-for="(item2, index2) in item.values" :key="index2" v-model="diySku[index].values[index2]" size="small" placeholder="请输入属性值"></Input>
              <Button type="text" icon="plus-round" class="my-push-icon" @click="addDiySkuValues(index)"></Button>
            </div>
          </div>
          <div class="diy-sku-box" v-show="pType === 2">
            <div><Input class="diy-sku-input" :maxlength="20" value="重量(g)" size="small" disabled></Input>：</div>
            <div>
              <Input class="diy-sku-input" :maxlength="20" v-for="(item, index) in weightSku.values" :key="index" v-model="weightSku.values[index]" size="small" placeholder="请输入克数"></Input>
              <Button type="text" icon="plus-round" class="my-push-icon" @click="addWeightSkuValues()"></Button>
            </div>
          </div>
          <FormItem>
            <Button @click="addDiySku" style="margin-left:10px;" :disabled="addDiySkuDisable">添加销售属性</Button>
            <Button @click="getSkuGroups" :loading="skuGroupsLoading" type="primary" :disabled="skuGroupsParam1.length===0">获取SKU组合</Button>
            <Button @click="clearSkuGroups" :disabled="skuGroups.length === 0">清除SKU组合</Button>
            <RadioGroup v-model="pType">
              <Radio :label="2" class="my-radio">金价</Radio>
              <Select v-model="goldPrice" :disabled="pType === 1" style="width: 100px;">
                <Option v-for="(item, index) in goldPrices" :key="index" :value="JSON.stringify(item)">{{item.name}}</Option>
              </Select>
              <Radio :label="1" class="my-radio" >一口价</Radio>
            </RadioGroup>
          </FormItem>
          <Table :columns="colorColumn" :data="colorNames" class="margin-10" v-show="!imgFlag1"></Table>
          <p style="padding: 10px 0px 0px 12px;color: red;">库存不填写内容，即当前条sku组合不使用</p>

          <Table :columns="skuColumn" :data="skuGroups" class="margin-10" :width="907"></Table>
        </Form>
        <Form inline class="margin-10" :model="noSku" :rules="noSkuRules" ref="noSkuForm">
          <FormItem label="售价：" :label-width="70" prop="price" v-show="skuGroups.length === 0 && pType === 1">
            <Input ref="price" :maxlength="16" v-model="price" style="width: 200px;float:left;"></Input>
          </FormItem>
          <FormItem label="展示库存(件)：" :label-width="140" prop="stock" v-show="skuGroups.length === 0 && pType === 1">
            <Input ref="stock" :maxlength="16" v-model="stock" style="width: 80px;"></Input>
          </FormItem>
          <FormItem label="默认SKU组合：" :label-width="120" v-show="skuGroups.length !== 0">
            <Select class="my-select" v-model="noSku.selectedSkuCode" style="width: 200px;">
              <Option
                v-for="(item, index) in skuGroups"
                :key="index"
                :value="item.id">{{handleName(item.name)}}</Option>
            </Select>
          </FormItem>
        </Form>
        <Form>
          <FormItem label="发布：" :label-width="120">
            <RadioGroup v-model="addPType">
              <Radio label="now">立即</Radio><br>
              <Radio label="inft">定时</Radio>
              <DatePicker v-model="addPDate" :disabled="addPType !== 'inft'" placement="top" type="datetime" placeholder="选择日期和时间" style="width: 200px;margin: 0px 10px 0px 0px;"></DatePicker><br>
              <Radio label="toStock">放入仓库</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <!-- 编辑skugroup图集 -->
        <Modal title="编辑图集" v-model="editImgsFlag" class="mymodal">
          <uploadImg5 v-model="editImgs" viewInParent @handleView="handleView"></uploadImg5>
          <div slot="footer">
            <Button type="primary" @click="saveEditImgs">确定</Button>
            <Button @click="cancelEditImgs">取消</Button>
          </div>
        </Modal>
        <!-- 黏贴图集确定框 -->
        <Modal title="粘贴图集" v-model="pasteImgsFlag" class="mymodal">
          <div class="simgs">
            <img v-for="(item, index) in copyImgs" :key="index" :src="item" alt="" class="simg" @click="handleView(item)">
            <div v-if="copyImgs.length === 0">图集为空，是否使用</div>
          </div>
          <div slot="footer">
            <Button type="primary" @click="pasteImgs">粘贴</Button>
            <Button @click="cancelCopyImgs">取消</Button>
          </div>
        </Modal>
        <!-- 查看大图 -->
        <Modal title="查看大图" v-model="visible" class="mymodal">
          <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
      </TabPane>
    </Tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import * as cateAPI from '../../../services/operationCate.es6'
// import * as pmAPI from '../../../services/productManager.es6'
import * as pAPI from '../../../services/product.es6'
import * as goldAPI from '../../../services/goldPrice.es6'
import * as tool from '../../../services/tool.es6'
import uploadVideo1 from '../../../components/uploadVideo1.vue'
import uploadImg5 from '../../../components/uploadImg5.vue'
import ueditor from '../../../components/ueditor.vue'
let timeout
export default {
  name: 'draftEdit',
  components: {ueditor, uploadVideo1, uploadImg5},
  props: ['productInfo'],
  data: function () {
    return {
      ueditor: {
        id: `ueditor${new Date().getTime()}`,
        value: '',
        config: {
          autoHeightEnabled: true,
          autoFloatEnabled: true,
          initialFrameWidth: 900,
          initialFrameHeight: 350
        }
      },
      step: 0,
      curCate: '',
      curCateId: '',
      // 基本信息
      baseInfo: {
        name: '',
        designCode: '',
        advertising: '',
        originPlace: '',
        keyword: '',
        introduction: ''
      },
      baseInfoRules: {
        name: [{required: true, message: '此项不可为空'}],
        designCode: [{required: true, message: '此项不可为空'}],
        advertising: [{required: true, message: '此项不可为空'}],
        keyword: [{required: true, message: '此项不可为空'}, {
          validator: (rule, value, callback) => {
            if (value.split(' ').length > 5) {
              callback(new Error('最多输入5个关键词'))
            } else if (value.split(' ').join('').length > 50) {
              callback(new Error('总字数限制在50个字以内'))
            } else {
              callback()
            }
          }
        }]
      },
      spuId: '',
      // 详细内容
      richText: '',
      // 通用参数
      publicParams: [],
      // 视频
      video: [],
      // 默认图集
      imgs: [],
      imgFlag1: true,
      // 编辑图集弹窗
      editImgsFlag: false,
      editImgs: [],
      editImgsId: '',
      // 复制图集
      copyImgs: [],
      // 黏贴图集
      pasteImgsFlag: false,
      pasteImgsId: '',
      // 查看大图
      imgUrl: '', // 'http://isoftstone.b0.upaiyun.com/uploads/images/1514455574231.jpg',
      visible: false,
      colorNames: [], // color imgs table data
      colorImgs: [], // color imgs data
      // sku组合列表列信息
      skuColumn: [
        {
          title: 'SKU组合',
          width: 120,
          render: (h, params) => {
            return this.handleSkuGroupName(params.row.name)
          }
        },
        {title: 'SKU编码', key: 'id', width: 180},
        {
          title: '手工费',
          width: 100,
          render: (h, params) => {
            return h('Input', {
              style: {width: '60px'},
              props: {
                value: params.row.handPrice,
                disabled: this.pType !== 2
              },
              on: {
                'on-blur': (val) => {
                  let handPrice = val.target.value.replace(/[^0-9 | .]/g, '') ? parseFloat(val.target.value.replace(/[^0-9 | .]/g, '')) : 0
                  this.skuGroups[params.index].handPrice = handPrice
                  this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
                }
              }
            })
          }
        },
        {
          title: '售价',
          width: 100,
          render: (h, params) => {
            let dom
            if (this.pType === 2) {
              // ----------计价
              // let goldKey = params.row.price
              let goldPrice = this.goldPrice ? parseInt(JSON.parse(this.goldPrice).value) : ''
              let goldPriceKey = this.goldPrice ? JSON.parse(this.goldPrice).key : ''
              let handPrice = this.skuGroups[params.index].handPrice
              let weight = 0
              for (let i of this.skuGroups[params.index].name.split(',')) {
                if (i.indexOf('WeightOfGold&IsOnly1:') !== -1) {
                  weight = parseFloat(i.replace('WeightOfGold&IsOnly1:', ''))
                }
              }
              this.skuGroups[params.index].weight = weight
              if (goldPrice !== '' && goldPriceKey && handPrice !== '') {
                this.skuGroups[params.index].price = `${weight}*${goldPriceKey}+${handPrice}`
              } else {
                this.skuGroups[params.index].price = ''
              }
              dom = h('Input', {
                style: {width: '60px'},
                props: {
                  value: goldPrice * weight + handPrice,
                  disabled: true
                }
              })
            } else if (this.pType === 1) {
              // ----------定价
              dom = h('Input', {
                style: {width: '60px'},
                props: {value: params.row.price, maxlength: 16},
                on: {
                  'on-blur': (val) => {
                    let price = parseFloat(val.target.value.replace(/[^0-9 | .]/g, '') || 0)
                    this.skuGroups[params.index].price = price
                    this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
                  }
                }
              })
            }
            return dom
          }
        },
        {
          title: '展示库存',
          width: 100,
          render: (h, params) => {
            return h('Input', {
              style: {width: '60px'},
              props: {value: params.row.stock, maxlength: 16},
              on: {
                'on-blur': (val) => {
                  // val.target.value = val.target.value.replace(/[^0-9]/g, '').replace(/^['0']*/, '')
                  // this.skuGroups[params.index].stock = val.target.value.replace(/[^0-9]/g, '').replace(/^['0']*/, '')
                  val.target.value = val.target.value.replace(/[^0-9]/g, '') === '' ? '' : parseInt(val.target.value.replace(/[^0-9]/g, ''))
                  this.skuGroups[params.index].stock = val.target.value.replace(/[^0-9]/g, '') === '' ? '' : parseInt(val.target.value.replace(/[^0-9]/g, ''))
                }
              }
            })
          }
        },
        {
          title: 'SKU图集',
          width: 150,
          render: (h, params) => {
            let imgs = [
              // h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}}),
              // h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}}),
              // h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}}),
              // h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}}),
              // h('img', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9'}})
            ]
            for (let i = 0; i < 5; i++) {
              let img
              if (this.skuGroups[params.index].pictures[i]) {
                img = h('img', {
                  style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', background: '#f8f8f9', cursor: 'pointer'},
                  attrs: {src: this.skuGroups[params.index].pictures[i] + '!56'},
                  on: {'click': () => {
                    if (this.skuGroups[params.index].pictures[i]) {
                      this.handleView(this.skuGroups[params.index].pictures[i])
                    }
                  }}
                })
              } else {
                img = h('div', {style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px', display: 'inline-block', background: '#f8f8f9'}})
              }
              imgs.push(img)
            }
            return h('div', {}, imgs)
          }
        },
        {
          title: '操作',
          width: 150,
          render: (h, params) => {
            return h('div', {}, [
              h('a', {
                style: {display: 'block'},
                on: {click: () => { this.openEditImgsModal(params.row.id, params.row.pictures) }}
              }, '编辑图集'),
              h('a', {
                style: {display: 'block'},
                on: {click: () => { this.copyImgsEvent3(params.row.pictures) }}
              }, '复制图集链接'),
              h('a', {
                style: {display: 'block'},
                on: {click: () => { this.openPasteImgsModal(params.row.id) }}
              }, '黏贴图集链接')
            ])
          }
        }
      ],
      // sku组合列表数据
      skuGroups: [],
      // ----color图集 table
      colorColumn: [
        {title: '颜色', key: 'name', width: 100},
        {
          title: '图集',
          render: (h, params) => {
            return h(uploadImg5, {
              style: {
                margin: '5px 0px 0px 0px'
              },
              props: {
                value: this.colorImgs[params.index].value
              },
              on: {
                'input': (val) => {
                  if (JSON.stringify(val) !== JSON.stringify(this.colorImgs[params.index].value)) {
                    this.colorImgs[params.index].value = val
                  }
                }
              }
            })
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            let arr = [
              h('a', {
                domProps: {
                  href: 'javascript:'
                },
                on: {
                  'click': () => {
                    let pictures = []
                    for (let i of this.colorImgs[params.index].value) {
                      pictures.push(i.url)
                    }
                    for (let i of this.skuGroups) {
                      if (i.name.indexOf(params.row.name) !== -1) {
                        i.pictures = pictures
                      }
                    }
                    this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
                  }
                }
              }, '含该颜色的sku组合使用该图集'),
              h('a', {
                domProps: {
                  href: 'javascript:'
                },
                style: {
                  margin: '0px 0px 0px 20px'
                },
                on: {
                  'click': () => {
                    this.copyImgsEvent2(this.colorImgs[params.index].value)
                  }
                }
              }, '复制图集链接')]
            return h('div', {}, arr)
          }
        }
      ],
      // 销售属性
      skuParams: [],
      selectedSku: [],
      diyColors: [''],
      diySku: [],
      skuGroupsLoading: false,
      skuGroupsParam: {},
      // 选择sku编码
      noSku: {
        price: 0,
        originalPrice: 0,
        stock: 0,
        selectedSkuCode: ''
      },
      noSkuRules: {
        price: [{required: true, message: ' '}],
        stock: [{required: true, message: ' '}]
      },
      // 商品类型 1:一口价 2:计价
      pType: 2,
      goldPrice: '',
      goldPrices: [],
      weightSku: {name: 'WeightOfGold&IsOnly1', values: ['', '', '', '']},
      addPType: 'toStock',
      addPDate: ''
    }
  },
  computed: {
    publicParamsModel: function () {
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
    publicParamsRules: function () {
      let publicParams = JSON.parse(JSON.stringify(this.publicParams))
      let obj = {}
      for (let i in publicParams) {
        if (publicParams[i].isWrite === 1) {
          if (publicParams[i].type === 2) {
            obj[`common${i}`] = [{required: true, type: 'array', message: ' ', trigger: 'submit'}]
          } else {
            obj[`common${i}`] = [{required: true, message: '必填项不可为空', trigger: 'submit'}]
          }
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
          commonId: i.id,
          type: 1
        }
        // 1 单选 2 多选 3 下拉选择 4 单行文本 5 多行文本 6 时间控件
        if (i.type === 6) {
          if (i.value[0]) {
            obj.specValueArray.push({specValueName: new Date(i.value[0]).getTime()})
            arr.push(obj)
          }
        } else {
          for (let j of i.value) {
            if (i.type === 2) {
              if (j !== null && j.length !== 0) {
                obj.specValueArray.push({specValueName: j})
              }
            } else {
              if (j !== null && !this.isEmpty(j)) {
                obj.specValueArray.push({specValueName: j})
              }
            }
          }
          if (obj.specValueArray.length > 0) {
            arr.push(obj)
          }
        }
      }
      return arr
    },
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
    skuGroupsParam1: function () {
      let specArray = []
      // sku
      for (let i in this.selectedSku) {
        let spec = {
          specName: this.selectedSku[i].name.replace(/[: | ,]/g, ''),
          commonId: this.selectedSku[i].id,
          specValueArray: []
        }
        for (let j in this.selectedSku[i].values) {
          spec.specValueArray.push({
            specValueName: this.selectedSku[i].values[j].replace(/[: | ,]/g, '')
          })
        }
        specArray.push(spec)
      }
      // 自定义颜色
      for (let i in specArray) {
        if (specArray[i].specName === '颜色') {
          for (let j of this.diyColors) {
            if (!this.isEmpty(j)) {
              specArray[i].specValueArray.push({
                specValueName: j.replace(/[: | ,]/g, '')
              })
            }
          }
        }
      }
      // 自定义sku
      let diySku = JSON.parse(JSON.stringify(this.diySku))
      if (this.pType === 2) {
        let weightSku = JSON.parse(JSON.stringify(this.weightSku))
        let values = []
        for (let i of weightSku.values) {
          if (!this.isEmpty(i)) {
            values.push(i.replace(/[: | ,]/g, ''))
          }
        }
        weightSku.values = values
        diySku.push(weightSku)
      }
      for (let i in diySku) {
        if (!this.isEmpty(diySku[i].name)) {
          let spec = {
            specName: diySku[i].name.replace(/[: | ,]/g, ''),
            commonId: null,
            specValueArray: []
          }
          for (let j in diySku[i].values) {
            if (!this.isEmpty(diySku[i].values[j])) {
              spec.specValueArray.push({
                specValueName: diySku[i].values[j].replace(/[: | ,]/g, '')
              })
            }
          }
          specArray.push(spec)
        }
      }
      // 去空 + attrType
      let specArray1 = []
      for (let i in specArray) {
        if (specArray[i].specValueArray.length !== 0) {
          specArray[i].type = 2
          specArray1.push(specArray[i])
        }
      }
      specArray = specArray1
      this.skuGroupsParam = specArray
      return this.skuGroupsParam
    },
    // 是否禁用添加销售属性
    addDiySkuDisable () {
      let skuGroupNum = 0
      skuGroupNum += this.skuParams.length
      skuGroupNum += this.diySku.length
      if (skuGroupNum >= 4) {
        return true
      } else {
        return false
      }
    },
    price: {
      get () {
        return this.noSku.price
      },
      set (num) {
        if (this.$refs.price) {
          this.noSku.price = parseFloat(num.replace(/[^0-9 | .]/g, '') || 0)
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            this.$refs.price.currentValue = parseFloat(num.replace(/[^0-9 | .]/g, '') || 0)
          }, 500)
        }
      }
    },
    stock: {
      get () {
        return this.noSku.stock
      },
      set (num) {
        this.noSku.stock = parseInt(num) || 0
        if (this.$refs.stock) {
          setTimeout(() => {
            this.$refs.stock.currentValue = parseInt(num) || 0
          }, 30)
        }
      }
    }
  },
  methods: {
    isEmpty (val) {
      if (!/^['']*$/.test(val) && !/^[' ']+$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    // 切换tab处理
    tabHandler (name) {
      if (name === 0) {
        this.$emit('changeBtnTxt', '下一步')
      } else if (name === 1) {
        this.$emit('changeBtnTxt', '下一步')
      } else {
        this.$emit('changeBtnTxt', '保存')
      }
    },
    // 获取通用参数字段
    getCommonAttr () {
      this.curCate = `${this.productInfo.firstCategoryName} > ${this.productInfo.secondCategoryName} > ${this.productInfo.thirdCategoryName}`
      this.curCateId = this.productInfo.thirdCategoryId
      const self = this
      this.$http.get(cateAPI.getCommonAttr(self.curCateId)).then(response => {
        if (response.data.code === 200) {
          let catalogAttr = response.data.catalogAttr
          for (let i of catalogAttr) {
            if (i.type === 2) {
              i.value = []
            } else {
              i.value = ['']
            }
          }
          self.publicParams = catalogAttr
          setTimeout(() => {
            self.$refs.publicParamsForm.resetFields()
          }, 500)
        }
      })
    },
    // 获取SKU参数
    getSkuParams () {
      this.$http.get(cateAPI.getSkuAttr(this.curCateId)).then(response => {
        if (response.data.code === 200) {
          let catalogAttr = response.data.catalogAttr
          for (let i of catalogAttr) {
            if (i.isShow === 1) {
              this.selectedSku.push({
                name: i.name,
                id: i.id,
                values: []
              })
            }
          }
          let arr = []
          for (let i of catalogAttr) {
            i['value'] = []
            if (i.name === '颜色' && i.isShow === 1) {
              arr.push(i)
            } else if (i.name !== '颜色') {
              arr.push(i)
            }
          }
          this.skuParams = arr
        }
      })
    },
    // 获取金价列表
    getGoldPrices () {
      if (this.goldPrices.length === 0) {
        this.$http.get(goldAPI.getGoldPrice()).then(res => {
          if (res.data.code === 200) {
            let prices = []
            for (let i of res.data.goldPrice) {
              if (i.status === 1) {
                prices.push(i)
              }
            }
            this.goldPrices = prices
          }
        })
      }
    },
    getCommonSpec () {
      // 传商品基本属性、通用属性
      let params = {}
      params.categoryId = this.curCateId
      params.name = this.baseInfo.name
      params.designCode = this.baseInfo.designCode
      params.merchantId = '123'
      params.keyword = this.baseInfo.keyword
      params.introduction = this.baseInfo.introduction
      params.specArray = []
      params.specArray.push({specName: '商品广告词', specValueArray: [{specValueName: this.baseInfo.advertising}], commonId: null, type: 1})
      params.specArray.push({specName: '产地', specValueArray: [{specValueName: this.baseInfo.originPlace}], commonId: null, type: 1})
      params.specArray = params.specArray.concat(this.publicParamsArr)
      return params
    },
    // 提交通用参数和基本信息
    creatSpu () {
      this.$refs.baseInfoForm.validate((valid) => {
        if (valid) {
          if (this.publicParamsArr.length === 0) {
            this.$Message.warning('需要至少一条通用参数')
            return
          }
          this.$refs.publicParamsForm.validate((valid) => {
            if (valid) {
              let params = this.getCommonSpec()
              this.$http.post(...pAPI.commonSpecArrray(params)).then((response) => {
                if (response.data.code === 200) {
                  this.spuId = response.data.data
                  this.step = 1
                }
              })
            } else {
              this.$Message.warning('请正确填充通用参数必填项')
            }
          })
        } else {
          this.$Message.warning('请正确填充基本信息必填项')
        }
      })
    },
    getRichText () {
      if (this.$refs.df_ed_ueditor) {
        this.richText = this.$refs.df_ed_ueditor.getUEContent()
      }
      this.step = 2
    },
    // 设置默认图集or颜色图集
    setImgFlag1 () {
      if (this.checkColor) {
        this.getColorImgs()
        this.imgFlag1 = false
      } else {
        this.imgFlag1 = true
      }
    },
    // 设置颜色图集table的数据源
    getColorImgs () {
      this.colorNames = []
      this.colorImgs = []
      for (let i of this.skuGroupsParam1) {
        if (i.specName === '颜色') {
          for (let j of i.specValueArray) {
            this.colorNames.push({
              name: j.specValueName
            })
            this.colorImgs.push({
              name: j.specValueName,
              value: []
            })
          }
        }
      }
    },
    // 查看大图
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    // 设置所有skugroup图集
    setAllImgs () {
      if (this.skuGroups.length === 0) {
        return
      }
      let imgs = []
      for (let i of this.imgs) {
        imgs.push(i.url)
      }
      for (let i of this.skuGroups) {
        i.pictures = imgs
      }
      this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
    },
    // 打开edit imgs modal
    openEditImgsModal (id, imgs) {
      let imgs1 = []
      for (let i of imgs) {
        imgs1.push({
          url: i,
          status: 'finished'
        })
      }
      this.editImgsId = id
      this.editImgs = imgs1
      this.editImgsFlag = true
    },
    // 编辑skugroup图集-ok
    saveEditImgs () {
      let imgs = []
      for (let i of this.editImgs) {
        imgs.push(i.url)
      }
      for (let i of this.skuGroups) {
        if (this.editImgsId === i.id) {
          i.pictures = imgs
        }
      }
      this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
      this.editImgsFlag = false
    },
    // 编辑skugroup图集-cancel
    cancelEditImgs () {
      this.editImgsFlag = false
    },
    copyImgsEvent1 () {
      this.$Message.success('复制成功')
      let imgs = []
      for (let i of this.imgs) {
        imgs.push(i.url)
      }
      this.copyImgs = imgs
    },
    copyImgsEvent2 (colorImg) {
      this.$Message.success('复制成功')
      let imgs = []
      for (let i of colorImg) {
        imgs.push(i.url)
      }
      this.copyImgs = imgs
    },
    copyImgsEvent3 (imgs) {
      this.$Message.success('复制成功')
      this.copyImgs = imgs
    },
    // 黏贴 Modal
    openPasteImgsModal (id) {
      this.pasteImgsId = id
      this.pasteImgsFlag = true
    },
    // 黏贴 imgs
    pasteImgs () {
      for (let i of this.skuGroups) {
        if (i.id === this.pasteImgsId) {
          i.pictures = this.copyImgs
          this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
        }
      }
      this.pasteImgsFlag = false
    },
    cancelCopyImgs () {
      this.pasteImgsFlag = false
    },
    // 自定义颜色输入框失去焦点：去掉空元素，尾部添加空字符串元素
    diyColorChange () {
      let skuColors = []
      for (let i of this.skuParams) {
        if (i.name === '颜色') {
          for (let j of i.values) {
            skuColors.push(j.name)
          }
        }
      }
      let diyColors = JSON.parse(JSON.stringify(this.diyColors))
      let arr = []
      let ban = []
      // 取diy颜色不与sku重复部分
      for (let i of diyColors) {
        if (!this.isEmpty(i)) {
          if (skuColors.indexOf(i) === -1) {
            arr.push(i)
          } else {
            ban.push(i)
          }
        }
      }
      diyColors = JSON.parse(JSON.stringify(arr))
      arr = []
      // diy颜色去重
      for (let i of diyColors) {
        if (arr.indexOf(i) === -1) {
          arr.push(i)
        } else {
          ban.push(i)
        }
      }
      diyColors = JSON.parse(JSON.stringify(arr))
      diyColors.push('')
      arr = []
      // ban去重
      for (let i of ban) {
        if (arr.indexOf(i) === -1) {
          arr.push(i)
        }
      }
      ban = JSON.parse(JSON.stringify(arr))
      arr = []
      this.diyColors = diyColors
      if (ban.length > 0) {
        this.$Message.warning(`已存在：${ban}`)
      }
    },
    addDiySku () {
      this.diySku.unshift({
        name: '',
        values: ['', '', '', '']
      })
    },
    addDiySkuValues (index) {
      this.diySku[index].values.push('', '', '', '')
    },
    removeDiySku (index) {
      this.diySku.splice(index, 1)
    },
    // 新增重量 values
    addWeightSkuValues () {
      this.weightSku.values.push('', '', '', '')
    },
    // 提交sku属性值，获得sku组合
    getSkuGroups () {
      // ----------计价发布，判断重量
      if (this.pType === 2) {
        let values = []
        for (let i of this.weightSku.values) {
          if (!this.isEmpty(i)) {
            values.push(i)
          }
        }
        if (values.length === 0) {
          this.$Message.warning('重量(g)不可为空')
          return
        }
        for (let i of values) {
          if (!/^\d+$/.test(i) && !/^\d+\.\d+$/.test(i)) {
            this.$Message.warning('重量(g)必须为数字')
            return
          }
        }
      }
      // ----------判断sku属性数量
      if (this.skuGroupsParam1.length === 0) {
        this.skuGroups = []
        return
      }
      // ----------判断sku属性值重复
      let qobj = {}
      let qobj2 = {}
      for (let i of this.skuGroupsParam1) {
        if (!qobj[i.specName]) {
          qobj[i.specName] = 1
          qobj2 = {}
          for (let j of i.specValueArray) {
            if (!qobj2[j.specValueName]) {
              qobj2[j.specValueName] = 1
            } else {
              this.$Message.warning(`'${i.specName.replace('WeightOfGold&IsOnly1', '重量(g)')}'的值重复`)
              return
            }
          }
        } else {
          this.$Message.warning(`属性'${i.specName.replace('WeightOfGold&IsOnly1', '重量(g)')}'的名称重复`)
          return
        }
      }
      this.skuGroups = []
      this.noSku.selectedSkuCode = ''
      // ----------获取sku组合
      this.skuGroupsLoading = true
      let params = JSON.parse(JSON.stringify(this.skuGroupsParam1))
      this.$http.post(...pAPI.getSkuGroups(this.spuId, params)).then(response => {
        this.skuGroups = []
        this.noSku.selectedSkuCode = ''
        if (response.data.code === 200) {
          // ----默认图集or颜色图集
          this.setImgFlag1()
          let skuGroups = response.data.skuInfos
          for (let i of skuGroups) {
            i.price = 0
            i.originalPrice = 0
            i.pictures = []
            i.handPrice = 0
            i.weight = 0
            i.stock = ''
          }
          this.skuGroups = skuGroups
          this.noSku.selectedSkuCode = ''
          this.skuGroupsLoading = false
        } else {
          this.skuGroupsLoading = false
        }
      }).catch(() => {
        this.skuGroupsLoading = false
      })
    },
    // 清空skuGroups
    clearSkuGroups () {
      this.$Modal.confirm({
        title: '提示',
        content: '将清除SKU组合表信息，是否继续',
        onOk: () => {
          this.imgFlag1 = true
          this.skuGroups = []
          this.noSku.selectedSkuCode = ''
        }
      })
    },
    addProduct () {
      // this.comiting = true
      // ----------有SKU组合----------
      if (this.skuGroups.length !== 0) {
        let skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
        // ----------判断是否所有sku商品库存为空
        let existStock = 0
        for (let i of skuGroups) {
          if (i.stock !== '') {
            existStock++
          }
        }
        if (existStock === 0) {
          this.$Message.warning('请至少为一条要使用sku商品填写库存,否则无法保存商品!')
          // this.comiting = false
          return
        }
        // ----------判断填写了库存的有没有图集
        for (let i of skuGroups) {
          if (i.stock !== '' && i.pictures.length === 0) {
            this.$Message.warning('要使用的sku商品须添加SKU图集图片!')
            // this.comiting = false
            return
          }
        }
        // ----------判断默认sku组合
        for (let i of skuGroups) {
          if (i.id === this.noSku.selectedSkuCode) {
            if (i.stock === '' || i.pictures.length === 0) {
              this.$Message.warning('默认sku组合需填写库存和添加图集图片！')
              // this.comiting = false
              return
            }
          }
        }
        // 组成商品列表数据结构
        let skuInfos = []
        for (let i of skuGroups) {
          skuInfos.push({
            launchTime: this.addPType === 'inft' ? this.addPDate.getTime() : null,
            name: i.name,
            originalPrice: 0,
            price: i.price,
            stock: i.stock === '' ? null : parseInt(i.stock),
            skuId: i.id,
            spuId: i.spuId,
            pictures: i.pictures.length > 0 ? i.pictures : ['']
          })
        }
        // 组成spu结构
        let params = {
          launchTime: this.addPType === 'inft' ? this.addPDate.getTime() : null,
          defaultSkuId: this.noSku.selectedSkuCode,
          skuInfo: skuInfos,
          priceWay: this.pType,
          richText: this.richText,
          videoUrl: this.video.length > 0 ? this.video[0].video_original : ''
        }
        // this.comiting = false
        if (this.addPType === 'now') {
          for (let i of skuGroups) {
            if (i.stock === 0) {
              this.$Message.warning('立即发布的商品，库存不可为0')
              // this.comiting = false
              return
            }
          }
          this.addPsNow(params)
        } else if (this.addPType === 'inft') {
          for (let i of skuGroups) {
            if (i.stock === 0) {
              this.$Message.warning('定时的商品，库存不可为0')
              // this.comiting = false
              return
            }
          }
          this.addPsInFt(params)
        } else if (this.addPType === 'toStock') {
          this.addPsToStock(params)
        }
      } else {
        // ----------没有SKU组合----------
        let params = {}
        params.launchTime = this.addPType === 'inft' ? this.addPDate.getTime() : null
        params.name = this.noSku.name
        params.originalPrice = 0
        params.price = parseFloat(this.noSku.price)
        params.spuId = this.spuId
        params.stock = parseInt(this.noSku.stock)
        params.priceWay = this.pType
        params.richText = this.richText
        params.videoUrl = this.video.length > 0 ? this.video[0].video_original : ''
        let imgs = []
        for (let i of this.imgs) {
          imgs.push(i.url)
        }
        if (imgs.length === 0) {
          this.$Message.warning('至少配置一张图片')
          // this.comiting = false
          return
        }
        params.pictures = imgs
        if (this.addPType === 'now') {
          this.addPNow(params)
        } else if (this.addPType === 'inft') {
          this.addPInFt(params)
        } else if (this.addPType === 'toStock') {
          this.addPToStock(params)
        }
      }
    },
    addPsNow (params) {
      this.$http.post(...pAPI.postSkuInfos(params)).then(response => {
        if (response.data.code === 200) {
          this.$Modal.success({
            title: '商品发布',
            content: '立即发布成功',
            onOk: () => {
              // window.location.reload()
              this.$emit('deleteDraft')
            }
          })
        } else {
          this.$Message.error('立即发布失败')
          // this.comiting = false
        }
      }).catch(() => {
        // this.comiting = false
      })
    },
    addPsInFt (params) {
      this.$http.post(...pAPI.postSkuInfosInFt(params)).then(response => {
        if (response.data.code === 200) {
          this.$Modal.success({
            title: '商品发布',
            content: '定时发布成功',
            onOk: () => {
              // window.location.reload()
              this.$emit('deleteDraft')
            }
          })
        } else {
          this.$Message.error('定时发布失败')
          // this.comiting = false
        }
      }).catch(() => {
        // this.comiting = false
      })
    },
    addPsToStock (params) {
      this.$http.post(...pAPI.postSkuInfosToStock(params)).then(response => {
        if (response.data.code === 200) {
          this.$Modal.success({
            title: '商品发布',
            content: '放入仓库成功',
            onOk: () => {
              // window.location.reload()
              this.$emit('deleteDraft')
            }
          })
        } else {
          this.$Message.error('放入仓库失败')
          // this.comiting = false
        }
      }).catch(() => {
        // this.comiting = false
      })
    },
    addPNow (params) {
      this.$http.post(...pAPI.postSkuInfo(params)).then(response => {
        if (response.data.code === 200) {
          this.$Modal.success({
            title: '商品发布',
            content: '立即发布成功',
            onOk: () => {
              // window.location.reload()
              this.$emit('deleteDraft')
            }
          })
        } else {
          this.$Message.error('立即发布失败')
          // this.comiting = false
        }
      }).catch(() => {
        // this.comiting = false
      })
    },
    addPInFt (params) {
      this.$http.post(...pAPI.postSkuInfoInFt(params)).then(response => {
        if (response.data.code === 200) {
          this.$Modal.success({
            title: '商品发布',
            content: '定时发布成功',
            onOk: () => {
              // window.location.reload()
              this.$emit('deleteDraft')
            }
          })
        } else {
          this.$Message.error('定时发布失败')
          // this.comiting = false
        }
      }).catch(() => {
        // this.comiting = false
      })
    },
    addPToStock (params) {
      this.$http.post(...pAPI.postSkuInfoToStock(params)).then(response => {
        if (response.data.code === 200) {
          this.$Modal.success({
            title: '商品发布',
            content: '放入仓库成功',
            onOk: () => {
              // window.location.reload()
              this.$emit('deleteDraft')
            }
          })
        } else {
          this.$Message.error('放入仓库失败')
          // this.comiting = false
        }
      }).catch(() => {
        // this.comiting = false
      })
    },
    handlePrice (price) {
      if (price / 100 < 1) {
        return price / 100
      } else {
        return price % 100 === 0 ? `${price / 100}.00` : price / 100
      }
    },
    handleName (name) {
      return tool.handleName(name)
    },
    handleSkuGroupName (name) {
      return tool.handleSkuGroupName(name)
    },
    initStep3 () {
      this.video = []
      this.imgs = []
      this.imgFlag1 = true
      this.richText = ''
      this.editImgsFlag = false
      this.editImgs = []
      this.editImgsId = ''
      this.copyImgs = []
      this.pasteImgsFlag = false
      this.pasteImgsId = ''
      this.imgUrl = ''
      this.visible = false
      this.colorNames = []
      this.colorImgs = []
      this.skuGroups = []
      this.skuParams = []
      this.selectedSku = []
      this.diyColors = ['']
      this.diySku = []
      this.skuGroupsLoading = false
      this.skuGroupsParam = {}
      this.noSku = {
        price: 0,
        originalPrice: 0,
        stock: 0,
        selectedSkuCode: ''
      }
      this.noSkuRules = {
        price: [{required: true, message: ' '}],
        stock: [{required: true, message: ' '}]
      }
      this.pType = 2
      this.goldPrice = ''
      this.weightSku = {name: 'WeightOfGold&IsOnly1', values: ['', '', '', '']}
      this.addPType = 'toStock'
      this.addPDate = ''
    },
    onSave () {
      // alert('saving')
      // let skuEdited = 0
      // let skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
      if (this.addPType === 'inft') {
        if (this.addPDate === '') {
          this.$Message.warning('请设置发布时间')
          return
        } else {
          if (this.addPDate.getTime() <= new Date().getTime()) {
            this.$Message.warning('设置时间须大于当前时间')
            return
          }
        }
      }
      if (this.skuGroups.length === 0 && this.pType === 2) {
        this.$Message.warning('请设置销售属性并获取sku组合')
        return
      }
      if (this.skuGroups.length !== 0) {
        // 多规格
        if (this.goldPrice === '' && this.pType === 2) {
          this.$Message.warning('请选择金价')
          // this.comiting = false
          return
        }
        if (this.skuGroups !== '') {
          if (this.noSku.selectedSkuCode) {
            setTimeout(() => {
              this.addProduct()
            }, 100)
          } else {
            this.$Message.warning('请选择默认SKU组合')
          }
        }
      } else {
        // 单品
        this.$refs.noSkuForm.validate((valid) => {
          if (valid) {
            setTimeout(() => {
              this.addProduct()
            }, 100)
          }
        })
      }
    }
  },
  watch: {
    productInfo (val) {
      this.baseInfo.name = val.name
      this.baseInfo.designCode = val.designCode
      this.baseInfo.advertising = val.advertising
      this.baseInfo.originPlace = val.originPlace
      this.baseInfo.keyword = val.keyword
      this.baseInfo.introduction = val.introduction
    },
    pType (newV, oldV) {
      if (newV !== oldV) {
        this.skuGroups = []
        this.noSku.selectedSkuCode = ''
        this.noSku.price = 0
        this.noSku.stock = 0
      }
    },
    goldPrice () {
      this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
    },
    editImgsFlag (flag) {
      if (!flag) {
        this.editImgsId = ''
        this.editImgs = []
      }
    },
    pasteImgsFlag (flag) {
      if (!flag) {
        this.pasteImgsId = ''
      }
    }
  },
  mounted: function () {
    setTimeout(() => { this.$refs.df_ed_ueditor.init() }, 100)
    // this.getGoldPrices()
    // this.getCommonAttr()
    // this.getSkuParams()
  }
}
</script>
