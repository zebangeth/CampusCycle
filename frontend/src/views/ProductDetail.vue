 <template>
    <b-container fluid class="product-detail" v-if="product">
      <b-row>
        <b-col md="6">
          <b-carousel v-if="product.images && product.images.length" controls indicators img-width="100%">
            <b-carousel-slide v-for="(image, index) in product.images" :key="index" :img-src="image"/>
          </b-carousel>
        </b-col>
        <b-col md="6">
          <div class="product-info">
            <h1>{{ product.title }}</h1>
            <h2>${{ product.price }}</h2>
            <b-badge variant="info">{{ product.condition }}</b-badge>
            <p>{{ product.description }}</p>
            <div class="seller-info">

                <div class="d-flex align-items-center mb-2">
                    <b-avatar :src="product.seller.photo" class="mr-2" />
                    <strong>{{ product.seller.name }}</strong>
                </div>

                <div>
                    <p>Location: {{ product.location }}</p>
                    <p>Items Sold: {{ product.seller.itemsSold }}</p>
                </div>
            </div>
            <b-button variant="primary" @click="showModal = true">Contact Seller</b-button>
          </div>
        </b-col>
      </b-row>
  
      <b-modal v-model="showModal" title="Contact Seller" hide-footer>
        <div class="d-flex align-items-center mb-2">
            <b-avatar :src="product.seller.photo" class="mb-3" size="lg"/>
            <h6>{{ product.seller.name }}</h6>
        </div>

        <p>Preferred contact: {{ product.seller.preferredContact }}</p>
        <div v-for="(value, key) in sellerContactInfo" :key="key" class="mb-2">
          <strong>{{ key }}:</strong> {{ value }}
          <b-button size="sm" variant="outline-success" @click="copyToClipboard(value)">Copy</b-button>
        </div>
      </b-modal>
    </b-container>
  </template>  
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const product = ref(null);
  const showModal = ref(false);
  const sellerContactInfo = ref(null);
  
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`/api/listings/${route.params.productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      product.value = await response.json();
      await fetchSellerContactInfo(product.value.seller._id);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error fetching product details');
    }
  };

const fetchSellerContactInfo = async (sellerId) => {
  try {
    const response = await fetch(`/api/contact/${sellerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch seller contact info');
    }
    const data = await response.json();
    sellerContactInfo.value = JSON.parse(data);
    console.log(sellerContactInfo);
  } catch (error) {
    console.error('Fetch seller contact info error:', error);
  }
};
  

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => alert(`${text} copied to clipboard!`))
    .catch((error) => console.error('Copy failed', error));
};
  
onMounted(fetchProductDetails);
</script>

<style scoped>

</style>
  