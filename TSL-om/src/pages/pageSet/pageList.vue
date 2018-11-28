<style lang="scss" rel="stylesheet/scss" scoped>
  #pageList {
    min-width: 1000px;
    padding: 0px 10px 0px 10px;
    .search-bar {
      margin: 20px 0px 0px -16px;
    }
    .my-table {
      margin: 10px 0px 0px 0px;
    }
  }
</style>
<template>
  <div id="pageList">
    <Breadcrumb>
        <BreadcrumbItem>页面管理</BreadcrumbItem>
        <BreadcrumbItem>页面设置</BreadcrumbItem>
        <BreadcrumbItem>页面列表</BreadcrumbItem>
    </Breadcrumb>
    <Form inline class="search-bar">
      <FormItem label="页面名称：" :label-width="100"><Input v-model.trim="search.name" style="width: 150px;"></Input></FormItem>
      <FormItem label="页面分类：" :label-width="100">
        <Select style="width: 150px;" v-model="search.classify">
          <Option v-for="(item, index) in classList" :key="index" :value="item.name">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="页面状态：" :label-width="100">
        <Select style="width: 150px;" v-model="search.status">
          <Option :value="0">未发布</Option>
          <Option :value="1">已发布</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button @click="query" class="btn-w" type="primary">搜索</Button>
        <Button @click="reset" style="margin-left: 10px;" class="btn-w" type="primary">重置</Button>
      </FormItem>
    </Form>
    <Button @click="addPage" class="btn-w">添加</Button>
    <Table class="my-table" :columns="column1" :data="data1" height="400"></Table>
    <Modal v-model="copyModalFlag" title="复制窗">
      <Input id="link" type="text" v-model="link"/>
      <div slot="footer">
        <Button v-show="copyAble" type="primary" id="copyBtn" data-clipboard-target="#link">复制</Button>
        <p v-show="!copyAble">您的浏览器不支持自动复制功能，请全选链接后Ctrl+c复制</p>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import Clipboard from 'clipboard'
  import * as pageAPI from '../../services/homePage.es6'
  export default {
    name: 'pageList',
    data () {
      return {
        classList: [],
        search: {
          name: '',
          classify: '',
          status: ''
        },
        column1: [
          {title: '页面名称', key: 'name'},
          {title: '页面分类', key: 'classify'},
          {
            title: '页面状态',
            render: (h, params) => {
              if (parseInt(params.row.status) === 0) {
                return '未发布'
              } else if (parseInt(params.row.status) === 1) {
                return '已发布'
              }
            }
          },
          {title: '更新时间', key: 'updateDate'},
          {
            title: '操作',
            width: 250,
            render: (h, params) => {
              let arr = []
              arr.push(h(
                'a', {
                  attrs: { href: 'javascript:' },
                  style: {margin: '0px 10px 0px 0px'},
                  on: {
                    click: () => {
                      this.$router.push({path: `setPage?page=${params.row.id}`})
                    }
                  }
                }, '编辑'
              ))
              if (parseInt(params.row.status) === 1) {
                arr.push(h(
                  'a', {
                    attrs: { href: 'javascript:' },
                    style: {margin: '0px 10px 0px 0px'},
                    on: {click: () => {
                      let a = encodeURIComponent(`${params.row.classify}`)
                      let b = encodeURIComponent(`${params.row.name}`)
                      let c = encodeURIComponent(`${params.row.id}`)
                      // TODO 定链接
                      // 生产环境
                    //  this.link = params.row.isFlag ? 'eshop.tslj.cn' : `eshop.tslj.cn/#/page/${a}/${b}/${c}`
                      // uat 环境下的
                      // this.link = params.row.isFlag ? 'eshopuat.tslj.cn' : `eshopuat.tslj.cn/#/page/${a}/${b}/${c}`
//                      this.link = params.row.isFlag ? 'eshopuat.tslj.cn' : `eshopuat.tslj.cn/#/page/${params.row.classify}/${params.row.name}/${params.row.id}`
                      // sit 环境下的
                     this.link = params.row.isFlag ? 'www.isszp.com' : `www.isszp.com/#/page/${params.row.classify}/${params.row.name}/${params.row.id}`
                      this.copyModalFlag = true
                    }}
                  }, '复制链接'
                ))
                if (parseInt(params.row.isFlag) === 1) {
                  arr.push(h(
                    'a', {
                      style: {margin: '0px 10px 0px 0px'},
                      attrs: { href: 'javascript:' }
                    }, '主页'
                  ))
                } else if (parseInt(params.row.isFlag) === 0) {
                  arr.push(h(
                    'a', {
                      style: {margin: '0px 10px 0px 0px'},
                      attrs: { href: 'javascript:' },
                      on: {
                        click: () => {
                          if (parseInt(params.row.status) === 0) {
                            this.$Message.warning('只可设置已发布页面为主页')
                          } else {
                            this.postHome(params.row.id)
                          }
                        }
                      }
                    }, '设为主页'
                  ))
                }
              }
              arr.push(h(
                'a', {
                  attrs: { href: 'javascript:' },
                  on: {
                    click: () => {
                      let config = {
                        title: '删除',
                        content: '所要删除的页面可能正在被使用，如点击删除会引起页面找不到的问题，确定删除？',
                        onOk: () => {
                          this.$http.delete(...pageAPI.deleteTemplate(params.row.id)).then(res => {
                            if (res.data.code === 200) {
                              this.getPageList()
                              this.$Message.success('删除成功')
                            } else {
                              this.$Message.error('删除失败')
                            }
                          })
                        }
                      }
                      if (params.row.isFlag === 1) {
                        this.$Message.warning('不可删除主页')
                      } else {
                        this.$Modal.confirm(config)
                      }
                    }
                  }
                }, '删除'
              ))
              return h('div', {}, arr)
            }
          }
        ],
        data1: [],
        datas: [],
        link: '',
        copyBtn: '',
        copyModalFlag: false
      }
    },
    mounted: function () {
      this.getClassify()
      this.getPageList()
      this.copyBtn = new Clipboard('#copyBtn')
    },
    methods: {
      getClassify () {
        this.$http.get(...pageAPI.getClassify()).then(response => {
          if (response.data.code === 200) {
            this.classList = response.data.classify
          }
        })
      },
      query () {
        let num = 0
        let data1 = []
        if (this.search.name !== '') {
          num++
          for (let i of this.datas) {
            if (i.name.indexOf(this.search.name) !== -1) {
              data1.push(i)
            }
          }
        }
        let data2 = []
        if (this.search.classify !== '') {
          num++
          for (let i of this.datas) {
            if (i.classify.indexOf(this.search.classify) !== -1) {
              data2.push(i)
            }
          }
        }
        let data3 = []
        if (this.search.status !== '') {
          num++
          for (let i of this.datas) {
            if (i.status === this.search.status) {
              data2.push(i)
            }
          }
        }
        let oldData = data1.concat(data2, data3)
        console.log(oldData)
        let newData = []
        if (num === 1) {
          newData = oldData
        } else {
          let qobj = {}
          for (let i of oldData) {
            if (!qobj[i.id]) {
              qobj[i.id] = 1
            } else {
              qobj[i.id] += 1
              if (qobj[i.id] === num) {
                newData.push(i)
              }
            }
          }
        }
        this.data1 = newData
      },
      reset () {
        this.search.name = ''
        this.search.classify = ''
        this.search.status = ''
        this.getPageList()
      },
      getPageList () {
        this.$http.get(...pageAPI.getTemplates()).then(res => {
          if (res.data.code === 200) {
            let template = res.data.template
            let home = ''
            for (let i in template) {
              if (template[i].isFlag === 1) {
                home = template.splice(i, 1)
              }
            }
            if (home) {
              template.unshift(home[0])
            }
            this.data1 = res.data.template
            this.datas = res.data.template
          }
        })
      },
      postHome (templateId) {
        this.$http.post(...pageAPI.postHome(templateId)).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('操作成功')
            this.getPageList()
          } else {
            this.$Message.error('操作失败')
          }
        })
      },
      addPage () {
        this.$router.push({path: 'pageTemplate'})
      }
    },
    computed: {
      copyAble () {
        return Clipboard.isSupported()
      }
    },
    watch: {
      copyModalFlag (flag) {
        if (!flag) {
          this.link = ''
        }
      }
    }
  }
</script>
