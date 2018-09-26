<style lang="scss" rel="stylesheet/scss" scoped>
#cateshowManager {
  min-width: 1000px;
}
#cateshowManager .add .addbtn {
  margin-left:20px;
  width:70px;
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
    <div class="cateShow" v-if="checkCate">
      <div class="add">
        <Button type="primary" class="addbtn" @click="cateAddorChange">添加</Button>
      </div>
      <template>
        <div class="smtable">
          <Table :columns="titleContent" :data="cateList"></Table>
        </div>
      </template>
    </div>
    <!-- 新增类目窗口 -->
    <Modal v-model="openModel" :title="titleModel">
      <Form :label-width="140" :rules="ruleValidate" :model="formItem">
        <FormItem label="类目名称:" prop="name">
          <Input v-model.trim="formItem.name" placeholder="请输入"/>
        </FormItem>
        <FormItem label="代表性产品图:">
          <Row>
            <Col span="12">
            <Upload action="" multiple>
              <Button type="dashed" long icon="plus-round">新增图片</Button>
            </Upload>
            </Col>
          </Row>
        </FormItem>
        <div class="phototips">图片上传提示：大小不超过200k，支持.jpg.jpeg.png，建议尺寸：待前端定</div>
        <FormItem label="末级类目banner图:">
          <Row>
            <Col span="12">
            <Upload action="" multiple :on-success="successload">
              <Button type="dashed" long icon="plus-round">新增图片</Button>
            </Upload>
            </Col>
          </Row>
        </FormItem>
        <div class="phototips">图片上传提示：大小不超过200k，支持.jpg.jpeg.png，建议尺寸：待前端定</div>
        <FormItem label="排序号:" prop="code">
          <InputNumber size="small" :min="1" editable v-model="newNumCode"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="newCates">确认</Button>
        <Button @click="openModel=false">取消</Button>
      </div>
    </Modal>
    <!-- 关联运营类目窗口 -->
    <Modal v-model="cateModel" title="关联运营类目">
      <Tree :data="cateData" show-checkbox multiple ref="cateTree" @on-check-change="checkCategory"></Tree>
      <div slot="footer">
        <Button @click="saveCate">保存</Button>
        <Button @click="cateModel=false">取消</Button>
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
  </div>
</template>
<script type="text/ecmascript-6">
import * as dpAPI from '../../../services/displayManager.es6'
export default {
  name: 'cateshowManager',
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
                      params.row.tempNumber = val.srcElement.value
                    },
                    'on-enter': () => {
                      this.rangeNum(params)
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
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    console.log(params.row)
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
                    this.getList(params, (response) => {
                      this.getOldList(params.row.id, () => {
                        this.takeCategory(response.data, params)
                      })
                    })
                  }
                }
              }, '关联运营类目'),
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
            ])
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
        name: [
          {
            type: 'string',
            len: '8',
            required: true,
            message: '类目名称不能为空',
            trigger: 'blur'
          }
        ],
        code: [
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
      cateModel: false,
      newNumCode: 1,
      //
      checkCate: false,
      //
      deleteConfirm: false,
      cTree: []
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
            this.baseData[0].children = response.data.category
            this.createTree()
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
            this.getShowList((val) => {
              this.isId(val)
            })
            this.$Message.success({content: '操作成功'})
          }
        })
    },
    putCatelog (params) {
      this.$http.put(...dpAPI.putCatelog(params))
        .then((response) => {
          if (response.data.code === 200) {
            this.getShowList((val) => {
              this.isId(val)
            })
            this.openModel = false
            this.$Message.success({content: '操作成功'})
            this.newNumCode = 1
          }
        })
    },
    postCatelog (index) {
      let categoryId = this.cateList[index].id
      this.$http.post(dpAPI.postCatelog(categoryId))
        .then((response) => {
          if (response.data.code === 200) {
            this.getShowList((val) => {
              this.isId(val)
            })
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
            this.getShowList((val) => {
              this.isId(val)
            })
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
            this.cateOldData = response.data.categoryIds
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
            this.getShowList((val) => {
              this.isId(val)
            })
            this.deleteConfirm = false
            this.$Message.success({content: '操作成功'})
          }
        })
    },
    // ----------生成目录---------
    createTree () {
      if (this.baseData[0].children !== []) {
        for (let i in this.baseData[0].children) {
          // 创建第一层目录
          this.baseData[0].children[i].title = this.baseData[0].children[i].name
          this.baseData[0].children[i].sortState = false
          if (this.baseData[0].children[i].secondCategory !== []) {
            // 生成第二层目录
            let a = this.baseData[0].children[i].secondCategory
            this.baseData[0].children[i].children = a
            for (let j in this.baseData[0].children[i].children) {
              a[j].title = a[j].name
              a[j].sortState = false
              for (let k in a[j].threeCategory) {
                a[j].threeCategory[k].sortState = false
              }
            }
          }
        }
      }
    },
    // 生成cateList
    checkTree () {
      if (this.$refs.smNode.getSelectedNodes().length === 0) {
        this.checkCate = false
      } else {
        let smNode = this.$refs.smNode.getSelectedNodes()[0]
        smNode.sortState = false
        this.cTree = smNode
        switch (smNode.level) {
          case 1:
            this.cateList = JSON.parse(JSON.stringify(smNode.secondCategory))
            break
          case 2:
            this.cateList = JSON.parse(JSON.stringify(smNode.threeCategory))
            break
          default:
            this.cateList = JSON.parse(JSON.stringify(smNode.children))
            smNode.level = 0
        }
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
        this.$Message.warning({content: '排序值应为数字'})
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
        this.newNumCode = this.cateList[params.index].code
      }
      console.log(params)
      this.openModel = true
    },
      // confirm
    newCates () {
      if (this.formItem.name.length === 0) {
        this.$Message.warning({content: '新增类目名称不可为空'})
      } else if (this.isEmpty(this.formItem.id)) {
        this.addCate()
      } else {
        this.editCate()
      }
    },
    addCate () {
      console.log(this.cTree)
      let params = {}
      params.name = this.formItem.name
      params.code = this.formItem.code
      if (!this.cTree.id) {
        params.level = 1
      } else {
        params.parentId = this.cTree.id
        params.level = parseInt(this.cTree.level) + 1
      }
      this.addCatelog(params)
    },
    editCate () {
      let params = {
        id: this.formItem.id,
        name: this.formItem.name,
        code: this.newNumCode,
        level: this.formItem.level
      }
      if (this.formItem.parentId) {
        params.parentId = this.formItem.parentId
      }
      this.putCatelog(params)
    },
    handleAdd () {
      this.$Message.warning({content: '暂不可添加图片'})
    },
      // 关联运营类目
    takeCategory (val, params) {
      this.cateData[0].children = val.operateCategory
      this.cateData[0].level = 0
      let cData = this.cateData[0].children
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
      console.log(this.$refs.cateTree.$children[0])
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
      this.relaParams.showCategoryId = params.row.id
      this.cateModel = true
//      console.log(this.$refs.cateTree.$children[0].$children[2])
//      if (this.$refs.cateTree.$children[0].$children[2]) {
//        this.$refs.cateTree.$children[0].$children[2].handleCheck()
//      }
    },
    checkCategory (val) {
      console.log(val)
      let cate1 = []
      let cate2 = []
      let cate3 = []
      let cate = []
      let cateId = []
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
        cateId.push({
          categoryId: i.id
        })
      }
      this.relaParams.categoryIds = cateId
    },
    saveCate () {
      console.log(this.relaParams)
      let rParams = this.relaParams.categoryIds
      if (!rParams || rParams.length === 0) {
        this.$Message.warning({content: '请勾选关联类目'})
      } else {
        this.categoryContact(() => {
          // this.HandlecheckFalse()
          this.cateModel = false
          this.$Message.success({content: '操作成功'})
        })
      }
    },
    HandlecheckFalse () {
      for (let a of this.cateData[0].children) {
        a.checked = false
        for (let b of a.children) {
          b.checked = false
          for (let c of b.children) {
            c.checked = false
          }
        }
      }
    },
    // upload
    successload (file) {
      console.log(file)
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
          parentId: '',
          name: '',
          level: '',
          code: 1,
          representProductUrl: '',
          bannerUrl: '',
          sortState: false
        }
      }
    }
  }
}
</script>
