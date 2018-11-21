<template>
  <div id="discountPromotion">
    <Breadcrumb class="my-breadcrumb">
      <BreadcrumbItem>营销管理</BreadcrumbItem>
      <BreadcrumbItem to="/home/createPromotion">创建促销</BreadcrumbItem>
      <BreadcrumbItem>单品折扣</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formData" :rules="formRules" :label-width="110" class="my-form" ref="myForm">
      <FormItem label="促销名称：" prop="name">
        <Input class="my-name" v-model.trim="formData.name" :maxlength="10" placeholder="限10个字"></Input>
      </FormItem>
      <FormItem label="促销类型：" prop="type">单品折扣</FormItem>
      <FormItem label="折后价：" prop="typeAlone">
        <Select v-model="formData.typeAlone" class="my-select">
          <Option :value="1">保留整数</Option>
          <Option :value="2">保留小数点后1位</Option>
        </Select>
      </FormItem>
      <FormItem label="折扣：" prop="discount">
        <Tooltip placement="right">
          <div slot="content"><p>请输入1~9.9之间的数</p><p>小数点后保留1位</p></div>
          <Input v-model.trim="formData.discount" class="my-discount" :maxlength="4"></Input>
        </Tooltip>
      </FormItem>
      <FormItem label="选择商品：" prop="proArray">
        <div class="clearfloat">
          <Button class="my-btn-selectPro" type="primary" @click="modalFlag = true">选择参加促销的商品</Button>
        </div>
        <Table :data="selected" :width="980" :height="520" :columns="column1"></Table>
      </FormItem>
      <FormItem label="同用户限购：" prop="limitNum">
        <Input class="my-limitNum" :maxlength="4" v-model.trim="formData.limitNum"><span slot="append">件</span></Input>
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
    name: 'discountPromotion',
    components: { selectProduct, Loading },
    data () {
      return {
        // ----------表单数据
        formData: {
          name: '',
          type: 3,
          typeAlone: 1, // 1:元级取整 2:角级取整
          discount: '',
          proArray: [], // {productId}
          limitNum: '',
          startDate: '',
          endDate: '',
          memo: ''
        },
        formRules: {
          name: [{required: true, message: ' ', trigger: 'blur'}],
          type: [{required: true, type: 'number', message: ' ', trigger: 'change'}],
          typeAlone: [{required: true, type: 'number', message: ' ', trigger: 'change'}],
          discount: [{
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(' '))
              } else if (!tool.validDiscountNum(value)) {
                callback(new Error('请输入1~9.9之间的数（小数点后保留1位）'))
              } else {
                callback()
              }
            },
            trigger: 'blur'}],
          proArray: [{
            required: true,
            validator: (rule, value, callback) => {
              if (!value.length || value.length === 0) {
                callback(new Error('未选择商品'))
              } else {
                callback()
              }
            }}],
          limitNum: [{
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(' '))
              } else if (!tool.non0PositiveInt(value)) {
                callback(new Error('请输入大于0的整数'))
              } else {
                callback()
              }
            }
          }],
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
        // ----------表格
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
            width: 80,
            title: '库存',
            key: 'stock'
          },
          {
            width: 80,
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
            title: '折后价（元）',
            render: (h, params) => {
              let price2 = ''
              if (tool.validDiscountNum(this.formData.discount)) {
                price2 = params.row.price * this.formData.discount * 0.1 / 100
                if (this.formData.typeAlone === 1) {
                  price2 = price2.toString().replace(/[.][0-9]*/, '')
                } else if (this.formData.typeAlone === 2) {
                  price2 = price2.toString().replace(/[.][0-9]*/, price2.toString().match(/[.][0-9]{1}/))
                }
              }
              return price2
            }
          },
          {
            width: 80,
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
        successModel: false,
        loading: false
      }
    },
    methods: {
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
            let params = this.formData
            params.discount = params.discount * 10
            if (this.$route.params.id) {
              this.updatePromotion(params)
            } else {
              this.insertPromotion(params)
            }
          }
        })
      },
      insertPromotion (params) {
        this.$http.post(...myAPI.insertPromotionAlone(params)).then(res => {
          if (res.data.code === 200) {
            this.successModel = true
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      updatePromotion (params) {
        this.loading = true
        this.$http.post(...myAPI.updatePromotionAlone(params)).then(res => {
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
          this.$router.replace({path: '/home/discountPromotion'})
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
              this.formData = formData
              this.formData.discount = formData.discount / 10
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
      this.getPromotion ()
    },
    computed: {
      selectedArray () {
        return JSON.stringify(this.selected)
      }
      // Fdiscount: {
      //   get () {
      //     return this.formData.discount / 10
      //   },
      //   set (newValue) {
      //     this.formData.discount = newValue * 10
      //   }
      // }
    },
    watch: {
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
.my-name, .my-textarea {
  width: 400px;
}
.my-select, .my-discount, .my-limitNum {
  width: 200px;
}
.clearfloat {
  overflow: hidden;
}
.my-btn-selectPro {
  float: left;
  margin: 0px 20px 10px 0px;
}
.batch-discount-label {
  float: left;
  margin: 0px 10px 0px 0px;
}
.batch-discount-input {
  float: left;
  width: 100px;
}
</style>
