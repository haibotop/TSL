const login = {
  state: {
    phone: '',
    authsuccess: false,
    setPw: false
  },
  getters: {
    phone: state => state.phone,
    authsuccess: state => state.authsuccess,
    setPw: state => state.setPw
  },
  mutations: {
    authSucc (state) {
      state.authsuccess = true
    },
    authDel (state) {
      state.authsuccess = false
    },
    setPhone (state, phone) {
      state.phone = phone
    },
    clearnPhone (state) {
      state.phone = ''
    },
    setPw (state) {
      state.setPw = true
    },
    clearnPw (state) {
      state.setPw = false
    }
  }
}

export default login
