import Vue from 'vue'
import Vuex from 'vuex'
import miniapp from './modules/miniapp'
import user from './modules/user'
import event from './modules/event'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    miniapp,
    user,
    event
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
