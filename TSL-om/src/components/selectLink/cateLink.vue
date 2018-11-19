<style lang="scss" rel="stylesheet/scss" scoped>
</style>
<template>
  <div id="cateLink">
    <Modal v-model="flag" title="类目" width="1000">
      <Select v-model="cate1" style="width: 300px;" @on-change="getCate2">
        <Option v-for="(item, index) in cateData" :key="index" :value="JSON.stringify(item)">{{item.name}}</Option>
      </Select>
      <Select v-model="cate2" style="width: 300px;" @on-change="getCate3">
        <Option v-for="(item, index) in cateData2" :key="index" :value="JSON.stringify(item)">{{item.name}}</Option>
      </Select>
      <Select v-model="cate3" style="width: 300px;">
        <Option v-for="(item, index) in cateData3" :key="index" :value="JSON.stringify(item)">{{item.name}}</Option>
      </Select>
      <div slot="footer">
        <Button @click="onCancel">取消</Button>
        <Button type="primary" @click="onOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as showCate from '../../services/displayManager.es6'
  export default {
    name: 'cateLink',
    data () {
      return {
        totalSize: 0,
        cateData: [],
        cateData2: [],
        cateData3: [],
        cate1: '',
        cate2: '',
        cate3: ''
      }
    },
    props: {
      value: [Boolean]
    },
    methods: {
      getCate () {
        this.$http.get(showCate.getShowList()).then(response => {
          if (response.data.code === 200) {
            this.cateData = response.data.category
          }
        })
      },
      getCate2 (val) {
        this.cateData2 = []
        this.cate2 = ''
        this.cate3 = ''
        this.cateData2 = JSON.parse(val).secondCategory
      },
      getCate3 (val) {
        this.cateData3 = []
        this.cate3 = ''
        this.cateData3 = JSON.parse(val).threeCategory
      },
      onCancel () {
        this.flag = false
      },
      onOk () {
        if (this.cate3) {
          let cate = JSON.parse(this.cate3)
          this.$emit('selected', {
            link: `/pl?catalogId=${cate.id}`,
            linkName: `${JSON.parse(this.cate1).name} >> ${JSON.parse(this.cate2).name} >> ${cate.name}`
          })
        } else if (this.cate2) {
          let cate = JSON.parse(this.cate2)
          this.$emit('selected', {
            link: `/pl?catalogId=${cate.id}`,
            linkName: `${JSON.parse(this.cate1).name} >> ${cate.name}`
          })
        } else if (this.cate1) {
          let cate = JSON.parse(this.cate1)
          this.$emit('selected', {
            link: `/pl?catalogId=${cate.id}`,
            linkName: cate.name
          })
        }
        this.flag = false
      }
    },
    computed: {
      flag: {
        get () {
          if (this.value) {
            return this.value
          } else {
            return false
          }
        },
        set (flag) {
          this.$emit('input', flag)
        }
      }
    },
    watch: {
      value (flag) {
        if (flag) {
          this.getCate()
        } else {
          this.cateData = []
          this.cateData2 = []
          this.cateData3 = []
          this.cate1 = ''
          this.cate2 = ''
          this.cate3 = ''
        }
      }
    }
  }
</script>