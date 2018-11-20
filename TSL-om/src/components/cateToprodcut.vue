<style lang="scss" rel="stylesheet/scss" scoped>
  .width-1000{
    min-width: 1000px!important;
  }
  .deleteBtn {
    margin: 5px;
  }
</style>
<template>
  <div id="cateToproduct">
    <Modal v-model="vModel" :styles="{width: '1000px!important'}" :title="vModelTitle">
      <!--搜索框-->
      <div class="searchForm" v-if="relateBoolean">
        <Form :label-width="80">
          <!--商品名称input 价格input 商品类目select-->
          <div class="li-1">
            <div style="display: inline-block">
              <FormItem label="商品编码:">
                <Input v-model.trim="localsearch.code" size="small" placeholder="请输入" style="width: 150px"/>
              </FormItem>
            </div>
            <div style="display: inline-block">
              <FormItem label="商品类目:">
                <Select size="small" v-model="cate1" style="width: 113px" placeholder="一级类目" @on-change="firstCheck">
                  <Option v-for="item1 in catelist1" :value="item1.id" :key="item1.value">{{item1.value}}</Option>
                </Select>
                <Select size="small" v-model="cate2" style="width: 113px" placeholder="二级类目" @on-change="secondCheck">
                  <Option v-for="item2 in catelist2" :value="item2.id" :key="item2.value">{{item2.value}}</Option>
                </Select>
                <Select size="small" v-model="cate3" style="width: 113px" placeholder="三级类目" @on-change="threeCheck">
                  <Option v-for="item3 in catelist3" :value="item3.id" :key="item3.value">{{item3.value}}</Option>
                </Select>
              </FormItem>
            </div>
          </div>
          <!--商品编码input 上架时间datePciker-->
          <div class="li-2">
            <div style="display: inline-block">
              <FormItem label="商品名称:">
                <Input v-model.trim="localsearch.name"size="small" placeholder="请输入" style="width: 150px"/>
              </FormItem>
            </div>
            <div style="display: inline-block">
              <FormItem label="上架时间:">
                <DatePicker type="datetime" v-model="startTime" style="width: 170px" size="small" placeholder="请选择时间" @on-clear="clearStartDate"></DatePicker>
                <DatePicker type="datetime" v-model="endTime" style="width: 170px" size="small" placeholder="请选择时间" @on-clear="clearEndDate"></DatePicker>
              </FormItem>
            </div>
            <div style="display: inline-block; margin-left: 48px">
              <Button @click="handleSearch">查询</Button>
              <Button @click="handleReset">重置</Button>
            </div>
          </div>
        </Form>
      </div>
      <div class="deleteBtn" v-else>
        <Button @click="deletePd">删除关联商品</Button>
      </div>
      <!--展示table-->
      <div class="proTable">
        <Table :columns="proList" :data="proData" @on-selection-change="selectTion" @on-select="handleSelectOne" @on-select-cancel="cancelSelectOne" @on-select-all="handleSelectAll"></Table>
      </div>
      <!--关联商品分页-->
      <div class="pageModal" v-if="relateBoolean">
        <Page :current="pageParams.pageNum" :total="pageParams.pageTotal" :page-size="pageParams.pageSize"
              @on-change="pageChange" show-total></Page>
      </div>
      <!--查看商品列表分页-->
      <div class="pageModal" v-else>
        <Page :current="pageParams.pageNum" :total="pageParams.pageTotal" :page-size="pageParams.pageSize"
              @on-change="listPageChange" show-total></Page>
      </div>
      <div slot="footer" v-if="relateBoolean">
        <Button @click="Proconfirm">确定</Button>
        <Button @click="vModel=false">取消</Button>
      </div>
      <div slot="footer" v-else>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pmAPI from '../services/productManager.es6'
  import * as ocAPI from '../services/operationCate.es6'
  export default {
    name: 'cateToproduct',
    data () {
      return {
        cate1: '',
        cate2: '',
        cate3: '',
        endTime: '',
        startTime: '',
        vModelTitle: '',
        test: '1',
        cateArr: {},
        tempObj: {},
        catelist1: [],
        catelist2: [],
        catelist3: [],
        listData: [],
        proData: [],
        relateProData: [],
        checkProData: [],
        proList: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '商品编码',
            width: 180,
            key: 'code'
          },
          {
            title: '所属类目',
            width: 250,
            key: 'categoryName',
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
          },
          {
            title: '商品信息',
            width: 300,
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
          },
          {
            title: '库存',
            key: 'stock',
            width: 100
          },
          {
            title: '销量',
            key: 'sales',
            width: 100
          },
          {
            title: '最新上架时间',
            key: 'putawayDate',
            width: 180
          }
        ],
        selectPro: [],
        tempPro: [],
        loadPageIndex: [],
        deletePro: [],
        pageParams: {
          pageNum: 1,
          pageSize: 10,
          pageTotal: 0
        },
        localsearch: {
          name: null,
          categoryId: null,
          startTime: null,
          endTime: null,
          code: null,
          barCode: null
        },
        searchParams: {
          categoryId: null,
          name: null,
          endTime: null,
          startTime: null,
          code: null,
          barCode: null,
          sort: null
        },
        relateBoolean: false
      }
    },
    mounted () {
    },
    props: {
      value: [String, Boolean],
      showCategoryId: [String],
      relateOrcheck: [String]
    },
    methods: {
//  ----------接口调用---------------
      // 获取搜索类目接口
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
      // 获取已勾选类目接口
      getCategoryProduct (scId, callback) {
        this.$http.get(ocAPI.getCategoryProduct(scId))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 获取在售商品接口（正用商品）
      getOnSell (callback) {
        this.$http.post(...pmAPI.onsell(this.pageParams.pageNum, this.pageParams.pageSize, this.searchParams))
          .then((response) => {
            if (response.data.code === 200) {
              // 分页保存勾选数据
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 提交勾选类目商品
      postCategoryProduct (params, callback) {
        this.$http.post(...ocAPI.postCategoryProduct(params))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 获取类目商品列表
      getCategoryProductList (callback) {
        this.$http.get(ocAPI.getCategoryProductList(this.showCategoryId, this.pageParams.pageNum, this.pageParams.pageSize))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      // 删除关联商品
      deleteCategoryProduct (params, callback) {
        this.$http.post(...ocAPI.delCategoryProduct(params))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
//  ----------数据处理----------------
// -----关联商品------
      // 处理在售接口回调 (已选商品回显)
      handleProList (pageInfo, callback) {
        if (this.relateBoolean) {
          this.getCategoryProduct(this.showCategoryId, (res) => {
            // 首次进入第一页
            if (this.loadPageIndex.length === 0) {
              for (let p of pageInfo.list) {
                for (let s of res.data.spuIds) {
                  if (p.spuId === s) {
                    p._checked = true
                    break
                  }
                }
              }
              this.loadPageIndex.push(1)
              this.tempPro = res.data.spuIds
            }
            // pageChange
            if (typeof callback === 'function') {
              callback(pageInfo)
            }
            // 处理页面信息
            this.pageParams = {
              pageTotal: pageInfo.total,
              pageSize: pageInfo.pageSize,
              pageNum: pageInfo.pageNum === 0 ? 1 : pageInfo.pageNum
            }
            console.log(pageInfo.list)
            this.relateProData = pageInfo.list
          })
        } else {
          for (let p of pageInfo.list) {
            for (let t of this.tempPro) {
              if (p.spuId === t) {
                p._checked = true
                break
              }
            }
          }
          // 处理页面信息
          this.pageParams = {
            pageTotal: pageInfo.total,
            pageSize: pageInfo.pageSize,
            pageNum: pageInfo.pageNum === 0 ? 1 : pageInfo.pageNum
          }
          console.log(pageInfo.list)
          this.relateProData = pageInfo.list
        }
      },
      resetPage () {
        this.pageParams = {
          pageTotal: 0,
          pageSize: 10,
          pageNum: 1
        }
        this.proData = []
        this.tempPro = []
        this.loadPageIndex = []
        this.isNull()
      },
      // 搜索类目处理
      showcategoryList (response) {
        this.listData = response.data.operateCategory
        let a = this.listData
        for (let i in a) {
          if (a[i].secondCategory.length > 0) {
            a[i].value = a[i].name
            this.catelist1.push({
              id: a[i].id,
              value: a[i].value
            })
          }
        }
        this.bulidThreeCate()
      },
      bulidThreeCate () {
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
      firstCheck (val) {
        if (this.catelist1.length !== 0) {
          for (let a of this.catelist1) {
            if (val === a.id) {
              for (let b of this.listData) {
                if (a.id === b.id) {
                  for (let i of b.secondCategory) {
                    i.value = i.name
                  }
                  if (this.cate1 !== '') {
                    this.cate2 = b.secondCategory[0].id
                    this.catelist2 = b.secondCategory
                  }
                }
              }
            }
          }
        }
      },
      secondCheck (val) {
        if (this.catelist2.length !== 0) {
          for (let a of this.catelist2) {
            if (val === a.id) {
              for (let b of this.listData) {
                for (let c of b.secondCategory) {
                  if (a.id === c.id) {
                    for (let i of c.threeCategory) {
                      i.value = i.name
                    }
                    if (this.cate2 !== '') {
                      this.catelist3 = c.threeCategory
                      // todo
                      this.localsearch.categoryId = val
                    }
                  }
                }
              }
            }
          }
        }
      },
      threeCheck (val) {
        for (let i of this.catelist3) {
          if (i.id === val) {
            // todo
            this.localsearch.categoryId = val
          }
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
      },
      // 查询功能
      handleSearch () {
        if (this.localsearch.endTime !== null && this.startTime > this.endTime) {
          this.$Message.warning({content: '请输入正确的上架时间范围'})
        } else {
          this.searchParams = this.localsearch
          this.searchParams.showCategoryId = this.showCategoryId
          console.log(this.searchParams)
          this.loading = true
          this.pageParams.pageNum = 1
          this.getOnSell((res) => {
            this.handleProList(res.data.pageInfo)
          })
        }
      },
      // 上架时间处理
      resetDate (time) {
        let date = time
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
        time = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        return time
      },
      clearStartDate () {
        if (this.localsearch.startTime !== null) {
          this.localsearch.startTime = null
        }
      },
      clearEndDate () {
        if (this.localsearch.endTime !== null) {
          this.localsearch.endTime = null
        }
      },
      // 重置
      isNull () {
        this.cate1 = ''
        this.cate2 = ''
        this.cate3 = ''
        this.catelist1 = []
        this.catelist2 = []
        this.catelist3 = []
        this.endTime = ''
        this.startTime = ''
        this.localsearch = {
          categoryId: null,
          name: null,
          endTime: null,
          startTime: null,
          code: null,
          barCode: null,
          sort: this.searchParams.sort
        }
        this.searchParams = this.localsearch
      },
      handleReset () {
        this.isNull()
        this.pageParams.pageNum = 1
        this.loading = true
        this.searchParams.showCategoryId = this.showCategoryId
        this.getOnSell((res) => {
          this.handleProList(res.data.pageInfo)
        })
      },
      // 父组件刷新页面
      reflashCate () {
        this.$emit('getShowCate')
      },
      // 确认关联
      Proconfirm () {
        console.log(this.tempPro)
        let params = {
          showCategoryId: this.showCategoryId,
          spuIds: this.tempPro
        }
        if (params.spuIds.length > 0) {
          console.log(params)
          this.postCategoryProduct(params, () => {
            this.vModel = false
            this.reflashCate()
            this.$Message.success({content: '关联商品成功'})
          })
        } else {
          this.$Message.warning({content: '请勾选关联商品'})
        }
      },
      // 分页
      pageChange (page) {
        this.pageParams.pageNum = page
        console.log(this.loadPageIndex)
        this.getOnSell((res) => {
          // 分页保存勾选数据
          this.handleProList(res.data.pageInfo, (pageInfo) => {
            if (this.loadPageIndex.indexOf(page) === -1) {
              // 第一次进入N分页
              for (let p of pageInfo.list) {
                for (let t of this.tempPro) {
                  if (p.spuId === t) {
                    p._checked = true
                    break
                  }
                }
              }
              this.loadPageIndex.push(page)
            } else {
              // 第N次进入N分页
              for (let p of pageInfo.list) {
                for (let t of this.tempPro) {
                  if (p.spuId === t) {
                    p._checked = true
                    break
                  }
                }
              }
            }
          })
        })
      },
// -----查看商品列表------
      listPageChange (page) {
        this.pageParams.pageNum = page
        this.getCategoryProductList((res) => {
          this.handleProList(res.data.pageInfo)
        })
        console.log(page)
      },
      deletePd () {
        this.$Modal.confirm({
          title: '提示',
          content: '请确认是否删除所关联商品',
          onOk: () => {
            this.deleteConfirm()
          }
        })
      },
      deleteConfirm () {
        let params = {
          showCategoryId: this.showCategoryId,
          spuIds: this.tempPro
        }
        console.log(params)
        if (params.spuIds.length > 0) {
          this.deleteCategoryProduct(params, () => {
            this.vModel = false
            this.reflashCate()
            this.$Message.success({content: '移除关联商品成功'})
          })
        } else {
          this.$Message.warning({content: '请选择所要移除的关联商品'})
        }
      },
// -----处理方法----------
      // Table单选操作
      handleSelectOne (sel, row) {
        let canPush = true
        for (let t of this.tempPro) {
          if (row.spuId === t) {
            canPush = false
            break
          }
        }
        if (canPush) {
          this.tempPro.push(row.spuId)
        }
      },
      // Table取消单选操作
      cancelSelectOne (sel, row) {
        for (let t in this.tempPro) {
          if (row.spuId === this.tempPro[t]) {
            this.tempPro.splice(t, 1)
          }
        }
      },
      // Table选中所有
      handleSelectAll (sel) {
        console.log(sel)
        for (let s of sel) {
          let canPush = true
          for (let t of this.tempPro) {
            if (s.spuId === t) {
              canPush = false
              break
            }
          }
          if (canPush) {
            this.tempPro.push(s.spuId)
          }
        }
      },
      // Tabel 取消选中操作(this.relateBoolean = true)
      selectTion (sel) {
        if (sel.length === 0) {
          for (let p in this.proData) {
            for (let t in this.tempPro) {
              if (this.proData[p].spuId === this.tempPro[t]) {
                this.tempPro.splice(t, 1)
              }
            }
          }
        }
      }
    },
    computed: {
      vModel: {
        get () {
          if (this.value) {
            return true
          } else {
            return false
          }
        },
        set (val) {
          this.$emit('input', val)
        }
      },
      pageNumber () {
        return this.pageParams.pageNum
      }
    },
    watch: {
      // reset pageParams pageInfo
      vModel: function () {
        if (this.vModel) {
          this.getCategoryList((res) => {
            this.showcategoryList(res)
          })
          if (this.relateOrcheck === '关联商品') {
            console.log(this.showCategoryId)
            this.vModelTitle = '关联商品'
            this.relateBoolean = true
            this.searchParams.showCategoryId = this.showCategoryId
            this.getOnSell((res) => {
              this.handleProList(res.data.pageInfo)
            })
          } else if (this.relateOrcheck === '查看商品') {
            console.log(this.showCategoryId)
            this.vModelTitle = '查看商品列表'
            this.relateBoolean = false
            this.getCategoryProductList((res) => {
              this.handleProList(res.data.pageInfo)
            })
          }
        }
        if (!this.vModel) {
          this.resetPage()
        }
      },
      showCategoryId: function () {
        console.log(this.showCategoryId)
      },
      relateProData: function () {
        this.proData = this.relateProData
      },
      endTime: function () {
        if (this.endTime !== '') {
          this.localsearch.endTime = this.resetDate(this.endTime)
        }
      },
      startTime: function () {
        if (this.startTime !== '') {
          this.localsearch.startTime = this.resetDate(this.startTime)
        }
      }
    }
  }
</script>
