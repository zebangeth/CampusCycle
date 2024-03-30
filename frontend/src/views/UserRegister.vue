<template>
    <div class="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div class="text-center mb-4">
            <h1 class="mb-0">CampusCycle</h1>
            <p class="lead">Buy and sell dorm</p>
        </div>

        <b-alert variant="danger" v-if="errorMessage" class="mt-3">{{ errorMessage }}</b-alert>

      <b-card class="user-register-container shadow" title="Register">
        <b-form @submit.prevent="onSubmit">
          <b-form-group label="Name:" label-for="input-name">
            <b-form-input
              id="input-name"
              v-model="registerData.name"
              required
              placeholder="Enter your name"
            ></b-form-input>
          </b-form-group>
  
          <b-form-group label="Email:" label-for="input-email">
            <b-form-input
              id="input-email"
              type="email"
              v-model="registerData.email"
              required
              placeholder="Enter your email"
            ></b-form-input>
          </b-form-group>
  
          <b-form-group label="Password:" label-for="input-password">
            <b-form-input
              id="input-password"
              type="password"
              v-model="registerData.password"
              required
              placeholder="Enter your password"
            ></b-form-input>
          </b-form-group>
  
          <b-button type="submit" variant="primary" class="mt-3">Register</b-button>
        </b-form>
      </b-card>
    </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const registerData = ref<RegisterData>({
  name: '',
  email: '',
  password: '',
});

const errorMessage = ref('');
const router = useRouter();

const onSubmit = async () => {
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData.value),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
    }

    router.push('/login');
  } catch (error) {
    errorMessage.value = error.message; 
  }
};
</script>

<style scoped>
.user-register-container {
  max-width: 500px;
  width: 100%;
  padding: 2rem;
}

.min-vh-100 {
  min-height: 100vh;
}
</style>
