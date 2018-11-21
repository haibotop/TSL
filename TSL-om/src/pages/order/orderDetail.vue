<style lang="scss" rel="stylesheet/scss" scoped>
  #orderDetail {
    min-width: 840px;
  }
  .margin-10 {
    margin: 10px;
  }

  .my-border {
    border: 1px solid #dddee1;
    padding: 6px 0;
  }

  .my-border-bottom {
    border-bottom: 1px solid #dddee1;
  }

  .my-text {
    text-indent: 10px;
    padding:10px 0;
    font-weight:bold;
  }

  .col-label {
    text-align: right;
  }

  .amount {
    color: red;
    font-size: 16px;
  }

  .my-btn {
    display: block;
    margin: 0 auto;
  }
  .order-remark{
    vertical-align:middle;
  }
  .remark-show{
    vertical-align:middle;
    word-wrap:break-word;
    display: inline-block;
  }
  .margin-28{
    margin:28px 10px;
  }
  .padding-10{
    padding:10px 0;
  }
</style>
<template>
  <div id="orderDetail">
    <div class="margin-10 my-border my-text my-order">订单号：{{orderDetails.number}}</div>

    <Steps :current="current" class="margin-28">
      <Step title="已下单"></Step>
      <Step title="已付款" v-if="statusShow"></Step>
      <Step title="已发货" v-if="statusShow"></Step>
      <Step title="已完成" v-if="statusShow"></Step>
      <Step title="已取消" v-if="statusIsShow"></Step>
    </Steps>

    <div class="margin-10">订单跟踪</div>
    <Table :columns="column1" :data="data1" class="margin-10"></Table>

    <div class="my-border margin-10">
      <div class="my-border-bottom my-text">订单信息</div>
      <div class="my-text padding-10">收货人信息</div>
      <Row>
        <Col span="4" class="col-label">收货人：</Col>
        <Col span="20">{{detailInfo.orderAddressItem.receiverName}}</Col>
        <Col span="4" class="col-label">手机号码：</Col>
        <Col span="20">{{detailInfo.orderAddressItem.receiverMobile}}</Col>
        <Col span="4" class="col-label">地址信息：</Col>
        <Col span="20">{{detailInfo.orderAddressItem.receiverAddress}}</Col>
        <Col span="4" class="col-label">支付方式：</Col>
        <Col span="20">{{detailInfo.payType}}</Col>
      </Row>

      <div class="my-text">商品清单</div>
      <Table :columns="column2" :data="pdInfoData" class="margin-10"></Table>

      <div class="my-text">
        <div>
          <span class="order-remark">商家备注：</span>
          <span class="remark-show">{{detailInfo.merchantRemark}}</span>
          <Button size="small" @click="mark=true">修改备注</Button>
          <!--<Button size="small" @click="commitMark">修改备注</Button>-->
        </div>
        <div>
          <span class="order-remark">买家备注：</span>
          <span class="remark-show">{{detailInfo.memberRemark}}</span>
        </div>
      </div>

      <div class="order-amount">
        <Row>
          <Col span="4" offset="16" class="col-label">
          商品总金额：</Col>
          <Col span="4">
          {{detailInfo.floatAmount}}</Col>
        </Row>
        <Row>
          <Col span="4" offset="16" class="col-label">
          订单支付金额：</Col>
          <Col span="4" class="amount">
          {{detailInfo.floatAmount}}</Col>
        </Row>
      </div>
    </div>
    <div style="text-align: center">
      <Button @click="goBack" style="width: 100px">返回</Button>
    </div>

    <Modal v-model="mark" title="修改订单备注">
      <div>
        <Input :maxlength="200" v-model="markInfo"/>
      </div>
      <div slot="footer">
        <Button @click="saveMark" type="primary">确定</Button>
        <Button @click="mark=false">取消</Button>
      </div>
    </Modal>

    <Modal v-model="confirmMark" width="300">
      <div>
        请确认此处新备注是否替换原有备注
      </div>
      <div slot="footer">
        <Button @click="commitMark">确定</Button>
        <Button @click="confirmMark=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as omAPI from '../../services/orderList.es6'
  import * as extendTool from '../../services/tool.es6'
  export default {
    name: 'orderDetail',
    data () {
      return {
        current: 1,
        orderNumber: null,
        loading: false,
        statusShow: true,
        statusIsShow: false,
        // orderDetailsStatus: null,
        orderDetails: {},
        // 订单跟踪
        column1: [
          {title: '处理时间', key: 'date'},
          {title: '处理信息', key: 'msg'},
          {title: '操作人', key: 'operator'}
        ],
        data1: [],
        // 订单信息
        detailInfo: {
          orderAddressItem: {
            receiverName: '',
            receiverMobile: '',
            receiverAddress: ''
          }
        },
        // 商品清单
        column2: [
          {title: '商品编号', key: 'id'},
          {title: '设计编号', key: 'designBarCode'},
          {
            title: '商品名称',
            key: 'name',
            render: (h, params) => {
              return h('div', {}, extendTool.handleName(params.row.name))
            }
          },
          {title: '商品价格', key: 'floatPrice'},
          {title: '商品数量', key: 'quantity'},
          {title: '退货总数', key: 'refundQuantity'}
        ],
        pdInfoData: [],
        // 备注
        mark: false,
        confirmMark: false,
        markInfo: ''
      }
    },
    methods: {
//  ----------接口调用-------------
      getOrderList (params, callback) {
        this.$http.get(omAPI.getOrder(params))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
      postRemark (remark, orderNos, callback) {
        this.$http.post(...omAPI.postRemark(remark, orderNos))
          .then((response) => {
            if (response.data.code === 200) {
              if (typeof callback === 'function') {
                callback(response)
              }
            }
          })
      },
//  ----------数据处理--------------
      formatDate (value) {
        let date = new Date(value * 1)
        let Y = date.getFullYear()
        let m = date.getMonth() + 1
        let d = date.getDate()
        let H = date.getHours()
        let i = date.getMinutes()
        let s = date.getSeconds()
        if (m < 10) { m = '0' + m }
        if (d < 10) { d = '0' + d }
        if (H < 10) { H = '0' + H }
        if (i < 10) { i = '0' + i }
        if (s < 10) { s = '0' + s }
        // 获取时间格式 2017-01-03 10:13:48
        let t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s
        return t
      },
      trackOrder (response) {
        this.orderDetails = response.data.orderItem
        this.orderDetails.payType = this.StatusChange(this.orderDetails.payType)
        this.status = this.orderDetails.status
        // this.orderDetailsStatus = this.orderStatus(this.status)
        let arr = []
        // 循环
        for (let o of response.data.orderItem.orderTrackItems) {
          let obj = {
            date: this.formatDate(o.createDate),
            msg: this.orderStatus(o.status),
            operator: o.operator
          }
          arr.push(obj)
        }
        this.data1 = arr
      },
      consigneeInfo (response) {
        this.resetYuan(response)
        this.detailInfo = response.data.orderItem
        this.markInfo = this.detailInfo.merchantRemark
        // 由于current的步骤是从0开始的，所以-1
        this.current = this.detailInfo.status - 1
        this.pdInfoData = this.detailInfo.orderProductItems
        // 是否取消
        if (this.detailInfo.status === 5) {
          this.statusShow = false
          this.statusIsShow = true
        }
      },
      // 数据处理分转元
      resetYuan (response) {
        let orderItem = response.data.orderItem
        orderItem.floatAmount = this.fen2yuan(orderItem.amount)
        for (let a of orderItem.orderProductItems) {
          a.floatOriginalPrice = this.fen2yuan(a.originalPrice)
          a.floatPrice = this.fen2yuan(a.price)
          a.floatSum = this.fen2yuan(a.sum)
        }
      },
      // 分转元
      fen2yuan (data) {
        let floatdata = data / 100
        floatdata = floatdata % 1 ? parseFloat(floatdata) : parseFloat(floatdata) + '.00'
        return floatdata
      },
      // 定义订单的属性
      orderStatus (name) {
        let temp = ''
        switch (name) {
          case 1 : {
            temp = '待支付'
            break
          }
          case 2: {
            temp = '已支付'
            break
          }
          case 3: {
            temp = '已发货'
            break
          }
          case 4: {
            temp = '已收货'
            break
          }
          case 5: {
            temp = '已撤单'
            break
          }
          case 6: {
            temp = '待退款'
            break
          }
          case 7: {
            temp = '退款失败'
            break
          }
          case 8: {
            temp = '已退款'
            break
          }
          case 9: {
            temp = '已完结'
            break
          }
        }
        return temp
      },
      goBack () {
        this.$router.replace({path: 'orderManager'})
      },
      saveMark () {
        console.log(this.markInfo)
        if (this.markInfo.length > 0) {
          const reg = /[~#^$@%&!?%*]/gi
          if (reg.test(this.markInfo) === true) {
            this.$Message.warning('备注不能含有特殊字符！')
          } else {
            // this.confirmMark = true
            this.commitMark()
          }
        } else {
          this.$Message.warning('备注为空')
        }
      },
      commitMark () {
        console.log(this.markInfo)
        let orderNos = []
        orderNos.push(this.orderNumber)
        console.log(orderNos)
        let params = encodeURIComponent(this.markInfo)
        console.log(params)
        this.postRemark(params, orderNos, () => {
          this.getOrderList(this.orderNumber, (response) => {
            this.trackOrder(response)
            this.consigneeInfo(response)
            this.$Message.success({content: '操作成功'})
            this.confirmMark = false
            this.mark = false
          })
        })
      },
      /*
       后台数据订单状态：
       1 待支付；2 已支付；3 已发货；4 已收货；5 已撤单；
       6 待退款；7 退款失败；8  已退款；9 已完结
       */
      StatusChange (data) {
        switch (data) {
          case 1: {
            data = 'wxH5'
            break
          }
          case 2: {
            data = '微信APP'
            break
          }
          case 3: {
            data = '支付宝H5'
            break
          }
          case 4: {
            data = '银联wap'
            break
          }
          case 5: {
            data = '微信公众号'
            break
          }
          case 10: {
            data = '银联商务(银联在线)'
            break
          }
          case 11: {
            data = '银联商务（微信公众号支付）'
            break
          }
          case 12: {
            data = 'H5微信支付'
            break
          }
          case 13: {
            data = 'H5支付宝支付'
            break
          }
          default: {
            break
          }
        }
        return data
      }
    },
    mounted () {
      this.orderNumber = this.$route.query.orderNo
      this.getOrderList(this.orderNumber, (response) => {
        this.trackOrder(response)
        this.consigneeInfo(response)
      })
    }
  }
</script>
