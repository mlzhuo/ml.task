import {
  GET_EVENTS_DATA,
  STORE_ALL_EVENTS,
  EVENT_OPERATION,
  STORE_EVENT_BY_EVENT_ID,
  CLEAR_CURRENT_EVENT,
  IS_NEED_REFRESH_EVENT,
  GET_ALL_TASKS,
  STORE_ALL_TASKS,
  DONE_TASK,
  STORE_TASK_BY_TASK_ID,
  CLEAR_CURRENT_TASK,
  TASK_OPERATION,
  IS_NEED_REFRESH_TASK
} from '../mutation-types'
import { jsonRequest } from '@/utils/api'
import { formatDate } from '@/utils/index'
const state = {
  events: [],
  currentEvent: {},
  isNeedRefreshEvent: true,
  tasks: {},
  currentTask: {},
  isNeedRefreshTask: {}
}

const getters = {}

const actions = {
  async [GET_EVENTS_DATA](
    { commit, state },
    { user_id, onSuccess, onFailed, color }
  ) {
    const eventsResult = await jsonRequest('GET', `/${user_id}/events`)
    const tasksResult = await jsonRequest('GET', `/${user_id}/statistics`)
    if (!eventsResult) {
      onFailed()
      return
    }
    if (eventsResult.state && tasksResult.state) {
      let temp = []
      let index = 0
      eventsResult.data.forEach(item => {
        if (index >= color.length) {
          index = 0
        }
        item = {
          ...item,
          color: color[index],
          cuIcon: item.level === 0 ? '' : 'favorfill'
        }
        index++
        temp.push(item)
      })
      for (const key in tasksResult.data) {
        const { isDone, all } = tasksResult.data[key]
        let event = temp.find(event => event._id === key)
        event.isDone = isDone
        event.all = all
      }
      commit(STORE_ALL_EVENTS, temp)
      onSuccess()
    } else {
      onFailed()
    }
  },
  async [EVENT_OPERATION](
    { commit, state },
    {
      method,
      title,
      description,
      level,
      user_id,
      event_id,
      onSuccess,
      onFailed
    }
  ) {
    const result = await jsonRequest(method, `/${user_id}/events`, {
      title,
      description,
      level,
      user_id,
      event_id
    })
    if (!result) {
      onFailed()
      return
    }
    const { message } = result
    onSuccess(message)
  },
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
    commit(STORE_ALL_TASKS, { [event_id]: tempObj })
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
  },
  async [TASK_OPERATION](
    { commit, state },
    { method, event_id, data, onSuccess, onFailed }
  ) {
    const result = await jsonRequest(method, `/${event_id}/tasks`, data)
    if (!result) {
      onFailed()
      return
    }
    onSuccess(result.message)
  }
}

const mutations = {
  [STORE_ALL_EVENTS](state, events) {
    state.events = events
  },
  [STORE_EVENT_BY_EVENT_ID](state, event) {
    state.currentEvent = event
  },
  [CLEAR_CURRENT_EVENT](state) {
    state.currentEvent = {}
  },
  [IS_NEED_REFRESH_EVENT](state, isNeedRefreshEvent) {
    state.isNeedRefreshEvent = isNeedRefreshEvent
  },
  [STORE_ALL_TASKS](state, tasks) {
    state.tasks = Object.assign({}, state.tasks, tasks)
  },
  [STORE_TASK_BY_TASK_ID](state, task) {
    state.currentTask = task
  },
  [CLEAR_CURRENT_TASK](state) {
    state.currentTask = {}
  },
  [IS_NEED_REFRESH_TASK](state, isNeedRefreshTask) {
    state.isNeedRefreshTask = Object.assign(
      {},
      state.isNeedRefreshTask,
      isNeedRefreshTask
    )
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
