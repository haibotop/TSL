<style lang="scss" rel="stylesheet/scss">
  .margin-10 {
    margin: 10px;
  }
  .width-30 {
    width: 30%;
  }
  .width-35 {
    width: 35%;
  }
  .my-date {
    width: 145px;
  }
  .my-table {
    margin: 10px;
    overflow-x: scroll;
    .ivu-table-wrapper {
    }
  }
</style>
<template>
  <div id="buyerList">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>会员管理</BreadcrumbItem>
      <BreadcrumbItem>买家列表</BreadcrumbItem>
    </Breadcrumb>

    <Form inline class="margin-10" :label-width="82">
      <FormItem class="width-30" label="会员ID：">
        <Input></Input>
      </FormItem>
      <FormItem class="width-30" label="会员手机：">
        <Input></Input>
      </FormItem>
      <FormItem class="width-35" label="创建时间：">
        <TimePicker format="yyyy年MM月dd日" placeholder="开始时间" class="my-date"></TimePicker>
        <TimePicker format="yyyy年MM月dd日" placeholder="结束时间" class="my-date"></TimePicker>
      </FormItem>
      <FormItem class="width-30" label="会员等级：">
        <Select></Select>
      </FormItem>
      <FormItem class="width-30" label="性别：">
        <Select></Select>
      </FormItem>
      <FormItem class="width-35" label="最近购买：">
        <TimePicker format="yyyy年MM月dd日" placeholder="开始时间" class="my-date"></TimePicker>
        <TimePicker format="yyyy年MM月dd日" placeholder="结束时间" class="my-date"></TimePicker>
      </FormItem>
      <FormItem class="width-30" label="昵称：">
        <Input></Input>
      </FormItem>
      <FormItem class="width-30" label="所在地区："></FormItem>
      <FormItem class="width-35" label="最近登录：">
        <TimePicker format="yyyy年MM月dd日" placeholder="开始时间" class="my-date"></TimePicker>
        <TimePicker format="yyyy年MM月dd日" placeholder="结束时间" class="my-date"></TimePicker>
      </FormItem>
      <FormItem class="width-30" label="注册平台：">
        <Select></Select>
      </FormItem>
      <FormItem class="width-30" label="注册渠道：">
        <Select></Select>
      </FormItem>
      <FormItem class="width-35">
        <Button>查询</Button>
        <Button>重置</Button>
      </FormItem>
    </Form>

    <div class="my-table">
      <Table :columns="column1" :data="data1" :width="2000" height="300px"></Table>
    </div>

    <Page :total="100" show-total show-elevator class="margin-10"></Page>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'buyerList',
    data () {
      return {
        column1: [
          {title: '会员ID', key: 'id'},
          {title: '会员手机', key: 'mobile'},
          {title: '会员等级', key: 'level'},
          {title: '昵称', key: 'nickname'},
          {title: '性别', key: 'sex'},
          {title: '最后登录方式', key: 'lastLoginWay'},
          {title: '注册平台', key: 'registPlatform'},
          {title: '注册渠道', key: 'registChannel'},
          {title: '注册IP', key: 'ip'},
          {title: '注册时间', key: 'registDate'},
          {title: '省份'},
          {title: '城市'},
          {title: '最后登录时间'},
          {title: '最后退出时间'},
          {title: '最后购买时间'},
          {
            title: '操作',
            render: (h, parmas) => {
              return h('a', {
                dormProps: {
                  href: 'javascript:'
                },
                on: {
                  click: () => {
                    this.$parent.page = this.$parent.pages[1]
                  }
                }
              }, '查看')
            }
          }
        ],
        data1: [
          {id: '123496868', mobile: '13800138002', level: '黄金', nickname: 'air', sex: '未知', lastLoginWay: '微信授权', registPlatform: 'IOS', registChannel: '苹果应用市场', ip: '192.168.1.1'}
        ]
      }
    }
  }
</script>
