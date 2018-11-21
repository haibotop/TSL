<style lang="scss" rel="stylesheet/scss" scoped>
.margin-10 {
  margin: 10px;
}
.search-btns {
  // text-align: center;
}
.btn-w {
  width: 80px;
}
.search-div {
  margin: 10px;
}
.w-25p {
  width: 25%;
}
.w-45p {
  width: 45%;
}
.w-100 {
  width: 100px;
}
.exeBtnDiv {
  margin: 0px 10px 6px 10px;
}
.my-table {
  margin: 10px;
  overflow-x: auto;
}
.margin-page {
  margin:10px;
  text-align: center;
}
.open-modal {
  position: absolute;
  z-index: 999;
}
</style>
<template>
  <div>
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>商品管理</BreadcrumbItem>
      <BreadcrumbItem>草稿箱</BreadcrumbItem>
    </Breadcrumb>
    <div class="search-div">
      <Form inline :label-width="82" ref="draftSearchForm" :model="search_c">
        <FormItem class="w-25p" label="商品名称：" prop="name">
          <Input v-model="search_c.name"></Input>
        </FormItem>
        <FormItem class="w-25p" label="设计编码：" prop="designCode">
          <Input v-model="search_c.designCode"></Input>
        </FormItem>
        <FormItem class="w-45p" label="所属类目：">
          <FormItem prop="firstCategory">
            <Select v-model="search_c.firstCategory" @on-change="changeSele1" class="w-100">
              <Option v-for="item in seleList1" :value="item.id" :key="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="secondCategory">
            <Select v-model="search_c.secondCategory" @on-change="changeSele2" class="w-100">
              <Option v-for="item in seleList2" :value="item.id" :key="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="thirdCategory">
            <Select v-model="search_c.thirdCategory" @on-change="changeSele3" class="w-100">
              <Option v-for="item in seleList3" :value="item.id" :key="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
        </FormItem>
        <div class="search-btns">
          <Button type="primary" @click="draftSearch" class="btn-w">查询</Button>
          <Button type="primary" @click="draftReset" class="btn-w">重置</Button>
        </div>
      </Form>
    </div>
    <div class="exeBtnDiv">
      <Button class="btn-w" @click="exportDraftData">下载模板</Button>
      <Button :disabled="importBtnStatus" class="btn-w" @click="importDraftData">导入</Button>
      <Button :disabled="delBtnStatus" class="btn-w" @click="deleteRows">删除</Button>
      <input v-show="false" ref="importDraftExcel" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    </div>
    <div class="my-table">
      <Table :columns="column1" :data="data1" :width="1100" stripe @on-selection-change="selectChange"></Table>
    </div>
    <div>
      <Modal v-model="modalStatus" width="960" class="open-modal" :styles="{'margin-bottom': '100px'}">
        <draft-edit ref="drbxeditor" :productInfo="editRow" @changeBtnTxt="changeBtnTxt" @deleteDraft="deleteDraftFromTab"></draft-edit>
        <div slot="footer"><Button type="primary" @click="gotoNext">{{btnTxt}}</Button></div>
      </Modal>
    </div>
    
    <Page :total="page1.total" :current="page1.pageNum" :page-size="page1.pageSize" @on-change="pageChange" show-total class="margin-page" v-if="data1.length>0"></Page>
    <Modal v-model="ProsConfirmFlag" width="960" title="产品信息确认">
      <Table :columns="ProsConfirmColumns" :data="ProsConfirmData"></Table>
      <div slot="footer">
        <Button type="primary" @click="postImportData">确定</Button>
        <Button type="ghost" @click="ProsConfirmFlag = false">取消</Button>
      </div>
    </Modal>
    <Loading :isload="loading"></Loading>
    <iframe style="display:none;" ref="excelTem" id="excelTem" name="excelTem"></iframe>
  </div>
</template>
<script type="text/ecmascript-6">
import Loading from '../../../components/loading'
import * as opAPI from '../../../services/operationCate.es6'
import * as pmAPI from '../../../services/productManager.es6'
import * as config from '../../../services/config.es6'
import draftEdit from './draftEdit'
import * as tool from '../../../services/tool.es6'
// import * as config from '../../../services/config.es6'
export default {
  name: 'draftBox',
  components: { Loading, draftEdit },
  data: function () {
    return {
      loading: false,
      modalStatus: false,
      search_c: {
        name: '',
        designCode: '',
        firstCategory: '',
        secondCategory: '',
        thirdCategory: ''
      },
      seleList1: [],
      seleList2: [],
      seleList3: [],
      importBtnStatus: false,
      delBtnStatus: true,
      column1: [
        {
          type: 'selection',
          width: 80,
          align: 'center'
        },
        // {
        //   title: '商品编码',
        //   key: 'productCode',
        //   width: 170,
        //   align: 'center'
        // },
        {
          title: '设计编码',
          key: 'designCode',
          // width: 170,
          align: 'center'
        },
        {
          title: '所属类目',
          // width: 225,
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.firstCategoryName + '>' + params.row.secondCategoryName + '>' + params.row.thirdCategoryName)
          }
        },
        {
          title: '商品名称',
          key: 'name',
          // width: 225,
          align: 'center'
        },
        {
          title: '操作',
          // width: 220,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {width: '64px'},
                on: {
                  click: (e) => {
                    this.checkIfExist(params, e.currentTarget)
                  }
                }
              }, '编辑发布'),
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px',
                  width: '64px'
                },
                on: {
                  click: () => {
                    this.deleteRow(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data1: [
        // {desc: 'aaaaa', keyword: 'aaaa', placeOfOrigin: 'aaa', advert: 'aa', categoryId: '114781998667571200', productCode: '11234234234234234', designCode: '23123123', firstCategory: 'TSL', secondCategory: '白银', thirdCategory: '手环', name: 'testa'},
        // {desc: 'bbbbb', keyword: 'bbbb', placeOfOrigin: 'bbb', advert: 'bb', categoryId: '117751655443771392', productCode: '11545454545467566', designCode: '56356', firstCategory: '网络专款', secondCategory: '黄金', thirdCategory: '耳环', name: 'testb'},
        // {desc: 'ccccc', keyword: 'cccc', placeOfOrigin: 'ccc', advert: 'cc', categoryId: '115967280731480064', productCode: '11232232875878678', designCode: '456352', firstCategory: '手镯', secondCategory: '开口', thirdCategory: '青铜', name: 'testc'},
        // {desc: 'sssss', keyword: 'ssss', placeOfOrigin: 'ddd', advert: 'dd', categoryId: '114781998667571200', productCode: '12232467864345523', designCode: '9879567857', firstCategory: '手镯', secondCategory: '开口', thirdCategory: '玻璃', name: 'testd'}
      ],
      page1: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      selectedData: [],
      editRow: {},
      ProsLoading: false,
      ProsConfirmFlag: false,
      ProsConfirmData: [],
      ProsConfirmColumns: [
        // {
        //   title: '序号',
        //   render: (h, params) => {
        //     let num = params.index + 1
        //     return h('span', {}, num)
        //   }
        // },
        {key: 'firstCategory', title: '一级类目名称'},
        {key: 'secondCategory', title: '二级类目名称'},
        {key: 'thirdCategory', title: '三级类目名称'},
        {key: 'name', title: '商品名称'},
        {key: 'designCode', title: '设计编码'},
        {key: 'keyWordd', title: '商品关键词'},
        {key: 'introduction', title: '商品简介'},
        {key: 'ad', title: '商品广告词'},
        {key: 'originPlace', title: '产地'}
      ],
      btnTxt: '下一步',
      delId: null
    }
  },
  methods: {
    // 查询列表
    draftSearch: function () {
      this.selectedData = []
      this.delBtnStatus = true
      const self = this
      let categoryId = ''
      if (self.search_c.thirdCategory !== '') {
        categoryId = self.search_c.thirdCategory
      } else if (self.search_c.secondCategory !== '') {
        categoryId = self.search_c.secondCategory
      }
      const params = {
        'name': self.search_c.name,
        'designCode': self.search_c.designCode,
        'categoryId': categoryId
      }
      self.loading = true
      this.$http.post(...pmAPI.productDrafts(params, self.page1.pageNum, self.page1.pageSize))
        .then((response) => {
          self.loading = false
          if (response.data.code === 200) {
            self.data1 = response.data.productDrafts.list
            self.page1.total = response.data.productDrafts.total
          }
        }).catch((res) => {
          self.loading = false
        })
    },
    draftReset: function () {
      this.$refs['draftSearchForm'].resetFields()
    },
    // 一级类目选择
    changeSele1: function (val) {
      for (let i in this.seleList1) {
        if (this.seleList1[i].id === val) {
          this.seleList2 = this.seleList1[i].secondCategory
          this.search_c.secondCategory = this.seleList2[0].id
          break
        }
      }
    },
    // 二级类目选择
    changeSele2: function (val) {
      this.search_c.thirdCategory = ''
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
    pageChange: function (page) {
      this.page1.pageNum = page
      this.draftSearch()
    },
    // 获取类目分类
    getCateList: function () {
      this.$http.get(opAPI.getCate())
      .then((response) => {
        if (response.data.code === 200) {
          // const res = JSON.parse(response.request.response).operateCategory
          let res = response.data.operateCategory
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
        }
      })
    },
    selectChange: function (sel) {
      if (sel.length > 0) {
        this.delBtnStatus = false
      } else {
        this.delBtnStatus = true
      }
      this.selectedData = sel
    },
    checkIfExist: function (params, btn) {
      let exist = false
      for (let i = 0; i < this.seleList1.length; i++) {
        if (params.row.firstCategoryName === this.seleList1[i].name && params.row.firstCategoryId === this.seleList1[i].id) {
          for (let j = 0; j < this.seleList1[i].secondCategory.length; j++) {
            if (params.row.secondCategoryName === this.seleList1[i].secondCategory[j].name && params.row.secondCategoryId === this.seleList1[i].secondCategory[j].id) {
              for (let k = 0; k < this.seleList1[i].secondCategory[j].threeCategory.length; k++) {
                if (params.row.thirdCategoryName === this.seleList1[i].secondCategory[j].threeCategory[k].name && params.row.thirdCategoryId === this.seleList1[i].secondCategory[j].threeCategory[k].id) {
                  exist = true
                  break
                }
              }
              break
            }
          }
          break
        }
      }
      if (exist) {
        this.showModal(params)
      } else {
        btn.setAttribute('disabled', true)
        this.$Modal.warning({
          title: '注意',
          content: '该类目不存在或已停用'
        })
      }
    },
    // 打开商品编辑窗口
    showModal: function (params) {
      const self = this
      this.$http.get(pmAPI.getProductDraft(params.row.id)).then((response) => {
        if (response.data.code === 200) {
          this.$refs.drbxeditor.$refs.baseInfoForm.resetFields()
          this.$refs.drbxeditor.$refs.publicParamsForm.resetFields()
          this.$refs.drbxeditor.initStep3()
          this.$refs.drbxeditor.step = 0
          this.delay(function () {
            self.$refs.drbxeditor.getCommonAttr()
            self.$refs.drbxeditor.getSkuParams()
            self.$refs.drbxeditor.getGoldPrices()
            self.$refs.drbxeditor.$refs.df_ed_ueditor.editor.setContent('')
          }, 200)
          this.editRow = response.data.vo
          this.delId = params.row.id
          this.modalStatus = true
          this.btnTxt = '下一步'
        }
      })
    },
    changeBtnTxt: function (txt) {
      this.btnTxt = txt
    },
    gotoNext: function () {
      const step = this.$refs.drbxeditor.step
      if (step === 0) {
        this.$refs.drbxeditor.creatSpu()
      } else if (step === 1) {
        this.btnTxt = '保存'
        this.$refs.drbxeditor.getRichText()
      } else {
        this.$refs.drbxeditor.onSave()
      }
    },
    // ----------导入导入
    exportDraftData: function () {
      // 下载模板
      const params = {
        templateName: '批量发布商品模板.xlsx',
        fileName: '批量发布商品模板'
      }
      let formhtml = `<form id="exceTem" target="excelTem" method="get" action="/${config.SERVER_PATH}${pmAPI.excelTem()}">`
      for (let key in params) {
        formhtml += `<input type="hidden" name="${key}" value="${params[key]}" />`
      }
      formhtml += '</form>'
      this.$refs.excelTem.contentWindow.document.getElementsByTagName('body')[0].innerHTML = formhtml
      const formelm = this.$refs.excelTem.contentWindow.document.getElementById('exceTem')
      formelm.submit()
      formelm.parentNode.removeChild(formelm)
    },
    importDraftData: function () {
      this.$refs.importDraftExcel.click()
    },
    importfxx: function (obj) {
      this.ProsLoading = true
      tool.importfxx(obj, (data) => {
        let data_ = []
        for (let i of data) {
          data_.push({
            'firstCategory': i['一级类目名称'],
            'secondCategory': i['二级类目名称'],
            'thirdCategory': i['三级类目名称'],
            'name': i['商品名称'],
            'designCode': i['设计编码'],
            'keyWordd': i['商品关键词'],
            'introduction': i['商品简介'],
            'ad': i['商品广告词'],
            'originPlace': i['产地']
          })
        }
        this.ProsConfirmData = data_
        this.ProsConfirmFlag = true
        this.ProsLoading = false
      })
    },
    postImportData: function () {
      this.$http.post(...pmAPI.batchImport(this.ProsConfirmData)).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('发布成功')
          this.ProsConfirmFlag = false
          this.draftReset()
          this.page1.pageNum = 1
          this.draftSearch()
        } else {
          this.$Message.success('发布失败')
          this.ProsConfirmFlag = false
        }
      })
    },
    // 删除草稿商品
    deleteRows: function () {
      if (this.selectedData.length > 0) {
        let idsarr = []
        this.selectedData.forEach(function (n, i) {
          idsarr.push(n.id)
        })
        this.$Modal.confirm({
          title: '删除',
          content: '是否删除已选择商品？',
          onOk: () => {
            this.deleteDraft(idsarr, (response) => {
              if (response.data.code === 200) {
                this.$Message.success('删除成功')
                this.draftSearch()
              } else {
                this.$Message.error('删除失败')
              }
            })
          }
        })
      }
    },
    deleteRow: function (id) {
      this.$Modal.confirm({
        title: '删除',
        content: '是否删除此商品？',
        onOk: () => {
          this.deleteDraft([id], (response) => {
            if (response.data.code === 200) {
              this.$Message.success('删除成功')
              this.draftSearch()
            } else {
              this.$Message.error('删除失败')
            }
          })
        }
      })
    },
    deleteDraft: function (ids, fun) {
      this.$http.post(...pmAPI.productDraft(ids)).then(res => {
        fun(res)
      })
    },
    deleteDraftFromTab: function () {
      this.deleteDraft([this.delId], (response) => {
        if (response.data.code === 200) {
          // window.location.reload()
          this.modalStatus = false
          this.draftSearch()
        } else {
          console.log('删除失败')
        }
      })
    },
    delay: function (callback, time) {
      setTimeout(() => {
        callback()
      }, time)
    },
    handlefileclear: function (e) {
      e.target.value = ''
    }
  },
  mounted: function () {
    this.getCateList()
    this.draftSearch()
    this.$refs.importDraftExcel.addEventListener('click', this.handlefileclear, false)
  },
  beforeDestroy: function () {
    this.$refs.importDraftExcel.removeEventListener('click', this.handlefileclear, false)
  }
}
</script>
