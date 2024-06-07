 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyDvgZcw0RrO6DC0MK74lz3ee2Qo0zPozsc",
   authDomain: "auxilium-420904.firebaseapp.com",
   projectId: "auxilium-420904",
   storageBucket: "auxilium-420904.appspot.com",
 
   messagingSenderId: "171739951644",
   appId: "1:171739951644:web:93f7816f80bfb55d5b65d9"
 };
 // Initialize Firebase
 
 const app = initializeApp(firebaseConfig);
 // Export firestore database
 // It will be imported into your react app whenever it is needed
 export const db = getFirestore(app);