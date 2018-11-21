<template>
  <div id="createPromotion">
    <Breadcrumb class="my-breadcrumb">
      <BreadcrumbItem>营销管理</BreadcrumbItem>
      <BreadcrumbItem>创建促销</BreadcrumbItem>
    </Breadcrumb>
    <card class="card">
      <img class="fullReduction-img" src="../../assets/images/fullReduction.svg" alt="">
      <div class="title">满减促销</div>
      <div type="primary" small class="add-btn" @click="fullReductionPromotion">立即添加</div>
      <p>可为商品设置满额减、满额折促销</p>
    </card>
    <card class="card">
      <img class="dicount-img" src="../../assets/images/discount.svg" alt="">
      <div class="title">单品折扣</div>
      <div type="primary" small class="add-btn" @click="discountPromotion">立即添加</div>
      <p>可为多个不同商品分别设置不同的折扣促销</p>
    </card>
    <card class="card">
      <img class="directDrop-img" src="../../assets/images/directDrop.svg" alt="">
      <div class="title">直降促销</div>
      <div type="primary" small class="add-btn" @click="directDropPromotion">立即添加</div>
      <p>可为商品设置直降促销</p>
    </card>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'createPromotion',
    methods: {
      fullReductionPromotion () {
        this.$router.push({path: '/home/fullReductionPromotion'})
      },
      discountPromotion () {
        this.$router.push({path: '/home/discountPromotion'})
      },
      directDropPromotion () {
        this.$router.push({path: '/home/directDropPromotion'})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.my-breadcrumb {
  margin: 0px 10px;
}
.card {
  width: 325px;
  height: 130px;
  margin: 10px;
  float: left;
  position: relative;
  border: 1px solid #BEC0C6;
  img {
    position: absolute;
    top: 40px;
    left: 20px;
  }
  .title {
    color: #495060;
    font-size: 18px;
    margin: 0 0 0 80px;
  }
  p {
    color: #9296A0;
    font-size: 14px;
    margin: 6px 0 0 80px;
  }
  .add-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: #2D8CF0;
    color: #fff;
    padding: 0px 10px;
    width: 100px;
    height: 30px;
    line-height: 30px;
    border-radius: 30px;
    text-align: right;
    cursor: pointer;
  }
  .add-btn:before {
    content: "+";
    width: 20px;
    height: 20px;
    line-height: 15px;
    text-align: center;
    display: block;
    position: absolute;
    color: #2d8cf0;
    background-color: #fff;
    border-radius: 50%;
    top: 5px;
    left: 5px;
    font-size: 28px;
  }
}
</style>

