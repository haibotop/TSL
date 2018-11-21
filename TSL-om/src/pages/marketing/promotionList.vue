<style lang="scss" rel="stylesheet/scss" scoped>
.my-breadcrumb {
  margin: 0px 10px;
}
.ccContent {
  margin:10px 20px;
}
.ccItem {
  .btnItem {
    margin-right: 40px;
  }
  .querry-block {
    display: inline-block;
  }
}
.ccHandle{
  width: 30%;
}
.btnsize{
  margin: 5px;
  width: 80px;
}
.ccTable{
  // width: 95%;
  // margin: 0 auto;
  margin-left: 20px;
}
</style>
<template>
  <div id="promotionList">
    <div class="ccTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>促销列表</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="ccContent">
      <div class="ccSearch">
        <Form :label-width="90">
          <div class="ccItem">
            <FormItem label="促销名称:" class="querry-block">
              <Input placeholder="促销名称" size="small" width="50" v-model="querryParam.name"></Input>
            </FormItem>
            <FormItem label="促销时间 :" class="querry-block">
              <Row>
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 146px" v-model="startDate"></DatePicker>
                ~
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 146px" v-model="endDate"></DatePicker>
              </Row>
            </FormItem>
            <FormItem label="商品状态 :" class="querry-block">
              <Select v-model="querryParam.type" size="small" style="width:120px">
                <Option v-for="(item, index) in statusCate" :value="item.type" :key="index">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </div>
          <div class="ccItem">
            <div class="btnItem">
              <Button class="btnsize" type="primary" @click="querryPromotion">查询</Button>
              <Button class="btnsize" type="primary" @click="querryReset">重置</Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
    <div class="ccTable">
      <Table :columns="ccTable" :data="ccData" :height="ccheight" width="1070"></Table>
    </div>
    <div class="footer">
      <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="clickPage" show-total></Page>
    </div>
    <Loading :isload="isLoad"></Loading>
  </div>
</template>
<script type="text/ecmascript-6">
import * as proApi from '../../services/marketing.es6'
import Loading from '../../components/loading'

export default {
  name: 'promotionList',
  components: { Loading },
  data () {
    return {
      // 分页设置
      pageSize: 20,
      pageNum: 1,
      total: 0,
      startDate: '',
      endDate: '',
      isLoad: false,
      ccTable: [
        {
          key: 'name',
          title: '促销名称',
          align: 'center'
        },
        {
          key: 'period',
          title: '促销时间',
          align: 'center',
          width: 350
        },
        {
          key: 'cxtype',
          title: '促销类型',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    switch (params.row.cxtype) {
                      case '满减促销': {
                        console.log('满减促销')
                        this.fullReductionPromotion(params.row.id)
                        break
                      }
                      case '满折促销': {
                        console.log('满折促销')
                        this.fullReductionPromotion(params.row.id)
                        break
                      }
                      case '单品折扣': {
                        console.log('单品折扣')
                        this.discountPromotion(params.row.id)
                        break
                      }
                      case '直降促销': {
                        console.log('直降促销')
                        this.drectDropPromotion(params.row.id)
                        break
                      }
                    }
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
                    this.$Modal.confirm({
                      content: '是否删除这条记录',
                      onOk: () => {
                        let self = this
                        setTimeout(() => {
                          // delPromotion
                          self.delPromotion(params.row.id)
                        }, 500)
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      ccData: [],
      ccheight: 500,
      querryParam: {
        name: null,
        startDate: null,
        endDate: null,
        type: null
      },
      // 促销类型选项
      statusCate: [
        {
          type: 1,
          name: '满减促销'
        },
        {
          type: 2,
          name: '满折促销'
        },
        {
          type: 3,
          name: '单品折扣'
        },
        {
          type: 4,
          name: '直降促销'
        }
      ]
    }
  },
  methods: {
    fullReductionPromotion (id) {
      this.$router.push({path: '/home/fullReductionPromotion/' + id})
    },
    discountPromotion (id) {
      this.$router.push({path: '/home/discountPromotion/' + id})
    },
    drectDropPromotion (id) {
      this.$router.push({path: '/home/directDropPromotion/' + id})
    },
    // 获取促销列表
    getPromotionsList (param, pageSize, pageNum, callback) {
      this.isLoad = true
      this.$http.post(...proApi.getProList(param, pageSize, pageNum)).then(res => {
        this.ccData = []
        if (res.data.code === 200) {
          for (let i of res.data.promotionVoInfo.list) {
            let type
            if (i.type === 1) {
              type = '满减促销'
            } else if (i.type === 2) {
              type = '满折促销'
            } else if (i.type === 3) {
              type = '单品折扣'
            } else if (i.type === 4) {
              type = '直降促销'
            }
            let obj = {
              id: i.id,
              name: i.name,
              period: i.startDate + '~' + i.endDate,
              cxtype: type
            }
            this.ccData.push(obj)
          }
          if (typeof (callback) === 'function') {
            callback(res.data.promotionVoInfo.total)
          }
          this.isLoad = false
        }
      })
    },
    // 删除促销列表
    delPromotion (id) {
      this.$http.delete(proApi.delPromotion(id)).then(res => {
        if (res.data.code === 200) {
          this.$Message.success({content: res.data.message})
          this.querryReset()
        } else {
          this.$Message.warning({content: res.data.message})
        }
      })
    },
    // 跳转页码触发事件
    clickPage (pageNum) {
      this.isLoad = true
      this.pageNum = pageNum
      this.getPromotionsList(this.querryParam, this.pageSize, this.pageNum)
    },
    // 时间转换格式
    formatDateTime (dateTime) {
      let date = dateTime
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      let second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    // 根据查询条件查询列表
    querryPromotion () {
      let obj = JSON.parse(JSON.stringify(this.querryParam))
      obj.startDate = this.startDate ? this.formatDateTime(this.startDate) : null
      obj.endDate = this.endDate ? this.formatDateTime(this.endDate) : null
      if (new Date(obj.startDate) - new Date(obj.endDate) > 0 && obj.startDate !== null && obj.endDate !== null) {
        this.$Message.warning('结束时间不可早于开始时间')
        return
      }
      this.getPromotionsList(obj, this.pageSize, this.pageNum, res => {
        console.log(res)
        this.total = res
      })
    },
    querryReset () {
      this.querryParam = {
        name: null,
        startDate: null,
        endDate: null,
        type: null
      }
      this.startDate = ''
      this.endDate = ''
      this.getPromotionsList(this.querryParam, this.pageSize, this.pageNum, res => {
        console.log(res)
        this.total = res
      })
    }
  },
  mounted () {
    this.getPromotionsList(this.querryParam, this.pageSize, this.pageNum, res => {
      console.log(res)
      this.total = res
    })
  }
}
</script>




