<template>
  <div>
    <div
      v-if="isPopupVisible ? true : false"
      @click="closePopup"
      class="popup-overlay"
    >
      <div class="popup-content">
        <h2 class="popup-title">Create New Chat</h2>
        <p>This is a simple layer popup component.</p>
        <button @click="closePopup" class="close-popup-button">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateChat",
  props: {
    isPopupVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  mounted() {},
  data() {
    return {};
  },
  methods: {
    closePopup() {
      console.log("???");
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* 버튼 스타일링 */
.open-popup-button {
  background-color: #ff6f61;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.open-popup-button:hover {
  background-color: #e05b50;
}

/* 팝업 오버레이 스타일링 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 팝업 컨텐츠 스타일링 */
.popup-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.popup-title {
  font-size: 1.5rem;
  color: #de1b60;
  margin-bottom: 15px;
}

/* 닫기 버튼 스타일링 */
.close-popup-button {
  background-color: #de1b60;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.close-popup-button:hover {
  background-color: #c53364;
}
</style>
