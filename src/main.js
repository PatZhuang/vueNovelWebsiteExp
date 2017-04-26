// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from '../node_modules/iview'
import '../node_modules/iview/dist/styles/iview.css'
import {Rate, Tag} from 'element-ui'

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(Rate)
Vue.use(Tag)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
})
