<style lang="scss" rel="stylesheet/scss" scoped>
.my-breadcrumb {
  margin: 0px 10px;
}
.pmSearch{
  margin: 20px;
}
</style>
<template>
  <div id="categoryAssociation">
    <div class="pmTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>商品管理</BreadcrumbItem>
        <BreadcrumbItem>商品管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="pmSearch">
      <Form :label-width="100">
        <row>
          <Col span="5">
          <FormItem label="商品名称 :">
            <Input placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
          <FormItem label="商品编码 :">
            <Input placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
          <FormItem label="SKU编码 :">
            <Input placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="丰盛榜售价 :">
            <Input placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
          <FormItem label="商品编码 :">
            <Input placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
          <FormItem label="SKU编码 :">
            <Input placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
          </Col>
          <Col span="10">
          <FormItem label="商品类目 :">
            <Select v-model="model1" size="small" style="width:100px">
              <Option v-for="item1 in list1" :value="item1.value" :key="item1.value">{{ item1.label }}</Option>
            </Select>
            <Select v-model="model2" size="small" style="width:100px">
              <Option v-for="item2 in list2" :value="item2.value" :key="item2.value">{{ item2.label }}</Option>
            </Select>
            <Select v-model="model3" size="small" style="width:100px">
              <Option v-for="item3 in list3" :value="item3.value" :key="item3.value">{{ item3.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="总销量 :">
            <Input placeholder="请输入" size="small" style="width: 120px"></Input>
          </FormItem>
          <FormItem label="上架时间 :">
            <Row>
              <Col span="12">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 170px"></DatePicker>
              </Col>
              <Col span="12">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" size="small" style="width: 170px"></DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </row>
      </Form>
    </div>
    <Table :columns="columns1" :data="data1" class="my-table"></Table>
    <div class="pmFooter">
      <Button @click="goback">返回</Button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'categoryAssociation',
  data () {
    return {
      model1: '',
      model2: '',
      model3: '',
      list1: [
        {
          value: 'beijing',
          label: '北京'
        }
      ],
      list2: [
        {
          value: 'beijing',
          label: '北京'
        }
      ],
      list3: [
        {
          value: 'beijing',
          label: '北京'
        }
      ],
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '商品编码'
        }, {
          title: '所属类目'
        }, {
          title: '店铺名称'
        }, {
          title: '商品信息'
        }, {
          title: '丰盛榜售价(元)'
        }, {
          title: '总库存'
        }, {
          title: '总销量'
        }, {
          title: '最新上架时间'
        }, {
          title: '商品状态'
        }, {
          title: '排序'
        }, {
          title: '操作'
        }
      ],
      data1: []
    }
  },
  methods: {
    goback () {
      this.$parent.page = 'cateshowManager'
    }
  }
}
</script>
