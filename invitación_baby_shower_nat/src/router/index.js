import { createRouter, createWebHistory } from 'vue-router'
import InvitationView from '../views/InvitationView.vue'
import AdminView from '../views/AdminView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: InvitationView },
    { path: '/admin', component: AdminView },
  ],
})
