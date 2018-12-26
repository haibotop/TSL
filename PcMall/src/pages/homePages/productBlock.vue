<template>
     <div id="productBlock">
        <!-- <h3>人气推荐</h3> -->
        <div class="carousel">
            <!-- <Carousel  :radius-dot=true :height="380">
                <CarouselItem> -->
                    <!-- <div class="swiper-img">
                        <router-link tag="a" :to="item.url">
                        <img :src="item.img" alt="">
                        </router-link>
                    </div> -->
            <div class="goods-items">
                <ul>
                    <li v-for="(item, index) in pList" :key="index" @click="goPd(item.defaultSkuId)">
                        <div class="pic" @click="goPd(item.defaultSkuId)">
                            <div class="pic-img">
                                <img :src="item.defaultPicture" :alt="handleName(item.skuName)" >
                            </div>
                        </div>
                        <div class="goods-items-footer">
                            <div class="vertical-middel">
                                <p class="explain">{{handleName(item.skuName)}}</p>
                                <p class="price" :style="`color: ${color};`">{{ '￥' + handlePrice(item.price) }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
                    <!--<div class="carousel-content">-->
                        <!--<ul>-->
                            <!--<li v-for="(item, index) in pList" :key="index" >-->
                                <!--<div class="pic" @click="goPd(item.defaultSkuId)">-->
                                  <!--<div class="pic-img">-->
                                    <!--<img :src="item.defaultPicture" :alt="handleName(item.skuName)" >-->
                                  <!--</div>                                  -->
                                <!--</div>-->
                                <!--<div class="product-info">-->
                                    <!--<p class="explain">{{handleName(item.skuName)}}</p>-->
                                    <!--<p class="price" :style="`color: ${color};`">{{ '￥' + handlePrice(item.price) }}</p>-->
                                <!--</div>-->
                            <!--</li>                           -->
                        <!--</ul>-->
                    <!--</div>-->
                <!-- </CarouselItem>
            </Carousel> -->
        </div>
         <div style="clear: both;"></div>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as tool from '@/services/myTool.es6'
  let interval1
  export default {
    name: 'productBlock',
    data () {
      return {
        color: '#352665',
        defaultStyle: '1',
        clientWidth: '0',
        pImgH: '0'
      }
    },
    props: {
      config: [String, Object]
    },
    mounted () {
      // 图片长宽相等
      interval1 = setInterval(() => {
        if (this.config) {
          if (this.config.pList.length > 0) {
            if (document.getElementById(this.config.pList[0].id)) {
              this.pImgH = document.getElementById(this.config.pList[0].id).clientWidth
              clearInterval(interval1)
              interval1 = ''
            }
          }
        }
      }, 200)
    },
    methods: {
      goPd (skuId) {
        this.$router.push({path: `/pd/${skuId}`})
      },
      handlePrice (price) {
        return tool.handlePrice(price)
      },
      handleName (name) {
        return tool.handleName(name)
      },
      handleImg (img) {
        if (this.pStyle === '2') {
          return img.replace(/!+[0-9]+$/, '!352')
        } else {
          return img.replace(/!+[0-9]+$/, '')
        }
      }
    },
    computed: {
      carouselItemLength(){
        
      },
      listLayout () {
        if (this.pStyle === '0') {
          return 'block-layout'
        } else if (this.pStyle === '1') {
          return 'column-layout'
        } else if (this.pStyle === '2') {
          return 'row-layout'
        }
      },
      pList () {
        if (this.config) {
          if (this.config.pList) {
            return this.config.pList
          } else {
            return []
          }
        } else {
          return []
        }
      },
      pStyle () {
        if (this.config) {
          if (this.config.pStyle) {
            return this.config.pStyle
          } else {
            return this.defaultStyle
          }
        } else {
          return this.defaultStyle
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "~styles/common/common.styl";
    #productBlock
        background #fafafa
        width 100%
        padding-bottom 50px
        h3
            position relative
            color $blue
            font-size 16px
            line-height 70px
            text-align center
            &:after
                content: ''
                position absolute
                width 30px
                height 2px
                background-color $blue
                left  48.7%
                top 88%
        .carousel
            width 1200px
            text-align: center
            float left
            .carousel-content
                ul
                    display: inline-block
                    margin-top 10px
                li
                    float left
                    width 560px
                    margin 0 20px 20px
                    .pic
                        height 240px
                        background-color #fff
                        cursor pointer
                        width 60%
                        float left
                        .pic-img
                              width 70%
                              display inline-block
                              text-align center
                              img
                                  width 100%
                    .product-info
                        width 40%
                        float left
                        text-align left
                        margin-top 60px
                .explain
                    padding-right 60px
                    line-height 16px
                    font-size 14px
                    text-align left
                    $mb(4px)
                    color #000
                    $mt(15px)
                .price
                    color $blue
                    margin-top 20px
                .price_
                    color #ccc

            .goods-items{
                ul{
                    display: inline-block;
                    margin-top: 10px;
                    li{
                        float: left;
                        width: 240px;
                        margin: 20px 10px 0;
                        border:2px solid transparent;
                        .pic{
                            height: 240px;
                            background-color: #fff;
                            cursor: pointer;
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



                    
</style>