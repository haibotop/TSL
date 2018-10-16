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

//订单
import createOrder from '@/pages/order/createOrder.vue'

var routers = [];

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
    }
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

routers = routers.concat(host,searchModel,activityPage,pdModel,order)
export default routers

