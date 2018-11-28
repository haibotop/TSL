<style lang="scss" rel="stylesheet/scss">
#productManager2 {
  min-width:1110px;
}
.open-modal .ivu-modal-close {
    z-index: 999;
}
.my-breadcrumb {
  margin: 0px 10px;
}
.pmSearch{
  max-width: 1150px;
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
          <FormItem label="商品编码 :">
            <Input v-model="spuNum" placeholder="请输入" size="small" style="width: 140px"></Input>
          </FormItem>
        </div>
        <div class="onSearch">
          <FormItem label="商品名称 :">
            <Input v-model="querryName" placeholder="请输入" size="small" style="width: 140px"></Input>
          </FormItem>
        </div>
        <div class="onSearch">
          <FormItem label="设计编码 :">
            <Input v-model="barCode" placeholder="请输入" size="small" style="width: 140px"></Input>
          </FormItem>
        </div>
        <div class="onSearch">
          <FormItem label="商品状态 :">
            <Select v-model="cateSelect" size="small" style="width:140px">
              <Option v-for="(item, index) in statusCate" :value="item" :key="index">{{ item }}</Option>
            </Select>
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
        <div class="onSearch">
          <FormItem label="下架时间 :">
            <Row>
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 146px" v-model="startTime" @on-open-change="judgeStartTime"></DatePicker>
              ~
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 146px" v-model="endTime" @on-open-change="judgeEndTime"></DatePicker>
            </Row>
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
      <Table :columns="columns1" :data="resData" height="500" @on-selection-change="selectParam" @on-sort-change="sortChange"></Table>
    </div>
    <div class="footer">
      <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="clickPage" show-total></Page>
    </div>
    <div class="pmConfirm">
      <Modal title="上架" v-model="ProConfirm" width="400">
        <p>确认上架 {{piecePro}} 件商品？</p>
        <div slot="footer">
          <Button @click="confirmPost">确认</Button>
          <Button @click="closePro">取消</Button>
        </div>
      </Modal>
    </div>
    <div>
      <Modal
        v-model="subConfirm" width="960"
        :styles="{'margin-bottom': '100px'}"
        class-name="open-modal">
        <!-- 此处上架编辑框弹出的是修改单品还是修改sku组合商品   alo单品   cba组合 -->
        <aloProAlt :productInfo="productInfo" v-if="productInfo.alo" ref="saveSingleModal"></aloProAlt>
        <cbaProAlt :productInfo="productInfo" v-if="productInfo.cba" ref="saveModal"></cbaProAlt>
        <div slot="footer"><Button type="primary" @click="saveToback">保存</Button></div>
      </Modal>
    </div>

    <loading :isload="isLoad"></loading>
  </div>
</template>
<script>
import * as pdAPI from '../../../services/productManager.es6'
import * as opAPI from '../../../services/operationCate.es6'
import aloProAlt from '../../../pages/product/manageProduct/alter/aloProAlt'
import cbaProAlt from '../../../pages/product/manageProduct/alter/cbaProAlt'
import Loading from '../../../components/loading'

export default {
  name: 'categoryAssociation',
  components: {
    aloProAlt,
    cbaProAlt,
    Loading
  },
  data () {
    return {
      asyncData: '',
      // 当前页码，默认为第一页
      pageNum: 1,
      // 每页显示条数，当前默认为5条
      pageSize: 20,
      // 商品总条数
      total: 0,
      // 传输参数，
      forSellParams: {},
      // 商品名称查询
      querryName: null,
      //设计编码
      barCode: null,
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
      // 商品编码
      spuNum: null,
      // 商品状态分类查询
      statusCate: ['全部', '待上架', '手动下架'],
      cateSelect: null,
      // loading状态
      isLoad: true,
      // 表格title
      columns1: [
        {
          type: 'selection',
          width: 80,
          align: 'center'
        },
        {
          title: '商品编码',
          key: 'code',
          width: 180
        },
        {
          title: '所属类目',
          key: 'categoryName',
          width: 300
        }, {
          title: '商品信息',
          key: 'productName',
          width: 260,
          render: (h, params) => {
            let defaultPic = ''
            if (params.row.productPicture) {
              defaultPic = params.row.productPicture + '!56'
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
                  width: '146px',
                  verticalAlign: 'middle',
                  display: 'inline-block'
                }
              }, params.row.productName)
            ])
            return dom
          }
        }, {
          title: '设计编号',
          key: 'barcode',
          align: 'center',
          width: 150
        }, {
          title: '总库存',
          key: 'stock',
          width: 130
        }, {
          title: '总销量',
          key: 'sales',
          width: 130
        },
        {
          title: '商品状态',
          key: 'productState',
          width: 100,
          render: (h, params) => {
            switch (params.row.status) {
              case 0: {
                return h('div', [
                  h('span', {}, '待上架'),
                  h('Tooltip', {
                    props: {
                      placement: 'right-end'
                    },
                    style: {
                      marginLeft: '2px'
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'help-circled'
                      }
                    }),
                    h('div', {
                      slot: 'content'
                    }, [
                      h('p', {}, '首次发布商品：'),
                      h('p', {}, '请点击上架或者批量上架操作')
                    ])
                  ])
                ])
              }
              case 2: {
                return h('div', [
                  h('span', {}, '手动下架')
                ])
              }
              case 3: {
                return h('div', {}, [
                  h('span', {}, '系统下架')
                ])
              }
              case 4: {
                return h('div', {}, [
                  h('div', {}, '系统自动下架'),
                  h('Tooltip', {
                    props: {
                      placement: 'right-end'
                    },
                    style: {
                      marginLeft: '2px'
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'help-circled'
                      }
                    }),
                    h('div', {
                      slot: 'content'
                    }, [
                      h('p', {}, '系统自动下架原因：'),
                      h('p', {}, '商品库存为0超过14天。')
                    ])
                  ])
                ])
              }
            }
          }
        },
        {
          title: '下架时间',
          key: 'putawayDate',
          width: 170,
          sortable: true
        },
        {
          title: '操作',
          width: 200,
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
              }, '上架'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    console.log(params.row.spuId)
                    this.deletePro(params.row.spuId)
                  }
                }
              }, '删除商品')
            ])
          }
        }
      ],
      // 返回商品值
      resData: [],
      // 修改的弹窗   商品数值，弹窗状态状态
      subConfirm: false,
      productInfo: {},
      // 上架件数
      piecePro: 1,
      // 上架许可
      sumitDis: true,
      // 上架id参数集合
      batchId: [],
      // 上架的确认弹窗
      ProConfirm: false
    }
  },
  methods: {
    // 时间转换格式
    formatDateTime (dateTime) {
      let date = dateTime
      console.log(date)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      let second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    //为什么注释
    judgeStartTime (status) {
      if (!status) {
        let startTime = ''
        let endTime = ''
        if (this.startTime) {
          startTime = this.formatDateTime(this.startTime)
        }
        if (this.endTime) {
          endTime = this.formatDateTime(this.endTime)
          if (endTime < startTime) {
            this.startTime = ''
            this.endTime = ''
          }
        }
      }
    },
    judgeEndTime (status) {
      if (!status) {
        let startTime = ''
        let endTime = ''
        if (this.endTime) {
        }
        if (this.startTime) {
          startTime = this.formatDateTime(this.startTime)
          if (endTime < startTime) {
            this.startTime = ''
            this.endTime = ''
            this.$Message.error({content: '日期选择有误!请重新选择正常时间搜索范围。'})
          }
        }
      }
    },
    // 请求查询
    querryData () {
      let startTime = null
      let endTime = null
      let statusP = null
      if (this.endTime !== null && this.startTime > this.endTime) {
        this.$Message.warning({content: '结束时间不可早于开始时间'})
        return
      }
      if (this.startTime) {
        startTime = this.formatDateTime(this.startTime)
      }
      if (this.endTime) {
        endTime = this.formatDateTime(this.endTime)
      }
      // 商品状态
      switch (this.cateSelect) {
        case ('待上架'): {
          statusP = 0
          break
        }
        case ('手动下架'): {
          statusP = 2
          break
        }
        // case ('系统下架'): {
        //   statusP = 3
        //   break
        // }
        // case ('系统自动下架'): {
        //   statusP = 4
        //   break
        // }
        case (null || '全部'): {
          statusP = null
          break
        }
      }
      this.forSellParams = {
        'categoryId': this.categoryId,
        'name': this.querryName,
        // 商品编码
        'code': this.spuNum,
        'startTime': startTime,
        'endTime': endTime,
        'status': statusP,
        'sort': null,
        'barCode': this.barCode
      }
      this.pageNum = 1
      this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
    },
    // 重置按钮
    resetQuerry () {
      this.querryName = null
      this.startTime = null
      this.endTime = null
      this.spuNum = null
      this.barCode =  null
      // 类目重置
      this.firSele = null
      this.secSele = null
      this.thirSele = null
      this.categoryId = null
      let sort = this.forSellParams.sort
      this.forSellParams = {}
      this.forSellParams.sort = sort
      this.pageNum = 1
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
          this.list2Change(this.seleList2[0].name)
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
            this.thirSele = this.seleList3[0].name
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
    // 跳转页码触发事件
    clickPage (pageNum) {
      this.isLoad = true
      this.pageNum = pageNum
      this.getForSell(pageNum, this.pageSize, this.forSellParams)
    },
    // 排序事件
    sortChange (params) {
      let order = null
      if (params.order !== 'normal') {
        order = params.order
      } else {
        order = null
      }
      this.forSellParams.sort = order
      this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
    },
    // 修改商品信息
    handleSub (params) {
      console.log('params',params)
      let spuId = params.row.spuId
      let categoryId = params.row.categoryId
      this.isLoad = true
      this.productInfo = {}
      this.getForSellDetail((response) => {
        let res = JSON.parse(response.request.response)
        this.productInfo = JSON.parse(JSON.stringify(res.productInfo))
        if (this.productInfo.skuInfos.cateSelect.length === 0) {
          // 单品
          this.productInfo.cba = false
          this.productInfo.alo = true
        } else {
          // 多品
          this.productInfo.status = params.row.status
          this.productInfo.alo = false
          this.productInfo.cba = true
        }
        this.isLoad = false
        this.subConfirm = true
      }, spuId, categoryId)
    },
    // 删除商品
    deletePro (params) {
      this.$Modal.confirm({
        title: '删除',
        content: '是否删除已选择商品？',
        onOk: () => {
          let delParams = []
          delParams.push(params)
          console.log(delParams)
          this.$http.post(...pdAPI.delItemsForSale(delParams))
            .then((response) => {
              if (response.data.code === 200) {
                this.$Message.success('删除成功')
                this.pageNum = 1
                this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
              } else {
                this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
                this.$Message.success('删除失败')
              }
            })
        }
      })
    },
    // 批量上架弹出窗
    handleAll () {
      this.ProConfirm = true
    },
    // 单独上架弹出窗
    handlePro (param) {
      this.batchId = []
      this.batchId.push(param)
      this.piecePro = 1
      this.ProConfirm = true
    },
    // 确认上架
    confirmPost () {
      this.isLoad = true
      this.postBatch(this.batchId, (res) => {
        this.batchId = []
        this.isLoad = false
        if (res.data.code === 200) {
          this.$Message.success({content: '上架成功'})
          this.resetQuerry()
          this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
          this.batchId = []
          this.ProConfirm = false
        } else {
          this.ProConfirm = false
          this.$Message.warning('不能上架' + res.data.message + '!')
        }
      })
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
        this.piecePro = param.length
      }
      this.batchId = []
      for (let i in param) {
        this.batchId.push(param[i].spuId)
      }
    },
    // 发布新商品
    toAddProduct () {
      this.$router.push({path: '/home/addProduct'})
    },
    // ================  保存修改商品信息
    saveToback () {
      if (this.productInfo.cba) {
        this.$refs.saveModal.$emit('saveToback')
      } else if (this.productInfo.alo) {
        this.$refs.saveSingleModal.$emit('saveToback')
      }
      // window.location.reload()
    },
    // ------------------------event-----api-----------------------------------------------
    // 获取待售商品列表
    getForSell (pageNum, pageSize, params) {
      this.$http.post(...pdAPI.forSell(pageNum, pageSize, params))
        .then((response) => {
          if (response.data.code === 200) {
            let res = JSON.parse(response.request.response).pageInfo
            // 渲染页码旁的数据条数
            this.total = parseInt(res.total)
            this.resData = res.list
            for (let i of this.resData) {
              for (let j of this.seleList1) {
                for (let k of j.secondCategory) {
                  for (let l of k.threeCategory) {
                    if (i.categoryId === l.id) {
                      i.categoryName = j.name + '>' + k.name + '>' + i.categoryName
                    }
                  }
                }
              }
            }
            this.isLoad = false
          }
        })
    },
    // 上架代售商品
    postBatch (params, callback) {
      this.$http.post(...pdAPI.batchPost(params))
      .then((res) => {
        if (typeof (callback) === 'function') {
          callback(res)
        }
      })
    },
    // 获取类目分类
    getCate (callback) {
      this.$http.get(opAPI.getCate())
      .then((response) => {
        if (response.data.code === 200) {
          let res = JSON.parse(response.request.response).operateCategory
          this.seleList1 = res
          this.isLoad = false
          if (typeof (callback) === 'function') {
            callback()
          }
        }
      })
    },
    // 传入spuId获取待售商品详情信息
    getForSellDetail (callback, spuId, categoryId) {
      this.$http.get(pdAPI.getProductInfo(spuId, categoryId))
      .then((response) => {
        if (response.data.code === 200) {
          if (typeof (callback) === 'function') {
            callback(response)
          }
        }
      })
    }
  },
  created: function () {
    this.getCate(() => {
      this.getForSell(this.pageNum, this.pageSize, this.forSellParams)
    })
  }
}
</script>
