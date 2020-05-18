import Vue from 'vue'
import VueFormulate from '../src/Formulate'
import FormulateSpecimens from './FormulateSpecimens.vue'

Vue.config.productionTip = false

Vue.use(VueFormulate)

new Vue({
  render: h => h(FormulateSpecimens)
}).$mount('#app')
