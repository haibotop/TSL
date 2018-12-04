import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import Routers from './router'
import store from './store/store'
import Util from './libs/util'
import * as Ajax from './services/ajax.es6'
import App from './App'
import cryptoJs from 'crypto-js'
import * as tool from './services/tool.es6'
// 富文本
import VueQuillEditor from 'vue-quill-editor'
import BabelPoly from 'babel-polyfill'
// 引入工具
Vue.prototype.$tool = tool

Vue.use(BabelPoly)
// config custom iconfonts
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
  // 路由拦截
  let sessionInfo = sessionStorage.getItem('userInfo')
  if (to.meta.requireAuth) {
    if (sessionInfo === null) {
      next({ path: '/' })
    } else if (sessionInfo.length > 0) {
      let us = cryptoJs.AES.decrypt(sessionInfo, 'key', 'conf')
      let qxstr = us.toString(cryptoJs.enc.Utf8)
      let qxContent = JSON.parse(qxstr)
      let ok = 0
      // console.log(qxContent)
      for (let i of qxContent.menuVoList) {
        if (to.path === i.url || to.path === '/home/default') {
          ok++
        } else if ((to.path === '/home/pageTemplate' || /\/home\/setPage/.test(to.path)) && /\/home\/pageList/.test(qxContent) !== -1) {
          ok++
        } else if (/\/home\/vipInfo/.test(to.path) && /\/home\/buyerList/.test(qxstr)) {
          ok++
        } else if ((/\/home\/orderDetail/.test(to.path) || /\/home\/orderStore/.test(to.path)) && /\/home\/orderManager/.test(qxstr)) {
          ok++
        } else if (/\/home\/fullReductionPromotion/.test(to.path) && /\/home\/fullReductionPromotion/.test(qxstr)) {
          ok++
        } else if (/\/home\/discountPromotion/.test(to.path) && /\/home\/discountPromotion/.test(qxstr)) {
          ok++
        } else if (/\/home\/directDropPromotion/.test(to.path) && /\/home\/directDropPromotion/.test(qxstr)) {
          ok++
        }
      }
      // ----------离开发布商品页拦截
      let config = {
        title: '提示',
        content: '将离开发布商品页面，是否继续',
        onOk: () => {
          next()
        }
      }
      if (ok > 0) {
        from.path === '/home/addProduct' ? iView.Modal.confirm(config) : next()
      } else {
        from.path === '/home/addProduct' ? iView.Modal.confirm(config) : next({ path: '/home/default' })
        // from.path === '/home/addProduct' ? iView.Modal.confirm(config) : next()
      }
    } else {
      next({ path: '/' })
    }
  } else {
    next()
  }
  if (to.name === 'login') {
    sessionStorage.setItem('userInfo', '')
  }
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
        } else if (data.code > 1000) {
          iView.LoadingBar.error()
          iView.Modal.warning({
            title: `错误：${data.code}`,
            content: data.message
          })
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
