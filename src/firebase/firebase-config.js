// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyAPEtqtKMqqNg1LqtSOhe0OQbpP9t_KjH4',
//   authDomain: 'meetadore-5efca.firebaseapp.com',
//   projectId: 'meetadore-5efca',
//   storageBucket: 'meetadore-5efca.appspot.com',
//   messagingSenderId: '351913683956',
//   appId: '1:351913683956:web:aba524b93ed19192a1a7a1',
// };

// Kirti's Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDEj22T47JT7kU9TrG5KaDXU6vzE1OGnVU',
  authDomain: 'edulearn-vimeet.firebaseapp.com',
  projectId: 'edulearn-vimeet',
  storageBucket: 'edulearn-vimeet.appspot.com',
  messagingSenderId: '998779732252',
  appId: '1:998779732252:web:9de9296eed17943a467ad9',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
export const db = getFirestore();
