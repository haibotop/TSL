<style lang="scss" rel="stylesheet/scss" scoped>
  #goldCalculation {
    min-width: 875px;
    height: 100%;
  }
  .gcSearch {
    margin: 10px;
    .labelSearch {
      margin-left: 18px;
    }
  }
  .gcAdd {
    margin: 10px;
    .addbtn {
      margin-left: 18px;
    }
    .tipsIcon {
      margin-left: 5px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .gcTable {
    width: 95%;
    margin:0 auto;
  }

</style>
<template>
  <div id="goldCalculation">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>商品后台管理</BreadcrumbItem>
      <BreadcrumbItem>金价计算</BreadcrumbItem>
    </Breadcrumb>
    <div class="gcAdd">
      <Button class="addbtn" @click="createNgp">新增金价设置</Button>
      <Tooltip class="tipsIcon" placement="right" content="最多输入26种类型金价">
        <Icon type="information-circled" size="20" style="margin:2px auto"></Icon>
      </Tooltip>
      <Button class="addbtn" @click="postGoldSolr">金价索引生成</Button>
      <div ></div>
    </div>
    <div class="gcTable">
      <Table :columns="columns" :data="data"></Table>
    </div>
    <Modal :title="GoldPriceTitle" v-model="GoldPriceBoolen">
      <Form :label-width="180" :model="goldInfo" :rules="goldInforules" ref="goldInfo">
        <FormItem label="材质名称 ：" prop="name">
          <Input placeholder="请输入材质名称" style="width: 200px;" v-model="goldInfo.name"></Input>
        </FormItem>
        <FormItem label="材质价格(元/克) ：" prop="value">
          <Input placeholder="请输入材质价格" style="width:200px;" v-model="goldInfo.value" @on-keyup="goldValue"></Input>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button @click="tipsConfirmNgp()" style="width: 150px">确认</Button>
      </div>
    </Modal>

    <Modal v-model="GoldParamBoolen" width="250" :styles="{top: '180px'}" :mask-closable="false">
      <div>是否确定将金价设置为{{goldInfo.value}}元/克?</div>
      <div slot="footer" style="text-align: center;" >
        <Button @click="confirmNgp('goldInfo')">确认</Button>
        <Button @click="cancelNgp">取消</Button>
      </div>
    </Modal>
    <Loading :isload="loading"></Loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as gpAPI from '../../../services/goldPrice.es6'
  import Loading from '../../../components/loading'
  export default {
    name: 'goldCalculation',
    components: {
      Loading
    },
    data () {
      return {
        columns: [
          {
            title: '材质名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '材质价格(元/克)',
            align: 'center',
            key: 'value',
            render: (h, params) => {
              return h('div', {}, `¥${params.row.value}`)
            }
          },
          {
            title: '最近更新时间',
            key: 'updateDate',
            align: 'center'
          },
          {
            title: '状态',
            align: 'center',
            render: (h, params) => {
              switch (params.row.status) {
                case 2: {
                  params.row.statusCn = '停用'
                  break
                }
                case 1: {
                  params.row.statusCn = '启用'
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
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 1) {
                params.row.statusCb = '停用'
              } else if (params.row.status === 2) {
                params.row.statusCb = '启用'
              }
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.createNgp(params.row)
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
                      if (params.row.status === 1) {
                        this.deleteGoldStatus(params.row.id, () => {
                          this.getGoldPrice((data) => {
                            this.data = data.goldPrice
                            this.$Message.success('操作成功')
                          })
                        })
                      } else if (params.row.status === 2) {
                        this.postGoldStatus(params.row.id, () => {
                          this.getGoldPrice((data) => {
                            this.data = data.goldPrice
                            this.$Message.success('操作成功')
                          })
                        })
                      }
                    }
                  }
                }, params.row.statusCb)
              ])
            }
          }
        ],
        data: [],
        status: '2',
        goldInfo: {
          name: '',
          value: ''
        },
        goldParams: {
          name: '',
          value: ''
        },
        goldInforules: {
          name: [
            {
              required: true,
              message: '材质名称不能为空',
              trigger: ['blur', 'change']
            }
          ],
          value: [
            {
              required: true,
              message: '请输入正确的材质价格',
              trigger: ['blur', 'change']
            }
          ]
        },
        GoldPriceTitle: '',
        GoldPriceBoolen: false,
        GoldParamBoolen: false,
        loading: false
      }
    },
    mounted () {
      this.loading = true
      this.getGoldPrice((data) => {
        this.data = data.goldPrice
        this.loading = false
      })
    },
    methods: {
      // ------------------接口调用----------
      getGoldPrice (callback) {
        this.$http.get(gpAPI.getGoldPrice())
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response.data)
                }
              }
            })
      },
      postGoldPrice (params, callback) {
        this.$http.post(...gpAPI.postGoldPrice(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response.data)
                }
              }
            })
      },
      putGoldPrice (params, callback) {
        this.$http.put(...gpAPI.putGoldPrice(params))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response.data)
                }
              }
            })
      },
      postGoldSolr () {
        this.$http.post(gpAPI.goldSolr())
      },
      // 启用 停用
      postGoldStatus (id, callback) {
        this.$http.post(gpAPI.GoldStatus(id))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },
      deleteGoldStatus (id, callback) {
        this.$http.delete(gpAPI.GoldStatus(id))
            .then((response) => {
              if (response.data.code === 200) {
                if (typeof callback === 'function') {
                  callback(response)
                }
              }
            })
      },

// -------------function -----------
      goldValue () {
        if (this.goldInfo.value) {
          this.goldInfo.value = this.goldInfo.value.replace(/[^\d]/g, '')
        }
        if (this.goldParams.value) {
          this.goldParams.value = this.goldParams.value.replace(/[^\d]/g, '')
        }
      },
      // 新增
      createNgp (val) {
        if (this.data.length === 26) {
          if (!val.id) {
            this.$Message.warning('金价类型已满')
            return
          }
        }
        this.GoldPriceBoolen = true
        if (val) {
          this.goldInfo = {
            id: val.id,
            name: val.name,
            value: val.value,
            key: val.key
          }
        }
      },
      // 确认&&取消
      confirmNgp (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.goldInfo.id) {
              console.log(this.goldInfo.value)
              this.putGoldPrice(this.goldInfo, () => {
                this.getGoldPrice((data) => {
                  this.GoldParamBoolen = false
                  this.GoldPriceBoolen = false
                  this.data = data.goldPrice
                })
              })
            } else {
              this.postGoldPrice(this.goldInfo, () => {
                this.getGoldPrice((data) => {
                  this.GoldParamBoolen = false
                  this.GoldPriceBoolen = false
                  this.data = data.goldPrice
                })
              })
            }
          } else {
            this.$Message.error('参数填写不正确')
          }
        })
      },
      tipsConfirmNgp () {
        console.log(this.goldInfo)
        if (!this.goldInfo.name || this.goldInfo.name === '') {
          this.$Message.warning('材质名称不能为空')
          return
        } else if (this.goldInfo.name.length > 10) {
          this.$Message.warning('材质名称过长')
          return
        }
        if (!this.goldInfo.value) {
          this.$Message.warning('材质价格不能为空')
          return
        } else if (parseInt(this.goldInfo.value) < 100) {
          this.$Message.warning('温馨提示:首饰金不低于100元/克')
          return
        } else if (parseInt(this.goldInfo.value) > 10000) {
          this.$Message.warning('材质价格超出指定限额')
          return
        }
        this.GoldParamBoolen = true
      },
      cancelNgp () {
        this.GoldParamBoolen = false
      },
      handleStatus (status) {
        console.log(status)
      }
    },
    watch: {
      goldInfo: function () {
        if (this.goldInfo.id) {
          this.GoldPriceTitle = '修改金价设置'
        } else {
          this.GoldPriceTitle = '新增金价设置'
        }
      },
      GoldPriceBoolen: function () {
        if (this.GoldPriceBoolen === false) {
          this.$refs['goldInfo'].resetFields()
        }
      }
    }
  }
</script>
