import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import personal from '../pages/personalPage.vue'
import allBooks from '../pages/allBooksPage.vue'
import bookDetail from '../pages/bookDetailPage.vue'
import chapter from '../pages/chapterPage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/category',
      component: allBooks
    },
    {
      path: '/personal',
      component: personal
    }, 
    {
      path: '/book/:title',
      component: bookDetail
    },
    {
      path: '/book/:title/:chapter',
      component: chapter
    },
    
  ]
})
