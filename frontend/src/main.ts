import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import Home from './views/Home.vue'
import ProductDetail from './views/ProductDetail.vue'
import Profile from './views/Profile.vue'
import AddListing from './views/AddListing.vue'
import EditListing from './views/EditListing.vue'
import EditProfile from './views/EditProfile.vue'

const routes = [
  {
    path: "/",
    component: Home,
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
  {
    path: '/edit-profile/:userId',
    component: EditProfile,
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

