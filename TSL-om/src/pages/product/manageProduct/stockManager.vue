<style lang="scss" rel="stylesheet/scss" scoped>
#stockManager{
  min-width: 850px;
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
  margin: 10px;
}
.footer{
  margin: 10px;
  text-align: center;
}
.smTable {
  width: 95%;
  margin: 0 auto;
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
          <FormItem label="商品名称 :">
            <Input v-model="stockQueryInfo.name" placeholder="请输入" size="small" style="width: 120px"></Input>
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
        </div>
      </Form>
    </div>
    <div class="smTable">
      <Table border :columns="stockColumns" :data="stockData"></Table>
    </div>
    <div>
      <Button @click="submitInventory" class="submitBtn">提交</Button>
    </div>
    <div class="footer">
      <Page :current="pageParams.pageNum" :total="pageParams.pageTotal" :page-size="pageParams.pageSize" @on-change="pageChange" show-total></Page>
    </div>
  </div>
</template>
<script>
  import * as stAPI from '../../../services/productManager.es6'
  export default {
    name: 'stockManager',
    data () {
      return {
        pstate: 'onsale',
        stateList: [
          {
            value: '0',
            label: '未用'
          },
          {
            value: '1',
            label: '正用'
          }
        ],
        stockColumns: [
          {
            title: '所属类目',
            key: 'categoryName',
            width: 100,
            align: 'center'
          }, {
            title: '商品信息',
            key: 'pMessage',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  domProps: {
                    src: require('../../../assets/images/anmoqi.jpg'),
                    alt: 'anmoqi'
                  },
                  style: {
                    width: '50px',
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
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }
                }, params.row.name)
              ])
            }
          }, {
            title: '销售属性',
            align: 'center',
            key: 'salesProperty',
            render: (h, params) => {
              let arr = []
              for (let i of params.row.specValueArray) {
                let ele = h('p', {}, `${i.specName}:${i.specValue}`)
                arr.push(ele)
              }
              return h('div', {}, arr)
            }
          }, {
            title: '展示库存',
            align: 'center',
            key: 'stock',
            width: 150,
            render: (h, params) => {
              if (params.row.stockState) {
                return h('Input', {
                  props: {
                    value: params.row.stock,
                    size: 'small',
                    autofocus: true
                  },
                  style: {
                    width: '60px'
                  },
                  on: {
                    'on-change': (val) => {
                      params.row.tempInventory = val.srcElement.value.replace(/(^\s*)|(\s*$)/g, '')
                    },
                    'on-foucs': () => {
                      params.row.tempInventory = this.saveObj.value[params.index].inventory
                    },
                    'on-blur': () => {
                      console.log(params.row.tempInventory)
                      if (params.row.tempInventory) {
                        this.saveObj.value[params.index] = {
                          index: params.index,
                          inventory: params.row.tempInventory
                        }
                      } else if (params.row.tempInventory !== undefined) {
                        this.$Message.warning('参数值必填')
                        params.row.tempInventory = ''
                      } else if (params.row.tempInventory === undefined) {
                        this.$Message.warning('请修改数值')
                        params.row.stockState = false
                      }
                    }
                  }
                })
              } else {
                return h('div', {
                  on: {
                    click: () => {
                      console.log(params)
                      params.row.stockState = true
                    }
                  }
                }, params.row.stock)
              }
            }
          }, {
            title: '已占库存(件)',
            width: 150,
            align: 'center',
            key: 'userdStock',
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
          }
        ],
        stockData: [],
        saveObj: {
          value: []
        },
        pageParams: {
          pageTotal: 0,
          pageNum: 1,
          pageSize: 5
        },
        stockQueryInfo: {
          endScope: null,
          name: null,
          startScope: null,
          status: null
        }
      }
    },
    mounted () {
      this.postStock((response) => {
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
                pageSize: 5,
                pageNum: 1
              }
            }
          })
      },
      // 处理skuInfo
      takeSkuInfo (response) {
        let pageStockInfo = response.data.pageStockInfo
        this.pageParams = {
          pageTotal: pageStockInfo.total,
          pageSize: pageStockInfo.pageSize,
          pageNum: 1
        }
        this.stockData = pageStockInfo.list
        this.handlestockData()
      },
      handlestockData () {
        for (let i of this.stockData) {
          i.stockState = false
          i.userdStock = 10 // value = null
        }
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
      },
      // 查询
      handleSearch () {
        this.scopeToNum()
        console.log(this.stockQueryInfo)
        if (this.stockQueryInfo.endScope !== null && this.stockQueryInfo.startScope > this.stockQueryInfo.endScope) {
          this.$Message.warning({content: '请输入正常库存范围'})
        } else {
          this.pageParams.pageNum = 1
          this.postStock((response) => {
            this.takeSkuInfo(response)
          })
        }
      },
      // 分页
      pageChange (val) {
        this.pageParams.pageNum = val
        this.postStock((response) => {
          this.takeSkuInfo(response)
          this.pageParams.pageNum = val
        })
      },
      // 修改展示库存数量
      submitInventory () {
        if (this.saveObj.value.length !== 0) {
          for (let obj of this.saveObj.value) {
            if (this.stockData[obj.index]) {
              this.stockData[obj.index].stock = this.saveObj.value[obj.index].inventory
              this.stockData[obj.index].stockState = false
              console.log(this.saveObj)
              console.log(this.stockData[obj.index])
            }
          }
          this.$Message.success({content: '库存修改成功'})
        }
      }
    }
  }
</script>
