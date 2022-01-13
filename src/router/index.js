import Vue from 'vue'
import Router from 'vue-router'

import MultiAvatar from '@/views/multiavatar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MultiAvatar',
      component: MultiAvatar
    }
  ]
})
