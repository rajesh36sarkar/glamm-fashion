import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload an image file to Firebase Storage
 * @param {string} path - Storage path (e.g., 'products/123.jpg')
 * @param {File} file - The image file
 * @returns {Promise<string>} Download URL
 */
export async function uploadImage(path, file) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Delete an image from Firebase Storage
 * @param {string} url - Full download URL (or path)
 * @returns {Promise<boolean>}
 */
export async function deleteImage(url) {
  try {
    // Extract path from URL (if full URL is passed)
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Delete image error:', error);
    return false;
  }
}

/**
 * Upload a product image with automatic naming
 * @param {File} file - Image file
 * @param {string} productId - Optional product ID
 * @returns {Promise<string>} Download URL
 */
export async function uploadProductImage(file, productId = null) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `products/${productId || timestamp}/${fileName}`;
  return await uploadImage(path, file);
}

/**
 * Upload a category image
 */
export async function uploadCategoryImage(file, categoryId = null) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `categories/${categoryId || timestamp}/${fileName}`;
  return await uploadImage(path, file);
}

/**
 * Upload a hero slide image
 */
export async function uploadHeroImage(file, heroId = null) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `heroes/${heroId || timestamp}/${fileName}`;
  return await uploadImage(path, file);
}