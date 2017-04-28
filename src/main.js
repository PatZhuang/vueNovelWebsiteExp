// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
<<<<<<< HEAD
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import {Rate, Carousel, CarouselItem} from 'element-ui'
=======
import iView from '../node_modules/iview'
import '../node_modules/iview/dist/styles/iview.css'
import ElementUI from 'element-ui'
>>>>>>> elementui

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
})
