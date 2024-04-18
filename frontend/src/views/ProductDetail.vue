<template>
<b-container fluid class="product-detail py-4" v-if="product">
  <b-row>
    <b-col md="12" lg="6" class="mb-4">
      <b-carousel v-if="product.images && product.images.length" controls indicators :interval="3000" img-width="100%" class="shadow-sm mb-3">
        <b-carousel-slide v-for="(image, index) in product.images" :key="index" :img-src="image" class="carousel-slide"/>
      </b-carousel>
    </b-col>
    <b-col md="12" lg="6">
      <div class="product-info p-3 shadow-sm bg-white">
        <h1>{{ product.title }}</h1>
        <h2 class="text-primary">${{ product.price }}</h2> 
        <b-badge variant="success" class="mb-2">{{ product.condition }}</b-badge> 
        <p class="text-muted">{{ product.description }}</p> 
        <div class="seller-info mt-4 bg-light p-3 border rounded">
          <div class="d-flex align-items-center mb-2">
            <b-avatar :src="product.seller.photo" class="mr-2" />
            <strong>{{ product.seller.name }}</strong>
          </div>
          <p class="mb-0">Location: {{ product.location }}</p>
          <p>Items Sold: {{ product.seller.itemsSold }}</p>
        </div>
        <b-button variant="primary" @click="showModal = true" class="mt-3">Contact Seller</b-button>
      </div>
    </b-col>
  </b-row>

  <b-modal v-model="showModal" title="Contact Seller" hide-footer centered> 
    <div class="d-flex align-items-center mb-2">
      <b-avatar :src="product.seller.photo" class="mb-3" size="lg"/>
      <h6 class="ml-2">{{ product.seller.name }}</h6> 
    </div>
    <p>Preferred contact: {{ product.seller.preferredContact }}</p>
    <div v-for="(value, key) in sellerContactInfo" :key="key" class="mb-2">
      <strong>{{ key }}:</strong> {{ value }}
      <b-button size="sm" variant="outline-success" @click="copyToClipboard(value)">Copy</b-button>
    </div>
  </b-modal>
</b-container>
</template>  
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Product } from '../data';

const route = useRoute();
const product = ref<Product | null>(null);
const showModal = ref(false);
const sellerContactInfo = ref(null);

const fetchProductDetails = async () => {
  try {
    const response = await fetch(`/api/listings/${route.params.productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    const data = await response.json();
  product.value = data as Product;
  if (product.value) {
    await fetchSellerContactInfo(product.value.seller._id);
  }
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Error fetching product details');
  }
};

const fetchSellerContactInfo = async (sellerId: string) => {
  try {
    const response = await fetch(`/api/contact/${sellerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch seller contact info');
    }
    sellerContactInfo.value = await response.json();
  } catch (error) {
    console.error('Fetch seller contact info error:', error);
  }
};
  

const copyToClipboard = (value: string | number) => {
    const text = String(value);
  navigator.clipboard.writeText(text)
    .then(() => alert(`${text} copied to clipboard!`))
    .catch((error) => console.error('Copy failed', error));
};
  
onMounted(fetchProductDetails);
</script>

<style scoped>
.product-detail {
  max-width: 1200px; 
  margin: auto; 
}

.carousel-slide {
  padding: 15px;
  background-color: #f8f9fa; 
  min-height: 300px;
}

.product-info, .seller-info {
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}
</style>
  