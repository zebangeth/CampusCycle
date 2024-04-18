<template>
  <div class="home-page">

    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="/">Campus Cycle</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/api/users/login" v-if="!isLoggedIn">Log in</b-nav-item>
          
          <b-nav-item v-if="isLoggedIn && !isAdmin">
          <!-- <img :src="userPhoto" @click="goToUserProfile" class="profile-photo" alt="Profile" /> -->
          <img v-if="userPhoto" :src="userPhoto" @click="goToUserProfile" class="profile-photo" alt="Profile" />
          <!-- <b-icon v-else icon="person-circle" @click="goToUserProfile" class="profile-photo" style="font-size: 30px;"></b-icon> -->
          <svg v-else @click="goToUserProfile" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
          </b-nav-item>
          <b-nav-item v-if="isLoggedIn && isAdmin">Welcome, admin!</b-nav-item>
          <b-nav-item v-if="isLoggedIn" @click="logout">Log out</b-nav-item>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container class="search-container mt-3">
      <b-row>
        <b-col>
          <b-form-input
            size="lg"
            class="mb-3"
            placeholder="What are you looking for?"
            v-model="searchTerm"
            @keyup.enter="searchItems"
          ></b-form-input>
        </b-col>
      </b-row>
    </b-container>

    <b-container class="my-4">
      <b-row>
        <b-col>
          <h2 class="mb-3">Explore Categories</h2>
          <b-row>
            <b-col md="3" sm="6" class="mb-3" v-for="category in categories" :key="category._id">
              <b-button variant="outline-primary" block @click="filterByCategory(category.name)">
                {{ category.name }}
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>

    <b-container>
      <b-row>
        <b-col>
          <h2 class="mb-3">Featured Products</h2>
          <b-row>
            <b-col md="4" sm="6" class="mb-3" v-for="item in featuredItems" :key="item._id">
              <b-card @click="goToProductDetail(item._id)" style="cursor: pointer;">
                <b-card-img :src="item.images[0]" :alt="`${item.title} image`" top></b-card-img>
                <b-card-body>
                  <b-card-title>{{ item.title }}</b-card-title>
                  <b-card-text>${{ item.price }}</b-card-text>
                  <div v-if="isAdmin">
                      <div v-if="!item.featured">
                        <b-button variant="info" @click.stop="markAsFeatured(item._id)">Mark as Featured</b-button>
                      </div>
                      <b-button variant="danger" @click.stop="deleteItem(item._id)">Delete</b-button>
                  </div>

                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Category {
  _id: string;
  name: string;
}

interface Item {
  _id: string;
  title: string;
  price: number;
  images: string[];
  featured: boolean
}

const categories = ref<Category[]>([]);
const featuredItems = ref<Item[]>([]);
const searchTerm = ref('');

const isLoggedIn = ref(false);
const isAdmin = ref(false);
const userId = ref('');
const userPhoto = ref('');

const checkLoginStatus = async () => {
  try {
    const response = await fetch('/api/admin/status');
    if (!response.ok) throw new Error('Failed to fetch login status');
    const data = await response.json();
    isLoggedIn.value = data.isLoggedIn;
    isAdmin.value = data.isAdmin;
    userId.value = data.userId;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const markAsFeatured = async (itemId: any) => {
  if (!confirm('Are you sure you want to mark this item as featured?')) return;

  try {
    const response = await fetch(`/api/admin/listings/${itemId}/featured`, {
    method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to mark as featured');
    alert('Item marked as featured successfully'); 
    await fetchFeaturedItems();
  } catch (error) {
    console.error('Error marking item as featured:', error);
    alert('Failed to mark as featured');
  }
};

const deleteItem = async (itemId: any) => {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    const response = await fetch(`/api/admin/listings/${itemId}/force`, {
    method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
    alert('Item deleted successfully'); 
    await fetchFeaturedItems();
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Failed to delete item');
  }
};

const logout = async () => {
  try {
    const response = await fetch('/api/users/logout', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to logout');
    isLoggedIn.value = false;
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
    alert('Logout failed');
  }
};


const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    categories.value = await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const fetchFeaturedItems = async () => {
  try {
    const response = await fetch('/api/listings/featured');
    if (!response.ok) throw new Error('Failed to fetch featured items');
    featuredItems.value = await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const filterByCategory = async (categoryName: string) => {
  try {
    const response = await fetch(`/api/listings?category=${categoryName}&sold=false`);
    if (!response.ok) throw new Error('Failed to filter by category');
    featuredItems.value = await response.json();
  } catch (error) {
    console.error('Filter error:', error);
  }
};

const searchItems = async () => {
  try {
    const response = await fetch(`/api/search?q=${searchTerm.value}`);
    if (!response.ok) throw new Error('Failed to search items');
    featuredItems.value = await response.json();
  } catch (error) {
    console.error('Search error:', error);
  }
};

const goToProductDetail = (productId: string) => {
  router.push(`/product/${productId}`);
};

async function fetchUserData(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user data');
    const data = await response.json();
    userPhoto.value = data.photo;
  } catch (error) {
    console.error('Fetch user data error:', error);
  }
}

function goToUserProfile() {
  if (userId.value) {
    router.push(`/profile/${userId.value}`);
  }
}

onMounted(async () => {
  await fetchCategories();
  await fetchFeaturedItems();
  await checkLoginStatus(); 
  if (isLoggedIn.value && !isAdmin.value) {
    await fetchUserData(userId.value);
  }
});
</script>

<style scoped>
.profile-photo {
  width: 30px; 
  height: 30px; 
  border-radius: 50%;
  object-fit: cover; 
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
