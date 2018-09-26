<style lang="scss" rel="stylesheet/scss" scoped>
  .margin-10 {
    margin: 10px;
  }
  .headimg {
    float: left;
    width: 100px;
    height: 100px;
    border: 1px solid #dddee1;
    img {
      display: block;
      width: 100px;
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
      <BreadcrumbItem>会员信息</BreadcrumbItem>
    </Breadcrumb>
    <Tabs type="card" class="margin-10" :animated="false">
      <TabPane label="会员基本信息">
        <div style="overflow:hidden;">
          <div class="headimg margin-10">
            <img src="" alt="">
          </div>
          <div class="info margin-10">
            <Row>
              <Col span="6"><b>会员ID：</b></Col><Col span="6">123456789</Col><Col span="6"><b>会员等级：</b></Col><Col span="6">钻石</Col>
            </Row>
            <Row>
              <Col span="6"><b>会员昵称：</b></Col><Col span="6">微信昵称</Col><Col span="6"><b>手机号码：</b></Col><Col span="6">13800138000</Col>
            </Row>
            <Row>
              <Col span="6"><b>性别：</b></Col><Col span="6">男</Col><Col span="6"><b>所在地区：</b></Col><Col span="6">广东 广州</Col>
            </Row>
            <Row>
              <Col span="6"><b>最后登录方式：</b></Col><Col span="6">微信授权</Col><Col span="6"><b>注册平台：</b></Col><Col span="6">IOS</Col>
            </Row>
            <Row>
              <Col span="6"><b>注册渠道：</b></Col><Col span="6">ios应用市场</Col><Col span="6"><b>注册IP：</b></Col><Col span="6">192.168.1.1</Col>
            </Row>
            <Row>
              <Col span="6"><b>注册时间：</b></Col><Col span="6">2016-6-10 17:2:52</Col><Col span="6"><b>最后登录时间：</b></Col><Col span="6">2016-6-10 17:2:52</Col>
            </Row>
            <Row>
              <Col span="6"><b>最后退出时间：</b></Col><Col span="6">2016-6-10 17:2:52</Col><Col span="6"><b>最近购买时间：</b></Col><Col span="6">2016-6-10 17:2:52</Col>
            </Row>
          </div>
        </div>
        <div class="margin-10"><b>收货地址：</b></div>
        <Table :columns="column1" :data="data1" class="margin-10"></Table>
      </TabPane>
      <TabPane label="登录历史记录">
       <Table :columns="column2" :data="data2" class="margin-10"></Table>
      </TabPane>
    </Tabs>
    <Button class="my-btn" @click="goBack">返回</Button>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'vipInfo',
    data () {
      return {
        // 地址
        column1: [
          {title: '收货人姓名', key: 'name'},
          {title: '收货人手机号码', key: 'mobile'},
          {title: '收货人地址', key: 'address'},
          {title: '是否默认收货地址', key: 'default'},
          {title: '实名证件号', key: 'cardId'},
          {title: '认证时间', key: 'authenDate'},
          {title: '实名认证', key: 'realNameAuthen'}
        ],
        data1: [
          {name: '黄晓明', mobile: '13800138000', address: '广东省 广州市 海珠区　街道地址', default: '默认', cardId: '440182199909094412', authenDate: '2016-09-09 12:20:23', realNameAuthen: '已通过'}
        ],
        // 登录历史
        column2: [
          {title: '登录账号', key: 'account'},
          {title: '登录方式', key: 'loginWay'},
          {title: '登录平台', key: 'loginPlatform'},
          {title: '登录IP', key: 'ip'},
          {title: '登录时间', key: 'loginDate'},
          {title: '登出时间', key: 'logoutDate'},
          {title: '省份', key: 'province'},
          {title: '城市', key: 'city'}
        ],
        data2: [
          {account: '13800138000', loginWay: '微信第三方法授权登录', loginPlatform: 'IOS', ip: '192.168.1.1', loginDate: '2016/10/15 16:13', logoutDate: '2016/10/16 16:20', province: '广东', city: '广州'}
        ]
      }
    },
    methods: {
      goBack () {
        this.$parent.page = this.$parent.pages[0]
      }
    }
  }
</script>
