<style>
</style>
<template>
  <div id="sample">
    <Menu mode="horizontal" theme="dark" active-name="1">
      <div class="layout-nav">
        <Menu-item name="1">
          <Icon type="ios-navigate"></Icon>
          导航一
        </Menu-item>
        <Menu-item name="2">
          <Icon type="ios-keypad"></Icon>
          导航二
        </Menu-item>
        <Menu-item name="3">
          <Icon type="ios-analytics"></Icon>
          导航三
        </Menu-item>
        <Menu-item name="4">
          <Icon type="ios-paper"></Icon>
          导航四
        </Menu-item>
      </div>
    </Menu>
    <div class="content">
      <p>
        Page content of Sample.
      </p>
      Iconfont: apple <span class="icon icon-apple"></span>
      Iconfont: android <span class="icon icon-android"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  methods: {
  }
}
</script>
