import { trackAction as track } from './firestore.js';

export function trackView(productId, userId = null) {
  track(productId, 'view', userId);
}
export function trackLike(productId, userId = null) {
  track(productId, 'like', userId);
}
export function trackCartAdd(productId, userId = null) {
  track(productId, 'cart_add', userId);
}