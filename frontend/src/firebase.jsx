// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
 

  apiKey: "AIzaSyBYGXndGQVtALhlDGUOOnAUFS6tTRfmk1A",
  authDomain: "finvista-auth.firebaseapp.com",
  projectId: "finvista-auth",
  storageBucket: "finvista-auth.firebasestorage.app",
  messagingSenderId: "243120064410",
  appId: "1:243120064410:web:c7e8e7c4a906b4d37cdc23"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
