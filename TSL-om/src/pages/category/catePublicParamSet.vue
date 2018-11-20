<style scoped>
  #catePublicParamSet {
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
  .add-btn {
    margin-top: 10px;
  }
  .my-table {
    margin: 10px 10px 10px 0px;
  }
  .my-modal .ivu-row {
    margin-bottom: 10px;
  }
  .my-modal .ivu-select {
    width: 200px;
  }
  .my-input {
    width: 200px;
  }
  .my-modal2 .add-btn {
    margin-bottom: 10px;
  }
</style>
<template>
  <div id="catePublicParamSet">
    <Breadcrumb class="my-breadcrumb">
      <BreadcrumbItem>运营类目管理</BreadcrumbItem>
      <BreadcrumbItem>类目通用参数设置</BreadcrumbItem>
    </Breadcrumb>

    <Tree :data="cateData" class="my-tree" @on-select-change="selectTree"></Tree>

    <div class="my-content" v-if="currCate.length !== 0">
      <Button type="primary" class="add-btn" @click="openEditModal" :disabled="currCate[0].level !== 3">新增</Button>
      <span v-if="currCate[0].level !== 3" style="display: inline-block;line-height: 32px;margin: 10px 0px 0px 10px;vertical-align: middle;color: #bbbec4;"><Icon type="information-circled"></Icon>请在三级目录新增参数</span>
      <Table :columns="column1" :data="data1" size="small" :width="900" :height="460" class="my-table"></Table>
    </div>

    <Modal v-model="editing1" :title="modalTitle" width="700" class="my-modal">
      <Form inline :model="editObj" :rules="rules1" ref="form1">
        <FormItem label="参数名称：" prop="name" :label-width="100">
          <Input name="name" class="my-input" v-model="editObj.name" @on-blur="judgeName" :disabled="banModalEdit"></Input>
        </FormItem>
        <FormItem label="是否必填：" :label-width="100">
          <Checkbox name="required" v-model="editObj.isWrite" :true-value="1" :false-value="0" :disabled="banModalEdit"></Checkbox>
        </FormItem>
        <br>
        <FormItem label="参数类型：" prop="type" :label-width="100">
          <Select name="type" v-model="editObj.type" :disabled="banModalEdit">
            <Option :value="1" label="单选"></Option>
            <Option :value="2" label="多选"></Option>
            <Option :value="3" label="下拉列表"></Option>
            <Option :value="4" label="单行文本"></Option>
            <Option :value="5" label="多行文本"></Option>
            <Option :value="6" label="时间控件"></Option>
          </Select>
        </FormItem>
        <FormItem :label-width="20">
          <span class="tips" v-if="editObj.type === 4">限30字</span>
          <span class="tips" v-if="editObj.type === 5">限200字</span>
          <a href="javascript:" class="edit-btn" v-if="editObj.type === 1 || editObj.type === 2 || editObj.type === 3" @click="openValuesModal">
            编辑参数值
          </a>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="onOk" :loading="loading1" @on-blur="judgeName">确定</Button>
        <Button @click="onCancel">取消</Button>
      </div>
    </Modal>

    <Modal v-model="editing2" title="编辑参数值" class="my-modal2">
      <Button type="primary" class="add-btn" @click="addValueBtn">添加</Button>
      <Table :columns="column2" :data="editObj.values"></Table>
      <div slot="footer">
        <Button type="primary" @click="onOk2" :loading="loading2">确定</Button>
        <Button @click="onCancel2">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pmAPI from '../../services/productManager.es6'
  import * as cateAPI from '../../services/operationCate.es6'
  export default {
    name: 'catePublicParamSet',
    data () {
      return {
        currCate: '',
        cateData: [],
        check: false, // 判断类目下有无子类目及商品 false:有 true:无
        column1: [
          {
            title: 'ID',
            key: 'id',
            width: 100
          },
          {
            title: '参数名称',
            key: 'name',
            width: 100
          },
          {
            title: '参数类型',
            width: 100,
            render: (h, params) => {
              let type = ''
              switch (params.row.type) {
                case 1: type = '单选'
                  break
                case 2: type = '多选'
                  break
                case 3: type = '下拉列表'
                  break
                case 4: type = '单行文本'
                  break
                case 5: type = '多行文本'
                  break
                case 6: type = '时间控件'
                  break
              }
              return type
            }
          },
          {
            title: '是否必填',
            width: 100,
            render: (h, params) => {
              if (params.row.isWrite === 0) {
                return ''
              } else if (params.row.isWrite === 1) {
                return '√'
              }
            }
          },
          // {
          //   title: '是否默认展示',
          //   render: (h, params) => {
          //     if (params.row.isShow === 0) {
          //       return ''
          //     } else if (params.row.isShow === 1) {
          //       return '√'
          //     }
          //   }
          // },
          {
            title: '参数值列表',
            render: (h, params) => {
              let arr = []
              if (params.row.values) {
                params.row.values.forEach(e => {
                  arr.push(e.name)
                })
              }
              return arr.join('、')
            }
          },
          {
            title: '所属类目',
            width: 100,
            render: (h, params) => {
              let str = ''
              for (let i of this.cateData) {
                if (params.row.productCategoryId === i.id) {
                  str = i.title
                } else {
                  for (let j of i.children) {
                    if (params.row.productCategoryId === j.id) {
                      str = j.title
                    } else {
                      for (let k of j.children) {
                        if (params.row.productCategoryId === k.id) {
                          str = k.title
                        }
                      }
                    }
                  }
                }
              }
              return str
            }
          },
          {
            title: '序列号',
            width: 90,
            render: (h, params) => {
              if (this.data1[params.index].codeEditing) {
                return h('div', [
                  h('Icon', {
                    props: {type: 'checkmark-circled'}
                  }),
                  h('Input', {
                    props: {value: params.row.code, size: 'small'},
                    on: {
                      'on-change': (val) => {
                        params.row.tempValue = val.target.value
                      },
                      'on-focus': () => {
                        params.row.tempValue = params.row.code
                      },
                      'on-blur': () => {
                        if (!this.isEmpty(params.row.tempValue)) {
                          let params1 = JSON.parse(JSON.stringify(this.data1[params.index]))
                          params1.code = parseInt(params.row.tempValue)
                          delete params1.codeEditing
                          if (params1.values === null) {
                            params1.values = []
                          }
                          this.editCommonAttr(params1, (response) => {
                            if (response.data.code === 200) {
                              this.$Message.success('操作成功')
                              this.renderData1()
                            } else {
                              this.$Message.error('操作失败')
                            }
                          })
                        }
                      }
                    },
                    style: {width: '40px', 'margin-left': '2px'}
                  })
                ])
              } else {
                return h('div', {
                  on: {
                    'dblclick': () => {
                      this.data1[params.index].codeEditing = true
                      this.data1[params.index] = JSON.parse(JSON.stringify(this.data1[params.index]))
                    }
                  }
                }, [
                  h('Icon', {
                    props: {type: 'edit'}
                  }),
                  h('span', {
                    style: {'margin-left': '10px'}
                  }, params.row.code)
                ])
              }
            }
          },
          {
            title: '操作',
            width: 130,
            render: (h, params) => {
              return h('div', {}, [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: this.currCate[0].level !== 3 && this.currCate[0].children.length !== 0
                  },
                  style: {'margin-right': '10px'},
                  on: {click: () => {
                    console.log(params.row)
                    this.openEditModal(params)
                  }}
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: this.currCate[0].level !== 3 && this.currCate[0].children.length !== 0
                  },
                  on: {
                    'click': () => {
                      let config = {
                        title: '删除',
                        content: '删除属性',
                        onOk: () => {
                          this.deleteCommonAttr(params.row.id, (response) => {
                            if (response.data.code === 200) {
                              this.$Message.success('操作成功')
                              this.renderData1()
                            } else {
                              this.$Message.error('操作失败')
                            }
                          })
                        }
                      }
                      this.$Modal.confirm(config)
//                      if (!this.check) {
//                        this.$Message.warning('类目有子类目或商品，不可删除')
//                      } else {
//                        this.$Modal.confirm(config)
//                      }
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        data1: [],
        loading1: false,
        editing1: false,
        editObj: {
          id: '',
          productCategoryId: '',
          attrType: 1,
          type: 4,
          isWrite: 0,
          isShow: 1,
          code: 0,
          name: '',
          values: []
        },
        rules1: {
          name: [
            {required: true, message: '参数名必填', trigger: 'blur'}
          ]
        },
        paramType: ['单行文本', '多行文本', '单选', '多选', '下拉列表'],
        editing2: false,
        loading2: false,
        column2: [
          {
            title: '参数值',
            render: (h, params) => {
              if (this.editObj.values[params.index].editing) {
                return h('Input', {
                  props: {value: params.row.name, size: 'small', maxlength: 10},
                  on: {
                    'on-change': (val) => {
                      params.row.tempValue = val.target.value.replace(/(^\s*)|(\s*$)/g, '')
                    },
                    'on-focus': () => {
                      params.row.tempValue = params.row.name
                    },
                    'on-blur': () => {
                      if (params.row.tempValue) {
                        this.editObj.values[params.index].name = params.row.tempValue
                        // this.editObj.values[params.index].editing = false
                      }
                    }
                  }
                })
              } else {
                return h('div', {
                  on: {dblclick: () => {
                    if (this.banModalEdit && params.row.id) {
                      this.$Message.warning('类目下有商品，无法修改旧参数')
                    } else {
                      this.editObj.values[params.index].editing = true
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
                    title: '删除',
                    content: '确定删除属性值？',
                    onOk: () => {
                      if (this.editObj.id) {
                        if (params.row.id) {
                          this.deleteCommonAttrValue(params.row.id, (response) => {
                            if (response.data.code === 200) {
                              this.$Message.success('操作成功')
                              this.editObj.values.splice(params.index, 1)
                            } else {
                              this.$Message.error('操作失败')
                            }
                          })
                        } else {
                          this.editObj.values.splice(params.index, 1)
                        }
                      } else {
                        this.editObj.values.splice(params.index, 1)
                      }
                    }
                  }
                  if (!this.check && params.row.id) {
                    this.$Message.warning('类目下有商品，不可删除')
                  } else {
                    this.$Modal.confirm(config)
                  }
                }}
              }, '删除')
            }
          }
        ]
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
      selectTree (val) {
        if (val.length) {
          if (val[0].level !== 3) {
            this.currCate = val
            this.data1 = []
            return
          }
          this.ifControl(val[0], () => {
            this.currCate = val
            this.renderData1()
          })
        } else {
          this.data1 = []
          this.currCate = []
        }
      },
      getCommonAttr (callback) {
        this.$http.get(cateAPI.getCommonAttr(this.currCate[0].id)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      renderData1 () {
        this.getCommonAttr((response) => {
          let data1 = response.data.catalogAttr
          for (let i of data1) {
            i.codeEditing = false
          }
          this.data1 = data1
        })
      },
      openEditModal (params) {
        if (params.row) {
          // 编辑
          let editObj = JSON.parse(JSON.stringify(params.row))
          if (editObj.values !== null) {
            for (let i in editObj.values) {
              editObj.values[i].editing = false
            }
          } else {
            editObj.values = []
          }
          this.editObj = editObj
        }
        this.editing1 = true
      },
      onOk () {
        this.loading1 = true
        this.editObj.productCategoryId = this.currCate[0].id
        if (this.editObj.type === 1 || this.editObj.type === 2 || this.editObj.type === 3) {
          if (this.editObj.values === null || this.editObj.values.length === 0) {
            this.$Message.warning('请编辑属性值')
            this.loading1 = false
            return
          } else if (this.editObj.values.length < 2 || this.editObj.values.length > 50) {
            this.$Message.warning('参数值最少2个最多50个')
            this.loading1 = false
            return
          } else {
            let qobj = {}
            let values = [] // 有valueId
            let newValues = [] // 无valueId
            for (let i of JSON.parse(JSON.stringify(this.editObj.values))) {
              if (!this.isEmpty(i.name)) {
                if (qobj[i.name] !== 1) {
                  i.id ? values.push(i) : newValues.push(i)
                  qobj[i.name] = 1
                } else {
                  this.$Message.warning('参数值须唯一')
                  this.loading1 = false
                  return
                }
              }
            }
            if (this.editObj.id) {
              this.editObj.values = values
              this.editObj.newValues = newValues
            } else {
              this.editObj.values = newValues
            }
          }
        } else {
          this.editObj.values = []
          this.editObj.newValues = []
        }
        this.$refs.form1.validate((valid) => {
          if (valid) {
            if (this.editObj.name.length > 20) {
              this.$Message.warning('参数名字限定20长度')
              this.loading1 = false
              return
            }
            if (this.isEmpty(this.editObj.id)) {
              // 新增属性
              this.addCommonAttr(this.editObj, (response) => {
                if (response.data.code === 200) {
                  this.$Message.success('操作成功')
                  this.editing1 = false
                  // 刷新data1
                  this.renderData1()
                } else {
                  this.$Message.error('操作失败')
                  this.loading1 = false
                }
              })
            } else {
              // 编辑属性
              this.editCommonAttr(this.editObj, (response) => {
                if (response.data.code === 200) {
                  this.$Message.success('操作成功')
                  this.editing1 = false
                  // 刷新data1
                  this.renderData1()
                } else {
                  this.$Message.error('操作失败')
                  this.loading1 = false
                }
              })
            }
          } else {
            this.loading1 = false
          }
        })
      },
      onCancel () {
        this.editing1 = false
      },
      addCommonAttr (params, callback) {
        this.$http.post(...cateAPI.addAttr(params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        }).catch(() => {
          this.loading1 = false
          this.loading2 = false
        })
      },
      editCommonAttr (params, callback) {
        this.$http.put(...cateAPI.addAttr(params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        }).catch(() => {
          this.loading1 = false
          this.loading2 = false
        })
      },
      deleteCommonAttr (attrId, callback) {
        this.$http.delete(cateAPI.deleteAttr(attrId)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      addCommonAttrValue (params, callback) {
        this.$http.post(...cateAPI.addAttrValue(params)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      deleteCommonAttrValue (attrValueId, callback) {
        this.$http.delete(cateAPI.deleteAttrValue(attrValueId)).then(response => {
          if (typeof callback === 'function') {
            callback(response)
          }
        })
      },
      // 打开属性值弹窗
      openValuesModal () {
        if (this.isEmpty(this.editObj.name)) {
          this.$Message.warning('参数名称不可为空')
        } else {
          if (this.editObj.name.length > 20) {
            this.$Message.warning('参数名称限定20长度')
          } else {
            this.editing2 = true
          }
        }
      },
      // 属性值输入框
      addValueBtn () {
        if (this.editObj.values === null) {
          this.editObj.values = []
        }
        this.editObj.values.unshift({
          name: '',
          editing: true
        })
      },
      onOk2 () {
        this.loading2 = true
        setTimeout(() => {
          let values = []
          let qobj = {}
          for (let i of JSON.parse(JSON.stringify(this.editObj.values))) {
            if (!this.isEmpty(i.name)) {
              if (qobj[i.name] !== 1) {
                values.push(i)
                qobj[i.name] = 1
              } else {
                this.$Message.warning('参数值须唯一')
                this.loading2 = false
                return
              }
            }
          }
          this.editObj.values = values
          this.loading2 = false
          this.editing2 = false
        }, 300)
      },
      onCancel2 (flag) {
        this.editing2 = false
      },
      afterAttrValueChange () {
        this.getCommonAttr((response) => {
          if (response.data.code === 200) {
            let values = []
            let catalogAttr = response.data.catalogAttr
            for (let i of catalogAttr) {
              if (i.id === this.editObj.id) {
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
        })
      },
      judgeName () {
        if (!this.isEmpty(this.editObj.name)) {
          if (this.editObj.name.length > 20) {
            this.$Message.warning('参数名称限定20长度')
            return false
          } else {
            return true
          }
        } else {
          return false
        }
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
        if (this.editObj.id) {
          return '编辑参数'
        } else {
          return '新增参数'
        }
      },
      banModalEdit () {
        console.log(!this.check)
        return !this.check && this.editObj.id !== ''
      }
    },
    watch: {
      editing1 (newV) {
        if (!newV) {
          this.editObj.id = ''
          this.editObj.productCategoryId = ''
          this.editObj.name = ''
          this.editObj.isWrite = 0
          this.editObj.type = 4
          this.editObj.code = 0
          this.editObj.values = []
          this.$refs.form1.resetFields()
          this.loading1 = false
        }
      }
    }
  }
</script>
