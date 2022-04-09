// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCG9GSLrzoGnO0Qgw-OAvSHICBvevoIOCg',
  authDomain: 'g-classroom-0410.firebaseapp.com',
  projectId: 'g-classroom-0410',
  storageBucket: 'g-classroom-0410.appspot.com',
  messagingSenderId: '696878984307',
  appId: '1:696878984307:web:b0a2dd190984a63cc4ce06',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
export const db = getFirestore();
