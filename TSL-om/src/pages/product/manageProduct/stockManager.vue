<style lang="scss" rel="stylesheet/scss" scoped>
  #stockManager{
    min-width: 1056px;
  }
  .my-breadcrumb {
    margin: 0px 10px;
  }
  .smSearch{
    margin: 20px;
    .smForm {
      display: inline-block;
      margin: auto 20px;
    }
  }
  .submitBtn {
    float: right;
    margin-right:18px;
  }
  .footer{
    margin: 10px;
    text-align: center;
  }
  .smTable {
    width: 95%;
    margin: 0 auto;
  }
  .smInventory {
    margin: 10px 28px;
  }
  .my-Icon {
    position: absolute;
    right:10px;
    top:11px;
  }
</style>
<template>
  <div id="stockManager">
    <div class="smTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>商家后台管理</BreadcrumbItem>
        <BreadcrumbItem>库存管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="smSearch">
      <Form :label-width="80">
        <div class="smForm">
          <FormItem label="商品编码 :">
            <Input v-model="stockQueryInfo.code" placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
        </div>
        <div class="smForm">
          <FormItem label="SKU编码 :">
            <Input v-model="stockQueryInfo.barCode" placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
        </div>
        <div class="smForm">
          <FormItem label="商品名称 :">
            <Input v-model="stockQueryInfo.name" placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
        </div>
        <div class="smForm">
          <FormItem label="设计编码 :">
            <Input v-model="stockQueryInfo.designBarCode" placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
        </div>
        <div class="smForm">
          <FormItem label="库存范围 :">
            <Input v-model="stockQueryInfo.startScope" @on-keyup="scopeValue" size="small" style="width: 60px; margin-right: 10px"></Input>
            <span>到</span>
            <Input v-model="stockQueryInfo.endScope" @on-keyup="scopeValue" size="small" style="width: 60px; margin-left: 10px"></Input>
          </FormItem>
        </div>
        <div class="smForm">
          <FormItem label="商品状态 :">
            <Select v-model="stockQueryInfo.status" size="small" style="width:120px">
              <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="smForm">
          <Button @click="handleSearch()">查找</Button>
          <Button @click="handleReset()">重置</Button>
        </div>
      </Form>
    </div>
    <div class="smInventory">
    </div>
    <div class="smTable" ref="smTable">
      <Table border :columns="stockColumns" :data="stockData" @on-selection-change="checkStock" height="500"></Table>
    </div>
    <div class="footer">
      <Button @click="submitInventory" class="submitBtn">修改库存</Button>
      <Page :current="pageParams.pageNum" :total="pageParams.pageTotal" :page-size="pageParams.pageSize" @on-change="pageChange" show-total></Page>
    </div>
    <Modal v-model="moreInventory" title="库存批量修改">
      <Form>
        <div>
          <FormItem label="库存个数 :">
            <Input placeholder="请输入" v-model.trim="manyInventory" style="width: 200px;"></Input>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="reviseOk">确定</Button>
        <Button @click="reviseCancel">取消</Button>
      </div>
    </Modal>
    <Loading :isload="loading"></Loading>
  </div>
</template>
<script>
  import * as stAPI from '../../../services/productManager.es6'
  import * as ocAPI from '../../../services/operationCate.es6'
  import Loading from '../../../components/loading'
  export default {
    name: 'stockManager',
    components: {
      Loading
    },
    data () {
      return {
        loading: false,
        pstate: 'onsale',
        stateList: [
          {
            value: '0',
            label: '待上架'
          },
          {
            value: '1',
            label: '在售'
          },
          {
            value: '2',
            label: '手动下架'
          }
        ],
        stockColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '商品编码',
            key: 'code',
            align: 'center',
            width: 180
          },
          {
            title: 'SKU编码',
            key: 'barCode',
            width: 180,
            align: 'center'
          },
          {
            title: '所属类目',
            key: 'categoryName',
            align: 'center',
            width: 250,
            render: (h, params) => {
              let allLev
              let lev3
              let lev2
              let lev1
              let cateTemp = this.returnSecAndFirCate(params.row.categoryId)
              if (cateTemp.length > 0) {
                for (let a of cateTemp) {
                  switch (a.level) {
                    case 3: {
                      lev3 = a.name
                      break
                    }
                    case 2: {
                      lev2 = a.name
                      break
                    }
                    case 1: {
                      lev1 = a.name
                      break
                    }
                  }
                }
                allLev = `${lev1} > ${lev2} > ${lev3}`
              }
              return h('div', {}, allLev)
            }
          }, {
            title: '商品信息',
            key: 'pMessage',
            width: 300,
            render: (h, params) => {
              return h('div', [
                h('img', {
                  domProps: {
                    src: params.row.defuaultPic,
                    alt: 'anmoqi'
                  },
                  style: {
                    width: '50px',
                    height: '50px',
                    margin: '5px',
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }
                }),
                h('div', {
                  props: 'text',
                  className: 'ddd',
                  size: 'small',
                  style: {
                    width: '160px',
                    marginLeft: '2px',
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }
                }, params.row.name)
              ])
            }
          }, {
            title: '销售属性',
            align: 'center',
            width: 210,
            key: 'salesProperty',
            render: (h, params) => {
              let arr = []
              for (let i of params.row.specValueArray) {
                if (i.specName === 'WeightOfGold&IsOnly1') {
                  i.specName = '克数'
                }
                let ele = h('p', {}, `${i.specName}:${i.specValue}`)
                arr.push(ele)
              }
              if (arr.length === 0) {
                return h('div', {}, '单品')
              } else {
                return h('div', {}, arr)
              }
            }
          }, {
            title: '已占库存(件)',
            width: 152,
            align: 'center',
            key: 'useStock',
            renderHeader: (h, params) => {
              return h('div', [
                h('span', {}, params.column.title),
                h('Tooltip', {
                  props: {
                    placement: 'top-end'
                  },
                  style: {
                    margin: '3px'
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'help-circled'
                    }
                  }),
                  h('div', {
                    slot: 'content',
                    style: {
                      zIndex: '1000'
                    }
                  }, [
                    h('p', {}, '特指未付款的订单中占用的SKU'),
                    h('p', {}, '库存数量；当未付款订单超时'),
                    h('p', {}, '仍未付款，系统会自动取消'),
                    h('p', {}, '订单并释放这部分SKU库存。')
                  ])
                ])
              ])
            }
          }, {
            title: '在售库存',
            align: 'center',
            key: 'stock',
            width: 150,
            render: (h, params) => {
              if (this.stockData[params.index].stockState) {
                return h('Input', {

                  props: {
                    value: params.row.stock,
                    size: 'small'
                  },
                  style: {
                    width: '60px'
                  },
                  on: {
                    'on-change': (val) => {
                      params.row.tempInventory = val.target.value.replace(/(^\s*)|(\s*$)/g, '')
                      if (params.row.tempInventory && params.row.tempInventory !== null) {
                        this.saveObj.value[params.index] = {
                          spuId: params.row.spuId,
                          index: params.index,
                          skuId: params.row.skuId,
                          stock: params.row.tempInventory
                        }
                        console.log(this.saveObj)
                      } else if (params.row.tempInventory !== undefined) {
                        this.$Message.warning('参数值必填')
                        params.row.tempInventory = ''
                      }
                    },
                    'on-focus': () => {
                      params.row.tempInventory = params.row.stock
                    },
                    'on-blur': () => {
                      this.stockData[params.index].stock = params.row.tempInventory
                    }
                  }
                })
              } else {
                return h('div', {
                  on: {
                    click: () => {
                      this.makeInventory(params)
                    }
                  }
                }, params.row.stock)
              }
            }
          }, {
            title: '商品状态',
            key: 'status',
            width: 150,
            align: 'center',
            render: (h, params) => {
              let a = params.row.status
              switch (a) {
                case 0 : {
                  params.row.statuscn = '待上架'
                  break
                }
                case 1: {
                  params.row.statuscn = '在售'
                  break
                }
                case 2: {
                  params.row.statuscn = '手动下架'
                  break
                }
                default: {
                  break
                }
              }
              return h('div', {}, params.row.statuscn)
            }
          }
        ],
        cateArr: {},
        stockData: [],
        saveObj: {
          value: []
        },
        checkSaveObj: [],
        pageParams: {
          pageTotal: 0,
          pageNum: 1,
          pageSize: 20
        },
        stockQueryInfo: {
          endScope: null,
          name: null,
          startScope: null,
          status: null,
          code: null,
          barCode: null
        },
        moreInventory: false,
        onCheckStock: true,
        manyInventory: null
      }
    },
    mounted () {
      this.loading = true
      this.postStock((response) => {
        this.getCategoryList((response) => {
          this.showcategoryList(response)
        })
        this.takeSkuInfo(response)
      })
    },
    methods: {
      // -----------数据接口-----------
      postStock (callback) {
        this.$http.post(...stAPI.stock(this.pageParams.pageNum, this.pageParams.pageSize, this.stockQueryInfo))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
            if (response.data.code === 2001) {
              this.stockData = []
              this.pageParams = {
                pageTotal: 0,
                pageSize: 20,
                pageNum: 1
              }
              this.loading = false
            }
          })
      },
      putStock (params, callback) {
        this.$http.put(...stAPI.putStock(params))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback()
                this.$Message.success({content: '库存修改成功'})
              }
            }
          })
      },
      // 类目接口
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
      // -------------数据处理----------
      // 处理skuInfo
      takeSkuInfo (response) {
        let pageStockInfo = response.data.pageStockInfo
        this.pageParams = {
          pageTotal: pageStockInfo.total,
          pageSize: pageStockInfo.pageSize,
          pageNum: pageStockInfo.pageNum
        }
        for (let i of pageStockInfo.list) {
          i.stockState = false
          if (i.useStock === null) {
            i.useStock = 0  // value = null
          }
        }
        this.stockData = pageStockInfo.list
        this.loading = false
      },
      // 处理scope值
      scopeValue () {
        if (this.stockQueryInfo.startScope) {
          this.stockQueryInfo.startScope = this.stockQueryInfo.startScope.replace(/[^\d]/g, '')
        }
        if (this.stockQueryInfo.endScope) {
          this.stockQueryInfo.endScope = this.stockQueryInfo.endScope.replace(/[^\d]/g, '')
        }
      },
      scopeToNum () {
        if (this.stockQueryInfo.startScope === '') {
          this.stockQueryInfo.startScope = null
        } else if (this.stockQueryInfo.startScope) {
          this.stockQueryInfo.startScope = Number(this.stockQueryInfo.startScope)
        }
        if (this.stockQueryInfo.endScope === '') {
          this.stockQueryInfo.endScope = null
        } else if (this.stockQueryInfo.endScope) {
          this.stockQueryInfo.endScope = Number(this.stockQueryInfo.endScope)
        }
        if (this.stockQueryInfo.status) {
          this.stockQueryInfo.status = parseInt(this.stockQueryInfo.status)
        }
      },
      // 查询
      handleSearch () {
        this.scopeToNum()
        console.log(this.stockQueryInfo)
        if (this.stockQueryInfo.endScope !== null && this.stockQueryInfo.startScope > this.stockQueryInfo.endScope) {
          this.$Message.warning({content: '请输入正常库存范围'})
        } else {
          this.pageParams.pageNum = 1
          this.loading = true
          this.postStock((response) => {
            this.takeSkuInfo(response)
          })
        }
      },
      // 重置
      handleReset () {
        this.loading = true
        this.stockQueryInfo = {
          endScope: null,
          name: null,
          startScope: null,
          status: null,
          code: null,
          barCode: null
        }
        this.pageParams.pageNum = 1
        this.postStock((response) => {
          this.takeSkuInfo(response)
        })
      },
      // 分页
      pageChange (val) {
        this.pageParams.pageNum = val
        this.loading = true
        this.postStock((response) => {
          this.takeSkuInfo(response)
          this.pageParams.pageNum = val
        })
      },
      makeInventory (params) {
        this.stockData[params.index].stockState = true
      },
      // 修改展示库存数量
      submitInventory () {
        let arr = []
        for (let a of this.saveObj.value) {
          if (a) {
            arr.push(a)
          }
        }
        console.log(arr)
        if (arr.length === 0) {
          this.$Message.warning({content: '请修改后再提交'})
        } else {
          this.putStock(arr, () => {
            this.postStock((response) => {
              this.takeSkuInfo(response)
              this.saveObj.value = []
            })
          })
        }
      },
      // 批量修改库存(设置scrollLeft)
      checkStock (val) {
        let arr = []
        if (val.length > 0) {
          this.onCheckStock = false
          for (let a of val) {
            arr.push({
              skuId: a.skuId,
              stock: a.stock
            })
          }
          this.checkSaveObj = arr
        } else if (val.length === 0) {
          this.onCheckStock = true
        }
      },
      handleInventory () {
        let smTableBody = this.$refs.smTable.children[0].children[0].children[1]
        smTableBody.scrollLeft = 360
        this.moreInventory = true
      },
      reviseOk () {
        for (let a of this.checkSaveObj) {
          a.stock = this.manyInventory
        }
        console.log(this.checkSaveObj)
        this.moreInventory = false
        this.loading = true
        this.putStock(this.checkSaveObj, () => {
          this.postStock((response) => {
            this.takeSkuInfo(response)
            this.checkSaveObj = []
            this.onCheckStock = true
            this.manyInventory = null
          })
        })
      },
      reviseCancel () {
        this.moreInventory = false
        this.manyInventory = null
      },
      // 类目处理
      showcategoryList (response) {
        this.listData = response.data.operateCategory
        let arr1 = []
        let arr2 = []
        let arr3 = []
        if (this.listData.length > 0) {
          for (let a of this.listData) {
            arr1.push(a)
            if (a.secondCategory.length > 0) {
              for (let b of a.secondCategory) {
                arr2.push(b)
                if (b.threeCategory.length > 0) {
                  for (let c of b.threeCategory) {
                    arr3.push(c)
                  }
                }
              }
            }
          }
        }
        this.cateArr = {
          lev1: arr1,
          lev2: arr2,
          lev3: arr3
        }
      },
      returnSecAndFirCate (cateId) {
        let cateTemp = []
        if (this.cateArr.lev3) {
          for (let a of this.cateArr.lev3) {
            // 找到对应3级目录
            if (a.id === cateId) {
              cateTemp.push(a)
              if (this.cateArr.lev2) {
                for (let b of this.cateArr.lev2) {
                  // 找到对应2级目录
                  if (a.parentId === b.id) {
                    cateTemp.push(b)
                    if (this.cateArr.lev1) {
                      for (let c of this.cateArr.lev1) {
                        if (b.parentId === c.id) {
                          cateTemp.push(c)
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return cateTemp
      }
    }
  }
</script>
