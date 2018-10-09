<style lang="scss" rel="stylesheet/scss">
    .page-fenye{
        padding: 50px 0;
        .ivu-page-item-active, .ivu-page-next:hover, .ivu-page-prev:hover{
            border-color: #352665;
        }
        .ivu-page-item:hover{
            border-color: #352665;
        }
        a,a:hover, a:active, .ivu-page-item:hover a, .ivu-page-item-active a, .ivu-page-next:hover a, .ivu-page-prev:hover a{
            color: #352665;
        }
        .ivu-page-disabled:hover,.ivu-page-disabled a,.ivu-page-disabled:hover a{
            color: #ccc;
            border-color: #dcdee2;
        }
    }
</style>
<style scoped lang="scss" rel="stylesheet/scss">
    #pl{
        background: #fafafa;
        color: #111;
        .common-title{
            padding: 40px 0;
            text-align: center;
            .common-t{
                position: relative;
                display: inline-block;
                text-align: center;
                font-size: 20px;
                color: #0F0F0F;
            }
            .common-t:after{
                content: '';
                position: absolute;
                bottom: -40px;
                left: 50%;
                margin-left: -20px;
                display: inline-block;
                width: 40px;
                height: 2px;
                background-color: #504379;
            }
            .xiegang:after{
                content: '';
                position: relative;
                top: 8px;
                margin: 0 20px;
                display: inline-block;
                width: 1px;
                height: 30px;
                background-color: #2E0F6E;
                transform: rotate(30deg);
            }
        }
        .goods-content{
            padding: 0 60px;
            .filter-nav{
                padding: 30px 30px 0;
                font-size: 14px;
                .ivu-dropdown{
                    a{
                        color: #111;
                    }
                    i{
                        margin-left: 5px;
                        color: #352665;
                    }
                }
                .sort-type{
                    display: inline-block;
                }
                .sort-type-r{
                    float: right;
                }
                .filter-txt{
                    margin-right: 20px;
                }
                .filter-box{
                    margin-top: 40px;
                    margin-right: 15px;
                    display: inline-block;
                    height: 28px;
                    line-height: 26px;
                    padding: 0 10px;
                    color: #352665;
                    border: 1px solid #352665;
                    span{
                        padding-right: 20px;
                    }
                    .btn-close{
                        margin-top: -2px;
                    }
                }
            }
            .goods-items{
                ul{
                    display: inline-block;
                    margin-top: 10px;
                    li{
                        float: left;
                        width: 240px;
                        height: 365px;
                        margin: 20px 10px 0;
                        border:2px solid transparent;
                        .pic{
                            height: 240px;
                            background-color: #fff;
                            cursor: pointer;
                            .pic-img{
                                width: 100%;
                                display: inline-block;
                                text-align: center;
                                    img{
                                        width: 100%;
                                    }

                            }
                        }
                    }
                    li:hover{
                        border: 2px solid #352665;
                    }
                    .goods-items-footer{
                        padding: 15px 0;
                        .explain{
                            padding: 0 36px;
                            line-height: 16px;
                            font-size: 14px;
                            text-align: center;
                            color: #000;
                        }
                        .price{
                            text-align: center;
                            color: blue;
                        }
                        .price_{
                            text-align: center;
                            color: #ccc;
                        }
                    }
                }
            }
        }
    }
</style>
<template>
  <div id="pl">
    <header1></header1>
    <header2></header2>
    <div class="goods-content">
        <div class="common-title">
            <div class="common-t">首页 <span class="xiegang"></span> 搜索结果</div>
        </div>
        <div class="filter-nav">
            <div class="filter-nav-t">
                <div class="sort-type">
                    <span>排序方式：</span>
                    <Dropdown trigger="click" @on-click="change_filter">
                        <a href="javascript:void(0)" name="filter-total" v-html="this.filterTxt">综合</a>
                        <Icon type="ios-arrow-down"></Icon>
                        <DropdownMenu slot="list">
                            <DropdownItem name="filter-total">综合</DropdownItem>
                            <DropdownItem name="filter-sailNum">销量</DropdownItem>
                            <DropdownItem name="filter-price">价格</DropdownItem>
                            <DropdownItem name="filter-time">时间</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>

      <!-- <scroller
      ref="scroller"
      lock-x
      use-pullup
      @on-pullup-loading="onPullup"
      use-pulldown
      @on-pulldown-loading="onPulldown"
      height="-91"
      :pullup-config="pullupDefaultConfig"
      :pulldown-config="pulldownDefaultConfig"> -->
        <div class="goods-items">
            <div class="no-datas" v-if="(datas || []).length === 0">暂无数据</div>
            <ul>
                <li v-for="(item, index) in datas" :key="index" @click="goPd(item.defaultSkuId)">
                    <div class="pic" @click="goPd(item.defaultSkuId)">
                        <div class="pic-img">
                            <img :src="item.defaultPicture" :alt="handleName(item.skuName)" >
                        </div>
                    </div>
                    <div class="goods-items-footer">
                        <p class="explain">{{handleName(item.spuName)}}</p>
                        <p class="price" :style="`color: ${color};`">{{ '￥' + handlePrice(item.price) }}</p>
                        <p class="price_">￥1.009</p>
                    </div>
                </li>
            </ul>
        </div>
        <Page :total="100" class="page-fenye" />

        <!--<div :class="listLayout" :style="listStyle" >-->
          <!--<div class="no-datas" v-if="(datas || []).length === 0">暂无数据</div>-->
          <!--<div class="block" v-for="(item, index) in datas" :key="index" @click="goPd(item.defaultSkuId)">-->
            <!--<div class="img-block">-->
              <!--<div class="img-block-inner">-->
                <!--<img :src="item.defaultPicture" alt="">-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="info-block">-->
              <!--<p class="name">-->
                <!--{{handleName(item.spuName)}}-->
              <!--</p>-->
              <!--<span class="price" :style="`color: ${color};`">{{ '￥' + handlePrice(item.price) }}</span>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!-- </scroller> -->

    </div>
    <v-footer></v-footer>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as tool from '@/services/myTool.es6'
  import * as api from '@/services/API/searchServices.es6'
  // import { XHeader, Icon, Tab, TabItem, Scroller } from 'vux'
  import header1 from '@/pages/homePages/header1'
  import header2 from '@/pages/homePages/header2'
  import vFooter from '@/pages/homePages/footer'
  let timeout = ''
  let interval
  export default {
    name: 'pl',
    components: {
      header1,
      header2,
      vFooter
      // XHeader,
      // Icon,
      // Tab,
      // TabItem,
      // Scroller
    },
    data () {
      return {
        rotreParams:'',
        currentPage: 1,
        pageSize: 10,
        totalCount: null,
        totalPage: null,
        color: '#352665',
        keyword: '',
        catalogId: '',
        catalogName: '',
        filterTxt: '综合',
        catalogType: '',
        leftOption: {
          backText: ''
        },
        pullupConfig: {
          content: 'Pull Up To Refresh',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: 'Release To Refresh',
          upContent: 'Pull Up To Refresh',
          loadingContent: 'Loading...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        // ----------0综合 1销量 2价格 3评论
        currTabSort: 0,
        // ----------1升序 2降序
        sort: 1,
        // 商品列表
        datas: [],
        listLayout: 'row-layout',
        pullupDefaultConfig: {
          content: '上拉刷新',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '释放后加载',
          upContent: '已到底端',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        pulldownDefaultConfig: {
          content: '下拉刷新',
          height: 40,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '释放后刷新',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pulldown-'
        }
      }
    },
    mounted: function () {
      this.getParamsFromUrl()
      this.getPl()
      this.bus.$on('changData', (data) => {
        this.keyword =  data
        this.getPl() 
      })
      // interval = setInterval(() => {
      //   if (this.$refs.scroller) {
      //     this.$refs.scroller.reset()
      //     clearInterval(interval)
      //   }
      // }, 0)
    },
    // watch: {
    //   rotreParams: function (val, oldVal) {
    //     console.log('new: %s, old: %s', val, oldVal)
    //   },
    // },
    methods: {
        change_filter(name){
            console.log(name)
          if(name == 'filter-total'){
              this.filterTxt = '综合'
          }else if(name == 'filter-sailNum'){
                this.filterTxt = '销量'
          }else if(name == 'filter-price'){
              this.filterTxt = '价格'
          }else if(name == 'filter-time'){
              this.filterTxt = '时间'
          }
        },
      getParamsFromUrl () {
        if (this.$route.query.catalogId) {
          this.catalogId = this.$route.query.catalogId
          this.catalogName = this.$route.query.catalogName
          this.catalogType = this.$route.query.type
        }
        if (this.$route.params.keyword) {
          this.keyword = this.$route.params.keyword
        }
      },
      getPl () {
        let query = {}
        query.currentPage = this.currentPage
        query.pageSize = this.pageSize
        // sort 1：价格升序、2：价格降序、3:销量降序、4：评论数降序、5：时间降序
        switch (this.currTabSort) {
          case 0: break
          case 1: query.sort = 3; break
          case 2: query.sort = this.sort === 1 ? 1 : 2; break
          case 3: query.sort = 5; break
        }
        if (this.keyword) {
          this.keyword = this.keyword.replace(/s+/g, '')
          query.keyword = this.keyword
          console.log('每次必进1',this.keyword)
          this.query(query)
        } else if (this.catalogId) {
          console.log('每次必进2',this.keyword)
          query.catalogId = this.catalogId
          query.catalogName = this.catalogName
          query.type = this.catalogType
          this.catelogQuery(query)
        }
      },
      // ----------商品搜索-关键词-接口
      query (query) {
        query.keyword = query.keyword.replace(/\s+/g, '')
        console.log(query)
        this.$http.post(...api.query(query)).then(res => {
          this.handleRes(true, res)
        }).catch(() => {
          this.handleRes(false)
        })
      },
      // ----------商品搜索-类目id-接口
      catelogQuery (query) {
        this.$http.post(...api.catelogQuery(query)).then(res => {
          this.handleRes(true, res)
        }).catch(() => {
          this.handleRes(false)
        })
      },
      // ----------处理数据
      handleRes (flag, res) {
        if (flag) {
          // http 200
          if (res.data.code === 200) {
            // 首刷 || 下拉
            if (this.currentPage === 1) {
              this.datas = res.data.page.datas
              // this.$refs.scroller.donePulldown()
              // this.$refs.scroller.reset({top: 0})
            } else {
              // 上拉
              this.datas = this.datas.concat(res.data.page.datas)
              // this.$refs.scroller.donePullup()
            }
            this.totalCount = res.data.page.totalCount
            this.totalPage = res.data.page.totalPage
          }
        } else {
          // http !200
          if (this.currentPage === 1) {
            // this.$refs.scroller.donePulldown()
          } else {
            // this.$refs.scroller.donePullup()
          }
        }
      },
      // ----------跳转到搜索页
      goSearch () {
        let path
        console.log('goSearch', this.keyword)
        this.keyword = this.keyword.replace(/\s+/g, '')
        if (this.keyword) {
          path = `../search/${this.keyword}`
        } else {
          path = 'search'
        }
        this.$router.replace({path: path})
      },
      // ----------切换tab及sort
      setTabItem (index) {
        if (this.currTabSort === index && index === 0) {
          return
        }
        if (this.currTabSort === index && this.sort === 1) {
          this.sort = 2
        } else if (this.currTabSort === index && this.sort === 2) {
          this.sort = 1
        } else {
          this.sort = 1
        }
        this.currTabSort = index
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          this.getPl()
          clearTimeout(timeout)
          timeout = ''
        }, 300)
      },
      onPulldown () {
        this.currentPage = 1
        this.getPl()
      },
      // ----------上拉
      onPullup () {
        if (this.currentPage < this.totalPage) {
          this.currentPage++
          this.getPl()
        } else {
          // this.$refs.scroller.donePullup()
        }
      },
      // ----------跳转商品详情
      goPd (skuId) {
        this.$router.push({path: `../pd/${skuId}`})
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      handleName (name) {
        return tool.handleName(name)
      }
    },
    computed: {
      // 三角形样式
      triangles () {
        let wrapper = [['', ''], ['', ''], ['', ''], ['', '']]
        for (let i in wrapper) {
          if ([1, 3].indexOf(this.currTabSort) !== -1) {
            wrapper[i][0] = ''
            wrapper[i][1] = this.currTabSort === parseInt(i) ? `border-top-color: ${this.color}` : ''
          } else {
            wrapper[i][0] = this.currTabSort === parseInt(i) && this.sort === 1 ? `border-bottom-color: ${this.color}` : ''
            wrapper[i][1] = this.currTabSort === parseInt(i) && this.sort === 2 ? `border-top-color: ${this.color}` : ''
          }
        }
        return wrapper
      },
      listStyle () {
        return `min-height: ${document.body.clientHeight - 90}px;`
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.search-bar {
  position: absolute;
  left: 50px;
  top: 9px;
  width: 80%;
  height: 28px;
  background: #f2f2f2;
  border-radius: 6px;
  .search-icon {
    float: left;
    line-height: 30px;
    margin: 0px 0px 0px 10px;
  }
  .search-text {
    float: left;
    margin: 0px 0px 0px 5px;
    line-height: 28px;
  }
}
.tab-item-sort {
  position: relative;
  .up {
    position: absolute;
    top: calc(50% - 6px);
    right: -15px;
    width: 0px;
    height: 0px;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #ddd;
    border-left: 4px solid transparent;
  }
  .down {
    position: absolute;
    bottom: calc(50% - 6px);
    right: -15px;
    width: 0px;
    height: 0px;
    border-top: 4px solid #ddd;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
}
.no-datas {
  text-align: center;
  padding: 10px 0px;
}
.column-layout {
  position: relative;
  overflow: hidden;
  width: calc(100% - 10px);
  padding: 10px 10px 0px 0px;
  .block {
    position: relative;
    float: left;
    margin: 0px 0px 0px 10px;
    width: calc(50% - 10px);
    background:#fff;
  }
  .img-block {
    width: 100%;
    position: relative;
    img {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      background: #ddd;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .img-block:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .info-block {
    .name {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .price {
      bottom: 0;
      font-weight: 400;
    }
  }
}
.row-layout {
  position: relative;
  width: 100%;
  .block {
    position: relative;
    overflow: hidden;
    width: 100%;
    border-bottom: 1px solid #eee;
    background: rgb(250,250,250);
  }
  .img-block {
    width: 100%;
  }
  .img-block-inner {
    width: 28%;
    height: 100%;
    position: relative;
    float: left;
    img {
      background: #ddd;
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .img-block-inner:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .info-block {
    width: calc(72% - 24px);
    padding: 0px 14px 0px 10px;
    position: absolute;
    top: 0;
    bottom: 0px;
    right: 0;
    float: left;
    .name {
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 14px;
      line-height: 20px;
    }
    .price {
      position: absolute;
      bottom: 5px;
      right: 14px;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>

