import Vue from 'vue'
import Vuex from 'vuex'
import {formulateState, formulateGetters, formulateMutations} from 'vue-formulate'

Vue.use(Vuex)

const state = {
  ...formulateState()()
}

const getters = {
  ...formulateGetters()
}

const mutations = {
  ...formulateMutations()
}

const actions = {}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
