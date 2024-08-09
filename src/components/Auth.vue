<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>Login</h1>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="login" class="login-btn">Login</button>
      <button @click="signup" class="signup-btn">Sign Up</button>
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

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.auth-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 360px;
  text-align: center;
}

h1 {
  color: #ff6f61;
  margin-bottom: 1rem;
  font-size: 2rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  border-color: #de1b60;
  outline: none;
}

button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.login-btn {
  background-color: #ff6f61;
}

.login-btn:hover {
  background-color: #e55d50;
}

.signup-btn {
  background-color: #de1b60;
}

.signup-btn:hover {
  background-color: #d51755;
}
</style>
