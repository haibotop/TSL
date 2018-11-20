<style scoped>
  #leftNav1,
  #leftNav1 ul {
    height: 100%;
  }
</style>
<template>
  <div id="leftNav1">
    <Menu ref="leftMenu1" theme="light" :active-name="activeNameC" width="100%" :open-names="openNamesC" @on-select="selectChange">
      <Submenu v-for="(item1, index1) in dataArr" :key="index1" :name="`${index1}`">
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
  import cryptoJs from 'crypto-js'
  export default {
    name: 'leftNav1',
    data () {
      return {
        // 默认权限数据
        cateArr: [
          {
            title: '展示类目管理',
            items: [
              {title: '类目管理', currentView: 'cateshowManager'}
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
              {title: '库存管理', currentView: 'stockManager'},
              {title: '金价设置', currentView: 'goldCalculation'}
            ]
          },
          {
            title: '订单管理',
            items: [
              {title: '订单查询与跟踪', currentView: 'orderManager'}
            ]
          },
          {
            title: '会员管理',
            items: [
              {title: '买家列表', currentView: 'buyerList'}
            ]
          },
          {
            title: '账户权限管理',
            items: [
              {title: '修改密码', currentView: 'revisePassword'},
              {title: '角色权限管理', currentView: 'jurisdiction'},
              {title: '用户角色管理', currentView: 'userRole'}
            ]
          },
          {
            title: '页面管理',
            items: [
              {title: '页面设置', currentView: 'pageList'},
              {title: '页面分类', currentView: 'classList'}
            ]
          },
          {
            title: '营销管理',
            items: [
              {title: '创建促销', currentView: 'createPromotion'},
              {title: '促销列表', currentView: 'promotionList'},
              {title: '创建优惠券', currentView: 'createCoupon'},
              {title: '优惠券列表', currentView: 'couponList'},
              {title: '创建折扣码', currentView: 'createDiscount'},
              {title: '折扣码列表', currentView: 'discountList'}
            ]
          }
        ],
        // 动态权限数据
        dataArr: [],
        activeName: '',
        openNames: []
      }
    },
    mounted: function () {
      // 开启动态权限数据
      this.getSessionPower((val) => {
        console.log('val',val)
        if (val.length === 0) {
          this.$Message.warning({content: '该用户任何没有权限'})
        }
        this.powerLevel(val)
      })
      this.$nextTick(function () {
        // updateOpened手动更新展开的子目录 ,updateActiveName手动更新当前选择项 ,注意要在 $nextTick 里调用
        this.$refs.leftMenu1.updateOpened()
        this.$refs.leftMenu1.updateActiveName()
      })
      // select
//      this.selectChange(this.activeName)
    },
    methods: {
      selectChange (val) {
        this.$router.push({path: `/home/${val}`})
        this.activeNameC = val
      },
      getSessionPower (callback) {
        if (sessionStorage.getItem('userInfo')) {
          let pwdUserInfo = sessionStorage.getItem('userInfo')
          let us = cryptoJs.AES.decrypt(pwdUserInfo, 'key', 'conf')
          let qxContent = JSON.parse(us.toString(cryptoJs.enc.Utf8))
          console.log('qxContent',qxContent )
          callback(qxContent.menuVoList)
        }
      },
      powerLevel (val) {
        let arr = []
        for (let a of val) {
          if (a.parentId === '0') {
            arr.push({
              id: a.id,
              title: a.name,
              url: a.url,
              code: a.code
            })
          }
        }
        arr.sort((x, y) => {
          return x.code - y.code
        })
        for (let b of arr) {
          b.items = []
          for (let a of val) {
            if (b.id === a.parentId) {
              b.items.push({
                id: a.id,
                title: a.name,
                url: a.url,
                code: a.code
              })
            }
            b.items.sort((x, y) => {
              return x.code - y.code
            })
          }
          for (let c of b.items) {
            c.currentView = c.url.split('/')[2]
          }
        }
        console.log('arr',arr)
        this.dataArr = arr
      }
    },
    computed: {
      openNamesC () {
        let arr = []
        if (this.dataArr) {
          for (let i in this.dataArr) {
            for (let j in this.dataArr[i].items) {
              if (this.activeName === this.dataArr[i].items[j].currentView) {
                arr.push(i)
              }
            }
          }
          this.openNames = arr
        }
        return this.openNames
      },
      activeNameC: {
        get: function () {
          if (this.$route) {
            let path = this.$route.fullPath.split('/')
            this.activeName = path.length === 0 ? path[0] : path[path.length - 1]
          }
          return this.activeName
        },
        set: function (newValue) {
          this.activeName = newValue
        }
      }
    }
  }
</script>
