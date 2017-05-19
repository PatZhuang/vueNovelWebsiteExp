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
      name: 'index',
      component: index
    },
    {
      path: '/category',
      name: 'category',
      component: allBooks
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal
    }, 
    {
      path: '/book/:title',
      name: 'book',
      component: bookDetail
    },
    {
      path: '/book/:title/:chapter',
      name: 'chapter',
      component: chapter
    },
    
  ]
})
