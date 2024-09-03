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

<script>
import "./assets/css/reset.css";
import "./assets/css/common.css";
export default {};
</script>

<style>
/* 전체 레이아웃 스타일링 */
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

@keyframes waveBackground {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 헤더 스타일링 */
header {
  background: linear-gradient(
    45deg,
    #ff9a8b,
    #ff6f61,
    #de1b60,
    #c53364,
    #ff9a8b
  );
  background-size: 200% 200%; /* 애니메이션 효과를 위해 배경 크기를 확대 */
  animation: waveBackground 5s ease infinite;
  padding: 20px;
  color: white;
  text-align: center;
}

@keyframes waveText {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-family: "Arial", sans-serif; /* 헤더의 폰트 스타일 조정 */
  background: linear-gradient(45deg, #ffffff, #ffb7b2, #ff6f61, #bc002d);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: waveText 4s ease infinite;
}

/* 메인 콘텐츠 스타일링 */
main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0; /* #f4f4f4보다 약간 어두운 색상 */
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 10px 10px;
}

/* 푸터 스타일링 */
footer {
  background-color: #ff6f61; /* 메인 색상 적용 */
  padding: 10px;
  color: white;
  text-align: center;
  position: relative;
  width: 100%;
  bottom: 0;
}

footer p {
  margin: 0;
  font-size: 0.875rem; /* 푸터의 폰트 크기 조정 */
}
</style>
