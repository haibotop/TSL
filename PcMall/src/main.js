import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import Routers from './router'
// import store from './store/store'
import Util from './libs/util'
import * as Ajax from './services/ajax.es6'
import App from './App'

import store from '@/store/index.js'

// config custom iconfonts
Vue.use(VueRouter)
Vue.use(iView)

Vue.use(Ajax.default)

Vue.prototype.bus = new Vue();

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: Routers,
  // scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { x: 0, y: 0 }
  //   }
  // },
}
const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  sessionStorage.setItem('fromPath', from.path)
  Util.title(to.meta.title)
  // 路由拦截
  let sessionInfo = sessionStorage.getItem('userInfo')
  if (to.meta.intercept) {
    if (sessionInfo) {
      next()
    } else {
      next({path: '/login'})
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  iView.LoadingBar.finish()
  // window.scrollTo(0, 0)
})

// 配置Ajax拦截器，处理全局异步请求的交互
Ajax.$interceptor.requestThen = function (config) {
  iView.LoadingBar.start()
  if (config.certified) {
    if (!sessionStorage.getItem('userInfo')) {
      iView.LoadingBar.error()
      iView.Message.error({
        content: `用户未登录，请重新登录!`
      })
      router.replace({path: '/home'})
      if (config.source) {
        config.source.cancel()
      }
      // Promise.cancel()
      return
    }
  }
}
Ajax.$interceptor.responseThen = function (response) {
  let { method, status, data } = response
  switch (true) {
    case /^20\d$/.test(status):
      if (data.code !== undefined) {
        if (data.code === 0) {
          // 业务处理成功（调用Vue.$defaultServiceTip.error）
          iView.LoadingBar.finish()
        } else if (data.code <= 100) {
          // 关键性业务处理错误
          iView.LoadingBar.error()
          iView.Modal.error({
            title: `错误：${data.code}`,
            content: data.message
          })
        } else if (data.code > 1000 && data.code == 6008) {
          // iView.LoadingBar.error()
          // iView.Modal.warning({
          //   title: `错误：${data.code}`,
          //   content: data.message
          // })
          // && [].indexOf(data.code) === -1
          // 其它一般性业务处理错误（调用Vue.$defaultServiceTip.error）
        }
      } else {
        if (method === 'post') {
          iView.LoadingBar.error()
          iView.Modal.error({
            title: '服务器返回错误',
            content: '请刷新页面重试。'
          })
        } else {
          iView.LoadingBar.finish()
        }
      }
      break
    default:
      iView.LoadingBar.error()
      iView.Modal.error({
        title: `服务器错误：${status}`,
        content: '服务器错误！'
      })
      break
  }
}
Ajax.$interceptor.responseCatch = function (error) {
  if (Ajax.$http.isCancel(error)) {
    iView.LoadingBar.update(0)
    setTimeout(() => {
      iView.LoadingBar.destroy()
    }, 200)
  } else {
    iView.LoadingBar.error()
    if (error.response && error.response.status > 0) {
      let status = error.response.status

      switch (true) {
        case /^401$/.test(status):
          iView.Message.error({
            content: `登录超时，请重新登录!`
          })
          router.replace({path: '/login'})
          break
        case /^403$/.test(status):
          router.replace({path: '/home/noPowerPage'})
          break
        case /^502|504|500$/.test(status):
          iView.Message.error({
            content: `网络状况不佳，请重试：${status}！`,
            duration: 5,
            closable: true
          })
          break
        default:
          iView.Modal.error({
            title: `服务器错误：${status}`,
            content: '服务器错误！'
          })
          break
      }
    } else {
      // iView.Message.error({
      //   content: '网络状况不佳，请重试！',
      //   duration: 5,
      //   closable: true
      // })
    }
  }
}
Ajax.$defaultServiceTip.success = function (response) {
  let { status, data } = response

  if (/^20\d$/.test(status)) {
    if (data.code !== undefined && data.code === 0) {
      iView.Message.success(data.message || '保存成功')
    }
  }
}
Ajax.$defaultServiceTip.error = function (response) {
  let { status, data } = response

  if (/^20\d$/.test(status)) {
    if (data.code !== undefined && data.code > 100) {
      iView.Modal.warning({
        title: `错误：${status}`,
        content: data.message || '数据错误，请重新提交。'
      })
    }
  }
}

new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount('#app')
