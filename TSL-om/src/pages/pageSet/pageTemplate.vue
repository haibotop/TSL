<style lang="scss" rel="stylesheet/scss" scoped>
  #pageTemplate {
    min-width: 1000px;
    padding: 0px 10px 0px 10px;
    .box {
      margin: 10px 0px 0px 0px;
    }
    .temp {
      float: left;
      .temp-img {
        position: relative;
        width: 260px;
        height: 340px;
        overflow: hidden;
        text-align: center;
      }
      .temp-img .empty {
        background-color: #bbbec4;
        color: #495060;
        font-size: 20px;
        font-weight: 700;
        text-align: center;
        line-height: 340px;
      }
      .temp-img img {
        width: 100%;
        display: block;
      }
      .temp-img .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        line-height: 500px;
        display: none;
      }
      .temp-img:hover .mask {
        display: block;
      }
      .name {
        text-align: center;
      }
    }
  }
</style>
<template>
  <div id="pageTemplate">
    <Breadcrumb>
      <BreadcrumbItem to="/home/pageList" href="/home/pageList">页面管理</BreadcrumbItem>
      <BreadcrumbItem to="/home/pageList" href="/home/pageList">页面设置</BreadcrumbItem>
      <BreadcrumbItem>选择模板</BreadcrumbItem>
    </Breadcrumb>
    <Button class="btn-w" style="margin-top:10px;">返回</Button>
    <div class="box">
      <div class="temp">
        <div class="temp-img">
          <div class="empty">空白模板</div>
          <div class="mask">
            <Button type="primary" @click="userEmptyTemp">使用该模板</Button>
          </div>
        </div>
        <div class="name">空白模板</div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'pageTemplate',
    methods: {
      userEmptyTemp () {
        this.$router.push({path: 'setPage?temp=empty'})
      }
    }
  }
</script>
