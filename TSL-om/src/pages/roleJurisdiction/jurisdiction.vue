<style scoped>
  #jurisdiction {
    min-width: 980px;

  }
  .margin-10 {
    margin: 10px;
  }
  .width-95 {
    margin: 10px auto;
    width: 98%;
  }
</style>
<template>
  <div id="jurisdiction">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>账户权限管理</BreadcrumbItem>
      <BreadcrumbItem>用户权限管理</BreadcrumbItem>
    </Breadcrumb>

    <div class="margin-10">
      <Button @click="handleRole" type="primary">添加角色</Button>
    </div>

    <div class="width-95">
      <Table :columns="columns" :data="data"></Table>
    </div>

    <Modal :title="roleTitle" v-model="roleModal">
      <Form :label-width="150" ref="roleRef" :model="roleForm" :rules="roleRules">
        <FormItem label="角色名称 :" prop="name">
          <Input style="width: 200px" v-model="roleForm.name" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="描述 :">
          <Input type="textarea" style="width: 200px" v-model="roleForm.description" :autosize="{minRows: 3,maxRows: 4}" :maxlength="200"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="roleConfirm">确认</Button>
        <Button @click="roleModal=false">取消</Button>
      </div>
    </Modal>
    <Modal title="角色信息" v-model="roleInfoModal" width="400">
      <div>
        <ul style="font-size: 16px">
          <li><span>角色名称:</span><span style="margin: 10px">{{roleForm.name}}</span></li>
          <li><span>角色描述:</span><span style="margin: 10px">{{roleForm.description}}</span></li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="primary" @click="roleInfoModal=false">确认</Button>
        <Button @click="roleInfoModal=false">取消</Button>
      </div>
    </Modal>
    <Modal title="权限设置" v-model="setPower" :styles="{top: '20px'}">
      <div style="margin: 20px">
        <Tree :data="powerTree" show-checkbox @on-check-change="checkPower" ref="ptree"></Tree>
      </div>
      <div slot="footer">
        <Button type="primary" @click="confirmPower">确认</Button>
        <Button @click="setPower=false">取消</Button>
      </div>
    </Modal>
    <Loading :isload="loading"></Loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as ujAPI from '../../services/userjurisdiction.es6'
  import Loading from '../../components/loading.vue'
  export default {
    name: 'jurisdiction',
    components: {
      Loading
    },
    data () {
      return {
        roleTitle: '',
        roleModal: false,
        deleteModal: false,
        roleInfoModal: false,
        setPower: false,
        roleForm: {
          name: '',
          description: ''
        },
        deleteForm: {},
        roleRules: {
          name: [
            {
              required: true,
              message: '角色名称不能为空'
            },
            {
              validator: (rule, value, callback) => {
                if (!/^[A-Za-z0-9]+$/.test(value) && !/^[\u4e00-\u9fa5]+$/.test(value)) {
                  callback(new Error('角色名称不可包含特殊字符或空格'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        columns: [
          {
            title: '编号',
            key: 'code'
          },
          {
            title: '角色名称',
            key: 'name'
          },
          {
            title: '创建时间',
            key: 'createDate',
            render: (h, params) => {
              params.row.createNewDate = this.newTime(params.row.createDate)
              return h('div', {}, params.row.createNewDate)
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.getPower(params.row.id, (response) => {
                        this.setPower = true
                        let tree = response.data.menuVoList
                        console.log(tree)
                        // admin超级管理员，才拥有账户权限管理权限
                        for (let i in tree) {
                          if (tree[i].name === '账户权限管理') {
                            tree.splice(i, 1)
                          }
                        }
                        console.log(tree)
                        for (let a of tree) {
                          a.title = a.name
                          a.children = a.menuVoList
                          for (let b of a.children) {
                            b.title = b.name
                            b.children = b.menuVoList
                            for (let c of b.children) {
                              c.title = c.name
                              if (c.status === 1) {
                                c.checked = true
                              }
                            }
                          }
                        }
                        this.checkData[0] = params
                        this.powerTree = tree
                      })
                    }
                  }
                }, '设置权限'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleRole(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteModal = true
                      this.deleteForm = params.row
                      this.$Modal.confirm({
                        content: `是否确定删除该角色`,
                        onOk: () => {
                          let self = this
                          self.confirmDelete()
                        }
                      })
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
                      this.roleInfoModal = true
                      this.roleForm = params.row
                    }
                  }
                }, '查看')
              ])
            }
          }
        ],
        data: [],
        powerTree: [],
        checkData: [],
        loading: false
      }
    },
    mounted () {
      this.getGroups((response) => {
        this.data = response.data.groupVoList
      })
    },
    methods: {
      // ----------接口调用----------
      getGroups (callback) {
        this.$http.get(ujAPI.getGroups())
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      postInsertGroups (params, callback) {
        this.$http.post(...ujAPI.postInsertGroups(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              } else if (response.data.code === 20003) {
                this.$Message.warning({content: '该角色已存在'})
              }
            })
      },
      putupdateByGroup (params, callback) {
        this.$http.put(...ujAPI.putupdateByGroup(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      deleteGroup (id, callback) {
        this.$http.delete(ujAPI.deleteGroup(id))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              } else if (response.data.code !== 200) {
                this.deleteModal = false
              }
            })
      },
      getPower (id, callback) {
        this.$http.get(ujAPI.getPower(id))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      postBatchUpdateGroupMenu (params, callback) {
        this.$http.post(...ujAPI.postBatchUpdateGroupMenu(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      // ----------数据处理----------
      handleRole (val) {
        this.roleModal = true
        if (val) {
          this.roleForm = {
            id: val.id,
            name: val.name,
            description: val.description
          }
        }
      },
      roleConfirm () {
        this.$refs.roleRef.validate((valid) => {
          if (valid) {
            if (this.roleForm.id) {
              console.log(this.roleForm)
              this.putupdateByGroup(this.roleForm, () => {
                this.roleModal = false
                this.getGroups((response) => {
                  this.data = response.data.groupVoList
                })
              })
            } else {
              console.log(this.roleForm)
              this.postInsertGroups(this.roleForm, () => {
                this.roleModal = false
                this.getGroups((response) => {
                  this.data = response.data.groupVoList
                })
              })
            }
          } else {
            this.$Message.warning('请填写正确角色名称')
          }
        })
      },
      confirmDelete () {
        this.deleteGroup(this.deleteForm.id, () => {
          this.getGroups((response) => {
            this.data = response.data.groupVoList
          })
          this.deleteModal = false
        })
      },
      checkPower (val) {
        console.log(this.powerTree)
        let arr = [] // 所有节点
        for (let i of this.powerTree) {
          arr.push(i)
          for (let j of i.children) {
            arr.push(j)
            for (let k of j.children) {
              arr.push(k)
            }
          }
        }
        let tree = [] // 已选的tree对象(含未全选)
        let qobj = {}
        // 二级半选一级未选(选上一级),三级半选二级未选一级未选(选上二级)
        for (let i of val) {
          if (i.parentId !== '0') {
            for (let j of arr) {
              if (j.id === i.parentId && qobj[j.id] !== 1) {
                tree.push(j)
                qobj[j.id] = 1
              }
            }
          }
        }
        // 三级半选二级未选一级未选(选上二级)-补选一级
        for (let t of tree) {
          if (t.parentId !== '0') {
            for (let j of arr) {
              if (j.id === t.parentId && qobj[j.id] !== 1) {
                console.log(qobj[j.id])
                tree.push(j)
              }
            }
          }
        }
        qobj = {}
        let diffArr = []
        for (let i of tree) {
          for (let j of i.children) {
            if (j.checked !== true && qobj[i.id] !== 1) {
              diffArr.push(i)
              qobj[i.id] = 1
            }
          }
        }
        this.checkData[1] = val.concat(diffArr)
      },
      confirmPower () {
        let params = []
        if (!this.checkData[1]) {
          this.checkData[1] = []
        } else if (this.checkData[1].length > 0) {
          for (let a of this.checkData[1]) {
            params.push({
              id: a.id,
              parentId: a.parentId,
              opgroupId: this.checkData[0].row.id,
              name: a.name,
              status: 1
            })
          }
        } else {
          params.push({
            opgroupId: this.checkData[0].row.id
          })
        }
        console.log(this.checkData[1])
        this.postBatchUpdateGroupMenu(params, () => {
          this.$Message.success({content: '设置成功'})
          this.setPower = false
        })
      },
      // Time
      newTime (time) {
        let date = new Date(time)
        let Y = `${1900 + date.getYear()}`
        let M = `${date.getMonth() + 1}`
        let D = `${date.getDate()}`
        if (D < 10) {
          D = '0' + D
        }
        let H = `${date.getHours()}`
        if (H < 10) {
          H = '0' + H
        }
        let m = `${date.getMinutes()}`
        if (m < 10) {
          m = '0' + m
        }
        let s = `${date.getSeconds()}`
        if (s < 10) {
          s = '0' + s
        }
        return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s
      }
    },
    watch: {
      roleForm: function () {
        console.log(this.roleForm)
        if (this.roleForm.id) {
          this.roleTitle = '编辑权限角色'
        } else {
          this.roleTitle = '新增权限角色'
        }
      },
      roleModal: function () {
        if (this.roleModal) {
        } else {
          this.$refs['roleRef'].resetFields()
        }
      }
    },
    computed: {
      role: function () {
        return this.$store.state.userInfo.abb
      }
    }
  }
</script>
