<style lang="scss" rel="stylesheet/scss" scoped>
  #classList {
    padding: 0px 10px 10px 10px;
    min-width: 1000px;
    .search-bar {
      margin: 20px 0px 0px -16px;
    }
    .my-table {
      margin: 10px 0px 0px 0px;
    }
  }
</style>
<template>
  <div id="classList">
    <Breadcrumb>
      <BreadcrumbItem>页面管理</BreadcrumbItem>
      <BreadcrumbItem>页面分类</BreadcrumbItem>
    </Breadcrumb>
    <Form inline class="search-bar">
      <FormItem label="分类名称：" :label-width="100"><Input v-model="searchName"></Input></FormItem>
      <FormItem>
        <Button @click="query" class="btn-w" type="primary">搜索</Button>
        <Button @click="reset" style="margin-left:10px;" class="btn-w" type="primary">重置</Button>
      </FormItem>
    </Form>
    <Button @click="openEditModal" class="btn-w">添加</Button>
    <Table :columns="column1" :data="data1" width="1000" height="400" class="my-table"></Table>
    <Modal :title="modalTitle" v-model="editFlag">
      <Form :model="editObj" :rules="editObjaRules" :label-width="100" ref="editForm">
        <FormItem label="分类名称：" prop="name">
          <Input v-model.trim="editObj.name" :maxlength="20"></Input>
        </FormItem>
        <FormItem label="备注：">
          <Input type="textarea" :maxlength="50" v-model="editObj.memo"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="onOk" :loading="okLoading">确定</Button>
        <Button @click="onCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pageAPI from '../../services/homePage.es6'
  export default {
    name: 'classList',
    data () {
      return {
        searchName: '',
        column1: [
          {title: '分类名称', key: 'name'},
          {title: '包含页面数', key: 'pageNum', sortable: true},
          {title: '更新时间', key: 'updateDate'},
          {
            title: '操作',
            width: 150,
            render: (h, params) => {
              let arr = [
                h('a', { attrs: { href: 'javascript:' }, on: { 'click': () => { this.openEditModal(params) } }, style: {margin: '0px 10px 0px 0px'} }, '编辑'),
                h('a', {
                  attrs: { href: 'javascript:' },
                  on: {
                    'click': () => {
                      if (params.row.pageNum === 0) {
                        this.removeClassify(params.row.id)
                      } else {
                        this.$Message.warning('分类下有页面，不可删除')
                      }
                    }
                  }
                }, '删除')
              ]
              return h('div', {}, arr)
            }
          }
        ],
        data1: [],
        datas: [],
        editObj: {
          id: '',
          name: '',
          memo: ''
        },
        editFlag: false,
        editObjaRules: {
          name: [{required: true, message: '分类名称不可为空', tagger: 'blur'}]
        },
        okLoading: false,
        delLoading: false
      }
    },
    mounted: function () {
      this.getClassify()
    },
    methods: {
      query () {
        if (this.searchName !== '') {
          let data1 = []
          for (let i of this.datas) {
            if (i.name.indexOf(this.searchName) !== -1) {
              data1.push(i)
            }
          }
          this.data1 = data1
        }
      },
      reset () {
        this.searchName = ''
        this.getClassify()
      },
      getClassify () {
        this.$http.get(...pageAPI.getClassify()).then(response => {
          if (response.data.code === 200) {
            this.data1 = response.data.classify
            this.datas = response.data.classify
          }
        })
      },
      postClassify (params) {
        this.$http.post(...pageAPI.postClassify(params)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('新增成功')
            this.editFlag = false
            this.getClassify()
          } else {
            this.$Message.error('新增失败')
          }
          this.okLoading = false
        }).catch(() => {
          this.$Message.error('新增失败')
          this.okLoading = false
        })
      },
      putClassify (params) {
        this.$http.put(...pageAPI.putClassify(params)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('编辑成功')
            this.editFlag = false
            this.getClassify()
          } else {
            this.$Message.error('编辑失败')
          }
          this.okLoading = false
        }).catch(() => {
          this.$Message.error('编辑失败')
          this.okLoading = false
        })
      },
      deleteClassify (classifyId) {
        this.$http.delete(...pageAPI.deleteClassify(classifyId)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('删除成功')
            this.getClassify()
          } else {
            this.$Message.error('删除失败')
          }
          this.delLoading = false
        }).catch(() => {
          this.$Message.error('删除失败')
          this.delLoading = false
        })
      },
      openEditModal (params) {
        if (params.row) {
          this.editObj.id = params.row.id
          this.editObj.name = params.row.name
          this.editObj.memo = params.row.memo
        }
        this.editFlag = true
      },
      onOk () {
        this.okLoading = true
        this.$refs.editForm.validate((valid) => {
          console.log(valid)
          if (valid) {
            for (let i of this.data1) {
              if (i.name === this.editObj.name && i.id !== this.editObj.id) {
                this.$Message.error('分类名已存在')
                this.okLoading = false
                return
              }
            }
            if (this.editObj.id) {
              this.putClassify(this.editObj)
            } else {
              this.postClassify(this.editObj)
            }
          }
          this.okLoading = false
        })
      },
      onCancel () {
        this.editFlag = false
      },
      removeClassify (classifyId) {
        let config = {
          title: '删除',
          content: '确定要删除吗？',
          onOk: () => {
            this.deleteClassify(classifyId)
          }
        }
        this.$Modal.confirm(config)
      }
    },
    computed: {
      modalTitle () {
        if (!this.editObj.id) {
          return '新增页面分类'
        } else {
          return '编辑页面分类'
        }
      }
    },
    watch: {
      editFlag (flag) {
        if (!flag) {
          if (this.$refs.editForm) {
            this.$refs.editForm.resetFields()
          }
          this.editObj.id = ''
          this.editObj.name = ''
          this.editObj.memo = ''
        }
      }
    }
  }
</script>
