<style lang="scss" rel="stylesheet/scss" scoped>
  .margin-10 {
    margin: 10px;
  }
  .margin-page {
    margin:10px;
    text-align: center;
  }
  .headimg {
    float: left;
    width: 100px;
    height: 100px;
    border: 1px solid #dddee1;
    img {
      display: block;
      width: 100px;
      height: 100px;
    }
  }
  .info {
    width: 900px;
    float: left;
  }
  .my-btn {
    display: block;
    margin: 0 auto;
  }
  .search-btns {
    text-align: center;
  }
  .width-30 {
    width: 30%;
  }
  .btn-w {
    width: 80px;
  }
</style>
<style>
  #vipInfo .ivu-tabs-bar {
    margin-bottom: 0px;
  }
  #vipInfo .ivu-tabs-nav {
    padding: 0px;
  }
  #vipInfo .ivu-tabs-content {
    border: 1px solid #dddee1;
    border-top: none;
    overflow: hidden;
  }
</style>
<template>
  <div id="vipInfo">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>会员管理</BreadcrumbItem>
      <BreadcrumbItem to="/home/buyerList">买家列表</BreadcrumbItem>
      <BreadcrumbItem>会员信息</BreadcrumbItem>
    </Breadcrumb>
    <Tabs type="card" class="margin-10" :animated="false" @on-click="tabClickHandler">
      <TabPane label="会员基本信息">
        <div style="overflow:hidden;">
          <div class="headimg margin-10">
            <img :src="memberInfo.headPortrait" alt="">
          </div>
          <div class="info margin-10">
            <Row>
              <Col span="6"><b>会员ID：</b></Col><Col span="6">{{memberInfo.id}}</Col>
            </Row>
            <Row>
              <Col span="6"><b>会员姓名：</b></Col><Col span="6">&nbsp;{{memberInfo.loginName}}</Col><Col span="6"><b>手机号码：</b></Col><Col span="6">{{memberInfo.mobile}}</Col>
            </Row>
            <Row>
              <Col span="6"><b>性别：</b></Col><Col span="6">&nbsp;{{sex}}</Col><Col span="6"><b>所在地区：</b></Col><Col span="6">{{memberInfo.province+' '+memberInfo.city}}</Col>
            </Row>
            <Row>
              <Col span="6"><b>注册时间：</b></Col><Col span="6">{{memberInfo.createDate}}</Col><Col span="6"><b>最后登录时间：</b></Col><Col span="6">{{memberInfo.loginDate}}</Col>
            </Row>
            <Row>
              <Col span="6"><b>最近购买时间：</b></Col><Col span="6">{{memberInfo.buyDate}}</Col>
            </Row>
          </div>
        </div>
        <div class="margin-10"><b>收货地址：</b></div>
        <Table :columns="column1" :data="data1" class="margin-10"></Table>
      </TabPane>
      <TabPane label="登录历史记录">
       <Table :columns="column2" :data="data2" class="margin-10"></Table>
       <Page :total="page2.total" :current="page2.pageNum" :page-size="page2.pageSize" @on-change="page2Change" show-total class="margin-page" v-if="data2.length>0"></Page>
      </TabPane>
      <TabPane label="消费记录信息">
        <Form inline class="margin-10" :label-width="120" ref="vipInfoConsume" :model="search_c" :rules="search_rule">
          <FormItem class="width-30" label="收货人手机号：" prop="mobile">
            <Input v-model="search_c.mobile" :maxlength="11"></Input>
          </FormItem>
          <FormItem class="width-45" label="付款时间：">
            <FormItem prop="startDate">
              <DatePicker format="yyyy-MM-dd HH:mm" placeholder="开始时间" type="datetime" :value="search_c.startDate" @on-change="(val)=>{setTheDate(val,'startDate')}"></DatePicker>
            </FormItem>
            <FormItem prop="endDate">
              <DatePicker format="yyyy-MM-dd HH:mm" placeholder="结束时间" type="datetime" :value="search_c.endDate" @on-change="(val)=>{setTheDate(val,'endDate')}"></DatePicker>
            </FormItem>
          </FormItem>
          <div class="search-btns">
            <Button type="success" @click="getMemberConsume" class="btn-w">查询</Button>
            <Button type="success" @click="recordReset" class="btn-w" style="margin-left:50px;">重置</Button>
          </div>
        </Form>
        <Table :columns="column3" :data="data3" class="margin-10" style="min-height:250px;"></Table>
        <Page :total="page3.total" :current="page3.pageNum" :page-size="page3.pageSize" @on-change="page3Change" show-total class="margin-page" v-if="data3.length>0"></Page>
      </TabPane>
    </Tabs>
    <Button class="my-btn" @click="goBack">返回</Button>
    <Loading :isload="loading"></Loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import Loading from '../../../components/loading.vue'
  import * as omAPI from '../../../services/buyerList.es6'
  export default {
    name: 'vipInfo',
    components: {Loading},
    data () {
      return {
        loading: false,
        memberId: this.$route.query.memberId,
        memberInfo: {
          id: '',
          loginName: '',
          sex: '',
          mobile: '',
          province: '',
          city: '',
          createDate: '',
          loginDate: '',
          buyDate: '',
          headPortrait: ''
        },
        // 地址
        column1: [
          {title: '收货人姓名', key: 'receiverName'},
          {title: '收货人手机号码', key: 'receiverMobile'},
          {title: '收货人地址', key: 'receiverAddress'},
          {title: '是否默认收货地址',
            render: (h, params) => {
              return h('div', [
                h('strong', params.row.default_status === 1 ? '是' : '否')
              ])
            }
          }
        ],
        data1: [
          // {
          //   receiverName: '黄晓明', receiverMobile: '13800138000', receiverAddress: '广东省广州市', default_status: '默认'
          // }
        ],
        // 登录历史
        column2: [
          {title: '会员ID', key: 'memberId'},
          {title: '登录时间', key: 'loginDate'},
          {title: '登录IP', key: 'loginIp'},
          {title: '省份', key: 'loginProvince'},
          {title: '城市', key: 'loginCity'}
        ],
        data2: [
          // {
          //   memberId: '13800138000', loginDate: '2016/10/15 16:13', loginIp: '192.168.1.1', loginProvince: '广东', loginCity: '广州'
          // }
        ],
        page2: {
          pageNum: 1,
          pageSize: 20,
          total: 0
        },
        // 消费记录
        column3: [
          {title: '收货人手机号', key: 'mobile'},
          {title: '实际消费金额(元)',
            render: (h, params) => {
              let num = (Number(params.row.amount) / 100).toFixed(2)
              return h('span', {}, num)
            }
          },
          {title: '支付方式',
            render: (h, params) => {
              let typetxt
              switch (params.row.payType) {
                case 1: typetxt = '(wxH5)'
                  break
                case 2: typetxt = '(wxAPP)'
                  break
                case 3: typetxt = '(支付宝H5)'
                  break
                case 4: typetxt = '银联wap'
                  break
                case 5: typetxt = '微信公众号支付'
                  break
                case 10: typetxt = '银联商务(银联在线)'
                  break
                case 11: typetxt = '银联商务(微信公众号支付)'
                  break
                case 12: typetxt = 'H5微信支付'
                  break
                case 13: typetxt = 'H5支付宝支付'
                  break
                default: typetxt = ''
                  break
              }
              return h('span', typetxt)
            }
          },
          {title: '订单编号',
            render: (h, params) => {
              return h('span', '【' + params.row.number + '】')
            }
          },
          {title: '付款时间', key: 'payDate'}
        ],
        data3: [
          // {
          //   memberId: '13800138000', loginDate: '2016/10/15 16:13', loginIp: '192.168.1.1', loginProvince: '广东', loginCity: '广州'
          // }
        ],
        page3: {
          pageNum: 1,
          pageSize: 20,
          total: 0
        },
        search_c: {
          mobile: '',
          startDate: '',
          endDate: ''
        },
        search_rule: {
          mobile: [
            { message: '请正确输入手机号码', trigger: 'blur', pattern: /\d{11}/ }
          ]
        }
      }
    },
    computed: {
      sex: function () {
        return Number(this.memberInfo.sex) === 1 ? '女' : '男'
      }
    },
    methods: {
      goBack: function () {
        // this.$parent.page = this.$parent.pages[0]
        this.$router.back()
      },
      getShippingAddress: function () {
        const self = this
        self.loading = true
        this.$http.get(omAPI.shippingAddress(this.memberId))
          .then((response) => {
            self.loading = false
            if (response.data.code === 200) {
              // console.log(response.data.addressInfos)
              self.data1 = response.data.addressInfos
            }
          }).catch((res) => {
            self.loading = false
          })
      },
      getMemberLoginRecord: function () {
        const self = this
        self.loading = true
        const url = this.memberId + '?pageNum=' + this.page2.pageNum + '&pageSize=' + this.page2.pageSize
        this.$http.get(omAPI.memberLoginRecord(url))
          .then((response) => {
            self.loading = false
            if (response.data.code === 200) {
              self.data2 = response.data.loginRecordInfos.list
              self.page2.total = response.data.loginRecordInfos.total
            }
          }).catch((res) => {
            self.loading = false
          })
      },
      getMemberConsume: function () {
        const self = this
        this.$refs.vipInfoConsume.validate((valid) => {
          if (valid) {
            if (new Date(self.search_c.startDate) > new Date(self.search_c.endDate)) {
              this.$Message.warning('结束时间不能小于开始时间')
            } else {
              const params = {
                'startDate': this.search_c.startDate,
                'endDate': this.search_c.endDate,
                'memberId': this.memberId,
                'mobile': this.search_c.mobile,
                'pageNum': this.page3.pageNum,
                'pageSize': this.page3.pageSize
              }
              self.loading = true
              this.$http.post(...omAPI.memberConsume(params))
                .then((response) => {
                  self.loading = false
                  if (response.data.code === 200) {
                    self.data3 = response.data.memberManagementInfos.list
                    self.page3.total = response.data.memberManagementInfos.total
                  }
                }).catch((res) => {
                  self.loading = false
                })
            }
          } else {
            console.log('Fail!')
          }
        })
      },
      page2Change: function (page) {
        this.page2.pageNum = page
        this.getMemberLoginRecord()
      },
      page3Change: function (page) {
        this.page3.pageNum = page
        this.getMemberConsume()
      },
      tabClickHandler: function (val) {
        if (val === 0) {
          // this.getShippingAddress()
        } else if (val === 1) {
          if (this.data2.length === 0) this.getMemberLoginRecord()
        } else {
          if (this.data3.length === 0) this.getMemberConsume()
        }
      },
      setTheDate: function (val, tp) {
        this.search_c[tp] = val
      },
      recordReset: function () {
        // for (const key in this.search_c) {
        //   this.search_c[key] = ''
        // }
        this.$refs.vipInfoConsume.resetFields()
      }
    },
    mounted: function () {
      // console.log(this.$route.query.memberId)
      // console.log(sessionStorage.getItem('vipInfoData'))
      try {
        const memberinfo = JSON.parse(sessionStorage.getItem('vipInfoData'))
        this.memberInfo.id = memberinfo.id
        this.memberInfo.loginName = memberinfo.loginName
        this.memberInfo.sex = memberinfo.sex
        this.memberInfo.mobile = memberinfo.mobile
        this.memberInfo.province = memberinfo.province === null ? '' : memberinfo.province
        this.memberInfo.city = memberinfo.city === null ? '' : memberinfo.city
        this.memberInfo.createDate = memberinfo.createDate
        this.memberInfo.loginDate = memberinfo.loginDate
        this.memberInfo.buyDate = memberinfo.buyDate
        this.memberInfo.headPortrait = memberinfo.headPortrait
      } catch (e) {}
      this.getShippingAddress()
    },
    destroyed: function () {
      sessionStorage.removeItem('vipInfoData')
    }
  }
</script>
