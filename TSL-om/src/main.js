import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import Routers from './router'
import store from './store/index'
import Util from './libs/util'
import * as Ajax from './services/ajax.es6'
import App from './App'

// 富文本
import VueQuillEditor from 'vue-quill-editor'
// config custom iconfonts
import './assets/fonts/Iconfont.font'

Vue.use(VueRouter)
Vue.use(iView)

Vue.use(Ajax.default)

Vue.use(VueQuillEditor)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: Routers
}
const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  Util.title(to.meta.title)
  if (!from.meta['keepAlive']) {
    // from.$destory()
    from.meta['keepAlive'] = true
    console.log('destory')
  }
  next(vm => {
    console.log('-----------------------------vm----------------------------')
    console.log(vm)
  })
})

router.afterEach(() => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

// 配置Ajax拦截器，处理全局异步请求的交互
Ajax.$interceptor.requestThen = function (config) {
  iView.LoadingBar.start()
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
        } else {
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
        case /^502|504$/.test(status):
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
      iView.Message.error({
        content: '网络状况不佳，请重试！',
        duration: 5,
        closable: true
      })
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
