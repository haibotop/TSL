<style scoped>
.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
}

.index h1 {
  height: 150px;
}

.index h1 img {
  height: 100%;
}

.index h2 {
  color: #666;
  margin-bottom: 200px;
}

.index h2 p {
  margin: 0 0 50px;
}

.index .ivu-row-flex {
  height: 100%;
}
</style>
<template>
  <div class="index">
    <Row type="flex" justify="center" align="middle">
      <Col span="24">
      <h1>
        <img src="../assets/images/logo.png">
      </h1>
      <h2>
        <p>Welcome to your iView app!</p>
        <Button type="ghost" @click="handleStart">Start iView</Button>
        <Button type="ghost" @click="goSampleRouterPage">Sample Router Page</Button>
        <Button type="ghost" @click="goWeeklyReport">weeklyReport</Button>
        <Button type="ghost" @click="callSampleService">Sample Service</Button>
      </h2>
      </Col>
    </Row>
  </div>
</template>
<script type="text/ecmascript-6">
import { SampleService, myAPI } from '../services/myService.es6'

export default {
  methods: {
    handleStart () {
      this.$Modal.info({
        title: 'Bravo',
        content: 'Now, enjoy the convenience of iView.'
      })
    },
    goSampleRouterPage () {
      this.$router.push({name: 'sample'})
    },
    goWeeklyReport () {
      this.$router.push({name: 'weeklyReport'})
    },
    callSampleService () {
      new SampleService().sayHello()
      this.$http.post(...myAPI('parameter1'))
        .then((response) => {
          this.$defaultServiceTip.success(response)
        })
    }
  }
}
</script>
