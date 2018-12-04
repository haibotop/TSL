<template>
  <div id="cpTableCm">
    <div>
      <table style="border-collapse: collapse">
        <tr>
          <td width="150" style="text-align: center;border: 1px solid black;">折扣码</td>
          <td width="150" style="text-align: center;border: 1px solid black;">系统员工编号</td>
          <td width="150" style="text-align: center;border: 1px solid black;">状态</td>
          <td width="150" style="text-align: center;border: 1px solid black;">可使用次数</td>
          <td width="150" style="text-align: center;border: 1px solid black;">兑换时间</td>
          <td width="150" style="text-align: center;border: 1px solid black;">兑换人手机号码</td>
          <td width="150" style="text-align: center;border: 1px solid black;">兑换人账号</td>
          <td width="150" style="text-align: center;border: 1px solid black;">使用时间</td>
          <td width="150" style="text-align: center;border: 1px solid black;">订单编号</td>
          <td width="150" style="text-align: center;border: 1px solid black;">订单金额</td>
        </tr>
        <tr v-for="list in dataList">
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.discountCode}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.operator}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.statusName}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.remainTimes}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.bindDate}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.telePhone}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.consumer}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.costTime}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.consumeOrder}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.orderMoney / 100}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'cpTableCm',
    data () {
      return {

      }
    },
    props: {
      dataList: [Array]
    }
  }
</script>