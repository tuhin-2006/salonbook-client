# SalonBook — Luxury Atelier & Wellness Management Platform (Client)

A world-class, luxury salon booking and appointment management web application engineered with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**. Designed under the **SoHo Atelier** aesthetic combining architectural minimalism, high-end editorial typography, dynamic Dark/Light themes, Stripe payments, and real-time appointment diary operations.

---

## 1. Project Name and Description

- **Project Name:** SalonBook Luxury Atelier Client (`salonbook-client`)
- **Description:** SalonBook is a full-featured SaaS web platform for modern beauty salons, barbershops, and wellness sanctuaries. It provides patrons with an effortless luxury experience to discover signature treatments, book chair appointments with specialized stylists, settle invoices securely via Stripe, and download official tax receipts. For salon administrators, it offers an executive management suite for reservation diaries, service carte customization with ImgBB cloud uploads, client directory governance with instant privilege suspension (block/unblock), and financial analytics telemetry.

---

## 2. Important Features

- **SoHo Atelier Luxury Visual System:**
  - Modern Atelier aesthetic with architectural minimalism, high-contrast dark/light theme switching, and refined typography.
  - Fully responsive design engineered across mobile, tablet, laptop, and ultra-wide displays.
- **Client & Patron Directory Governance:**
  - Administrative client registry with live search and role filtering.
  - Patron Dossier inspection modal ("View User") displaying contact details, registration timestamps, and complete booking history.
  - Instant account privilege suspension ("Block User") preventing access to protected patron routes and booking privileges.
  - Account reinstatement ("Unblock User") restoring full booking and checkout capabilities.
- **Atelier Carte & Service Management:**
  - Full CRUD capabilities for salon services and treatments (exclusive to Admin).
  - Dedicated **Image Upload via ImgBB** (multipart file upload; strictly not plain text image URLs).
  - Strict validation enforcing positive pricing (`price > 0`) and positive duration (`durationMinutes > 0`).
  - Active/Inactive status toggle allowing instant archiving or publishing of treatments.
- **Interactive Reservation Diary:**
  - Real-time time slot selector with double-booking prevention.
  - Default initial status: `Pending` appointment status and `Unpaid` payment status.
  - Administrative appointment confirmation (Rule: Only `Pending` appointments can be confirmed).
  - Administrative cancellation (Rule: Both `Pending` and `Confirmed` appointments can be cancelled).
  - Appointment Dossier modal showing customer info, service specs, date & time, customer message/notes, service price, appointment status, payment status, and booking request date.
  - Chronological arrival sequence sorting (`newest first`) with ubiquitous record deletion.
- **Stripe Hosted Checkout & Digital Tax Invoices:**
  - Direct integration with Stripe Checkout Sessions featuring TLS 256-bit encryption.
  - Payment success view prominently displaying Stripe `Session ID`, `Customer Info` drawer, and `Related Service` overview card.
  - Luxury printable Tax Invoice & Receipt modal (`INV-YYYY-XXXXX`) formatted with tabular numbers and print stylesheets.
- **Meaningful Feedback & Loading States:**
  - Distinct contextual loaders throughout the application:
    - `"Fetching Services..."` when loading public treatment menus.
    - `"Fetching Service..."` when loading individual service dossiers.
    - `"Loading Dashboard Data..."` across customer and administrative telemetry views.
    - `"Creating Appointment Request..."` during chair reservation submissions.
    - `"Processing Payment..."` during Stripe session generation and verification.

---

## 3. Technology Stack

- **Framework:** Next.js 15+ (App Router, React 19)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS, `next-themes` (Dark/Light mode support)
- **UI Components & Icons:** Radix UI primitives, Lucide React, Canvas Confetti
- **HTTP Client:** Axios with dynamic baseURL resolution for local and cloud environments
- **Charts & Data Visualization:** Recharts (Revenue telemetry & Formulation distribution)
- **Notifications:** Sonner toast notifications
- **Image Hosting:** ImgBB Cloud API integration

---

## 4. Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tuhin-2006/salonbook-client.git
   cd salonbook-client
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

---

## 5. How to Run the Project Locally

- **Development Mode:**
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Production Build & Preview:**
  ```bash
  npm run build
  npm start
  ```

---

## 6. Required Environment Variables

> **Note:** Only variable names are documented below. Strictly never commit secret values or private credentials to version control.

| Environment Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (e.g., `http://localhost:5000/api/v1` or cloud production API) |
| `NEXT_PUBLIC_SERVER_BASE_URL` | Server host base URL without the `/api/v1` path prefix |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...` or `pk_live_...`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID for frontend Google Sign-In button |

---

## 7. Live Website Link

- **Live Production Application:** [https://salonbook-client-two.vercel.app](https://salonbook-client-two.vercel.app)
- **Live Backend API Endpoint:** [https://salonbook-server-omega.vercel.app/api/v1](https://salonbook-server-omega.vercel.app/api/v1)

---

## 8. Client and Server Repository Links

- **Client Repository:** [https://github.com/tuhin-2006/salonbook-client](https://github.com/tuhin-2006/salonbook-client)
- **Server Repository:** [https://github.com/tuhin-2006/salonbook-server](https://github.com/tuhin-2006/salonbook-server)
