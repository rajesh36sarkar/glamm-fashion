import { db, storage } from '../config/firebase.js';
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, limit, serverTimestamp, setDoc,
  onSnapshot, runTransaction, increment
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getCached, setCached } from '../utils/cache.js';

function handleError(error) {
  console.error("Firestore error:", error);
  throw error;
}

// ---- SETTINGS ----
export async function getSettings() {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'store'));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) { handleError(e); }
}
export async function updateSettings(data) {
  try {
    await setDoc(doc(db, 'settings', 'store'), data, { merge: true });
    return { success: true };
  } catch (e) { handleError(e); }
}

// ---- HEROES (CACHED) ----
export async function getHeroes() {
  const cached = getCached('heroes');
  if (cached) return cached;
  try {
    const q = query(collection(db, 'heroes'));
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (a.order || 0) - (b.order || 0));
    setCached('heroes', data);
    return data;
  } catch (e) { handleError(e); }
}

export async function saveHero(data, imageFile) {
  try {
    let imageUrl = data.imageUrl || '';
    if (imageFile) {
      const storageRef = ref(storage, `heroes/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    const heroData = { ...data, imageUrl, updatedAt: serverTimestamp() };
    if (data.id) {
      await updateDoc(doc(db, 'heroes', data.id), heroData);
      setCached('heroes', null);
      return { id: data.id, ...heroData };
    } else {
      const docRef = await addDoc(collection(db, 'heroes'), { ...heroData, createdAt: serverTimestamp() });
      setCached('heroes', null);
      return { id: docRef.id, ...heroData };
    }
  } catch (e) { handleError(e); }
}

export async function deleteHero(id, imageUrl) {
  try {
    if (imageUrl) {
      const ref = ref(storage, imageUrl);
      await deleteObject(ref).catch(() => {});
    }
    await deleteDoc(doc(db, 'heroes', id));
    setCached('heroes', null);
    return { success: true };
  } catch (e) { handleError(e); }
}

// ---- CATEGORIES ----
export async function getCategories() {
  const cached = getCached('categories');
  if (cached) return cached;
  try {
    const q = query(collection(db, 'categories'));
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (a.order || 0) - (b.order || 0));
    setCached('categories', data);
    return data;
  } catch (e) { handleError(e); }
}

export async function saveCategory(data, imageFile) {
  try {
    let imageUrl = data.imageUrl || '';
    if (imageFile) {
      const storageRef = ref(storage, `categories/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    const catData = { ...data, imageUrl, updatedAt: serverTimestamp() };
    if (data.id) {
      await updateDoc(doc(db, 'categories', data.id), catData);
    } else {
      await addDoc(collection(db, 'categories'), { ...catData, createdAt: serverTimestamp() });
    }
    setCached('categories', null);
    return { ...data, imageUrl };
  } catch (e) { handleError(e); }
}

export async function deleteCategory(id, imageUrl) {
  try {
    if (imageUrl) {
      const ref = ref(storage, imageUrl);
      await deleteObject(ref).catch(() => {});
    }
    await deleteDoc(doc(db, 'categories', id));
    setCached('categories', null);
    return { success: true };
  } catch (e) { handleError(e); }
}

// ---- PRODUCTS ----
export async function getProducts() {
  const cached = getCached('products');
  if (cached) return cached;
  try {
    const q = query(collection(db, 'products'));
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    setCached('products', data);
    return data;
  } catch (e) { handleError(e); }
}

export async function getProductById(id) {
  const cached = getCached(`product_${id}`);
  if (cached) return cached;
  try {
    const docSnap = await getDoc(doc(db, 'products', id));
    if (!docSnap.exists()) return null;
    const data = { id: docSnap.id, ...docSnap.data() };
    setCached(`product_${id}`, data);
    return data;
  } catch (e) { handleError(e); }
}

export async function saveProduct(data, imageFile) {
  try {
    let imageUrl = data.imageUrl || '';
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    const productData = { ...data, imageUrl, updatedAt: serverTimestamp() };
    let result;
    if (data.id) {
      await updateDoc(doc(db, 'products', data.id), productData);
      result = { id: data.id, ...productData };
    } else {
      const docRef = await addDoc(collection(db, 'products'), { ...productData, createdAt: serverTimestamp() });
      result = { id: docRef.id, ...productData };
    }
    setCached('products', null);
    setCached(`product_${result.id}`, result);
    return result;
  } catch (e) { handleError(e); }
}

export async function deleteProduct(id, imageUrl) {
  try {
    if (imageUrl) {
      const ref = ref(storage, imageUrl);
      await deleteObject(ref).catch(() => {});
    }
    await deleteDoc(doc(db, 'products', id));
    setCached('products', null);
    setCached(`product_${id}`, null);
    return { success: true };
  } catch (e) { handleError(e); }
}

// ---- ORDERS ----
export async function getOrders() {
  try {
    const q = query(collection(db, 'orders'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) { handleError(e); }
}

export async function getOrderById(id) {
  try {
    const docSnap = await getDoc(doc(db, 'orders', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (e) { handleError(e); }
}

export async function getOrdersByUser(userId) {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) { handleError(e); }
}

export async function createOrder(data) {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (e) { handleError(e); }
}

export async function updateOrder(id, data) {
  try {
    await updateDoc(doc(db, 'orders', id), { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) { handleError(e); }
}

export async function deleteOrder(id) {
  try {
    await deleteDoc(doc(db, 'orders', id));
    return { success: true };
  } catch (e) { handleError(e); }
}

// ---- CONTACTS ----
export async function getContacts() {
  try {
    const q = query(collection(db, 'contacts'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) { handleError(e); }
}

export async function createContact(data) {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...data,
      status: 'unread',
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (e) { handleError(e); }
}

export async function updateContact(id, data) {
  try {
    await updateDoc(doc(db, 'contacts', id), { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) { handleError(e); }
}

export async function deleteContact(id) {
  try {
    await deleteDoc(doc(db, 'contacts', id));
    return { success: true };
  } catch (e) { handleError(e); }
}

// ---- USERS ----
export async function getUsers() {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) { handleError(e); }
}

export async function getUserById(uid) {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? { uid: docSnap.id, ...docSnap.data() } : null;
  } catch (e) { handleError(e); }
}

export async function updateUser(uid, data) {
  try {
    await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) { handleError(e); }
}

// ---- SUBSCRIBERS ----
export async function addSubscriber(email) {
  try {
    const subscribers = collection(db, 'subscribers');
    const existing = await getDocs(query(subscribers, where('email', '==', email)));
    if (existing.empty) {
      await addDoc(subscribers, { email, createdAt: serverTimestamp() });
      return true;
    }
    return false;
  } catch (e) {
    console.error('Subscriber error:', e);
    return false;
  }
}

// ---- ANALYTICS ----
export async function trackAction(productId, action, userId = null) {
  try {
    await addDoc(collection(db, 'analytics'), {
      productId, action, userId,
      timestamp: serverTimestamp()
    });
    if (action === 'view') {
      await updateDoc(doc(db, 'products', productId), { views: increment(1) });
    } else if (action === 'like') {
      await updateDoc(doc(db, 'products', productId), { likes: increment(1) });
    }
    return { success: true };
  } catch (e) { handleError(e); }
}