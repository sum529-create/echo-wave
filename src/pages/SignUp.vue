<template>
  <div class="auth-container">
    <form class="auth-form">
      <h1>Sign Up</h1>
      <input
        v-model="userId"
        type="text"
        required
        maxlength="15"
        minlength="2"
        placeholder="이름/닉네임"
        name="userId"
      />
      <input
        v-model="email"
        type="email"
        required
        placeholder="이메일 주소"
        name="email"
      />
      <input
        v-model="password"
        type="password"
        required
        placeholder="비밀번호"
        name="password"
      />
      <input
        v-model="birth"
        type="text"
        required
        placeholder="생년월일 8자리"
        name="birth"
      />
      <div class="gender-selector">
        <label
          class="gender-button"
          :class="{ selected: selectedGender === 'male' }"
        >
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            v-model="selectedGender"
          />
          <span class="button-text">Male</span>
        </label>

        <label
          class="gender-button"
          :class="{ selected: selectedGender === 'female' }"
        >
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            v-model="selectedGender"
          />
          <span class="button-text">Female</span>
        </label>

        <label
          class="gender-button"
          :class="{ selected: selectedGender === 'other' }"
        >
          <input
            type="radio"
            id="other"
            name="gender"
            value="other"
            v-model="selectedGender"
          />
          <span class="button-text">Other</span>
        </label>
      </div>
      <input type="submit" value="가입하기" class="btn_pink" />
    </form>
  </div>
</template>

<script>
import "../assets/css/auth.css";
export default {
  data() {
    return {
      selectedGender: "",
    };
  },
};
</script>

<style scoped>
.gender-selector {
  display: flex;
  gap: 10px;
}

.gender-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 40px;
  border: 2px solid #ff6f61;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #ff6f61;
  position: relative;
  transition: background-color 0.3s, color 0.3s;
}

.gender-button:hover {
  background-color: #ff6f61;
  color: #fff;
}

.gender-button.selected {
  background-color: #ff6f61;
  color: #fff;
}

.gender-button input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.gender-button .button-text {
  z-index: 1;
}
</style>
