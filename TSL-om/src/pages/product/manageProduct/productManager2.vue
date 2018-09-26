<style lang="scss" rel="stylesheet/scss" scoped>
#productManager2 {
  min-width:1110px;
}
.my-breadcrumb {
  margin: 0px 10px;
}
.pmSearch{
  margin: 20px;
}
.searchBtn {
  -webkit-text-align: right;
  -moz-text-align: right;
  -ms-text-align: right;
  -o-text-align: right;
  text-align: right;
  margin-right: 20px;
}
.onSearch {
  vertical-align: top;
  display: inline-block;
  &.w430 {
    width: 430px;
  }
}
.controlAll{
  margin: 0 50px 10px;
}
.newProduct {
  float: right;
}
.pmTable {
  width: 95%;
  margin:0 auto;
}
.footer {
  width: 95%;
  margin: 20px auto;
  text-align: center;
}
</style>
<template>
  <div id="productManager2">
    <div class="pmTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>商品后台管理</BreadcrumbItem>
        <BreadcrumbItem>待售商品管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="pmSearch">
      <Form :label-width="100">
        <div class="onSearch">
          <FormItem label="商品名称 :">
            <Input v-model="querryName" placeholder="请输入" size="small" style="width: 140px"></Input>
          </FormItem>
          <!-- <FormItem label="商品状态 :">
            <Select v-model="pstate" size="small" style="width:120px">
              <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem> -->
        </div>
        <div class="onSearch w430">
          <FormItem label="上架时间 :">
            <Row>
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 150px" v-model="startTime"></DatePicker>
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 150px" v-model="endTime"></DatePicker>
            </Row>
          </FormItem>
        </div>
        <div class="onSearch">
          <FormItem label="商品类目 :">
            <Select v-model="firSele" size="small" style="width:100px" @on-change="list1Change">
              <Option v-for="item1 in seleList1" :value="item1.name" :key="item1.name">{{ item1.name }}</Option>
            </Select>
            <Select v-model="secSele" size="small" style="width:100px" @on-change="list2Change">
              <Option v-for="item2 in seleList2" :value="item2.name" :key="item2.name">{{ item2.name }}</Option>
            </Select>
            <Select v-model="thirSele" size="small" style="width:100px" @on-change="list3Change" not-found-text="该类目下">
              <Option v-for="item3 in seleList3" :value="item3.name" :key="item3.name">{{ item3.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="searchBtn">
          <FormItem>
            <Button @click="querryData">查询</Button>
            <Button @click="resetQuerry">重置</Button>
          </FormItem>
        </div>
      </Form>
    </div>
    <div class="controlAll">
      <Button @click="handleAll" :disabled="sumitDis">批量上架</Button>
      <Button class="newProduct" @click="toAddProduct">添加新商品</Button>
    </div>
    <div class="pmTable">
      <Table :columns="columns1" :data="resData" @on-selection-change="selectParam"></Table>
    </div>
    <div class="footer">
      <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="clickPage" show-total></Page>
    </div>
    <div class="pmConfirm">
      <Modal title="上架" v-model="ProConfirm" width="400">
        <p>确认将商品上架？</p>
        <div slot="footer">
          <Button @click="confirmPost">确认</Button>
          <Button @click="closePro">取消</Button>
        </div>
      </Modal>
    </div>
    <div>
      <!-- 此处上架编辑框弹出的是修改单品还是修改sku组合商品   alo单品   cba组合 -->
      <!-- <aloProAlt :subContent="subContent" v-model="subConfirm"></aloProAlt> -->
      <cbaProAlt :subContent="subContent" v-model="subConfirm"></cbaProAlt>
    </div>
  </div>
</template>
<script>
import * as pdAPI from '../../../services/productManager.es6'
import * as opAPI from '../../../services/operationCate.es6'
import aloProAlt from '../../../components/aloProAlt.vue'
import cbaProAlt from '../../../components/cbaProAlt.vue'
export default {
  name: 'categoryAssociation',
  components: {
    aloProAlt,
    cbaProAlt
  },
  data () {
    return {
      // 当前页码，默认为第一页
      pageNum: 1,
      // 每页显示条数，当前默认为5条
      pageSize: 5,
      // 商品总条数
      total: null,
      // 传输参数，
      forSellParams: {},
      // 商品名称查询
      querryName: null,
      // 商品类目
      firSele: null,
      secSele: null,
      thirSele: null,
      categoryId: null,
      seleList1: [],
      seleList2: [],
      seleList3: [],
      // 时间参数
      startTime: null,
      endTime: null,
      // 表格title
      columns1: [
        {
          type: 'selection',
          width: 80,
          align: 'center'
        }, {
          title: '所属类目',
          key: 'categoryName',
          width: 140
        }, {
          title: '商品信息',
          key: 'productName',
          render: (h, params) => {
            return h('div', [
              h('img', {
                domProps: {
                  src: params.row.productPicture,
                  alt: 'anmoqi'
                },
                style: {
                  width: '40px',
                  verticalAlign: 'middle',
                  display: 'inline-block'
                }
              }),
              h('div', {
                props: 'text',
                size: 'small',
                style: {
                  width: '160px',
                  verticalAlign: 'middle',
                  display: 'inline-block'
                }
              }, params.row.productName)
            ])
          }
        }, {
          title: '总库存',
          key: 'stock',
          width: 120
        }, {
          title: '总销量',
          key: 'sales',
          width: 120
        },
        // {
        //   title: '商品状态',
        //   key: 'productState',
        //   width: 150,
        //   render: (h, params) => {
        //     if (params.row.productState === '系统下架') {
        //       return h('div', [
        //         h('span', {}, params.row.productState),
        //         h('Tooltip', {
        //           props: {
        //             placement: 'right-end'
        //           }
        //         }, [
        //           h('Icon', {
        //             props: {
        //               type: 'help-circled'
        //             },
        //             style: {
        //               marginLeft: '2px'
        //             }
        //           }),
        //           h('div', {
        //             slot: 'content'
        //           }, [
        //             h('p', {}, '系统原因：'),
        //             h('p', {}, '商品关键词有违禁词，'),
        //             h('p', {}, '请处理后再提交上架')
        //           ])
        //         ])
        //       ])
        //     } else if (params.row.productState === '系统自动下架') {
        //       return h('div', [
        //         h('span', {}, params.row.productState),
        //         h('Tooltip', {
        //           props: {
        //             placement: 'right-end'
        //           },
        //           style: {
        //             marginLeft: '2px'
        //           }
        //         }, [
        //           h('Icon', {
        //             props: {
        //               type: 'help-circled'
        //             }
        //           }),
        //           h('div', {
        //             slot: 'content'
        //           }, [
        //             h('p', {}, '系统自动下架原因：'),
        //             h('p', {}, '商品库存为0超过14天。')
        //           ])
        //         ])
        //       ])
        //     } else {
        //       return h('div', {}, params.row.productState)
        //     }
        //   }
        // },
        // {
        //   title: '下架时间',
        //   key: 'putawayDate',
        //   width: 184,
        //   sortable: true
        // },
        {
          title: '操作',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    // 显示当前行的商品的id，传给子组件，弹窗修改
                    this.handleSub(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handlePro(params.row.spuId)
                  }
                }
              }, '上架')
            ])
          }
        }
      ],
      // 返回商品值
      resData: [],
      // 修改的弹窗   商品数值，弹窗状态
      subConfirm: false,
      subContent: {test: 'test'},
      // 上架许可
      sumitDis: true,
      // 上架id参数集合
      batchId: [],
      // pstate: 'onsale',
      // stateList: [
      //   {
      //     value: 'onsale',
      //     label: '待售'
      //   },
      //   {
      //     value: 'manualoffsale',
      //     label: '手动下架'
      //   },
      //   {
      //     value: 'systemoffsale',
      //     label: '系统下架'
      //   },
      //   {
      //     value: 'systemautooffsale',
      //     label: '系统自动下架'
      //   }
      // ],
      ProConfirm: false
    }
  },
  methods: {
    // 时间转换格式
    formatDateTime () {
      var date = this.startTime
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      var second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    // 请求查询
    querryData () {
      let startTime = ''
      let endTime = ''
      if (this.startTime) {
        startTime = this.formatDateTime(this.startTime)
      }
      if (this.endTime) {
        endTime = this.formatDateTime(this.endTime)
      }
      this.forSellParams = {
        'categoryId': this.categoryId || null,
        'name': this.querryName || null,
        'startTime': startTime || null,
        'endTime': endTime || null
      }
      this.pageNum = 1
      this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
    },
    // 重置按钮
    resetQuerry () {
      this.querryName = null
      this.startTime = null
      this.endTime = null
      // 类目重置
      this.seleList1 = null
      this.selector2 = null
      this.seleList3 = null
      this.firSele = null
      this.secSele = null
      this.thirSele = null
      this.categoryId = null
      this.forSellParams = {}
      // 重置完成并请求刷新一次
      this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
    },
    // 选择一级目录之后，二级类目change
    list1Change (param) {
      for (let i in this.seleList1) {
        if (this.seleList1[i].name === param) {
          this.seleList2 = this.seleList1[i].secondCategory
          this.secSele = this.seleList2[0].name
          this.categoryId = this.seleList2[0].id
          break
        }
      }
    },
    // 二级类目
    list2Change (param) {
      this.thirSele = null
      if (this.seleList2) {
        for (let i in this.seleList2) {
          if (this.seleList2[i].name === param) {
            this.categoryId = this.seleList2[i].id
            this.seleList3 = this.seleList2[i].threeCategory
            break
          }
        }
      }
    },
    // 三级类目
    list3Change (param) {
      for (let i in this.seleList3) {
        if (this.seleList3[i].name === param) {
          this.categoryId = this.seleList3[i].id
          break
        }
      }
    },
    // 修改商品信息
    handleSub (params) {
      this.subContent.categoryId = params.row.categoryId
      this.subConfirm = true
    },
    // 批量上架弹出窗
    handleAll () {
      this.ProConfirm = true
    },
    // 单独上架弹出窗
    handlePro (param) {
      this.batchId = []
      this.batchId.push(param)
      this.ProConfirm = true
    },
    // 确认上架
    confirmPost () {
      this.postBatch(this.batchId)
      this.$Message.success({content: '上架成功'})
      this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
      this.batchId = []
      this.ProConfirm = false
    },
    // 取消上架操作
    closePro () {
      this.ProConfirm = false
    },
    // 全选与反选
    selectParam (param) {
      if (param.length === 0) {
        this.sumitDis = true
      } else {
        this.sumitDis = false
      }
      this.batchId = []
      for (let i in param) {
        this.batchId.push(param[i].spuId)
      }
    },
    // 发布新商品
    toAddProduct () {
      this.$parent.$parent.$parent.openTab({title: '发布新商品', currentView: 'addProduct'})
    },
    // ------------------------event-----api-----------------------------------------------
    getForSell (pageNum, pageSize, params) {
      this.$http.post(...pdAPI.forSell(pageNum, pageSize, params))
        .then((response) => {
          if (response.data.code === 200) {
            let res = JSON.parse(response.request.response).pageInfo
            // 渲染页码旁的数据条数
            this.total = parseInt(res.total)
            this.resData = res.list
          }
        })
    },
    postBatch (params) {
      this.$http.post(...pdAPI.batchPost(params))
      .then(() => {
        this.batchId = []
      })
    },
    // 跳转页码触发事件
    clickPage (pageNum) {
      this.pageNum = pageNum
      this.getForSell(pageNum, this.pageSize, this.forSellParams)
    },
    // 获取类目分类
    getCate () {
      this.$http.get(opAPI.getCate())
      .then((response) => {
        if (response.data.code === 200) {
          let res = JSON.parse(response.request.response).operateCategory
          this.seleList1 = res
        }
      })
    }
  },
  created: function () {
    this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
    this.getCate()
  }
}
</script>