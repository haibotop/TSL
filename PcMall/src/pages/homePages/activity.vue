<template>
  <div id="activity">
    <header1></header1>
    <header2></header2>
    <h1 :title="title"></h1>
    <pageTemp :template="template"></pageTemp>
    <v-footer :goTopIsShow = false></v-footer>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as pageAPI from '@/services/API/homePage.es6'
  import pageTemp from './pageTemp.vue'
  import header1 from '@/pages/homePages/header1'
  import header2 from '@/pages/homePages/header2'
  import vFooter from '@/pages/homePages/footer.vue'
  let scrollerInterval 
  export default {
    name: 'activity',
    components: { pageTemp, header1, header2, vFooter },
    data () {
      return {
        title: '',
        template: ''
      }
    },
    watch: {
      '$route.path' () {
        this.getTemplate()
        this.scrollerHeightChange()
      }
    },
    mounted: function () {
      this.getTemplate()
      this.scrollerHeightChange()
    },
    methods: {
      scrollerHeightChange () {
        scrollerInterval = setInterval(() => {
          if (this.$refs.scroller) {
            if (this.$refs.scroller.$el.children[0].offsetHeight !== this.scrollerHeight) {
              this.scrollerHeight = this.$refs.scroller.$el.children[0].offsetHeight
              this.$refs.scroller.reset()
            } else {
              clearInterval(scrollerInterval)
            }
          }
        }, 1000)
      },
      getTemplate () {
        if (this.$route.params.pageId) {
          this.$http.get(...pageAPI.getTemplate(this.$route.params.pageId)).then(res => {
            this.title = res.data.template.name
            this.template = res.data.template.templateJson
          })
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      clearTimeout(scrollerInterval)
      next()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
