<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>Login</h1>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="login" class="btn_coral">Login</button>
      <button @click="moveToPage('/sign-up')" class="btn_pink">Sign Up</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "../assets/css/auth.css";

export default {
  name: "Auth",
  setup() {
    const email = ref("");
    const password = ref("");

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        alert("Logged in successfully");
      } catch (error) {
        alert(error.message);
      }
    };

    const signup = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        alert("Account created successfully");
      } catch (error) {
        alert(error.message);
      }
    };

    return { email, password, login, signup };
  },
};
</script>
