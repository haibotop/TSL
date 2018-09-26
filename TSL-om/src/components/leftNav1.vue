<style scoped>
#leftNav1,
#leftNav1 ul {
  height: 100%;
}
</style>
<template>
  <div id="leftNav1">
    <Menu theme="light" :active-name="activeName" width="100%" :open-names="openNamesC" @on-select="selectChange">
      <Submenu v-for="(item1, index1) in cateArr" :key="index1" :name="`${index1}`">
        <template slot="title">
          <Icon type="ios-navigate"></Icon>
          {{item1.title}}
        </template>
        <MenuItem v-for="(item2, index2) in item1.items" :key="index2" :name="item2.currentView">{{item2.title}}
        </MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'leftNav1',
    props: ['activeName', 'openNames'],
    data () {
      return {
        cateArr: [
          {
            title: '展示类目管理',
            items: [
              {title: '类目管理', currentView: 'cateshowManager'},
              {title: '消保管理', currentView: 'mainTenance'}
            ]
          },
          {
            title: '运营类目管理',
            items: [
              {title: '类目管理', currentView: 'cateManager'},
              {title: '类目通用参数设置', currentView: 'catePublicParamSet'},
              {title: '类目SKU属性设置', currentView: 'cateSKUset'}
            ]
          },
          {
            title: '商品管理',
            items: [
              {title: '发布新商品', currentView: 'addProduct'},
              {title: '在售商品管理', currentView: 'productManager1'},
              {title: '待售商品管理', currentView: 'productManager2'},
              {title: '库存管理', currentView: 'stockManager'}
            ]
          },
          {
            title: '订单管理',
            items: [
              {title: '订单管理', currentView: 'orderManager'}
            ]
          },
          {
            title: '会员管理',
            items: [
              {title: '买家列表', currentView: 'buyerList'}
            ]
          },
          {
            title: '页面管理',
            items: [
              {title: '添加页面', currentView: 'setHome'}
            ]
          },
          {
            title: '营销管理',
            items: [
              {title: '创建优惠券', currentView: 'createCoupon'},
              {title: '优惠券列表', currentView: 'couponList'}
            ]
          }
        ]
      }
    },
    methods: {
      selectChange (val) {
        for (let i in this.cateArr) {
          for (let j in this.cateArr[i].items) {
            if (val === this.cateArr[i].items[j].currentView) {
              this.$emit('clickItem', this.cateArr[i].items[j])
            }
          }
        }
      }
    },
    mounted: function () {
      this.selectChange(this.activeName)
    },
    computed: {
      openNamesC () {
        let arr = this.openNames
        for (let i in this.cateArr) {
          for (let j in this.cateArr[i].items) {
            if (this.activeName === this.cateArr[i].items[j].currentView) {
              if (arr.indexOf(`${i}`) === -1) {
                arr.push(`${i}`)
              }
            }
          }
        }
        return arr
      }
    },
    watch: {
      // activeName (val) {
      //   for (let i in this.cateArr) {
      //     for (let j in this.cateArr[i].items) {
      //       if (val === this.cateArr[i].items[j].currentView) {
      //         this.$emit('clickItem', this.cateArr[i].items[j])
      //       }
      //     }
      //   }
      // }
    }
  }
</script>
