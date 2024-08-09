<template>
  <div id="app">
    <header>
      <h1>EchoWave</h1>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; 2024 EchoWave. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import "./assets/css/reset.css";
</script>

<style>
/* 전체 레이아웃 스타일링 */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 헤더 스타일링 */
header {
  background: linear-gradient(45deg, #ff6f61, #de1b60); /* 그라데이션 색상 적용 */
  padding: 20px;
  color: white;
  text-align: center;
}

header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-family: 'Arial', sans-serif; /* 헤더의 폰트 스타일 조정 */
}

/* 메인 콘텐츠 스타일링 */
main {
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4; /* 부드러운 배경색 */
}

/* 푸터 스타일링 */
footer {
  background-color: #ff6f61; /* 메인 색상 적용 */
  padding: 10px;
  color: white;
  text-align: center;
  position: fixed;
  width: 100%;
  bottom: 0;
}

footer p {
  margin: 0;
  font-size: 0.875rem; /* 푸터의 폰트 크기 조정 */
}
</style>
