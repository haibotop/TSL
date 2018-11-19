<template>
  <div id="selectProduct">
    <Modal v-model="flag" title="选择商品" width="1100px" :styles="modalStyles">
      <Form :model="formData" :rules="formRules" inline ref="myForm">
        <form-item :label-width="90" label="商品名称：" prop="spuName">
          <Input v-model.trim="formData.spuName"></Input>
        </form-item>
        <form-item :label-width="60" label="价格：" prop="price">
          <Input style="width:100px;" v-model.trim="formData.startPrice"></Input> ~ <Input style="width:100px;" v-model.trim="formData.endPrice"></Input>
        </form-item>
        <form-item :label-width="90" label="商品类目：">
          <Select v-model="formData.firstCategoryId" style="width:130px" @on-change="getCateData2">
            <Option v-for="item in cateData" :value="item.id" :key="item.id" v-if="item.status === 1">{{ item.name }}</Option>
          </Select>
          <Select v-model="formData.secondCategoryId" style="width:130px" @on-change="getCateData3">
            <Option v-for="item in cateData2" :value="item.id" :key="item.id" v-if="item.status === 1">{{ item.name }}</Option>
          </Select>
          <Select v-model="formData.thirdCategoryId" style="width:130px">
            <Option v-for="item in cateData3" :value="item.id" :key="item.id" v-if="item.status === 1">{{ item.name }}</Option>
          </Select>
        </form-item>
        <form-item :label-width="90" label="商品编码：">
          <Input v-model.trim="formData.barCode"></Input>
        </form-item>
        <form-item :label-width="60" label="库存：" prop="stock">
          <Input style="width:100px;" v-model.trim="formData.startStock" :maxlength="4"></Input> ~ <Input style="width:100px;" v-model.trim="formData.endStock"  :maxlength="4"></Input>
        </form-item>
        <form-item :label-width="90" label="上架时间：" prop="time">
          <DatePicker type="date" placeholder="Select date" style="width: 200px" v-model="startDate" @on-change="handleDate1"></DatePicker>
          <DatePicker type="date" placeholder="Select date" style="width: 200px" v-model="endDate"  @on-change="handleDate2"></DatePicker>
        </form-item>
        <form-item :label-width="90" label="SKU编码：">
          <Input v-model.trim="formData.skuCode"></Input>
        </form-item>
        <form-item :label-width="60" label="销量：" prop="sales">
          <Input style="width:100px;" v-model.trim="formData.startSales" :maxlength="10"></Input> ~ <Input style="width:100px;" v-model="formData.endSales" :maxlength="10"></Input>
        </form-item>
        <form-item>
          <Button class="my-btn-search" type="primary" @click="validate">查询</Button>
          <Button class="my-btn-search" type="primary" @click="reset">重置</Button>
        </form-item>
      </Form>
      <Table :data="data1" :columns="column1" :height="300" @on-selection-change="onSelectionChange"></Table>
      <div slot="footer">
        <Page :total="total" :page-size="pageSize" :current="pageNum" @on-change="pageChange" :styles="{float: 'left'}"></Page>
        <Button type="primary" @click="saveSelectedProduct">确定</Button>
        <Button @click="cancelSelectedProduct">取消</Button>
      </div>
      <Loading :isload="loading" class="pop-loading"></Loading>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-es6">
  import Loading from '../../components/loading.vue'
  import * as cateAPI from '../../services/operationCate.es6'
  import * as pAPI from '../../services/productManager.es6'
  import * as tool from '../../services/tool.es6'
  export default {
    name: 'selectProduct',
    components: {Loading},
    props: {
      value: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        loading: false,
        modalStyles: {
          top: '20px'
        },
        // ----------筛选条件
        formData: {
          spuName: '',
          startPrice: '',
          endPrice: '',
          firstCategoryId: '',
          secondCategoryId: '',
          thirdCategoryId: '',
          barCode: '',
          startStock: '',
          endStock: '',
          startPutawayDate: '',
          endPutawayDate: '',
          skuCode: '',
          startSales: '',
          endSales: ''
        },
        formRules: {
          price: [
            {
              validator: (rule, value, callback) => {
                let error = []
                let reg = /^\d{0,8}(\.\d{0,2})?$/
                if (reg.test(this.formData.startPrice) === false || reg.test(this.formData.endPrice) === false) {
                  error.push(new Error('输入8位整数、2位小数以内'))
                }
                if (this.formData.startPrice !== '' && this.formData.endPrice !== '' && error.length === 0) {
                  if (parseInt(this.formData.startPrice) > parseInt(this.formData.endPrice)) {
                    error.push(new Error('请正确输入价格的范围'))
                  }
                }
                callback(error)
              },
              trigger: 'blur'
            }
          ],
          stock: [
            {
              validator: (rule, value, callback) => {
                let error = []
                if (this.formData.startStock !== '') {
                  if (!tool.positiveInt((this.formData.startStock))) {
                    error.push(new Error('请输入4位以内正整数'))
                  }
                }
                if (this.formData.endStock !== '' && error.length === 0) {
                  if (!tool.positiveInt((this.formData.endStock))) {
                    error.push(new Error('请输入4位以内正整数'))
                  }
                }
                if (this.formData.startStock !== '' && this.formData.endStock !== '' && error.length === 0) {
                  if (parseInt(this.formData.startStock) > parseInt(this.formData.endStock)) {
                    error.push(new Error('请正确输入总库存的范围'))
                  }
                }
                callback(error)
              },
              trigger: 'blur'
            }
          ],
          sales: [
            {
              validator: (rule, value, callback) => {
                let error = []
                if (this.formData.startSales !== '') {
                  if (!tool.positiveInt((this.formData.startSales))) {
                    error.push(new Error('请输入10位以内正整数'))
                  }
                }
                if (this.formData.endSales !== '' && error.length === 0) {
                  if (!tool.positiveInt((this.formData.endSales))) {
                    error.push(new Error('请输入10位以内正整数'))
                  }
                }
                if (this.formData.startSales !== '' && this.formData.endSales !== '' && error.length === 0) {
                  if (parseInt(this.formData.startSales) > parseInt(this.formData.endSales)) {
                    error.push(new Error('请正确输入总销量的范围'))
                  }
                }
                callback(error)
              },
              trigger: 'blur'
            }
          ],
          time: [
            {
              validator: (rule, value, callback) => {
                let error = []
                if (this.formData.startPutawayDate !== '' && this.formData.endPutawayDate !== '') {
                  if (this.startDate.getTime() > this.endDate.getTime()) {
                    error.push(new Error('结束日期不能早于开始日期'))
                  }
                }
                callback(error)
              },
              trigger: 'blur'
            }
          ]
        },
        searchParams: '',
        // ----------时间
        startDate: '',
        endDate: '',
        // ----------类目
        cateData: [], // 所有
        cateData2: [], // 已选的一级类目类目的二级类目
        cateData3: [], // 三级类目
        // ---------表格
        data1: [],
        column1: [
          {
            width: 60,
            type: 'selection'
          },
          {
            width: 175,
            title: '商品编码',
            key: 'barCode'
          },
          {
            width: 200,
            title: '所属类目',
            render: (h, params) => {
              return this.handleCateName(params.row.thirdCategoryId)
            }
          },
          {
            width: 200,
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
                  width: '115px',
                  'margin-left': '5px'
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
                  arr.push(h('p', {}, `${(i.specName || '').replace('WeightOfGold&IsOnly1', '重量(g)')}：${i.specValueName || ''}`))
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
            width: 140,
            title: '最新上架时间',
            key: 'putawayDate'
          },
          {
            width: 100,
            title: '价格（元）',
            render: (h, params) => {
              return tool.handlePrice(params.row.price)
            }
          }
        ],
        selectedProduct: [],
        sort: 'normal',
        // ---------分页
        pageNum: 1,
        pageSize: 20,
        total: 0
      }
    },
    methods: {
      handleDate1 () {
        setTimeout(() => {
          if (typeof this.startDate === 'object') {
            this.formData.startPutawayDate = tool.formatDateTime(this.startDate)
          } else {
            this.formData.startPutawayDate = ''
          }
        }, 100)
      },
      handleDate2 () {
        setTimeout(() => {
          if (typeof this.endDate === 'object') {
            this.formData.endPutawayDate = tool.formatDateTime(this.endDate)
          } else {
            this.formData.endPutawayDate = ''
          }
        }, 100)
      },
      getCate () {
        this.$http.get(cateAPI.getCate()).then(response => {
          if (response.data.code === 200) {
            this.cateData = response.data.operateCategory
          }
        })
      },
      getCateData2 () {
        this.cateData.forEach(e => {
          if (e.id === this.formData.firstCategoryId) {
            console.log(e)
            this.cateData2 = e.secondCategory || []
            for (let i of e.secondCategory) {
              if (i.status === 1) {
                this.formData.secondCategoryId = i.id
                break
              }
            }
          }
        })
      },
      getCateData3 () {
        this.cateData2.forEach(e => {
          if (e.id === this.formData.secondCategoryId) {
            this.cateData3 = e.threeCategory || []
            for (let i of e.threeCategory) {
              if (i.status === 1) {
                this.formData.thirdCategoryId = i.id
                break
              }
            }
          }
        })
      },
      reset () {
        this.$refs.myForm.resetFields()
        this.formData.spuName = ''
        this.formData.startPrice = ''
        this.formData.endPrice = ''
        this.formData.firstCategoryId = ''
        this.formData.secondCategoryId = ''
        this.formData.thirdCategoryId = ''
        this.cateData3 = []
        this.cateData2 = []
        this.formData.barCode = ''
        this.formData.startStock = ''
        this.formData.endStock = ''
        let date = new Date()
        this.startDate = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000)
        this.endDate = date
        this.formData.startPutawayDate = tool.formatDateTime(this.startDate)
        this.formData.endPutawayDate = tool.formatDateTime(this.endDate)
        this.formData.skuCode = ''
        this.formData.startSales = ''
        this.formData.endSales = ''
        this.searchParams = ''
        let params = JSON.parse(JSON.stringify(this.formData))        
        for (let i in params) {
          if (!params[i]) {
            delete params[i]
          }
        }
        this.searchParams = params
        this.getProducts()
      },
      validate () {
        this.$refs.myForm.validate(valid => {
          if (valid) {
            if (this.formatDate.firstCategoryId && !this.formData.thirdCategoryId) {
              this.$Message.error({content: '无3级类目表示无商品列表, 请重新选择其他类目!'})
              return
            }
            let params = JSON.parse(JSON.stringify(this.formData))
            tool.non0PositiveInt(params.startPrice) ? params.startPrice = params.startPrice * 100 : params.startPrice = ''
            tool.non0PositiveInt(params.endPrice) ? params.endPrice = params.endPrice * 100 : params.endPrice = ''
            for (let i in params) {
              if (!params[i]) {
                delete params[i]
              }
            }
            this.searchParams = params
            this.getProducts()
          }
        })
      },
      getProducts (callback) {
        this.loading = true
        let params = {}
        if (this.searchParams) {
          params = this.searchParams
        }
        this.$http.post(...pAPI.promotionGoods(params, this.pageNum, this.pageSize)).then(res => {
          if (res.data.code === 200) {
            this.data1 = res.data.goodsPageInfo.list
            this.total = res.data.goodsPageInfo.total
          }
          if (typeof callback === 'function') {
            callback(res)
          }
          this.resetTableItemChecked()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      onSelectionChange (selection) {
        console.log('----------onSelectionChange----------')
        console.log(selection)
        let canceled = []
        for (let i of this.data1) {
          if (JSON.stringify(selection).indexOf(i.skuId) === -1) {
            canceled.push(i)
          }
        }
        console.log(canceled)
        // 判重加入已选商品
        let obj = {}
        for (let i of this.selectedProduct) {
          if (!obj[i.skuId]) {
            obj[i.skuId] = 1
          }
        }
        for (let i of selection) {
          if (!obj[i.skuId]) {
            this.selectedProduct.push(i)
            obj[i.skuId] = 1
          }
        }
        // 判重删除已选商品
        let obj2 = {}
        for (let i of canceled) {
          if (!obj2[i.skuId]) {
            obj2[i.skuId] = 1
          }
        }
        let selectedProduct = []
        for (let i of this.selectedProduct) {
          if (!obj2[i.skuId]) {
            selectedProduct.push(i)
          }
        }
        this.selectedProduct = selectedProduct
      },
      formatDate (date) {
        return date.getFullYear()
      },
      handleCateName (cateId) {
        let str = ''
        for (let i of this.cateData) {
          for (let j of i.secondCategory) {
            for (let k of j.threeCategory) {
              if (k.id === cateId) {
                str = i.name + ' > ' + j.name + ' > ' + k.name
              }
            }
          }
        }
        return str
      },
      pageChange (index) {
        this.pageNum = index
        this.getProducts()
      },
      resetTableItemChecked () {
        if (this.data1) {
          let obj = {}
          for (let i of this.selectedProduct) {
            if (!obj[i.skuId]) {
              obj[i.skuId] = 1
            }
          }
          for (let i in this.data1) {
            if (obj[this.data1[i].skuId]) {
              this.data1[i]._checked = true
            } else {
              this.data1[i]._checked = false
            }
          }
          this.data1 = JSON.parse(JSON.stringify(this.data1))
        }
      },
      saveSelectedProduct () {
        if (this.selectedProduct.length > 0) {
          this.$emit('on-select', this.selectedProduct)
          this.$emit('input', false)
        } else {
          this.$Message.warning('未选择商品')
        }
      },
      cancelSelectedProduct () {
        this.selectedProduct = JSON.parse(JSON.stringify(this.selected))
        this.$emit('input', false)
      }
    },
    mounted: function () {
      
      if (this.selected) {
        this.selectedProduct = JSON.parse(JSON.stringify(this.selected))
      }
      this.getCate()
      // this.validate()
    },
    computed: {
      flag: {
        get () {
          return this.value
        },
        set (flag) {
          this.$emit('input', flag)
        }
      }
    },
    watch: {
      value (newflag, oldflag) {
        console.log(newflag)
        if (newflag !== oldflag && newflag) {
          if (this.selected) {
            this.selectedProduct = JSON.parse(JSON.stringify(this.selected))
            // this.resetTableItemChecked()
          }
          if (newflag) {
            this.reset()
          }
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .my-btn-search {
    width: 100px;
    margin: 0px 10px 0px 0px;
  }
</style>
