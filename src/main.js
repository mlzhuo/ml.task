import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import '../static/css/main.css'
import '../static/css/icon.css'
import cuCustom from '@/components/cu-custom.vue'
import Loading from '@/components/loading.vue'
import ReTry from '@/components/re-try.vue'
import { jsonRequest } from '@/utils/api'
Vue.component('cu-custom', cuCustom)
Vue.component('Loading', Loading)
Vue.component('ReTry', ReTry)
wx.getSystemInfo({
  success: function(e) {
    Vue.prototype.StatusBar = e.statusBarHeight
    Vue.prototype.windowHeight = e.windowHeight
    Vue.prototype.windowWidth = e.windowWidth
    if (e.platform == 'android') {
      Vue.prototype.CustomBar = e.statusBarHeight + 50
    } else {
      Vue.prototype.CustomBar = e.statusBarHeight + 45
    }
  }
})

Vue.prototype.showToast = (title, icon) => {
  wx.showToast({
    title,
    icon: icon || 'none',
    duration: 1500
  })
}
Vue.prototype.jsonRequest = jsonRequest
Vue.prototype.$store = store

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
