import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAJQ5wGb6uf9uN6TPxwlAeW0OhRf3cXdFY",
    authDomain: "learning01-e7a92.firebaseapp.com",
    projectId: "learning01-e7a92",
    storageBucket: "learning01-e7a92.appspot.com",
    messagingSenderId: "393767536872",
    appId: "1:393767536872:web:9bcfdca22cde6b3d2ce15d",
    measurementId: "G-PMV4RVZGKD"
};

if (!firebase.apps.length) {
    const app = firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
