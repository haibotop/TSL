<style scoped>
  .logo {
    width: 200px;
    height: 40px;
    margin: 10px;
    float: left;
    background-color: #EEE;
  }

  .user {
    position: absolute;
    top: 0px;
    right: 20px;
    color: #fff;
  }

  .user i {
    margin: 0px 10px;
  }

  .user a {
    color: #FFF;
  }
</style>
<template>
  <div id="topNav">
    <Menu mode="horizontal" :theme="theme" :active-name="select">
      <div class="logo"></div>
      <div class="nav">
        <MenuItem name="productManage">商品管理</MenuItem>
        <MenuItem name="dealManage">交易管理</MenuItem>
        <MenuItem name="sysManage">系统管理</MenuItem>
      </div>
      <div class="user"><span>您好：test1 </span><i>|</i><a href="javascript:">密码修改</a><i>|</i><a
        href="javascript:">安全退出</a></div>
    </Menu>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'topNav',
  data () {
    return {
      theme: 'dark'
    }
  },
  props: ['select']
}
</script>
