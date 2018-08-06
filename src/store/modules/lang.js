const state = {
  lang: null
}

const mutations = {
  SET_LANG: (state, data) => {
    state.lang = data
  }
}

const actions = {
  setLang: ({ state, commit }, str) => {
    let data = null
    if (str === 'en') {
      data = require('static/lang/en')
    } else {
      data = require('static/lang/cn')
    }
    commit('SET_LANG', data)
  }
}

const getters = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
