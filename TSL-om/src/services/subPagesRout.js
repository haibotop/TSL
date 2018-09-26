/**
 * Created by issuser on 2017/10/10 0010.
 */
// cate
import cateManager from '../pages/category/cateManager.vue'
import cateSKUset from '../pages/category/cateSKUset.vue'
import catePublicParamSet from '../pages/category/catePublicParamSet.vue'
import cateshowManager from '../pages/category/cateShowManager/cateshowManagerIndex.vue'
import mainTenance from '../pages/category/mainTenance.vue'
// product
import addProduct from '../pages/product/addProduct/index.vue'
import productManager1 from '../pages/product/manageProduct/productManager1.vue'
import productManager2 from '../pages/product/manageProduct/productManager2.vue'
import stockManager from '../pages/product/manageProduct/stockManager.vue'
// order
import orderManager from '../pages/order/index.vue'
// vip
import buyerList from '../pages/vip/buyerList/index.vue'
// marketing
import createCoupon from '../pages/marketing/createCoupon.vue'
import couponList from '../pages/marketing/couponList.vue'
// 可视化开发
import setHome from '../pages/setPages/setHome.vue'
export default
[
  {
    path: 'default'
  },
  {
    path: 'cateManager',
    component: cateManager,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'cateSKUset',
    component: cateSKUset,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'catePublicParamSet',
    component: catePublicParamSet,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'cateshowManager',
    component: cateshowManager,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'mainTenance',
    component: mainTenance,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'addProduct',
    component: addProduct,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'productManager1',
    component: productManager1,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'productManager2',
    component: productManager2,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'stockManager',
    component: stockManager,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'orderManager',
    component: orderManager,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'buyerList',
    component: buyerList,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'setHome',
    component: setHome,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'createCoupon',
    component: createCoupon,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'couponList',
    component: couponList,
    meta: {
      keepAlive: true
    }
  }
]
