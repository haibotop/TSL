<style lang="scss" rel="stylesheet/scss">
    .page-fenye{
        text-align: right;
        padding: 50px 0;
        .ivu-page-item:hover, .ivu-page-item-active, .ivu-page-next:hover,
        .ivu-page-prev:hover, .ivu-page-options-elevator input:hover, .ivu-page-options-elevator input:focus{
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
                    text-align: center;
                    span{
                        position: relative;
                        padding: 0 30px;
                        display: inline-block;
                        width: 90px;
                        color: #333;
                        cursor: pointer;
                    }
                    span:after{
                        display: inline-block;
                        position: absolute;
                        top: 3px;
                        right: 0px;
                        content: '';
                        width: 1px;
                        height: 14px;
                        background-color: #c4c4c4;
                    }
                    span:last-child:after{
                        background-color: transparent;
                    }
                    .classblue{
                        color: #352665;
                    }
                    .arrowDown:before{
                        position: absolute;
                        top: 14px;
                        right: 19px;
                        content: '';
                        display: inline-block;
                        border: 4px solid transparent;
                        border-top-color: #c7c7c7;
                    }
                    .arrowDown:after{
                        position: absolute;
                        top: 4px;
                        right: 22px;
                        content: '';
                        display: inline-block;
                        width: 2px;
                        height: 11px;
                        background-color: #c7c7c7;
                    }
                    .arrowUp:before{
                        position: absolute;
                        top: 1px;
                        right: 19px;
                        content: '';
                        display: inline-block;
                        border: 4px solid transparent;
                        border-bottom-color: #c7c7c7;
                    }
                    .arrowUp:after{
                        position: absolute;
                        top: 7px;
                        right: 22px;
                        content: '';
                        display: inline-block;
                        width: 2px;
                        height: 11px;
                        background-color: #c7c7c7;
                    }
                    .arrowDownActive:before{
                        border-top-color: #352665;
                    }
                    .arrowDownActive:after{
                        background-color: #352665;
                    }
                    .arrowUpActive:before{
                        border-bottom-color: #352665;
                    }
                    .arrowUpActive:after{
                        background-color: #352665;
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
                        margin: 20px 10px 0;
                        border:2px solid transparent;
                        cursor: pointer;
                        .pic{
                            height: 240px;
                            background-color: #fff;
                            .pic-img{
                                width: 100%;
                                height: 100%;
                                display: inline-block;
                                text-align: center;
                                    img{
                                        width: 100%;
                                        height: 100%;
                                    }

                            }
                        }
                    }
                    li:hover{
                        border: 2px solid #352665;
                    }
                    .goods-items-footer{
                        position: relative;
                        height: 110px;
                        .vertical-middel{
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            width: 100%;
                        }
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
        .goTo-top{
            padding: 10px;
            background: #352665;
            color: #fff;
            text-align: center;
            border-radius: 2px;
        }
    }
</style>
<template>
  <div id="pl">
    <header1></header1>
    <header2></header2>
    <div class="goods-content">
        <div class="common-title">
            <div class="common-t">{{this.$route.query.type}} <span class="xiegang"></span> {{this.$route.query.typeName}}</div>
        </div>
        <div class="filter-nav">
            <div class="filter-nav-t">
                <div class="sort-type" @click="change_filter($event)">
                    <span v-for="(item,index) of sortArray" :data-num="index" :class="{classblue:index == currentSort}">
                        {{item}}
                        <i :data-num="index" :class="{arrowUp:index == 4, arrowDown:index != 4,
                        arrowDownActive:index == currentSort && index !=4, arrowUpActive:index == currentSort && index ==4}" ></i>
                    </span>

                </div>
            </div>
        </div>

        <div class="goods-items">
            <div class="no-datas" v-if="(datas || []).length === 0">暂无数据</div>
            <ul>
                <li v-for="(item, index) in datas" :key="index" @click="goPd(item.defaultSkuId)">
                    <div class="pic">
                        <div class="pic-img">
                            <img :src="item.defaultPicture" :alt="handleName(item.skuName)" >
                        </div>
                    </div>
                    <div class="goods-items-footer">
                        <div class="vertical-middel">
                            <p class="explain">{{handleName(item.spuName)}}</p>
                            <p class="price" :style="`color: ${color};`">{{ '￥' + handlePrice(item.price) }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <Page :total="this.totalCount" :page-size="pageSize" :show-total="true" :show-elevator="true"
              @on-change="getDataList" @on-page-size-change="getPageList" class="page-fenye" />
        <BackTop :height="100" :bottom="100">
            <div class="goTo-top">返回顶部</div>
        </BackTop>


    </div>
    <v-footer></v-footer>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as tool from '@/services/myTool.es6'
  import * as api from '@/services/API/searchServices.es6'
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
    },
    data () {
      return {
        sortArray:['综合','销量','时间','价格','价格'],
        rotreParams:'',
        currentSort: -1,
        currentPage: 1,
        pageSize: 16,
        totalCount: null,
        totalPage: null,
        color: '#352665',
        keyword: '',
        catalogId: '',
        catalogName: '',
        catalogType: '',
          filterTxt: '综合',
          // ----------0综合 1销量 2价格 3评论
          currTabSort: 0,
          // ----------1升序 2降序
          sort: 1,
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
    watch: {
      rotreParams: function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      },
        '$route':'getParamsFromUrl'
    },
    methods: {
        //分页
        getDataList(page){
            this.currentPage = page
            this.getPageList()
        },
        getPageList(){
            this.getPl()
        },
        //排序方式
        change_filter(event){
          let num = event.target.dataset.num
            console.log(num)
          if(num == 0){
              this.filterTxt = '综合'
              this.currentSort = num;
              this.currTabSort = 0

          }else if(num == 1){
                this.filterTxt = '销量'
              this.currentSort = num;
              this.currTabSort = 1
          }else if(num == 2){
              this.filterTxt = '时间'
              this.currentSort = num;
              this.currTabSort = 2
          }else if(num == 3){
              this.filterTxt = '价格降序'
              this.currentSort = num;
              this.currTabSort = 3
          }else if(num == 4){
              this.filterTxt = '价格升序'
              this.currentSort = num;
              this.currTabSort = 4
          }
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                this.getPl()
                clearTimeout(timeout)
                timeout = ''
            }, 300)
        },
      getParamsFromUrl () {
        if (this.$route.query.catalogId) {
          this.catalogId = this.$route.query.catalogId
          this.catalogName = this.$route.query.catalogName
          this.catalogType = this.$route.query.type
        }
        if (this.$route.params.keyword) {
            // console.log('11',this.$route.params)
          this.keyword = this.$route.params.keyword
            this.getPl ()
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
          case 2: query.sort = 5; break
          case 3: query.sort = 2; break
          case 4: query.sort = 1; break
        }
        if (this.keyword) {
          this.keyword = this.keyword.replace(/s+/g, '')
          query.keyword = this.keyword
          // console.log('搜索词',this.keyword)
          this.query(query)
        } else if (this.catalogId) {
          // console.log('keyword',this.keyword)
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
                this.datas = res.data.page.datas
              // 上拉
              // this.datas = this.datas.concat(res.data.page.datas)
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
        let params = this.$route.query
        console.log(params)
        localStorage.setItem('jewelryType',JSON.stringify(params))
        console.log('localStorage.getItem(',JSON.parse(localStorage.getItem('jewelryType')) )
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

