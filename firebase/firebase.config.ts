import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCADHiUv_wT7FnVOLfv2Iensl3y9Ojwl0A",
  authDomain: "recipehub-142f4.firebaseapp.com",
  projectId: "recipehub-142f4",
  storageBucket: "recipehub-142f4.firebasestorage.app",
  messagingSenderId: "530282459582",
  appId: "1:530282459582:web:ff5658899213558a6789ef",
  measurementId: "G-KMZXE1BHXE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };