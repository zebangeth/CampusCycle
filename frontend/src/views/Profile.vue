<template>
    <b-container fluid>
      <!-- <b-icon icon="arrow-down" class="back-arrow mb-2" @click="goHome" aria-label="Return to home"></b-icon>-->

      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left back-arrow" @click="goHome" aria-label="Return to home" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
      </svg>

      <b-row class="justify-content-md-center">
        <b-col md="8">
          <div class="user-profile">

          <b-card class="text-center user-details-card mb-4">
            <b-row>
              <b-col cols="12" class="mb-3">
                <b-avatar :src="user?.photo" size="6rem" alt="Profile photo" variant="light"></b-avatar>
              </b-col>
              <b-col cols="12">
                <h2>{{ user?.name }}</h2>
                <h3>{{ user?.tagline }}</h3>
              </b-col>
            </b-row>
            <b-row class="user-stats">
              <b-col>
                <div class="stat-item">
                  <h4>{{ formatDate(user?.joinedDate) }}</h4>
                  <p>Joined On</p>
                </div>
              </b-col>
              <b-col>
                <div class="stat-item">
                  <h4>{{ user?.itemsSold }}</h4>
                  <p>Total Items Sold</p>
                </div>
              </b-col>
              <b-col>
                <div class="stat-item">
                  <h4>{{ user?.activeListings }}</h4>
                  <p>Active Listings</p>
                </div>
              </b-col>
            </b-row>
          </b-card>

            <b-button variant="primary" block @click="addListing">Add New Listing</b-button>
  
            <b-row>
            <b-col v-for="listing in listings" :key="listing._id" md="6" class="mb-4">
            <b-card>
                <div class="card-overlay" v-if="listing.sold"></div>
                <b-card-img :src="listing.images[0]" :alt="listing.title" top></b-card-img>
                <b-card-body>
                <b-card-title>{{ listing.title }}</b-card-title>
                <b-card-text>
                    {{ listing.description }}
                </b-card-text>
                <b-card-text v-if="!listing.sold">
                    <b-button variant="outline-primary" @click="editListing(listing._id)">Edit</b-button>
                    <b-button variant="outline-danger" @click="confirmMarkAsSold(listing._id)">Mark as Sold</b-button>
                </b-card-text>
                </b-card-body>
                <b-card-footer>
                ${{ listing.price }}
                </b-card-footer>
            </b-card>
            </b-col>
        </b-row>

          </div>
        </b-col>
      </b-row>
    </b-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Product, User } from '../data';
  
  const route = useRoute();
  const router = useRouter();
  const user = ref<User>();
  const listings = ref<Product[]>([]);
  
  onMounted(async () => {
    const userId = route.params.userId
    if (Array.isArray(userId)) {
        console.error('Unexpected array of user IDs');
        return;
    }
    await fetchUserProfile(userId);
    await fetchUserListings(userId);
  });
  
  async function fetchUserProfile(userId: string) {
    try {
      const response = await fetch(`/api/users/${userId}`);
      user.value = await response.json();
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }
  
  async function fetchUserListings(userId: string) {
    try {
      const response = await fetch(`/api/listings?seller=${userId}`);
      listings.value = await response.json();
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  }
  
  async function editListing(listingId: string) {
    router.push(`/edit-listing/${listingId}`);
  }

  async function confirmMarkAsSold(listingId: string) {
  if (window.confirm('Are you sure you want to mark this item as sold?')) {
    await markAsSold(listingId);
    const userId = route.params.userId;
    if (Array.isArray(userId)) {
        console.error('Unexpected array of user IDs');
        return;
    }
    await fetchUserProfile(userId);
  }
}
  async function markAsSold(listingId: string) {
    try {
    const response = await fetch(`/api/listings/${listingId}/sold`, { method: 'PUT' });
    if (!response.ok) {
      throw new Error('Failed to update listing status');
    }
    const updatedListing = await response.json();
    
    const index = listings.value.findIndex(listing => listing._id === listingId);
    if (index !== -1) {
      listings.value[index] = updatedListing;
    }
    } catch (error) {
      console.error('Failed to mark listing as sold:', error);
    }
  }

  function formatDate(dateString?: Date): string {
  if (dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  }
  return ''; 
}

async function addListing() {
  const userId = route.params.userId;
  router.push(`/add-listing/${userId}`);
}

function goHome() {
  router.push('/');
}

</script>

<style scoped>
.user-profile {
  margin-top: 20px;
}
.user-details-card {
  border: none;
}
.stat-item h4 {
  font-size: 1.25rem;
  font-weight: bold;
}
.stat-item p {
  font-size: 0.85rem;
  color: #6c757d; 
}
.user-stats {
  padding-top: 1rem;
  border-top: 1px solid #ccc; 
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(115, 114, 114, 0.335); 
  z-index: 1;
}

.back-arrow {
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 1000;
}
</style>
  