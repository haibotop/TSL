<style>
#home_ .content {
  position: absolute;
  top: 60px;
  bottom: 0px;
  width: 100%;
}
#home_ .content .ivu-row,
#home_ .content .ivu-row .left-nav {
  height: 100%;
}
#home_ .content .ivu-row .right-con {
  height: 100%;
}
#home_ .my-tabs {
  margin-top: 10px;
}
#home_ .ivu-tabs-nav {
  padding-left: 10px;
}
#home_ .subpage {
  position: absolute;
  top: 48px;
  bottom: 0px;
  width: 100%;
  overflow-y: scroll;
}
</style>
<template>
  <div id="home_">
    <topNav select="productManage"></topNav>
    <div class="content">
      <Row>
        <Col span="4" class-name="left-nav">
          <div style="overflow-y: scroll; position: absolute; top: 0px; bottom: 0px; width: 100%">
            <leftNav1 :activeName="activeName" :openNames="openNames" @clickItem="clickItem"></leftNav1>
          </div>
        </Col>
        <Col span="20" class-name="right-con">
          <Tabs type="card" closable :animated="false" @on-click="clickTab" @on-tab-remove="removeTab" class="my-tabs" v-model="activeName">
            <TabPane :label="item.title" class="my-tabPane" v-for="(item, index) in tabsData" :key="index" :name="item.currentView">
            </TabPane>
          </Tabs>
          <div class="subpage">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
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
        selectTabs: '',
        activeName: sessionStorage.getItem('active') || '', // 当前页面
        openNames: ['0', '1', '2', '3', '4', '5'],
        tabsData: JSON.parse(sessionStorage.getItem('tab')) || []
      }
    },
    methods: {
      // 主动操作
      // 点击左侧目录
      clickItem (val) {
        // console.log(`click menuItem: ${val.currentView}`)
        this.openTab(val)
      },
      // 点击页面标签
      clickTab (val) {
        // console.log(`clickTab: ${val}`)
        this.openTab(val)
        this.activeName = val
        this.$router.push({path: val})
      },
      // 被动操作
      // iview的关闭自带关闭tab事件，故不能以数组的形式重新排列，只能置空
      removeTab (val) {
        for (let index in this.tabsData) {
          if (this.tabsData[index].currentView === val) {
            this.tabsData[index] = ''
            this.setInSeesion(this.tabsData)
            // this.$route.$destory()
            // 关闭窗口向后查找非false的窗口，查找到后打开
            let i = 0
            let j = 0
            while (1) {
              if (index * 1 + i < this.tabsData.length - 1) {
                i++
                if (this.tabsData[index * 1 + i]) {
                  this.openTab(this.tabsData[index * 1 + i])
                  break
                }
              } else {
                // 向后查找完毕未发现，向前查询
                while (1) {
                  j--
                  // 寻找到的下标值
                  if (this.tabsData[index * 1 + j]) {
                    this.openTab(this.tabsData[index * 1 + j])
                    return
                  } else if (index * 1 + j < 1) {
                    this.$router.push({path: 'default'})
                    return
                  }
                }
              }
            }
          }
        }
      },
      // 封装Tab标签会打开这个过程
      openTab (val) {
        if (JSON.stringify(this.tabsData).indexOf(JSON.stringify(val)) !== -1) {
        } else {
          this.tabsData.push(val)
        }
        this.activeName = val.currentView
        this.$router.push({path: val.currentView})
        this.setInSeesion(this.tabsData)
      },
      setInSeesion (val) {
        let arr1 = []
        for (let i of val) {
          if (i !== '') {
            arr1.push(i)
          }
        }
        sessionStorage.setItem('tab', JSON.stringify(arr1))
      }
    },
    watch: {
      activeName: function () {
        sessionStorage.setItem('active', this.activeName)
      }
    },
    activated () {
      console.log('i am active!')
    }
  }
</script>
