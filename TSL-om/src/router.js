import login from './pages/login'
import home from './pages/home'
import testpage from './pages/test'
import subPagesRout from './services/subPagesRout'
import pdSwiper from './components/pdSwiper.vue'
import swiperBlock from './components/swiperBlock.vue'
import uploadImg1 from './components/uploadImg1.vue'

var routers = [
  {
    path: '/pdSwiper',
    component: pdSwiper
  },
  {
    path: '/swiperBlock',
    component: swiperBlock
  },
  {
    path: '/uploadImg1',
    component: uploadImg1
  },
  {
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
    path: '/test',
    component: testpage
  }
]
export default routers
