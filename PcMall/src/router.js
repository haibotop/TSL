const login = () => import('./pages/login/login')
const register = () => import('./pages/login/register')
const home = () => import('./pages/homePages/home')
const activity= () => import('./pages/homePages/activity')


//搜索
import search from '@/pages/search/searchPage'
import pl from '@/pages/search/pl'



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
    path: '/singup',
    name: 'singup',
    component: register,
    meta: {
        title: '注册'
    },
  }
]

routers = routers.concat(host,searchModel)
export default routers
