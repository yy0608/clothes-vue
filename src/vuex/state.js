import { query } from '@/config.js'

const state = {
  page: query.page,
  limit: query.limit,
  userInfo: null,
  loginAuth: false,
  merchantList: null,
  merchantsCount: null,
  shopList: null,
  shopsCount: null
}

export default state
