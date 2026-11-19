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
  // 1. Check direct servicePrice
  const sp = Number(app.servicePrice);
  if (!isNaN(sp) && sp > 0) return sp;

  // 2. Check populated serviceId object
  if (typeof app.serviceId === "object" && app.serviceId !== null) {
    const sPrice = Number(app.serviceId.price);
    if (!isNaN(sPrice) && sPrice > 0) return sPrice;
  }

  // 3. Check direct price field or virtual
  const p = Number(app.price);
  if (!isNaN(p) && p > 0) return p;

  // 4. Check nested service object
  if (typeof app.service === "object" && app.service !== null) {
    const s2 = Number(app.service.price);
    if (!isNaN(s2) && s2 > 0) return s2;
  }

  return 0;
}

export function getAppointmentDate(app: any): string {
  if (!app) return "";
  const val = app.appointmentDate || app.date || "";
  return val ? String(val) : "";
}
