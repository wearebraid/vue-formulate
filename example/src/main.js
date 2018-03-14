import Vue from 'vue'
import App from './App.vue'
import store from '../store'
import formulate from 'vue-formulate'

Vue.use(formulate)

window.example = new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
