import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function uploadImage(path, file) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteImage(url) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Delete image error:', error);
    return false;
  }
}

export async function uploadProductImage(file, productId = null) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `products/${productId || timestamp}/${fileName}`;
  return await uploadImage(path, file);
}

export async function uploadCategoryImage(file, categoryId = null) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `categories/${categoryId || timestamp}/${fileName}`;
  return await uploadImage(path, file);
}

export async function uploadHeroImage(file, heroId = null) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `heroes/${heroId || timestamp}/${fileName}`;
  return await uploadImage(path, file);
}