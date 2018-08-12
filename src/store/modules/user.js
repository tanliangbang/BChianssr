import * as api from '../../service/getData'
const state = {
  userInfo: null,
  currUserAsset: null,
  loginHistory: []
}

const mutations = {
  SET_USERINFO: (state, data) => {
    state.userInfo = data
  },
  SET_LOGIN_HISTORY: (state, data) => {
    state.loginHistory = data
  },
  SET_USERASSERT: (state, data) => {
    state.currUserAsset = data
  }
}

const actions = {
  setUserInfo: ({ state, commit }, userInfo) => {
    commit('SET_USERINFO', userInfo)
  },
  getUserInfo: ({ state, commit }) => {
    if (state.userInfo !== null) {
      return
    }
    return api.getUserInfo().then(function (res) {
      if (res.status === 200) {
        commit('SET_USERINFO', res.data.userinfo)
      }
    })
  },
  getUserassert: ({ state, commit }) => {
    if (state.currUserAsset !== null) {
      return
    }
    return api.getUserAsset().then(function (res) {
      if (res.status === 200) {
        commit('SET_USERASSERT', res.data)
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
  },
  getUserassert: state => {
    return state.currUserAsset
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
