<template>
  <div>
    <component v-bind:is="page"></component>
  </div>
</template>
<script type="text/ecmascript-6">
import couponList from "couponList.vue"
import createCoupon from "createCoupon.vue"
export default {
  components: {
    couponList,
    createCoupon
  },
  data () {
    return {
      page: 'createCoupon',
      pages: ['couponList', 'createCoupon']
    }
  }
}
</script>

