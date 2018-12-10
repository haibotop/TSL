<template>
  <div id="pdRichText">
    <!-- <scroller lock-x ref="scroller" height="-90"> :style="`min-height: ${height}px;`"-->
    <div class="rich-wrapper" >
      <div id="richContent" style="width:80%;margin: 0 auto">

      </div>
    </div>
    <!-- </scroller> -->
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pdAPI from '@/services/API/pdServices.es6'
  // import { Scroller } from 'vux'
  let interval
  export default {
    name: 'pdRichText',
    components: {
      // Scroller
    },
    data () {
      return {
        // height: 230,
        richText: ''
      }
    },
    props: {
      spuId: String
    },
    mounted: function () {
      // this.height = document.body.clientHeight - 90
      interval = setInterval(() => {
        if (this.spuId) {
          this.getProductDetail(this.spuId)
        }
      }, 0)
    },
    methods: {
      getProductDetail (spuId) {
        this.$http.get(...pdAPI.getProductDetail(spuId)).then(res => {
          this.richText = res.data.richContent
          document.getElementById('richContent').innerHTML = this.richText
        })
        clearInterval(interval)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >

// #pdRichText img {
//   display: block;
//   width: 100% !important;
// }
// #pdRichText video {
//   width: 100% !important;
// }
// #richContent {
//   width: 50%;
//   margin: 0 auto;
// }
// .rich-wrapper {
//   overflow-x: visible;
//   overflow-y: scroll;
// }
</style>

