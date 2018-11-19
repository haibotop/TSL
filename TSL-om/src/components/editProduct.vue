<style rel="stylesheet/scss" lang="scss" scoped>
  #editProduct {
    width: 500px;
  }
  .my-radio {
    display: inline-block;
    position: relative;
    margin: 80px 0px;
    .label {
      width: 185px;
    }
    .img {
      position: absolute;
      left: 75px;
      top: -80px;
      width: 110px;
      height: 160px;
      background-color: #bbbeec;
      img {
        width: 100%;
        display: block;
      }
    }
  }
  .select-p-box {
    height: 50px;
    margin: 10px 0px 0px 10px;
    .label {
      float: left;
      line-height: 50px;
    }
    .selected-p {
      margin: 0px 0px 0px 10px;
      float: left;
      width: 50px;
      height: 50px;
      border: 1px solid #d3d3d3;
      position: relative;
      .close {
        position: absolute;
        padding: 0px;
        width: 20px;
        height: 20px;
        top: -10px;
        right: -8px;
        font-size: 18px;
      }
      img {
        display: block;
        width: 100%;
      }
    }
    .select-p {
      cursor: pointer;
      margin: 0px 0px 0px 10px;
      float: left;
      width: 50px;
      height: 50px;
      border: 1px solid #d3d3d3;
      background-color: #e6e6e6;
      border-radius: 4px;
      position: relative;
      .plus {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -9px 0px 0px -9px;
      }
    }
    .select-p:hover {
      border: 1px solid #999999;
      background-color: #dadada;
    }
  }
</style>
<template>
  <div id="editProduct">
    <RadioGroup v-model="pStyleC">
      <Radio label="0">
        <div class="my-radio">
          <div class="label">
            样式一
          </div>
          <div class="img">
            <img src="../assets/images/style_01.jpg" alt="">
          </div>
        </div>
      </Radio>
     <Radio label="1">
        <div class="my-radio">
          <div class="label">
            样式二
          </div>
          <div class="img">
            <img src="../assets/images/style_02.jpg" alt="">
          </div>
        </div>
      </Radio>
      <Radio label="2">
        <div class="my-radio">
          <div class="label">
            样式三
          </div>
          <div class="img">
            <img src="../assets/images/style_03.jpg" alt="">
          </div>
        </div>
      </Radio>
    </RadioGroup>

    <div class="select-p-box">
      <div class="label">选择商品：</div>
      <div class="selected-p" v-for="(item, index) in pListC" :key="index">
        <Button type="text" icon="close-circled" class="close" @click="deleteP(index)"></Button>
        <img :src="item.defaultPicture" alt="">
      </div>
      <div class="select-p" @click="openSelectModal">
        <Icon type="plus-circled" :size="18" color="#2d8cf0" class="plus"></Icon>
      </div>
    </div>
    <selectProduct v-model="selecting" :pNum="pList.length" @on-select="addP"></selectProduct>
  </div>
</template>
<script type="text/ecmascript-6">
  import selectProduct from './selectProduct.vue'
  export default {
    name: 'editProduct',
    components: {
      selectProduct
    },
    data () {
      return {
        pStyle: '1',
        pList: [],
        selecting: false
      }
    },
    props: {
      config: [String, Object]
    },
    methods: {
      // 打开选择商品的弹窗
      openSelectModal () {
        if (this.pList.length >= 4) {
          this.$Message.warning('最多选择4个商品')
          return
        }
        this.selecting = true
      },
      addP (pList) {
        this.pListC = this.pList.concat(pList)
        console.log(pList)
      },
      // 从pList删除商品
      deleteP (index) {
        console.log(index)
        this.pListC.splice(index, 1)
      }
    },
    computed: {
      pStyleC: {
        get () {
          if (this.config) {
            this.pStyle = this.config.pStyle
            return this.pStyle
          } else {
            return 1
          }
        },
        set (pStyle) {
          if (pStyle !== this.pStyle) {
            this.$emit('config', {
              pStyle: pStyle,
              pList: this.pList
            })
          }
        }
      },
      pListC: {
        get () {
          if (this.config) {
            this.pList = this.config.pList
            return this.pList
          } else {
            return []
          }
        },
        set (pList) {
          if (JSON.stringify(this.pList) !== JSON.stringify(pList)) {
            this.$emit('config', {
              pStyle: this.pStyle,
              pList: pList
            })
          }
        }
      }
    }
  }
</script>

