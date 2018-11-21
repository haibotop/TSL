// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'

// config custom iconfonts
import './assets/fonts/Iconfont.font'
import 'vue-croppa/dist/vue-croppa.css'

import * as tool from '@/services/myTool.es6'

import mySvg from '@/components/mySvg.vue'
Vue.component('my-svg', mySvg)
import Croppa from 'vue-croppa'

import store from '@/store/index.js'
import * as routerConfigs from './routerConfig'

import wx from 'weixin-js-sdk'
import * as wxApi from './services/API/wxService.es6'

Vue.use(VueRouter)

import { AjaxPlugin, AlertPlugin, LoadingPlugin, ToastPlugin, ConfirmPlugin } from 'vux'

Vue.use(AjaxPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(Croppa)

// 路由配置
const routerConfig = routerConfigs.default

const router = new VueRouter({
  routes: routerConfig
  // mode: 'history'
})
// console.log('http://' + window.document.domain + '/static/img/share.png') // require('./assets/images/share.png'))
router.beforeEach((to, from, next) => {
  if (from.path !== '/') {
    sessionStorage.setItem('fromPath', from.path)
    if (isWX()) {
      wx.ready(() => {
        wx.onMenuShareAppMessage({
          title: 'TSL | 謝瑞麟 线上珠宝店',
          desc: 'TSL | 謝瑞麟 线上珠宝店现已正式上线，欢迎您亲启闪耀之旅！',
          link: 'http://' + window.document.domain + '?backRoute=' + to.fullPath,
          imgUrl: 'http://' + window.document.domain + '//static/img/share.jpg',
          success: function () {
            // console.log('分享成功')
          },
          cancel: function () {
            // console.log('取消')
          }
        })
        wx.onMenuShareTimeline({
          title: 'TSL | 謝瑞麟 线上珠宝店',
          desc: 'TSL | 謝瑞麟 线上珠宝店现已正式上线，欢迎您亲启闪耀之旅！',
          link: location.href,
          imgUrl: 'http://' + window.document.domain + '//static/img/share.jpg',
          success: function () {
            // console.log('分享成功')
          },
          cancel: function () {
            // console.log('取消')
          }
        })
      })
    }
  }
  // let title = to.meta.title
  window.document.title = 'TSL | 謝瑞麟 线上珠宝店'
  // if (sessionStorage.getItem('userInfo')) {
  //   console.log('to', to)
  // }
  if (to.path) {
    window._hmt.push(['_trackPageview', '/#' + to.fullPath])
  }
  if (to.meta.intercept) {
    if (sessionStorage.getItem('userInfo')) {
      // if (to.path === '')
      next()
    } else {
      Vue.$vux.confirm.show({
        content: '用户未登录',
        confirmText: '去登录',
        onConfirm: () => {
          next({path: '/signin'})
        },
        onCancel: () => {
          console.log(to.name)
          if (['mine', 'mySet', 'myAccount', 'myPassword', 'myInfo', 'myNickname', 'myCollection', 'myOrders', 'myOrderDetail'].indexOf(to.name) !== -1) {
            next({path: '/mine'})
          }
        }
      })
    }
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
  Vue.$vux.loading.hide()
  Vue.$vux.alert.hide()
  Vue.$vux.toast.hide()
  // setTimeout(()=>{
  //   var _hmt = _hmt || [];
  //   (function() {
  //     // 每次执行前，先移除上次插入的代码
  //     document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove()
  //     var hm = document.createElement('script')
  //     // UAT
  //     hm.src = 'https://hm.baidu.com/hm.js?b922d3468d81c68396c3b48ce67d836a'
  //     // PROD
  //     //  hm.src = 'https://hm.baidu.com/hm.js?11e201843d624a611750c4910f8b851d'
  //     hm.id = "baidu_tj"
  //     var s = document.getElementsByTagName('script')[0]
  //     s.parentNode.insertBefore(hm, s)
  //   })()
  // },0)
})

// 配置Ajax拦截器，处理全局异步请求的交互
import * as Ajax from './services/ajax.es6'

Vue.use(Ajax.default)

Ajax.$interceptor.requestThen = function (config) {
  if (!tool.isOnline()) {
    Vue.$vux.toast.show({type: 'text', text: `无网络状态`, width: '200px', time: 5000})
    config.source.cancel()
    return
  }
  Vue.$vux.loading.show()
  if (config.certified) {
    if (!sessionStorage.getItem('userInfo')) {
      Vue.$vux.confirm.show({
        content: '用户未登录',
        confirmText: '去登录',
        onConfirm: () => {
          router.push({path: '/signin'})
        },
        onCancel: () => {
          if (['mine', 'mySet', 'myAccount', 'myPassword', 'myInfo', 'myNickname', 'myCollection', 'myOrders', 'myOrderDetail'].indexOf(router.history.current.name) !== -1) {
            router.push({path: '/mine'})
          } else {
            localStorage.removeItem('settlementProductItems')
          }
        }
      })
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

  Vue.$vux.loading.hide()
  switch (true) {
    case /^20\d$/.test(status):
      if (data.code !== undefined) {
        if (data.code === 0) {
          // 业务处理成功（调用Vue.$defaultServiceTip.error）
        } else if (data.code <= 100) {
          // 关键性业务处理错误
          Vue.$vux.alert.show({
            title: `错误：${data.code}`,
            content: data.message
          })
        } else {
          // 其它一般性业务处理错误（调用Vue.$defaultServiceTip.error）
        }
      } else {
        if (method === 'post') {
          Vue.$vux.alert.show({
            title: '服务器返回错误',
            content: '请刷新页面重试。'
          })
        }
      }
      break
    default:
      Vue.$vux.alert.show({
        title: `服务器错误：${status}`,
        content: '服务器错误！'
      })
      break
  }
}
Ajax.$interceptor.responseCatch = function (error) {
  Vue.$vux.loading.hide()
  if (error.response && error.response.status > 0) {
    let status = error.response.status
    console.log(status)
    switch (true) {
      case /^200$/.test(status):
        break
      case /^401$/.test(status):
        sessionStorage.removeItem('userInfo')
        if (/isProductCollection/.test(error.response.request.responseURL)) {
          console.log(error.response.request.responseURL)
        } else {
          Vue.$vux.confirm.show({
            content: '用户未登录或登录已超时',
            confirmText: '去登录',
            onConfirm: () => {
              router.push({path: '/signin'})
            },
            onCancel: () => {
              if (['mine', 'mySet', 'myAccount', 'myPassword', 'myInfo', 'myNickname', 'myCollection', 'myOrders', 'myOrderDetail'].indexOf(router.history.current.name) !== -1) {
                router.push({path: '/mine'})
              } else {
                sessionStorage.removeItem('settlementProductItems')
              }
            }
          })
        }
        break
      case /^500$/.test(status):
        // if (error.response.data.code === 9003) {
        //   Vue.$vux.toast.show({type: 'text', text: error.response.data.message, width: '200px'})
        // }
        Vue.$vux.toast.show({type: 'text', text: `网络不佳，请重试`, width: '200px'})
        break
      case /^502|504$/.test(status):
        Vue.$vux.toast.show({
          text: `网络状况不佳<br />请重试：${status}！`,
          time: 5000,
          type: 'text',
          position: 'bottom'
        })
        break
      default:
        Vue.$vux.toast.show({
          text: `服务器错误<br />${status}`,
          time: 5000,
          type: 'warn'
        })
        break
    }
  } else {
    // Vue.$vux.toast.show({
    //   text: `网络状况不佳<br />请重试！`,
    //   time: 5000,
    //   type: 'text',
    //   position: 'bottom'
    // })
  }
}
Ajax.$defaultServiceTip.success = function (response) {
  let { status, data } = response

  if (/^20\d$/.test(status)) {
    if (data.code !== undefined && data.code === 0) {
      Vue.$vux.toast.show({
        text: data.message || '保存成功',
        type: 'success'
      })
    }
  }
}
Ajax.$defaultServiceTip.error = function (response) {
  let { status, data } = response

  if (/^20\d$/.test(status)) {
    if (data.code !== undefined && data.code > 100) {
      Vue.$vux.toast.show({
        text: data.message || '数据错误<br />请重新提交',
        type: 'warn'
      })
    }
  }
}

FastClick.prototype.onTouchEnd = function (event) {
  if (event.target.hasAttribute('type') && event.target.getAttribute('type') === 'file') {
    return false
  }
}

FastClick.attach(document.body)

Vue.config.productionTip = false

// -----------------  微信分享
if (isWX()) {
  // -======================微信分享
  let url = 'http://' + window.document.domain + '/'
  getConfig(url)
}

// 判断是否微信环境
function isWX () {
  let ua = window.navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') !== -1) {
    return true
  } else {
    return false
  }
}
//  得到微信配置
function getConfig (url) {
  Vue.prototype.$http.get(wxApi.getSignature(url))
  .then((res) => {
    // console.log('res', res.data)
    wx.config({
      debug: false,
      appId: res.data.appid,
      timestamp: res.data.timestamp,
      nonceStr: res.data.nonceStr,
      signature: res.data.signature,
      jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
    })
    wx.ready(() => {
      wx.onMenuShareAppMessage({
        title: 'TSL | 謝瑞麟 线上珠宝店',
        desc: 'TSL | 謝瑞麟 线上珠宝店现已正式上线，欢迎您亲启闪耀之旅！',
        link: 'http://' + window.document.domain,
        imgUrl: 'http://' + window.document.domain + '//static/img/share.jpg',
        success: function () {
          // console.log('分享成功')
        },
        cancel: function () {
          // console.log('取消')
        }
      })
      wx.onMenuShareTimeline({
        title: 'TSL | 謝瑞麟 线上珠宝店',
        desc: 'TSL | 謝瑞麟 线上珠宝店现已正式上线，欢迎您亲启闪耀之旅！',
        link: location.href,
        imgUrl: 'http://' + window.document.domain + '//static/img/share.jpg',
        success: function () {
          // console.log('分享成功')
        },
        cancel: function () {
          // console.log('取消')
        }
      })
    })
  })
}

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
