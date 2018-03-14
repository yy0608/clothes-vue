import { query } from '@/config.js'

const mutations = {
  test (state) {
    state.number = state.number + 1
  },
  changeUserInfo (state, value) {
    state.userInfo = value
  },
  changeLoginAuth (state, bool) {
    state.loginAuth = bool
  },
  changePage (state, page) { // 改变全局的当前页码数
    state.page = page
  },
  changeLimit (state, limit) { // 改变全局的每页限制条数
    state.limit = limit
  },
  decreaseMerchantsCount (state) {
    state.merchantsCount--
  },
  resetPage (state) {
    state.page = query.page
  }
}

export default mutations
