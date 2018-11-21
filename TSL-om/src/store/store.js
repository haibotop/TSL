import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  userInfo: {}
}

const store = new Vuex.Store({
  state
})

export default store
