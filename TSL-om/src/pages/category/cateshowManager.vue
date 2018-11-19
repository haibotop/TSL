<style lang="scss" rel="stylesheet/scss" scoped>
  #cateshowManager {
    min-width: 1000px;
  }
  #cateshowManager .add .addbtn {
    margin:10px 0 0 10px;
  }
  #cateshowManager .smnav .smtree{
    margin: 10px;
    border: 1px solid #dddee1;
    padding: 0px 10px;
  }
  #cateshowManager .smtable{
    width: 77%;
    float: right;
    margin: 10px 5px 0 0;
  }
  .my-breadcrumb {
    margin: 0px 10px;
  }
  .phototips{
    color: gray;
    font-size: 5px;
    text-align: center;
    margin-bottom: 20px;
  }
  .upload-img-cover {
    color: #fff;
  }
  .cateToP {
    min-width: 1000px;
  }
</style>
<template>
  <div id="cateshowManager">
    <div class="cateTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>展示类目管理</BreadcrumbItem>
        <BreadcrumbItem>类目管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="smnav">
      <Col span="5">
      <div class="smtree" draggable="true">
        <Tree :data="baseData" @on-select-change="checkTree" ref="smNode"></Tree>
      </div>
      </Col>
    </div>
    <div class="cateShow">
      <div class="add">
        <Button class="addbtn" @click="cateAddorChange" :disabled="!checkCate">新增</Button>
      </div>
      <template v-if="checkCate">
        <div class="smtable">
          <Table :columns="titleContent" :data="cateList"></Table>
        </div>
      </template>
    </div>
    <!-- 新增类目窗口 -->
    <Modal v-model="openModel" :title="titleModel">
      <Form :label-width="140" :rules="ruleValidate" :model="localItem" ref="editForm">
        <FormItem label="类目名称:" prop="newName">
          <Input v-model.trim="localItem.newName" placeholder="请输入"/>
        </FormItem>
        <div v-if="level3">
          <FormItem label="代表性产品图:" >
            <div class="pdPhoto" ref="pdImg">
              <uploadImg1 v-model="uploadArr"></uploadImg1>
            </div>
          </FormItem>
          <div class="phototips">图片上传提示：支持.jpg.jpeg.png</div>
        </div>
        <div v-if="level3">
          <FormItem label="末级类目banner图:">
            <Row>
              <Col span="12">
              <uploadImg1 v-model="uploadBannerArr"></uploadImg1>
              </Col>
            </Row>
          </FormItem>
          <div class="phototips">图片上传提示：支持.jpg.jpeg.png</div>
        </div>
        <FormItem label="排序号:" prop="newNumCode">
          <InputNumber size="small" :min="1" editable v-model="localItem.newNumCode"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="newCates">确认</Button>
        <Button @click="handleFormReset('editForm')">取消</Button>
      </div>
    </Modal>
    <!-- 关联运营类目窗口 -->
    <Modal v-model="cateModel" title="关联运营类目">
      <Tree :data="cateData" show-checkbox multiple ref="cateTree" @on-check-change="checkCategory"></Tree>
      <div slot="footer">
        <Button @click="saveCate">保存</Button>
        <Button @click="cancelCate">取消</Button>
      </div>
    </Modal>
    <!-- 确认删除 -->
    <Modal v-model="deleteConfirm" title="确认删除">
      <div>是否确认删除？</div>
      <div slot="footer">
        <Button @click="confirmDelete">确认</Button>
        <Button @click="deleteConfirm=false">取消</Button>
      </div>
    </Modal>

    <cateToprodcut v-model="vmodel" :showCategoryId="showCategoryId" :relateOrcheck="keyword" v-on:getShowCate="getShowList"></cateToprodcut>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as dpAPI from '../../services/displayManager.es6'
  import uploadImg1 from '../../components/uploadImg1.vue'
  import Loading from '../../components/loading.vue'
  import cateToprodcut from '../../components/cateToprodcut.vue'
  export default {
    name: 'cateshowManager',
    components: {
      uploadImg1,
      Loading,
      cateToprodcut
    },
    data () {
      return {
        // table
        titleContent: [
          {
            title: '类目名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              return h('div', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, params.row.status === 2 ? '停用' : '启用')
            }
          },
          {
            title: '排序号',
            key: 'code',
            align: 'center',
            sortable: true,
            render: (h, params) => {
              let canBlur = true
              if (this.cateList[params.index].sortState) {
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'checkmark-circled',
                      size: 'small'
                    }
                  }),
                  h('Input', {
                    props: {
                      value: params.row.code,
                      size: 'small',
                      autofocus: true
                    },
                    on: {
                      'on-change': (val) => {
                        params.row.tempNumber = val.target.value
                      },
                      'on-enter': (e) => {
                        this.rangeNum(params)
                        console.log(canBlur)
                        console.log(e)
                        if (e.key === 'Enter') {
                          canBlur = false
                        }
                      },
                      'on-blur': (b) => {
                        console.log(b)
                        if (canBlur) {
                          this.rangeNum(params)
                        } else {
                          canBlur = true
                        }
                      }
                    },
                    style: {
                      width: '40px',
                      marginLeft: '5px'
                    }
                  })
                ])
              } else {
                return h('div', {
                  on: {
                    click: () => {
                      this.openRange(params)
                    }
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'edit',
                      size: 'small'
                    }
                  }),
                  h('div', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      display: 'inline-block',
                      marginLeft: '10px'
                    }
                  }, params.row.code)
                ])
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            columns: 'align',
            align: 'center',
            width: 260,
            render: (h, params) => {
              let om = [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      console.log(params.row)
                      // data 无法获取url
                      this.cateAddorChange(params)
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
                      this.deletecate(params)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.turnOnOff(params)
                    }
                  }
                }, params.row.status === 2 ? '启用' : '停用')
              ]
              let netCate = [
                h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        console.log(params.row.type)
                        if (params.row.status === 2) {
                          this.$Message.warning({content: '请启用该展示类目'})
                        } else if (params.row.type === 2) {
                          this.$Message.warning({content: '该展示类目已关联商品'})
                        } else {
                          this.loading = true
                          this.getList(params, (response) => {
                            this.getOldList(params.row.id, () => {
                              console.log(response.data)
                              this.takeCategory(response.data, params)
                            })
                          })
                        }
                      }
                    }
                  }, '关联运营类目')
                ]),
                h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        console.log(params)
                        if (params.row.status === 2) {
                          this.$Message.warning({content: '请启用该展示类目'})
                        } else if (params.row.type === 1) {
                          this.$Message.warning({content: '该展示类目已关联运营类目'})
                        } else {
                          this.showCategoryId = params.row.id
                          this.keyword = '关联商品'
                          this.vmodel = true
                        }
                      }
                    }
                  }, '关联商品'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        console.log(params)
                        if (params.row.status === 2) {
                          this.$Message.warning({content: '请启用该展示类目'})
                        } else if (params.row.type === 1) {
                          this.$Message.warning({content: '该展示类目已关联运营类目'})
                        } else {
                          this.showCategoryId = params.row.id
                          this.keyword = '查看商品'
                          this.vmodel = true
                        }
                      }
                    }
                  }, '查看商品列表')
                ])]
              if (params.row.level === 3) {
                om.push(netCate)
              }
              return h('div', {}, om)
            }
          }
        ],
        cateList: [{}],
        // tree
        baseData: [
          {
            title: '商品分类',
            expand: true,
            children: []
          }
        ],
        cateData: [
          {
            title: '商品分类',
            expand: true,
            children: []
          }
        ],
        cateOldData: [],
        // form
        level3: false,
        formItem: {
          id: '',
          parentId: '',
          name: '',
          level: '',
          code: 1,
          representProductUrl: '',
          bannerUrl: ''
        },
        ruleValidate: {
          newName: [
            {
              type: 'string',
              len: '8',
              required: true,
              message: '类目名称不能为空',
              trigger: 'blur'
            }
          ],
          newNumCode: [
            {
              required: true
            }
          ]
        },
        relaParams: {},
        // 添加
        confirmModel: false,
        openModel: false,
        deleteId: '',
        // model
        localItem: {
          newName: '',
          newNumCode: 1
        },
        cateModel: false,
        // Tree操作显示Table
        checkCate: false,
        //
        deleteConfirm: false,
        cTree: [],
        // img src
        uploadArr: [],
        uploadBannerArr: [],
        vmodel: false,
        //
        showCategoryId: '',
        keyword: ''
      }
    },
    mounted () {
      this.getShowList()
    },
    methods: {
      // isEmpty ?
      isEmpty (val) {
        if (!/^['']*$/.test(val) && !/^[' ']+$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      // ----------接口调用---------
      getShowList (callback) {
        this.$http.get(dpAPI.getShowList())
          .then((response) => {
            if (response.data.code === 200) {
              this.createTree(response.data.category)
              this.isId(response.data)
              if (typeof callback === 'function') {
                callback(response.data)
              }
            }
          })
      },
      addCatelog (params) {
        this.$http.post(...dpAPI.addCatelog(params))
          .then((response) => {
            if (response.data.code === 200) {
              this.openModel = false
              this.getShowList()
              this.$Message.success({content: '操作成功'})
            }
          })
      },
      putCatelog (params) {
        this.$http.put(...dpAPI.putCatelog(params))
          .then((response) => {
            if (response.data.code === 200) {
              this.getShowList()
              this.openModel = false
              this.$Message.success({content: '操作成功'})
              this.localItem.newNumCode = 1
            }
          })
      },
      postCatelog (index) {
        let categoryId = this.cateList[index].id
        this.$http.post(dpAPI.postCatelog(categoryId))
          .then((response) => {
            if (response.data.code === 200) {
              this.getShowList()
              this.$Message.success({content: '操作成功'})
            }
          })
      },
      putStopCatelog (index) {
        console.log(this.cateList)
        let categoryId = this.cateList[index].id
        this.$http.put(dpAPI.putStopCatelog(categoryId))
          .then((response) => {
            if (response.data.code === 200) {
              this.getShowList()
              this.$Message.success({content: '操作成功'})
            }
          })
      },
      getList (params, callback) {
        this.$http.get(dpAPI.getList())
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      getOldList (params, callback) {
        this.$http.get(dpAPI.categoryOldContact(params))
          .then((response) => {
            if (response.data.code === 200) {
              this.cateOldData = response.data.category
              if (typeof callback === 'function') {
                callback()
              }
            }
          })
      },
      categoryContact (callback) {
        this.$http.post(...dpAPI.categoryContact(this.relaParams))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback()
              }
            }
          })
      },
      deleteCatelog () {
        this.$http.delete(dpAPI.deleteCatelog(this.deleteId))
          .then((response) => {
            if (response.data.code === 200) {
              this.getShowList()
              this.deleteConfirm = false
              this.loading = false
              this.$Message.success({content: '操作成功'})
            }
          })
      },
      // ----------生成目录---------
      createTree (params) {
        console.log(this.cTree)
        // 第一层目录
        if (params !== []) {
          for (let i in params) {
            params[i].title = params[i].name
            params[i].sortState = false
            params[i].level = 1
            if (this.cTree !== [] && this.cTree.id === params[i].id) {
              params[i].selected = true
            }
            // 第二层目录
            params[i].children = params[i].secondCategory
            if (params[i].children !== []) {
              let second = params[i].children
              for (let j in second) {
                second[j].title = second[j].name
                second[j].sortState = false
                second[j].level = 2
                if (this.cTree !== [] && this.cTree.id === second[j].id) {
                  params[i].expand = true
                  second[j].selected = true
                }
                // 第三层目录(不定义children，Table显示第三层data)
                if (second[j].threeCategory !== []) {
                  let three = second[j].threeCategory
                  for (let k in three) {
                    three[k].sortState = false
                    three[k].level = 3
                  }
                }
              }
            }
          }
          this.baseData[0].children = params
          this.loading = false
        }
      },
      // 生成cateList(初始加载数据 select显示数据)
      checkTree (val) {
        if (val.length === 0) {
          this.checkCate = false
        } else {
          this.cTree = val[0]
          switch (this.cTree.level) {
            case 1:
              this.cateList = JSON.parse(JSON.stringify(this.cTree.secondCategory))
              break
            case 2:
              this.cateList = JSON.parse(JSON.stringify(this.cTree.threeCategory))
              this.level3 = true
              break
            default:
              this.cTree.level = 0
              this.cateList = JSON.parse(JSON.stringify(this.cTree.children))
          }
          // save id
          this.checkCate = true
        }
      },
      // 刷新cateList
      isId (val) {
        val.level = 0
        if (val.level === this.cTree.level) {
          this.cateList = JSON.parse(JSON.stringify(val.category))
        } else {
          for (let a of val.category) {
            if (this.cTree.id === a.id) {
              this.cateList = JSON.parse(JSON.stringify(a.secondCategory))
            } else {
              for (let b of a.secondCategory) {
                if (this.cTree.id === b.id) {
                  this.cateList = JSON.parse(JSON.stringify(b.threeCategory))
                }
              }
            }
          }
        }
      },
      // -----------操作------------
      // 启用*1 停用*2
      turnOnOff (params) {
        console.log(params)
        let index = params.index
        if (params.row.status === 1) {
          this.cateList[index].status = 2
          this.putStopCatelog(index)
        } else {
          this.cateList[index].status = 1
          this.postCatelog(index)
          console.log(this.formItem)
        }
      },
      // 删除
      deletecate (params) {
        if (params.row.status === 1) {
          // 三级不含子类目 && 启用停用状态
          this.$Message.warning({content: '该类目正在使用无法删除!'})
        } else if (params.row.secondCategory && params.row.secondCategory.length > 0) {
          // 一级类目存在子类目
          this.$Message.warning({content: '请确保该一级类目下没有子类目后重试!'})
        } else if (params.row.threeCategory && params.row.threeCategory.length > 0) {
          // 二级类目存在子类目
          this.$Message.warning({ content: '请确保该二级类目下没有子类目后重试!' })
        } else {
          this.deleteId = params.row.id
          this.deleteConfirm = true
        }
      },
      confirmDelete () {
        this.loading = true
        this.deleteCatelog()
      },
      // 排序
      openRange (params) {
        for (let a of this.cateList) {
          a.sortState = false
        }
        this.cateList[params.index].sortState = true
      },
      rangeNum (params) {
        let cList = this.cateList
        let i = params.index
        if (!params.row.tempNumber) {
          cList[i].sortState = false
        } else if (!/^\d+$/.test(params.row.tempNumber)) {
          this.$Message.warning({content: '排序号应为正整数'})
        } else if (parseInt(params.row.tempNumber) > 100) {
          this.$Message.warning({content: '超出排序范围'})
        } else if (parseInt(params.row.tempNumber) === 0) {
          this.$Message.warning({content: '排序号不可为零'})
        } else {
          cList[i].code = params.row.tempNumber
          let myParams = {
            id: cList[i].id,
            parentId: cList[i].parentId,
            level: cList[i].level,
            name: cList[i].name,
            code: cList[i].code
          }
          console.log(myParams)
          this.putCatelog(myParams)
          cList[i].sortState = false
        }
      },
      // ------------添加类目----------
      // 触发添加/修改类目信息
      cateAddorChange (params) {
        if (params.row) {
          this.formItem = params.row
          this.localItem.newNumCode = this.cateList[params.index].code
          this.localItem.newName = this.cateList[params.index].name
          if (params.row.bannerUrl !== null) {
            this.uploadBannerArr.push({
              url: params.row.bannerUrl,
              status: 'finished'
            })
          }
          if (params.row.representProductUrl !== null) {
            this.uploadArr.push({
              url: params.row.representProductUrl,
              status: 'finished'
            })
          }
          if (params.row.level === 3) {
            this.level3 = true
          }
        }
        console.log(this.cateList)
        this.openModel = true
      },
      // confirm
      newCates () {
        if (this.localItem.newName.length === 0) {
          this.$Message.warning({content: '新增类目名称不可为空'})
        } else if (this.localItem.newNumCode > 100) {
          this.$Message.warning({content: '超出排序范围'})
        } else if (this.isEmpty(this.formItem.id)) {
          this.addCate()
        } else {
          this.editCate()
        }
      },
      addCate () {
        console.log(this.cTree)
        let params = {}
        params.name = this.localItem.newName
        params.code = this.localItem.newNumCode
        if (this.uploadArr[0]) {
          params.representProductUrl = this.uploadArr[0].url
        }
        if (this.uploadBannerArr[0]) {
          params.bannerUrl = this.uploadBannerArr[0].url
        }
        if (!this.cTree.id) {
          params.level = 1
        } else {
          params.parentId = this.cTree.id
          params.level = parseInt(this.cTree.level) + 1
        }
        this.loading = true
        this.addCatelog(params)
      },
      editCate () {
        let params = {
          id: this.formItem.id,
          name: this.localItem.newName,
          code: this.localItem.newNumCode,
          level: this.formItem.level
        }
        if (this.uploadArr[0]) {
          params.representProductUrl = this.uploadArr[0].url
        }
        if (this.uploadBannerArr[0]) {
          params.bannerUrl = this.uploadBannerArr[0].url
        }
        if (this.formItem.parentId) {
          params.parentId = this.formItem.parentId
        }
        this.loading = true
        this.putCatelog(params)
      },
      handleAdd () {
        this.$Message.warning({content: '暂不可添加图片'})
      },
      // -------------关联运营类目--------------
      // 关联运营类目按钮，获取运营类目数据
      takeCategory (val, params) {
        let cData = val.operateCategory
        // 停用运营类目移除
        for (let i in cData) {
          if (cData[i].status === 2) {
            console.log('level-one', cData[i].name)
            cData.splice(i, 1)
          }
          for (let s in cData[i].secondCategory) {
            let dataSecond = cData[i].secondCategory
            if (dataSecond[s].status === 2) {
              console.log('level-two', cData[i].name + '>' + dataSecond[s].name)
              dataSecond.splice(s, 1)
            }
            console.log(cData[i].secondCategory)
            console.log(cData[i].secondCategory[s])
            if (cData[i].secondCategory[s]) {
              for (let t in cData[i].secondCategory[s].threeCategory) {
                let dataThird = cData[i].secondCategory[s].threeCategory
                if (dataThird[t].status === 2) {
                  console.log('level-three', cData[i].name + '>' + dataSecond[s].name + '>' + dataThird[t].name)
                  dataThird.splice(t, 1)
                }
              }
            }
          }
        }
        // 规范显示title => name
        for (let i of cData) {
          i.title = i.name
          i.children = i.secondCategory
          for (let j of i.children) {
            j.children = j.threeCategory
            j.title = j.name
            for (let k of j.children) {
              k.title = k.name
            }
          }
        }
        // 勾选类目回显
        if (this.cateOldData) {
          for (let oldId of this.cateOldData) {
            for (let i of cData) {
              if (oldId.categoryId === i.id) {
                i.checked = true
              }
              for (let j of i.children) {
                if (oldId.categoryId === j.id) {
                  j.checked = true
                }
                for (let k of j.children) {
                  if (oldId.categoryId === k.id) {
                    k.checked = true
                  }
                }
              }
            }
          }
        }
        this.cateData = [
          {
            title: '商品分类',
            expand: true,
            children: cData
          }
        ]
        this.relaParams.showCategoryId = params.row.id
        this.cateModel = true
        this.loading = false
      },
      // onChange操作check 勾选 id
      checkCategory (val) {
        val.checked = true
        let cate1 = []
        let cate2 = []
        let cate3 = []
        let cate = []
        let catetemp = []
        for (let i of val) {
          if (i.level === 1) {
            i.children = []
            cate1.push(i)
          }
        }
        for (let j of val) {
          if (j.level === 2) {
            j.children = []
            cate2.push(j)
          }
        }
        for (let k of val) {
          if (k.level === 3) {
            cate3.push(k)
          }
        }
        for (let i of cate3) {
          for (let j of cate2) {
            if (i.parentId === j.id) {
              j.children.push(i)
            }
          }
        }
        for (let i of cate2) {
          for (let j of cate1) {
            if (i.parentId === j.id) {
              j.children.push(i)
            }
          }
        }
        for (let i of cate1) {
          if (i.children.length === 0) {
            cate.push(i)
          }
        }
        for (let i of cate2) {
          if (i.children.length === 0) {
            cate.push(i)
          }
        }
        for (let i of cate3) {
          cate.push(i)
        }
        for (let i of cate) {
          catetemp.push({
            categoryId: i.id,
            name: i.name,
            level: i.level
          })
        }
        console.log(cate)
        this.relaParams.categoryTemp = this.relaParams.category
        this.relaParams.category = catetemp
      },
      saveCate () {
        console.log(this.relaParams)
        let rParams = this.relaParams.category
        if (!rParams || rParams.length === 0) {
          this.$Message.warning({content: '请勾选关联类目'})
        } else {
          this.categoryContact(() => {
            this.getShowList((val) => {
              this.cateModel = false
              this.$Message.success({content: '操作成功'})
            })
          })
        }
      },
      cancelCate () {
        this.relaParams.category = this.relaParams.categoryTemp
        this.cateModel = false
      },
      handleView () {},
      handleRemove () {},
      // formReset
      handleFormReset (name) {
        this.$refs[name].resetFields()
        if (this.cTree.level !== 2) {
          this.level3 = false
        }
        this.openModel = false
      }
    },
    computed: {
      titleModel: function () {
        if (this.formItem.id.length === 0) {
          return '新增类目'
        } else {
          return '编辑类目'
        }
      }
    },
    watch: {
      openModel: function () {
        if (this.openModel === false) {
          this.formItem = {
            id: '',
            name: '',
            code: 1,
            parentId: '',
            level: '',
            representProductUrl: '',
            bannerUrl: '',
            sortState: false
          }
          this.localItem = {
            newName: '',
            newNumCode: 1
          }
          this.uploadArr = []
          this.uploadBannerArr = []
        }
      },
      cateList: function () {
        if (this.cTree.level === 2) {
          this.level3 = true
        } else {
          this.level3 = false
        }
      }
    }
  }
</script>
