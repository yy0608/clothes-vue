import axios from 'axios'
import { origin } from '@/config.js'

const actions = {
  goLogin ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      axios({
        url: origin + '/employ/login',
        method: 'post',
        data,
        withCredentials: true
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getMerchantList ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios({
        url: origin + '/employ/merchant_list',
        method: 'get',
        params: {
          page: state.page,
          limit: state.limit
        },
        withCredentials: true
      })
        .then(res => {
          if (res.data.success) {
            state.merchantList = res.data.data
            state.merchantsCount = res.data.count
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getShopList ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      axios({
        url: origin + '/employ/merchant_shops',
        method: 'get',
        params: {
          page: state.page,
          limit: state.limit,
          merchant_id: data && data.merchant_id
        },
        withCredentials: true
      })
        .then(res => {
          if (res.data.success) {
            state.shopList = res.data.data
            state.shopsCount = res.data.count
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default actions
