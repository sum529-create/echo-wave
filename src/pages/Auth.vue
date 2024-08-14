<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>Login</h1>
      <input
        v-model="email"
        @keyup.enter="login"
        type="email"
        placeholder="Email"
      />
      <input
        v-model="password"
        @keyup.enter="login"
        type="password"
        placeholder="Password"
      />
      <button @click="login" class="btn_coral mb10">Login</button>
      <button @click="moveToPage('/sign-up')" class="btn_pink">Sign Up</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../assets/css/auth.css";

export default {
  name: "Auth",
  setup() {
    const email = ref("");
    const password = ref("");

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        window.location.href = "/list";
      } catch (error) {
        alert(error.message);
      }
    };

    return { email, password, login };
  },
};
</script>
