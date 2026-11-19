export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  phone?: string;
  image?: string;
  isBlocked?: boolean;
  createdAt: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  durationMinutes: number;
  images: string[];
  isActive: boolean;
  specialists: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  customerId: User | string;
  serviceId: Service;
  appointmentDate: string;
  date?: string;
  timeSlot: string;
  servicePrice?: number;
  price?: number;
  paymentStatus?: "unpaid" | "paid";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialist?: string;
  transactionId?: Transaction | string;
  notes?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  customerId: User | string;
  appointmentId: Appointment | string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  invoiceNumber?: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
