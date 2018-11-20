<style lang="scss" rel="stylesheet/scss" scoped>
.margin-10 {
  margin: 10px;
}
.margin-page {
  margin: 10px;
  text-align: center;
}
.width-21 {
  width: 21%;
}
.width-30 {
  width: 30%;
}
.width-45 {
  width: 45%;
}
.my-date {
  width: 100%;
}
.my-table {
  margin: 10px;
  overflow-x: scroll;
  .ivu-table-wrapper {
  }
}
.search-btns {
  text-align: center;
}
.marg0 {
  margin: 0 !important;
}
.btn-w {
  width: 80px;
}
.my-select {
  width: 50%;
}
.my-select2 {
  width: 48%;
  margin-left: 2% !important;
}
.exeBtnDiv {
  margin: 0px 10px 6px 10px;
}
</style>
<template>
  <div id="buyerList">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>会员管理</BreadcrumbItem>
      <BreadcrumbItem>买家列表</BreadcrumbItem>
    </Breadcrumb>

    <Form inline class="margin-10" :label-width="82" ref="buyerListForm" :model="search_c" :rules="search_rule">
      <FormItem class="width-21" label="会员ID：" prop="id">
        <Input v-model="search_c.id"></Input>
      </FormItem>
      <FormItem class="width-30" label="会员手机：" prop="mobile">
        <Input v-model="search_c.mobile" :maxlength="11"></Input>
      </FormItem>
      <FormItem class="width-45" label="创建时间：">
        <FormItem prop="creatStartDate">
          <DatePicker format="yyyy-MM-dd HH:mm" placeholder="开始时间" class="my-date" type="datetime" :value="search_c.creatStartDate" @on-change="(val)=>{setTheDate(val,'creatStartDate')}"></DatePicker>
        </FormItem>
        <FormItem prop="creatEndDate">
          <DatePicker format="yyyy-MM-dd HH:mm" placeholder="结束时间" class="my-date" type="datetime" :value="search_c.creatEndDate" @on-change="(val)=>{setTheDate(val,'creatEndDate')}"></DatePicker>
        </FormItem>
      </FormItem>
      <FormItem class="width-21" label="昵称：" prop="nickName">
        <Input v-model="search_c.nickName"></Input>
      </FormItem>
      <FormItem class="width-30" label="所在地区：">
        <FormItem class="marg0 my-select" prop="province">
          <Select v-model="search_c.province" placeholder="省" @on-change="changeProvince">
            <Option v-for="item in provinceList" :value="item.text" :key="item.value">{{item.text}}</Option>
          </Select>
        </FormItem><!--
        --><FormItem class="marg0  my-select2" prop="city">
          <Select v-model="search_c.city" placeholder="市">
            <Option v-for="item in cityList" :value="item.text" :key="item.value">{{item.text}}</Option>
          </Select>
        </FormItem>
      </FormItem>
      <FormItem class="width-45" label="最近购买：">
        <FormItem prop="buyStartDate">
          <DatePicker format="yyyy-MM-dd HH:mm" placeholder="开始时间" class="my-date" type="datetime" :value="search_c.buyStartDate" @on-change="(val)=>{setTheDate(val,'buyStartDate')}"></DatePicker>
        </FormItem>
        <FormItem prop="buyEndDate">
          <DatePicker format="yyyy-MM-dd HH:mm" placeholder="结束时间" class="my-date" type="datetime" :value="search_c.buyEndDate" @on-change="(val)=>{setTheDate(val,'buyEndDate')}"></DatePicker>
        </FormItem>
      </FormItem>
      <FormItem class="width-45" label="最近登录：">
        <FormItem prop="loginStartDate">
          <DatePicker format="yyyy-MM-dd HH:mm" placeholder="开始时间" class="my-date" type="datetime" :value="search_c.loginStartDate" @on-change="(val)=>{setTheDate(val,'loginStartDate')}"></DatePicker>
        </FormItem>
        <FormItem prop="loginEndDate">
          <DatePicker format="yyyy-MM-dd HH:mm" placeholder="结束时间" class="my-date" type="datetime" :value="search_c.loginEndDate" @on-change="(val)=>{setTheDate(val,'loginEndDate')}"></DatePicker>
        </FormItem>
      </FormItem>
      <!-- <div class="search-btns"> -->
      <FormItem>
        <Button type="primary" @click="buyerSearch" class="btn-w">查询</Button>
        <Button type="primary" @click="buyerReset" class="btn-w" style="margin-left:10px;">重置</Button>
      </FormItem>
      <!-- </div> -->
    </Form>
    <div class="exeBtnDiv">
      <Button :disabled="outputBtnStatus" @click="outputHandler">导出Excel</Button>
      <!-- <Button @click="delAllHandler">取消所有选择</Button> -->
    </div>
    <div class="my-table">
      <Table ref="buyerlisttable" :columns="column1" :data="data1" :width="1580" stripe @on-selection-change="selectChange" @on-select="selectHandler" @on-select-cancel="cancelHandler" @on-select-all="selectAllHandler"></Table>
    </div>

    <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="pageChange" show-total class="margin-page" v-if="data1.length>0"></Page>
    <Loading :isload="loading"></Loading>
    <iframe style="display:none;" ref="buyerListIframe" id="buyerListIframe" name="buyerListIframe"></iframe>
  </div>
</template>
<script type="text/ecmascript-6">
  import Loading from '../../../components/loading.vue'
  import * as omAPI from '../../../services/buyerList.es6'
  import * as config from '../../../services/config.es6'
  import cityData from '../../../libs/cityData.js'
  import Util from '../../../libs/util'

  export default {
    name: 'buyerList',
    components: {Loading},
    data () {
      // const checkbuydate = (rule, value, callback) => {
      //   if (this.search_c.creatStartDate !== '' && value !== '') {
      //     if (new Date(this.search_c.creatStartDate).getTime() > new Date(value).getTime()) {
      //       return callback(new Error('不能小于开始日期'))
      //     }
      //   }
      //   callback()
      // }
      return {
        total: 0,
        pageNum: 1,
        pageSize: 5,
        loading: false,
        provinceList: cityData,
        cityList: null,
        outputBtnStatus: false,
        outputData: [],
        // 搜索条件
        search_c: {
          buyEndDate: '',
          buyStartDate: '',
          city: '',
          creatEndDate: '',
          creatStartDate: '',
          id: '',
          loginEndDate: '',
          loginStartDate: '',
          mobile: '',
          nickName: '',
          province: ''
        },
        search_rule: {
          // creatEndDate: [
          //   { validator: checkbuydate, trigger: 'change' }
          // ]
        },
        column1: [
          // {
          //   type: 'selection',
          //   width: 80,
          //   align: 'center'
          // },
          {title: '会员ID', key: 'id', width: 190},
          {title: '会员手机', key: 'mobile', width: 170},
          {title: 'TSL会员号', key: 'tslCardNo', width: 170},
          {title: '昵称', key: 'nickName', width: 170},
          {title: '注册时间', key: 'createDate', width: 180},
          {title: '省份', key: 'province', width: 180},
          {title: '城市', key: 'city', width: 160},
          {title: '最后登录时间', key: 'loginDate', width: 180},
          {title: '最近购买时间', key: 'buyDate', width: 180},
          {
            title: '操作',
            width: 160,
            render: (h, params) => {
              return h('a', {
                dormProps: {
                  href: 'javascript:'
                },
                on: {
                  click: () => {
                    // this.$parent.page = this.$parent.pages[1]
                    try {
                      sessionStorage.setItem('vipInfoData', JSON.stringify(params.row))
                      sessionStorage.setItem('vipInfoSearchData', JSON.stringify(this.search_c))
                    } catch (e) {}
                    this.$router.push({path: 'vipInfo', query: {memberId: params.row.id}})
                  }
                }
              }, '查看')
            }
          }
        ],
        data1: [
          // {
          //   id: '123496868', mobile: '13800138002', nickName: 'air', createDate: '2018-01-01 12:00', province: '广东省', city: '广州市', loginDate: '2018-01-01 12:00', buyDate: '2018-01-01 12:00'
          // }
        ]
      }
    },
    methods: {
      formValid: function () {
        if (new Date(this.search_c.creatStartDate) > new Date(this.search_c.creatEndDate)) {
          this.$Message.warning('创建时间结束时间不能早于开始时间')
          return false
        }
        if (new Date(this.search_c.buyStartDate) > new Date(this.search_c.buyEndDate)) {
          this.$Message.warning('最近购买结束时间不能早于开始时间')
          return false
        }
        if (new Date(this.search_c.loginStartDate) > new Date(this.search_c.loginEndDate)) {
          this.$Message.warning('最近登录结束时间不能早于开始时间')
          return false
        }
        return true
      },
      buyerSearch: function () {
        const self = this
        // this.$refs.buyerListForm.validate((valid) => {
          // if (valid) {
        if (this.formValid() === false) {
          return
        }
        const params = {
          'buyEndDate': self.search_c.buyEndDate,
          'buyStartDate': self.search_c.buyStartDate,
          'city': self.search_c.city,
          'creatEndDate': self.search_c.creatEndDate,
          'creatStartDate': self.search_c.creatStartDate,
          'id': self.search_c.id,
          'loginEndDate': self.search_c.loginEndDate,
          'loginStartDate': self.search_c.loginStartDate,
          'mobile': self.search_c.mobile,
          'nickName': self.search_c.nickName,
          'pageNum': self.pageNum,
          'pageSize': self.pageSize,
          'province': self.search_c.province === '-请选择-' ? '' : self.search_c.province
        }
        self.loading = true
        this.$http.post(...omAPI.customerManagement(params))
          .then((response) => {
            self.loading = false
            if (response.data.code === 200) {
              // 呈现已选中项
              // for (let i in response.data.memberManagementInfos.list) {
              //   response.data.memberManagementInfos.list[i].listid = (Number(i) + 1) + (self.pageNum - 1) * self.pageSize
              //   for (let j in self.outputData) {
              //     if (response.data.memberManagementInfos.list[i].id === self.outputData[j].id) {
              //       response.data.memberManagementInfos.list[i]._checked = true
              //       break
              //     }
              //   }
              // }
              self.data1 = response.data.memberManagementInfos.list
              self.total = response.data.memberManagementInfos.total
            }
          }).catch((res) => {
            self.loading = false
          })
        //   } else {
        //     console.log('Fail!')
        //   }
        // })
      },
      buyerReset: function () {
        // for (const key in this.search_c) {
        //   this.search_c[key] = ''
        // }
        this.$refs['buyerListForm'].resetFields()
        this.initDate()
      },
      setTheDate: function (val, tp) {
        this.search_c[tp] = val
      },
      changeProvince: function (val) {
        for (let i = 0; i < this.provinceList.length; i++) {
          if (this.provinceList[i].text === val) {
            this.cityList = this.provinceList[i].children
            break
          }
        }
      },
      pageChange: function (page) {
        this.pageNum = page
        this.buyerSearch()
      },
      initDate: function () {
        const currentS = (new Date()).getTime()
        const beforeS = currentS - (1000 * 60 * 60 * 24 * 90)
        const startdate = Util.timeFormat(beforeS, 'yyyy-MM-dd HH:mm')
        const enddate = Util.timeFormat(currentS, 'yyyy-MM-dd HH:mm')
        this.search_c.creatStartDate = startdate
        this.search_c.creatEndDate = enddate
      },
      outputHandler: function () {
        // this.outputData.sort(this.outputDataSort)
        // console.log(this.outputData)
        // this.$Message.warning('功能建设中，请稍后再试。')
        const self = this
        if (this.formValid() === false) {
          return
        }
        const params = {
          'buyEndDate': self.search_c.buyEndDate,
          'buyStartDate': self.search_c.buyStartDate,
          'city': self.search_c.city,
          'creatEndDate': self.search_c.creatEndDate,
          'creatStartDate': self.search_c.creatStartDate,
          'id': self.search_c.id,
          'loginEndDate': self.search_c.loginEndDate,
          'loginStartDate': self.search_c.loginStartDate,
          'mobile': self.search_c.mobile,
          'nickName': self.search_c.nickName,
          'province': self.search_c.province === '-请选择-' ? '' : self.search_c.province
        }
        let formhtml = `<form id="buyerListForm2" target="buyerListIframe" method="get" action="/${config.SERVER_PATH}${omAPI.customerManagementExport()}">`
        // let formhtml = `<form id="buyerListForm2" target="buyerListIframe" method="get" action="/om/om/OperationManagement/v1/customerManagementExport">`
        for (let key in params) {
          formhtml += `<input type="hidden" name="${key}" value="${params[key]}" />`
        }
        formhtml += '</form>'
        this.$refs.buyerListIframe.contentWindow.document.getElementsByTagName('body')[0].innerHTML = formhtml
        const formelm = this.$refs.buyerListIframe.contentWindow.document.getElementById('buyerListForm2')
        formelm.submit()
        formelm.parentNode.removeChild(formelm)
      },
      outputDataSort: function (a, b) {
        return a.listid - b.listid
      },
      // 处理 没选 或 取消当页所有选中
      selectChange: function (sel) {
        if (sel.length === 0) {
          for (let i in this.data1) {
            for (let j in this.outputData) {
              if (this.data1[i].id === this.outputData[j].id) {
                this.outputData.splice(j, 1)
                break
              }
            }
          }
        }
      },
      // 选中单项
      selectHandler: function (sel, row) {
        let canPush = true
        for (let item of this.outputData) {
          if (row.id === item.id) {
            canPush = false
            break
          }
        }
        if (canPush) {
          this.outputData.push(row)
        }
      },
      // 取消单项
      cancelHandler: function (sel, row) {
        for (let i in this.outputData) {
          if (row.id === this.outputData[i].id) {
            this.outputData.splice(i, 1)
            break
          }
        }
      },
      // 选中当页所有项
      selectAllHandler: function (sel) {
        for (let i in sel) {
          let canPush = true
          for (let j in this.outputData) {
            if (sel[i].id === this.outputData[j].id) {
              canPush = false
              break
            }
          }
          if (canPush) {
            this.outputData.push(sel[i])
          }
        }
      },
      // 取消所有选中
      delAllHandler: function () {
        this.outputData = []
        this.$refs.buyerlisttable.selectAll(false)
      }
    },
    mounted: function () {
      try {
        const searchstr = sessionStorage.getItem('vipInfoSearchData')
        if (searchstr) {
          sessionStorage.removeItem('vipInfoSearchData')
          this.search_c = JSON.parse(searchstr)
        } else {
          this.initDate()
        }
      } catch (e) {}
      this.buyerSearch()
    }
  }
</script>
