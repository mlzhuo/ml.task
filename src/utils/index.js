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
  const currentYear = new Date().getFullYear()
  let month = formatNumber(date.getMonth() + 1)
  let day = formatNumber(date.getDate())
  let hours = formatNumber(date.getHours())
  let minutes = formatNumber(date.getMinutes())
  let seconds = formatNumber(date.getSeconds())
  return {
    fullDate: `${year}年${month}月${day}日`,
    date:
      year === currentYear ? month + '-' + day : year + '-' + month + '-' + day,
    time: hours + ':' + minutes,
    weekday: '周' + '日一二三四五六'.charAt(date.getDay())
  }
}

const formatYMD = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const t1 = [year, month, day].map(formatNumber).join('-')

  return `${t1}`
}
const formatVersionText = str => {
  const textArr = str.split(/;|；/)
  return textArr
}

const formatPunchDate = (startStr, endStr) => {
  const start = startStr.split('-')
  const firstDate = new Date(`${start[0]}-${start[1]}-01`).getTime()
  const end = endStr.split('-')
  const lastDate = new Date(end[0], end[1], 0).getTime()
  let dateObj = {}
  let startWeek = {}
  const len = (lastDate - firstDate) / (24 * 3600 * 1000) + 1
  for (let i = 0; i < len; i++) {
    const year = new Date(firstDate + i * 24 * 3600 * 1000).getFullYear() + ''
    let month = new Date(firstDate + i * 24 * 3600 * 1000).getMonth() + 1
    month = month < 10 ? '0' + month : month + ''
    let date = new Date(firstDate + i * 24 * 3600 * 1000).getDate()
    date = date < 10 ? '0' + date : date + ''
    const time = new Date(`${year}-${month}-${date}`).getTime()
    const isIn =
      time <= new Date(endStr).getTime() && time >= new Date(startStr).getTime()
    if (!dateObj[year + '-' + month]) {
      const week = new Date(`${year}-${month}-01`).getDay()
      startWeek[year + '-' + month] = week
      dateObj[year + '-' + month] = []
      dateObj[year + '-' + month].push({
        fullDate: `${year}-${month}-${date}`,
        date,
        isIn
      })
    } else {
      dateObj[year + '-' + month].push({
        fullDate: `${year}-${month}-${date}`,
        date,
        isIn
      })
    }
  }
  for (const key in startWeek) {
    const value = startWeek[key]
    let monthDateLen = dateObj[key].length
    for (let i = 0; i < value; i++) {
      dateObj[key].unshift({})
    }
    monthDateLen = dateObj[key].length
    let renderMonthDay = 35
    if ((value === 5 || value === 6) && monthDateLen > 35) {
      renderMonthDay = 42
    }
    console.log(key, value, monthDateLen, renderMonthDay)
    const pushItemLen = renderMonthDay - monthDateLen
    for (let i = 0; i < pushItemLen; i++) {
      dateObj[key].push({})
    }
  }
  return dateObj
}

export {
  formatNumber,
  formatTime,
  formatDate,
  formatYMD,
  formatVersionText,
  formatPunchDate
}
