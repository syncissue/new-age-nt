import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Firebase configuration - These values are safe to be public for client-side apps
const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas", // This is a public API key
  authDomain: "dare-to-dare-app.firebaseapp.com",
  projectId: "dare-to-dare-app",
  storageBucket: "dare-to-dare-app.appspot.com",
  messagingSenderId: "256218418710",
  appId: "1:256218418710:web:3f7c78945c76589a12bbe7",
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Provide fallback functionality or graceful degradation
  db = null;
}

export { app, db };
