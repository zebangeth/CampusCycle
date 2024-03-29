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
              <b-form-group label="Enter your username / email:" label-for="input-username">
                <b-form-input
                  id="input-username"
                  v-model="loginData.username"
                  required
                  placeholder="username / email"
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
              <b-link href="#">Forgot your password?</b-link>
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
import { LoginData } from '../data';

const loginData = ref<LoginData>({
  username: '',
  password: '',
});

const onSubmit = () => {
  // Perform login action
};

const register = () => {
  // Redirect to register page
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

