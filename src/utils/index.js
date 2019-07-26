const formatNumber = n => {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

const formatDate = date => {
  const year = date.getFullYear()
  let month = formatNumber(date.getMonth() + 1)
  let day = formatNumber(date.getDate())
  let hours = formatNumber(date.getHours())
  let minutes = formatNumber(date.getMinutes())
  let seconds = formatNumber(date.getSeconds())
  return {
    fullDate: `${year}年${month}月${day}日`,
    date: month + '-' + day,
    time: hours + ':' + minutes
  }
}

export { formatNumber, formatTime, formatDate }
