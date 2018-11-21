import home from '@/pages/homePages/home.vue'
import activity from '@/pages/homePages/activity.vue'
import shoppingCart from '@/pages/shoppingCart/shoppingCart.vue'
import checkout from '@/pages/TSLshoppingCart/Checkout.vue'
import story from '@/pages/homePages/story.vue'
// ----------
import login from '@/pages/TSLlogin/login.vue'
import register from '@/pages/TSLlogin/register.vue'
import register2 from '@/pages/TSLlogin/register2.vue'
import register3 from '@/pages/TSLlogin/register3.vue'
import newPw1 from '@/pages/TSLlogin/newPW1.vue'
import newPw2 from '@/pages/TSLlogin/newPW2.vue'
import newPw3 from '@/pages/TSLlogin/newPW3.vue'
import setPsw from '@/pages/TSLlogin/setPsw.vue'
import registerTsl from '@/pages/TSLlogin/registerTsl.vue'
import agreement from '@/pages/TSLlogin/agreement.vue'
import screatment from '@/pages/TSLlogin/screatment.vue'
import backgoods from '@/pages/TSLlogin/backgoods.vue'
import deliverygoods from '@/pages/TSLlogin/deliverygoods.vue'
// ----------
import search from '@/pages/search/searchPage.vue'
import pl from '@/pages/search/pl.vue'
import couponPl from '@/pages/promotion/couponPl.vue'
// ----------
import pd from '@/pages/pd/pd.vue'
import previewPd from '@/pages/pd/previewPd.vue'
// ----------
import mine from '@/pages/me/mine.vue'
import mySet from '@/pages/me/mySet.vue'
import myAccount from '@/pages/me/myAccount.vue'
import myPassword from '@/pages/me/myPassword.vue'
import myInfo from '@/pages/me/myInfo.vue'
import myNickname from '@/pages/me/myNickname.vue'
import myCollection from '@/pages/me/myCollection.vue'
import myDiscountCard from '@/pages/me/myDiscountCard.vue'
import addressList from '@/pages/me/addressList.vue'
import selfAddress from '@/pages/me/selfAddress.vue'
import editAddress from '@/pages/me/editAddress.vue'
import createAddress from '@/pages/me/CreateAddress.vue'
// ----------
import myOrders from '@/pages/order/myOrders.vue'
import asOrders from '@/pages/order/asOrders.vue'
import myOrderDetail from '@/pages/order/myOrderDetail.vue'
import asOrderDetail from '@/pages/order/asOrderDetail.vue'
import createOrder from '@/pages/order/createOrder.vue'
import orderOk from '@/pages/order/orderOk.vue'
// ----------
import useCoupons from '@/pages/promotion/useCoupons.vue'
import sendCoupons from '@/pages/promotion/sendCoupons.vue'
import myCoupons from '@/pages/promotion/myCoupons.vue'
import pdCoupons from '@/pages/promotion/pdCoupons.vue'
let routerGroup = []
// 根节点
let host = [
  {
    path: '/',
    alias: '/home',
    name: 'home',
    meta: {
      title: 'home'
    },
    component: home
  },
  {
    path: '/story',
    name: 'story',
    meta: {
      title: 'story'
    },
    component: story
  }
]
let activityPage = [
  {
    path: '/page/:calssify/:pageName/:pageId',
    name: 'page',
    component: activity
  }
]
// 购物车模块
let shopModal = [
  {
    path: '/shoppingCart',
    name: 'shoppingCart',
    meta: {
      title: 'shoppingCart'
    },
    component: shoppingCart
  },
  {
    path: '/checkout',
    component: checkout
  }
]
// 我的
let myModal = [
  {
    path: '/mine',
    name: 'mine',
    component: mine
  },
  {
    path: '/mySet',
    name: 'mySet',
    meta: {
      intercept: true
    },
    component: mySet
  },
  {
    path: '/myAccount',
    name: 'myAccount',
    meta: {
      intercept: true
    },
    component: myAccount
  },
  {
    path: '/myPassword',
    name: 'myPassword',
    meta: {
      intercept: true
    },
    component: myPassword
  },
  {
    path: '/myInfo',
    name: 'myInfo',
    meta: {
      intercept: true
    },
    component: myInfo
  },
  {
    path: '/myNickname',
    name: 'myNickname',
    meta: {
      intercept: true
    },
    component: myNickname
  },
  {
    path: '/myCollection',
    name: 'myCollection',
    meta: {
      intercept: true
    },
    component: myCollection
  },
  {
    path: '/myDiscountCard',
    name: 'myDiscountCard',
    meta: {
      intercept: true
    },
    component: myDiscountCard
  },
  {
    path: '/addressList',
    name: 'addressList',
    meta: {
      intercept: true
    },
    component: addressList
  },
  {
    path: '/selfAddress',
    name: 'selfAddress',
    meta: {
      intercept: true
    },
    component: selfAddress
  },
  {
    path: '/editAddress',
    name: 'editAddress',
    meta: {
      intercept: true
    },
    component: editAddress
  },
  {
    path: '/createAddress',
    name: 'createAddress',
    meta: {
      intercept: true
    },
    component: createAddress
  }
]
// 搜索
let searchModel = [
  {
    path: '/search',
    name: 'search',
    component: search,
    children: [
      {
        path: ':keyword',
        component: search
      }
    ]
  },
  {
    path: '/pl',
    name: 'pl',
    component: pl,
    children: [
      {
        path: ':keyword',
        component: pl
      }
    ]
  },
  {
    path: '/couponPl',
    name: 'couponPl',
    component: couponPl,
    children: [
      {
        path: ':keyword',
        component: couponPl
      }
    ]
  }
]
// 商品详情
let pdModel = [
  {
    path: '/pd',
    name: 'pd',
    component: pd,
    children: [
      {
        path: ':skuId',
        component: pd
      }
    ]
  },
  {
    path: '/previewPd',
    name: 'previewPd',
    component: previewPd,
    children: [
      {
        path: ':skuId',
        component: previewPd
      }
    ]
  }
]
// 登录、注册
let signin = [
  {
    path: '/signin',
    component: login
  },
  {
    path: '/signup',
    component: register
  },
  {
    path: '/signup2',
    component: register2
  },
  {
    path: '/signup3',
    component: register3
  },
  {
    path: '/fgpsw',
    component: newPw1
  },
  {
    path: '/fgpsw2',
    component: newPw2
  },
  {
    path: '/fgpsw3',
    component: newPw3
  },
  {
    path: '/setPsw',
    component: setPsw
  },
  {
    path: '/registerTsl',
    component: registerTsl
  },
  {
    path: '/agreement',
    component: agreement
  },
  {
    path: '/backgoods',
    component: backgoods
  },
  {
    path: '/screatment',
    component: screatment
  },
  {
    path: '/deliverygoods',
    component: deliverygoods
  }
]
// 订单
let order = [
  {
    path: '/createOrder',
    name: 'createOrder',
    meta: {
      intercept: true
    },
    component: createOrder
  },
  {
    path: '/myOrders',
    name: 'myOrders',
    redirect: { path: '/myOrders/0' },
    children: [
      {
        path: ':status',
        meta: {
          intercept: true
        }
      }
    ],
    meta: {
      intercept: true
    },
    component: myOrders
  },
  {
    path: '/myOrderDetail',
    name: 'myOrderDetail',
    children: [
      {
        path: ':orderNum',
        name: 'myOrderDetail',
        meta: {
          intercept: true
        }
      }
    ],
    meta: {
      intercept: true
    },
    component: myOrderDetail
  },
  {
    path: '/asOrderDetail',
    name: 'asOrderDetail',
    children: [
      {
        path: ':orderNum',
        name: 'asOrderDetail',
        meta: {
          intercept: true
        }
      }
    ],
    meta: {
      intercept: true
    },
    component: asOrderDetail
  },
  {
    path: '/orderOk',
    name: 'orderOk',
    component: orderOk,
    children: [
      {
        path: ':orderNum',
        meta: {
          intercept: true
        }
      }
    ]
  },
  {
    path: '/asOrders',
    meta: {
      intercept: true
    },
    component: asOrders
  }
]
let promotion = [
  {
    path: '/useCoupons',
    name: 'useCoupons',
    component: useCoupons
  },
  {
    path: '/sendCoupons',
    component: sendCoupons
  },
  {
    path: '/myCoupons',
    name: 'myCoupons',
    component: myCoupons
  },
  {
    path: '/pdCoupons',
    name: 'pdCoupons',
    component: pdCoupons
  }
]
routerGroup = routerGroup.concat(host, activityPage, shopModal, myModal, searchModel, pdModel, signin, order, promotion)
export default routerGroup
