<template>
  <div id="productBlock">
    <div class="blocks">

      <div :class="listLayout">
        <div class="block" v-for="(item, index) in pList" :key="index" @click="goPd(item.defaultSkuId)">
          <div class="img-block"><img :src="item.defaultPicture" :alt="handleName(item.skuName)"></div>
          <div class="info-block">
            <p class="name">{{handleName(item.skuName)}}</p>
            <span class="price" :style="`color: ${color};`">{{ '￥' + handlePrice(item.price) }}</span>
          </div>
        </div>
      </div>

    </div>
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
<style rel="stylesheet/scss" lang="scss" scoped>
.column-layout, .row-layout {
  background-color: #fff;
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
    }
  }
  .img-block:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .info-block {
    height: 60px;
    .name {
      width: 100%;
      // height: 40px;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 14px;
    }
    .price {
      font-size: 14px;
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
  .img-block:before {
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
      // display: -webkit-box;
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
.block-layout {
  position: relative;
  overflow: hidden;
  width: 100%;
  .block {
    position: relative;
    width: 100%;
    margin: 0px 0px 5px 0px;
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
    }
  }
  .img-block:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .info-block {
    width: calc(100% - 20px);
    padding: 5px 10px;
    background-color: #fff;
    height: 50px;
    .name {
      width: 100%;
      height: 40px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 14px;
    }
    .price {
      position: absolute;
      right: 10px;
      bottom: 0;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
