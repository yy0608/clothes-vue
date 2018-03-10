const mutations = {
  test (state) {
    state.number = state.number + 1
  },
  changeUserInfo (state, value) {
    state.userInfo = value
  },
  changeLoginAuth (state, bool) {
    state.loginAuth = bool
  }
}

export default mutations
