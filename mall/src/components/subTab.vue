<template>
  <div id="subTab">
    <tabbar @on-index-change="onIndexChange">
      <tabbar-item :selected="select === 0">
        <div slot="icon">
          <my-svg v-show="select === 0" type="home" color="#352665" width="25" height="25" opacity="1"></my-svg>
          <my-svg v-show="select !== 0" type="home" color="#999999" width="25" height="25" opacity="1"></my-svg>
        </div>
        <div slot="label">首页</div>
      </tabbar-item>
      <tabbar-item :selected="select === 1" >
        <div slot="icon">
          <my-svg v-show="select === 1" type="bag" color="#352665" width="25" height="25" opacity="1"></my-svg>
          <my-svg v-show="select !== 1" type="bag" color="#999999" width="25" height="25" opacity="1"></my-svg>
        </div>
        <div slot="label">购物袋</div>
      </tabbar-item>
      <tabbar-item :selected="select === 2">
        <div slot="icon">
          <my-svg v-show="select === 2" type="me" color="#352665" width="25" height="25" opacity="1"></my-svg>
          <my-svg v-show="select !== 2" type="me" color="#999999" width="25" height="25" opacity="1"></my-svg>
        </div>
        <div slot="label">我的</div>
      </tabbar-item>   
    </tabbar>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Tabbar, TabbarItem } from 'vux'
  export default {
    name: 'subTab',
    components: { Tabbar, TabbarItem },
    props: {
      index: Number
    },
    data () {
      return {
        tabIndex: ''
      }
    },
    methods: {
      onIndexChange (thisIndex, lastIndex) {
        this.tabIndex = thisIndex
        if (lastIndex !== undefined && thisIndex !== lastIndex) {
          switch (thisIndex) {
            case 0: this.$router.push({path: '/home'})
              break
            case 1: this.$router.push({path: '/shoppingCart'})
              break
            case 2: this.$router.push({path: '/mine'})
              break
          }
        }
      }
    },
    computed: {
      select () {
        return this.tabIndex !== '' ? this.tabIndex : this.index
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#subTab {
  position: fixed;
  width: 100%;
  bottom: 0px;
}
</style>
