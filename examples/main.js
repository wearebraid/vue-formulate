import Vue from 'vue'
import VueFormulate from '../src/Formulate'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueFormulate)

new Vue({
  render: h => h(App)
}).$mount('#app')
