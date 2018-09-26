<style lang="scss" rel="stylesheet/scss" scoped>
  .margin-10 {
    margin: 10px;
  }
  .my-border {
    border: 1px solid #dddee1;
  }
  .my-border-bottom {
    border-bottom: 1px solid #dddee1;
  }
  .my-text {
    text-indent: 10px;
  }
  .col-label {
    text-align: right;
  }
  .amount {
    color: red;
    font-size: 16px;
  }
  .my-btn {
    display: block;
    margin: 0 auto;
  }
</style>
<template>
  <div id="orderDetail">
    <div class="margin-10 my-border my-text">订单号：123456 状态：商品出库</div>

    <Steps :current="current" class="margin-10">
      <Step title="提交订单"></Step>
      <Step title="商品出库"></Step>
      <Step title="完成"></Step>
    </Steps>

    <Button type="primary" class="margin-10">订单跟踪</Button>
    <Table :columns="column1" :data="data1" class="margin-10"></Table>

    <div class="my-border margin-10">
      <div class="my-border-bottom my-text">订单信息</div>
      <div class="my-text">收货人信息</div>
      <Row><Col span="4" class="col-label">收货人：</Col><Col span="20">陈升</Col></Row>
      <div class="my-text">支付及配送方式</div>
      <Row><Col span="4" class="col-label">支付方式：</Col><Col span="20">在线支付</Col></Row>
      <Row><Col span="4" class="col-label">运费：</Col><Col span="20">￥10.00</Col></Row>
      <Row><Col span="4" class="col-label">送货日期：</Col><Col span="20">工作日、双休日与假日均可送货</Col></Row>
      <div class="my-text">发票信息</div>
      <Row><Col span="4" class="col-label">发票类型：</Col><Col span="20">普通发票</Col></Row>
      <Row><Col span="4" class="col-label">发票抬头：</Col><Col span="20">个人</Col></Row>
      <Row><Col span="4" class="col-label">发票内容：</Col><Col span="20">明细</Col></Row>

      <div class="my-text">商品清单</div>
      <Table :columns="column2" :data="data2" class="margin-10"></Table>

      <div class="my-text">订单备注：</div>
      <div class="my-mark">{{mark}}</div>

      <div class="order-amount">
        <Row>
          <Col span="4" offset="16" class="col-label">商品总金额：</Col><Col span="4">￥827.00</Col>
        </Row>
        <Row>
          <Col span="4" offset="16" class="col-label">+运费：</Col><Col span="4">￥10.00</Col>
        </Row>
        <Row>
          <Col span="4" offset="16" class="col-label">订单支付金额：</Col>
          <Col span="4" class="amount">￥837.00</Col>
        </Row>
      </div>
    </div>
    <Button @click="goBack">返回</Button>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'orderDetail',
  data () {
    return {
      current: 1,
      // 订单跟踪
      column1: [
        {title: '处理时间', key: 'date'},
        {title: '处理信息', key: 'msg'},
        {title: '操作人', key: 'operator'}
      ],
      data1: [
        {date: '2016-03-18 11：20：02', msg: '订单已提交，等待系统确认', operator: '客户'},
        {data: '2016-03-19 11：20：02', msg: '订单已经出库', operator: 'XX专卖店'}
      ],
      // 商品清单
      column2: [
        {title: '商品编号', key: 'id'},
        {title: '商品名字', key: 'name'},
        {title: '商品价格', key: 'price'},
        {title: '商品数量', key: 'quantity'}
      ],
      data2: [
        {id: '129372', name: '倍轻松（breo） 眼部按摩器 isee361', price: '429.00', quantity: '1'},
        {id: '145333', name: '凯仕乐(国际品牌)眼部按摩器', price: '298.00', quantity: '1'}
      ],
      // 备注
      mark: ''
    }
  },
  methods: {
    goBack () {
      this.$parent.page = this.$parent.pages[0]
    }
  }
}
</script>
