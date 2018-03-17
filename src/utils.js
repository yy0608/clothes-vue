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
