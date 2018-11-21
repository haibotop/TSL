<template>
  <div id="addProduct">
    <Breadcrumb class="margin-10">
      <BreadcrumbItem>商品管理</BreadcrumbItem>
      <BreadcrumbItem>发布新商品</BreadcrumbItem>
      <BreadcrumbItem>选择类目</BreadcrumbItem>
      <BreadcrumbItem>实物</BreadcrumbItem>
    </Breadcrumb>

    <Tabs type="card" :animated="false" class="margin-10" ref="tab" v-model="currTab">
      <TabPane label="商品信息">
        <addPPart1 :currCate="currCate" :currCateId="currCateId" @next="part1OK" @selectCate="goSelect"></addPPart1>
      </TabPane>

      <TabPane label="更多详情" :disabled="currTab < 1">
        <addPPart3 @next="part3OK" @back="partBack"></addPPart3>
      </TabPane>

      <TabPane label="销售属性" :disabled="currTab < 2">
        <addPPart2 :currCateId="currCateId" :spuId="spuId" :richText="richText" @next="part2OK" @back="partBack"></addPPart2>
      </TabPane>
    </Tabs>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pAPI from '../../../services/product.es6'
  import addPPart1 from './addPPart1.vue'
  import addPPart2 from './addPPart2.vue'
  import addPPart3 from './addPPart3.vue'
  export default {
    name: 'addProduct',
    components: {
      addPPart1,
      addPPart2,
      addPPart3
    },
    data () {
      return {
        currTab: 0,
        // 当前类目
        currCate: '',
        currCateId: '',
        spuParams: '',
        spuId: '',
        richText: ''
      }
    },
    mounted: function () {
      this.currCate = this.$parent.currCate.path
      this.currCateId = this.$parent.currCate.cate3.id
    },
    methods: {
      goSelect () {
        this.$parent.page = 'selectCate'
      },
      part1OK (val) {
        this.spuParams = val
        this.creatSpu(this.spuParams, () => {
          this.currTab++
        })
      },
      partBack () {
        this.currTab--
      },
      part3OK (val) {
        this.richText = val
        this.currTab++
      },
      part2OK (val) {
        window.location.reload()
      },
      creatSpu (params, callback) {
        this.$http.post(...pAPI.commonSpecArrray(params)).then((response) => {
          if (response.data.code === 200) {
            this.spuId = response.data.data
            callback()
          }
        })
      }
    },
    watch: {
      currTab (newV, oldV) {
        if (newV !== oldV) {
          if (this.$refs.tab) {
            this.$refs.tab.activeKey = newV
          }
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  #addProduct {
    min-width: 1100px;
  }
  #addProduct .ivu-tabs-bar {
    margin-bottom: 0px;
  }
  #addProduct .ivu-tabs-nav {
    padding-left: 0px;
  }
  #addProduct .ivu-tabs-content {
    border: 1px solid #dddee1;
    border-top: none;
    padding: 10px 0px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  .margin-10 {
    margin: 10px;
  }
</style>
