<template>
  <div id="home">
    <x-header :left-options="leftOptions">
      <div class="logo"><img src="../../assets/icons/logo.png" alt=""></div>
      <div slot="left">
        <my-svg @click.native="goShoppingCart" type="bag" color="#fff" width="26px" height="26px" opacity="1" style="position:absolute;top:-2px;left:-8px;"></my-svg>
        <my-svg @click.native="goMine" type="me" color="#fff" width="26px" height="26px" opacity="1" style="position:absolute;top:-2px;left:30px;"></my-svg>
      </div>
      <div slot="right">
        <!-- <x-icon @click="goShoppingCart" type="bag" size="30" style="fill:#fff;margin:-5px 5px 0px 0px;"></x-icon> -->
        <!-- <x-icon @click="goMine" type="person" size="30" style="fill:#fff;margin:-5px -5px 0px 0px;"></x-icon> -->

        <x-icon @click="openLeftMenu" type="navicon" size="38" style="fill: #fff;position:absolute;top:-8px;right:-8px;"></x-icon>
        <x-icon @click="goSearch" type="ios-search-strong" size="30" style="fill: #fff;position:absolute;top:-4px;right:35px;"></x-icon>
      </div>
    </x-header>

    <div v-transfer-dom>
      <popup v-model="menuFlag" position="right" width="60%" style="overflow-y: visible;margin-top:46px;">
        <scroller lock-x ref="menuScroller" height="-46">
          <div>
            <div class="menu-class" v-if="!category3">

              <div class="cate1" v-for="(item, index) in menuData" :key="index" v-if="item.status === 1">
                <div class="cate1-content" @click="onCate1(index)">
                  {{item.name}}
                  <div class="active" v-show="item.flag"></div>
                </div>
                <div class="divider"></div>
                <div v-show="item.flag" class="cate2">
                  <div class="cate2-content" v-for="(item2, index2) in item.secondCategory" :key="index2" v-if="item2.status === 1" @click="onCate2(item2)">
                    {{item2.name}}
                    <x-icon type="ios-arrow-right" size="24" style="fill:#989898;fill: rgb(152, 152, 152);position: absolute;top: 50%;transform: translateY(-50%);right:10px;"></x-icon>
                  </div>
                </div>
              </div>
            </div>
            <div class="menu-class" v-else>
              <div class="cate1-cate2" @click="category3 = ''">
                <x-icon type="ios-arrow-left" size="24" style="fill:#989898;position: absolute;top: 50%;transform: translateY(-50%);left:10px;"></x-icon>
                <span>{{cate1Cate2}}</span>
              </div>
              <div class="cate1" v-for="(item3, index3) in category3" :key="index3">
                <div class="cate2-content" @click="onCate3(item3)">
                  {{item3.name}}
                  <div class="divider"></div>
                </div>
              </div>
            </div>
          </div>
        </scroller>
      </popup>
    </div>

    <scroller ref="scroller" lock-x v-model="scrollerStatus" :bounce="false" height="-46">
      <pageTemp :template="template"></pageTemp>
    </scroller>

    <send-coupons></send-coupons>
    <!--<div class="online-consultation" @click="onlineConsultation">在线咨询</div>-->
  </div>
</template>
<script type="text/ecmascript-6">
  import { XHeader, TransferDom, Popup, Scroller } from 'vux'
  import pageTemp from './pageTemp.vue'
  import sendCoupons from '../promotion/sendCoupons.vue'
  import * as pageAPI from '@/services/API/homePage.es6'
  let scrollerInterval
  let scrollerInterval2
  export default {
    name: 'home',
    directives: {
      TransferDom
    },
    components: {XHeader, Popup, Scroller, pageTemp, sendCoupons},
    data () {
      return {
        leftOptions: {
          showBack: false,
          preventGoBack: true
        },
        menuFlag: false,
        scrollerHeight: 0,
        scrollerStatus: {
          pulldownStatus: 'default',
          pullupStatus: 'default'
        },
        template: '',
        // ----------菜单
        menuData1: [
          {
            name: '品牌介绍',
            flag: false,
            level: 1,
            status: 1,
            secondCategory: [
              // { name: '品牌故事', level: 2, status: 1, insideLink: '', externalLink: 'https://mp.weixin.qq.com/s/8AY2DNVvb6SXD_U9CSVIBQ' }
              // { name: '品牌故事', level: 2, status: 1, insideLink: '/page/测试测试/tsl_story/130281555793829888', externalLink: '' }
              // UAT
              { name: '品牌故事', level: 2, status: 1, insideLink: '/page/活动页面/tsl_story/130277485839458304', externalLink: '' }
              // product
//              { name: '品牌故事', level: 2, status: 1, insideLink: '/page/活动页面/tsl_story/130277485839458304', externalLink: '' }
              // { name: '非凡工艺', level: 2, status: 1, insideLink: '', externalLink: '' },
              // { name: '最新动向', level: 2, status: 1, insideLink: '', externalLink: '' }
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
              { name: 'KUHASHI', level: 2, status: 1, insideLink: '/page/%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2/KUHASHI%20%E7%BB%86%E8%90%83%E7%B3%BB%E5%88%97/141897387567292416', externalLink: '' },
              { name: 'SNOOPY ', level: 2, status: 1, insideLink: '/page/%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2/SNOOPY%20%E5%8F%B2%E5%8A%AA%E6%AF%94%E7%B3%BB%E5%88%97/141895095748206592', externalLink: '' },
              { name: 'ESTRELLA', level: 2, status: 1, insideLink: '/pl/ESTRELLA', externalLink: '' },
              { name: 'ATELIER', level: 2, status: 1, insideLink: '/pl/ATELIER', externalLink: '' },
              { name: 'MOTION', level: 2, status: 1, insideLink: '/pl/MOTION', externalLink: '' }
            ]
          }
        ],
        menuData2: [
          {
            name: '服务',
            flag: false,
            level: 1,
            status: 1,
            secondCategory: [
              { name: '分店网络', level: 2, status: 1, insideLink: '', externalLink: 'http://goldprice.tslj.cn/shopList/html/shopList.php?reg=CN' },
              { name: '客服中心', level: 2, status: 1, insideLink: 'clientService', externalLink: '' },
              // { name: '联络我们', level: 2, status: 1, insideLink: '/page/活动页面/联络我们/130553076457218048', externalLink: '' },
              { name: '友链：会员中心', level: 2, status: 1, insideLink: '', externalLink: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0f946bc97a01fe9b&redirect_uri=http%3A%2F%2Fwx0f946bc97a01fe9b.pub-wechat.bizvane.com%2FbizvaneApp%2Fviews%2Fmember_center.html&response_type=code&scope=snsapi_base&state=123&component_appid=wx7e7319a046a816d5&connect_redirect=1#wechat_redirect' }
            ]
          }
        ],
        category: [],
        menuData: [],
        category3: ''
      }
    },
    mounted: function () {
      this.menuData = [].concat(this.menuData1, this.category, this.menuData2)
      this.getHome()
      this.getCate()
      this.scrollerHeightChange()
      let temp = 0
      const that = this
      scrollerInterval2 = setInterval(() => {
        temp++
        that.$refs.scroller.reset()
        if (temp > 3) {
          clearInterval(scrollerInterval2)
        }
      }, 1300)
    },
    methods: {
      scrollerHeightChange () {
        scrollerInterval = setInterval(() => {
          if (this.$refs.scroller) {
            if (this.$refs.scroller.$el.children[0].offsetHeight !== this.scrollerHeight) {
              this.scrollerHeight = this.$refs.scroller.$el.children[0].offsetHeight
              this.$refs.scroller.reset()
              clearInterval(scrollerInterval)
            }
          }
        }, 1000)
      },
      getCate () {
        this.$http.get(...pageAPI.showList()).then(res => {
          if (res.data.code === 200) {
            let category = res.data.category
            for (let i of category) {
              i.flag = false
            }
            this.category = category
          }
          this.menuData = [].concat(this.menuData1, this.category, this.menuData2)
        }).catch(() => {
        })
        setTimeout(() => { this.$vux.loading.hide() }, 100)
      },
      getHome () {
        if (this.$store.state.home.templateStr) {
          this.template = this.$store.state.home.templateStr
        } else {
          this.$http.get(...pageAPI.getHome()).then(res => {
            if (res.data.code === 200) {
              this.template = res.data.template.templateJson
              this.$store.commit('setHomeTemp', this.template)
            }
          })
        }
      },
      openLeftMenu () { this.menuFlag = true },
      closeLeftMenu () { this.menuFlag = false },
      goSearch () {
        this.$router.push({path: `search`})
      },
      onCate1 (index) {
        if (this.menuData[index].flag) {
          this.menuData[index].flag = false
        } else {
          for (let i in this.menuData) {
            this.menuData[i].flag = false
          }
          this.menuData[index].flag = true
          this.cate1Cate2 = `${this.menuData[index].name}-`
        }
      },
      onCate2 (item) {
        if (item.id) {
          this.cate1Cate2 = this.cate1Cate2.split('-')[0] + '-' + item.name
          let threeCategory = []
          for (let i of item.threeCategory) {
            if (i.status === 1) {
              threeCategory.push(i)
            }
          }
          this.category3 = threeCategory
          this.$refs.menuScroller.reset({top: 0})
        } else if (item.insideLink) {
          if (item.insideLink === 'clientService') {
            window.qimoChatClick()
          } else {
            // 固定菜单内部链接
            this.$router.push({path: item.insideLink})
          }
        } else if (item.externalLink) {
          // 固定菜单外部链接
          window.location.href = item.externalLink
        }
      },
      onlineConsultation () {
        window.qimoChatClick()
      },
      onCate3 (item3) {
        this.$router.push({path: `pl?catalogId=${item3.id}&catalogName=${item3.name}&type=${item3.type}`})
      },
      goShoppingCart () {
        this.$router.push({path: '/shoppingCart'})
      },
      goMine () {
        this.$router.push({path: '/mine'})
      }
    },
    beforeRouteEnter: (to, from, next) => {
      function getUrlParam () {
        let url = window.location.href
        let obj = {}
        let arr = []
        if (url.indexOf('?') !== -1) {
          let str = url.substr(url.indexOf('?') + 1)
          arr = str.split('&')
          for (let i in arr) {
            obj[arr[i].split('=')[0]] = unescape(arr[i].split('=')[1])
          }
        }
        return obj
      }
      if (/\?backRoute=/.test(window.location.href)) {
        let href = window.location.href.split(window.location.host)[0] + window.location.host + '/#' + decodeURIComponent(getUrlParam().backRoute).replace('#/', '')
        href.replace('?from=singlemessage', '')
        window.location.href = href
      } else {
        next()
      }
    },
    beforeRouteLeave (to, from, next) {
      clearTimeout(scrollerInterval)
      clearTimeout(scrollerInterval2)
      next()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.logo {
    width: 140px;
    position: absolute;
    top: 12px;
    left: 0px;
    left: 50%;
    transform: translateX(-50%);
    img {
      display: block;
      width: 100%;
    }
}
.menu-class {
  color: #4d4d4d;
  .cate1 {
    text-indent: 20px;
    font-size: 16px;
    font-weight: 500;
    .cate1-content {
      position: relative;
      height: 45px;
      line-height: 45px;
    }
    .cate1-content .active {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 5px;
      height: 100%;
      background-color: $tsl-color;
    }
  }
  .divider {
    border-bottom: 2px solid #e6e6e6;
  }
  .cate2-content {
    position: relative;
    font-size: 14px;
    height: 45px;
    line-height: 45px;
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
  }
}
.cate1-cate2 {
  position: relative;
  height: 45px;
  padding-left: 45px;
  line-height: 45px;
  overflow: hidden;
}
.online-consultation{
  background: #352665;
  color: #fff;
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  text-align: center;
  padding: 10px 3px;
  font-size: 18px;
}
</style>
