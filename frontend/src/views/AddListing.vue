<template>
    <b-container fluid>
      <b-row class="justify-content-md-center">
        <b-col md="8">
          <h1>Add New Listing</h1>
          <b-form @submit.prevent="submitForm">
            <b-form-group id="input-group-title" label="Title" label-for="input-title">
              <b-form-input
                id="input-title"
                v-model="form.title"
                required
                placeholder="Enter the title of your product"
              ></b-form-input>
            </b-form-group>
  
            <b-form-group id="input-group-description" label="Description" label-for="input-description">
              <b-form-textarea
                id="input-description"
                v-model="form.description"
                required
                placeholder="Provide a detailed description of your product"
                rows="3"
              ></b-form-textarea>
            </b-form-group>
  
            <b-form-group id="input-group-category" label="Category" label-for="input-category">
              <b-form-select
                id="input-category"
                v-model="form.category"
                :options="categories"
                required
              ></b-form-select>
            </b-form-group>
  
            <b-form-group label="Price" label-for="input-price">
              <b-form-input
                id="input-price"
                v-model="form.price"
                type="number"
                required
                placeholder="Enter the price"
              ></b-form-input>
            </b-form-group>
  
            <b-form-group label="Condition" label-for="input-condition">
              <b-form-select
                id="input-condition"
                v-model="form.condition"
                :options="conditions"
                required
              ></b-form-select>
            </b-form-group>
  
            <b-form-group label="Location" label-for="input-location">
              <b-form-input
                id="input-location"
                v-model="form.location"
                required
                placeholder="Enter the location of your product"
              ></b-form-input>
            </b-form-group>
  
            <b-form-group label="Upload Product Pictures">
            <b-form-file
              @change="handleFilesChange"
              multiple
              accept="image/*"
              placeholder="Choose files or drop them here..."
              drop-placeholder="Drop files here..."
            ></b-form-file>
            </b-form-group>
            <div class="image-previews-container">
            <div class="image-preview" v-for="(imageSrc, index) in form.images" :key="index">
              <img :src="imageSrc" alt="Image preview" class="img-thumbnail">
              <b-icon-x class="close-icon" @click="removeImage(index)"></b-icon-x>
            </div>
          </div>

          <div class="submit-button-container">
            <b-button type="submit" variant="primary">Submit</b-button>
          </div>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Category } from '../data';
  
  const route = useRoute();
  const router = useRouter();
  const form = ref({
    title: '',
    description: '',
    category: null,
    price: null,
    condition: null,
    location: null,
    images: [] as string[]
  });
  const categories = ref<Category[]>([]);
  const conditions = ['New', 'Like New', 'Used'];
  
  onMounted(async () => {
    await fetchCategories();
  });
  
  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const fetchedCategories = await response.json();
      categories.value = fetchedCategories.map((category: { name: any; }) => ({
        value: category.name,
        text: category.name
      }));
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  async function submitForm() {
    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value)
    });
    if (response.ok) {
        const userId = route.params.userId;
        router.push(`/profile/${userId}`);
    } else {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData);
    }
  }

function handleFilesChange(event: { target: { files: any; }; }) {
  const files = event.target.files;
  if (!files.length) return;

  Array.from(files).forEach(file => {
    convertToBase64(file).then((base64: any) => {
      form.value.images = [...form.value.images, base64];
    });
  });
}


function removeImage(index: number) {
  form.value.images.splice(index, 1);
}

function convertToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
</script>
  
<style scoped>
.image-previews-container {
  margin-bottom: 16px; 
}

.image-preview {
  position: relative;
  display: inline-flex;
  margin: 8px;
}

.image-preview img {
  height: 200px;
  width: auto;
  border-radius: 4px;
}

.close-icon {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  color: #000;
  background-color: #fff;
  border-radius: 50%;
}

.submit-button-container {
  text-align: center;
}
</style>
  