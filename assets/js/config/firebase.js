import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDsHO_ciz01YgLiOQMeahfcApGVrAJpzVw",
  authDomain: "glamm-fashion-dd870.firebaseapp.com",
  projectId: "glamm-fashion-dd870",
  storageBucket: "glamm-fashion-dd870.firebasestorage.app",
  messagingSenderId: "44898219768",
  appId: "1:44898219768:web:b29f903d5200075637ad0d",
  measurementId: "G-4XP22RZ0FS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);