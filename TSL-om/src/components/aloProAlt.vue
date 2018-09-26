<!-- 单品商品的修改和编辑 -->
<style lang="scss" rel="stylesheet/scss" scoped>
.ivu-modal-content{
  width: 700px;
}
.cate-input {
  margin: 0px 0px 10px 180px;
  width: 450px;
}
.margin-10 {
  margin: 10px;
}
.row-cate {
  margin-left: 10px;
}
.my-input {
  width: 450px;
}
.tips-text {
  display: inline-block;
  color: #80848f;
  text-indent: 10px;
}
.my-btn-bar {
  text-align: center;
}
.color-input {
  width: 80px;
  margin: 0px 10px 0px 0px;
}
.diy-sku-box {
  margin: 10px;
  padding: 10px 0px 0px 0px;
  border: 1px solid #dddee1;
}
.my-close-icon {
  cursor: pointer;
}
.diy-sku-input {
  width: calc(100% - 20px);
}
.margin-bottom-10 {
  margin-bottom: 10px;
}
.margin-left-10 {
  margin-left: 10px;
}
.my-select {
  width: 150px;
}
</style>

<template>
  <div id="forsellSubmit">
    <Modal v-model="windowStatus" width="876">
      <Tabs v-model="currentStep">
        <TabPane label="商品名称：1">
          <p><b class="margin-10">商品信息 </b> / 销售属性 / </p>
          <Form :label-width="180">
            <FormItem label="商品名称："><Input class="my-input" :maxlength="50">{{infoConfig.name}}</Input><span class="tips-text">还能输入50个字</span></FormItem>
            <FormItem label="商品广告词："><Input class="my-input"  :maxlength="50">{{infoConfig.name}}</Input><span class="tips-text">还能输入50个字</span></FormItem>
            <FormItem label="产地："><Input class="my-input"  :maxlength="10"></Input><span class="tips-text">10个字以内</span></FormItem>
            <FormItem label="商品关键词："><Input class="my-input"></Input><span class="tips-text">关键词之间用空格隔开</span></FormItem>
            <FormItem label="商品简介："><Input type="textarea" :maxlength="200" class="my-input"></Input><span class="tips-text">200个字以内</span></FormItem>
          </Form>
          <div class="my-btn-bar">
            <Button class="margin-left-10" @click="next" :loading="commonAdding">下一步</Button>
          </div>
        </TabPane>
        <TabPane label="商品名称: ">
          <p>商品属性 / <b class="margin-10">销售属性</b> /</p>
          <Form :label-width="180">
            <FormItem label="商品图集: "><b class="margin-10">商品主图</b><UploadImg class="margin-left-10" ></UploadImg></FormItem>
            <FormItem label="软通售价：" :label-width="90"><Input class="my-input"><span slot="prepend">￥</span></Input></FormItem>
            <FormItem label="原价：" :label-width="90"><Input class="my-input"><span slot="prepend">￥</span></Input></FormItem>
            <FormItem label="展示库存(件)：" :label-width="90"><Input class="my-input"></Input></FormItem>
          </Form>
        </TabPane>
      </Tabs>
      
      <!-- <Form :label-width="180">
        <FormItem label="商品名称：" prop="name"><Input class="my-input" :maxlength="50"></Input><span class="tips-text">还能输入{{`${50 - baseInfo.name.length}`}}个字</span></FormItem>
        <FormItem label="商品广告词：" prop="advert"><Input class="my-input"  :maxlength="50"></Input><span class="tips-text">还能输入{{`${50 - baseInfo.advert.length}`}}个字</span></FormItem>
        <FormItem label="产地：" prop="placeOfOrigin"><Input class="my-input"  :maxlength="10"></Input><span class="tips-text">10个字以内</span></FormItem>
        <FormItem label="商品关键词：" prop="keyword"><Input class="my-input"></Input><span class="tips-text">关键词之间用空格隔开</span></FormItem>
        <FormItem label="商品简介："><Input type="textarea" v-model="baseInfo.desc" :maxlength="200" class="my-input"></Input><span class="tips-text">200个字以内</span></FormItem>
      </Form>
      <b class="margin-10">通用参数</b> -->
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'forsellSubmit',
    props: {
      subContent: [String, Object],
      value: [String, Boolean]
    },
    data () {
      return {
        infoConfig: {
          name: '',
          adverMes: ''
        }
      }
    },
    methods: {
      querryList () {
        console.log(this.subContent)
      }
    },
    computed: {
      windowStatus: {
        get: function () {
          return this.value
        },
        set: function (val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>
