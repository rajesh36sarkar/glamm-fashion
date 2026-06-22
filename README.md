# 💎 Glamm Fashion – Wear The Elegant

A modern, responsive, single‑page e‑commerce website for imitation jewellery, built with **vanilla JavaScript**, **Firebase**, and **Tailwind CSS**. Features include product browsing, search, cart, user authentication, admin panel, order management, and payment readiness.

---

## ✨ Features

- **User Authentication** – Email/Password + Google sign‑in
- **Product Catalog** – Dynamic product grid with category filters and live search
- **Shopping Cart** – Persistent localStorage cart with quantity controls
- **Checkout Flow** – Shipping address form, order creation, and payment method selection (PhonePe redirect / UPI QR)
- **User Dashboard** – Order history, personal info, liked items, suggested products
- **Admin Panel** – Full CRUD for products, categories, hero slides, orders, and contact messages
- **Hero Carousel** – Auto‑sliding hero section with images/videos from Firestore
- **Responsive Design** – Mobile‑first using Tailwind CSS + custom styles
- **Newsletter Subscription** – Store emails in Firestore
- **Contact Form** – Users can send messages stored in Firestore

---

## 🛠️ Tech Stack

| Layer          | Technology |
|----------------|------------|
| Frontend       | HTML5, CSS3, Tailwind CSS (CDN), Vanilla JS (ES Modules) |
| Backend        | Firebase Cloud Functions (Node.js 18) – optional |
| Database       | Firebase Firestore (NoSQL) |
| Authentication | Firebase Auth (Email/Password + Google) |
| Storage        | Firebase Storage |
| Payments       | PhonePe API (ready to integrate) |
| Delivery       | Shiprocket API (ready to integrate) |
| Hosting        | Any static host (Hostinger, Netlify, Firebase Hosting) |

---

## 📁 Project Structure

glamm-fashion/
├── index.html # Main entry (SPA)
├── assets/
│ ├── css/
│ │ ├── style.css # Custom styles + Tailwind overrides
│ │ └── admin.css # Admin panel extras
│ ├── images/ # Logo, placeholders, favicon
│ └── js/
│ ├── app.js # Entry point: preloader, router, event listeners
│ ├── components/
│ │ ├── header.js # Dynamic header with categories
│ │ ├── footer.js # Footer + newsletter form
│ │ ├── cart.js # Cart logic (localStorage, UI)
│ │ └── modal.js # Auth, product detail, admin modals
│ ├── config/
│ │ └── firebase.js # Firebase config (replace with your credentials)
│ ├── pages/
│ │ ├── home.js # Hero carousel, featured products, about snippet
│ │ ├── products.js # Product grid with category filtering
│ │ ├── product-detail.js # Single product view + related items
│ │ ├── about.js # About story, mission, stats
│ │ ├── contact.js # Contact form + info cards
│ │ ├── user-dashboard.js # User profile, orders, likes, suggestions
│ │ ├── admin.js # Admin CRUD panel
│ │ ├── checkout.js # Checkout form, order summary, payment method
│ │ └── policies.js # Privacy, shipping, return, care policies
│ ├── services/
│ │ ├── auth.js # Firebase Auth operations
│ │ ├── firestore.js # Firestore CRUD with caching
│ │ ├── storage.js # Firebase Storage helpers
│ │ ├── payment.js # PhonePe integration client
│ │ └── delivery.js # Shiprocket integration client
│ └── utils/
│ ├── router.js # Hash‑based routing
│ ├── helpers.js # formatCurrency, debounce, etc.
│ └── cache.js # In‑memory TTL cache
├── firebase.json # Firebase hosting config (optional)
└── README.md

text

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/glamm-fashion.git
cd glamm-fashion
2. Set up Firebase
Create a Firebase project at console.firebase.google.com

Enable Authentication (Email/Password + Google), Firestore, and Storage

Copy your Firebase config and paste it into assets/js/config/firebase.js

3. Upload to your host
Upload the entire folder to your Hostinger public_html (or any static host)

Ensure index.html is the entry file

4. (Optional) Deploy Cloud Functions
If you want to use PhonePe or Shiprocket:

bash
cd functions
npm install
firebase functions:config:set phonepe.merchant_id="YOUR_ID" phonepe.salt_key="YOUR_KEY" shiprocket.email="YOUR_EMAIL" shiprocket.password="YOUR_PASSWORD"
firebase deploy --only functions
5. Add sample data
Add some products, categories, and hero slides manually in Firestore (or via the admin panel).

🔐 Default Admin Role
Set a user's role field to 'admin' in the Firestore users collection to grant admin access.

📸 Screenshots
(Add screenshots of your home, products, admin, checkout pages here)

📝 License
This project is for learning and commercial portfolio purposes. Free to use and modify.

🙏 Credits
Designed & developed with ❤️ by Rajesh Kumar Sarkar
For any queries: glammfashion2024@gmail.com

🔗 Live Demo
Glamm Fashion – Live Site