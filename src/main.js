// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLoading from './plugins/loading/index'
import Prompt from './plugins/prompt/index'
import Mask from './plugins/mask/index'
// import Tool from './utils/Tool'
import { sync } from 'vuex-router-sync'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.use(VueLoading)
Vue.use(Prompt)
Vue.use(Mask)

// 引入mockjs
require('./mock.js')

const i18n = new VueI18n({
  locale: 'cn',    // 语言标识
  messages: {
    'cn': require('static/lang/cn'),   // 中文语言包
    'en': require('static/lang/en')    // 英文语言包
  }
})

/* let arr = ['login', 'regist']
router.beforeEach((to, from, next) => {
  if (Tool.isContains(arr, to.name)) {
    if (Tool.isLogin()) {
      next({path: '/'})
      return true
    }
  }
  next()
}) */
export function createApp () {
  // 同步路由状态(route state)到 store
  sync(store, router)
  // 创建应用程序实例，将 router 和 store 注入
  const app = new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  })
  // 暴露 app, router 和 store。
  return {app, router, store}
}
