import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBo6NkNz3bZp2V4EsLM5HdewsWs7QeB_XI",
  authDomain: "echo-wave-f4948.firebaseapp.com",
  projectId: "echo-wave-f4948",
  storageBucket: "echo-wave-f4948.appspot.com",
  messagingSenderId: "723308863140",
  appId: "1:723308863140:web:977da965287f08d8255031",
  measurementId: "G-WW3R02LWEC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app)
