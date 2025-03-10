import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCsVoPlWkk2ZfZIWu9p8myJk4lK5kxKb9o",
    authDomain: "code-note-12873.firebaseapp.com",
    projectId: "code-note-12873",
    storageBucket: "code-note-12873.firebasestorage.app",
    messagingSenderId: "82280514936",
    appId: "1:82280514936:web:7cee5669fffdd07c74348d",
    measurementId: "G-N8KLS48J8C"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };