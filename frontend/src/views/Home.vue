<template>
  <div class="home-page">

    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="#">Campus Cycle</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/login" v-if="!isLoggedIn">Log in</b-nav-item>
          <b-nav-item href="/register" v-if="!isLoggedIn">Sign up</b-nav-item>

          <b-nav-item href="/profile" v-if="isLoggedIn"><b-icon-person-circle></b-icon-person-circle></b-nav-item>
          <b-nav-item v-if="isLoggedIn" @click="logout">Log out</b-nav-item>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container class="search-container">
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
              <b-card>
                <b-card-img :src="item.images[0]" :alt="`${item.title} image`" top></b-card-img>
                <b-card-body>
                  <b-card-title>{{ item.title }}</b-card-title>
                  <b-card-text>${{ item.price }}</b-card-text>
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
}

const categories = ref<Category[]>([]);
const featuredItems = ref<Item[]>([]);
const searchTerm = ref('');

const isLoggedIn = ref(false);

const checkLoginStatus = async () => {
  try {
    const response = await fetch('/api/users/status');
    if (!response.ok) throw new Error('Failed to fetch login status');
    const data = await response.json();
    isLoggedIn.value = data.isLoggedIn;
  } catch (error) {
    console.error('Fetch error:', error);
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
    const response = await fetch(`/api/listings?category=${categoryName}`);
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

onMounted(async () => {
  await fetchCategories();
  await fetchFeaturedItems();
  await checkLoginStatus(); 
});
</script>

<style scoped>

</style>
