<style lang="scss" rel="stylesheet/scss" scoped>
#productManager1 {
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
.onSearch {
  display: inline-block;
}
.footer {
  width: 95%;
  margin: 20px auto;
  text-align: center;
}
/* loading css*/
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
.demo-spin-col{
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
<template>
  <div id="productManager1">
    <div class="pmTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>商品后台管理</BreadcrumbItem>
        <BreadcrumbItem>在售商品管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="pmSearch">
      <Form :label-width="90" :model="localsearch">
        <div class="onSearch">
          <FormItem label="商品名称 :">
            <Input v-model="localsearch.name" placeholder="请输入" size="small" style="width: 140px"></Input>
          </FormItem>
        </div>
        <div class="onSearch">
          <FormItem label="上架时间 :">
            <Row>
              <DatePicker v-model="startTime" @on-clear="clearDate()" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 170px"></DatePicker>
              <DatePicker v-model="endTime" @on-clear="clearDate()" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 170px"></DatePicker>
            </Row>
          </FormItem>
        </div>
        <div class="onSearch">
          <FormItem label="商品类目 :">
            <Select v-model="model1" size="small" style="width:100px" placeholder="一级类目" @on-change="firstCheck">
              <Option v-for="item1 in list1" :value="item1.value" :key="item1.value">{{ item1.value }}</Option>
            </Select>
            <Select v-model="model2" size="small" style="width:100px" placeholder="二级类目" @on-change="secondCheck">
              <Option v-for="item2 in list2" :value="item2.value" :key="item2.value">{{ item2.value }}</Option>
            </Select>
            <Select v-model="model3" size="small" style="width:100px" placeholder="三级类目" @on-change="threeCheck">
              <Option v-for="item3 in list3" :value="item3.value" :key="item3.value">{{ item3.value }}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="searchBtn">
          <FormItem>
            <Button @click="handleSearch()">查询</Button>
            <Button @click="handleReset()">重置</Button>
          </FormItem>
        </div>
      </Form>
    </div>
    <div class="controlAll">
      <Button @click="handleMorePro">批量手动下架</Button>
        <Button class="newProduct" @click="toAddProduct">添加新商品</Button>
    </div>
    <div class="pmTable">
      <Table :columns="columns1" :data="onsellData" @on-selection-change="onsellCheck"></Table>
    </div>
    <div class="footer">
      <Page :current="pageParams.pageNum" :total="pageParams.pageTotal" :page-size="pageParams.pageSize" @on-change="pageChange" show-total></Page>
    </div>
    <div class="pmConfirm">
      <Modal title="手动下架" v-model="takePro" width="400">
        <p>确认下架，商品不能被购买</p>
        <div slot="footer">
          <Button @click="confirmPro()">确认</Button>
          <Button @click="cancelPro()">取消</Button>
        </div>
      </Modal>
      <Modal title="批量下架" v-model="MorePro" width="400">
        <p>确认批量下架，商品不能被购买</p>
        <div slot="footer">
          <Button @click="confirmMorePro()">确认</Button>
          <Button @click="cancelMorePro()">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- Loading -->
    <Spin fix v-if="loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>
<script>
import * as pmAPI from '../../../services/productManager.es6'
import * as ocAPI from '../../../services/operationCate.es6'
export default {
  name: 'categoryAssociation',
  data () {
    return {
      model1: '',
      model2: '',
      model3: '',
      list1: [],
      list2: [],
      list3: [],
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '所属类目',
          key: 'categoryName',
          align: 'center',
          width: 100
        }, {
          title: '商品信息',
          width: 300,
          key: 'pMessage',
          render: (h, params) => {
            return h('div', [
              h('img', {
                domProps: {
                  src: params.row.productPicture,
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
          align: 'center',
          width: 100
        }, {
          title: '总销量',
          key: 'sales',
          align: 'center',
          width: 100
        }, {
          title: '最新上架时间',
          key: 'putawayDate',
          align: 'center',
          width: 180,
          sortable: true
        }, {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handlePro(params)
                  }
                }
              }, '手动下架')
            ])
          }
        }
      ],
      onsellData: [],
      pageParams: {
        pageTotal: 0,
        pageNum: 1,
        pageSize: 5
      },
      startTime: '',
      endTime: '',
      localsearch: {
        name: null,
        categoryId: null,
        startTime: null,
        endTime: null
      },
      searchParams: {
        categoryId: null,
        name: null,
        endTime: null,
        startTime: null
      },
      listData: [],
      checkParams: [],
      takePro: false,
      MorePro: false,
      loading: false
    }
  },
  mounted () {
    this.getCategoryList((response) => {
      this.showcategoryList(response)
    })
    this.getOnSell((response) => {
      this.takeOnsellData(response)
    })
  },
  methods: {
    // -----------接口调用-----------
    // 获取初始数据，操作分页
    getOnSell (callback) {
      this.$http.post(...pmAPI.onsell(this.pageParams.pageNum, this.pageParams.pageSize, this.searchParams))
        .then((response) => {
          if (response.data.code === 200) {
            if (typeof callback === 'function') {
              callback(response)
            }
          }
        })
    },
    // 获取搜索类目
    getCategoryList (callback) {
      this.$http.get(ocAPI.getCate())
        .then((response) => {
          if (response.data.code === 200) {
            if (typeof callback === 'function') {
              callback(response)
            }
          }
        })
    },
    // 下架接口(批量/单个)
    postDelProduct (callback) {
      this.$http.post(...pmAPI.delProduct(this.checkParams))
        .then((response) => {
          if (response.data.code === 200) {
            if (typeof callback === 'function') {
              callback()
            }
          }
        })
    },
    // ----------数据处理-----------
    takeOnsellData (response) {
      let pageInfo = response.data.pageInfo
      this.onsellData = pageInfo.list
      this.pageParams = {
        pageTotal: pageInfo.total,
        pageSize: pageInfo.pageSize,
        pageNum: pageInfo.pageNum
      }
      this.loading = false
    },
    showcategoryList (response) {
      this.listData = response.data.operateCategory
      let a = this.listData
      for (let i in a) {
        if (a[i].secondCategory.length !== 0) {
          a[i].value = a[i].name
          this.list1.push({
            id: a[i].id,
            value: a[i].value
          })
        }
      }
    },
    firstCheck (val) {
      console.log(val)
      if (this.list1.length !== 0) {
        for (let a of this.list1) {
          if (val === a.value) {
            for (let b of this.listData) {
              if (a.id === b.id) {
                for (let i of b.secondCategory) {
                  i.value = i.name
                }
                if (this.model1 !== '') {
                  this.list2 = b.secondCategory
                  this.model2 = this.list2[0].name
                  this.localsearch.categoryId = this.list2[0].id
                }
              }
            }
          }
        }
      }
    },
    secondCheck (val) {
      if (this.list2.length !== 0) {
        for (let a of this.list2) {
          if (val === a.value) {
            for (let b of this.listData) {
              for (let c of b.secondCategory) {
                if (a.id === c.id) {
                  for (let i of c.threeCategory) {
                    i.value = i.name
                  }
                  if (this.model2 !== '') {
                    this.list3 = c.threeCategory
                  }
                }
              }
            }
          }
        }
      }
    },
    threeCheck (val) {
      for (let i of this.list3) {
        if (i.value === val) {
          this.localsearch.categoryId = i.id
        }
      }
    },
    // 查询在售商品
    handleSearch () {
      if (this.localsearch.endTime !== null && this.startTime > this.endTime) {
        this.$Message.warning({content: '请输入正确的上架时间范围'})
      } else {
        this.searchParams = this.localsearch
        console.log(this.searchParams)
        this.loading = true
        this.pageParams.pageNum = 1
        this.getOnSell((response) => {
          this.takeOnsellData(response)
        })
      }
    },
    // 重置
    handleReset () {
      this.model1 = ''
      this.model2 = ''
      this.model3 = ''
      this.endTime = ''
      this.startTime = ''
      this.localsearch = {
        categoryId: null,
        name: null,
        endTime: null,
        startTime: null
      }
      console.log(this.endTime, this.startTime)
    },
    clearDate () {
      if (this.localsearch.startTime !== null) {
        this.localsearch.startTime = null
      } else if (this.localsearch.endTime !== null) {
        this.localsearch.endTime = null
      }
    },
    // -----------------下架操作--------------
    // 单品下架操作
    handlePro (params) {
      this.takePro = true
      if (this.checkParams.length > 0) {
        this.checkParams = []
      }
      this.checkParams.push(params.row.spuId)
    },
    confirmPro () {
      this.postDelProduct(() => {
        this.takePro = false
        this.$Message.success({content: '成功下架'})
        this.getOnSell((response) => {
          this.takeOnsellData(response)
        })
      })
    },
    cancelPro () {
      this.takePro = false
    },
    // 批量下架操作
    // checkProduct
    onsellCheck (val) {
      let params = []
      for (let i of val) {
        params.push(i.spuId)
      }
      this.checkParams = params
    },
    handleMorePro () {
      if (this.checkParams.length === 0) {
        this.$Message.warning({content: '请选择下架商品'})
      } else {
        this.MorePro = true
      }
    },
    confirmMorePro () {
      console.log(this.checkParams)
      this.postDelProduct(() => {
        this.MorePro = false
        this.$Message.success({content: '成功下架'})
        this.getOnSell((response) => {
          this.takeOnsellData(response)
        })
      })
    },
    cancelMorePro () {
      this.MorePro = false
    },
    // 分页
    pageChange (val) {
      this.pageParams.pageNum = val
      this.loading = true
      this.getOnSell((response) => {
        this.takeOnsellData(response)
      })
    },
    // 添加新商品
    toAddProduct () {
      this.$parent.$parent.$parent.openTab({title: '发布新商品', currentView: 'addProduct'})
    }
  },
  watch: {
    takePro: function () {
      if (!this.takePro) {
        if (this.checkParams.length > 0) {
          this.checkParams = []
          console.log(this.checkParams)
        }
      }
    },
    MorePro: function () {
      if (!this.MorePro) {
        if (this.checkParams.length > 0) {
          this.checkParams = []
          console.log(this.checkParams)
        }
      }
    },
    endTime: function () {
      if (this.endTime !== '') {
        let date = this.endTime
        let Y = `${1900 + date.getYear()}`
        let M = `${date.getMonth() + 1}`
        let D = `${date.getDate()}`
        if (D < 10) {
          D = '0' + D
        }
        let h = `${date.getHours()}`
        if (h < 10) {
          h = '0' + h
        }
        let m = `${date.getMinutes()}`
        if (m < 10) {
          m = '0' + m
        }
        let s = `${date.getSeconds()}`
        if (s < 10) {
          s = '0' + s
        }
        this.localsearch.endTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
      }
    },
    startTime: function () {
      if (this.startTime !== '') {
        let date = this.startTime
        let Y = `${1900 + date.getYear()}`
        let M = `${date.getMonth() + 1}`
        let D = `${date.getDate()}`
        if (D < 10) {
          D = '0' + D
        }
        let h = `${date.getHours()}`
        if (h < 10) {
          h = '0' + h
        }
        let m = `${date.getMinutes()}`
        if (m < 10) {
          m = '0' + m
        }
        let s = `${date.getSeconds()}`
        if (s < 10) {
          s = '0' + s
        }
        this.localsearch.startTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
      }
    }
  }
}
</script>
