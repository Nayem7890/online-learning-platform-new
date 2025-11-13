
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyAE9t_t6-CzlEq82VWkLvD0laudJDBNp3A",
  authDomain: "online-learning-platform-b0b50.firebaseapp.com",
  projectId: "online-learning-platform-b0b50",
  storageBucket: "online-learning-platform-b0b50.firebasestorage.app",
  messagingSenderId: "54565586287",
  appId: "1:54565586287:web:98f8b67eaac393611b949a"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);