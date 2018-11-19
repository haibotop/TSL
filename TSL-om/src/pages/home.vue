<style>
#home .content {
  position: absolute;
  top: 60px;
  bottom: 0px;
  width: 100%;
}
#home .content .left-nav {
  width: 220px;
  float: left;
  height: 100%;
  position: relative
}
#home .content .right-con {
  height: 100%;
  width: calc(100% - 220px);
  float: left;
  position: relative;
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
    <topNav></topNav>
    <div class="content">
      <div class="left-nav">
        <div style="overflow-y: scroll; position: absolute; top: 0px; bottom: 0px; width: 100%">
          <leftNav1></leftNav1>
        </div>
      </div>
      <div class="right-con">
        <div class="subpage">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import topNav from '../components/topNav.vue'
  import leftNav1 from '../components/leftNav1.vue'
//  import cryptoJs from 'crypto-js'
  //  import Loading from '../components/loading.vue'
  export default {
    name: 'home',
    components: {
      topNav,
      leftNav1
    },
    data () {
      return {
        theme: 'dark'
      }
    },
    methods: {
    }
  }
</script>
