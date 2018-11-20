<style lang="scss" rel="stylesheet/scss" scoped>
  .margin-10 {
   margin: 10px;
  }
  .margin-left-10 {
    margin: 0px 0px 0px 10px;
  }
  .cate-input {
    margin: 0px 0px 10px 180px;
    width: 450px;
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
  .my-select {
    width: 150px;
  }
</style>
<template>
  <div id="addPPart1">
    <b class="margin-10">您当前选择的类目</b><br/>
    <Input class="cate-input" @on-focus="goSelect" v-model="currCate"></Input><span class="tips-text">点击重选类目</span><br/>

    <b class="margin-10">商品基本信息</b>
    <Form :label-width="180" :model="baseInfo" :rules="baseInfoRules" ref="baseInfoForm">
      <FormItem label="商品名称：" prop="name">
        <Input class="my-input" v-model.trim="baseInfo.name" @on-blur="judgeName" :maxlength="50"></Input><span class="tips-text">还能输入{{`${50 - baseInfo.name.length}`}}个字</span>
      </FormItem>
      <FormItem label="设计编码：" prop="designCode">
        <Input class="my-input" v-model.trim="baseInfo.designCode" :maxlength="50"></Input>
      </FormItem>
      <FormItem label="商品广告词：" prop="advert">
        <Input class="my-input" v-model.trim="baseInfo.advert" @on-blur="judgeAdvert" :maxlength="50"></Input><span class="tips-text">还能输入{{`${50 - baseInfo.advert.length}`}}个字</span>
      </FormItem>
      <FormItem label="商品关键词：" prop="keyword">
        <Input class="my-input" v-model.trim="baseInfo.keyword"></Input><span class="tips-text">最多输入5个关键词，关键词之间用空格隔开，总字数限制在50个字以内</span>
      </FormItem>
       <FormItem label="产地：">
        <Input class="my-input" v-model.trim="baseInfo.placeOfOrigin" @on-blur="judgePlace" :maxlength="10"></Input><span class="tips-text">10个字以内</span>
      </FormItem>
      <FormItem label="商品简介："><Input type="textarea" v-model="baseInfo.desc" :maxlength="200" class="my-input"></Input><span class="tips-text">200个字以内</span></FormItem>
    </Form>

    <b class="margin-10">通用参数</b><span class="tips-text">(至少填写一条通用参数)</span>
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
        <Input v-if="item.type === 4" :maxlength="30" placeholder="限30字" class="my-input" v-model.trim="item.value[0]"></Input>
        <Input v-if="item.type === 5" type="textarea" :maxlength="200" placeholder="限200字" class="my-input" v-model.trim="item.value[0]"></Input>
        <DatePicker v-if="item.type === 6" format="yyyy年MM月dd日" placeholder="选择时间" placement="top" v-model="item.value[0]"></DatePicker>
      </FormItem>
    </Form>
    <div class="my-btn-bar">
      <Button class="margin-left-10" @click="next" :loading="commonAdding">下一步</Button>
    </div>
  </div>
</template>
<script type="text/ecmascript">
  import * as cateAPI from '../../../services/operationCate.es6'
  let interval
  export default {
    name: 'addPPart1',
    data () {
      return {
        // 基本信息
        commonAdding: false,
        baseInfo: {
          name: '',
          designCode: '',
          advert: '',
          placeOfOrigin: '',
          keyword: '',
          desc: ''
        },
        baseInfoRules: {
          name: [{required: true, message: '此项不可为空'}],
          designCode: [{required: true, message: '此项不可为空'}],
          placeOfOrigin: [{required: true, message: '此项不可为空'}],
          keyword: [
            {required: true, validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('此项不可为空'))
              } else if (value.split(' ').length > 5) {
                callback(new Error('最多输入5个关键词'))
              } else if (value.split(' ').join('').length > 50) {
                callback(new Error('总字数限制在50个字以内'))
              } else {
                callback()
              }
            }}
          ]
        },
        // 通用参数
        publicParams: [
//          {name: '保健功能', type: 'radio', values: ['补充蛋白质', '补充矿物质', '补血', '肠胃保健'], value: ''},
//          {name: '适宜人群', type: 'checkbox', values: ['男性', '女性', '儿童', '孕妇'], value: []},
//          {name: '主要成分', type: 'input', values: [], value: ''},
//          {name: '报警功能', type: 'radio', values: ['有', '无'], value: ''},
//          {name: '自动断电', type: 'radio', values: ['有', '无'], value: ''}
        ]
      }
    },
    props: {
      currCate: String,
      currCateId: String
    },
    mounted: function () {
      interval = setInterval(() => {
        if (this.currCateId) {
          this.getPublicParams()
          clearInterval(interval)
        }
      }, 30)
    },
    methods: {
      isEmpty (val) {
        if (!/^['']*$/.test(val) && !/^[' ']+$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      goSelect () {
        this.$emit('selectCate')
      },
      getCommonAttr (callback) {
        this.$http.get(cateAPI.getCommonAttr(this.currCateId)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
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
      getCommonSpec () {
        // 传商品基本属性、通用属性
        let params = {}
        params.categoryId = this.currCateId
        params.name = this.baseInfo.name
        params.designCode = this.baseInfo.designCode
        params.merchantId = '123'
        params.keyword = this.baseInfo.keyword
        params.introduction = this.baseInfo.desc
        params.specArray = []
        params.specArray.push({specName: '商品广告词', specValueArray: [{specValueName: this.baseInfo.advert}], commonId: null, type: 1})
        params.specArray.push({specName: '产地', specValueArray: [{specValueName: this.baseInfo.placeOfOrigin}], commonId: null, type: 1})
        params.specArray = params.specArray.concat(this.publicParamsArr)
        return params
      },
      next () {
        this.commonAdding = true
        this.$refs.baseInfoForm.validate((valid) => {
          if (valid) {
            if (this.publicParamsArr.length === 0) {
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
                this.$Message.warning('请正确填充通用参数必填项')
              }
            })
          } else {
            this.commonAdding = false
            this.$Message.warning('请正确填充基本信息必填项')
          }
        })
      },
      judgeName () {
        let str = this.baseInfo.name
        str = str.replace(/^\s+/, '')
        str = str.replace(/\s+$/, '')
        this.baseInfo.name = str
      },
      judgeAdvert () {
        let str = this.baseInfo.advert
        str = str.replace(/^\s+/, '')
        str = str.replace(/\s+$/, '')
        this.baseInfo.advert = str
      },
      judgePlace () {
        let str = this.baseInfo.placeOfOrigin
        str = str.replace(/^\s+/, '')
        str = str.replace(/\s+$/, '')
        this.baseInfo.placeOfOrigin = str
      }
    },
    computed: {
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
            if (publicParams[i].type === 2) {
              obj[`common${i}`] = [{required: true, type: 'array', message: ' ', trigger: 'submit'}]
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
      }
    }
  }
</script>
