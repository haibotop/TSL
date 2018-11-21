<template>
  <div id="directDropPromotion">
    <Breadcrumb class="my-breadcrumb">
      <BreadcrumbItem>营销管理</BreadcrumbItem>
      <BreadcrumbItem to="/home/createPromotion">创建促销</BreadcrumbItem>
      <BreadcrumbItem>直降促销</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formData" :rules="formRules" :label-width="100" class="my-form" ref="myForm">
      <FormItem label="促销名称：" prop="name">
        <Input class="my-name" v-model.trim="formData.name" :maxlength="10" placeholder="限10个字"></Input>
      </FormItem>
      <FormItem label="促销类型：" prop="type">直降促销</FormItem>
      <FormItem label="直降金额：" prop="directAmount">
        <Input v-model.trim="formData.directAmount" class="directAmount" :maxlength="10"></Input>
      </FormItem>
      <FormItem label="选择商品：" prop="proArray">
        <Button class="my-btn-selectPro" type="primary" @click="modalFlag = true">选择参加促销的商品</Button>
        <Table :data="selected" :columns="column1" :width="980" :height="520"></Table>
      </FormItem>
      <FormItem label="促销时间："  prop="startDate">
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
    name: 'directDropPromotion',
    components: { selectProduct, Loading },
    data () {
      return {
        formData: {
          name: '',
          type: 4,
          directAmount: '',
          proArray: [], // {productId}
          startDate: '',
          endDate: '',
          memo: ''
        },
        formRules: {
          name: [{required: true, message: ' ', trigger: 'blur'}],
          type: [{required: true, type: 'number', message: ' ', trigger: 'change'}],
          directAmount: [{
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
        // ----------
        data1: [],
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
        // ----------
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
            params.directAmount = params.directAmount * 100
            if (this.$route.params.id) {
              this.updatePromotion(params)
            } else {
              this.insertPromotion(params)
            }
          }
        })
      },
      insertPromotion (params) {
        this.$http.post(...myAPI.insertPromotionDirect(params)).then(res => {
          if (res.data.code === 200) {
            this.successModel = true
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      updatePromotion (params) {
        this.loading = true
        console.log(params)
        this.$http.post(...myAPI.updatePromotionDirect(params)).then(res => {
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
          this.$router.replace({path: '/home/directDropPromotion'})
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
              formData.directAmount = formData.directAmount / 100
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
                picture: e.picture
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
.directAmount {
  width: 200px;
}
.my-btn-selectPro {
  margin: 0px 20px 10px 0px;
}
</style>

