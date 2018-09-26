<style lang="scss" rel="stylesheet/scss" scoped>
.my-breadcrumb {
  margin: 0px 10px;
}
.ccContent {
  margin:20px;
}
.ccItem {
  display: inline-block;
  width: 20%;
}
.ccHandle{
  width: 30%;
}
.btnsize{
  margin: 10px;
  width: 80px;
}
.ccTable{
  width: 95%;
  margin: 0 auto;
}
</style>
<template>
  <div id="createCoupon">
    <div class="ccTitle">
      <Breadcrumb class="my-breadcrumb">
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>创建优惠券</BreadcrumbItem>
      </Breadcrumb>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'createCoupon',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
