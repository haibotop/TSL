<style scoped>
  .my-breadcrumb {
    margin: 0px 10px;
  }
  .my-tree {
    margin: 10px;
    border: 1px solid #dddee1;
    padding: 0px 10px;
  }
  .color-bar {
    margin: 10px;
    line-height: 32px;
  }
  .color-checker>span.ivu-checkbox {
    float: right;
    margin-left: 10px;
  }
  .my-table {
    margin: 10px 10px 10px 0px;
  }
  .sku-Modal .my-label {
    width: 10%;
    line-height: 32px;
    display: inline-block;
    margin-left: 5%;
  }
  .sku-Modal .my-input {
    width: 20%;
    margin-bottom: 10px;
  }
  .sku-Model .skuValues {
    border: 1px solid #CCC;
  }
  .sku-Modal .skuValues>div {
    height: 20px;
    background-color: #CCC;
    text-indent: 5%;
    font-size: 14px;
    color: #FFF;
  }
  .sku-Modal .add-btn {
    display: block;
    margin: 10px 0px 10px 5%;
  }
  .color-Modal .my-input {
    width: 100px;
  }
  .add-color-btn {
    margin: 10px 0px;
  }
</style>
<template>
  <div id="cateSKUset">
    <Breadcrumb class="my-breadcrumb">
      <BreadcrumbItem>运营类目管理</BreadcrumbItem>
      <BreadcrumbItem>类目SKU属性设置</BreadcrumbItem>
    </Breadcrumb>
    <Row>
      <Col span="4">
      <Tree :data="cateData" class="my-tree" @on-select-change="selectTree"></Tree>
      </Col>
      <Col span="20" v-if="currCate.length !== 0">
      <div class="color-bar">
        <Checkbox v-model="colorObj.isShow" :true-value="1" :false-value="0" class="color-checker" @on-change="showColor">是否支持颜色属性</Checkbox>
        <a href="javascript:" @click="editing3 = true">颜色设置</a>
      </div>
      <Button type="primary" @click="editSku">添加自定义属性</Button>
      <Table :columns="column1" :data="data1" class="my-table"></Table>
      </Col>
    </Row>

    <Modal v-model="editing2" :title="modalTitle" width="700" class="sku-Modal">
      <Form :model="editObj" :rules="rules1" ref="form1">
        <FormItem label="属性名称：" prop="name" :label-width="100">
          <Input v-model.trim="editObj.name"></Input>
        </FormItem>
      </Form>
      <div class="skuValues">
        <div>编辑参数值</div>
        <Button type="primary" size="small" class="add-btn" @click="addValue">添加</Button>
        <Table :columns="column2" :data="editObj.values" height="200" class="skuValues-table"></Table>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading2" @click="editOk">确定</Button>
        <Button @click="editCancel">取消</Button>
      </div>
    </Modal>

    <Modal v-model="editing3" title="颜色管理" width="700" class="color-Modal">
      <label for="color">颜色：</label><Input size="small" class="my-input" v-model="colorName_"></Input>
      <Button type="primary" size="small" @click="searchColor">查询</Button>
      <Button type="primary" size="small" @click="cancelSearch">重置</Button>
      <div><Button type="primary" size="small" class="add-color-btn" @click="addColor">添加颜色</Button></div>
      <Table height="300" :columns="column3" :data="colorObj.values"></Table>
      <div slot="footer">
        <Button type="primary" @click="saveColor" :loading="loading3">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as cateAPI from '../../services/operationCate.es6'
  let last
  export default {
    name: 'cateSKUset',
    data () {
      return {
        cateData: [],
        currCate: [],
        // sku属性表
        column1: [
          {title: '属性名称', key: 'name'},
          {
            title: '属性值',
            render: (h, parmas) => {
              let arr = []
              for (let i in parmas.row.values) {
                arr.push(parmas.row.values[i].name)
              }
              return arr.toString()
            }
          },
          {
            title: '所属类目',
            render: (h, params) => {
              for (let i of this.cateData) {
                for (let j of i.children) {
                  for (let k of j.children) {
                    if (k.id === params.row.productCategoryId) {
                      return k.title
                    }
                  }
                }
              }
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', {}, [
                h('Button', {
                  props: {type: 'primary', size: 'small'},
                  style: {'margin-right': '10px'},
                  on: {click: () => {
                    this.editSku(params)
                  }}
                }, '修改'),
                h('Button', {
                  props: {type: 'error', size: 'small'},
                  on: {click: () => {
                    let config = {
                      title: '删除属性',
                      content: '确认要删除吗？',
                      onOk: () => {
                        this.deleteAttr(params.row.id, (response) => {
                          if (response.data.code === 200) {
                            this.$Message.success('删除成功')
                            this.data1.splice(params.index, 1)
                          } else {
                            this.$Message.error('删除失败')
                          }
                        })
                      }
                    }
                    this.$Modal.confirm(config)
                  }}
                }, '删除')
              ])
            }
          }
        ],
        data1: [],
        // sku弹窗
        editing2: false,
        loading2: false,
        editObj: {
          id: '',
          productCategoryId: '',
          attrType: 2,
          code: 1,
          type: 2,
          isWrite: 0,
          isShow: 1,
          name: '',
          values: []
        },
        rules1: {
          name: [{required: true, message: '属性名不可为空', trigger: 'blur'}]
        },
        // sku弹窗属性值
        column2: [
          {
            title: '参数值',
            render: (h, params) => {
              if (this.editObj.values[params.index].editing) {
                return h('Input', {
                  style: {width: '60%'},
                  props: {value: params.row.name, size: 'small'},
                  on: {
                    'on-change': (val) => {
                      params.row.tempName = val.srcElement.value.replace(/(^\s*)|(\s*$)/g, '')
                    },
                    'on-focus': () => {
                      params.row.tempName = this.editObj.values[params.index].name
                    },
                    'on-blur': (val) => {
                      console.log(params.row.tempName)
                      if (params.row.tempName) {
                        if (!this.isEmpty(this.editObj.id) && !params.row.id) {
                          this.loading2 = true
                          let params1 = {productCategoryAttrId: this.editObj.id, name: params.row.tempName}
                          this.addAttrValue(params1, (response) => {
                            if (response.data.code === 200) {
                              this.afterSkuAttrValueChange()
                              this.loading2 = false
                            } else {
                              this.$Message.error(`新增属性值 '${params.row.tempName}' 失败`)
                              this.loading2 = false
                              val.srcElement.focus()
                            }
                          })
                        } else {
                          this.editObj.values[params.index].name = params.row.tempName
                          this.editObj.values[params.index].editing = false
                          this.editObj.values = JSON.parse(JSON.stringify(this.editObj.values))
                        }
                      }
                    }
                  }
                })
              } else {
                return h('div', {
                  on: {dblclick: () => {
                    this.editObj.values[params.index].editing = true
                    this.editObj.values = JSON.parse(JSON.stringify(this.editObj.values))
                  }}
                }, params.row.name)
              }
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('Button', {
                props: {type: 'error', size: 'small'},
                on: {click: () => {
                  let config = {
                    title: '删除属性值',
                    content: '确认要删除值吗？',
                    onOk: () => {
                      if (params.row.id) {
                        this.deleteAttrValue(params.row.id, (response) => {
                          if (response.data.code === 200) {
                            this.$Message.success('删除成功')
                            this.editObj.values.splice(params.index, 1)
                          } else {
                            this.$Message.error('删除失败')
                          }
                        })
                      } else {
                        this.editObj.values.splice(params.index, 1)
                      }
                    }
                  }
                  this.$Modal.confirm(config)
                }}
              }, '删除')
            }
          }
        ],
        // 颜色弹窗
        editing3: false,
        loading3: false,
        column3: [
          {
            title: '颜色',
            render: (h, params) => {
              return h('Input', {
                style: {width: '100px'},
                props: {size: 'small', value: params.row.name},
                on: {
                  'on-change': (val) => {
                    clearTimeout(last)
                    params.row.tempValue = val.srcElement.value.replace(/(^\s*)|(\s*$)/g, '')
                  },
                  'on-focus': () => {
                    params.row.tempValue = params.row.name
                  },
                  'on-blur': (val) => {
                    if (!params.row.id) {
                      this.loading3 = true
                      let params1 = {productCategoryAttrId: this.colorObj.id, name: params.row.tempValue}
                      this.addAttrValue(params1, (response) => {
                        if (response.data.code === 200) {
                          this.afterSkuAttrValueChange()
                          this.loading3 = false
                          this
                        } else {
                          this.$Message.error('新增颜色失败')
                          this.loading3 = false
                          val.srcElement.focus()
                        }
                      })
                    } else {
                      this.colorObj.values[params.index].name = params.row.tempValue
                    }
                  }
                }
              })
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('Button', {
                props: {size: 'small', type: 'error'},
                on: {click: () => {
                  let config = {
                    title: '删除颜色',
                    content: '确定要删除颜色吗？',
                    onOk: () => {
                      if (params.row.id) {
                        this.deleteAttrValue(params.row.id, (response) => {
                          if (response.data.code) {
                            this.$Message.success('删除成功')
                            this.colorObj.values.splice(params.index, 1)
                          } else {
                            this.$Message.error('删除失败')
                          }
                        })
                      } else {
                        this.colorObj.values.splice(params.index, 1)
                      }
                    }
                  }
                  this.$Modal.confirm(config)
                }}
              }, '删除')
            }
          }
        ],
        colorObj: {
          id: '',
          productCategoryId: '',
          attrType: 2,
          code: 1,
          type: 2,
          isWrite: 0,
          isShow: 0,
          name: '',
          values: []
        },
        // 搜索颜色
        colorName_: ''
      }
    },
    mounted: function () {
      this.getCate((response) => {
        if (response.data.code === 200) {
          this.handleToCateData(response.data.operateCategory)
        }
      })
    },
    methods: {
      isEmpty (val) {
        if (!/^['']*$/.test(val) && !/^[' ']+$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      getCate (callback) {
        this.$http.get(cateAPI.getCate()).then((response) => {
          if (response.data.code === 200) {
            if (typeof callback === 'function') {
              callback(response)
            }
          }
        })
      },
      handleToCateData (val) {
        let arr = JSON.parse(JSON.stringify(val))
        let operateCategory = []
        for (let i in arr) {
          let cate1 = {
            id: arr[i].id,
            title: arr[i].name,
            level: arr[i].level,
            status: arr[i].status,
            code: arr[i].code,
            children: []
          }
          for (let j in arr[i].secondCategory) {
            let cate2 = {
              id: arr[i].secondCategory[j].id,
              parentId: arr[i].id,
              title: arr[i].secondCategory[j].name,
              level: arr[i].secondCategory[j].level,
              status: arr[i].secondCategory[j].status,
              code: arr[i].secondCategory[j].code,
              children: []
            }
            for (let k in arr[i].secondCategory[j].threeCategory) {
              let cate3 = {
                id: arr[i].secondCategory[j].threeCategory[k].id,
                parentId: arr[i].secondCategory[j].id,
                title: arr[i].secondCategory[j].threeCategory[k].name,
                level: arr[i].secondCategory[j].threeCategory[k].level,
                status: arr[i].secondCategory[j].threeCategory[k].status,
                code: arr[i].secondCategory[j].threeCategory[k].code
              }
              cate2.children.push(cate3)
            }
            cate1.children.push(cate2)
          }
          operateCategory.push(cate1)
        }
        this.cateData = operateCategory
      },
      getSkuAttr (callback) {
        this.$http.get(cateAPI.getSkuAttr(this.currCate[0].id)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      selectTree (val) {
        // 遍历类目数据，判断所选类目级别
        if (val.length) {
          this.currCate = val
          this.renderData1((catalogAttr) => {
            for (let i of catalogAttr) {
              if (i.name === '颜色') {
                this.colorObj = JSON.parse(JSON.stringify(i))
              }
            }
            if (this.isEmpty(this.colorObj.id)) {
              // 新增颜色SKU
              this.colorObj.productCategoryId = this.currCate[0].id
              this.colorObj.name = '颜色'
              this.colorObj.values.push({name: '默认'})
              this.addAttr(this.colorObj)
            }
          })
        } else {
          this.currCate = []
          this.colorObj.id = ''
          this.colorObj.productCategoryId = ''
          this.colorObj.values = []
          this.colorObj.isShow = 0
        }
      },
      renderData1 (callback) {
        this.getSkuAttr((response) => {
          if (response.data.code === 200) {
            let arr = []
            for (let i of JSON.parse(JSON.stringify(response.data.catalogAttr))) {
              if (i.name !== '颜色') {
                arr.push(i)
              }
            }
            this.data1 = arr
            if (typeof callback === 'function') {
              callback(response.data.catalogAttr)
            }
          }
        })
      },
      // 打开SKU编辑窗
      editSku (params) {
        if (params.row) {
          this.editObj = JSON.parse(JSON.stringify(params.row))
          for (let i of this.editObj.values) {
            i.editing = false
          }
          for (let i of this.editObj.values) {
            i.editing = false
          }
        } else {
          this.editObj.values.push({name: '', editing: true})
        }
        this.editing2 = true
      },
      editOk () {
        this.loading2 = true
        setTimeout(() => {
          this.$refs.form1.validate((valid) => {
            if (valid) {
              if (this.editObjValues.length === 0) {
                this.$Message.warning('至少存有一条属性')
              } else {
                let editObj = JSON.parse(JSON.stringify(this.editObj))
                for (let i of editObj.values) {
                  delete i.editing
                }
                let temp = []
                for (let i of editObj.values) {
                  if (!this.isEmpty(i.name)) {
                    temp.push(i)
                  }
                }
                editObj.values = temp
                console.log(editObj)
                if (this.isEmpty(editObj.id)) {
                  // add
                  editObj.productCategoryId = this.currCate[0].id
                  this.addAttr(editObj, (response) => {
                    if (response.data.code === 200) {
                      this.$Message.success('操作成功')
                      this.editing2 = false
                      this.renderData1()
                    } else {
                      this.$Message.error('操作失败')
                      this.loading2 = false
                    }
                  })
                } else {
                  // edit
                  this.editAttr(editObj, (response) => {
                    if (response.data.code === 200) {
                      this.$Message.success('编辑成功')
                      this.editing2 = false
                      this.renderData1()
                    } else {
                      this.$Message.error('编辑失败')
                      this.loading2 = false
                    }
                  })
                }
              }
            }
          })
        }, 300)
      },
      editCancel () {
        this.editing2 = false
      },
      addAttr (params, callback) {
        this.$http.post(...cateAPI.addAttr(params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      editAttr (params, callback) {
        this.$http.put(...cateAPI.editAttr(params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      deleteAttr (attrId, callback) {
        this.$http.delete(cateAPI.deleteAttr(attrId)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      addAttrValue (params, callback) {
        this.$http.post(...cateAPI.addAttrValue(params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      deleteAttrValue (attrValueId, callback) {
        this.$http.delete(cateAPI.deleteAttrValue(attrValueId)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      afterSkuAttrValueChange () {
        this.getSkuAttr((response) => {
          let arr = JSON.parse(JSON.stringify(response.data.catalogAttr))
          let values = []
          if (this.editObj.id) {
            for (let i of arr) {
              if (this.editObj.id === i.id) {
                for (let j of i.values) {
                  values.push({
                    id: j.id,
                    name: j.name,
                    editing: false
                  })
                }
              }
            }
            this.editObj.values = values
          }
          if (this.colorObj.id && this.editing3) {
            for (let i of arr) {
              if (this.colorObj.id === i.id) {
                for (let j of i.values) {
                  values.push({
                    id: j.id,
                    name: j.name
                  })
                }
              }
            }
            this.colorObj.values = values
          }
        })
      },
      // 新增sku属性值输入框
      addValue () {
        this.editObj.values.unshift({
          name: '',
          editing: true
        })
      },
      // 新增颜色
      addColor () {
        this.colorObj.values.unshift({name: ''})
      },
      showColor (flag) {
        clearTimeout(last)
        if (this.colorObj.id) {
          last = setTimeout(() => {
            this.editAttr(this.colorObj)
          }, 1000)
        }
      },
      saveColor () {
        this.loading3 = true
        let values = []
        for (let i of this.colorObj.values) {
          if (!this.isEmpty(i.name)) {
            values.push(i)
          }
        }
        this.colorObj.values = values
        this.editAttr(this.colorObj, (response) => {
          if (response.data.code === 200) {
            this.$Message.success('操作成功')
            this.editing3 = false
          } else {
            this.$Message.error('操作失败')
            this.loading3 = false
          }
        })
      },
      searchColor () {
        let values = []
        for (let i of this.colorObj.values) {
          if (i.name.indexOf(this.colorName_) !== -1) {
            values.push(i)
          }
        }
        this.colorObj.values = values
      },
      cancelSearch () {
        this.colorName_ = ''
      }
    },
    beforeCreate: function () {
      this.$route.meta['keepAlive'] = true
    },
    computed: {
      modalTitle () {
        if (!this.isEmpty(this.editObj.id)) {
          return '编辑自定义属性'
        } else {
          return '添加自定义属性'
        }
      },
      // 仅用于判断新增或编辑sku属性，是否有属性值
      editObjValues () {
        let editObj = JSON.parse(JSON.stringify(this.editObj))
        let values = []
        for (let i in editObj.values) {
          if (!this.isEmpty(editObj.values[i].name)) {
            values.push(editObj.values[i].name)
          }
        }
        return values
      }
    },
    watch: {
      editing2 (newV) {
        if (!newV) {
          this.loading2 = false
          this.editObj.id = ''
          this.editObj.name = ''
          this.editObj.productCategoryId = ''
          this.editObj.values = []
          this.$refs.form1.resetFields()
        }
      },
      editing3 (newV) {
        if (!newV) {
          this.colorObj.values = []
          this.loading3 = false
        } else {
          this.afterSkuAttrValueChange()
        }
      },
      colorName_ (newV, oldV) {
        if (newV !== oldV && this.isEmpty(newV)) {
          this.afterSkuAttrValueChange()
        }
      }
    }
  }
</script>
