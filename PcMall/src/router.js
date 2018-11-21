const login = () => import('./pages/login/login')
const loginSuccess = () => import('./pages/login/loginSuccess')
const register = () => import('./pages/login/register')
const register2 = () => import('./pages/login/register2')
const register3 = () => import('./pages/login/register3')
const agreement = () => import('./pages/login/agreement')
const screatment = () => import('./pages/login/screatment')
const registerSuccess = () => import('./pages/login/registerSuccess')
const fgpsw = () => import('./pages/login/newPW1')
const fgpsw2 = () => import('./pages/login/newPW2')
const fgpsw3 = () => import('./pages/login/newPW3')
const newPwSuccess = () => import('./pages/login/newPwSuccess')
const home = () => import('./pages/homePages/home')
const activity= () => import('./pages/homePages/activity')


//搜索
import search from '@/pages/search/searchPage'
import pl from '@/pages/search/pl'

//商品详情
import pd from '@/pages/pd/pd'

//购物车
import shoppingCart from '@/pages/shoppingCart/shoppingCart'
// import checkout from '@/pages/TSLshoppingCart/Checkout.vue'

//订单
import createOrder from '@/pages/order/createOrder.vue'
import asOrders from '@/pages/order/asOrders.vue'

//我的----------
import mine from '@/pages/me/mine.vue'
import mySet from '@/pages/me/mySet.vue'
import myAccount from '@/pages/me/myAccount.vue'
import myPassword from '@/pages/me/myPassword.vue'
import myInfo from '@/pages/me/myInfo.vue'
import myNickname from '@/pages/me/myNickname.vue'
import myCollection from '@/pages/me/myCollection.vue'
import addressList from '@/pages/me/addressList.vue'
import selfAddress from '@/pages/me/selfAddress.vue'
import editAddress from '@/pages/me/editAddress.vue'
import createAddress from '@/pages/me/CreateAddress.vue'
// 促销、优惠券----------
// import useCoupons from '@/pages/promotion/useCoupons.vue'
// import sendCoupons from '@/pages/promotion/sendCoupons.vue'
import myCoupons from '@/pages/promotion/myCoupons.vue'
// import pdCoupons from '@/pages/promotion/pdCoupons.vue'

var routers = [];

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
    // {
    //   path: '/checkout',
    //   component: checkout
    // }
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
                path: '/pl/:keyword',
                component: pl
            }
        ]
    },
    // {
    //   path: '/couponPl',
    //   name: 'couponPl',
    //   component: couponPl,
    //   children: [
    //     {
    //       path: ':keyword',
    //       component: couponPl
    //     }
    //   ]
    // }
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
    // {
    //   path: '/previewPd',
    //   name: 'previewPd',
    //   component: previewPd,
    //   children: [
    //     {
    //       path: ':skuId',
    //       component: previewPd
    //     }
    //   ]
    // }
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
        path: '/asOrders',
        name: 'asOrders',
        meta: {
            intercept: true
        },
        component: asOrders
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
    },
    {
        path: '/myCollection',
        name: 'myCollection',
        meta: {
          intercept: true
        },
        component: myCollection
    },
]

//活动页
let activityPage = [
    {
        path: '/page/:calssify/:pageName/:pageId',
        name: 'page',
        component: activity
    }
]


var host = [
    {
        path: '/',
        alias: '/home',
        name: 'home',
        component: home,
        meta: {
            title: '首页'
        }
    },
    {
        path: '/home2',
        name: 'home2',
        component: activity,
        meta: {
            intercept: true,
        }
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            title: '登录'
        },
    },
    {
        path: '/signup',
        name: 'signup',
        component: register,
        meta: {
            title: '注册'
        }
    },
    {
        path: '/signup2',
        name: 'singup2',
        component: register2,
        meta: {
            title: '注册'
        },
    },
    {
        path: '/signup3',
        name: 'singup3',
        component: register3,
        meta: {
            title: '注册'
        },
    },
    {
        path: '/registerSuccess',
        name: 'registerSuccess',
        component: registerSuccess,
        meta: {
            title: '注册成功'
        },
    },
    {
        path: '/agreement',
        name: 'agreement',
        component: agreement,
        meta: {
            title: '用户条款'
        },
    },
    {
        path: '/screatment',
        name: 'screatment',
        component: screatment,
        meta: {
            title: '隐私协议'
        },
    },
    {
        path: '/fgpsw',
        name: 'fgpsw',
        component: fgpsw,
        meta: {
            title: '忘记密码'
        },
    },
    {
        path: '/fgpsw2',
        name: 'fgpsw2',
        component: fgpsw2,
        meta: {
            title: '忘记密码'
        },
    },
    {
        path: '/fgpsw3',
        name: 'fgpsw3',
        component: fgpsw3,
        meta: {
            title: '忘记密码'
        },
    },
    {
        path: '/newPwSuccess',
        name: 'newPwSuccess',
        component: newPwSuccess,
        meta: {
            title: '重置密码成功'
        },
    },
    {
        path: '/loginSuccess',
        name: 'loginSuccess',
        component: loginSuccess,
        meta: {
            title: '登录成功'
        },
    },
]
//促销、优惠券
let promotion = [
    // {
    //   path: '/useCoupons',
    //   name: 'useCoupons',
    //   component: useCoupons
    // },
    // {
    //   path: '/sendCoupons',
    //   component: sendCoupons
    // },
    {
      path: '/myCoupons',
      name: 'myCoupons',
      component: myCoupons
    },
    // {
    //   path: '/pdCoupons',
    //   name: 'pdCoupons',
    //   component: pdCoupons
    // }
]
routers = routers.concat(host,searchModel,activityPage,pdModel,order,shopModal,myModal,promotion)
export default routers

