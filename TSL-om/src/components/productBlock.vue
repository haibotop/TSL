<style rel="stylesheet/scss" lang="scss" scoped>
#productBlock {
  min-height:30px;
}
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
    .name {
      width: 100%;
      height: 40px;
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
  width: calc(100% - 10px);
  padding: 0px 10px 0px 0px;
  .block {
    position: relative;
    overflow: hidden;
    width: 100%;
    margin: 0px 0px 10px 0px;
  }
  .img-block {
    width: 35%;
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
    }
  }
  .img-block:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .info-block {
    width: calc(65% - 10px);
    margin: 0px 0px 0px 10px;
    position: absolute;
    top: 0;
    bottom: 0px;
    right: 0;
    float: left;
    .name {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .price {
      position: absolute;
      bottom: 0;
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
    width: calc(100% - 10px);
    margin: 0px 0px 0px 5px;
    .name {
      width: 100%;
      height: 40px;
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
</style>
<template>
  <div id="productBlock">
    <div class="blocks">

      <div :class="listLayout">
        <div class="block" v-for="(item, index) in pList" :key="index">
          <div class="img-block"><img :src="item.defaultPicture" alt=""></div>
          <div class="info-block">
            <p class="name">{{handleName(item.skuName)}}</p>
            <span class="price" :style="`color: ${color};`">{{ '￥' + parseFloat(item.price / 100) }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  let interval1
  import * as tool from '../services/tool.es6'
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
      handleName (name) {
        return tool.handleName(name)
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
