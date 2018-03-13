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
  }
}

export default actions
