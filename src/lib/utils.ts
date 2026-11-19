import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  if (!name) return "SB";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getAppointmentPrice(app: any): number {
  if (!app) return 0;
  if (typeof app.servicePrice === "number" && app.servicePrice > 0) return app.servicePrice;
  if (typeof app.serviceId === "object" && typeof app.serviceId?.price === "number" && app.serviceId.price > 0) {
    return app.serviceId.price;
  }
  if (typeof app.price === "number" && app.price > 0) return app.price;
  return 0;
}

export function getAppointmentDate(app: any): string {
  if (!app) return "";
  const val = app.appointmentDate || app.date || "";
  return val ? String(val) : "";
}
