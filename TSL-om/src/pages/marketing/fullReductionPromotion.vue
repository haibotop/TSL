<template>
  <div id="fullReductionPromotion">
    <Breadcrumb class="my-breadcrumb">
      <BreadcrumbItem>营销管理</BreadcrumbItem>
      <BreadcrumbItem to="/home/createPromotion">创建促销</BreadcrumbItem>
      <BreadcrumbItem>满减促销</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formData" :rules="formRules" class="my-form" ref="myForm" :label-width="100">
      <FormItem label="促销名字：" prop="name">
        <Input class="my-input-400" v-model.trim="formData.name" :maxlength="10" placeholder="限10个字"></Input>
      </FormItem>
      <FormItem label="促销类型：" prop="type">
        <RadioGroup v-model="formData.type" @on-change="typeChange">
          <Radio :label="1">满额减</Radio>
          <Radio :label="2">满额折</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="促销规则：" prop="pdsArray">
        <Form :model="pdsArray" :rules="formRules2" ref="myForm2">
          <FormItem label="" v-for="(item, index) in formData.pdsArray" :key="index" :prop="`pds${index}`">
            <Input class="my-input-200" :maxlength="7" v-model.trim="item.fullLimit"><span slot="prepend">满</span><span slot="append">元</span></Input>
            <Input v-show="formData.type === 1" class="my-input-200" :maxlength="7" v-model.trim="item.subtract"><span slot="prepend">减</span><span slot="append">元</span></Input>
            <Input v-show="formData.type === 2" class="my-input-200" :maxlength="4" v-model.trim="item.discount"><span slot="prepend">打</span><span slot="append">折</span></Input>
            <a href="javascript:void(0)" style="color:#ed3f14;">{{tips[index] ? tips[index] : ''}}</a>
            <a href="javascript:void(0)" @click="removePds(index)">- 删除本级促销</a>
          </FormItem>
        </Form>
        <a href="javascript:void(0)" @click="addPds">+ 添加多级促销</a>
      </FormItem>
      <FormItem label="选择商品：" prop="proArray">
        <Button type="primary" class="my-btn-selectPro" @click="modalFlag = true">选择参加促销的商品</Button>
        <Table :data="selected" :columns="column1" :width="980" :height="520"></Table>
      </FormItem>
      <FormItem label="促销时间：" prop="startDate">
        <DatePicker v-model="startDate" @on-change="handleDate1" type="datetime" style="width: 200px"></DatePicker>
        至
        <DatePicker v-model="endDate" @on-change="handleDate2" type="datetime" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="促销描述：" prop="memo">
        <Input v-model.trim="formData.memo" type="textarea" class="my-textarea" :autosize="{minRows: 3}" :maxlength="100"></Input>
      </FormItem>
      <FormItem label="">
        <Button @click="validate" type="primary">提交</Button>
        <Button @click="cancel" type="primary">取消</Button>
      </FormItem>
    </Form>
    <select-product v-model="modalFlag" :selected="selected" @on-select="saveSelectedProduct"></select-product>
    <Modal v-model="successModel" title="提示" :closable="false" :mask-closable="false">
      <Icon type="checkmark-circled" color="#19BE6B" size="30" style="float:left;margin-right:10px;"></Icon><span style="font-size:16px;line-height:30px;">提交成功</span>
      <div slot="footer">
        <Button v-show="!this.$route.params.id" @click="resetPage">继续创建促销</Button>
        <Button @click="goList">前往促销列表</Button>
      </div>
    </Modal>
    <Loading :isload="loading"></Loading>
  </div>
</template>
<script type="text/ecmascript-es6">
  import Loading from '../../components/loading.vue'
  import selectProduct from './selectProduct.vue'
  import * as tool from '../../services/tool.es6'
  import * as myAPI from '../../services/marketing.es6'
  export default {
    name: 'fullReductionPromotion',
    components: { selectProduct, Loading },
    data () {
      return {
        loading: false,
        // ----------表单数据
        formData: {
          name: '',
          type: 1,
          pdsArray: [
            {
              fullLimit: '',
              subtract: '', // 减错少
              discount: '' // 折多少
            }
          ],
          proArray: [],
          startDate: '',
          endDate: '',
          memo: ''
        },
        // ----------表单规则
        formRules: {
          name: [{required: true, message: ' ', trigger: 'blur'}],
          type: [{required: true, type: 'number', message: ' ', trigger: 'change'}],
          pdsArray: [{required: true, type: 'array', message: ' ', trigger: 'blur'}],
          proArray: [{
            required: true,
            validator: (rule, value, callback) => {
              if (!value.length || value.length === 0) {
                callback(new Error('未选择商品'))
              } else {
                callback()
              }
            }}],
          startDate: [{
            required: true,
            validator: (rule, value, callback) => {
              if (this.formData.startDate && this.formData.endDate && this.startDate && this.endDate) {
                if (this.startDate.getTime() < this.endDate.getTime()) {
                  callback()
                } else {
                  callback(new Error('结束时间不可早于开始时间'))
                }
              } else {
                  callback(new Error(' '))
              }
            },
            trigger: 'blur'}],
          memo: {required: true, message: ' ', trigger: 'blur'}
        },
        // ----------表单数据2（促销规则）
        pdsArray: {},
        tips: [''], // 错误提示
        tip2: '',
        column1: [
          {
            width: 300,
            title: '商品信息',
            render: (h, params) => {
              let doms = []
              doms[0] = h('img', {
                domProps: {
                  src: params.row.picture ? params.row.picture + '!56' : ''
                },
                style: {
                  display: 'block',
                  float: 'left',
                  width: '40px',
                  height: '40px'
                }
              })
              doms[1] = h('div', {
                style: {
                  float: 'left',
                  width: '215px',
                  'margin-left': '5px',
                  'line-height': '18px'
                }
              }, tool.handleName(params.row.skuName))
              return h('div', {}, doms)
            }
          },
          {
            width: 200,
            title: '商品规格',
            render: (h, params) => {
              let arr = []
              if (params.row.specArray) {
                for (let i of params.row.specArray) {
                  arr.push(h('p', {style: {'line-height': '20px'}}, `${(i.specName || '').replace('WeightOfGold&IsOnly1', '重量(g)')}：${i.specValueName || ''}`))
                }
              }
              return arr
            }
          },
          {
            width: 120,
            title: '库存',
            key: 'stock'
          },
          {
            width: 120,
            title: '销量',
            key: 'sales'
          },
          {
            width: 120,
            title: '价格（元）',
            render: (h, params) => {
              return tool.handlePrice(params.row.price)
            }
          },
          {
            width: 120,
            title: '操作',
            render: (h, params) => {
              return h('Button', {
                'on': {
                  'click': () => {
                    this.removeSelected(params.row)
                  }
                }
              }, '移除')
            }
          }
        ],
        startDate: '',
        endDate: '',
        // ----------
        modalFlag: false,
        selected: [],
        // ----------
        successModel: false
      }
    },
    methods: {
      typeChange () {
        this.tips = []
        for (let i in this.formData.data) {
          this.tips[i] = ''
        }
        this.$refs.myForm2.validate()
      },
      handleDate1 () {
        setTimeout(() => {
          if (typeof this.startDate === 'object') {
            this.formData.startDate = tool.formatDateTime(this.startDate)
          } else {
            this.formData.startDate = ''
          }
        }, 100)
      },
      handleDate2 () {
        setTimeout(() => {
          if (typeof this.endDate === 'object') {
            this.formData.endDate = tool.formatDateTime(this.endDate)
          } else {
            this.formData.endDate = ''
          }
        }, 100)
      },
      removePds (index) {
        if (this.formData.pdsArray.length > 1) {
          this.formData.pdsArray.splice(index, 1)
          this.tips.splice(index, 1)
        } else {
          this.$Message.warning('至少有一条促销规则')
        }
      },
      addPds () {
        if (this.formData.pdsArray.length < 4) {
          this.formData.pdsArray.push({
            fullLimit: '',
            subtract: '', // 减错少
            discount: '' // 折多少
          })
        } else {
          this.$Message.warning('最多添加4级促销')
        }
      },
      saveSelectedProduct (arr) {
        this.selected = arr
      },
      removeSelected (obj) {
        for (let i in this.selected) {
          if (this.selected[i].skuId === obj.skuId) {
            this.selected.splice(i, 1)
          }
        }
      },
      validate () {
        this.$refs.myForm.validate(valid => {
          if (valid) {
            this.$refs.myForm2.validate(valid => {
              if (valid) {
                let params = JSON.parse(JSON.stringify(this.formData))
                if (params.type === 1) {
                  for (let i in params.pdsArray) {
                    params.pdsArray[i].discount = 0
                    params.pdsArray[i].subtract = params.pdsArray[i].subtract * 100
                    params.pdsArray[i].fullLimit = params.pdsArray[i].fullLimit * 100
                  }
                } else if (params.type === 2) {
                  for (let i in params.pdsArray) {
                    params.pdsArray[i].subtract = 0
                    params.pdsArray[i].discount = params.pdsArray[i].discount * 10
                    params.pdsArray[i].fullLimit = params.pdsArray[i].fullLimit * 100
                  }
                }
                if (this.$route.params.id) {
                  this.updatePromotion(params)
                } else {
                  this.insertPromotion(params)
                }
              }
            })
          }
        })
      },
      insertPromotion (params) {
        this.$http.post(...myAPI.insertPromotion(params)).then(res => {
          if (res.data.code === 200) {
            this.successModel = true
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      updatePromotion (params) {
        this.loading = true
        this.$http.post(...myAPI.updatePromotion(params)).then(res => {
          if (res.data.code === 200) {
            this.successModel = true
          } else {
            this.$Message.error(res.data.message)
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      cancel () {
        this.$router.go(-1)
      },
      resetPage () {
        if (this.$route.params.id) {
          this.successModel = false
          this.$router.replace({path: '/home/fullReductionPromotion'})
        } else {
          window.location.reload()
        }
      },
      goList () {
        this.successModel = false
        this.$router.push({path: '/home/promotionList'})
      },
      getPromotion () {
        if (this.$route.params.id) {
          this.loading = true
          this.$http.get(...myAPI.getUpdatePromotions(this.$route.params.id)).then(res => {
            if (res.data.code === 200) {
              let formData = res.data.promotionInfo
              if (formData.pdsArray) {
                for (let i in formData.pdsArray) {
                  formData.pdsArray[i].fullLimit = formData.pdsArray[i].fullLimit / 100
                  if (formData.type === 1) {
                    formData.pdsArray[i].subtract = formData.pdsArray[i].subtract / 100
                  } else if (formData.type === 2) {
                    formData.pdsArray[i].discount = formData.pdsArray[i].discount / 10
                  }
                }
              }
              this.formData = formData
              this.startDate = new Date(res.data.promotionInfo.startDate)
              this.endDate = new Date(res.data.promotionInfo.endDate)
              this.getProArray(this.$route.params.id)
            }
          })
        }
      },
      getProArray (promotionId) {
        let params = {
          promotionId: promotionId
        }
        this.$http.post(...myAPI.getPromProducts(params, 1, 99)).then(res => {
          if (res.data.code === 200) {
            console.log(res.data.productSkuVOInfo.list)
            let list = []
            res.data.productSkuVOInfo.list.forEach(e => {
              list.push({
                skuId: e.id,
                skuName: e.name,
                picture: e.picture,
                stock: e.stock,
                sales: e.sales,
                price: e.price,
                specArray: e.specs
              })
            })
            this.selected = list
            this.loading = false
          }
        })
      }
    },
    mounted: function () {
      for (let i in this.formData.pdsArray) {
        this.pdsArray[`pds${i}`] = this.formData.pdsArray[i]
      }
      this.getPromotion()
    },
    computed: {
      formRules2 () {
        let rules = {}
        for (let i in this.formData.pdsArray) {
          rules[`pds${i}`] = {
            required: true,
            validator: (rule, value, callback) => {
              if (value.fullLimit === '' || !value.fullLimit) {
                this.tips[rule.field.replace('pds', '')] = '请填写完促销规则'
                this.tips = JSON.parse(JSON.stringify(this.tips))
                callback(new Error(' '))
              } else if (this.formData.type === 1) {
                if (value.subtract === '' || !value.subtract) {
                  this.tips[rule.field.replace('pds', '')] = '请填写完促销规则'
                  this.tips = JSON.parse(JSON.stringify(this.tips))
                  callback(new Error(' '))
                } else if (!tool.non0PositiveInt(value.fullLimit) || !tool.non0PositiveInt(value.subtract)) {
                  this.tips[rule.field.replace('pds', '')] = '请填写大于0正整数'
                  this.tips = JSON.parse(JSON.stringify(this.tips))
                  callback(new Error(' '))
                } else {
                  this.tips[rule.field.replace('pds', '')] = ''
                  this.tips = JSON.parse(JSON.stringify(this.tips))
                  callback()
                }
              } else if (this.formData.type === 2) {
                if (value.discount === '' || !value.discount) {
                  this.tips[rule.field.replace('pds', '')] = '请填写完促销规则'
                  this.tips = JSON.parse(JSON.stringify(this.tips))
                  callback(new Error(' '))
                } else if (!tool.non0PositiveInt(value.fullLimit) || !tool.validDiscountNum(value.discount)) {
                  let str = tool.non0PositiveInt(value.fullLimit) ? '' : '请填写大于0正整数'
                  str += tool.validDiscountNum(value.discount) ? '' : ' 请输入1~9.9之间的数（小数点后保留1位）'
                  this.tips[rule.field.replace('pds', '')] = str
                  this.tips = JSON.parse(JSON.stringify(this.tips))
                  callback(new Error(' '))
                } else {
                  this.tips[rule.field.replace('pds', '')] = ''
                  this.tips = JSON.parse(JSON.stringify(this.tips))
                  callback()
                }
              } else {
                this.tipsp[rule.field.replace('pds', '')] = ''
                this.tips = JSON.parse(JSON.stringify(this.tips))
                callback(new Error(' '))
              }
            },
            message: ' ',
            trigger: 'blur'
          }
        }
        return rules
      },
      formDataPdsArray () {
        return JSON.stringify(this.formData.pdsArray)
      },
      selectedArray () {
        return JSON.stringify(this.selected)
      }
    },
    watch: {
      formDataPdsArray (newV, oldV) {
        if (newV !== oldV) {
          for (let i in this.formData.pdsArray) {
            this.pdsArray[`pds${i}`] = this.formData.pdsArray[i]
          }
        }
      },
      selectedArray (newV, oldV) {
        if (newV !== oldV) {
          let proArray = []
          for (let i of this.selected) {
             proArray.push({
               productId: i.skuId
             })
          }
          this.formData.proArray = proArray
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.my-breadcrumb {
  margin: 0px 10px;
}
.my-form {
  margin: 10px;
}
.my-input-400 {
  width: 400px;
}
.my-input-200 {
  width: 200px;
  float: left;
  margin: 0px 10px 10px 0px;
}
.my-btn-selectPro {
  margin: 0px 0px 10px 0px;
}
.my-textarea {
  width: 400px;
}
</style>

