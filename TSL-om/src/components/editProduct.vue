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
        cursor: pointer;
        position: absolute;
        top: -9px;
        right: -9px;
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
    <RadioGroup v-model="pStyle">
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
      <div class="selected-p" v-for="(item, index) in pList" :key="index">
        <Icon type="close-circled" :size="18" class="close"></Icon>
      </div>
      <div class="select-p">
        <Icon type="plus-circled" :size="18" color="#2d8cf0" class="plus"></Icon>
      </div>
    </div>

    <Modal v-model="selecting">

    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'editProduct',
    data () {
      return {
        pStyle: '1',
        pList: [{}],
        selecting: false
      }
    },
    props: {
      config: [String, Array, Object]
    }
  }
</script>

