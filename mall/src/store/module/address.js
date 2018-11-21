const address = {
  state: {
    id: '',
    receiverAddress: '',
    receiverMobile: '',
    receiverName: ''
  },
  mutations: {
    clearAddress (state) {
      state.id = ''
      state.receiverAddress = ''
      state.receiverMobile = ''
      state.receiverName = ''
    },
    setAddress (state, address) {
      state.id = address.id
      state.receiverAddress = address.receiverAddress
      state.receiverMobile = address.receiverMobile
      state.receiverName = address.receiverName
    }
  }
}
export default address
