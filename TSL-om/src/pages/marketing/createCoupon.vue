<style lang="scss" rel="stylesheet/scss" scoped>
  #createCoupon {
    min-width:880px;
  }
  .margin-10 {
    margin: 10px;
  }
  .width-45 {
    width: 45%;
  }
  .width-50 {
    width: 50%;
  }
  .width-55 {
    width: 55%;
  }
  .width-100 {
    width: 100%;
  }
  .marginPage {
    // margin:10px;
    float: left;
  }
  .order-input {
    width: calc(100% - 200px);
  }
  .my-date {
    width: 145px;
  }
  .submitButton{
    display: block!important;
    text-align: center!important;
  }
  .btn-w {
    width: 100px;
  }
  .ivu-form-item .ivu-form-item {
    margin-right: 0;
  }
  .cp-date2 {
    width: 152px;
  }
  .tips-text {
    color: #80848f;
    text-indent: 10px;
  }
</style>
<style rel="stylesheet/css">
  .cp-mytable .ivu-table-body {
    max-height: 700px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
<template>
  <div id="createCoupon">
    <Breadcrumb  class="margin-10">
      <BreadcrumbItem>营销管理</BreadcrumbItem>
      <BreadcrumbItem>创建优惠券</BreadcrumbItem>
    </Breadcrumb>

    <Tabs type="card" :animated="false" @on-click="tabStatusChanged" v-model="tabStatus">
      <TabPane label="单品"></TabPane>
      <TabPane label="类目"></TabPane>
    </Tabs>

    <Form inline class="margin-10" :label-width="170" :model="local" :rules="local_rule" ref="localForm">
      <FormItem label="优惠券名称：" style="width: 100%;" prop="name">
        <Input style="width:238px" v-model="local.name" :maxlength="20"></Input>
        <span class="tips-text">还能输入{{`${20 - local.name.length}`}}个字</span>
      </FormItem>
      <FormItem :label="labeltxt1" class="ivu-form-item-required" style="width: 100%;">
        <Button class="ivu-btn ivu-btn-primary" @click="promotionProduct">{{buttonContent}}</Button>
      </FormItem>
      <FormItem :label="labeltxt2"  style="width: 100%;">
        <div class="tableBox">
          <Table border :columns="column1" :data="data1" v-show="tabStatus===0" class="cp-mytable" :width="937"></Table>
          <Table border :columns="column4" :data="data4" v-show="tabStatus===1" class="cp-mytable" :width="687"></Table>
        </div>
      </FormItem>
      <FormItem label="开始时间：" style="width: 100%;" prop="startDate">
        <DatePicker :value="local.startDate" :options="optionDate" @on-change="(val)=>{setTheDate(val,'startDate','local')}" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间" placement="top-start" style="width: 238px"></DatePicker>
      </FormItem>
      <FormItem label="结束时间：" style="width: 100%;" prop="endDate">
        <DatePicker :value="local.endDate" :options="optionDate" @on-change="(val)=>{setTheDate(val,'endDate','local')}" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间" placement="top-start" style="width: 238px"></DatePicker>
      </FormItem>
      <FormItem label="生成张数：" style="width: 100%;" prop="total">
        <Input  style="width:238px" v-model="local.total"></Input>
      </FormItem>
      <FormItem label="领取张数：" style="width: 100%;"prop="limitGet">
        <Input  style="width:238px" v-model="local.limitGet"></Input>
      </FormItem>
      <FormItem label="选择规则：" class="ivu-form-item-required" style="width: 100%;" prop="rules">
        <Select v-model="local.rules" style="width:238px">
          <Option v-for="item in rulesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="local.rules===1" label="满：" style="width: 100%;" prop="fullSubtract">
        <Input v-model="local.fullSubtract" style="width:238px"></Input> 元
      </FormItem>
      <FormItem v-if="local.rules!==null" label="减：" style="width: 100%;" prop="subtract">
        <Input v-model="local.subtract" style="width:238px"></Input> 元
      </FormItem>
      <FormItem label="可叠加使用：" style="width: 100%;">
        <Checkbox v-model="local.isOverlay"></Checkbox>
      </FormItem>
      <FormItem label="优惠券描述：" style="width: 100%;" prop="memo">
        <Input type="textarea" v-model.trim="local.memo" :maxlength="100" style="width:500px;" :autosize="{minRows:4}"></Input>
        <span class="tips-text">还能输入{{`${100 - local.memo.length}`}}个字</span>
      </FormItem>
      <FormItem class="width-100 submitButton">
        <Button class="ivu-btn ivu-btn-primary" :loading="loading" style="margin-left:-170px;width:120px;" @click="saveCoupon">
          <span v-if="!loading">保存</span>
          <span v-else>保存中...</span>
        </Button>
      </FormItem>
    </Form>

    <!--这是商品的弹窗-->
    <Modal v-model="modal1" title="优惠的商品" width="1100" :styles="{top:'20px',marginBottom:'10px'}">
      <Form inline style="margin-right:0;" :model="search_c" :rules="searchRules" ref="productForm">
        <FormItem label="商品名称：" :label-width="90" prop="spuName">
          <Input v-model.trim="search_c.spuName"></Input>
        </FormItem>
        <FormItem label="价格(元)：" :label-width="80" prop="price">
          <Input v-model.trim="search_c.startPrice" style="width:90px;"></Input> ~ <Input v-model.trim="search_c.endPrice" style="width:90px;"></Input>
        </FormItem>
        <FormItem label="商品类目：" :label-width="90">
          <FormItem prop="firstCategoryId">
            <Select v-model="search_c.firstCategoryId" @on-change="changeSele1" style="width:130px">
              <Option v-for="item in seleList1" :value="item.id" :key="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="secondCategoryId">
            <Select v-model="search_c.secondCategoryId" @on-change="changeSele2" style="width:130px">
              <Option v-for="item in seleList2" :value="item.id" :key="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="thirdCategoryId">
            <Select v-model="search_c.thirdCategoryId" @on-change="changeSele3" style="width:130px">
              <Option v-for="item in seleList3" :value="item.id" :key="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
        </FormItem>
        <FormItem label="商品编码：" :label-width="90" prop="barCode">
          <Input v-model.trim="search_c.barCode"></Input>
        </FormItem>
        <FormItem label="总库存：" :label-width="80" prop="stock">
          <Input v-model.trim="search_c.startStock" style="width:90px;"></Input> ~ <Input v-model.trim="search_c.endStock" style="width:90px;"></Input>
        </FormItem>
        <FormItem label="上架时间：" :label-width="90" prop="time">
          <DatePicker :value="search_c.startPutawayDate" @on-clear="setTheDate('','startPutawayDate','search_c')" @on-change="(val)=>{setTheDate(val,'startPutawayDate','search_c')}" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" style="width:196px;"></DatePicker>
          <DatePicker :value="search_c.endPutawayDate" @on-clear="setTheDate('','endPutawayDate','search_c')" @on-change="(val)=>{setTheDate(val,'endPutawayDate','search_c')}" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" style="width:196px;"></DatePicker>
        </FormItem>
        <FormItem label="SKU编码：" :label-width="90" prop="skuCode">
          <Input v-model.trim="search_c.skuCode"></Input>
        </FormItem>
        <FormItem label="总销量：" :label-width="80" prop="sales">
          <Input v-model.trim="search_c.startSales" style="width:90px;"></Input> ~ <Input v-model.trim="search_c.endSales" style="width:90px;"></Input>
        </FormItem>
        <FormItem>
          <Button @click="page2.pageNum=1;productSearch()" type="primary" class="btn-w">查询</Button>
          <Button @click="resetSearch" class="btn-w" type="primary" style="margin-left:10px;">重置</Button>
        </FormItem>
      </Form>

      <div class="tableBox">
        <Button :disabled="selectedProduct.length===0" @click="delAllHandler" style="margin-bottom:5px;">取消所有选择</Button>
        <Table :height="300" ref="cp_table2" :columns="column2" :data="data2" @on-selection-change="selectChange" @on-select="selectHandler" @on-select-cancel="cancelHandler" @on-select-all="selectAllHandler"></Table>
      </div>
      <div slot="footer">
        <Page :total="page2.total" :current="page2.pageNum" :page-size="page2.pageSize" @on-change="page2Change" show-total class="marginPage" v-if="data2.length>0"></Page>
        <Button type="primary" @click="onOutput">确定</Button>
        <Button @click="onCloseDl(1)" style="clear:both;">取消</Button>
      </div>
      <Loading :isload="mloading" class="pop-loading"></Loading>
    </Modal>

    <!--这是类目的弹窗-->
    <Modal v-model="modal2" title="促销的类目" width="900">
      <Tree :data="data3" show-checkbox @on-check-change="onCateSelect"></Tree>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="onOutput2">确定</Button>
        <Button @click="onCloseDl(2)">取消</Button>
      </div>
    </Modal>

    <Modal v-model="modal3" width="400">
      <p style="color:#19be6b;font-size:18px;">提交成功！</p>
      <p>是否继续创建优惠券？</p>
      <div slot="footer" style="text-align:center;">
        <Button type="success" @click="initcp">是，继续创建</Button>
        <Button type="success" @click="gotolist">否，去优惠券列表</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import Loading from '../../components/loading.vue'
  import * as opAPI from '../../services/operationCate.es6'
  import * as pmAPI from '../../services/productManager.es6'
  import * as mkAPI from '../../services/marketing.es6'
  import Util from '../../libs/util'
  import * as tool from '../../services/tool.es6'
  export default {
    name: 'createCoupon',
    components: {Loading},
    data () {
      return {
        labeltxt1: '选择商品：',
        labeltxt2: '已选择商品：',
        loading: false,
        mloading: false,
        tabStatus: 0,
        buttonContent: '选择参与优惠的商品',
        modal1: false,
        modal2: false,
        modal3: false,
        selectedProduct: [],//选中的所有商品
        // 初始化
        local: {
          name: '',
          total: '',
          limitGet: '',
          rules: null,
          fullSubtract: '',
          subtract: '',
          startDate: '',
          endDate: '',
          isOverlay: false,
          memo: ''
        },
        local_rule: {
          name: [{required: true, message: '必填项不可为空', trigger: 'blur'}],
          startDate: [{required: true, message: '必填项不可为空', trigger: 'change'}],
          endDate: [{required: true, message: '必填项不可为空', trigger: 'change'}],
          total: [{required: true, message: '必填项不可为空', trigger: 'blur'}, {message: '请输入大于0的10位以内整数', trigger: 'blur', pattern: /^(?!0+$)\d{0,10}$/}],
          limitGet: [{required: true, message: '必填项不可为空', trigger: 'blur'}, {message: '请输入大于0的4位以内整数', trigger: 'blur', pattern: /^(?!0+$)\d{0,4}$/}],
          rules: [{required: true, type: 'number', message: '必填项不可为空', trigger: 'change'}],
          fullSubtract: [{required: true, message: '必填项不可为空', trigger: 'blur'}, {message: '请输入8位整数、2位小数以内的数字', trigger: 'blur', pattern: /^\d{1,8}(\.\d{0,2})?$/}],
          subtract: [{required: true, message: '必填项不可为空', trigger: 'blur'}, {message: '请输入8位整数、2位小数以内的数字', trigger: 'blur', pattern: /^\d{1,8}(\.\d{0,2})?$/}]
        },
        rulesList: [
          {
            value: 1,
            label: '满减'
          },
          {
            value: 2,
            label: '直降'
          }
        ],
        seleListorg: [],
        seleList1: [],
        seleList2: [],
        seleList3: [],
        search_c: {
          firstCategoryId: '',
          secondCategoryId: '',
          thirdCategoryId: '',
          barCode: '',
          spuName: '',
          skuCode: '',
          startPrice: '',
          endPrice: '',
          startStock: '',
          endStock: '',
          startSales: '',
          endSales: '',
          startPutawayDate: '',
          endPutawayDate: ''
        },
        searchRules: {
          price: [{
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^\d{0,8}(\.\d{0,2})?$/
              if (reg.test(this.search_c.startPrice) === false || reg.test(this.search_c.endPrice) === false) {
                callback(new Error('输入8位整数、2位小数以内'))
              } else if (this.search_c.startPrice !== '' && this.search_c.endPrice !== '' && Number(this.search_c.endPrice) < Number(this.search_c.startPrice)) {
                callback(new Error('请正确输入价格的范围'))
              } else {
                callback()
              }
            }
          }],
          stock: [{
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^\d{0,4}$/
              if (reg.test(this.search_c.startStock) === false || reg.test(this.search_c.endStock) === false) {
                callback(new Error('请输入4位以内正整数'))
              } else if (this.search_c.startStock !== '' && this.search_c.endStock !== '' && Number(this.search_c.endStock) < Number(this.search_c.startStock)) {
                callback(new Error('请正确输入总库存的范围'))
              } else {
                callback()
              }
            }
          }],
          sales: [{
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^\d{0,10}$/
              if (reg.test(this.search_c.startSales) === false || reg.test(this.search_c.endSales) === false) {
                callback(new Error('请输入10位以内正整数'))
              } else if (this.search_c.startSales !== '' && this.search_c.endSales !== '' && Number(this.search_c.endSales) < Number(this.search_c.startSales)) {
                callback(new Error('请正确输入总销量的范围'))
              } else {
                callback()
              }
            }
          }],
          time: [{
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (new Date(this.search_c.startPutawayDate) > new Date(this.search_c.endPutawayDate)) {
                callback(new Error('结束日期不能早于开始日期'))
              } else {
                callback()
              }
            }
          }],
          thirdCategoryId: [
            {
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (this.search_c.firstCategoryId !== '' && this.search_c.secondCategoryId !== '' && this.search_c.thirdCategoryId === '') {
                  callback(new Error('请选择三级类目'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        column1: [
          {
            title: '货品图片',
            width: 100,
            align: 'center',
            render: (h, params) => {
              let defaultPic
              if (params.row.picture) {
                defaultPic = params.row.picture + '!56'
              } else {
                defaultPic = 'http://pic1.cxtuku.com/00/05/14/b466ee36ffbe.jpg'
              }
              return h('img', {
                domProps: {
                  src: defaultPic,
                  alt: 'anmoqi'
                },
                style: {
                  width: '40px',
                  marginRight: '5px',
                  verticalAlign: 'middle',
                  display: 'inline-block'
                }
              })
            }
          },
          {
            title: '货品规格',
            width: 200,
            align: 'center',
            render: (h, params) => {
              let divarr = []
              if (params.row.specArray) {
                for (let item of params.row.specArray) {
                  if (item.specName !== null) {
                    divarr.push(
                        h('div', item.specName.replace('WeightOfGold&IsOnly1', '重量(g)') + ': ' + item.specValueName)
                    )
                  }
                }
              }
              return h('div', divarr)
            }
          },
          {
            title: '货品编号',
            width: 200,
            key: 'skuId',
            align: 'center'
          },
          {
            title: '货品名称',
            width: 300,
            align: 'center',
            render: (h, params) => {
              return h('span', tool.handleName(params.row.skuName))
            }
          },
          {
            title: '操作',
            width: 135,
            render: (h, params) => {
              let a
              let om = [
                a,
                h('a', {
                  style: {'display': 'block', 'text-align': 'center', 'line-height': '2'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      this.delProduct(params.row.skuId)
                    }
                  }
                }, '移除')
              ]
              return h('div', {}, om)
            },
            align: 'center'
          }
        ],
        data1: [],
        column2: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '商品编码',
            width: 175,
            key: 'barCode'
          },
          {
            title: '所属类目',
            width: 220,
            render: (h, params) => {
              return h('span', this.getCateFullName(params.row.thirdCategoryId))
            }
          },
          {
            title: '商品信息',
            width: 300,
            align: 'center',
            render: (h, params) => {
              let defaultPic
              if (params.row.picture) {
                defaultPic = params.row.picture + '!56'
              } else {
                defaultPic = 'http://pic1.cxtuku.com/00/05/14/b466ee36ffbe.jpg'
              }
              let dom = h('div', [
                h('img', {
                  domProps: {
                    src: defaultPic,
                    alt: 'anmoqi'
                  },
                  style: {
                    width: '40px',
                    marginRight: '5px',
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }
                }),
                h('div', {
                  props: 'text',
                  size: 'small',
                  style: {
                    width: '200px',
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }
                }, tool.handleName(params.row.skuName))
              ])
              return dom
            }
          },
          {
            title: '价格（元）',
            width: 200,
            align: 'center',
            render: (h, params) => {
              let num = (Number(params.row.price) / 100).toFixed(2)
              return h('span', {}, num)
            }
          },
          {
            title: '总库存',
            width: 100,
            key: 'stock',
            align: 'center'
          },
          {
            title: '总销量',
            width: 100,
            key: 'sales',
            align: 'center'
          },
          {
            title: '最新上架时间',
            width: 200,
            key: 'putawayDate',
            align: 'center'
          }
        ],
        page2: {
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        data2: [],
        outputData: [],
        data3: [],
        column4: [
          {
            title: '类目编码',
            width: 250,
            key: 'id'
          },
          {
            title: '类目名称',
            width: 300,
            render: (h, params) => {
              return h('span', {}, this.getCateFullName(params.row.id))
            }
          },
          {
            title: '操作',
            width: 135,
            render: (h, params) => {
              let a
              let om = [
                a,
                h('a', {
                  style: {'display': 'block', 'text-align': 'center', 'line-height': '2'},
                  domProps: {
                    href: 'javascript:'
                  },
                  on: {
                    click: () => {
                      this.delCate(params.row.id)
                    }
                  }
                }, '移除')
              ]
              return h('div', {}, om)
            },
            align: 'center'
          }
        ],
        data4: [],
        optionDate: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        }
      }
    },
    methods: {
      // 选择类型
      tabStatusChanged (name) {
        this.$refs.localForm.resetFields()
        this.data1 = []
        this.data4 = []
        this.tabStatus = name
        if (this.tabStatus === 0) {
          this.labeltxt1 = '选择商品：'
          this.labeltxt2 = '已选择商品：'
          this.buttonContent = '选择参与优惠的商品'
        } else if (this.tabStatus === 1) {
          this.labeltxt1 = '选择类目：'
          this.labeltxt2 = '已选择类目：'
          this.buttonContent = '选择参与优惠的类目'
          this.getData3List()
        }
      },
      checkDate () {
        if (new Date(this.local.startDate) > new Date(this.local.endDate)) {
          this.$Message.warning('结束日期不能早于开始日期')
          return false
        }
        if (Number(this.local.total) < Number(this.local.limitGet)) {
          this.$Message.warning('领取张数不能大于生成张数')
          return false
        }
        return true
      },
      // 提交优惠券信息
      saveCoupon () {
        if (!(this.checkDate())) {
          return
        }
        if (this.tabStatus === 0 && this.data1.length < 1) {
          this.$Message.warning('请选择商品')
          return
        } else if (this.tabStatus === 1 && this.data4.length < 1) {
          this.$Message.warning('请选择类目')
          return
        }
        this.$refs.localForm.validate((valid) => {
          if (valid) {
            let params = {
              'type': this.tabStatus === 0 ? 1 : 2,
              'name': this.local.name,
              'startDate': this.local.startDate + ':00',
              'endDate': this.local.endDate + ':00',
              'total': Number(this.local.total),
              'limitGet': Number(this.local.limitGet),
              'rules': this.local.rules,
              // 'fullSubtract': Number(this.local.fullSubtract),
              'subtract': Number(this.local.subtract) * 100,
              'isOverlay': this.local.isOverlay ? 2 : 1,
              'memo': this.local.memo
            }
            if (params.rules === 1) {
              params.fullSubtract = Number(this.local.fullSubtract) * 100
            }
            let temparr = []
            if (params.type === 1) {
              for (let i = 0; i < this.data1.length; i++) {
                temparr.push({'productId': this.data1[i].skuId})
              }
              params.productIds = temparr
            } else {
              for (let i = 0; i < this.data4.length; i++) {
                temparr.push({'categoryId': this.data4[i].id})
              }
              params.categoryIds = temparr
            }
            // console.log(params)
            const self = this
            this.loading = true
            this.$http.post(...mkAPI.createCoupon(params)).then((response) => {
              self.loading = false
              if (response.data.code === 200) {
                this.modal3 = true
              }
            }).catch((res) => {
              self.loading = false
            })
          } else {
            console.log('Fail!')
          }
        })
      },
      setTheDate (val, tp, t) {
        this[t][tp] = val
      },
      // 打开商品或类目选择窗口
      promotionProduct () {
        if (this.tabStatus === 0) {
          this.resetSearch()
          this.outputData = []
          this.mloading = false
          this.modal1 = true
          const self = this
          setTimeout(() => {
            self.page2.pageNum = 1
            self.productSearch()
            console.log(111)
          }, 500)
        } else if (this.tabStatus === 1) {
          // this.getData3List()
          // this.data4 = []
          this.modal2 = true
        }
      },
      // 校验搜索商品表单
      checkRange (start, end, txt) {
        const isNum = /^\d{0,8}(\.\d{0,2})?$/
        // const isNum = /^(-?\d*)(\.\d+)?$/
        const isD = /^\d{0,10}$/
        if (txt === '价格') {
          if (isNum.test(start) === false || isNum.test(end) === false) {
            this.$Message.warning(`${txt}必需是8位整数、2位小数以内的数字`)
            return true
          }
        } else {
          if (isD.test(start) === false || isD.test(end) === false) {
            this.$Message.warning(`${txt}必需是10位以内的整数`)
            return true
          }
        }
        if (start !== '' && end !== '' && Number(end) < Number(start)) {
          this.$Message.warning(`请正确输入${txt}的范围`)
          return true
        }
        return false
      },
      checkSearch () {
        if (this.checkRange(this.search_c.startPrice, this.search_c.endPrice, '价格')) {
          return false
        }
        if (this.checkRange(this.search_c.startStock, this.search_c.endStock, '总库存')) {
          return false
        }
        if (this.checkRange(this.search_c.startSales, this.search_c.endSales, '总销量')) {
          return false
        }
        if (new Date(this.search_c.startPutawayDate) > new Date(this.search_c.endPutawayDate)) {
          this.$Message.warning('结束日期不能早于开始日期')
          return false
        }
        return true
      },
      // 选择商品窗口的搜索商品
      productSearch () {
        // if (!(this.checkSearch())) {
        //   return
        // }
        this.$refs.productForm.validate((valid) => {
          if (valid) {
            const params = {
              firstCategoryId: this.search_c.firstCategoryId,
              secondCategoryId: this.search_c.secondCategoryId,
              thirdCategoryId: this.search_c.thirdCategoryId,
              barCode: this.search_c.barCode,
              spuName: this.search_c.spuName,
              skuCode: this.search_c.skuCode,
              startPrice: this.search_c.startPrice === '' ? null : Number(this.search_c.startPrice) * 100,
              endPrice: this.search_c.endPrice === '' ? null : Number(this.search_c.endPrice) * 100,
              startStock: this.search_c.startStock === '' ? null : Number(this.search_c.startStock),
              endStock: this.search_c.endStock === '' ? null : Number(this.search_c.endStock),
              startSales: this.search_c.startSales === '' ? null : Number(this.search_c.startSales),
              endSales: this.search_c.endSales === '' ? null : Number(this.search_c.endSales),
              startPutawayDate: this.search_c.startPutawayDate,
              endPutawayDate: this.search_c.endPutawayDate
            }
            for (let i in params) {
              if (!params[i]) {
                delete params[i]
              }
            }
            const self = this
            self.mloading = true
            this.$http.post(...pmAPI.promotionGoods(params, this.page2.pageNum, this.page2.pageSize)).then((response) => {
              self.mloading = false
              if (response.data.code === 200) {
                // modal状态呈现已选中项
                // for (let i in response.data.goodsPageInfo.list) {
                //   response.data.goodsPageInfo.list[i].listid = (Number(i) + 1) + (self.page2.pageNum - 1) * self.page2.pageSize
                //   for (let j in self.outputData) {
                //     if (response.data.goodsPageInfo.list[i].skuId === self.outputData[j].skuId) {
                //       response.data.goodsPageInfo.list[i]._checked = true
                //       break
                //     }
                //   }
                // }
                response.data.goodsPageInfo.list.forEach(item=>{
                  this.data1.forEach(item_=>{
                    if(item.skuId === item_.skuId){
                      item._checked = true
                    }
                  })
                })
                self.data2 = response.data.goodsPageInfo.list
                self.page2.total = response.data.goodsPageInfo.total
              }
            }).catch((res) => {
              self.mloading = false
            })
          } else {
            console.log('search form fail')
          }
        })
      },
      resetSearch () {
        this.$refs.productForm.resetFields()
        this.search_c.startPrice = ''
        this.search_c.endPrice = ''
        this.search_c.startStock = ''
        this.search_c.endStock = ''
        this.search_c.startSales = ''
        this.search_c.endSales = ''
        this.data2 = []
        this.initDate2()
        this.outputData = []
      },
      initDate2 () {
        const currentS = (new Date()).getTime()
        const beforeS = currentS - (1000 * 60 * 60 * 24 * 30)
        const startdate = Util.timeFormat(beforeS, 'yyyy-MM-dd HH:mm')
        const enddate = Util.timeFormat(currentS, 'yyyy-MM-dd HH:mm')
        this.search_c.startPutawayDate = startdate + ':00'
        this.search_c.endPutawayDate = enddate + ':00'
      },
      page2Change (page) {
        this.page2.pageNum = page
        this.productSearch()
      },
      getCateFullName (id3) {
        for (let i = 0; i < this.seleListorg.length; i++) {
          for (let j = 0; j < this.seleListorg[i].secondCategory.length; j++) {
            for (let k = 0; k < this.seleListorg[i].secondCategory[j].threeCategory.length; k++) {
              if (this.seleListorg[i].secondCategory[j].threeCategory[k].id === id3) {
                return this.seleListorg[i].name + ' > ' + this.seleListorg[i].secondCategory[j].name + ' > ' + this.seleListorg[i].secondCategory[j].threeCategory[k].name
              }
            }
          }
        }
      },
      delProduct (skuId) {
        for (let i = 0; i < this.data1.length; i++) {
          if (this.data1[i].skuId === skuId) {
            this.data1.splice(i, 1)
            break
          }
        }

        for (let i = 0; i < this.data1.length; i++) {
          if (this.data1[i].skuId === skuId) {
            this.data1.splice(i, 1)
            break
          }
        }
      },
      onOutput () {
      //   this.outputData.sort(this.outputDataSort)
      //   this.data1 = JSON.parse(JSON.stringify(this.outputData))
        // this.data1 = this.data1.concat(JSON.parse(JSON.stringify(this.outputData)))
        // let newArr = []
        // this.data1.forEach(item=>{
        //   let flag = false
        //   newArr.forEach(item_=>{
        //     if(item.skuId == item_.skuId){
        //       flag = true
              
        //     }
        //   })
        //   if(!flag){
        //     newArr.push(item)
        //   }
        // })
        // this.data1 = newArr.sort(this.outputDataSort)
        if (this.selectedProduct.length === 0) {
          this.$Message.warning('请选择商品')
        } else {
          this.data1 = JSON.parse(JSON.stringify(this.selectedProduct.sort(this.outputDataSort)))
          this.modal1 = false
        }
      },
      outputDataSort: function (a, b) {
        return a.listid - b.listid
      },
      // 处理 没选 或 取消当页所有选中
      selectChange: function (sel) {
        console.log(sel)
        // if (sel.length === 0) {
        //   for (let i in this.data2) {
        //     for (let j in this.outputData) {
        //       if (this.data2[i].skuId === this.outputData[j].skuId) {
        //         this.outputData.splice(j, 1)
        //         break
        //       }
        //     }
        //   }
        // }
        if (sel.length === 0) {
          for (let i in this.data2) {
            for (let j in this.selectedProduct) {
              if (this.data2[i].skuId === this.selectedProduct[j].skuId) {
                this.selectedProduct.splice(j, 1)
                break
              }
            }
          }
        }
      },
      // 选中单项
      selectHandler: function (sel, row) {
        this.selectedProduct.push(row)
        let canPush = true
        // for (let item of this.outputData) {
        //   if (row.skuId === item.skuId) {
        //     canPush = false
        //     break
        //   }
        // }
        // if (canPush) {
        //   this.outputData.push(row)
        // }
      },
      // 取消单项
      cancelHandler: function (sel, row) {
        // for (let i in this.outputData) {
        //   if (row.skuId === this.outputData[i].skuId) {
        //     this.outputData.splice(i, 1)
        //     break
        //   }
        // }
        for (let i in this.selectedProduct) {
          if (row.skuId === this.selectedProduct[i].skuId) {
            this.selectedProduct.splice(i, 1)
            break
          }
        }
      },
      // 选中当页所有项
      selectAllHandler: function (sel) {
        // for (let i in sel) {
        //   let canPush = true
        //   for (let j in this.outputData) {
        //     if (sel[i].skuId === this.outputData[j].skuId) {
        //       canPush = false
        //       break
        //     }
        //   }
        //   if (canPush) {
        //     this.outputData.push(sel[i])
        //   }
        // }

        for (let i in sel) {
          let flag = true
          for (let j in this.selectedProduct) {
            if (sel[i].skuId === this.selectedProduct[j].skuId) {
              flag = false
              break
            }
          }
          if (flag) {
            this.selectedProduct.push(sel[i])
          }
        }
      },
      // 取消所有选中
      delAllHandler: function () {
        this.selectedProduct = []
        this.$refs.cp_table2.selectAll(false)
      },
      // 一级类目选择
      changeSele1: function (val) {
        for (let i in this.seleList1) {
          if (this.seleList1[i].id === val) {
            this.seleList2 = this.seleList1[i].secondCategory
            this.search_c.secondCategoryId = this.seleList2[0].id
            break
          }
        }
      },
      // 二级类目选择
      changeSele2: function (val) {
        this.search_c.thirdCategoryId = ''
        if (Array.isArray(this.seleList2)) {
          for (let i in this.seleList2) {
            if (this.seleList2[i].id === val) {
              this.seleList3 = this.seleList2[i].threeCategory
              break
            }
          }
        }
      },
      // 三级类目选择
      changeSele3: function (val) {
        //
      },
      // 获取类目分类
      getCateList: function () {
        this.$http.get(opAPI.getCate())
            .then((response) => {
              if (response.data.code === 200) {
                let res = response.data.operateCategory
                this.seleListorg = JSON.parse(JSON.stringify(response.data.operateCategory))
                // 去除status！=1的类目
                let xx = []
                res.forEach(function (n, i) {
                  if (n.status === 1) {
                    let yy = []
                    n.secondCategory.forEach(function (o, j) {
                      if (o.status === 1) {
                        let zz = []
                        o.threeCategory.forEach(function (p, k) {
                          if (p.status === 1) {
                            zz.push(p)
                          }
                        })
                        o.threeCategory = zz
                        yy.push(o)
                      }
                    })
                    n.secondCategory = yy
                    xx.push(n)
                  }
                })
                this.seleList1 = xx
                this.getData3List()
              }
            })
      },
      getData3List () {
        const arr = JSON.parse(JSON.stringify(this.seleList1))
        let data3 = []
        for (let i in arr) {
          let obj1 = {
            id: arr[i].id,
            title: arr[i].name,
            level: 1,
            expand: false
          }
          if (arr[i].secondCategory.length > 0) {
            obj1.children = []
            for (let j in arr[i].secondCategory) {
              let obj2 = {
                id: arr[i].secondCategory[j].id,
                title: arr[i].secondCategory[j].name,
                level: 2,
                expand: false
              }
              if (arr[i].secondCategory[j].threeCategory.length > 0) {
                obj2.children = []
                for (let k in arr[i].secondCategory[j].threeCategory) {
                  let obj3 = {
                    id: arr[i].secondCategory[j].threeCategory[k].id,
                    title: arr[i].secondCategory[j].threeCategory[k].name,
                    level: 3
                  }
                  obj2.children.push(obj3)
                }
              }
              obj1.children.push(obj2)
            }
          }
          data3.push(obj1)
        }
        this.data3 = data3
      },
      onOutput2 () {
        if (this.data4.length === 0) {
          this.$Message.warning('请选择类目')
        } else {
          this.modal2 = false
        }
      },
      onCateSelect (arr) {
        let temparr = []
        for (let item of arr) {
          if (item.level === 3) {
            temparr.push(item)
          }
        }
        this.data4 = temparr
      },
      delCate (id) {
        for (let i = 0; i < this.data4.length; i++) {
          if (this.data4[i].id === id) {
            this.data4.splice(i, 1)
            break
          }
        }
        for (let i of this.data3) {
          if (i.children) {
            let icheckedchildren = i.children.length
            for (let j of i.children) {
              if (j.children) {
                let jcheckedchildren = 0
                for (let k of j.children) {
                  if (k.id === id) {
                    i.checked = false
                    j.checked = false
                    k.checked = false
                    // var self = this
                    // setTimeout(() => {
                    //   console.log(self.data3)
                    // }, 1000)
                  } else if (k.checked === true) {
                    jcheckedchildren++
                  }
                }
                if (jcheckedchildren === 0) {
                  j.expand = false
                  j.indeterminate = false
                }
                if (j.indeterminate === false && j.checked === false) {
                  icheckedchildren--
                }
              }
            }
            if (icheckedchildren === 0) {
              i.checked = false
              i.indeterminate = false
            }
          }
        }
      },
      onCloseDl (i) {
        this['modal' + i] = false
      },
      initcp () {
        this.modal3 = false
        this.$refs.localForm.resetFields()
        this.data1 = []
        this.data4 = []
        this.getData3List()
      },
      gotolist () {
        this.$router.push({path: '/home/couponList'})
      }
    },
    mounted () {
      this.initDate2()
      this.getCateList()
    }
  }
</script>
