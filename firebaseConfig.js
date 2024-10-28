// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBixIhyhA-dm_900QeBTk6odCJTMsm5YFY",
    authDomain: "fjdmapp.firebaseapp.com",
    projectId: "fjdmapp",
    storageBucket: "fjdmapp.appspot.com",
    messagingSenderId: "124845215075",
    appId: "1:124845215075:web:f4f3e5e72e75e603c69756"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };