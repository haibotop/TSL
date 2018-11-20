<style lang="scss" rel="stylesheet/scss">

</style>
<template>
  <div id="pTable">
    <Table :border="pTableBorder" height="500" :columns="pTableCoulmns" :data="pTableData" @on-selection-change="selectTion" @on-select="handleSelectOne" @on-select-cancel="cancelSelectOne" @on-select-all="handleSelectAll"></Table>
    <div class="page-class">
      <Page :current="pageParams.pageNum" :total="pageParams.pageTotal" :page-size="pageParams.pageSize"
            @on-change="pageChange" show-total></Page>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import cityData from '../libs/cityData.js'
  export default {
    name: 'pTable',
    data () {
      return {
        provinceList: cityData,
        // 搜索条件
        search_c: {
          buyEndDate: '',
          buyStartDate: '',
          city: '',
          creatEndDate: '',
          creatStartDate: '',
          id: '',
          loginEndDate: '',
          loginStartDate: '',
          mobile: '',
          nickName: '',
          province: ''
        }
      }
    },
    props: {
      pTableBorder: {
        type: Boolean,
        default: false
      },
      pTableCoulmns: [Array],
      pTableData: [Array],
      pageParams: [Object],
      // 缓存数组
      tempPro: [Array],
      // 父组件刷新列表fun
      refleshPage: [Function]
    },
    methods: {
      pageChange (num) {
        console.log(num)
        console.log(this.pageParams)
        this.pageParams.pageNum = num
        // 父组件刷新列表
        this.refleshPage()
      },
      // Table单选操作
      handleSelectOne (sel, row) {
        let canPush = true
        for (let t of this.tempPro) {
          if (row.id === t) {
            canPush = false
            break
          }
        }
        if (canPush) {
          this.tempPro.push(row.id)
        }
      },
      // Table取消单选操作
      cancelSelectOne (sel, row) {
        for (let t in this.tempPro) {
          if (row.id === this.tempPro[t]) {
            this.tempPro.splice(t, 1)
          }
        }
      },
      // Table选中所有
      handleSelectAll (sel) {
        console.log('sel', sel)
        for (let s of sel) {
          let canPush = true
          for (let t of this.tempPro) {
            if (s.id === t) {
              canPush = false
              break
            }
          }
          if (canPush) {
            if (parseInt(s.status) !== 1) {
              this.tempPro.push(s.id)
            }
          }
        }
        console.log('tempPro', this.tempPro)
      },
      // Tabel 取消选中操作(this.relateBoolean = true)
      selectTion (sel) {
        if (sel.length === 0) {
          for (let p in this.pTableData) {
            for (let t in this.tempPro) {
              if (this.pTableData[p].id === this.tempPro[t]) {
                this.tempPro.splice(t, 1)
              }
            }
          }
        }
      }
    }
  }
</script>