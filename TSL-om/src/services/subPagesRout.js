/**
 * Created by issuser on 2017/10/10 0010.
 */
// cate
import cateManager from '../pages/category/cateManager.vue'
import cateSKUset from '../pages/category/cateSKUset.vue'
import catePublicParamSet from '../pages/category/catePublicParamSet.vue'
import cateshowManager from '../pages/category/cateshowManager.vue'
import mainTenance from '../pages/category/mainTenance.vue'
// product
import addProduct from '../pages/product/addProduct/index.vue'
import productManager1 from '../pages/product/manageProduct/productManager1.vue'
import productManager2 from '../pages/product/manageProduct/productManager2.vue'
import draftBox from '../pages/product/manageProduct/draftBox.vue'
import stockManager from '../pages/product/manageProduct/stockManager.vue'
import goldCalculation from '../pages/product/manageProduct/goldCalculation.vue'
// order
import orderManager from '../pages/order/orderManager.vue'
import orderDetail from '../pages/order/orderDetail.vue'
import orderStore from '../pages/order/outStore.vue'
import afterSales from '../pages/order/afterSales.vue'
import returnOrderManager from '../pages/order/returnOrderManager.vue'
// vip
import buyerList from '../pages/vip/buyerList/index.vue'
import vipInfo from '../pages/vip/buyerList/vipInfo.vue'
// marketing
import createPromotion from '../pages/marketing/createPromotion.vue'
import promotionList from '../pages/marketing/promotionList.vue'
import createCoupon from '../pages/marketing/createCoupon.vue'
import couponList from '../pages/marketing/couponList.vue'

import createDiscountcode from '../pages/marketing/createDiscountcode.vue'
import discountcodeList from '../pages/marketing/discountcodeList.vue'

import fullReductionPromotion from '../pages/marketing/fullReductionPromotion.vue'
import discountPromotion from '../pages/marketing/discountPromotion.vue'
import directDropPromotion from '../pages/marketing/directDropPromotion.vue'

// 可视化开发
import pageList from '../pages/pageSet/pageList.vue' // 展示
import pageTemplate from '../pages/pageSet/pageTemplate.vue'
import setPage from '../pages/pageSet/setPage.vue'
import classList from '../pages/pageSet/classList.vue' // 展示
// user
import noPowerPage from '../pages/roleJurisdiction/noPowerPage.vue'
import jurisdiction from '../pages/roleJurisdiction/jurisdiction.vue'
import userRole from '../pages/roleJurisdiction/userRole.vue'
import revisePassword from '../pages/roleJurisdiction/revisePassword.vue'
// dataCenter
import vipGrowth from '../pages/dataCenter/vipGrowth.vue'
import vipArea from '../pages/dataCenter/vipArea.vue'
import saleStatistics from '../pages/datacenter/saleStatistics.vue'
import productSale from '../pages/dataCenter/productSale.vue'
import consumerRank from '../pages/dataCenter/consumerRank.vue'

export default
[
  {
    path: 'default',
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'cateManager',
    component: cateManager,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'cateSKUset',
    component: cateSKUset,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'catePublicParamSet',
    component: catePublicParamSet,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'cateshowManager',
    component: cateshowManager,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'mainTenance',
    component: mainTenance,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'addProduct',
    component: addProduct,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'productManager1',
    component: productManager1,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'productManager2',
    component: productManager2,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'draftBox',
    component: draftBox,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'stockManager',
    component: stockManager,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'goldCalculation',
    component: goldCalculation,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'orderManager',
    component: orderManager,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'orderStore',
    name: 'orderStore',
    component: orderStore,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'orderDetail',
    component: orderDetail,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'returnOrderManager',
    component: returnOrderManager,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'afterSales',
    component: afterSales,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'buyerList',
    component: buyerList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'vipInfo',
    component: vipInfo,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'createPromotion',
    component: createPromotion,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'fullReductionPromotion',
    component: fullReductionPromotion,
    props: true,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: ':id',
        component: fullReductionPromotion,
        meta: {
          requireAuth: true
        }
      }
    ]
  },
  {
    path: 'discountPromotion',
    component: discountPromotion,
    props: true,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: ':id',
        component: discountPromotion,
        meta: {
          requireAuth: true
        }
      }
    ]
  },
  {
    path: 'directDropPromotion',
    component: directDropPromotion,
    props: true,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: ':id',
        component: directDropPromotion,
        meta: {
          requireAuth: true
        }
      }
    ]
  },
  {
    path: 'promotionList',
    component: promotionList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'createCoupon',
    component: createCoupon,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'couponList',
    component: couponList,
    meta: {
      requireAuth: true
    }
  },
  //discount
  {
    name: 'createDiscountcode',
    path: 'createDiscountcode',
    component: createDiscountcode,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'discountcodeList',
    component: discountcodeList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'pageList',
    component: pageList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'pageTemplate',
    component: pageTemplate,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'setPage',
    component: setPage,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'classList',
    component: classList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'noPowerPage',
    component: noPowerPage,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'jurisdiction',
    component: jurisdiction,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'userRole',
    component: userRole,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'revisePassword',
    component: revisePassword,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'vipGrowth',
    component: vipGrowth,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'vipArea',
    component: vipArea,
    meta: {
      requireAuth: true
    }
  },
  {
    path: 'saleStatistics',
    component: saleStatistics
  },
  {
    path: 'consumerRank',
    component: consumerRank
  },
  {
    path: 'productSale',
    component: productSale
  }
]
