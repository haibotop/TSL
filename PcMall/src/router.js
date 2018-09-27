const login = () => import('./pages/login/login')
const loginSuccess = () => import('./pages/login/loginSuccess')
const register = () => import('./pages/login/register')
const register2 = () => import('./pages/login/register2')
const register3 = () => import('./pages/login/register3')
const fgpsw = () => import('./pages/login/newPW1')
const fgpsw2 = () => import('./pages/login/newPW2')
const fgpsw3 = () => import('./pages/login/newPW3')
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
        path: '/loginSuccess',
        name: 'loginSuccess',
        component: loginSuccess,
        meta: {
            title: '登录成功'
        },
    },
]

routers = routers.concat(host,searchModel)
export default routers
