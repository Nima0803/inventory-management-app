// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCU6XRy-7qh-87-4glmfkPfM8rH2Hg_ds",
  authDomain: "inventory-management-app-4161d.firebaseapp.com",
  projectId: "inventory-management-app-4161d",
  storageBucket: "inventory-management-app-4161d.appspot.com",
  messagingSenderId: "489081561273",
  appId: "1:489081561273:web:9d232b73704444bc1a3b68",
  measurementId: "G-ZKKE0Y24X3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { firestore };