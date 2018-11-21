<style lang="scss" rel="stylesheet/scss" scoped>
  .margin-10 {
    margin: 10px;
  }
  .margin-left-10 {
    margin-left: 10px;
  }
  .color-input {
    width: 80px;
    margin: 0px 10px 0px 0px;
  }
  .my-btn-bar {
    text-align: center;
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
  <div id="addPPart2">
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

    <b class="margin-10">销售属性</b>
    <Form :label-width="105" v-for="(item, index) in skuParams" :key="index">
      <FormItem :label="`${item.name}：`">
        <CheckboxGroup v-if="selectedSku.length > 0" v-model="selectedSku[index].values">
          <Checkbox v-for="(item2, index2) in item.values" :key="index2" :label="item2.name">{{item2.name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>

      <FormItem label="自定义颜色：" v-show="item.name === '颜色'">
        <Input class="color-input" @on-blur="diyColorChange" v-for="(item2, index2) in diyColors" :key="index2" v-model="diyColors[index2]"></Input>
      </FormItem>
    </Form>

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

    <!-- 计价重量 -->
    <div class="diy-sku-box" v-show="pType === 2">
      <div><Input class="diy-sku-input" value="重量 (g)" disabled size="small"></Input></div>
      <div>
        <Input class="diy-sku-input" :maxlength="20" v-for="(item, index) in weightSku.values" :key="index" v-model="weightSku.values[index]" size="small" placeholder="请输入克数"></Input>
        <Button type="text" icon="plus-round" class="my-push-icon" @click="addWeightSkuValues()"></Button>        
      </div>
    </div>

    <Button @click="addDiySku" class="margin-left-10" :disabled="addDiySkuDisable">添加销售属性</Button>
    <Button @click="getSkuGroups" :loading="skuGroupsLoading" :disabled="skuGroupsParam1.length === 0" type="primary">获取SKU组合</Button>
    <Button @click="clearSkuGroups" :disabled="skuGroups.length === 0">清除SKU组合</Button>

    <RadioGroup v-model="pType">
      <Radio :label="2" style="margin: 0px 0px 0px 10px;">金价</Radio>
      <Select v-model="goldPrice" :disabled="pType === 1" style="width: 100px;">
        <Option v-for="(item, index) in goldPrices" :key="index" :value="JSON.stringify(item)">{{item.name}}</Option>
      </Select>
      <Radio :label="1" style="margin: 0px 0px 0px 10px;">一口价</Radio>
    </RadioGroup>

    <Table :columns="colorColumn" :data="colorNames" class="margin-10" v-show="!imgFlag1"></Table>
    <p style="padding: 10px 0px 0px 12px;color: red;">库存不填写内容，即当前条sku组合不使用</p>
    <Table class="margin-10" :columns="skuColumn" :data="skuGroups" ref="skuTable"></Table>
    
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
    <!-- 编辑skugroup图集 -->
    <Modal title="编辑图集" v-model="editImgsFlag">
      <uploadImg5 v-model="editImgs" viewInParent @handleView="handleView"></uploadImg5>
      <div slot="footer">
        <Button type="primary" @click="saveEditImgs">确定</Button>
        <Button @click="cancelEditImgs">取消</Button>
      </div>
    </Modal>
    <!-- 黏贴图集确定框 -->
    <Modal title="粘贴图集" v-model="pasteImgsFlag">
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
    <Modal title="查看大图" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
    <Form>
      <FormItem label="发布：" :label-width="70">
        <RadioGroup v-model="addPType">
          <Radio label="now">立即</Radio>
          <Radio label="inft">定时</Radio>
          <DatePicker v-model="addPDate" :disabled="addPType !== 'inft'" placement="top" type="datetime" placeholder="选择日期和时间" style="width: 200px;margin: 0px 10px 0px 0px;"></DatePicker>
          <Radio label="toStock">放入仓库</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div class="my-btn-bar">
      <Button @click="back">上一步</Button><Button class="margin-left-10" @click="next" :loading="comiting">发布</Button>
    </div>
  </div>
</template>
<script type="text/ecmascript">
  import * as cateAPI from '../../../services/operationCate.es6'
  import * as pAPI from '../../../services/product.es6'
  import * as goldAPI from '../../../services/goldPrice.es6'
  import * as tool from '../../../services/tool.es6'
  import uploadVideo1 from '../../../components/uploadVideo1.vue'
  import uploadImg5 from '../../../components/uploadImg5.vue'
  let interval
  let timeout
  export default {
    name: 'addPPart2',
    components: {
      uploadVideo1,
      uploadImg5
    },
    data () {
      return {
        // ----------视频
        video: [],
        // -----------默认图集
        imgs: [], 
        imgFlag1: true,
        // ------- 编辑图集弹窗
        editImgsFlag: false,
        editImgs: [],
        editImgsId: '',
        // ------------复制图集      
        copyImgs: [],
        // ------------黏贴图集
        pasteImgsFlag: false,
        pasteImgsId: '',
        // ------------sku参数
        skuParams: [
//          {name: '颜色', values: ['红色', '黄色', '深紫色', '蓝色', '灰色', '白色']},
//          {name: '尺码', values: ['L', 'M', 'S']}
        ],
        selectedSku: [],
        diyColors: [''],
        diySku: [],
        // ------sku组合 table
        skuColumn: [
          {
            title: 'SKU组合',
            width: 100,
            render: (h, params) => {
              return this.handleSkuGroupName(params.row.name)
            }
          },
          {title: 'SKU编码', key: 'id', width: 180},
          {
            title: '手工费',
            width: 120,
            render: (h, params) => {
              return h ('Input', {
                style: {width: '100px'},
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
            title: '商家编码',
            width: 180,
            render: (h, params) => {
              return h ('Input', {
                style: {width: '160px'},
                props: {
                    value: params.row.relevanceProduct
                },
                on: {
                  'on-blur': (val) => {
                    this.skuGroups[params.index].relevanceProduct = val.target.value
                    this.skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
                  }
                }
              })
            }
          },
          {
            title: '售价',
            width: 120,
            render: (h, params) => {
              let dom
              if (this.pType === 2) {
                // ----------计价           
                let goldKey = params.row.price
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
                  style: {width: '100px'},
                  props: {
                    value: goldPrice * weight + handPrice,
                    disabled: true
                  }
                })
              } else if (this.pType === 1) {
                // ----------定价
                dom = h('Input', {
                  style: {width: '100px'},
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
                style: {width: '80px'},
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
            width: 220,
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
                  style: {display: 'block', margin: '0px 10px 0px 0px'},
                  on: {click: () => { this.openEditImgsModal(params.row.id, params.row.pictures) }}
                }, '编辑图集'),
                h('a', {
                  style: {display: 'block', margin: '0px 10px 0px 0px'},
                  on: {click: () => { this.copyImgsEvent3(params.row.pictures) }}
                }, '复制图集链接'),
                h('a', {
                  style: {display: 'block', margin: '0px 10px 0px 0px'},
                  on: {click: () => { this.openPasteImgsModal(params.row.id) }}
                }, '黏贴图集链接')
              ])
            }
          }
        ],
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
        // ------------查看大图
        imgUrl: '',
        visible: false,
        colorNames: [], // color imgs table data
        colorImgs: [], // color imgs data
        // ---------sku组合入参
        skuGroupsLoading: false,
        skuGroupsParam: {},
        // --------选择sku编码
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
        // ----------商品类型 1:一口价 2:计价
        pType: 2,
        // ----------金价下拉列表
        goldPrices: [],
        goldPrice: '',
        // ----------重量
        weightSku: {
          name: 'WeightOfGold&IsOnly1',
          values: ['', '', '', '', '', '', '', '', '', '']
        },
        // -----------发布类型
        addPType: 'toStock',
        addPDate: '',
        // ----发布按钮loading
        comiting: false 
      }
    },
    props: {
      currCate: String,
      currCateId: String,
      spuId: '',
      richText: ''
    },
    mounted: function () {
      interval = setInterval(() => {
        if (this.currCateId) {
          this.getSkuParams()
          clearInterval(interval)
        }
      }, 30)
      this.getGoldPrices()
    },
    methods: {
      isEmpty (val) {
        if (!/^['']*$/.test(val) && !/^[' ']+$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      // 页面-获取SKU参数
      getSkuAttr (callback) {
        this.$http.get(cateAPI.getSkuAttr(this.currCateId)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      // 接口-获取SKU参数
      getSkuParams () {
        this.getSkuAttr((response) => {
          if (response.data.code === 200) {
            let catalogAttr = response.data.catalogAttr
            for(let i of catalogAttr) {
              this.selectedSku.push({
                name: i.name,
                id: i.id,
                values: []
              })
            }
            let arr = []
            for (let i of catalogAttr) {
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
      // 接口-获取金价
      getGoldPrices () {
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
      // 新增自定义SKU
      addDiySku () {
        this.diySku.unshift({
          name: '',
          values: ['', '', '', '', '', '', '', '', '', '']
        })
      },
      // 新增自定义SKU values
      addDiySkuValues (index) {
        this.diySku[index].values.push('','','','','')
      },
      // 删除自定义SKU
      removeDiySku (index) {
        this.diySku.splice(index, 1)
      },
      // 新增重量 values
      addWeightSkuValues () {
        this.weightSku.values.push('','','','','')
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
            if(!/^\d+$/.test(i) && !/^\d+\.\d+$/.test(i)) {
              console.log(i)
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
      // 复制imgs
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
        console.log(colorImg)
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
      // 确认对话框 黏贴imgs
      back () {
        this.$emit('back')
      },
      next () {
        let skuEdited = 0
        let skuGroups = JSON.parse(JSON.stringify(this.skuGroups))
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
            this.comiting = false
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
      },
      addProduct () {
        this.comiting = true
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
            this.comiting = false
            return
          }
          // ----------判断填写了库存的有没有图集
          for (let i of skuGroups) {
            if (i.stock !== '' && i.pictures.length === 0) {
              this.$Message.warning('要使用的sku商品须添加SKU图集图片!')
              this.comiting = false
              return
            }
          }
          // ----------判断默认sku组合
          for (let i of skuGroups) {
            if (i.id === this.noSku.selectedSkuCode) {
              if (i.stock === '' || i.pictures.length === 0) {
                this.$Message.warning('默认sku组合需填写库存和添加图集图片！')
                this.comiting = false
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
              pictures: i.pictures.length > 0 ? i.pictures : [''],
              relevanceProduct: i.relevanceProduct
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
          console.log(params)
          this.comiting = false
          if (this.addPType === 'now') {
            for (let i of skuGroups) {
              if (i.stock === 0) {
                this.$Message.warning('立即发布的商品，库存不可为0')
                this.comiting = false
                return
              }
            }
            this.addPsNow(params)
          } else if (this.addPType === 'inft') {
            for (let i of skuGroups) {
              if (i.stock === 0) {
                this.$Message.warning('定时的商品，库存不可为0')
                this.comiting = false
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
          params.launchTime = this.addPType === 'inft' ? this.addPDate.getTime() : null,
          params.name = this.noSku.name
          params.originalPrice = 0
          params.price = parseFloat(this.noSku.price)
          params.spuId = this.spuId
          params.stock = parseInt(this.noSku.stock)
          params.priceWay = this.pType,
          params.richText = this.richText,
          params.videoUrl = this.video.length > 0 ? this.video[0].video_original : ''
          let imgs = []
          for (let i of this.imgs) {
            imgs.push(i.url)
          }
          if (imgs.length === 0) {
            this.$Message.warning('至少配置一张图片')
            this.comiting = false
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
                window.location.reload()
              }
            })
          } else {
            this.$Message.error('立即发布失败')
            this.comiting = false
          }
        }).catch(() => {
          this.comiting = false
        })
      },
      addPsInFt (params) {
        this.$http.post(...pAPI.postSkuInfosInFt(params)).then(response => {
          if (response.data.code === 200) {
            this.$Modal.success({
              title: '商品发布',
              content: '定时发布成功',
              onOk: () => {
                window.location.reload()()
              }
            })
          } else {
            this.$Message.error('定时发布失败')
            this.comiting = false
          }
        }).catch(() => {
          this.comiting = false
        })
      },
      addPsToStock (params) {
        this.$http.post(...pAPI.postSkuInfosToStock(params)).then(response => {
          if (response.data.code === 200) {
            this.$Modal.success({
              title: '商品发布',
              content: '放入仓库成功',
              onOk: () => {
                window.location.reload()
              }
            })
          } else {
            this.$Message.error('放入仓库失败')
            this.comiting = false
          }
        }).catch(() => {
          this.comiting = false
        })
      },
      addPNow (params) {
        this.$http.post(...pAPI.postSkuInfo(params)).then(response => {
          if (response.data.code === 200) {
            this.$Modal.success({
              title: '商品发布',
              content: '立即发布成功',
              onOk: () => {
                window.location.reload()
              }
            })
          } else {
            this.$Message.error('立即发布失败')
            this.comiting = false
          }
        }).catch(() => {
          this.comiting = false
        })
      },
      addPInFt (params) {
        this.$http.post(...pAPI.postSkuInfoInFt(params)).then(response => {
          if (response.data.code === 200) {
            this.$Modal.success({
              title: '商品发布',
              content: '定时发布成功',
              onOk: () => {
                window.location.reload()
              }
            })
          } else {
            this.$Message.error('定时发布失败')
            this.comiting = false
          }
        }).catch(() => {
          this.comiting = false
        })
      },
      addPToStock (params) {
        this.$http.post(...pAPI.postSkuInfoToStock(params)).then(response => {
          if (response.data.code === 200) {
            this.$Modal.success({
              title: '商品发布',
              content: '放入仓库成功',
              onOk: () => {
                window.location.reload()
              }
            })
          } else {
            this.$Message.error('放入仓库失败')
            this.comiting = false
          }
        }).catch(() => {
          this.comiting = false
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
      // sku属性及属性值，用于获取SKU组合
      skuGroupsParam1 () {
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
    watch: {
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
    }
  }
</script>