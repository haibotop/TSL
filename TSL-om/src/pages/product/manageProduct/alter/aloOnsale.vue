<style lang="scss" rel="stylesheet/scss" scoped>
  .ivu-modal-content{
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
  <div id="aloOnsale">
    <Tabs type="card" value="step1" @on-click="initUed">
      <TabPane label="基本信息" name="step1">
        <Form :label-width="180" :model="baseInfo" :rules="baseInfoRules" ref="baseInfoForm">
          <p><b class="margin-10">单品</b></p>
          <FormItem label="商品名称：" prop="name">
            <Input class="my-input" :maxlength="50" v-model="name" disabled></Input>
            <!-- <span class="tips-text">还能输入{{nameLength}}个字</span> -->
          </FormItem>
          <FormItem label="设计编码：" prop="designCode">
            <Input class="my-input" v-model="designCode"></Input>
          </FormItem>
          <FormItem label="商品广告词：" prop="adverMes">
            <Input class="my-input"  :maxlength="50" v-model="adverMes"></Input>
            <span class="tips-text">还能输入{{adverLength}}个字</span>
          </FormItem>
          <FormItem label="商品关键词：" prop="keyWord">
            <Input class="my-input" v-model="keyWord"></Input>
            <span class="tips-text">关键词之间用空格隔开</span>
          </FormItem>
          <FormItem label="产地：" prop="location">
            <Input class="my-input"  :maxlength="10" v-model="location"></Input>
            <span class="tips-text">10个字以内</span>
          </FormItem>
          <FormItem label="商品简介："><Input type="textarea" :maxlength="200" class="my-input" v-model="introduction"></Input><span class="tips-text">200个字以内</span></FormItem>
        </Form>
        <Form :label-width="180" :model="publicParamsModel" :rules="publicParamsRules" ref="publicParamsForm">
          <p><b class="margin-10">类目通用参数</b></p>
          <FormItem :label="item.specName" v-for="(item, index) in publicParams" :key="index" :prop="`common${index}`">
            <RadioGroup v-if="item.type === 1" v-model="item.value">
              <Radio v-for="(item2, index2) in item.values" :key="index2" :label="item2.cateSpuSpecValueName" disabled>{{item2.cateSpuSpecValueName}}</Radio>
            </RadioGroup>
            <CheckboxGroup v-if="item.type === 2" v-model="item.value">
              <Checkbox v-for="(item2, index2) in item.values" :key="index2" :label="item2.cateSpuSpecValueName" disabled>{{item2.cateSpuSpecValueName}}</Checkbox>
            </CheckboxGroup>
            <Select v-if="item.type === 3" v-model="item.value" class="my-select" :transfer="true">
              <Option v-for="(item2, index2) in item.values" :key="index2" :value="item2.cateSpuSpecValueName" disabled>{{item2.cateSpuSpecValueName}}</Option>
            </Select>
            <Input v-if="item.type === 4" :maxlength="30" placeholder="限30字" class="my-input" v-model="item.value" disabled></Input>
            <Input v-if="item.type === 5" type="textarea" :maxlength="200" placeholder="限200字" class="my-input" v-model="item.value" disabled></Input>
            <DatePicker v-if="item.type === 6" format="yyyy年MM月dd日" :transfer="true" placeholder="选择时间" v-model="item.value" placement="top" disabled></DatePicker>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="更多详情" name="step2">
        <b class="margin-10">详情页</b>
        <ueditor :id="ueditor.id" :value="ueditor.value" :config="ueditor.config" ref="ueditor"></ueditor>
      </TabPane>
      <TabPane label="销售参数" name="step3">
        <Form>
          <FormItem label="商品视频: ">
            <uploadVideo1 v-model="video"></uploadVideo1>
          </FormItem>
          <FormItem label="商品图集: ">
            <uploadImg5 class="margin-left-10" v-model="imgparams"></uploadImg5>
          </FormItem>
          <FormItem label="售价："><Input class="my-input" v-model="price"><span slot="prepend">￥</span></Input></FormItem>
          <FormItem label="展示库存(件)："><Input class="my-input" v-model="inventory"></Input></FormItem>
        </Form>
      </TabPane>
    </Tabs>
    <loading :isload="isLoad"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import uploadImg5 from '../../../../components/uploadImg5'
  import uploadVideo1 from '../../../../components/uploadVideo1.vue'
  import * as pdApi from '../../../../services/productManager.es6'
  import Loading from '../../../../components/loading'
  import ueditor from '../../../../components/ueditor.vue'

  export default {
    name: 'aloOnsale',
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
          value: this.productInfo.richContent,
          config: {
            autoHeightEnabled: true,
            autoFloatEnabled: true,
            initialFrameWidth: 900,
            initialFrameHeight: 300
          }
        },
        isSetUE: false,
        video: [],
        // 基本信息
        name: this.productInfo.spuInfos.name,
        designCode: this.productInfo.spuInfos.designCode,
        keyWord: this.productInfo.spuInfos.keyWord,
        introduction: this.productInfo.spuInfos.introduction,
        // 通用参数
        adverMesGet: '',
        locationGet: '',
        price: this.productInfo.skuInfos.skus[0].price,
        inventory: this.productInfo.skuInfos.skus[0].skuStock,
        pictures: this.productInfo.skuInfos.skus[0].pictures,
        publicParams: null,
        imgparams: [],
        isLoad: false,
        // 操作步骤
        initData: '',
        // 表单验证info
        baseInfo: {
          name: '',
          designCode: '',
          adverMes: '',
          keyWord: ''
        },
        baseInfoRules: {
          name: [{required: true, message: '此项不可为空'}],
          // adverMes: [{required: true, message: '此项不可为空'}],
          designCode: [{required: true, message: '此项不可为空'}],
          //   {
          //     required: true,
          //     validator: (rule, value, callback) => {
          //       if (value && !(/^[1-9]\d*$/).test(value)) {
          //         callback(new Error('请输入正确格式!'))
          //       } else if (value.length < 1) {
          //         callback(new Error('此项不可为空'))
          //       } else {
          //         callback()
          //       }
          //     }
          //   }
          // ],
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
        skuparams: this.productInfo.skuInfos
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
      // 传入spuid得到待售商品的富文本信息
      getDetail (spuId, callback) {
        this.$http.get(pdApi.getDetail(spuId))
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
      saveToback () {
        console.log('保存ing！')
        if (!(/^[0-9]\d*$/).test(this.inventory)) {
          this.$Message.warning('请正确填写库存!')
          return
        } else if (this.inventory.length > 16) {
          this.$Message.warning('库存长度最多16位!')
          return
        }
        let resultData = {
          name: this.name,
          designCode: this.designCode,
          keyword: this.keyWord,
          introduction: this.introduction,
          richText: this.isSetUE ? this.$refs.ueditor.getUEContent() : null,
          videoUrl: this.video[0] ? this.video[0].video_original : '',
          skuInfos: [
            {
              newPrice: this.price,
              oldPrice: '',
              pictures: [],
              skuId: this.productInfo.skuInfos.skus[0].skuId,
              stock: this.inventory
            }
          ],
          specValueArray: [],
          spuId: this.productInfo.spuInfos.spuId
        }
        for (let j of this.imgparams) {
          resultData.skuInfos[0].pictures.push(j.url)
        }
        if (resultData.skuInfos[0].pictures.length < 1) {
          this.$Message.warning('至少配置一张图片!')
          return
        }
        if (this.price.length > 12) {
          this.$Message.warning('价格输出长度过大！')
          return
        } else if (!(/^(-?\d*)(\.\d+)?$/).test(this.price)) {
          this.$Message.warning('价格输出错误,请输出数字!')
          return
        }
        for (let i in this.publicParams) {
          let obj = {
            specId: this.publicParams[i].id,
            memo: this.publicParams[i].memo,
            specName: this.publicParams[i].specName,
            type: this.publicParams[i].type,
            specValues: []
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
            obj.specValues.push(obja)
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
              obj.specValues.push(obja)
            }
          }
          resultData.specValueArray.push(obj)
        }
        let objb = {}
        let flag = 0
        for (let i of this.productInfo.spuInfos.spuSpec.select) {
          if (i.spuSpecValues[0].spuSpecValueId === this.adverMesGet.spuSpecValueId) {
            flag++
            objb = {
              specId: i.spuSpecId,
              memo: '',
              specName: i.spuSpecName,
              type: '',
              specValues: [{
                specValue: this.adverMesGet.spuSpecValue,
                specValueId: this.adverMesGet.spuSpecValueId
              }]
            }
          } else if (i.spuSpecValues[0].spuSpecValueId === this.locationGet.spuSpecValueId) {
            flag++
            objb = {
              specId: i.spuSpecId,
              memo: '',
              specName: i.spuSpecName,
              type: '',
              specValues: [{
                specValue: this.locationGet.spuSpecValue,
                specValueId: this.locationGet.spuSpecValueId
              }]
            }
          }
          resultData.specValueArray.push(objb)
          if (flag > 1) {
            break
          }
        }
        // ======================= 表单验证 :基本信息
        let publicParamsArr = []
        for (let i of this.publicParams) {
          if (i.value) {
            publicParamsArr.push(1)
          }
        }
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
        if (this.commonAdding) {
          // 保存按钮
          console.log(resultData)
          this.setSpuproduct(resultData)
        }
      },
      // API 保存单品信息
      setSpuproduct (param) {
        this.$http.post(...pdApi.onSellPro(param))
        .then(response => {
          if (response.data.code === 200) {
            this.$Message.success({content: '保存成功!'})
            this.$parent.$parent.subConfirm = false
          } else {
          }
        })
      }
    },
    computed: {
      adverMes: {
        get: function () {
          // 获取商品广告词广告词
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
      // =====================================  表单验证
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
            obj[`common${i}`] = [{required: true, message: '必填项不可为空', trigger: 'submit'}]
          } else {
            obj[`common${i}`] = []
          }
        }
        return obj
      }
    },
    watch: {
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
      }
    },
    mounted: function () {
      // 图集上传组件
      for (let i of this.productInfo.skuInfos.skus[0].pictures) {
        this.imgparams.push({
          status: 'finished',
          url: i
        })
      }
      if (this.productInfo.spuInfos.videoUrl) {
        let objUrl = {
          video_original: this.productInfo.spuInfos.videoUrl,
          status: 'finished'
        }
        this.video.push(objUrl)
      }
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
      this.publicParams = arrAttrC
      // 保存初始数值
      this.initPublic = arrAttrD
      // 监听保存事件
      this.$nextTick(function () {
        this.$on('saveToback', function () {
          this.saveToback()
        })
      })
    }
  }
</script>
