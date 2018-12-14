<template>
  <div>
    <div class="fixed">
      <header1></header1>
      <header2></header2>
    </div>
    <pageTemp :template="template"></pageTemp> 
    <v-footer></v-footer>
    <send-coupons></send-coupons>
  </div>
</template>

<script>
  import header1 from './header1'
  import header2 from './header2'
  import pageTemp from './pageTemp'
  import vFooter from './footer.vue'
  import sendCoupons from '../promotion/sendCoupons.vue'
  import * as pageAPI from '@/services/API/homePage.es6'
  export default {
    components:{
      header1,
      header2,
      pageTemp,
      vFooter,
      sendCoupons
    },
    data () {
      return {
        template: '',
        menuData1: [
          {
            name: '品牌介绍',
            flag: false,
            level: 1,
            status: 1,
            secondCategory: [
              { name: '品牌故事', level: 2, status: 1, insideLink: '/page/活动页面/tsl_story/130277485839458304', externalLink: '' }
            ]
          },
          {
            name: '珠宝类型',
            flag: false,
            level: 1,
            status: 1,
            secondCategory: [
              { name: '戒指', level: 2, status: 1, insideLink: '/pl/戒指', externalLink: '' },
              { name: '项链', level: 2, status: 1, insideLink: '/pl/项链', externalLink: '' },
              { name: '耳环', level: 2, status: 1, insideLink: '/pl/耳环', externalLink: '' },
              { name: '吊坠', level: 2, status: 1, insideLink: '/pl/吊坠', externalLink: '' }
            ]
          },
          {
            name: '珠宝系列',
            flag: false,
            level: 1,
            status: 1,
            secondCategory: [
              { name: 'THE 12 TREASURES', level: 2, status: 1, insideLink: '/pl/treasures', externalLink: '' },
              { name: 'RAINDROP & ETERNITY', level: 2, status: 1, insideLink: '/pl/RAINDROP & ETERNITY', externalLink: '' },
              { name: 'ESTRELLA', level: 2, status: 1, insideLink: '/pl/ESTRELLA', externalLink: '' },
              { name: 'ATELIER', level: 2, status: 1, insideLink: '/pl/ATELIER', externalLink: '' },
              { name: 'MOTION', level: 2, status: 1, insideLink: '/pl/MOTION', externalLink: '' }
            ]
          }
        ],
      }
    },
    mounted: function () {
      this.getHome()
      
    },
    methods: {
      getHome () {
        if (this.$store.state.home.templateStr !== "") {//eslint-disable-line
          console.log(1)
          this.template = this.$store.state.home.templateStr
        } else {
          this.$http.get(...pageAPI.getHome()).then(res => {
            if (res.data.code === 200) {
              this.template = res.data.template.templateJson
              console.log(res)
              this.$store.commit('setHomeTemp', this.template)
              console.log('给到')
            }
          })
        }
      },
      
    }
  }
</script>

<style lang="stylus" scoped>
  .fixed
    position fixed
    width 1200px
    // margin-bottom 
  
</style>