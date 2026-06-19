import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export async function uploadImage(path, file) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
export async function deleteImage(path) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
  return true;
}