<style scoped>
/* loading css*/
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
.demo-spin-col{
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
<template>
  <div>
    <Spin fix v-if="isload" class="position-middle" ref="spinClass">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    isload: {
      type: Boolean,
      default: true
    }
  },
  methods: {
  },
  watch: {
    isload: function () {
      if (this.isload) {
        this.$parent.$el.style.position = 'relative'
      }
    }
  }
}
</script>

