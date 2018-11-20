<!-- 单品商品的修改和编辑 -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .ivu-modal-content {
    width: 700px;
  }
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
  .my-close-icon {
    cursor: pointer;
  }
  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .margin-left-10 {
    margin-left: 10px;
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
  .swiper-edit {
    overflow: hidden;
  }
  .swiper-video, .swiper-img {
    float: left;
  }
  .swiper-video {
    margin: 0px 8px 0px 0px;
  }
  .a-btn1 {
    margin: 30px 8px;
    float: left;
    display: block;
  }
</style>

<template>
  <div id="cbaProAlt">
    <Tabs type="card" value="step1" @on-click="initUed">
      <TabPane label="基本信息" name="step1">
        <p><b class="margin-10">sku组合商品</b></p>
        <Form :label-width="180" :model="baseInfo" :rules="baseInfoRules" ref="baseInfoForm">
          <FormItem label="商品名称：" prop="name">
            <Input class="my-input" @on-blur="judgeName" :maxlength="50" v-model.trim="name"></Input>
            <span class="tips-text">还能输入{{nameLength}}个字</span>
          </FormItem>
          <FormItem label="设计编码：" prop="designCode">
            <Input class="my-input" v-model="designCode"></Input>
          </FormItem>
          <FormItem label="商品广告词：" prop="adverMes">
            <Input class="my-input" @on-blur="judgeAdvert"  :maxlength="50" v-model.trim="adverMes"></Input>
            <span class="tips-text">还能输入{{adverLength}}个字</span>
          </FormItem>
          <FormItem label="商品关键词：" prop="keyWord">
            <Input class="my-input" v-model="keyWord"></Input>
            <span class="tips-text">关键词之间用空格隔开</span>
          </FormItem>
          <FormItem label="产地：" prop="location">
            <Input class="my-input" @on-blur="judgePlace"  :maxlength="10" v-model="location"></Input>
            <span class="tips-text">10个字以内</span>
          </FormItem>
          <FormItem label="商品简介："><Input type="textarea" :maxlength="200" class="my-input" v-model="introduction"></Input><span class="tips-text">200个字以内</span></FormItem>
        </Form>
        <Form :label-width="180" :model="publicParamsModel" ref="publicParamsForm" :rules="publicParamsRules">
          <p><b class="margin-10">类目spu通用参数</b></p>
          <FormItem :label="`${item.specName}：`" v-for="(item, index) in publicParams" :key="index" :prop="`common${index}`">
            <RadioGroup v-if="item.type === 1" v-model="item.value">
              <Radio v-for="(item2, index2) in item.values" :key="index2" :label="item2.cateSpuSpecValueName">{{item2.cateSpuSpecValueName}}</Radio>
            </RadioGroup>
            <CheckboxGroup v-if="item.type === 2" v-model="item.value">
              <Checkbox v-for="(item2, index2) in item.values" :key="index2" :label="item2.cateSpuSpecValueName">{{item2.cateSpuSpecValueName}}</Checkbox>
            </CheckboxGroup>
            <Select v-if="item.type === 3" v-model="item.value" class="my-select" :transfer="true">
              <Option v-for="(item2, index2) in item.values" :key="index2" :value="item2.cateSpuSpecValueName">{{item2.cateSpuSpecValueName}}</Option>
            </Select>
            <Input v-if="item.type === 4" :maxlength="30" placeholder="限30字" class="my-input" v-model="item.value"></Input>
            <Input v-if="item.type === 5" type="textarea" :maxlength="200" placeholder="限200字" class="my-input" v-model="item.value"></Input>
            <DatePicker v-if="item.type === 6" format="yyyy年MM月dd日" :transfer="true" placeholder="选择时间" v-model="item.value" placement="top"></DatePicker>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="更多详情" name="step2">
        <p v-if="skuParams.length !== 0"><b class="margin-10">详情页</b></p>
        <ueditor :id="ueditor.id" :value="ueditor.value" :config="ueditor.config" ref="ueditor"></ueditor>
      </TabPane>
      <TabPane label="销售参数" name="step3">
        <p v-if="skuParams.length !== 0"><b class="margin-10">类目销售属性</b></p>
        <div class="swiper-edit margin-10">
          <div class="swiper-video">
            <b class="margin-10">视频</b>
            <uploadVideo1 v-model="video"></uploadVideo1>
          </div>
          <div class="swiper-img">
            <b class="margin-10">图集</b>
            <uploadImg5 v-model="imgs" @handleView="handleView"></uploadImg5>
          </div>
          <a href="javascript:" class="a-btn1" @click="setDefaultImg">所有sku组合使用默认图集</a>
        </div>
        <Form>
          <FormItem v-for="(item3,index3) in skuParams" :key="index3" :label="`${item3.specName}：`" class="row-cate">
            <CheckboxGroup v-model="item3.value">
              <Checkbox v-for="(item4, index4) in item3.values" :key="index4" :label="item4.cateSpuSpecValueName || item4.spuSpecValue">{{item4.cateSpuSpecValueName || item4.spuSpecValue}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem>
            <div v-for="(item, index) in skuInput" class="diy-sku-box" :key="index">
              <div v-if="item.name === 'WeightOfGold&IsOnly1'">
                <Input class="diy-sku-input" :maxlength="20" value="重量(g)" size="small" disabled></Input>：
              </div>
              <div v-else>
                <Input class="diy-sku-input" :maxlength="20" v-model="item.name" size="small" placeholder="请输入属性名"></Input>：
                <Button type="text" shape="circle" icon="close" class="my-close-icon" @click="removeDiySku(index,item)"></Button>
              </div>
              <div>
                <Input class="diy-sku-input" :maxlength="20" v-for="(item2, index2) in item.values" :key="index2" v-model="item2.spuSpecValue" size="small" placeholder="请输入属性值"></Input>
                <Button type="text" icon="plus-round" class="my-push-icon" @click="addDiySkuValues(index)"></Button>
              </div>
            </div>
            <Button @click="addDiySku(null)" class="margin-left-10">添加销售属性</Button>
            <Button @click="getSkuGroups" :loading="skuGroupsLoading" type="primary">获取SKU组合</Button>
            <RadioGroup v-model="priceWay">
              <Radio :label="2" style="margin: 0px 0px 0px 10px;" :disabled="isPriceWay">金价</Radio>
              <Select v-model="goldPrice" :disabled="priceWay === 1" style="width: 100px;">
                <Option v-for="(item, index) in goldPrices" :key="index" :value="JSON.stringify(item)">{{item.name}}</Option>
              </Select>
              <Radio :label="1" style="margin: 0px 0px 0px 10px;" >一口价</Radio>
            </RadioGroup>
            <Table :columns="skuColumn" :data="skuGroups" class="margin-10"></Table>
            <FormItem label="默认SKU组合：" :label-width="120">
              <Select class="my-select" v-model="defaultBarCode" style="width: 200px;" placement="top">
                <Option v-for="(item, index) in skuGroupName" :key="index" :value="item.id">{{item.name.replace('WeightOfGold&IsOnly1:', '')}}</Option>
              </Select>
            </FormItem>
          </FormItem>
        </Form>
        <!-- 编辑skugroup图集 -->
        <Modal title="编辑图集" v-model="editImgsFlag">
          <uploadImg5 v-model="editImgs" viewInParent @handleView="handleView"></uploadImg5>
          <div slot="footer">
            <Button type="primary" @click="confirmPicSet(editImgs)">确定</Button>
            <Button @click="cancelPicSet">取消</Button>
          </div>
        </Modal>
        <!-- 查看大图 -->
        <Modal title="查看大图" v-model="visible">
          <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
      </TabPane>
    </Tabs>
    <loading :isload="isLoad"></loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pdAPI from '../../../../services/productManager.es6'
  import * as goldAPI from '../../../../services/goldPrice.es6'
  import uploadVideo1 from '../../../../components/uploadVideo1.vue'
  import uploadImg5 from '../../../../components/uploadImg5.vue'
  import ueditor from '../../../../components/ueditor.vue'
  import Loading from '../../../../components/loading'

  export default {
    name: 'cbaProAlt',
    components: {
      uploadVideo1,
      uploadImg5,
      ueditor,
      Loading
    },
    props: {
      productInfo: [String, Object],
      value: [String, Boolean]
    },
    data () {
      return {
        // ------------富文本
        ueditor: {
          id: `ueditor${new Date().getTime()}`,
          value: '',
          config: {
            autoHeightEnabled: false,
            autoFloatEnabled: true,
            initialFrameWidth: 900,
            initialFrameHeight: 380,
            enableAutoSave: false,
            catchRemoteImageEnable: false
          }
        },
        isSetUE: false,
        ready: true,
        // ----------视频
        video: [],
        priceWay: this.productInfo.spuInfos.priceWay,
        // 发布的时候是否一口价
        isPriceWay: false,
        goldPrice: '',
        goldPrices: [],
        // -----------默认图集
        imgs: [],
        // ------------查看大图
        imgUrl: '',
        visible: false,
        // =================================   基本信息
        name: this.productInfo.spuInfos.name,
        keyWord: this.productInfo.spuInfos.keyWord,
        designCode: this.productInfo.spuInfos.designCode,
        introduction: this.productInfo.spuInfos.introduction,
        // ===================================  通用参数
        adverMesGet: '',
        locationGet: '',
        price: this.productInfo.skuInfos.skus[0].price,
        publicParams: null,
        imgparams: [],
        // 表单验证info
        baseInfo: {
          name: '',
          adverMes: '',
          designCode: '',
          keyWord: ''
        },
        baseInfoRules: {
          name: [{required: true, message: '此项不可为空'}],
          //  adverMes: [{required: true, message: '此项不可为空'}],
          designCode: [{required: true, message: '此项不可为空'}],
          keyWord: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value.split(' ').length > 5) {
                  callback(new Error('最多输入5个关键词'))
                } else if (value.split(' ').join('').length > 50) {
                  callback(new Error('总字数限制在50个字以内'))
                } else if (value.length < 1) {
                  callback(new Error('此项不可为空'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        commonAdding: true,
        // SKU
        skuParams: [],
        selfColor: [],
        skuInput: [],
        skuGroups: [],
        skuGroupsLoading: false,
        isLoad: false,
        defaultBarCode: this.productInfo.spuInfos.barCode,
        // sku变化过程
        origin: {
          isclean: 0,
          deleteSkuIds: [],
          updateSkuIds: []
        },
        // sku组合 table
        skuColumn: [
          {
            title: 'SKU组合',
            render: (h, params) => {
              let arr = params.row.name.split(' ')
              let arr2 = []
              for (let i of arr) {
                if (i.indexOf('WeightOfGold&IsOnly1:') !== -1) {
                  i = i.replace('WeightOfGold&IsOnly1:', '')
                  arr2.push(i + 'g')
                } else {
                  arr2.push(i)
                }
              }
              return this.origin.isclean === 1 ? this.name + ' ' + arr2.join(' ') : arr2.join(' ')
              // return params.row.name.replace('WeightOfGold&IsOnly1:', '')
            }
          },
          {
            title: 'SKU编码',
            key: 'id'
          },
          {
            title: '手工费',
            width: '100px',
            render: (h, params) => {
              return h('Input', {
                style: {width: '80px'},
                props: {
                  number: true,
                  value: this.priceWay === 1 ? 0 : this.skuGroups[params.index].handPay,
                  disabled: this.priceWay === 1
                },
                on: {
                  'on-blur': (val) => {
                    let handPay = parseFloat(val.target.value.replace(/[^0-9 | .]/g, '') || 0)
                    let weight = 0
                    for (let i of this.skuGroups[params.index].name.split(' ')) {
                      if (i.indexOf('WeightOfGold&IsOnly1:') !== -1) {
                        weight = parseFloat(i.replace('WeightOfGold&IsOnly1:', ''))
                      }
                    }
                    this.skuGroups[params.index].handPay = handPay
                    this.skuGroups[params.index].price = weight + '*' + JSON.parse(this.goldPrice).key + '+' + handPay
                  },
                  'on-enter': (val) => {
                    let handPay = parseFloat(val.target.value.replace(/[^0-9 | .]/g, '') || 0)
                    let weight = 0
                    for (let i of this.skuGroups[params.index].name.split(' ')) {
                      if (i.indexOf('WeightOfGold&IsOnly1:') !== -1) {
                        weight = parseFloat(i.replace('WeightOfGold&IsOnly1:', ''))
                      }
                    }
                    this.skuGroups[params.index].handPay = handPay
                    this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
                    this.skuGroups[params.index].price = weight + '*' + JSON.parse(this.goldPrice).key + '+' + handPay
                  }
                }
              })
            }
          },
          {
            title: '售价',
            width: '100px',
            render: (h, params) => {
              let dom
              if (this.priceWay === 2) {
                // ----------计价
                let goldPrice = this.goldPrice ? parseInt(JSON.parse(this.goldPrice).value) : ''
                let handPrice = parseInt(params.row.handPay)
                let weight = 0
                for (let i of this.skuGroups[params.index].name.split(' ')) {
                  if (i.indexOf('WeightOfGold&IsOnly1:') !== -1) {
                    weight = parseFloat(i.replace('WeightOfGold&IsOnly1:', ''))
                  }
                }
                dom = h('Input', {
                  style: {width: '80px'},
                  props: {
                    value: goldPrice * weight + handPrice,
                    disabled: true
                  }
                })
              } else if (this.priceWay === 1) {
                // ----------定价
                dom = h('Input', {
                  style: {width: '80px'},
                  props: {
                    value: params.row.price
                  },
                  on: {
                    'on-blur': (val) => {
                      let price = parseInt(val.target.value.replace(/[^0-9 | .]/g, '') || 0)
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
            width: '100px',
            render: (h, params) => {
              return h('Input', {
                style: {width: '80px'},
                props: {value: params.row.stock, maxlength: 16},
                on: {
                  'on-blur': (val) => {
                    val.target.value = val.target.value.replace(/[^0-9]/g, '') === '' ? '' : parseInt(val.target.value.replace(/[^0-9]/g, ''))
                    this.skuGroups[params.index].stock = val.target.value.replace(/[^0-9]/g, '') === '' ? '' : parseInt(val.target.value.replace(/[^0-9]/g, ''))
                  }
                }
              })
            }
          },
          {
            title: 'SKU图集',
            width: '220px',
            render: (h, params) => {
              let imgs = []
              for (let i of params.row.images) {
                if (i) {
                  imgs.push(
                    h('img', {
                      style: {width: '30px', height: '30px', margin: '0px 5px 0px 0px'},
                      domProps: {
                        src: `${i}!56`
                      },
                      on: {'click': () => {
                        if (i) {
                          this.handleView(i)
                        }
                      }}
                    })
                  )
                }
              }
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
                  },
                  on: {
                    'click': () => {
                      this.setImages(params.row)
                    }
                  }
                }, '选图')
              ])
            }
          }
        ],
        // ------- 编辑图集弹窗
        editImgsFlag: false,
        editImgs: [],
        editImgsId: ''
      }
    },
    methods: {
      // 初始化富文本
      initUed (name) {
        if (!this.isSetUE) {
          if (name === 'step2') {
            this.isLoad = true
            // ====================================  得到富文本内容
            this.getDetail(this.productInfo.spuInfos.spuId,
            (res) => {
              this.ueditor.value = res.data.richContent
              this.$refs.ueditor.init()
              this.isSetUE = true
              this.isLoad = false
            })
          }
        }
      },
      saveToback () {
        // 判断是否全部为null
        let skuAllNull = true
        let params = {
          spuId: this.productInfo.spuInfos.spuId,
          introduction: this.introduction,
          priceWay: this.priceWay,
          keyword: this.keyWord,
          designCode: this.designCode,
          name: this.name,
          origin: this.origin,
          barCode: this.defaultBarCode,
          richText: this.isSetUE ? this.$refs.ueditor.getUEContent() : null,
          videoUrl: this.video[0] ? this.video[0].video_original : '',
          specValueArray: [],
          skuSpecValueArray: []
        }
        // 通用参数
        for (let i in this.publicParams) {
          let objSpecValue = {
            specId: this.publicParams[i].id,
            memo: this.publicParams[i].memo,
            specName: this.publicParams[i].specName,
            specValues: [],
            type: this.publicParams[i].type * 1
          }
          if (this.publicParams[i].type !== 2) {
            let obja = {}
            // 非多选的情况
            if (this.publicParams[i].value !== '') {
              if (this.publicParams[i].type === 6) {
                obja = {
                  specValueId: this.initPublic[i].value ? this.initPublic[i].value.id : '',
                  specValue: this.publicParams[i].value.getTime().toString()
                }
              } else {
                obja = {
                  specValueId: this.initPublic[i].value ? this.initPublic[i].value.id : '',
                  specValue: this.publicParams[i].value
                }
              }
            } else {
              obja = {
                specValueId: '',
                specValue: ''
              }
            }
            objSpecValue.specValues.push(obja)
          } else {
            // 多选的情况
            for (let k in this.publicParams[i].value) {
              let obja = {}
              if (this.publicParams[i].value !== '') {
                obja = {
                  specValueId: this.initPublic[i].value[k] ? this.initPublic[i].value[k].id : '',
                  specValue: this.publicParams[i].value[k]
                }
              } else {
                obja = {
                  specValueId: '',
                  specValue: ''
                }
              }
              objSpecValue.specValues.push(obja)
            }
          }
          params.specValueArray.push(objSpecValue)
        }
        // sku 销售属性
        // sku 类目销售属性
        for (let j of this.skuParams) {
          let objSkuValue = {
            specId: j.id || '',
            specName: j.specName,
            memo: j.memo || j.cateSpuSpecId,
            specValues: []
          }
          for (let k of j.value) {
            let objValues = {
              specValueId: '',
              specValue: k || ''
            }
            for (let l of j.valueC) {
              if (l.name === k) {
                objValues.specValueId = l.id
              }
            }
            objSkuValue.specValues.push(objValues)
          }
          params.skuSpecValueArray.push(objSkuValue)
        }
        // sku销售属性
        for (let k in this.skuInput) {
          let objSkuValue = {
            specId: this.skuInput[k].id,
            specName: this.skuInput[k].name,
            memo: '',
            specSpecValues: []
          }
          for (let l of this.skuInput[k].values) {
            if (this.skuInput[k].name === 'WeightOfGold&IsOnly1' && !/^\d+$/.test(l.spuSpecValue) && !/^\d+\.\d+$/.test(l.spuSpecValue)) {
              console.log(l.spuSpecValue)
              this.$Message.warning('\'重量(g)\' 必须为数字')
              return
            }
            let objc = {
              specValue: l.spuSpecValue,
              specValueId: l.spuSpecValueId
            }
            objSkuValue.specSpecValues.push(objc)
          }
          params.skuSpecValueArray.push(objSkuValue)
        }
        // sku表格值
        this.origin.updateSkuIds = []
        for (let l of this.skuGroups) {
          let objd = {}
          if (l.stock === '' || l.stock === null) {
            if (l.images.length > 0) {
              objd = {
                skuId: l.id,
                newPrice: l.price,
                pictures: l.images,
                stock: null
              }
            } else {
              objd = {
                skuId: l.id,
                newPrice: l.price,
                pictures: [''],
                stock: null
              }
            }
          } else {
            skuAllNull = false
            if (l.images.length > 0) {
              objd = {
                skuId: l.id,
                newPrice: l.price,
                pictures: l.images,
                stock: l.stock
              }
            } else {
              objd = {
                skuId: l.id,
                newPrice: l.price,
                pictures: [''],
                stock: l.stock
              }
            }
          }
          this.origin.updateSkuIds.push(objd)
        }
        // 商品广告词和产地
        let objb = {}
        let flag = 0
        for (let k of this.productInfo.spuInfos.spuSpec.select) {
          if (k.spuSpecValues[0].spuSpecValueId === this.adverMesGet.spuSpecValueId) {
            flag++
            objb = {
              specId: k.spuSpecId,
              memo: '',
              specName: k.spuSpecName,
              type: '',
              specValues: [{
                specValue: this.adverMesGet.spuSpecValue,
                specValueId: this.adverMesGet.spuSpecValueId
              }]
            }
          } else if (k.spuSpecValues[0].spuSpecValueId === this.locationGet.spuSpecValueId) {
            flag++
            objb = {
              specId: k.spuSpecId,
              memo: '',
              specName: k.spuSpecName,
              type: '',
              specValues: [{
                specValue: this.locationGet.spuSpecValue,
                specValueId: this.locationGet.spuSpecValueId
              }]
            }
          }
          params.specValueArray.push(objb)
          if (flag > 1) {
            break
          }
        }
        // ======================= 表单验证 :基本信息
        let publicParamsArr = []
        let barCodeNotInWrited = true
        for (let i of this.publicParams) {
          if (i.value) {
            publicParamsArr.push(1)
          }
        }
        // 基本信息
        this.commonAdding = true
        this.$refs.baseInfoForm.validate((valid) => {
          if (valid) {
            if (publicParamsArr.length === 0) {
              this.$Message.warning('需要至少一条通用参数')
              this.commonAdding = false
              return
            }
            this.$refs.publicParamsForm.validate((valid) => {
              if (valid) {
                let params = this.getCommonSpec()
                this.$emit('next', params)
                this.commonAdding = false
              } else {
                this.commonAdding = false
                this.$Message.warning('请填充通用参数必填项')
              }
            })
          } else {
            this.commonAdding = false
            this.$Message.warning('请填充基本信息必填项')
          }
        })
        if (this.goldPrice === '' && this.priceWay === 2) {
          // 金价停用了
          this.$Message.warning(' 该商品金价已停用，请重新选择金价！')
          return
        }
        // 判断sku不能全部为空
        if (skuAllNull) {
          this.commonAdding = false
          this.$Message.warning('请至少为一条要使用sku商品填写库存,否则无法保存商品!')
          return
        } else {
          for (let i of this.origin.updateSkuIds) {
            // 判断填写了库存的sku是否添加了图集
            if (i.stock !== null && i.pictures[0] === '') {
              this.commonAdding = false
              this.$Message.warning('要使用的sku商品须添加SKU图集图片!')
              return
            } else if (i.stock !== null && i.pictures !== '') {
              if (i.skuId === params.barCode) {
                barCodeNotInWrited = false
              }
            }
          }
        }
        if (barCodeNotInWrited) {
          this.commonAdding = false
          this.$Message.warning(' 默认sku组合须填写库存和添加图集图片！')
          return
        }
        if (this.commonAdding) {
          console.log(params)
          this.setSkuproduct(params, this.productInfo.status)
        }
      },
      judgeName () {
        let str = this.baseInfo.name
        if (str) {
          str = str.replace(/^\s+/, '')
          str = str.replace(/\s+$/, '')
        }
        this.baseInfo.name = str
      },
      judgeAdvert () {
        let str = this.baseInfo.advert
        if (str) {
          str = str.replace(/^\s+/, '')
          str = str.replace(/\s+$/, '')
        }
        this.baseInfo.advert = str
      },
      judgePlace () {
        let str = this.baseInfo.placeOfOrigin
        if (str) {
          str = str.replace(/^\s+/, '')
          str = str.replace(/\s+$/, '')
        }
        this.baseInfo.placeOfOrigin = str
      },
      setImages (row) {
        this.editImgsFlag = true
        let imgs1 = []
        for (let i of row.images) {
          imgs1.push({
            url: i,
            status: 'finished'
          })
        }
        this.editImgs = imgs1
        this.editImgsId = row.id
      },
      // 查看大图
      handleView (url) {
        this.imgUrl = url
        this.visible = true
      },
      confirmPicSet (img) {
        let arr = []
        for (let i of img) {
          arr.push(i.url)
        }
        for (let l of this.skuGroups) {
          if (l.id === this.editImgsId) {
            l.images = arr
          }
        }
        this.editImgsFlag = false
      },
      cancelPicSet () {
        this.editImgsFlag = false
      },
      // ---------------------------------------------  新增自定义SKU
      addDiySku (val) {
        if (val) {
          if (this.skuInput.length < 4) {
            this.skuInput.unshift({
              name: val,
              values: [{spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}],
              id: ''
            })
          } else {
            this.$Message.warning({content: '请删除一个销售属性后再改金价'})
          }
        } else {
          if (this.skuInput.length < 4) {
            this.skuInput.unshift({
              name: '',
              values: [{spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}],
              id: ''
            })
          } else {
            this.$Message.warning({content: '最多只能添加4种销售属性!'})
          }
        }
      },
      // 新增自定义SKU values
      addDiySkuValues (index) {
        this.skuInput[index].values.push({spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''}, {spuSpecValueId: '', spuSpecValue: ''})
      },
      // 删除自定义SKU
      removeDiySku (index, item) {
        this.skuInput.splice(index, 1)
      },
      // 提交sku属性值，获得sku组合
      getSkuGroups () {
        this.origin.deleteSkuIds = []
        // 重新获取sku组合
        let param = []
        for (let i of this.skuParams) {
          if (i.value.length > 0) {
            let obj = {
              memo: i.cateSpuSpecId,
              specName: i.specName,
              specValues: i.value
            }
            param.push(obj)
          }
        }
        let objR = {}
        for (let j of this.skuInput) {
          if (!objR[j.name]) {
            objR[j.name] = 1
            let objV = {}
            let obj = {}
            for (let l of j.values) {
              if (l.spuSpecValue !== '') {
                if (!objV[l.spuSpecValue]) {
                  objV[l.spuSpecValue] = 1
                  obj = {
                    memo: '',
                    specName: j.name,
                    specValues: []
                  }
                  for (let k of j.values) {
                    if (j.name === 'WeightOfGold&IsOnly1' && !(/^(-?\d*)(\.\d+)?$/).test(k.spuSpecValue)) {
                      this.$Message.error('\'重量(g)\' 必须为数字')
                      return
                    }
                    if (k.spuSpecValue) {
                      obj.specValues.push(k.spuSpecValue)
                    }
                  }
                } else {
                  this.$Message.error(`属性'${j.name.replace('WeightOfGold&IsOnly1', '重量(g)')}'的值重复`)
                  return
                }
              }
            }
            if (obj.specName) {
              param.push(obj)
            }
          } else {
            this.$Message.error(`属性'${j.name.replace('WeightOfGold&IsOnly1', '重量(g)')}'的名称重复`)
            return
          }
        }
        if (param.length > 0) {
          // 请求请求获取sku组合
          this.getSkuGroup((res) => {
            let skuGroups = []
            for (let i of res.skuInfos) {
              let obj = {
                id: i.id,
                images: [],
                name: i.name,
                price: 0,
                stock: '',
                handPay: 0
              }
              skuGroups.push(obj)
            }
            this.skuGroups = []
            this.skuGroups = skuGroups
            // 成功后才能修改sku组合
          // 重置重新获取sku组合前的删除数组
            this.defaultBarCode = ''
            this.origin.isclean = 1
          }, param, this.productInfo.spuInfos.spuId, this.productInfo.status)
        } else {
          this.$Message.error('请添加销售属性再获取sku组合！')
          return
        }
      },
      // ============================  表单验证

      // 设置默认SKU组合图集
      setDefaultImg () {
        let imgArr = []
        for (let i of this.imgs) {
          imgArr.push(i.url)
        }
        for (let j of this.skuGroups) {
          j.images = imgArr
        }
      },
      // 包含数组方法
      myContains (param, array) {
        for (let o of array) {
          if (o.cateSpuSpecValueName === param) return true
        }
        return false
      },
      // --------------API--------------
      getSkuGroup (callback, param, spuId, status) {
        this.$http.post(...pdAPI.getSkuGroup(param, spuId, status))
        .then(response => {
          if (response.data.code === 200) {
            if (typeof (callback) === 'function') {
              callback(JSON.parse(response.request.response))
            }
          } else {
            this.$Message.error({content: response.data.code})
          }
        })
      },
      setSkuproduct (params, status) {
        // 保存多品修改信息
        this.$http.post(...pdAPI.setSkuInfo(params, status))
        .then(response => {
          if (response.data.code === 200) {
            this.$Message.success({content: '保存成功!'})
            this.$parent.$parent.subConfirm = false
          } else {
            this.$Message.error({content: response.data.code})
          }
        })
      },
      // 传入spuid得到待售商品的富文本信息
      getDetail (spuId, callback) {
        this.$http.get(pdAPI.getDetail(spuId))
        .then(res => {
          if (res.data.code === 200) {
            if (typeof callback === 'function') {
              callback(res)
            }
          } else if (res.data.code === 2001) {
            callback()
          }
        })
      },
      // 接口-获取金价
      getGoldPrices (callback) {
        this.$http.get(goldAPI.getGoldPrice()).then(res => {
          if (res.data.code === 200) {
            let prices = []
            for (let i of res.data.goldPrice) {
              if (i.status === 1) {
                prices.push(i)
              }
            }
            this.goldPrices = prices
            if (typeof callback === 'function') {
              callback()
            }
          }
        })
      }
    },
    computed: {
      adverMes: {
        get: function () {
          // 获取商品广告词
          return this.adverMesGet.spuSpecValue || ''
        },
        set: function (val) {
          this.adverMesGet.spuSpecValue = val
        }
      },
      location: {
        get: function () {
          // 获取商品产地
          return this.locationGet.spuSpecValue || ''
        },
        set: function (val) {
          this.locationGet.spuSpecValue = val
        }
      },
      nameLength: function () {
        return 50 - this.name.length
      },
      adverLength: function () {
        return 50 - this.adverMes.length
      },
       // =======================================  表单验证
       // 通用属性表单验证用
      publicParamsModel () {
        let publicParams = JSON.parse(JSON.stringify(this.publicParams))
        let obj = {}
        for (let i in publicParams) {
          obj[`common${i}`] = publicParams[i].value[0]
        }
        return obj
      },
      publicParamsRules () {
        let publicParams = JSON.parse(JSON.stringify(this.publicParams))
        let obj = {}
        for (let i in publicParams) {
          if (publicParams[i].isWrite === 1) {
            obj[`common${i}`] = [{required: true, message: '必填项不可为空', trigger: 'submit'}]
          } else {
            obj[`common${i}`] = []
          }
        }
        return obj
      },
      skuGroupName: {
        get () {
          let arr = []
          for (let i in this.skuGroups) {
            let name
            if (this.skuGroups[i].name.indexOf('WeightOfGold&IsOnly1:') !== -1) {
              name = this.skuGroups[i].name.replace('WeightOfGold&IsOnly1:', '')
            } else {
              name = this.skuGroups[i].name
            }
            let obj = {
              id: this.skuGroups[i].id,
              name: name,
              index: this.skuGroups[i].index
            }
            arr.push(obj)
          }
          return arr
        },
        set (val) {
        }
      }
    },
    watch: {
      priceWay: function (newV, oldV) {
        if (newV === 1 && oldV === 2) {
          // 从金价改为一口价的时候
          for (let i of this.skuGroups) {
            i.price = 0
          }
          for (let i in this.skuInput) {
            if (this.skuInput[i].name === 'WeightOfGold&IsOnly1') {
              this.skuInput.splice(i, 1)
            }
          }
        } else if (newV === 2 && oldV === 1) {
          this.addDiySku('WeightOfGold&IsOnly1')
        }
        if (newV !== oldV) {
          for (let i of this.skuGroups) {
            i.handPay = 0
          }
        }
      },
      name: {
        handler: function (val) {
          this.baseInfo.name = val
        },
        immediate: true
      },
      keyWord: {
        handler: function (val) {
          this.baseInfo.keyWord = val
        },
        immediate: true
      },
      designCode: {
        handler: function (val) {
          this.baseInfo.designCode = val
        },
        immediate: true
      },
      adverMes: {
        handler: function (val, oldval) {
          this.baseInfo.adverMes = val
        },
        immediate: true
      },
      goldPrice: function (newV, oldV) {
        if (newV !== oldV) {
          for (let i of this.skuGroups) {
            if (i.price) {
              i.price = i.price.replace(/[A-z]+/g, JSON.parse(newV).key)
            }
          }
        }
      }
    },
    mounted: function () {
      console.log('多品')
      // 获取商品产地、商品广告词
      for (let j of this.productInfo.spuInfos.spuSpec.select) {
        if (!j.memo) {
          if (j.spuSpecName === '产地') {
            this.locationGet = j.spuSpecValues[0]
          } else if (j.spuSpecName === '商品广告词') {
            this.adverMesGet = j.spuSpecValues[0]
          }
        }
      }
      if (this.productInfo.spuInfos.videoUrl) {
        let objUrl = {
          video_original: this.productInfo.spuInfos.videoUrl,
          status: 'finished'
        }
        this.video.push(objUrl)
      }
      // 判断通用参数类型
      let arrAttr = []
      for (let i of this.productInfo.spuInfos.spuSpec.all) {
        let obj = {
          id: '',
          memo: i.cateSpuSpecId,
          specName: i.cateSpuSpecName,
          type: i.type * 1,
          // 通用参数的属性值
          value: '',
          // 通用参数的属性
          values: i.cateSpuSpecValues,
          isWrite: i.isWrite
        }
        arrAttr.push(obj)
      }
      for (let i of this.productInfo.skuInfos.skus) {
        if (i.skuCode === this.defaultBarCode) {
          let arryImg = []
          for (let j of i.pictures) {
            let obj = {
              url: j,
              status: 'finished'
            }
            arryImg.push(obj)
          }
          this.imgs = arryImg
        }
      }
      // ===================================== 得到金价
      this.getGoldPrices(() => {
        // 获取当前选择的金价
          // 计价的方式才会出现
        for (let i of this.goldPrices) {
          if (this.skuGroups[0].price) {
            if (i.key === this.skuGroups[0].price.replace(/[^a-z]+/g, '')) {
              this.goldPrice = JSON.stringify(i)
            }
          }
        }
      })
      // 得到spu参数
      let arrAttrC = JSON.parse(JSON.stringify(arrAttr))
      let arrAttrD = JSON.parse(JSON.stringify(arrAttr))
      for (let j in arrAttr) {
        for (let k of this.productInfo.spuInfos.spuSpec.select) {
          if (arrAttrC[j].type === 6 && arrAttrC[j].memo === k.memo) {
            arrAttrC[j].id = k.spuSpecId
            arrAttrD[j].id = k.spuSpecId
            arrAttrC[j].value = new Date(parseInt(k.spuSpecValues[0].spuSpecValue))
            arrAttrD[j].value = {id: k.spuSpecValues[0].spuSpecValueId, name: new Date(parseInt(k.spuSpecValues[0].spuSpecValue))}
            break
          } else if (arrAttr[j].type === 2 && arrAttrC[j].memo === k.memo) {
            arrAttrC[j].value = []
            arrAttrD[j].value = []
            arrAttrC[j].id = k.spuSpecId
            arrAttrD[j].id = k.spuSpecId
            for (let l in k.spuSpecValues) {
              arrAttrC[j].value.push(k.spuSpecValues[l].spuSpecValue)
              arrAttrD[j].value.push({id: k.spuSpecValues[l].spuSpecValueId, name: k.spuSpecValues[l].spuSpecValue})
            }
            break
          } else if (arrAttr[j].type === 2) {
            arrAttrC[j].value = []
            arrAttrD[j].value = []
          } else {
            if (arrAttrC[j].memo === k.memo) {
              arrAttrC[j].id = k.spuSpecId
              arrAttrD[j].id = k.spuSpecId
              arrAttrC[j].value = k.spuSpecValues[0].spuSpecValue
              arrAttrD[j].value = {id: k.spuSpecValues[0].spuSpecValueId, name: k.spuSpecValues[0].spuSpecValue}
              break
            }
          }
        }
      }
      // spu通用参数
      this.publicParams = arrAttrC
      // 保存初始数值
      this.initPublic = arrAttrD
      // sku类目参数
      let arrSku = []
      for (let i of this.productInfo.skuInfos.cateAll) {
        // 获取选项值
        if (i.cateSpuSpecValues) {
          let obj = {
            id: '',
            cateSpuSpecId: i.cateSpuSpecId,
            memo: '',
            specName: i.cateSpuSpecName,
            values: i.cateSpuSpecValues,
            value: [],
            valueC: []
          }
          for (let j of this.productInfo.skuInfos.cateSelect) {
            // 自定义颜色颜色
            if (i.cateSpuSpecName === '颜色' && j.skuSpecName === '颜色') {
              let arryColor = []
              for (let m of j.skuSpecValues) {
                this.myContains(m.spuSpecValue, i.cateSpuSpecValues)
                if (!this.myContains(m.spuSpecValue, i.cateSpuSpecValues)) {
                  arryColor.push(m)
                }
              }
              console.log(arryColor)
              this.selfColor = arryColor
              obj.values = [...obj.values, ...arryColor]
            }
            // 获取选中的选项值
            if (j.memo === i.cateSpuSpecId) {
              obj.id = j.skuSpecId
              obj.memo = j.memo
              for (let k of j.skuSpecValues) {
                obj.value.push(k.spuSpecValue)
                obj.valueC.push({id: k.spuSpecValueId, name: k.spuSpecValue})
              }
            }
          }
          arrSku.push(obj)
        }
      }
      this.skuParams = arrSku
      // sku销售属性
      let arraySku = []
      for (let j of this.productInfo.skuInfos.cateSelect) {
        if (!j.memo) {
          let obj = {
            id: j.skuSpecId,
            name: j.skuSpecName,
            values: j.skuSpecValues,
            createDate: j.createDate
          }
          arraySku.push(obj)
        }
      }
      arraySku.sort((a, b) => {
        if (a.createDate - b.createDate > 0) {
          return 1
        } else {
          return -1
        }
      })
      this.skuInput = arraySku
      // sku显示table
      let skus = []
      if (this.productInfo.skuInfos.cateSelect !== 0) {
        for (let k of this.productInfo.skuInfos.skus) {
          let pictures = []
          if (k.pictures[0]) {
            pictures = k.pictures
          }
          let obj = {
            key: k.skuId,
            name: k.skuName,
            id: k.skuCode,
            price: k.price,
            handPay: this.productInfo.spuInfos.priceWay === 2 ? k.price.substring(k.price.indexOf('+') + 1) : '',
            stock: k.skuStock,
            images: pictures
          }
          skus.push(obj)
        }
      }
      if (this.priceWay === 1) {
        this.isPriceWay = true
      }
      this.skuGroups = skus
      // 监听保存事件
      this.$nextTick(function () {
        this.$on('saveToback', function () {
          this.saveToback()
        })
      })
    }
  }
</script>
