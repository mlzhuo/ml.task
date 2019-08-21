import Vue from 'vue'
import Vuex from 'vuex'
import task from './modules/task'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    task
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
