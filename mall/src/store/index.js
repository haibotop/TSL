import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'
import address from './module/address'
import home from './module/home'
import login from './module/login'

Vue.use(Vuex)

export default new Vuex.Store({
  // getters,
  // actions,
  modules: {
    home: home,
    address: address,
    login
  }
})
