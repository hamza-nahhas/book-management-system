# 📚 Book Management System

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-ffca28?logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06b6d4?logo=tailwindcss&logoColor=white)
![Tanstack Query](https://img.shields.io/badge/Tanstack_Query-FF4154?logo=react-query&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-5B21B6?style=flat&logo=Zod&logoColor=white)

**Live Demo**: [View here](https://book-management-system-vqxl.vercel.app/)

A simple book management system built with:

- **Next.js** (App Router)
- **Firebase** (Authentication + Firestore)
- **React Hook Form + Zod** (type-safe forms)
- **TailwindCSS** (UI styling)
- **Tanstack Query** (React Query) (data fetching and caching)

---

## 🚀 Quick Start

1. **Clone the Repository**

```bash
git clone https://github.com/hamza-nahhas/book-management-system.git
cd book-management-system
```

2. **Install Dependencies**

```bash
pnpm install
# or
npm install
# or
yarn install
```

3. **Setup Environment Variables**

Create a `.env.local` file in the root directory and add your Firebase credentials (For both client and admin):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Run the Development Server**

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

5. **Test app with these credentials:**
```
email: admin@test.com
password: password123
```
---

## 📚 Features

- **Authentication**

  - Firebase Authentication for client-side sign-in (Email/Password).
  - API routes protected via Bearer Token Authentication using Firebase ID Tokens (JWTs).
  - Server-side verification performed with Firebase Admin SDK.

- **Books Management**

  - Full **CRUD** (Create, Read, Update, Delete) functionality
  - Each book includes a **title**, **author**, and **description**

- **Responsive UI**

  - Fully responsive and mobile-optimized
  - Built with TailwindCSS and reusable components

- **Server-Side Rendering (SSR) + SEO**

  - Pages pre-rendered for better SEO and faster load times
  - SEO-optimized book listings and details

- **Type-Safe Forms**

  - Built-in validation with **Zod**
  - Managed using **React Hook Form** for better performance

- **Data Fetching & Caching**

  - **Tanstack Query** manages API requests, caching, and background updates

- **Loading Skeletons**
  - Beautiful skeleton UI while data is loading for smoother UX
