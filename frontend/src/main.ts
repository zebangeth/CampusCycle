import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import UserLogin from './views/UserLogin.vue'
import Home from './views/Home.vue'
import UserRegister from './views/UserRegister.vue'
import ProductDetail from './views/ProductDetail.vue'
import Profile from './views/Profile.vue'
import AddListing from './views/AddListing.vue'
import EditListing from './views/EditListing.vue'

const routes = [
  {
    path: "/login",
    component: UserLogin,
  },
  {
    path: "/",
    component: Home,
  },
  {
    path: "/register",
    component: UserRegister,
  },
  {
    path: '/product/:productId',
    component: ProductDetail,
  },
  {
    path: '/profile/:userId',
    component: Profile,
  },
  {
    path: '/edit-listing/:listingId',
    component: EditListing,
  },
  {
    path: '/add-listing/:userId',
    component: AddListing,
  },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

createApp(App)
	.use(BootstrapVue as any)
	.use(BootstrapVueIcons as any)
	.use(router)
	.mount('#app')

