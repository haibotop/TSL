import axios from 'axios'
import * as config from './config.es6'

axios.defaults.certified = false // 为true时进行sessionStorge登录信息判断

let interceptor = {
  defaultRequestThen: function (config) {
    // console.info('-------------- Ajax Request --------------')
    // console.log(config)
    if (interceptor.requestThen && typeof interceptor.requestThen === 'function') {
      interceptor.requestThen(config)
    }
    return config
  },
  defaultRequestCatch: function (error) {
    // console.info('-------------- Ajax Error --------------')
    // console.log(error)
    if (interceptor.requestCatch && typeof interceptor.requestCatch === 'function') {
      interceptor.requestCatch(error)
    }
    return Promise.reject(error)
  },
  defaultResponseThen: function (response) {
    // console.info('-------------- Ajax Response --------------')
    // console.log(response)
    if (interceptor.responseThen && typeof interceptor.responseThen === 'function') {
      interceptor.responseThen(response)
    }
    return response
  },
  defaultResponseCatch: function (error) {
    /* develblock:start */
    console.info('-------------- Ajax Error --------------')
    if (error.response) {
      // console.log(error.response)
    }
    /* develblock:end */
    if (interceptor.responseCatch && typeof interceptor.responseCatch === 'function') {
      interceptor.responseCatch(error)
    }
    return Promise.reject(error)
  }
}
let defaultServiceTip = {}

export default {
  install (Vue) {
    // Vue.prototype.$http = axios
    Vue.prototype.$interceptor = interceptor
    Vue.prototype.$defaultServiceTip = defaultServiceTip
    // Vue.http = axios
    // 配置API接口地址
    axios.defaults.baseURL = config.SERVER_PATH
    // 配置默认拦截器
    addDefaultInterceptors()
  }
}

// export const $http = axios

export var $interceptor = interceptor

export var $defaultServiceTip = defaultServiceTip

export function create () {
  let instance = axios.create()
  addDefaultInterceptors(instance)

  return instance
}

export function addDefaultInterceptors (instance = axios) {
  if (interceptor.defaultRequest) {
    instance.interceptors.request.eject(interceptor.defaultRequest)
  }
  if (interceptor.defaultResponse) {
    instance.interceptors.response.eject(interceptor.defaultResponse)
  }
  interceptor.defaultRequest = instance.interceptors.request.use(interceptor.defaultRequestThen, interceptor.defaultRequestCatch)
  interceptor.defaultResponse = instance.interceptors.response.use(interceptor.defaultResponseThen, interceptor.defaultResponseCatch)
}
