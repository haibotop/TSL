<style rel="stylesheet/scss" lang="scss" scoped>
  #cateSKUset {
    position: relative;
  }
  .my-breadcrumb {
    margin: 0px 10px;
  }
  .my-tree {
    margin: 10px;
    border: 1px solid #dddee1;
    padding: 0px 10px;
    width: 200px;
    position: absolute;
    top: 20px;
    left: 0px;
  }
  .my-content {
    width: 900px;
    position: absolute;
    top: 20px;
    left: 220px;
  }
  .color-bar {
    margin: 10px 0px;
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
  .sku-Modal .skuValues .tips {
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
    <Tree :data="cateData" class="my-tree" @on-select-change="selectTree"></Tree>
    <div class="my-content" v-if="currCate.length !== 0">
      <div class="color-bar">
        <Checkbox v-if="currCate[0].level !== 3" disabled class="color-checker">是否支持颜色属性</Checkbox>
        <Checkbox v-else v-model="colorObj.isShow" :disabled="!check" :true-value="1" :false-value="0" class="color-checker" @on-change="showColor">是否支持颜色属性</Checkbox>
        <a href="javascript:" @click="openColorModal" :disabled="currCate[0].level !== 3">颜色设置</a>
        <span v-if="currCate[0].level !== 3" style="margin: 0px 0px 0px 10px;color: #bbbec4;"><Icon type="information-circled"></Icon>请在三级目录设置属性</span>
      </div>
      <Button type="primary" @click="editSku" :disabled="currCate[0].level !== 3">添加自定义属性</Button>
      <Table :columns="column1" :data="data1" class="my-table"></Table>
    </div>

    <Modal v-model="editing2" :title="modalTitle" width="700" class="sku-Modal">
      <Form :model="editObj" :rules="rules1" ref="form1">
        <FormItem label="属性名称：" prop="name" :label-width="100">
          <Input v-model.trim="editObj.name" :maxlength="20" :disabled="banEditSkuName"></Input>
        </FormItem>
      </Form>
      <div class="skuValues">
        <div class="tips">编辑参数值</div>
        <Button type="primary" size="small" class="add-btn" @click="addValue">添加</Button>
        <Table :columns="column2" :data="editObj.values" height="200"></Table>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading2" @click="editOk">确定</Button>
        <Button @click="editCancel">取消</Button>
      </div>
    </Modal>

    <Modal v-model="editing3" title="颜色管理" width="700" class="color-Modal">
      <label for="color">颜色：</label><Input size="small" class="my-input" v-model.trim="colorName_"></Input>
      <Button type="primary" size="small" @click="searchColor">查询</Button>
      <Button type="primary" size="small" @click="cancelSearch">重置</Button>
      <div><Button type="primary" size="small" class="add-color-btn" @click="addColor">添加颜色</Button></div>
      <Table height="300" :columns="column3" :data="colorObj.values"></Table>
      <div slot="footer">
        <Button type="primary" @click="saveColor" :loading="loading3">保存编辑</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as cateAPI from '../../services/operationCate.es6'
  import * as pmAPI from '../../services/productManager.es6'
  let last
  export default {
    name: 'cateSKUset',
    data () {
      return {
        cateData: [],
        currCate: [],
        check: false, // 判断类目下有无子类目及商品 false:有 true:无
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
                  props: {type: 'primary', size: 'small', disabled: this.currCate[0].level !== 3 && this.currCate[0].children.length > 0},
                  style: {'margin-right': '10px'},
                  on: {click: () => {
                    this.editSku(params)
                  }}
                }, '修改'),
                h('Button', {
                  props: {type: 'error', size: 'small', disabled: this.currCate[0].level !== 3 && this.currCate[0].children.length > 0},
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
                    if (!this.check) {
                      this.$Message.warning('类目下有商品，不可删除')
                    } else {
                      this.$Modal.confirm(config)
                    }
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
                  props: {value: params.row.name, size: 'small', maxlength: 10},
                  on: {
                    'on-change': (val) => {
                      params.row.tempName = val.target.value.replace(/(^\s*)|(\s*$)/g, '')
                    },
                    'on-focus': () => {
                      params.row.tempName = this.editObj.values[params.index].name
                    },
                    'on-blur': (val) => {
                      console.log(params.row.tempName)
                      if (params.row.tempName) {
                        this.editObj.values[params.index].name = params.row.tempName.replace(/[: | ,]/g, '')
                      }
                    }
                  }
                })
              } else {
                return h('div', {
                  on: {dblclick: () => {
                    if (!this.check && params.row.id) {
                      this.$Message.warning('类目下有商品，不可修改旧属性')
                    } else {
                      this.editObj.values[params.index].editing = true
                      this.editObj.values = JSON.parse(JSON.stringify(this.editObj.values))
                    }
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
                  if (!this.check && params.row.id) {
                    this.$Message.warning('类目下有商品，不可删除')
                    return
                  } else {
                    this.$Modal.confirm(config)
                  }
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
                props: {
                  size: 'small',
                  disabled: !this.check && params.row.id !== '',
                  value: params.row.name
                },
                on: {
                  'on-change': (val) => {
                    clearTimeout(last)
                    params.row.tempValue = val.target.value.replace(/(^\s*)|(\s*$)/g, '')
                  },
                  'on-focus': () => {
                    params.row.tempValue = params.row.name
                  },
                  'on-blur': (val) => {
                    this.colorObj.values[params.index].name = params.row.tempValue.replace(/[: | ,]/g, '')
                  }
                }
              })
            }
          },
          {
            title: '操作',
            width: 100,
            render: (h, params) => {
              return h('Button', {
                props: {size: 'small', type: 'error'},
                on: {click: () => {
                  let config = {
                    title: '删除颜色',
                    content: '确定要删除颜色吗？',
                    onOk: () => {
                      if (this.colorObj.values) {
                        if (this.colorObj.values.length === 1) {
                          this.$Message.warning('至少存有1个颜色值')
                          return
                        }
                      }
                      if (params.row.id) {
                        // 编辑-数据删除
                        this.deleteAttrValue(params.row.id, (response) => {
                          if (response.data.code) {
                            this.$Message.success('删除成功')
                            this.colorObj.values.splice(params.index, 1)
                          } else {
                            this.$Message.error('删除失败')
                          }
                        })
                      } else {
                        // 新增-视图删除
                        this.colorObj.values.splice(params.index, 1)
                      }
                    }
                  }
                  if (!this.check) {
                    this.$Message.warning('类目下有商品，不可删除')
                  } else {
                    this.$Modal.confirm(config)
                  }
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
            // let res = response
            // res.data = JSON.parse(`{"code":200,"message":"操作成功","catalogAttr":[{"id":"119663878681427968","productCategoryId":"118844769274183680","attrType":2,"name":"颜色","code":1,"type":2,"isWrite":0,"isShow":0,"values":null,"newValues":null}]}`)
            callback(response)
          }
        })
      },
      selectTree (val) {
        // 遍历类目数据，判断所选类目级别
        if (val.length) {
          if (val[0].level !== 3) {
            this.data1 = []
            this.currCate = val
            return
          }
          this.colorObj = {
            id: '',
            productCategoryId: '',
            attrType: 2,
            code: 1,
            type: 2,
            isWrite: 0,
            isShow: 0,
            name: '',
            values: []
          }
          // 在this.check得到值后再渲染数据
          this.ifControl(val[0], () => {
            this.currCate = val
            this.renderData1((catalogAttr) => {
              // for (let i of catalogAttr) {
              //   if (i.name === '颜色') {
              //     this.colorObj = JSON.parse(JSON.stringify(i))
              //     if (!this.colorObj.values) {
              //       this.colorObj.values = []
              //     }
              //   }
              // }
              // 打开的时候才判断创建
              // if (this.isEmpty(this.colorObj.id)) {
              //   // 新增颜色SKU
              //   this.colorObj.productCategoryId = this.currCate[0].id
              //   this.colorObj.name = '颜色'
              //   this.colorObj.values = []
              //   this.addAttr(this.colorObj)
              // }
              let exist = 0
              for (let i of catalogAttr) {
                if (i.name === '颜色') {
                  exist++
                  if (!i.values) { i.values = [] }
                  this.colorObj = i
                }
              }
              if (exist === 0) {
                this.colorObj.productCategoryId = this.currCate[0].id
                this.colorObj.name = '颜色'
                this.colorObj.values = [{name: '默认'}]
                this.addAttr(this.colorObj)
              }
            })
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
              //  else {
              //   this.colorObj = i
              //   if (!i.value) { this.colorObj.values = [] }
              // }
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
          // 编辑窗口
          this.editObj = JSON.parse(JSON.stringify(params.row))
          for (let i of this.editObj.values) {
            i.editing = false
          }
          for (let i of this.editObj.values) {
            i.editing = false
          }
        } else {
          // 新增窗口
          this.editObj.values.push({name: '', editing: true})
        }
        this.editing2 = true
      },
      // 新增编辑
      editOk () {
        this.loading2 = true
        setTimeout(() => {
          let editObj = JSON.parse(JSON.stringify(this.editObj))
          this.$refs.form1.validate((valid) => {
            if (valid) {
              if (this.editObj.name === '颜色') {
                this.$Message.warning('请在‘颜色设置’设置颜色')
                this.loading2 = false
                return
              }
              for (let i of this.data1) {
                if (this.editObj.id) {
                  // 编辑
                  if (i.name === editObj.name && i.id !== editObj.id) {
                    this.$Message.warning('同类目下，属性名唯一')
                    this.loading2 = false
                    return
                  }
                } else {
                  // 新增
                  if (i.name === editObj.name) {
                    this.$Message.warning('同类目下，属性名唯一')
                    this.loading2 = false
                    return
                  }
                }
              }
              for (let i of editObj.values) { delete i.editing }
              // ----------去空
              let values = []
              for (let i of editObj.values) {
                if (!this.isEmpty(i.name)) { values.push(i) }
              }
              editObj.values = values
              if (editObj.values.length < 2 || editObj.values.length > 50) {
                this.$Message.warning('属性值最少2个最多50个')
                this.loading2 = false
              } else {
                let qobj = {}
                let values = []
                let newValues = []
                for (let i of editObj.values) {
                  if (!qobj[i.name]) {
                    i.id ? values.push(i) : newValues.push(i)
                    qobj[i.name] = 1
                  } else {
                    this.$Message.warning('属性值必须唯一')
                    this.loading2 = false
                    return
                  }
                }
                if (this.isEmpty(editObj.id)) {
                  // add
                  editObj.values = newValues
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
                  editObj.values = values
                  editObj.newValues = newValues
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
            } else {
              this.loading2 = false
            }
          })
        }, 300)
      },
      editCancel () {
        this.editing2 = false
      },
      // ----------接口------------
      addAttr (params, callback) {
        this.$http.post(...cateAPI.addAttr(params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        }).catch(() => {
          this.loading2 = false
          this.loading3 = false
        })
      },
      editAttr (params, callback) {
        this.$http.put(...cateAPI.editAttr(params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        }).catch(() => {
          this.loading2 = false
          this.loading3 = false
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
      // ---------------------------
      afterSkuAttrValueChange (callback) {
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
          // if (this.colorObj.id) {
          //   for (let i of arr) {
          //     if (this.colorObj.id === i.id) {
          //       if (!i.values) {
          //         return
          //       }
          //       for (let j of i.values) {
          //         if (this.name === '') {
          //           this.deleteAttrValue(i.id)
          //         } else {
          //           values.push({
          //             id: j.id,
          //             name: j.name
          //           })
          //         }
          //       }
          //     }
          //   }
          //   this.colorObj.values = values
          // } else {
          for (let i of response.data.catalogAttr) {
            if (i.name === '颜色') {
              this.colorObj = JSON.parse(JSON.stringify(i))
              if (!this.colorObj.values) {
                this.colorObj.values = []
              }
            }
          }
          // }
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      // 新增sku属性值输入框
      addValue () {
        if (this.editObj.values.length >= 50) {
          this.$Message.warning('参数值最少2个最多50个')
          return
        }
        this.editObj.values.unshift({
          name: '',
          editing: true
        })
      },
      // 打开颜色编辑窗
      openColorModal () {
        if (!this.check) {
          this.$Message.warning('类目下有商品，不可修改')
          return
        }
        this.afterSkuAttrValueChange(() => {
          this.editing3 = true
        })
      },
      // 新增颜色输入框
      addColor () {
        if (this.colorName_) {
          this.$Message.warning('正在搜索颜色，不可添加颜色')
        } else {
          this.colorObj.values.unshift({name: ''})
        }
      },
      // 是否支持颜色属性
      showColor (flag) {
        clearTimeout(last)
        if (this.colorObj.id) {
          last = setTimeout(() => {
            let colorObj = JSON.parse(JSON.stringify(this.colorObj))
            colorObj.isShow = flag
            this.editAttr(colorObj)
          }, 300)
        }
      },
      // 保存颜色
      saveColor () {
        if (this.colorName_) {
          this.$Message.warning('请重置颜色搜索后重试')
          return
        }
        this.loading3 = true
        let values = []
        let colorObj = JSON.parse(JSON.stringify(this.colorObj))
        for (let i of colorObj.values) {
          if (!this.isEmpty(i.name)) {
            values.push(i)
          }
        }
        let qobj = {}
        let oldValues = []
        let newValues = []
        for (let i of values) {
          if (!qobj[i.name]) {
            i.id ? oldValues.push(i) : newValues.push(i)
            qobj[i.name] = 1
          } else {
            this.$Message.warning('颜色必须唯一')
            this.loading3 = false
            return
          }
        }
        colorObj.values = oldValues.length > 0 ? oldValues : []
        console.log('values', values)
        colorObj.newValues = values.length > 0 ? newValues : [{name: '默认'}]
        if (colorObj.id) {
          // 编辑
          if (values.length === 0) {
            // 新增默认属性值
            this.editAttr(colorObj, (response) => {
              if (response.data.code === 200) {
                this.$Message.success('操作成功')
                this.editing3 = false
              } else {
                this.$Message.error('操作失败')
                this.loading3 = false
              }
            })
          } else {
            // 编辑属性-编辑属性值
            this.editAttr(colorObj, (response) => {
              if (response.data.code === 200) {
                this.editing3 = false
              } else {
                this.$Message.error('操作失败')
                this.loading3 = false
              }
            })
          }
        } else {
          // 新增属性-新增属性值
          colorObj.name = '颜色'
          colorObj.productCategoryId = this.currCate[0].id
          if (values.length === 0) {
            colorObj.values = [{name: '默认'}]
          }
          this.addAttr(colorObj, (response) => {
            if (response.data.code === 200) {
              this.$Message.success('操作成功')
              this.editing3 = false
            } else {
              this.$Message.error('操作失败')
              this.loading3 = false
            }
          })
        }
      },
      // 搜索颜色
      searchColor () {
        this.afterSkuAttrValueChange(() => {
          let values = []
          for (let i of this.colorObj.values) {
            if (i.name.indexOf(this.colorName_) !== -1) {
              values.push(i)
            }
          }
          this.colorObj.values = values
        })
      },
      // 清除搜索颜色
      cancelSearch () {
        this.colorName_ = ''
        this.afterSkuAttrValueChange()
      },
      // 检查类目下是否有商品 callback1: 存在, callback2: 不存在
      ifExistP (currCate, callback1, callback2) {
        this.getForSell(1, 1, {categoryId: currCate.id}, (response) => {
          if (response.data.pageInfo.list.length > 0) {
            callback1()
          } else {
            this.getOnSell(1, 1, {categoryId: currCate.id}, (response) => {
              if (response.data.pageInfo.list.length > 0) {
                callback1()
              } else {
                callback2()
              }
            })
          }
        })
      },
      getForSell (pageNum, pageSize, params, callback) {
        this.$http.post(...pmAPI.forSell(pageNum, pageSize, params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getOnSell (pageNum, pageSize, params, callback) {
        this.$http.post(...pmAPI.onsell(pageNum, pageSize, params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 检查类目下是否有商品&类目
      ifControl (currCate, callback) {
        if (currCate.level === 3) {
          this.ifExistP(currCate, () => {
            this.check = false
            callback()
          }, () => {
            this.check = true
            callback()
          })
        } else {
          if ((currCate.level === 1 && currCate.children.length === 0) || (currCate.level === 2 && currCate.children.length === 0)) {
            this.check = true
          } else {
            this.check = false
          }
          callback()
        }
      }
    },
    computed: {
      modalTitle () {
        if (!this.isEmpty(this.editObj.id)) {
          return '编辑自定义属性'
        } else {
          return '添加自定义属性'
        }
      },
      // 判断类目下面是否有子类目
      isDisabled () {
        if (this.currCate[0]) {
          if (this.currCate[0].level !== 3 && this.currCate[0].children.length > 0) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      },
      // sku Modal name disabled true:禁用
      banEditSkuName () {
        // 有子类目或商品 并且 编辑状态
        return !this.check && this.editObj.id !== ''
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
