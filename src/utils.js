import axios from 'axios'
import { origin } from '@/config.js'

const tenParse = (number) => {
  return number < 10 ? '0' + number : number
}

export const parseDate = (date, integer) => {
  let dateObj = new Date(date)
  let year = dateObj.getFullYear()
  let month = dateObj.getMonth() + 1
  let day = dateObj.getDate()
  let hour = dateObj.getHours()
  let minute = dateObj.getMinutes()
  let second = dateObj.getSeconds()
  if (integer) { // 返回20180315123050
    return year + tenParse(month) + tenParse(day) + tenParse(hour) + tenParse(minute) + tenParse(second)
  } else { // 返回2018-03-16 16:34:35
    return year + '-' + tenParse(month) + '-' + tenParse(day) + ' ' + tenParse(hour) + ':' + tenParse(minute) + ':' + tenParse(second)
  }
}

export const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const getQiniuToken = () => { // 获取本地未过期的token
  let localQiniuToken = window.localStorage.qiniuToken
  let qiniuTokenObj = {}
  if (localQiniuToken) {
    try {
      qiniuTokenObj = JSON.parse(localQiniuToken)
      if (Date.now() < qiniuTokenObj.deadline) {
        return qiniuTokenObj.token
      } else {
        return ''
      }
    } catch (e) {
      return ''
    }
  } else {
    return ''
  }
}

export const getQiniuTokenRequest = (data) => { // 从服务器获取token
  return new Promise((resolve, reject) => {
    axios({
      url: origin + '/qiniu/generate_token',
      method: 'post',
      data,
      withCredentials: true
    })
      .then(res => {
        window.localStorage.qiniuToken = JSON.stringify({
          token: res.data.data,
          deadline: Date.now() + ((res.data.expires - 300) * 1000)
        })
        resolve(res.data.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
