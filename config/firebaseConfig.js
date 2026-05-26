// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFbsV26R5zP65oRolerSbs8EaGeOL59HM",
  authDomain: "interior-ai-f03ac.firebaseapp.com",
  projectId: "interior-ai-f03ac",
  storageBucket: "interior-ai-f03ac.firebasestorage.app",
  messagingSenderId: "230259599960",
  appId: "1:230259599960:web:1bc651d30b49460a82b82d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Storage 연결
export const storage = getStorage(app);