export const formatNumber = n => {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
};

export const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("-");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
};

export const formatDate = date => {
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();
  let month = formatNumber(date.getMonth() + 1);
  let day = formatNumber(date.getDate());
  let hours = formatNumber(date.getHours());
  let minutes = formatNumber(date.getMinutes());
  let seconds = formatNumber(date.getSeconds());
  return {
    fullDate: `${year}年${month}月${day}日`,
    date:
      year === currentYear ? month + "-" + day : year + "-" + month + "-" + day,
    time: hours + ":" + minutes,
    weekday: "周" + "日一二三四五六".charAt(date.getDay())
  };
};

export const formatYMD = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const t1 = [year, month, day].map(formatNumber).join("-");

  return `${t1}`;
};

export const formatVersionText = str => {
  const textArr = str.split(/;|；/);
  return textArr;
};

export const splitNum = num => {
  var str = "";
  if (typeof num == "number") {
    str = num.toString();
  } else if (typeof num == "string") {
    str = num;
  } else {
    return num;
  }
  var re = /(?=(?!\b)(\d{3})+$)/g;
  return str.replace(re, ",");
};

export const formatPunchDate = (startStr, endStr) => {
  const start = startStr.split("-");
  const firstDate = new Date(`${start[0]}-${start[1]}-01`).getTime();
  const end = endStr.split("-");
  const lastDate = new Date(end[0], end[1], 0).getTime();
  let dateObj = {};
  let startWeek = {};
  const len = (lastDate - firstDate) / (24 * 3600 * 1000) + 1;
  for (let i = 0; i < len; i++) {
    const year = new Date(firstDate + i * 24 * 3600 * 1000).getFullYear() + "";
    let month = new Date(firstDate + i * 24 * 3600 * 1000).getMonth() + 1;
    month = month < 10 ? "0" + month : month + "";
    let date = new Date(firstDate + i * 24 * 3600 * 1000).getDate();
    date = date < 10 ? "0" + date : date + "";
    const time = new Date(`${year}-${month}-${date}`).getTime();
    const isIn =
      time <= new Date(endStr).getTime() &&
      time >= new Date(startStr).getTime();
    if (!dateObj[year + "-" + month]) {
      const week = new Date(`${year}-${month}-01`).getDay();
      startWeek[year + "-" + month] = week;
      dateObj[year + "-" + month] = [];
      dateObj[year + "-" + month].push({
        fullDate: `${year}-${month}-${date}`,
        date,
        isIn
      });
    } else {
      dateObj[year + "-" + month].push({
        fullDate: `${year}-${month}-${date}`,
        date,
        isIn
      });
    }
  }
  for (const key in startWeek) {
    const value = startWeek[key];
    let monthDateLen = dateObj[key].length;
    for (let i = 0; i < value; i++) {
      dateObj[key].unshift({});
    }
    monthDateLen = dateObj[key].length;
    let renderMonthDay = 35;
    if ((value === 5 || value === 6) && monthDateLen > 35) {
      renderMonthDay = 42;
    }
    const pushItemLen = renderMonthDay - monthDateLen;
    for (let i = 0; i < pushItemLen; i++) {
      dateObj[key].push({});
    }
  }
  return dateObj;
};

export const diffTime = target_date => {
  var diff = target_date.getTime() - new Date().getTime();
  var days = Math.floor(diff / (24 * 3600 * 1000));
  var leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.floor(leave3 / 1000);
  days = days > 0 ? `${days}天` : "";
  hours = hours > 0 ? `${hours}时` : "";
  minutes = minutes > 0 ? `${minutes}分` : "";
  seconds = `${seconds}秒`;
  // var returnStr = seconds + "秒前";
  // if (minutes > 0) {
  //   returnStr = minutes + "分钟前"; //+ returnStr;
  // }
  // if (hours > 0) {
  //   returnStr = hours + "小时前"; // + returnStr;
  // }
  // if (days > 0) {
  //   returnStr = days + "天前"; //+ returnStr;
  // }
  return `${days}${hours}${minutes}${seconds}`;
};

export const formatTask = temp => {
  let tempObj = {};
  temp.forEach(item => {
    const formatDateObj = formatDate(new Date(item.date));
    item.weekday = formatDateObj.weekday;
    item.date = formatDateObj.date;
    const dateArr = item.date.split("-");
    if (item.date.length === 5) {
      item.date_details = {
        year: "",
        month: dateArr[0],
        day: dateArr[1]
      };
    } else {
      item.date_details = {
        year: dateArr[0],
        month: dateArr[1],
        day: dateArr[2]
      };
    }
    item.time = formatDateObj.time;
    item.edit_time =
      formatDate(new Date(item.edit_time)).date === formatDateObj.date
        ? formatDate(new Date(item.edit_time)).time
        : formatDate(new Date(item.edit_time)).date +
          " " +
          formatDate(new Date(item.edit_time)).time;
  });
  temp.forEach(item => {
    var objArray = tempObj[item.date] || [];
    objArray.push(item);
    let isActiveTasks = objArray.filter(v => v.state === 0);
    let isDoneTasks = objArray.filter(v => v.state === 1);
    isActiveTasks.sort((a, b) => {
      if (a.level === b.level) {
        return (
          new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
        );
      } else {
        return b.level - a.level;
      }
    });
    isDoneTasks.sort((a, b) => {
      const editTimeA =
        a.edit_time.split(" ").length === 2
          ? new Date(a.edit_time)
          : new Date(a.date + " " + a.edit_time);
      const editTimeB =
        b.edit_time.split(" ").length === 2
          ? new Date(b.edit_time)
          : new Date(b.date + " " + b.edit_time);
      return editTimeB - editTimeA;
    });
    objArray = isActiveTasks.concat(isDoneTasks);
    tempObj[item.date] = objArray;
  });
  return tempObj;
};

// export {
//   formatNumber,
//   formatTime,
//   formatDate,
//   formatYMD,
//   formatVersionText,
//   splitNum,
//   formatPunchDate,
//   diffTime
// };
