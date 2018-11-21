<style lang="scss" rel="stylesheet/scss">
.MTheader{
  margin: 20px;
}
.my-breadcrumb {
  margin: 0px 10px;
}
.ql-container {
  min-height: 200px;
}
.upPrc {
  width: 100px;
  height: 100px; 
}
.addPhoto {
  width: 100px;
  height: 100px;
}
</style>
<template>
  <div id="mainTenance">
    <div class="MtTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>展示类目管理</BreadcrumbItem>
        <BreadcrumbItem>消保管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="MTheader">
      <Form>
        <FormItem label="消保名称 :">
          <AutoComplete
            v-model="value1"
            :data="dMTname"
            @on-change="handleSearch(value1)"
            placeholder="input here"
            style="width:200px"></AutoComplete>
          <div style="display: inline-block">
            <Button>查询</Button>
            <Button>重置</Button>
          </div>
        </FormItem>
        <FormItem>
          <div>
            <Button @click="openModel">添加</Button>
            <Button @click="onDelete=true">删除</Button>
          </div>
        </FormItem>
      </Form>
    </div>
    <Table border :columns="columns1" :data="data1" class="my-table" @on-selection-change="checkIndex"></Table>
    <!-- 添加，修改 -->
    <Modal v-model="modal2" :title="titleName" width="850">
      <Form :label-width="140">
        <FormItem label="消保名称:">
          <Input v-model="newTenAdd.MTname" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="消保图片:">
          <Row>
            <Col span="5">
            <template v-if="newTenAdd.uploadingPrc.status">
              <img class="upPrc" :src="newTenAdd.uploadingPrc.src">
            </template>
            <template v-else>
              <Upload action="" @on-success="prcSuccess" :before-upload="uploadAdd" :on-success="uploadCommited">
                <Button type="dashed" long icon="plus-round" class="addPhoto">新增图片</Button>
              </Upload>
            </template>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="简介:">
          <Input type="textarea" v-model="newTenAdd.MTdetail" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="详细说明:">
          <quill-editor ref="myTextEditor" :options="editorOption"></quill-editor>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelEditMT">取消</Button>
        <Button @click="addorEditMT">确认</Button>
      </div>
    </Modal>
    <!-- 删除操作 -->
    <Modal v-model="onDelete" title="确认删除">
      <div>确认删除该数据么？</div>
      <div slot="footer">
        <Button @click="onDelete=false">取消</Button>
        <Button @click="moreDelete">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import { quillEditor } from 'vue-quill-editor'
  export default {
    name: 'mainTenance',
    components: {
      quillEditor
    },
    data () {
      return {
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '编号',
            key: 'id'
          },
          {
            title: '消保图片',
            key: 'uploadingPrc',
            render: (h, params) => {
              return h('img', {
                style: {
                  width: '60px',
                  height: '60px'
                },
                domProps: {
                  src: params.row.uploadingPrc.src
                }
              })
            }
          },
          {title: '消保名称', key: 'MTname'},
          {
            title: '消保简介', key: 'MTdetail'
          },
          {
            title: '排序号',
            key: 'MTnumber',
            render: (h, params) => {
              if (this.data1[params.index].sortEditing) {
                return h('div', [
                  h('Icon', {
                    props: {type: 'checkmark-circled'}
                  }),
                  h('Input', {
                    props: {value: params.row.sortNo, size: 'small'},
                    on: {
                      'on-change': (val) => {
                        params.row.tempSortNo = val.target.value
                        console.log(params.row.tempSortNo)
                      },
                      'on-blur': () => {
                        if (!params.row.tempSortNo) {
                          this.data1[params.index].sortEditing = false
                        } else if (params.row.tempSortNo.length === 0) {
                          this.$Message.warning({content: '请输入排序数值'})
                        } else if (!/^\d+$/.test(params.row.tempSortNo)) {
                          this.$Message.warning({content: '排序值应为数字'})
                        } else {
                          // TODO 修改排序值
                          this.data1[params.index].sortNo = params.row.tempSortNo
                          this.data1[params.index].sortEditing = false
                          this.$Message.success({content: '操作成功'})
                        }
                      },
                      'on-enter': () => {
                        if (!params.row.tempSortNo) {
                          this.data1[params.index].sortEditing = false
                        } else if (params.row.tempSortNo.length === 0) {
                          this.$Message.warning({content: '请输入排序数值'})
                        } else if (!/^\d+$/.test(params.row.tempSortNo)) {
                          this.$Message.warning({content: '排序值应为数字'})
                        } else {
                          // TODO 修改排序值
                          this.data1[params.index].sortNo = params.row.tempSortNo
                          this.data1[params.index].sortEditing = false
                          this.$Message.success({content: '操作成功'})
                        }
                      }
                    },
                    style: {width: '40px', 'margin-left': '2px'}
                  })
                ])
              } else {
                return h('div', {
                  on: {
                    click: () => {
                      console.log(params.index)
                      console.log(this.data1)
                      this.data1[params.index].sortEditing = true
                    }
                  }
                }, [
                  h('Icon', {
                    props: {type: 'edit'}
                  }),
                  h('span', {
                    style: {'margin-left': '10px'}
                  }, params.row.sortNo)
                ])
              }
            }
          },
          {title: '创建时间', key: 'MTcreatedate', width: 180},
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'text', size: 'small'},
                  on: {
                    click: () => {
                      this.openModel(params)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {type: 'text', size: 'small'},
                  on: {
                    click: () => {
                      this.deleteMT(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        data1: [
          {id: '123', MTname: '7天无理由退货', uploadingPrc: {src: 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar', name: '', status: true}, MTdetail: '卖家就该商品退货服务向买...', MTcreatedate: '2016-4-14 09:00:00', sortNo: '4', sortEditing: false},
          {id: '124', MTname: '商品如实描述', uploadingPrc: {src: 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar', name: '', status: true}, MTdetail: '', MTcreatedate: '2016-4-14 19:02:00', sortNo: '4', sortEditing: false},
          {id: '125', MTname: '48小时快速发货', uploadingPrc: {src: 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar', name: '', status: true}, MTdetail: '', MTcreatedate: '2016-5-14 09:02:00', sortNo: '4', sortEditing: false}
        ],
        dataMTname: [],
        editIndex: '',
        deleteIndex: [],
        value1: '',
        modal2: false,
        onDelete: false,
        // 添加消保 数据
        newTenAdd: {
          id: '',
          MTname: '',
          MTdetail: '',
          MTcreatedate: '',
          sortEditing: false,
          sortNo: '',
          // 添加消保 正在上传的图片数据
          uploadingPrc: {
            src: 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar',
            name: '',
            status: false
          }
        },
        editorOption: {
          // debug: 'info',
          placeholder: '编辑详情',
          theme: 'snow'
        }
      }
    },
    mounted () {
      this.getIndex()
    },
    methods: {
      prcSuccess () {
        this.uploadingPrc.status = true
        // this.$Message.warning({content: 'success upload!'})
      },
      uploadAdd (file) {
        console.log(file)
        this.newTenAdd.uploadingPrc.name = file.name
        this.newTenAdd.uploadingPrc.status = true
      },
      uploadCommited (file) {

      },
      handleSearch (value) {
        console.log(value)
      },
      deleteMT (index) {
        this.data1.splice(index, 1)
      },
      checkIndex (selection) {
        console.log(selection)
        this.deleteIndex = []
        for (let obj of selection) {
          this.deleteIndex.push(obj.index)
        }
        console.log(this.deleteIndex)
      },
      // 重组没被勾选的数据，实现删除效果
      moreDelete () {
        if (this.data1.length !== 0) {
          let arr = []
          for (let i in this.data1) {
            if (this.deleteIndex.indexOf(parseInt(i)) === -1) {
              arr.push(this.data1[i])
            }
          }
          this.data1 = arr
          console.log(arr)
          console.log(this.data1)
          if (this.deleteIndex.length === 0) {
            this.$Message.warning({content: '请选择所要删除的数据'})
            this.onDelete = false
          } else {
            this.$Message.success({content: '操作成功'})
            this.onDelete = false
          }
          this.deleteIndex = []
          this.getIndex()
        } else if (this.data1.length === 0) {
          this.$Message.warning({content: '无数据可操作'})
          this.onDelete = false
        }
      },
      getIndex () {
        for (let i in this.data1) {
          this.data1[i].index = parseInt(i)
        }
      },
      // 添加 修改
      getTime () {
        let date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth() + 1  // 获取月份  返回0-11
        let d = date.getDate() // 获取日
        let h = date.getHours()
        let minute = date.getMinutes()
        let s = date.getSeconds()
        let Time = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s
        return Time
      },
      openModel (params) {
        console.log('我在修改这个----------------------' + params)
        if (params.row) {
          console.log('*')
          console.log(params.row)
          console.log('*')
          this.editIndex = params.index
          // this.newTenAdd = params.row
          this.newTenAdd = JSON.parse(JSON.stringify(params.row))
        }
        // console.log(this.newTenAdd.uploadingPrc.status)
        this.modal2 = true
      },
      // 取消新增窗口弹出框
      cancelEditMT () {
        // 置空数据
        this.newTenAdd.MTname = ''
        this.newTenAdd.uploadingPrc.src = null
        this.newTenAdd.uploadingPrc.status = false
        // 关闭窗口
        this.modal2 = false
      },
      addorEditMT () {
        if (this.newTenAdd.MTname.length === 0) {
          this.$Message.warning({content: '消保名称不可为空'})
          this.modal2 = false
        } else if (this.newTenAdd.id.length === 0) {
          this.addMT(() => {
            this.modal2 = false
            this.clearForm()
            this.$Message.success({content: '操作成功'})
          })
        } else {
          this.editMT(() => {
            this.modal2 = false
            this.clearForm()
          })
        }
      },
      addMT (callback) {
        this.formItem.MTcreatedate = this.getTime()
        this.formItem.sortNo = '0'
        let newForm = JSON.parse(JSON.stringify(this.formItem))
        this.data1.push(newForm)
        if (callback) {
          if (typeof callback === 'function') {
            callback()
          }
        }
      },
      editMT (callback) {
        console.log('*')
        console.log(this.data1[this.editIndex])
        console.log('*')
        let newForm = JSON.parse(JSON.stringify(this.formItem))
        this.data1[this.editIndex] = newForm
        console.log('*')
        console.log(newForm)
        console.log('*')
        this.editIndex = ''
        if (callback) {
          if (typeof callback === 'function') {
            callback()
          }
        }
      },
      clearForm () {
        this.formItem = {
          id: '',
          MTname: '',
          MTdetail: '',
          MTcreatedate: '',
          sortEditing: false,
          sortNo: '0'
        }
      }
    },
    computed: {
      dMTname: function () {
        let data = []
        for (let obj of this.data1) {
          data.push(obj.MTname)
        }
        this.dataMTname = data
        return this.dataMTname
      },
      titleName: function () {
        if (this.newTenAdd.id.length === 0) {
          return '新增列表'
        } else {
          return '修改列表'
        }
      }
    }
  }
</script>
