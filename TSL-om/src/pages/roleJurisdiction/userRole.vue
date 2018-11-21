<style scoped>
  #userRole {
    min-width: 1100px;
  }
  .margin-10 {
    margin: 10px;
  }
  .width-25 {
    width: 25%;
    display: inline-block;
  }
  .urForm {
    margin: 10px;
  }
  .handlebtn {
    margin: 10px;
  }
  .urTable {
    width: 98%;
    margin: 0 auto;
  }
</style>
<template>
  <div id="userRole">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>账户权限管理</BreadcrumbItem>
      <BreadcrumbItem>用户角色管理</BreadcrumbItem>
    </Breadcrumb>

    <div class="urForm">
      <Form inline :label-width="80">
        <FormItem label="登录名:" class="width-25">
          <Input style="width: 200px" v-model="searchInfo.loginName" :maxlength="20"></Input>
        </FormItem>
        <FormItem label="真实名字:" class="width-25">
          <Input style="width: 200px" v-model="searchInfo.realName" :maxlength="10"></Input>
        </FormItem>
        <FormItem label="联系电话:" class="width-25">
          <Input style="width: 200px" v-model="searchInfo.mobile" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="状态:" class="width-25">
          <Select style="width: 200px" @on-change="selectChange" v-model="statusDefault">
            <Option v-for="item in statusList" :value="item.value" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="邮箱:" class="width-25">
          <Input style="width: 200px" v-model="searchInfo.email" :maxlength="30"></Input>
        </FormItem>
        <FormItem>
          <Button @click="testRules" class="btn-w" type="primary">查询</Button>
          <Button @click="resetForm" class="btn-w" type="primary">重置</Button>
        </FormItem>
      </Form>
    </div>

    <div class="handlebtn">
      <Button @click="addUser">添加用户</Button>
      <Button :disabled="deleteAble" @click="deleteMoreUser">删除用户</Button>
    </div>
    <div class="urTable">
      <Table :columns="columns" :data="data" @on-selection-change="selectData" height="500"></Table>
    </div>
    <div style="text-align: center; margin: 10px 0">
      <Page :current="pageNum" :page-size="pageSize" :total="total" show-total @on-change="pageChange"></Page>
    </div>

    <Modal v-model="adduserModal" :title="userTitle" :styles="{top: '20px'}" :mask-closable="false">
      <Form :label-width="180" :rules="addUserRules" :model="userInfo" ref="addUser">
        <FormItem label="选定角色 ：" prop="selectrole">
          <Select style="width: 200px" v-model="userInfo.selectrole" @on-change="selectRole">
            <Option v-for="item in roleList" :value="item.value" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="真实姓名 ：" prop="realName">
          <Input style="width: 200px" v-model="userInfo.realName" @on-change="handleName"></Input>
        </FormItem>
        <FormItem label="登录名 ：" prop="userName">
          <Input style="width: 200px" v-model="userInfo.userName" disabled></Input>
        </FormItem>
        <FormItem label="密码 ：">
          <Input style="width: 200px" v-model="userInfo.password" disabled></Input>
        </FormItem>
        <FormItem label="性别 :" prop="sex">
           <!-- @on-change="selectSexy" -->
          <RadioGroup v-model="userInfo.sex">
            <Radio label="0"><span>男</span></Radio>
            <Radio label="1"><span>女</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="联系电话 :" prop="mobile">
          <Input style="width: 200px" v-model="userInfo.mobile" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="邮箱 :" prop="email">
          <Input style="width: 200px" v-model="userInfo.email" :maxlength="30"></Input>
        </FormItem>
        <FormItem label="状态 :" prop="status">
          <RadioGroup v-model="userInfo.status" @on-change="selectStatus">
            <Radio label="1"><span>正用</span></Radio>
            <Radio label="2"><span>停用</span></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdduser">确定</Button>
        <Button @click="cancelAdduser">取消</Button>
        <Button @click="resetPwd" v-show="userInfo.operatorId" :disabled="userInfo.password==123456">重置密码</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  let getSkuCancel
  let timeout
  import * as ujAPI from '../../services/userjurisdiction.es6'
  import {chinesePointCode} from '../../libs/pyCode.js'
  export default {
    name: 'userRole',
    data () {
      return {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pyName: '',
        userTitle: '',
        adduserModal: false,
        deleteAble: true,
        userNameExist: false,
        statusDefault: '全部',
        statusList: [
          {
            id: '0',
            value: '全部'
          },
          {
            id: '1',
            value: '停用'
          },
          {
            id: '2',
            value: '正用'
          }
        ],
        roleList: [],
        searchInfo: {
          loginName: '',
          realName: '',
          mobile: '',
          email: '',
          pageNum: 1,
          pageSize: 20
        },
        columns: [
          {
            type: 'selection',
            align: 'center',
            width: 60
          },
          {
            title: '真实姓名',
            align: 'center',
            key: 'realName',
            width: 150
          },
          {
            title: '登录名',
            align: 'center',
            key: 'loginName',
            width: 100
          },
          {
            title: '性别',
            align: 'center',
            width: 80,
            render: (h, params) => {
              if (params.row.sex === 0) {
                params.row.sexCn = '男'
              } else if (params.row.sex === 1) {
                params.row.sexCn = '女'
              }
              return h('div', {}, params.row.sexCn)
            }
          },
          {
            title: '状态',
            align: 'center',
            width: 80,
            render: (h, params) => {
              switch (params.row.status) {
                case 0: {
                  params.row.statusCn = '未用'
                  break
                }
                case 1: {
                  params.row.statusCn = '正用'
                  break
                }
                case 2: {
                  params.row.statusCn = '停用'
                  break
                }
                case 3: {
                  params.row.statusCn = '删除'
                  break
                }
                default: {
                  break
                }
              }
              return h('div', {}, params.row.statusCn)
            }
          },
          {
            title: '联系电话',
            align: 'center',
            key: 'mobile',
            width: 150
          },
          {
            title: '邮箱',
            align: 'center',
            key: 'email',
            width: 200
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'creatDate',
            width: 180
          },
          {
            title: '角色',
            align: 'center',
            key: 'role',
            width: 100
          },
          {
            title: '操作',
            align: 'center',
            width: 180,
            render: (h, params) => {
              // status 0未用、1正用、2停用、3删除
              if (params.row.status === 2) {
                params.row.statusZn = '正用'
              } else if (params.row.status === 1) {
                params.row.statusZn = '停用'
              }
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.addUser(params.row)
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
                      this.deleteOneArr = [params.row.operatorId]
                      this.deleteMoreUser()
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
                      if (params.row.status === 2) {
                        this.upOperator(params.row.operatorId, () => {
                          this.loadPage()
                          this.$Message.success({content: '启用成功'})
                        })
                      } else if (params.row.status === 1) {
                        this.offOperator(params.row.operatorId, () => {
                          this.loadPage()
                          this.$Message.success({content: '停用成功'})
                        })
                      }
                    }
                  }
                }, params.row.statusZn)
              ])
            }
          }
        ],
        data: [],
        userInfo: {},
        addUserRules: {
          selectrole: [
            {
              required: true,
              message: '选择角色不可为空'
            }
          ],
          realName: [
            {
              required: true,
              message: '真实姓名不可为空',
              type: 'string',
              trigger: 'change'
            },
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('真实姓名不可为空'))
                } else if (!/^[a-zA-Z]+$/.test(value) && !/^[\u4e00-\u9fa5]+$/.test(value)) {
                  return callback(new Error('真实姓名只全可为中文或英文'))
                } else {
                  // 异步验证
                  console.log(value)
                  this.handleName()
                  if (this.userInfo.userName !== this.userInfo.oldUserName) {
                    this.getUserName(this.userInfo.userName, (response) => {
                      this.userInfo.userName = response.data.username
                      callback()
                    })
                  } else {
                    callback()
                  }
                }
              },
              trigger: 'blur'
            }
          ],
          userName: [
            {
              required: true,
              message: '请输入正确的真实姓名',
              trigger: 'change'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入正确联系电话',
              trigger: 'change',
              pattern: /^[0-9]{11}$/
            }
          ],
          email: [
            {required: true, message: '邮箱不可为空', trigger: 'change'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          ]
        },
        deleteArr: [],
        deleteOneArr: []
      }
    },
    mounted () {
      this.loadPage()
    },
    methods: {
      // ---------接口调试--------
      postUserList (params, callback) {
        this.$http.post(...ujAPI.postUserList(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      upOperator (operatorId, callback) {
        this.$http.put(ujAPI.upOperator(operatorId))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      offOperator (operatorId, callback) {
        this.$http.post(ujAPI.offOperator(operatorId))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      getOperatorUser (callback) {
        this.$http.get(ujAPI.getOperatorUser())
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      getUserName (params, callback) {
        if (!timeout) {
          timeout = setTimeout(() => {
            this.$http.get(...ujAPI.getUserName(params).concat({
              cancelToken: new this.$http.CancelToken(function (cancel) {
                if (typeof getSkuCancel === 'function') {
                  getSkuCancel()
                }
                getSkuCancel = cancel
              })
            })).then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
              clearTimeout(timeout)
              timeout = ''
            })
          }, 1000)
        }
      },
      addOperator (params, callback) {
        this.$http.post(...ujAPI.addOperator(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      editOperator (params, callback) {
        this.$http.post(...ujAPI.editOperator(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      deleteOperator (params, callback) {
        this.$http.post(...ujAPI.deleteOperator(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              } else if (response.data.code === 10002) {
                this.$Message.warning({content: '该用户正在正用状态不可删除'})
              }
            })
      },
      getResetPwd (id, callback) {
        this.$http.get(ujAPI.getResetPwd(id))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              } else if (response.data.code === 10019) {
                this.$Message.warning({content: response.data.message})
              }
            })
      },
      // ---------数据调用--------
      setData (UserData) {
        if (UserData.productInfos === null) {
          this.data = []
          this.pageNum = 1
          this.pageSize = 20
          this.total = 0
        } else {
          this.data = UserData.productInfos.list
          this.pageNum === 0 ? 1 : UserData.productInfos.pageNum
          this.pageSize = UserData.productInfos.pageSize
          this.total = UserData.productInfos.total
        }
      },
      loadPage (callback) {
        // 获取用户角色列表
        this.postUserList(this.searchParams, (res) => {
          let UserData = res.data
          this.setData(UserData)
          this.deleteArr = []
        })
        if (typeof callback === 'function') {
          callback()
        }
      },
      // 添加用户form
      addUser (val) {
        this.getOperatorUser((res) => {
          let operatorData = res.data
          this.roleList = []
          for (let a of operatorData.productInfos) {
            this.roleList.push({
              id: a.code,
              value: a.name,
              roleName: a.id
            })
          }
          this.adduserModal = true
          console.log(val)
          if (val) {
            this.userInfo = {
              operatorId: val.operatorId,
              selectrole: val.role,
              realName: val.realName,
              oldRealName: val.realName,
              userName: val.loginName,
              oldUserName: val.loginName,
              mobile: val.mobile,
              email: val.email,
              sex: val.sex,
              status: val.status
            }
            // 1为初始密码，2为已修改过密码
            if (val.pwdStatus === 1) {
              this.userInfo.password = '123456'
            } else {
              this.userInfo.password = '******'
            }
          }
        })
      },
      // 真实姓名转换用户名
      handleName () {
        let realToLoginName = ''
        let cnCode
        console.log(this.userInfo.oldRealName)
        console.log(this.userInfo.realName)
        if (this.userInfo.oldRealName === this.userInfo.realName) {
          this.userInfo.userName = this.userInfo.oldUserName
          return
        }
        // 是否为中文
        if (/^[\u4e00-\u9fa5]+$/.test(this.userInfo.realName)) {
          for (let a of this.userInfo.realName) {
            cnCode = a.charCodeAt(0)
            realToLoginName = realToLoginName.concat(this.chineseUniCode[cnCode])
          }
          console.log(realToLoginName)
          this.userInfo.userName = realToLoginName
        } else {
          if (this.userInfo.realName.length > 0) {
            // 判断英文输入
            if (/^[a-zA-Z]*$/.test(this.userInfo.realName)) {
              this.userInfo.userName = this.userInfo.realName
            } else {
              this.userInfo.userName = ''
            }
          } else {
            this.userInfo.userName = ''
          }
        }
      },
      confirmAdduser () {
        this.$refs.addUser.validate((valid) => {
          if (valid) {
            if (this.userInfo.operatorId) {
              delete this.userInfo.password
              this.editOperator(this.userInfo, () => {
                this.loadPage(() => {
                  this.$Message.success('操作成功')
                  this.$refs.addUser.resetFields()
                  this.adduserModal = false
                })
              })
            } else {
              delete this.userInfo.selectrole
              console.log(this.userInfo)
              this.addOperator(this.userInfo, () => {
                this.loadPage(() => {
                  this.$Message.success('操作成功')
                  this.$refs.addUser.resetFields()
                  this.adduserModal = false
                })
              })
            }
            console.log(this.userInfo)
          } else {
            this.$Message.warning('请补充完整添加用户信息')
          }
        })
      },
      cancelAdduser () {
        this.adduserModal = false
      },
      // 分页
      pageChange (val) {
        this.searchParams.pageNum = val
        this.loadPage()
      },
      // 搜索
      testRules () {
        if (/[^\w]/ig.test(this.searchInfo.loginName)) {
          this.$Message.warning({content: '登录名只可输入英文字母或数字'})
          return
        } else {
          console.log(this.searchParams)
          this.searchParams.pageNum = 1
          this.loadPage()
        }
      },
      // 重置
      resetForm () {
        this.searchInfo = {
          loginName: '',
          realName: '',
          mobile: '',
          email: '',
          status: 0
        }
        this.statusDefault = '全部'
        console.log(this.searchParams)
        this.loadPage()
      },
      // 状态改变
      selectChange (val) {
        console.log(val)
        switch (val) {
          case '停用': {
            this.searchParams.status = 2
            console.log(this.searchParams)
            break
          }
          case '正用': {
            this.searchParams.status = 1
            console.log(this.searchParams)
            break
          }
          case '全部': {
            this.searchParams.status = ''
            console.log(this.searchParams)
            break
          }
        }
      },
      // 角色MODAL
      selectRole (val) {
        for (let a of this.roleList) {
          if (val === a.value) {
            this.userInfo.roleName = a.roleName
          }
        }
      },
      // selectSexy (val) {
      //   this.userInfo.sex = Number(val)
      // },
      selectStatus (val) {
        console.log(typeof val)
        this.userInfo.status = Number(val)
      },
      resetPwd () {
        this.getResetPwd(this.userInfo.operatorId, () => {
          this.adduserModal = false
          this.$Message.success({content: '重置密码成功'})
        })
        console.log(this.userInfo.operatorId)
      },
      // 删除用户操作
      // 批量删除
      selectData (val) {
        let b = []
        if (val.length > 0) {
          console.log(val)
          for (let a of val) {
            b.push(a.operatorId)
          }
        }
        this.deleteOneArr = b
      },
      deleteMoreUser () {
        console.log(this.deleteOneArr)
        if (this.deleteOneArr.length <= 1) {
          this.$Modal.confirm({
            content: `是否确定删除该角色`,
            onOk: () => {
              let self = this
              setTimeout(() => {
                self.confirmDelete()
              }, 500)
            }
          })
        } else if (this.deleteOneArr.length > 1) {
          this.$Modal.confirm({
            content: `是否确定删除${this.deleteOneArr.length}个角色`,
            onOk: () => {
              let self = this
              setTimeout(() => {
                self.confirmDelete()
              }, 500)
            }
          })
        }
      },
      confirmDelete () {
        console.log(this.deleteOneArr)
        this.deleteOperator(this.deleteOneArr, () => {
          this.loadPage()
          this.deleteOneArr = []
          this.deleteModal = false
        })
      }
    },
    computed: {
      searchParams: function () {
        let searchParams = {
          loginName: this.searchInfo.loginName,
          email: this.searchInfo.email,
          mobile: this.searchInfo.mobile,
          realName: this.searchInfo.realName,
          pageNum: 1,
          pageSize: 20
        }
        for (let a in searchParams) {
          if (searchParams[a] === '') {
            delete searchParams[a]
          }
        }
        console.log(searchParams)
        return searchParams
      },
      chineseUniCode: function () {
        let arr = []
        let chineseUniCode = chinesePointCode
        for (let a in chineseUniCode) {
          chineseUniCode[a].forEach(e => {
            arr[e] = a
          })
        }
        return arr
      }
    },
    watch: {
      userInfo: function () {
        console.log(this.userInfo)
        if (this.userInfo.operatorId) {
          this.userTitle = '编辑用户'
        } else {
          this.userTitle = '添加用户'
          this.userInfo.sex = 0
          this.userInfo.status = 1
          this.userInfo.password = '123456'
        }
      },
      adduserModal: function () {
        if (this.adduserModal === false) {
          this.$refs.addUser.resetFields()
        }
      },
      deleteOneArr: function () {
        if (this.deleteOneArr.length > 1) {
          this.deleteAble = false
        } else {
          this.deleteAble = true
        }
      }
    }
  }
</script>
