import Vue from 'vue'
import Router from 'vue-router'
import Tasks from '@/views/Tasks'
import NewTask from '@/components/NewTask'
import EditTask from '@/components/EditTask'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Tasks',
      component: Tasks
    },
    {
      path: '/tasks/new',
      name: 'NewTask',
      component: NewTask
    },
    {
      path: '/tasks/:id',
      name: 'EditTask',
      component: EditTask
    }
  ]
})
