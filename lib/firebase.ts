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

export const fromMillis = firebase.firestore.Timestamp.fromMillis;

export async function getUserWithUsername(username: string) {
    const usersRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
};

/**`
 * convert a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJson(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis()
    }
};


export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const firestore = firebase.firestore();
export const storage = firebase.storage();
// This API tells us the uploading progress
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;