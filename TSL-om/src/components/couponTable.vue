<template>
  <div id="cpTableCm">
    <div>
      <table style="border-collapse: collapse">
        <tr>
          <td width="150" style="text-align: center;border: 1px solid black;">券码序列号</td>
          <td width="150" style="text-align: center;border: 1px solid black;">状态</td>
          <td width="150" style="text-align: center;border: 1px solid black;">领取时间</td>
          <td width="150" style="text-align: center;border: 1px solid black;">领取人</td>
        </tr>
        <tr v-for="list in dataList">
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.couponCoding}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.statusName}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.updateDate}}</td>
          <td width="150" style="text-align: center;border: 1px solid black;">{{list.memberName}}</td>
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