import {
  GET_EVENTS_DATA,
  STORE_ALL_EVENTS,
  EVENT_OPERATION,
  STORE_EVENT_BY_EVENT_ID,
  CLEAR_CURRENT_EVENT
} from '../mutation-types'
import { jsonRequest } from '@/utils/api'
const state = {
  events: [],
  currentEvent: {}
}

const getters = {}

const actions = {
  async [GET_EVENTS_DATA](
    { commit, state },
    { user_id, onSuccess, onFailed, color }
  ) {
    const eventsResult = await jsonRequest('GET', `/${user_id}/events`)
    const tasksResult = await jsonRequest('GET', `/${user_id}/statistics`)
    for (let i = 1; i < color.length; i++) {
      const random = Math.floor(Math.random() * (i + 1))
      ;[color[i], color[random]] = [color[random], color[i]]
    }
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
