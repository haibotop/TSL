<style lang="scss" rel="stylesheet/scss" scoped>
  .title {
    margin: 30px 10px 10px;
    font-weight: 700;
    color: #495060;
    border-bottom: 2px solid #495060;
  }
  .width-100 {
    width: 100%;
  }
  .width-45 {
    width: 45%;
  }
  .width-100, .width-45 {
    margin: 0px;
  }
  .color-red {
    color: red;
  }
  .amount {
    color: red;
    float: right;
    margin: 0px 10px;
  }
  .my-btn {
    margin: 10px 0px 10px 10px;
  }
</style>
<template>
  <div id="outStore">
    <div class="title">选择物流服务</div>
    <Form :label-width="100">
      <FormItem label="物流公司：">
        <Select style="width: 200px">
          <Option value=""></Option>
        </Select>
      </FormItem>
      <FormItem label="收货地址：">
        <span>浙江宁波市慈溪市XXXX</span><span>陈升</span><span>13678202930</span>
      </FormItem>
      <FormItem label="运单号：">
        <Input style="width: calc(100% - 100px)"></Input>
      </FormItem>
    </Form>

    <div class="title">订单基本信息</div>
    <Form :label-width="100" inline>
      <FormItem class="width-100" label="订单编号：">123456</FormItem>
      <FormItem class="width-45" label="收货人名字：">陈升</FormItem>
      <FormItem class="width-45" label="手机号码：">13678202930</FormItem>
      <FormItem class="width-45" label="收货地址："><span class="color-red">浙江宁波市慈溪市XXXX</span></FormItem>
      <FormItem class="width-45" label="固定电话：">13678202930</FormItem>
      <FormItem class="width-45" label="支付方式："><span class="color-red">在线支付</span></FormItem>
      <FormItem class="width-45" label="邮编：">523000</FormItem>
      <FormItem class="width-45" label="付款方式："></FormItem>
      <FormItem class="width-45" label="下单时间：">2016-03-18 13：14：02</FormItem>
      <FormItem class="width-45" label="配送方式："><span class="color-red">普通快递</span></FormItem>
      <FormItem class="width-45" label="送货前通知：">否</FormItem>
      <FormItem class="width-45" label="送货时间：">只工作日送货（双休日、假日不用送）</FormItem>
      <FormItem class="width-100" label="订单备注："><span class="color-red">不需要开具发票</span></FormItem>
    </Form>

    <div class="title">商品信息</div>
    <Table :columns="column1" :data="data1"></Table>

    <div class="amount">商品金额：837元</div>

    <Button @click="outStore" class="my-btn">出库</Button>
    <Button @click="goBack" class="my-btn">返回</Button>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'outStore',
  data () {
    return {
      column1: [
        {
          title: '商品图片'
        },
        {
          title: '商品编码'
        },
        {
          title: '商品名称'
        },
        {
          title: '价格'
        },
        {
          title: '数量'
        },
        {
          title: '优惠金额'
        },
        {
          title: '小计'
        }
      ],
      data1: []
    }
  },
  methods: {
    outStore () {
    },
    goBack () {
      this.$parent.page = this.$parent.pages[0]
    }
  }
}
</script>
