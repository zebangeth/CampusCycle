<template>
  <div class="d-flex flex-column align-items-center justify-content-center min-vh-100">
    <div class="text-center mb-4">
      <h1 class="mb-0">CampusCycle</h1>
      <p class="lead">Buy and sell dorm</p>
    </div>

    <b-card class="user-login-container shadow">
      <b-container>
        <b-row>
          <b-col cols="12">
            <h2>Log in</h2>
            <b-form @submit.prevent="onSubmit">
              <b-form-group label="Enter your email:" label-for="input-email">
                <b-form-input
                  id="input-email"
                  type="email"
                  v-model="loginData.email"
                  required
                  placeholder="email"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Enter your password:" label-for="input-password">
                <b-form-input
                  type="password"
                  id="input-password"
                  v-model="loginData.password"
                  required
                  placeholder="************"
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary" class="w-100">Log in</b-button>
            </b-form>

            <div class="mt-3">
              <b-link @click.prevent="forgotPassword">Forgot your password?</b-link>
            </div>
            <hr>
            <b-button variant="outline-secondary" @click="register" class="w-100 mb-2">Register</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoginData } from '../data';

const loginData = ref<LoginData>({
  email: '',
  password: '',
});

const router = useRouter();

const onSubmit = async () => {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginData.value.email,
        password: loginData.value.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login Failed!');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    router.push('/');
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("An unknown error occurred while logging in!");
    }
  }
};

const register = () => {
  router.push('/register');
};

const forgotPassword = () => {
  window.alert('Please send your login information to support@campuscycle.com to retrieve your password.');
};

</script>

<style scoped>
.user-login-container {
  max-width: 500px;
  width: 100%;
  padding: 2rem;
}

.min-vh-100 {
  min-height: 100vh;
}
</style>

