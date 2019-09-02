import { GET_ALL_TASKS, STORE_ALL_TASKS, DONE_TASK } from '../mutation-types'
import { jsonRequest } from '@/utils/api'
import { formatDate } from '@/utils/index'
const state = {
  tasks: {},
  currentTask: {}
}

const getters = {}

const actions = {
  async [GET_ALL_TASKS]({ commit, state }, { event_id, onSuccess, onFailed }) {
    const result = await jsonRequest('GET', `/${event_id}/tasks`)
    if (!result) {
      onFailed()
      return
    }
    let temp = result.data
    let tempObj = {}
    temp.forEach(item => {
      const formatDateObj = formatDate(new Date(item.date))
      item.weekday = formatDateObj.weekday
      item.date = formatDateObj.date
      item.time = formatDateObj.time
      item.edit_time =
        formatDate(new Date(item.edit_time)).date === formatDateObj.date
          ? formatDate(new Date(item.edit_time)).time
          : formatDate(new Date(item.edit_time)).date +
            ' ' +
            formatDate(new Date(item.edit_time)).time
    })
    temp.forEach(item => {
      var objArray = tempObj[item.date] || []
      objArray.push(item)
      let isActiveTasks = objArray.filter(v => v.state === 0)
      let isDoneTasks = objArray.filter(v => v.state === 1)
      isActiveTasks.sort((a, b) => {
        if (a.level === b.level) {
          return (
            new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
          )
        } else {
          return b.level - a.level
        }
      })
      isDoneTasks.sort((a, b) => {
        const editTimeA =
          a.edit_time.split(' ').length === 2
            ? new Date(a.edit_time)
            : new Date(a.date + ' ' + a.edit_time)
        const editTimeB =
          b.edit_time.split(' ').length === 2
            ? new Date(b.edit_time)
            : new Date(b.date + ' ' + b.edit_time)
        return editTimeB - editTimeA
      })
      objArray = isActiveTasks.concat(isDoneTasks)
      tempObj[item.date] = objArray
    })
    commit(STORE_ALL_TASKS, tempObj)
    onSuccess(tempObj)
  },
  async [DONE_TASK](
    { commit, state },
    { event_id, task_id, onSuccess, onFailed }
  ) {
    const result = await jsonRequest('PUT', `/${event_id}/tasks`, {
      event_id,
      task_id,
      state: 1
    })
    if (result.state) {
      onSuccess(result.message)
      return
    }
    onFailed()
  }
}

const mutations = {
  [STORE_ALL_TASKS](state, tasks) {
    state.tasks = tasks
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
