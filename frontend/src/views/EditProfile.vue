<template>
  <b-container fluid>
    <b-row class="justify-content-md-center">
      <b-col md="8">
        <h1>Edit Profile</h1>
        <b-form @submit.prevent="submitForm">
          <b-form-group id="input-group-name" label="Name" label-for="input-name">
            <b-form-input
              id="input-name"
              v-model="form.name"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-email" label="Email" label-for="input-email">
            <b-form-input
              id="input-email"
              v-model="form.email"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-tagline" label="Tagline" label-for="input-tagline">
            <b-form-input id="input-tagline" v-model="form.tagline"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-phone" label="Phone Number" label-for="input-phone">
            <b-form-input id="input-phone" v-model="form.contactInfo.phoneNumber"></b-form-input>
          </b-form-group>
          <!-- Repeat similar blocks for other contact info fields like WhatsApp, WeChat, etc. -->

          <!-- Preferred Contact Method Select -->
          <b-form-group label="Preferred Contact Method">
            <b-form-select v-model="form.preferredContact" :options="contactOptions"></b-form-select>
          </b-form-group>

          <div class="image-preview" v-if="form.photo">
            <img :src="form.photo" alt="Profile photo" class="img-thumbnail">
          </div>

          <b-form-group label="Upload New Profile Photo">
            <b-form-file
              @change="handleFileChange"
              accept="image/*"
              placeholder="Choose file..."
            ></b-form-file>
          </b-form-group>

          <div class="submit-button-container">
            <b-button type="submit" variant="primary">Save</b-button>
          </div>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { User } from '../data';

const route = useRoute();
const router = useRouter();

const form = ref<User>({
  _id: '', 
  name: '',
  email: '',
  password: '', 
  photo: '',
  tagline: '',
  joinedDate: new Date(),
  itemsSold: 0,
  activeListings: 0,
  contactInfo: { 
    email: '',
    phoneNumber: '',
    whatsapp: '',
    wechat: '',
    telegram: '',
    snapchat: '',
    messenger: '',
  },
  preferredContact: ''
});

const contactOptions = [
  { value: 'email', text: 'Email' },
  { value: 'phoneNumber', text: 'Phone Number' },
  { value: 'whatsapp', text: 'WhatsApp' },
  { value: 'wechat', text: 'WeChat' },
  // Add other options as needed
];

const userId = route.params.userId; 

onMounted(async () => {
  if (Array.isArray(userId)) {
        console.error('Unexpected array of user IDs');
        return;
    }
    await fetchUserProfile(userId);
  });

async function fetchUserProfile(userId: string) {
    try {
      const response = await fetch(`/api/users/${userId}`);
      // form.value = await response.json();
      const userData = await response.json();
      form.value = {
        ...form.value,
        ...userData,
        contactInfo: userData.contactInfo 
      };
      console.log(form.value.contactInfo);

    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }
  

async function submitForm() {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    alert('Profile updated successfully');
    router.push(`/profile/${userId}`);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}

function handleFileChange(event: { target: { files: FileList }; }) {
  const file = event.target.files[0];
  if (!file) return;

  convertToBase64(file).then((base64: string) => {
    form.value.photo = base64;
  });
}

function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
</script>

<style scoped>
.image-preview img {
  height: 200px;
  width: auto;
  border-radius: 4px;
}

.submit-button-container {
  text-align: center;
}
</style>
