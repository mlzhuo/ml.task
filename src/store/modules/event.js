import {
  STORE_RETRY_ACTION_TYPE,
  STORE_RETRY_ACTION_PAYLOAD,
  GET_EVENTS_DATA,
  STORE_ALL_EVENTS,
  EVENT_OPERATION,
  DELETE_EVENT,
  STORE_EVENT_BY_EVENT_ID,
  CLEAR_CURRENT_EVENT,
  IS_NEED_REFRESH_EVENT,
  GET_ALL_TASKS,
  STORE_ALL_TASKS,
  DONE_TASK,
  STORE_TASK_BY_TASK_ID,
  CLEAR_CURRENT_TASK,
  TASK_OPERATION,
  DELETE_TASK,
  IS_NEED_REFRESH_TASK
  // STORE_REQUEST_STATUS
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
    { commit, state, rootState },
    { onSuccess, onFailed }
  ) {
    const user_id = rootState.user.userInfo.userId
    const eventsResult = await jsonRequest('GET', `/${user_id}/events`)
    if (!eventsResult) {
      onFailed()
      commit(`miniapp/${STORE_RETRY_ACTION_TYPE}`, `event/${GET_EVENTS_DATA}`, {
        root: true
      })
      commit(
        `miniapp/${STORE_RETRY_ACTION_PAYLOAD}`,
        { onSuccess, onFailed },
        {
          root: true
        }
      )
      return
    }
    const tasksResult = await jsonRequest('GET', `/${user_id}/statistics`)
    if (eventsResult.state && tasksResult.state) {
      let temp = []
      eventsResult.data.forEach(item => {
        item = {
          ...item,
          color: item.level === 0 ? 'ml-info' : 'ml-danger',
          cuIcon: item.level === 0 ? '' : 'favorfill'
        }
        temp.push(item)
      })
      for (const key in tasksResult.data) {
        const { isDone, all } = tasksResult.data[key]
        let event = temp.find(event => event._id === key)
        event.isDone = isDone
        event.all = all
      }
      commit(STORE_ALL_EVENTS, temp)
      commit(IS_NEED_REFRESH_EVENT, false)
      onSuccess()
    } else {
      onFailed()
      commit(`miniapp/${STORE_RETRY_ACTION_TYPE}`, `event/${GET_EVENTS_DATA}`, {
        root: true
      })
      commit(
        `miniapp/${STORE_RETRY_ACTION_PAYLOAD}`,
        { onSuccess, onFailed },
        {
          root: true
        }
      )
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
    commit(IS_NEED_REFRESH_EVENT, true)
    const { message } = result
    onSuccess(message)
  },
  async [DELETE_EVENT]({ commit, state, rootState }, { onSuccess, onFailed }) {
    const user_id = rootState.user.userInfo.userId
    const event_id = state.currentEvent._id
    const delResult = await jsonRequest(
      'DELETE',
      `/${user_id}/events/${event_id}`
    )
    if (delResult && delResult.state) {
      onSuccess(delResult.message)
    } else {
      onFailed()
    }
  },
  async [GET_ALL_TASKS]({ commit, state }, { event_id, onSuccess, onFailed }) {
    const result = await jsonRequest('GET', `/${event_id}/tasks`)
    if (!result) {
      onFailed()
      commit(`miniapp/${STORE_RETRY_ACTION_TYPE}`, `event/${GET_ALL_TASKS}`, {
        root: true
      })
      commit(
        `miniapp/${STORE_RETRY_ACTION_PAYLOAD}`,
        { event_id, onSuccess, onFailed },
        {
          root: true
        }
      )
      return
    }
    let temp = result.data
    let tempObj = {}
    temp.forEach(item => {
      const formatDateObj = formatDate(new Date(item.date))
      item.weekday = formatDateObj.weekday
      item.date = formatDateObj.date
      const dateArr = item.date.split('-')
      if (item.date.length === 5) {
        item.date_details = {
          year: '',
          month: dateArr[0],
          day: dateArr[1]
        }
      } else {
        item.date_details = {
          year: dateArr[0],
          month: dateArr[1],
          day: dateArr[2]
        }
      }
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
    commit(IS_NEED_REFRESH_TASK, {
      [event_id]: { isNeed: false }
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
      commit(IS_NEED_REFRESH_EVENT, true)
      onSuccess(result.message)
      return
    }
    onFailed()
  },
  async [TASK_OPERATION](
    { commit, state },
    { method, event_id, data, onSuccess, onFailed }
  ) {
    const result = await jsonRequest(method, `/${event_id}/tasks`, data, commit)
    if (!result) {
      onFailed()
      return
    }
    commit(IS_NEED_REFRESH_EVENT, true)
    commit(IS_NEED_REFRESH_TASK, {
      [event_id]: { isNeed: true }
    })
    onSuccess(result.message)
  },
  async [DELETE_TASK]({ commit, state, rootState }, { onSuccess, onFailed }) {
    const task_id = state.currentTask._id
    const event_id = state.currentEvent._id
    const delResult = await jsonRequest(
      'DELETE',
      `/${event_id}/tasks/${task_id}`
    )
    if (delResult && delResult.state) {
      commit(IS_NEED_REFRESH_EVENT, true)
      onSuccess(delResult.message)
    } else {
      onFailed()
    }
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
