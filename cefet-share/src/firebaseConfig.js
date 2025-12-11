import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDnzBy8ZncrMl7w1HmqBQUFeZkxKoE1d-A",
  authDomain: "cefet-share.firebaseapp.com",
  projectId: "cefet-share",
  storageBucket: "cefet-share.firebasestorage.app",
  messagingSenderId: "219217560622",
  appId: "1:219217560622:web:723e7b424120777cc94bbf"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();