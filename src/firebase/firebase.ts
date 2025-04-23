// firebase/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDIFsTVb6GpShWzAc9Vm5-Pmw2an2Or7FY',
  authDomain: 'book-management-system-ea4e5.firebaseapp.com',
  projectId: 'book-management-system-ea4e5',
  storageBucket: 'book-management-system-ea4e5.firebasestorage.app',
  messagingSenderId: '204058579374',
  appId: '1:204058579374:web:0cf9b6f2470820251bf83f'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const firestoreDB = getFirestore(app)
