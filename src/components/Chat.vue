<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>Chat Room</h1>
    </div>
    <div class="messages-container">
      <div v-for="message in messages" :key="message.id" class="message">
        <strong class="message-user">{{ message.user }}:</strong>
        {{ message.text }}
      </div>
    </div>
    <div class="message-input-container">
      <input v-model="newMessage" placeholder="Type a message" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default {
  name: "Chat",
  setup() {
    const newMessage = ref("");
    const messages = ref([]);

    onMounted(() => {
      const q = query(collection(db, "messages"), orderBy("createdAt"));
      onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      });
    });

    const sendMessage = async () => {
      if (newMessage.value.trim() === "") return;

      await addDoc(collection(db, "messages"), {
        text: newMessage.value,
        user: auth.currentUser.email,
        createdAt: new Date(),
      });

      newMessage.value = "";
    };

    return { newMessage, messages, sendMessage };
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
}

.chat-header {
  background-color: #ff6f61; /* 메인 색상 적용 */
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  margin-bottom: 20px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background: #fff;
  border: 1px solid #ddd;
}

.message-user {
  color: #de1b60; /* 강조 색상 적용 */
}

.message-input-container {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus {
  border-color: #de1b60; /* 포커스 시 강조 색상 적용 */
  outline: none;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #de1b60; /* 강조 색상 적용 */
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #c41857; /* 호버 시 색상 변경 */
}
</style>
