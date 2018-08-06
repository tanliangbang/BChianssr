import * as api from '../../service/getData'
const state = {
  userInfo: null,
  loginHistory: []
}

const mutations = {
  SET_USERINFO: (state, data) => {
    state.userInfo = data
  },
  SET_LOGIN_HISTORY: (state, data) => {
    state.loginHistory = data
  }
}

const actions = {
  setUserInfo: ({ state, commit }, userInfo) => {
    commit('SET_USERINFO', userInfo)
  },
  getUserInfo: ({ state, commit }) => {
    api.getUserInfo().then(function (res) {
      if (res.status === 200) {
        commit('SET_USERINFO', res.data.userinfo)
      }
    })
  },
  getLoginHistory: ({ state, commit }, param) => {
    return api.getLoginHistory(param).then(function (res) {
      if (res.status === 200) {
        commit('SET_LOGIN_HISTORY', res)
      }
    })
  }
}

const getters = {
  getUserInfo: state => {
    return state.userInfo
  },
  getLoginHistory: state => {
    return state.loginHistory
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
