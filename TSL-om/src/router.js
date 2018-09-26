import login from './pages/login'
import home from './pages/home'
import home_ from './pages/home_'
import test from './components/test'
import subPagesRout from './services/subPagesRout'

var routers = [{
        path: '/',
        name: 'login',
        alias: '/login',
        component: login
    },
    {
        path: '/home',
        redirect: '/home/default',
        component: home,
        children: subPagesRout
    },
    {
        path: '/home_',
        // alias: '/home_/default',
        redirect: '/home_/default',
        component: home_,
        children: subPagesRout
    }
]
export default routers