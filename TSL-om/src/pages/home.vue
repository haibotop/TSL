<style>
#home .content {
  position: absolute;
  top: 60px;
  bottom: 0px;
  width: 100%;
}
#home .content .ivu-row,
#home .content .ivu-row .left-nav {
  height: 100%;
}
#home .content .ivu-row .right-con {
  height: 100%;
}
#home .my-tabs {
  margin-top: 10px;
}
#home .ivu-tabs-nav {
  padding-left: 10px;
}
#home .subpage {
  position: absolute;
  top: 10px;
  bottom: 0px;
  width: 100%;
  overflow-y: scroll;
}
</style>
<template>
  <div id="home">
    <topNav select="productManage"></topNav>
    <div class="content">
      <Row>
        <Col span="4" class-name="left-nav">
          <div style="overflow-y: scroll; position: absolute; top: 0px; bottom: 0px; width: 100%">
            <leftNav1 :activeName="activeName" :openNames="openNames" @clickItem="clickItem"></leftNav1>
          </div>
        </Col>
        <Col span="20" class-name="right-con">
          <!-- <Tabs type="card" closable :animated="false" @on-click="clickTab" @on-tab-remove="removeTab" class="my-tabs" v-model="activeName">
            <TabPane :label="item.title" class="my-tabPane" v-for="(item, index) in activeName" :key="index" :name="item.currentView">
            </TabPane>
          </Tabs> -->
          <div class="subpage">
              <router-view></router-view>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import topNav from '../components/topNav.vue'
  import leftNav1 from '../components/leftNav1.vue'
  import subPages from '../services/subPages.js'

  export default {
    name: 'home',
    components: Object.assign({
      topNav,
      leftNav1
    }, subPages),
    data () {
      return {
        theme: 'dark',
        activeName: sessionStorage.getItem('activeName') || '',
        openNames: ['0', '1', '2', '3', '4', '5']
      }
    },
    methods: {
      // 主动操作
      // 点击左侧目录
      clickItem (val) {
        console.log(`click menuItem: ${val.currentView}`)
        this.openTab(val)
      },
      // 封装Tab标签会打开这个过程
      openTab (val) {
        // console.log('open-*-*-*-*-*-*-*-*-*' + val)
        // console.log(val)
        sessionStorage.setItem('activeName', val.currentView)
        this.activeName = val.currentView
        this.$router.push({path: val.currentView})
      }
    },
    mounted: function () {
    }
  }
</script>
