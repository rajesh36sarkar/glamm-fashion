import { auth, db } from '../config/firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function signUp(firstName, lastName, email, phone, password) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    await setDoc(doc(db, 'users', uid), {
      firstName, lastName, email, phone,
      role: 'user',
      createdAt: serverTimestamp()
    });
    return { success: true, user: userCred.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function signIn(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCred.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCred = await signInWithPopup(auth, provider);
    const user = userCred.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email,
        phone: user.phoneNumber || '',
        role: 'user',
        createdAt: serverTimestamp()
      });
    }
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function signOutUser() {
  await signOut(auth);
}

export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}