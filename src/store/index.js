import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import lang from './modules/lang'
import createLogger from '../plugins/store-logger/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    common,
    user,
    lang
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
