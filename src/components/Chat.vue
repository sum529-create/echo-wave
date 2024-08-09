<template>
  <div>
    <h1>Chat Room</h1>
    <div v-for="message in messages" :key="message.id">
      <strong>{{ message.user }}:</strong> {{ message.text }}
    </div>
    <input v-model="newMessage" placeholder="Type a message" />
    <button @click="sendMessage">Send</button>
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
