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

export const changeEnter = (str) => {
  var resStr = str.replace(/<\s*/g, '&lt;')
  resStr = resStr.replace(/&lt;\s*/g, '&lt; ')
  resStr = resStr.replace(/\n/g, '<br>')
  return resStr
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

export const formatCategoriesForCascader = (data, lastDisabled) => { // 请求到的分类列表处理为多级列表数据，lastDisabled区分是否最后类别禁用
  let resData = []
  for (let item of data) {
    resData.push({
      value: item._id,
      label: item.name,
      disabled: lastDisabled === undefined ? false : item.level > 2, // 多于2级不可选
      parent_id: item.parent_id
    })
  }
  let resArr = []
  for (let item of resData) {
    if (!item.parent_id) {
      resArr.push(item)
      item.children = []
      for (let item2 of resData) {
        if (item2.parent_id === item.value) {
          item.children.push(item2)
          item2.children = []
          for (let item3 of resData) {
            if (item3.parent_id === item2.value) {
              item2.children.push(item3)
            }
          }
        }
      }
    }
  }
  resData = null
  return resArr
}

export const formatCategoryForDefaultValue = (data, categories, showAll) => { // 通过当前分类获取所在分类的数组
  let resData = []
  switch (data.level) {
    case 1:
      if (showAll) {
        resData[0] = data._id
      }
      break
    case 2:
      if (showAll) {
        resData[1] = data._id
      }
      for (let item of categories) {
        if (item._id === data.parent_id) {
          resData[0] = item._id
        }
      }
      break
    case 3:
      if (showAll) {
        resData[2] = data._id
      }
      for (let item of categories) {
        if (item._id === data.parent_id) {
          resData[1] = item._id
          for (let item2 of categories) {
            if (item2._id === item.parent_id) {
              resData[0] = item2._id
            }
          }
        }
      }
      break
  }
  return resData
}
