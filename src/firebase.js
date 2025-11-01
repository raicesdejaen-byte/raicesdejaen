// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ✅ <-- ESTA LÍNEA FALTABA

const firebaseConfig = {
  apiKey: "AIzaSyBkRse44ya6C4UNNeV9S_xB-dqYuSeocgQ",
  authDomain: "raicesdejaenapp.firebaseapp.com",
  projectId: "raicesdejaenapp",
  storageBucket: "raicesdejaenapp.appspot.com",
  messagingSenderId: "140397680012",
  appId: "AIzaSyBkRse44ya6C4UNNeV9S_xB-dqYuSeocgQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Ya funciona correctamente

// Crea o verifica el admin automáticamente
export async function ensureAdminExists() {
  const adminEmail = 'admin@raicesdejaen.com';
  const adminPass = 'Sergiochulo';
  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPass);
    await signOut(auth);
    console.log('✅ Admin exists (signed in then out).');
  } catch (err) {
    if (err?.code === 'auth/user-not-found') {
      try {
        await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
        await signOut(auth);
        console.log('✅ Admin created and signed out.');
      } catch (e) {
        console.error('❌ Error creating admin:', e);
      }
    } else {
      console.error('⚠️ Admin check error:', err?.code || err);
    }
  }
}
