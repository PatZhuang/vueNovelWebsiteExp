import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import favorite from '../pages/favorite.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: favorite
    }
  ]
})
