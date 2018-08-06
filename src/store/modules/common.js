import * as api from '../../service/getData'
const state = {
  minHeight: '500px',
  exchangeList: [],
  coinList: {}
}

const mutations = {
  SET_MINHEIGHT: (state, data) => {
    state.minHeight = data
  },
  SET_EXCHANGELIST: (state, data) => {
    state.exchangeList = data
  },
  SET_COINLIST: (state, data) => {
    state.coinList = data
  }
}

const actions = {
  setMinHeight: ({ state, commit }, minHeight) => {
    commit('SET_MINHEIGHT', minHeight)
  },
  setCoinList: ({ state, commit }, data) => {
    commit('SET_COINLIST', data)
  },
  getExchangelist: ({ state, commit }) => {
    return api.getExchangeList().then(function (res) {
      if (res.status === 200) {
        commit('SET_EXCHANGELIST', res.data)
      }
    })
  },
  getCoinList: ({ state, commit }) => {
    return api.getAllSymobl().then(function (res) {
      if (res.status === 200) {
        commit('SET_COINLIST', res.data)
      }
    })
  }
}

const getters = {
  getMinHeight: state => {
    return state.minHeight
  },
  getExchangeList: state => {
    return state.exchangeList
  },
  getCoinList: state => {
    return state.coinList
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
