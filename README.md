# SalonBook — Luxury Salon Booking SaaS (Client)

A modern, editorial, luxury salon booking web application built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**.

## Design Philosophy

- **Editorial Luxury:** Inspired by top-tier wellness platforms like Fresha, Booksy, and Vagaro.
- **Warm Aesthetic:** Ivory and pearl surfaces, deep charcoal typography, muted terracotta accents, and subtle gold highlights.
- **Micro-Interactions:** Smooth transitions powered by Motion for React.
- **Responsive & Accessible:** Fully mobile-first design with Radix UI and shadcn/ui primitives.

## Technology Stack

- **Framework:** Next.js (App Router, React 19)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS, next-themes
- **UI Components:** shadcn/ui, Radix UI, Lucide React
- **Forms & Validation:** React Hook Form, Zod
- **Data Fetching & State:** TanStack Query (React Query)
- **Data Tables:** TanStack Table
- **Charts & Analytics:** Recharts
- **Animations:** Motion for React (Framer Motion)
- **Notifications:** Sonner
- **Date Handling:** date-fns

## Key Features

- **Public Experience:** Editorial Hero, Featured Services showcase, Value propositions, Customer testimonials.
- **Service Catalog:** Real-time search, category tabs, price sorting (asc/desc), duration filter.
- **Protected Service Details:** High-res imagery, service breakdowns, direct appointment booking flow.
- **Appointment Booking:** Real-time slot availability, multi-step booking, Stripe checkout integration.
- **Customer Portal:** Booking history, cancellation handling, payment receipts, profile & avatar management.
- **Admin Portal:** Recharts revenue & booking analytics, full Service CRUD, User management (block/unblock), appointment status management.

## Getting Started

### Prerequisites
- Node.js >= 18
- Running `salonbook-server` instance

### Installation

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.
