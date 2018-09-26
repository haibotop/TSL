<style lang="scss" rel="stylesheet/scss" scoped>
.my-breadcrumb {
  margin: 0px 10px;
}
.ccContent {
  margin:20px;
}
.ccItem {
  display: inline-block;
  width: 20%;
}
.ccHandle{
  width: 30%;
}
.btnsize{
  margin: 10px;
  width: 80px;
}
.ccTable{
  width: 95%;
  margin: 0 auto;
}
</style>
<template>
  <div id="couponList">
    <div class="ccTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>优惠券列表</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="ccContent">
      <div class="ccSearch">
        <Form :label-width="100">
          <div class="ccItem">
            <FormItem label="优惠券名称:">
              <Input placeholder="优惠券名称" width="50"></Input>
            </FormItem>
          </div>
          <div class="ccItem">
            <Button class="btnsize">搜索</Button>
          </div>
        </Form>
      </div>
      <div class="ccHandle">
        <Button class="btnsize">添加</Button>
        <Button class="btnsize">删除</Button>
      </div>
    </div>
    <div class="ccTable">
      <Table :columns="ccTable" :data="ccData"></Table>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'couponList',
  data () {
    return {
      ccTable: [
        {
          type: 'selection',
          align: 'center',
          width: 80
        },
        {
          key: 'name',
          title: '优惠券名称',
          align: 'center',
          width: 150
        },
        {
          key: 'cptype',
          title: '类型',
          align: 'center',
          width: 100
        },
        {
          key: 'getNum',
          title: '每人可领张数',
          align: 'center',
          width: 90
        },
        {
          key: 'startTime',
          title: '开始时间',
          width: 200,
          align: 'center'
        },
        {
          key: 'endTime',
          title: '结束时间',
          width: 200,
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, '查看详情'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, '查看券码'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, '导出券码'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, '删除')
            ])
          }
        }
      ],
      ccData: [
        {
          name: '谢瑞麟情浓七日',
          cptype: '满减优惠',
          getNum: 1,
          startTime: '2017-10-9 10:57:15',
          endTime: '2017-2-10 10:57:15'
        }
      ]
    }
  }
}
</script>




